import assert from "node:assert/strict";
import test from "node:test";

import {loadTokenAttacher, waitFor} from "./helpers/load-token-attacher.mjs";

function fakeActionElement() {
	const attributes = new Map();
	return {
		attributes,
		dataset: {},
		disabled: false,
		removeAttribute: name => attributes.delete(name),
		setAttribute: (name, value) => attributes.set(name, value)
	};
}

test("runAction reports sync and async failures exactly once and always clears busy state", async () => {
	const {TokenAttacher, consoleCalls, notificationCalls} = await loadTokenAttacher();

	for(const callback of [
		() => { throw new Error("synchronous failure"); },
		async () => { throw new Error("asynchronous failure"); }
	]) {
		const element = fakeActionElement();
		const result = await TokenAttacher.runAction("test.action", callback, {element});

		assert.equal(result.status, "error");
		assert.equal(element.disabled, false);
		assert.equal(element.dataset.tokenAttacherBusy, undefined);
		assert.equal(element.attributes.has("aria-busy"), false);
	}

	assert.equal(consoleCalls.error.length, 2, "each failure should emit one structured diagnostic");
	assert.equal(notificationCalls.error.length, 2, "each failure should emit one visible error");
});

test("runAction exposes busy state during success and restores the element afterward", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	const element = fakeActionElement();

	const result = await TokenAttacher.runAction("test.action", () => {
		assert.equal(element.dataset.tokenAttacherBusy, "true");
		assert.equal(element.disabled, true);
		assert.equal(element.attributes.get("aria-busy"), "true");
		return 42;
	}, {element});

	assert.equal(result, 42);
	assert.equal(element.disabled, false);
	assert.equal(element.dataset.tokenAttacherBusy, undefined);
	assert.equal(element.attributes.has("aria-busy"), false);
});

test("runAction gives an unnotified no-op a complete fallback explanation", async () => {
	const {TokenAttacher, notificationCalls} = await loadTokenAttacher();

	const result = await TokenAttacher.runAction("test.action", async () => ({status: "noop"}));

	assert.equal(result.status, "noop");
	assert.equal(notificationCalls.warn.length, 1);
	assert.match(notificationCalls.warn[0], /NoChangesMade/);
	assert.doesNotMatch(notificationCalls.warn[0], /\{message\}/);
});

test("automatic world migration runs on only the first active GM globally", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const current = context.game.user;
	current.active = true;
	current.viewedScene = "scene-b";
	const other = {id: "gm-a", _id: "gm-a", isGM: true, active: true, viewedScene: "scene-a"};
	context.game.users = Object.assign([other, current], {find: Array.prototype.find});
	let migrations = 0;
	TokenAttacher.startMigration = async () => { migrations += 1; };
	TokenAttacher.registerHooks();

	context.Hooks.call("ready");
	await new Promise(resolve => setTimeout(resolve, 0));
	assert.equal(migrations, 0, "a GM who is first only within their Scene must not run a world migration");

	context.game.users = Object.assign([current, other], {find: Array.prototype.find});
	context.Hooks.call("ready");
	await waitFor(() => migrations === 1);
	assert.equal(migrations, 1);
});

test("socket work remains FIFO and continues after sync and async handler failures", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const order = [];
	context.window.tokenAttacher.listenQueue = {queue: [], running: false};
	TokenAttacher.isFirstActiveGM = () => true;
	context.canvas.scene.getEmbeddedDocument = (_type, id) => id;
	TokenAttacher._AttachToToken = label => {
		order.push(`start:${label}`);
		if(label === "sync-failure") throw new Error("sync failure");
		if(label === "async-failure") {
			return new Promise((resolve, reject) => setTimeout(() => reject(new Error("async failure")), 10));
		}
		order.push(`end:${label}`);
	};

	const sceneId = context.canvas.scene.id;
	TokenAttacher.listen({event: "AttachToToken", eventdata: ["sync-failure"], sceneId});
	TokenAttacher.listen({event: "AttachToToken", eventdata: ["async-failure"], sceneId});
	TokenAttacher.listen({event: "AttachToToken", eventdata: ["second"], sceneId});
	TokenAttacher.listen({event: "AttachToToken", eventdata: ["third"], sceneId});

	await waitFor(() => order.includes("end:third") && context.window.tokenAttacher.listenQueue.queue.length === 0);
	assert.deepEqual(order, [
		"start:sync-failure",
		"start:async-failure",
		"start:second",
		"end:second",
		"start:third",
		"end:third"
	]);
	assert.equal(context.window.tokenAttacher.listenQueue.running, false);
	assert.equal(consoleCalls.error.length, 2, "each failed socket event should emit one diagnostic");
	assert.equal(notificationCalls.error.length, 2, "each failed socket event should emit one visible error");
});

test("a synchronous socket send failure clears its pending request and reports exactly one error", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const timer = {};
	let clearedTimer = null;
	context.setTimeout = () => timer;
	context.clearTimeout = value => { clearedTimer = value; };
	context.game.socket.emit = () => { throw new Error("socket unavailable"); };

	const result = await TokenAttacher.emitSocketAction("AttachToToken", ["base", {}]);

	assert.equal(result.status, "error");
	assert.equal(clearedTimer, timer, "the acknowledgement timeout must be cancelled");
	assert.equal(context.window.tokenAttacher.pendingSocketRequests.size, 0);
	assert.equal(consoleCalls.error.length, 1, "the failed send should emit one diagnostic");
	assert.equal(notificationCalls.error.length, 1, "the failed send should emit one visible error");
});

test("every public attachment mutation sends the originating Scene explicitly", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const originScene = {
		id: "origin-scene",
		updateEmbeddedDocuments: async () => []
	};
	const baseDocument = {_id: "base", parent: originScene};
	const childDocument = {_id: "child", parent: originScene};
	const base = {document: baseDocument, layer: {constructor: {documentName: "Token"}}};
	const child = {document: childDocument, layer: {constructor: {documentName: "Tile"}}};
	const emitted = [];
	context.game.scenes.get = id => id === originScene.id ? originScene : context.canvas.scene;
	TokenAttacher.isFirstActiveGM = () => false;
	TokenAttacher.emitSocketAction = async (event, eventdata, options) => {
		emitted.push({event, eventdata, options});
		return {status: "success"};
	};

	await TokenAttacher.attachElementToToken(child, base, true);
	await TokenAttacher.attachElementsToToken([child], base, true);
	await TokenAttacher.detachElementFromToken(child, base, true);
	await TokenAttacher.detachElementsFromToken([child], base, true);
	await TokenAttacher.detachAllElementsFromToken(base, true);
	await TokenAttacher.setElementsLockStatus([child], false, true);
	await TokenAttacher.setElementsMoveConstrainedStatus([child], true, true);

	assert.deepEqual(Array.from(emitted, call => call.event), [
		"AttachToToken",
		"attachElementsToToken",
		"DetachFromToken",
		"detachElementsFromToken",
		"DetachFromToken",
		"setElementsLockStatus",
		"setElementsMoveConstrainedStatus"
	]);
	assert.ok(emitted.every(call => call.options.sceneId === originScene.id));
});

test("GM socket dispatch resolves and writes lock and constrain changes only in the declared Scene", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const originUpdates = [];
	const canvasUpdates = [];
	const child = {
		_id: "tile-1",
		flags: {"token-attacher": {parent: "base"}},
		getFlag: (_scope, key) => key === "unlocked" ? false : undefined
	};
	const originScene = {
		id: "origin-scene",
		getEmbeddedDocument: (type, id) => type === "Tile" && id === child._id ? child : null,
		updateEmbeddedDocuments: async (type, updates, options) => {
			originUpdates.push({type, updates, options});
			return updates;
		}
	};
	child.parent = originScene;
	context.game.scenes.get = id => id === originScene.id ? originScene : undefined;
	context.canvas.scene.updateEmbeddedDocuments = async (...args) => canvasUpdates.push(args);

	await TokenAttacher._dispatchSocketMessage({
		event: "setElementsLockStatus",
		eventdata: [{Tile: [child._id]}, false, true],
		sceneId: originScene.id
	});
	await TokenAttacher._dispatchSocketMessage({
		event: "setElementsMoveConstrainedStatus",
		eventdata: [{Tile: [child._id]}, true, true, {type: "TOKEN_CONSTRAINED"}],
		sceneId: originScene.id
	});

	assert.deepEqual(Array.from(originUpdates, update => update.type), ["Tile", "Tile"]);
	assert.equal(canvasUpdates.length, 0, "the active canvas Scene must never receive another Scene's socket writes");
});

test("scene-less socket mutations are visibly rejected and acknowledged as failures", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const emitted = [];
	context.game.socket.emit = (_channel, message) => emitted.push(message);
	context.window.tokenAttacher.listenQueue = {queue: [], running: false};

	TokenAttacher.listen({
		event: "setElementsLockStatus",
		eventdata: [{Tile: ["tile-1"]}, true, true],
		requestId: "request-1",
		requesterId: "requester-1"
	});

	await waitFor(() => emitted.some(message => message.event === "__result"));
	const result = emitted.find(message => message.event === "__result");
	assert.equal(result.ok, false);
	assert.match(result.error.message, /did not identify an originating Scene/);
	assert.equal(notificationCalls.error.length, 1, "the handling GM must see the rejected mutation");
});

test("socket dispatch rejects a document that resolves outside the declared Scene", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const otherScene = {id: "other-scene", updateEmbeddedDocuments: async () => []};
	const token = {
		_id: "base-1",
		documentName: "Token",
		parent: otherScene
	};
	const declaredScene = {
		id: "declared-scene",
		getEmbeddedDocument: (type, id) => type === "Token" && id === token._id ? token : null,
		updateEmbeddedDocuments: async () => []
	};
	context.game.scenes.get = id => id === declaredScene.id ? declaredScene : undefined;

	await assert.rejects(
		TokenAttacher._dispatchSocketMessage({
			event: "AttachToToken",
			eventdata: [token._id, {type: "Tile", ids: []}, true],
			sceneId: declaredScene.id
		}),
		/resolved to Scene other-scene, not declared-scene/
	);
});

test("delete and undo relays retain their document Scene after the canvas switches", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const originScene = {id: "origin-scene", updateEmbeddedDocuments: async () => []};
	const document = {
		_id: "tile-1",
		parent: originScene,
		flags: {"token-attacher": {parent: "base-1"}}
	};
	const emitted = [];
	context.game.scenes.get = id => id === originScene.id ? originScene : undefined;
	TokenAttacher.isFirstActiveGM = () => false;
	TokenAttacher.emitSocketAction = async (event, eventdata, options) => {
		emitted.push({event, eventdata, options});
		return {status: "success"};
	};

	await TokenAttacher.DetachAfterDelete("Tile", document, {}, context.game.userId);
	await TokenAttacher.ReattachAfterUndo("Tile", document, {isUndo: true}, context.game.userId);

	assert.deepEqual(Array.from(emitted, call => call.event), ["DetachFromToken", "ReattachAfterUndo"]);
	assert.ok(emitted.every(call => call.options.sceneId === originScene.id));
	assert.equal(emitted[1].eventdata[1], document._id, "undo relays should send an ID, not a stale Document object");

	let localDetachArgs;
	TokenAttacher.isFirstActiveGM = () => true;
	TokenAttacher._DetachFromToken = async (...args) => {
		localDetachArgs = args;
		return {status: "success"};
	};
	await TokenAttacher.DetachAfterDelete("Tile", document, {}, context.game.userId);
	assert.equal(localDetachArgs[3].scene, originScene);
	assert.equal(localDetachArgs[3].strictScene, true);
	assert.equal(localDetachArgs[3].skip_update, true, "delete cleanup must merge scene binding into its options argument");
});

test("create-placeable socket dispatch awaits post-processing in its declared Scene", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const originScene = {id: "origin-scene"};
	context.game.scenes.get = id => id === originScene.id ? originScene : undefined;
	let release;
	let settled = false;
	TokenAttacher.batchPostProcess = async scene => {
		assert.equal(scene, originScene);
		await new Promise(resolve => { release = resolve; });
		return {status: "success", changed: 2};
	};

	const dispatched = TokenAttacher._dispatchSocketMessage({
		event: "createPlaceableObjects",
		eventdata: [{Tile: []}, {}, context.game.userId],
		sceneId: originScene.id
	}).then(result => {
		settled = true;
		return result;
	});
	await Promise.resolve();
	assert.equal(settled, false, "socket success must wait for link rewriting to finish");
	release();
	assert.deepEqual(await dispatched, {status: "success", changed: 2});
});

test("paste with no copied data does not duplicate undefined and visibly explains the no-op", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const duplicatedValues = [];
	let saveCalls = 0;
	let regenerateCalls = 0;
	context.game.user.getFlag = () => undefined;
	context.foundry.utils.duplicate = value => {
		duplicatedValues.push(value);
		return value === undefined ? undefined : structuredClone(value);
	};
	TokenAttacher.saveBasePositon = async () => { saveCalls += 1; };
	TokenAttacher.regenerateAttachedFromPrototype = async () => { regenerateCalls += 1; };

	await TokenAttacher.pasteAttached({document: {_id: "base"}, layer: {constructor: {documentName: "Token"}}});

	assert.equal(duplicatedValues.includes(undefined), false, "duplicate must not receive undefined");
	assert.equal(saveCalls, 0, "missing copy data must not begin a paste");
	assert.equal(regenerateCalls, 0, "missing copy data must not regenerate documents");
	assert.ok(
		notificationCalls.warn.length + notificationCalls.error.length > 0,
		"the user should receive a warning or error"
	);
});

test("paste with malformed copied data is contained and visibly reported", async () => {
	const {TokenAttacher, context, localizedStrings, notificationCalls} = await loadTokenAttacher();
	let saveCalls = 0;
	let regenerateCalls = 0;
	context.game.user.getFlag = () => ({grid: null, map: null});
	TokenAttacher.saveBasePositon = async () => { saveCalls += 1; };
	TokenAttacher.regenerateAttachedFromPrototype = async () => { regenerateCalls += 1; };
	const token = {document: {_id: "base"}, layer: {constructor: {documentName: "Token"}}};

	await TokenAttacher.runAction(localizedStrings.button.paste, () => TokenAttacher.pasteAttached(token));

	assert.equal(saveCalls, 0, "malformed copy data must not begin a paste");
	assert.equal(regenerateCalls, 0, "malformed copy data must not regenerate documents");
	assert.ok(
		notificationCalls.warn.length + notificationCalls.error.length > 0,
		"the user should receive a warning or error"
	);
});

test("attach refuses to overwrite a child's relationship to another base and visibly explains the no-op", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const sceneUpdates = [];
	let saveCalls = 0;
	const child = {
		_id: "tile-1",
		id: "tile-1",
		getFlag: (_scope, key) => key === "parent" ? "base-b" : undefined,
		flags: {"token-attacher": {parent: "base-b", offset: {x: 10}}}
	};
	const scene = {
		...context.canvas.scene,
		getEmbeddedDocument: (type, id) => type === "Tile" && id === child.id ? child : null,
		updateEmbeddedDocuments: async (type, updates) => sceneUpdates.push({type, updates})
	};
	const tokenDocument = {
		_id: "base-a",
		documentName: "Token",
		parent: scene,
		getFlag: (_scope, key) => {
			if(key === "attached.Tile") return [];
			if(key === "attached") return {};
			return undefined;
		}
	};
	const token = {document: tokenDocument, layer: {constructor: {documentName: "Token"}}};
	TokenAttacher.saveBasePositon = async () => { saveCalls += 1; };

	const result = await TokenAttacher._AttachToToken(token, {type: "Tile", ids: [child.id]});

	assert.equal(result.status, "noop");
	assert.equal(result.notified, true);
	assert.equal(notificationCalls.warn.length, 1, "the user should be told that the child belongs to another base");
	assert.equal(notificationCalls.info.length, 0, "the blocked attach must not report success");
	assert.equal(saveCalls, 0, "a blocked attach must not begin mutating the target base");
	assert.equal(sceneUpdates.length, 0, "a blocked attach must not overwrite the child document");
	assert.equal(child.getFlag("token-attacher", "parent"), "base-b");
});

test("multi-type attach batches every update through the target document's parent Scene", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const targetSceneCalls = [];
	const canvasSceneCalls = [];
	const targetScene = {
		id: "target-scene",
		updateEmbeddedDocuments: async (type, updates, options) => {
			targetSceneCalls.push({type, updates, options});
			return updates;
		}
	};
	context.canvas.scene.updateEmbeddedDocuments = async (type, updates, options) => {
		canvasSceneCalls.push({type, updates, options});
		return updates;
	};
	const targetDocument = {_id: "base-a", documentName: "Token", parent: targetScene};
	const target = {document: targetDocument, layer: {constructor: {documentName: "Token"}}};
	const delegatedScenes = [];
	TokenAttacher._AttachToToken = async (_target, elements, _suppress, returnData, options) => {
		delegatedScenes.push(options.scene);
		assert.equal(returnData, true);
		return {
			Token: [{_id: targetDocument._id, [`flags.token-attacher.attached.${elements.type}`]: elements.ids}],
			[elements.type]: elements.ids.map(_id => ({_id}))
		};
	};

	const result = await TokenAttacher._attachElementsToToken(
		{Tile: ["tile-1"], Drawing: ["drawing-1"]},
		target,
		true
	);

	assert.equal(result.status, "success");
	assert.deepEqual(Array.from(delegatedScenes), [targetScene, targetScene]);
	assert.equal(canvasSceneCalls.length, 0, "the currently viewed Scene must not receive another Scene's updates");
	assert.deepEqual(Array.from(targetSceneCalls, call => call.type), ["Token", "Tile", "Drawing"]);
	assert.ok(targetSceneCalls.every(call => call.options?.["token-attacher"]?.update === true));
});

test("detach only updates requested IDs that are actually attached and preserves unrelated Token Attacher flags", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	const embeddedUpdates = [];
	const setFlags = [];
	const tokenDocument = {
		_id: "base",
		getFlag: (_scope, key) => key === "attached.Tile" ? ["owned", "other"] : undefined,
		setFlag: async (_scope, key, value) => setFlags.push({key, value})
	};
	TokenAttacher.normalizeDocumentType = type => type;
	TokenAttacher.isV14 = () => false;
	TokenAttacher.getElementDocument = (_type, id) => ({
		_id: id,
		getFlag: (_scope, key) => key === "parent" ? "base" : undefined
	});
	TokenAttacher.updateEmbeddedDocuments = async (type, updates) => embeddedUpdates.push({type, updates});

	await TokenAttacher._DetachFromToken(
		{document: tokenDocument},
		{type: "Tile", ids: ["foreign", "owned"]},
		true
	);

	assert.equal(embeddedUpdates.length, 1);
	assert.equal(embeddedUpdates[0].type, "Tile");
	assert.deepEqual(Array.from(embeddedUpdates[0].updates, update => update._id), ["owned"]);
	const update = embeddedUpdates[0].updates[0];
	assert.equal(Object.hasOwn(update, "flags.-=token-attacher"), false, "the module namespace must not be deleted");
	assert.equal(Object.hasOwn(update, "flags.token-attacher"), false, "the module namespace must not be replaced");
	assert.ok(
		Object.keys(update).some(key => /\.(?:parent|offset|unlocked|canMoveConstrained)$/.test(key)),
		"only relationship fields should be removed"
	);
	assert.equal(setFlags.length, 1);
	assert.equal(setFlags[0].key, "attached.Tile");
	assert.deepEqual(Array.from(setFlags[0].value), ["other"]);
});

test("a stale base attachment list cannot detach a Region that now belongs to another base", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	const embeddedUpdates = [];
	const setFlags = [];
	const region = {
		_id: "region-1",
		id: "region-1",
		_source: {attachment: {token: "base-b"}},
		attachment: {token: {id: "base-b"}},
		getFlag: (_scope, key) => key === "parent" ? "base-b" : undefined
	};
	const tokenDocument = {
		_id: "base-a",
		getFlag: (_scope, key) => key === "attached.Region" ? ["region-1"] : undefined,
		setFlag: async (_scope, key, value) => setFlags.push({key, value})
	};
	TokenAttacher.normalizeDocumentType = type => type;
	TokenAttacher.isV14 = () => true;
	TokenAttacher.getElementDocument = (_type, id) => id === region.id ? region : null;
	TokenAttacher.layerGetElement = (_type, id) => id === region.id ? {document: region} : null;
	TokenAttacher.updateEmbeddedDocuments = async (type, updates) => embeddedUpdates.push({type, updates});

	await TokenAttacher._DetachFromToken(
		{document: tokenDocument},
		{type: "Region", ids: [region.id]},
		true
	);

	assert.equal(embeddedUpdates.length, 0, "the other base's relationship and native attachment must be preserved");
	assert.equal(setFlags.length, 1, "the stale ID should still be removed from base A's list");
	assert.equal(setFlags[0].key, "attached.Region");
	assert.deepEqual(Array.from(setFlags[0].value), []);
});

test("locking a v14 light or sound with no controlIcon never throws", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	for(const type of ["AmbientLight", "AmbientSound"]) {
		const element = {controlIcon: null, eventMode: "static", interactive: true};
		assert.doesNotThrow(() => TokenAttacher.lockElement(type, element, false));
	}
});

test("canvas teardown closes the palette and clears Quick Edit runtime state", async t => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	if(typeof TokenAttacher.handleCanvasTearDown !== "function") {
		t.skip("production does not expose handleCanvasTearDown yet");
		return;
	}

	let closed = 0;
	TokenAttacher.isAttachmentUIOpen = () => true;
	TokenAttacher.closeTokenAttacherUI = async () => { closed += 1; };
	context.window.tokenAttacher.quickEdit = {scene: "scene-1", timer: null, elements: {}, bases: {}};
	await TokenAttacher.handleCanvasTearDown(context.canvas);

	assert.equal(closed, 1);
	assert.equal(context.window.tokenAttacher.quickEdit, undefined);
});

test("failed palette construction removes its partial DOM and scene flag", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let attachBase;
	let unsetCalls = 0;
	let palette = null;
	const scene = context.canvas.scene;
	const hud = {
		insertAdjacentHTML: () => {
			palette = {
				dataset: {},
				querySelector: () => null,
				remove: () => { palette = null; }
			};
		}
	};
	context.document.getElementById = id => {
		if(id === "hud") return hud;
		if(id === "tokenAttacher") return palette;
		return null;
	};
	context.foundry.applications.handlebars.renderTemplate = async () => "<div id=\"tokenAttacher\"></div>";
	scene.setFlag = async (_scope, key, value) => {
		if(key === "attach_base") attachBase = value;
	};
	scene.unsetFlag = async (_scope, key) => {
		if(key === "attach_base") attachBase = undefined;
		unsetCalls += 1;
	};
	const token = {
		layer: {constructor: {documentName: "Token"}},
		document: {_id: "base-1", name: "Base", texture: {src: "base.png"}}
	};

	await assert.rejects(TokenAttacher.showTokenAttacherUI(token), /Missing Token Attacher control/);

	assert.equal(attachBase, undefined, "a failed palette must not leave attach_base behind");
	assert.equal(unsetCalls, 1);
	assert.equal(palette, null, "partially inserted palette DOM must be removed");
});

test("palette dataset and scene flag must identify the same base before movement is authorized", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const attachmentUI = {
		dataset: {sceneId: context.canvas.scene.id, baseType: "Token", baseId: "base-a"}
	};
	let sceneBase = {type: "Token", element: "base-b"};
	context.document.getElementById = id => id === "tokenAttacher" ? attachmentUI : null;
	context.canvas.scene.getFlag = (_scope, key) => key === "attach_base" ? sceneBase : undefined;
	TokenAttacher.layerGetElement = (_type, id) => ({document: {_id: id}});

	assert.equal(TokenAttacher.isCurrentAttachUITarget("base-b"), false, "a scene-flag-only target is stale");
	assert.equal(TokenAttacher.isCurrentAttachUITarget("base-a"), false, "a dataset-only target is stale");

	sceneBase = {type: "Token", element: "base-a"};
	assert.equal(TokenAttacher.isCurrentAttachUITarget("base-a"), true, "matching live state should be authorized");
});

test("Quick Edit repairs active runtime state when its overlay is missing", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let overlay = null;
	const pause = {
		insertAdjacentHTML: () => {
			overlay = {remove: () => { overlay = null; }};
		}
	};
	context.document.getElementById = id => {
		if(id === "pause") return pause;
		if(id === "tokenAttacherQuickEdit") return overlay;
		return null;
	};
	context.foundry.applications.handlebars.renderTemplate = async () => "<figure id=\"tokenAttacherQuickEdit\"></figure>";
	context.window.tokenAttacher.quickEdit = {
		scene: context.canvas.scene.id,
		timer: null,
		elements: {},
		bases: {}
	};

	await TokenAttacher.setQuickEditMode(true);

	assert.equal(
		Boolean(context.window.tokenAttacher.quickEdit),
		Boolean(overlay),
		"Quick Edit runtime state and its visual indicator must agree"
	);
});

test("rectangle selection explicitly restores the token select tool when the helper is exposed", async t => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	if(typeof TokenAttacher.activateTokenSelectTool !== "function") {
		t.skip("production does not expose activateTokenSelectTool yet");
		return;
	}

	const calls = [];
	context.ui.controls.activate = async options => calls.push(options);
	await TokenAttacher.activateTokenSelectTool();
	assert.equal(calls.length, 1);
	assert.equal(calls[0].control, "tokens");
	assert.equal(calls[0].tool, "select");
});

test("folder imports reject missing and cyclic parents without creating any documents", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let folderCreates = 0;
	let actorCreates = 0;
	context.Folder = {create: async () => { folderCreates += 1; }};
	context.Actor = {create: async () => { actorCreates += 1; }};
	const settle = promise => Promise.race([
		promise.then(value => ({status: "fulfilled", value}), error => ({status: "rejected", error})),
		new Promise(resolve => setTimeout(() => resolve({status: "timeout"}), 100))
	]);

	for(const folder of [
		{child: {_id: "child", name: "Child", folder: "missing"}},
		{
			a: {_id: "a", name: "A", folder: "b"},
			b: {_id: "b", name: "B", folder: "a"}
		}
	]) {
		const result = await settle(TokenAttacher.importFromJSONWithFolders({folder, actors: []}));
		assert.equal(result.status, "rejected", "an invalid graph must reject instead of waiting forever");
	}

	assert.equal(folderCreates, 0, "invalid folder graphs must be rejected before folder creation");
	assert.equal(actorCreates, 0, "invalid folder graphs must be rejected before actor creation");
});

test("compendium folder validation happens before compendium creation", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let compendiumCreates = 0;
	let folderCreates = 0;
	context.CompendiumCollection = {
		createCompendium: async () => {
			compendiumCreates += 1;
			return {collection: "world.invalid", documentClass: {create: async () => []}};
		}
	};
	context.Folder = {create: async () => { folderCreates += 1; }};
	const imported = {
		compendium: {name: "invalid", label: "Invalid"},
		actors: [],
		compendiumFolders: {
			a: {_id: "a", name: "A", folder: "b"},
			b: {_id: "b", name: "B", folder: "a"}
		}
	};

	await assert.rejects(TokenAttacher.importFromJSONWithCompendium(imported));
	assert.equal(compendiumCreates, 0, "a malformed graph must not leave an empty compendium behind");
	assert.equal(folderCreates, 0);
});

test("valid out-of-order folder imports create parents before children", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const creates = [];
	context.Folder = {
		create: async data => {
			creates.push({kind: "folder", ...data});
			return {_id: `new-${data.name.toLowerCase()}`};
		}
	};
	context.Actor = {
		create: async data => {
			creates.push({kind: "actor", ...data});
			return data;
		}
	};
	context.game.documentTypes = {Actor: ["npc"]};
	const imported = {
		folder: {
			child: {_id: "child", name: "Child", folder: "root"},
			root: {_id: "root", name: "Root", folder: null}
		},
		actors: [{name: "Imported Actor", folder: "child"}]
	};

	await TokenAttacher.importFromJSONWithFolders(imported);
	assert.deepEqual(Array.from(creates, entry => entry.kind), ["folder", "folder", "actor"]);
	assert.equal(creates[0].name, "Root");
	assert.equal(creates[0].folder, null);
	assert.equal(creates[1].name, "Child");
	assert.equal(creates[1].folder, "new-root");
	assert.equal(creates[2].folder, "new-child");
});

test("actor migration awaits asynchronous prototype migration before updating", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	const order = [];
	let resolveMigration;
	TokenAttacher.migratePrototype = async () => {
		order.push("migration:start");
		await new Promise(resolve => { resolveMigration = resolve; });
		order.push("migration:end");
		return {_id: "migrated-prototype"};
	};
	const actor = {
		prototypeToken: {flags: {"token-attacher": {prototypeAttached: {Token: []}}}},
		update: async update => {
			order.push("actor:update");
			assert.equal(update.prototypeToken._id, "migrated-prototype");
		}
	};

	const migration = TokenAttacher.migrateElementsOfActor(actor, () => undefined, ["Token"], false);
	await Promise.resolve();
	assert.deepEqual(order, ["migration:start"]);
	resolveMigration();
	await migration;
	assert.deepEqual(order, ["migration:start", "migration:end", "actor:update"]);
});

test("model-2 recursive migration allocates unique base IDs across sibling subtrees", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	TokenAttacher.getElementOffset = () => ({calculated: true});
	const leaf = id => ({
		_id: id,
		x: 0,
		y: 0,
		rotation: 0,
		flags: {"token-attacher": {}}
	});
	const nestedBase = (id, child) => ({
		_id: id,
		x: 0,
		y: 0,
		rotation: 0,
		flags: {
			"token-attacher": {
				pos: {base_id: `old-${id}`, xy: {x: 0, y: 0}},
				prototypeAttached: {Drawing: {objs: [child]}}
			}
		}
	});
	const root = {
		_id: "root",
		x: 0,
		y: 0,
		rotation: 0,
		flags: {
			"token-attacher": {
				pos: {base_id: "old-root", xy: {x: 0, y: 0}},
				prototypeAttached: {
					Tile: {objs: [nestedBase("base-a", leaf("leaf-a")), nestedBase("base-b", leaf("leaf-b"))]}
				}
			}
		}
	};

	const migrated = await TokenAttacher.migrateElement(null, null, root, "Token");
	const [baseA, baseB] = migrated.flags["token-attacher"].prototypeAttached.Tile;
	const [leafA] = baseA.flags["token-attacher"].prototypeAttached.Drawing;
	const [leafB] = baseB.flags["token-attacher"].prototypeAttached.Drawing;
	const baseIds = [
		migrated.flags["token-attacher"].pos.base_id,
		baseA.flags["token-attacher"].pos.base_id,
		baseB.flags["token-attacher"].pos.base_id
	];

	assert.deepEqual(baseIds, [1, 2, 3]);
	assert.equal(new Set(baseIds).size, baseIds.length, "every base in the complete tree must receive a unique ID");
	assert.equal(baseA.flags["token-attacher"].parent, 1);
	assert.equal(baseB.flags["token-attacher"].parent, 1);
	assert.equal(leafA.flags["token-attacher"].parent, 2);
	assert.equal(leafB.flags["token-attacher"].parent, 3);
});

test("prototype migration awaits async callbacks in deterministic recursive order", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	const leaf = {_id: "leaf", flags: {"token-attacher": {}}};
	const childA = {
		_id: "child-a",
		flags: {"token-attacher": {prototypeAttached: {Drawing: [leaf]}}}
	};
	const childB = {_id: "child-b", flags: {"token-attacher": {}}};
	const prototype = {
		_id: "root",
		flags: {"token-attacher": {prototypeAttached: {Tile: [childA, childB]}}}
	};
	const order = [];

	const migrated = await TokenAttacher.migratePrototype(
		prototype,
		async (element, type) => {
			order.push(`start:${type}:${element._id}`);
			await Promise.resolve();
			element.migrated = true;
			order.push(`end:${type}:${element._id}`);
		},
		["Token", "Tile", "Drawing"],
		false
	);

	assert.deepEqual(order, [
		"start:Token:root", "end:Token:root",
		"start:Tile:child-a", "end:Tile:child-a",
		"start:Drawing:leaf", "end:Drawing:leaf",
		"start:Tile:child-b", "end:Tile:child-b"
	]);
	assert.equal(migrated.flags["token-attacher"].prototypeAttached.Tile[0].migrated, true);
	assert.equal(prototype.flags["token-attacher"].prototypeAttached.Tile[0].migrated, undefined, "migration must operate on the duplicate");
});

test("a rejected recursive prototype migration prevents the Actor update", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	let updateCalls = 0;
	const actor = {
		prototypeToken: {
			_id: "root",
			flags: {"token-attacher": {prototypeAttached: {Tile: [{_id: "bad-child"}]}}}
		},
		update: async () => { updateCalls += 1; }
	};

	await assert.rejects(
		TokenAttacher.migrateElementsOfActor(
			actor,
			async element => {
				if(element._id === "bad-child") throw new Error("child migration failed");
			},
			["Tile"],
			false
		),
		/child migration failed/
	);
	assert.equal(updateCalls, 0, "Actor data must remain untouched after a rejected child migration");
});

test("compendium migration awaits async descendants before updating the document", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let releaseChild;
	let updateCalls = 0;
	const entity = {
		_id: "actor-1",
		prototypeToken: {
			_id: "root",
			flags: {"token-attacher": {prototypeAttached: {Tile: [{_id: "child"}]}}}
		},
		update: async () => { updateCalls += 1; }
	};
	const pack = {
		locked: false,
		documentName: "Actor",
		metadata: {label: "Test Pack"},
		getIndex: async () => [{_id: entity._id}],
		getDocument: async () => entity
	};
	context.game.packs = [pack];

	const migration = TokenAttacher.migrateElementsInCompendiums(
		async element => {
			if(element._id === "child") await new Promise(resolve => { releaseChild = resolve; });
		},
		["Tile"],
		false
	);
	await waitFor(() => typeof releaseChild === "function");
	assert.equal(updateCalls, 0, "the compendium document must wait for its descendant migration");
	releaseChild();
	const result = await migration;
	assert.equal(updateCalls, 1);
	assert.equal(result.status, "success");
	assert.equal(result.changed, 1);
});

test("a rejected compendium descendant prevents the document update", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let updateCalls = 0;
	const entity = {
		_id: "actor-1",
		prototypeToken: {
			_id: "root",
			flags: {"token-attacher": {prototypeAttached: {Tile: [{_id: "bad-child"}]}}}
		},
		update: async () => { updateCalls += 1; }
	};
	context.game.packs = [{
		locked: false,
		documentName: "Actor",
		metadata: {label: "Test Pack"},
		getIndex: async () => [{_id: entity._id}],
		getDocument: async () => entity
	}];

	await assert.rejects(
		TokenAttacher.migrateElementsInCompendiums(
			async () => { throw new Error("compendium child failed"); },
			["Tile"],
			false
		),
		/compendium child failed/
	);
	assert.equal(updateCalls, 0, "a failed recursive migration must not partially update the compendium Actor");
});

test("stale constrained parents veto safely and only notify the initiating user", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const document = {
		_id: "child",
		x: 0,
		y: 0,
		width: 1,
		height: 1,
		flags: {
			"token-attacher": {
				parent: "missing-parent",
				offset: {x: 0, y: 0},
				canMoveConstrained: {type: TokenAttacher.CONSTRAINED_TYPE.TOKEN_CONSTRAINED}
			}
		}
	};

	assert.doesNotThrow(() => {
		assert.equal(TokenAttacher.isAllowedToMove("Token", document, {x: 10}, {}, context.game.user.id), false);
	});
	assert.equal(notificationCalls.warn.length, 1, "the initiating user should see one actionable veto warning");
	assert.equal(consoleCalls.warn.length, 1, "the initiating user should get one structured diagnostic");

	context.game.users.push({_id: "remote-user", id: "remote-user", viewedScene: context.canvas.scene.id});
	assert.equal(TokenAttacher.isAllowedToMove("Token", document, {x: 20}, {}, "remote-user"), false);
	assert.equal(notificationCalls.warn.length, 1, "other clients must not receive an irrelevant warning");
	assert.equal(consoleCalls.warn.length, 1, "other clients must not receive duplicate diagnostics");

	context.game.users.push({_id: "other-scene-user", id: "other-scene-user", viewedScene: "scene-2"});
	assert.equal(TokenAttacher.isAllowedToMove("Token", document, {x: 30}, {}, "other-scene-user"), true);
	assert.equal(notificationCalls.warn.length, 1);
});

test("v14 Token movement returns only documents whose per-ID movement completed", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const completed = {_id: "move-ok", id: "move-ok"};
	const prevented = {_id: "move-blocked", id: "move-blocked"};
	context.canvas.scene.tokens.set(completed.id, completed);
	context.canvas.scene.tokens.set(prevented.id, prevented);
	let instructions;
	context.canvas.scene.moveTokens = async value => {
		instructions = value;
		return {[completed.id]: true, [prevented.id]: false};
	};

	const result = await TokenAttacher.updateEmbeddedDocuments("Token", [
		{_id: completed.id, x: 100},
		{_id: prevented.id, x: 200}
	]);

	assert.deepEqual(Array.from(result, document => document.id), [completed.id]);
	assert.deepEqual(Object.keys(instructions), [completed.id, prevented.id]);
	assert.equal(consoleCalls.warn.length, 1, "prevented movement should emit one structured diagnostic");
	assert.equal(notificationCalls.warn.length, 1, "prevented movement should be visible to the user");
});

test("scene-bound attachment movement rejects when its explicit Scene prevents a Token move", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const child = {_id: "child-token", id: "child-token", flags: {"token-attacher": {parent: "base-token"}}};
	const scene = {
		id: "origin-scene",
		tokens: new Map([[child.id, child]]),
		getEmbeddedDocument: (type, id) => type === "Token" && id === child.id ? child : null,
		updateEmbeddedDocuments: async () => [],
		moveTokens: async () => ({[child.id]: false})
	};
	context.canvas.scene = scene;
	TokenAttacher.offsetPositionOfElements = () => [{_id: child.id, x: 250, y: 300}];
	const baseData = {
		_id: "base-token",
		flags: {"token-attacher": {attached: {Token: [child.id]}}}
	};

	await assert.rejects(
		TokenAttacher._UpdateAttachedOfBase("Token", baseData, false, {}, false, {scene, strictScene: true}),
		/Foundry prevented movement/
	);

	assert.equal(consoleCalls.warn.length, 1);
	assert.equal(notificationCalls.warn.length, 1);
});

test("attachment movement aborts visibly before geometry when its Scene canvas is no longer active", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	let geometryCalls = 0;
	let writeCalls = 0;
	const originScene = {
		id: "origin-scene",
		getEmbeddedDocument: () => ({_id: "tile-1", id: "tile-1", flags: {"token-attacher": {parent: "base-a"}}}),
		updateEmbeddedDocuments: async () => { writeCalls += 1; }
	};
	context.canvas.scene = {id: "new-scene", updateEmbeddedDocuments: async () => []};
	context.canvas.grid = {size: 250, sizeX: 250, sizeY: 250, type: 1};
	TokenAttacher.offsetPositionOfElements = () => {
		geometryCalls += 1;
		return [{_id: "tile-1", x: 999, y: 999}];
	};
	const baseData = {
		_id: "base-a",
		flags: {"token-attacher": {attached: {Tile: ["tile-1"]}}}
	};

	const result = await TokenAttacher.runAction("Move attached objects", () =>
		TokenAttacher._UpdateAttachedOfBase("Token", baseData, false, {}, false, {
			scene: originScene,
			strictScene: true
		})
	);

	assert.equal(result.status, "error");
	assert.equal(geometryCalls, 0, "geometry must not use the newly viewed Scene's grid");
	assert.equal(writeCalls, 0);
	assert.equal(consoleCalls.error.length, 1);
	assert.equal(notificationCalls.error.length, 1);
});

test("attachment movement skips stale-listed foreign Tile and native Region ownership", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	let geometryCalls = 0;
	let writeCalls = 0;
	const tile = {
		_id: "tile-foreign",
		id: "tile-foreign",
		flags: {"token-attacher": {parent: "base-b"}}
	};
	const region = {
		_id: "region-foreign",
		id: "region-foreign",
		_source: {attachment: {token: "base-b"}},
		flags: {"token-attacher": {parent: "base-a"}}
	};
	const scene = {
		id: "origin-scene",
		getEmbeddedDocument: (type, id) => {
			if(type === "Tile" && id === tile.id) return tile;
			if(type === "Region" && id === region.id) return region;
			return null;
		},
		updateEmbeddedDocuments: async () => { writeCalls += 1; }
	};
	context.canvas.scene = scene;
	TokenAttacher.offsetPositionOfElements = () => {
		geometryCalls += 1;
		return [];
	};
	const baseData = {
		_id: "base-a",
		flags: {"token-attacher": {attached: {Tile: [tile.id], Region: [region.id]}}}
	};

	const result = await TokenAttacher._UpdateAttachedOfBase("Token", baseData, false, {}, false, {
		scene,
		strictScene: true
	});

	assert.equal(result.status, "noop");
	assert.equal(result.changed, 0);
	assert.equal(geometryCalls, 0);
	assert.equal(writeCalls, 0);
	assert.equal(consoleCalls.warn.length, 1);
	assert.equal(notificationCalls.warn.length, 1);
});

test("attachment movement reports a warned no-op for entirely unresolved base lists", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const scene = {
		id: "origin-scene",
		getEmbeddedDocument: () => null,
		updateEmbeddedDocuments: async () => { throw new Error("unresolved attachments must not write"); }
	};
	context.canvas.scene = scene;
	const baseData = {
		_id: "base-a",
		flags: {"token-attacher": {attached: {Tile: ["missing-tile"]}}}
	};

	const result = await TokenAttacher._UpdateAttachedOfBase("Token", baseData, false, {}, false, {
		scene,
		strictScene: true
	});

	assert.equal(result.status, "noop");
	assert.equal(result.changed, 0);
	assert.equal(consoleCalls.warn.length, 1);
	assert.equal(notificationCalls.warn.length, 1);
});

test("attach treats a v14 Region's native Token owner as authoritative", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const writes = [];
	const region = {
		_id: "region-1",
		id: "region-1",
		_source: {attachment: {token: "base-b"}},
		getFlag: () => undefined
	};
	const scene = {
		...context.canvas.scene,
		getEmbeddedDocument: (type, id) => type === "Region" && id === region.id ? region : null,
		updateEmbeddedDocuments: async (type, updates) => writes.push({type, updates})
	};
	const base = {
		_id: "base-a",
		documentName: "Token",
		parent: scene,
		getFlag: (_scope, key) => key === "attached.Region" ? [] : key === "attached" ? {} : undefined
	};

	const result = await TokenAttacher._AttachToToken(
		{document: base, layer: {constructor: {documentName: "Token"}}},
		{type: "Region", ids: [region.id]}
	);

	assert.equal(result.status, "noop");
	assert.equal(writes.length, 0, "the native Region relationship must not be overwritten");
	assert.equal(notificationCalls.warn.length, 1, "the ownership conflict should be explained");
	assert.equal(notificationCalls.info.length, 0, "a blocked Region attach must not report success");
});

test("v14 Region migration preserves native ownership and repairs stale Token Attacher lists", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const writes = [];
	const tokenA = {
		_id: "base-a",
		id: "base-a",
		getFlag: (_scope, key) => {
			if(key === "attached") return {Region: ["region-1"]};
			if(key === "attached.Region") return ["region-1"];
			return undefined;
		}
	};
	const tokenB = {
		_id: "base-b",
		id: "base-b",
		getFlag: (_scope, key) => key === "attached" ? {} : key === "attached.Region" ? [] : undefined
	};
	const region = {
		_id: "region-1",
		id: "region-1",
		_source: {attachment: {token: tokenB.id}},
		getFlag: (_scope, key) => key === "parent" ? tokenA.id : key === "offset" ? {shapes: [{}]} : undefined
	};
	const valuesCollection = values => ({
		get: id => values.find(value => value.id === id),
		[Symbol.iterator]: () => values[Symbol.iterator]()
	});
	const scene = {
		id: "scene-regions",
		tokens: valuesCollection([tokenA, tokenB]),
		regions: valuesCollection([region]),
		updateEmbeddedDocuments: async (type, updates, options) => {
			writes.push({type, updates, options});
			return updates;
		}
	};
	context.canvas.scene = scene;
	TokenAttacher.isFirstActiveGM = () => true;

	await TokenAttacher.migrateV14SceneAttachments();

	const tokenWrites = writes.filter(write => write.type === "Token");
	const baseAUpdate = tokenWrites.flatMap(write => write.updates).find(update => update._id === tokenA.id);
	const baseBUpdate = tokenWrites.flatMap(write => write.updates).find(update => update._id === tokenB.id);
	assert.deepEqual(Object.keys(baseAUpdate["flags.token-attacher.attached"]), []);
	assert.deepEqual(Array.from(baseBUpdate["flags.token-attacher.attached"].Region), [region.id]);
	const regionUpdate = writes.find(write => write.type === "Region").updates[0];
	assert.equal(regionUpdate["flags.token-attacher.parent"], tokenB.id);
	assert.equal(Object.hasOwn(regionUpdate, "attachment.token"), false, "native ownership must not be overwritten");
});

test("stale base-list cleanup is a warned no-op rather than a zero-count attach success", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const writes = [];
	let saveCalls = 0;
	const child = {
		_id: "tile-1",
		id: "tile-1",
		getFlag: (_scope, key) => key === "parent" ? "base-b" : undefined
	};
	const scene = {
		...context.canvas.scene,
		getEmbeddedDocument: (type, id) => type === "Tile" && id === child.id ? child : null,
		updateEmbeddedDocuments: async (type, updates, options) => {
			writes.push({type, updates, options});
			return updates;
		}
	};
	const base = {
		_id: "base-a",
		documentName: "Token",
		parent: scene,
		getFlag: (_scope, key) => {
			if(key === "attached.Tile") return [child.id];
			if(key === "attached") return {Tile: [child.id]};
			return undefined;
		}
	};
	TokenAttacher.saveBasePositon = () => { saveCalls += 1; };

	const result = await TokenAttacher._AttachToToken(
		{document: base, layer: {constructor: {documentName: "Token"}}},
		{type: "Tile", ids: [child.id]}
	);

	assert.equal(result.status, "noop");
	assert.equal(result.changed, 1, "the stale metadata repair should still be observable");
	assert.equal(saveCalls, 0, "metadata cleanup must not begin an attachment write");
	assert.equal(writes.length, 1);
	assert.equal(writes[0].type, "Token");
	assert.deepEqual(Array.from(writes[0].updates[0]["flags.token-attacher.attached.Tile"]), []);
	assert.equal(notificationCalls.warn.length, 1);
	assert.equal(notificationCalls.info.length, 0, "cleanup must never report ObjectsAttached with count zero");
});

test("recursive attachment traversal blocks creating an ancestor cycle", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const writes = [];
	const baseA = {
		_id: "base-a",
		id: "base-a",
		documentName: "Token",
		getFlag: (_scope, key) => key === "attached" ? {Token: ["base-b"]} : undefined
	};
	const baseB = {
		_id: "base-b",
		id: "base-b",
		documentName: "Token",
		getFlag: (_scope, key) => {
			if(key === "attached.Token") return [];
			if(key === "attached") return {};
			return undefined;
		}
	};
	const documents = new Map([[baseA.id, baseA], [baseB.id, baseB]]);
	const scene = {
		...context.canvas.scene,
		getEmbeddedDocument: (type, id) => type === "Token" ? documents.get(id) : null,
		updateEmbeddedDocuments: async (type, updates) => writes.push({type, updates})
	};
	baseA.parent = scene;
	baseB.parent = scene;

	const result = await TokenAttacher._AttachToToken(
		{document: baseB, layer: {constructor: {documentName: "Token"}}},
		{type: "Token", ids: [baseA.id]}
	);

	assert.equal(result.status, "noop");
	assert.equal(writes.length, 0, "a cyclic graph must not be persisted");
	assert.equal(notificationCalls.error.length, 1, "the cycle should be visible to the user");
	assert.equal(consoleCalls.warn.length, 1, "the cycle should emit a structured diagnostic");
});

test("single attach rolls back both sides when the child relationship write fails", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const writes = [];
	const child = {
		_id: "tile-1",
		id: "tile-1",
		getFlag: (_scope, key) => key === "attached" ? {} : undefined
	};
	const base = {
		_id: "base-a",
		id: "base-a",
		documentName: "Token",
		getFlag: (_scope, key) => {
			if(key === "attached.Tile") return [];
			if(key === "attached") return {};
			return undefined;
		}
	};
	const scene = {
		...context.canvas.scene,
		getEmbeddedDocument: (type, id) => type === "Tile" && id === child.id ? child : type === "Token" && id === base.id ? base : null,
		updateEmbeddedDocuments: async (type, updates, options) => {
			writes.push({type, updates, options});
			if(type === "Tile" && !options?.["token-attacher"]?.rollback) throw new Error("child write failed");
			return updates;
		}
	};
	base.parent = scene;
	TokenAttacher.saveBasePositon = () => ({_id: base.id, "flags.token-attacher.pos": {x: 0, y: 0}});
	TokenAttacher.getElementOffset = () => ({x: 1, y: 1});

	await assert.rejects(
		TokenAttacher._AttachToToken(
			{document: base, layer: {constructor: {documentName: "Token"}}},
			{type: "Tile", ids: [child.id]},
			true
		),
		/child write failed/
	);

	assert.deepEqual(Array.from(writes, write => write.type), ["Token", "Tile", "Tile", "Token"]);
	assert.ok(writes[2].options["token-attacher"].rollback, "the child relationship must be rolled back");
	assert.ok(writes[3].options["token-attacher"].rollback, "the base attachment list must be rolled back");
	assert.deepEqual(Array.from(writes[3].updates[0]["flags.token-attacher.attached.Tile"]), []);
});

test("single detach restores the child relationship when the base-list write fails", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	const documentWrites = [];
	const flagWrites = [];
	let rejectNextFlagWrite = true;
	const child = {
		_id: "tile-1",
		id: "tile-1",
		getFlag: (_scope, key) => {
			if(key === "parent") return "base-a";
			if(key === "offset") return {x: 5, y: 7};
			return undefined;
		}
	};
	const base = {
		_id: "base-a",
		getFlag: (_scope, key) => key === "attached.Tile" ? [child.id] : undefined,
		setFlag: async (_scope, key, value) => {
			flagWrites.push({key, value});
			if(rejectNextFlagWrite){
				rejectNextFlagWrite = false;
				throw new Error("base write failed");
			}
		}
	};
	TokenAttacher.getElementDocument = (_type, id) => id === child.id ? child : null;
	TokenAttacher.updateEmbeddedDocuments = async (type, updates, options) => {
		documentWrites.push({type, updates, options});
		return updates;
	};

	await assert.rejects(
		TokenAttacher._DetachFromToken(
			{document: base},
			{type: "Tile", ids: [child.id]},
			true
		),
		/base write failed/
	);

	assert.equal(documentWrites.length, 2);
	assert.equal(documentWrites[1].updates[0]["flags.token-attacher.parent"], base._id);
	assert.deepEqual(documentWrites[1].updates[0]["flags.token-attacher.offset"], {x: 5, y: 7});
	assert.ok(documentWrites[1].options["token-attacher"].rollback);
	assert.equal(flagWrites.length, 2, "the original base list should be restored after failure");
	assert.deepEqual(Array.from(flagWrites[1].value), [child.id]);
});

test("deleting a Token preserves a stale-listed Region owned natively by a foreign Token", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const deleteCalls = [];
	const foreignToken = {_id: "base-b", id: "base-b"};
	const regionChild = {
		_id: "tile-under-region",
		id: "tile-under-region",
		flags: {"token-attacher": {parent: "region-1"}}
	};
	const region = {
		_id: "region-1",
		id: "region-1",
		_source: {attachment: {token: foreignToken.id}},
		flags: {"token-attacher": {parent: "base-a", attached: {Tile: [regionChild.id]}}}
	};
	const scene = {
		...context.canvas.scene,
		tokens: new Map([[foreignToken.id, foreignToken]]),
		getEmbeddedDocument: (type, id) => {
			if(type === "Region" && id === region.id) return region;
			if(type === "Tile" && id === regionChild.id) return regionChild;
			return null;
		},
		deleteEmbeddedDocuments: async (type, ids) => deleteCalls.push({type, ids})
	};
	const deletingToken = {
		_id: "base-a",
		id: "base-a",
		parent: scene,
		flags: {"token-attacher": {attached: {Region: [region.id]}}}
	};
	context.game.user.active = true;

	await TokenAttacher.deleteToken(deletingToken, {}, context.game.user.id);

	assert.equal(deleteCalls.length, 0, "neither the foreign native Region nor its descendants may be deleted");
	assert.equal(consoleCalls.warn.length, 1, "the stale ownership conflict should be diagnostic");
	assert.equal(notificationCalls.warn.length, 1, "the preserved Region should be visible to the user");
});

test("Token deletion validates non-Region ownership before collecting or recursing", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const deleteCalls = [];
	const foreignDescendant = {
		_id: "drawing-under-foreign-tile",
		id: "drawing-under-foreign-tile",
		flags: {"token-attacher": {parent: "foreign-tile"}}
	};
	const foreignTile = {
		_id: "foreign-tile",
		id: "foreign-tile",
		flags: {"token-attacher": {parent: "base-b", attached: {Drawing: [foreignDescendant.id]}}}
	};
	const ownedTile = {
		_id: "owned-tile",
		id: "owned-tile",
		flags: {"token-attacher": {parent: "base-a"}}
	};
	const documents = new Map([
		[`Tile:${foreignTile.id}`, foreignTile],
		[`Tile:${ownedTile.id}`, ownedTile],
		[`Drawing:${foreignDescendant.id}`, foreignDescendant]
	]);
	const scene = {
		id: "origin-scene",
		deleteEmbeddedDocuments: async (type, ids, options) => {
			deleteCalls.push({type, ids, options});
			return ids;
		},
		getEmbeddedDocument: (type, id) => documents.get(`${type}:${id}`) ?? null
	};
	const deletingToken = {
		_id: "base-a",
		id: "base-a",
		parent: scene,
		flags: {"token-attacher": {attached: {Tile: [foreignTile.id, ownedTile.id]}}}
	};
	context.game.user.active = true;
	context.game.user.viewedScene = "some-other-scene";

	const result = await TokenAttacher.deleteToken(deletingToken, {}, context.game.user.id);

	assert.equal(result.status, "success");
	assert.equal(result.changed, 1);
	assert.equal(deleteCalls.length, 1);
	assert.equal(deleteCalls[0].type, "Tile");
	assert.deepEqual(Array.from(deleteCalls[0].ids), [ownedTile.id]);
	assert.equal(notificationCalls.warn.length, 1, "the foreign Tile should be visibly preserved");
});

test("Token deletion reports a missing active GM only to the initiating user", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const scene = {
		id: "origin-scene",
		deleteEmbeddedDocuments: async () => { throw new Error("must not delete without an active GM"); },
		getEmbeddedDocument: () => null
	};
	const deletingToken = {
		_id: "base-a",
		parent: scene,
		flags: {"token-attacher": {attached: {Tile: ["tile-1"]}}}
	};
	context.game.user.active = false;

	const initiatingResult = await TokenAttacher.deleteToken(deletingToken, {}, context.game.user.id);
	assert.equal(initiatingResult.status, "error");
	assert.equal(consoleCalls.error.length, 1);
	assert.equal(notificationCalls.error.length, 1);

	const ignoredResult = await TokenAttacher.deleteToken(deletingToken, {}, "remote-user");
	assert.equal(ignoredResult.status, "ignored");
	assert.equal(consoleCalls.error.length, 1);
	assert.equal(notificationCalls.error.length, 1);
});

test("missing-link cleanup preserves foreign native Regions and keeps using its captured Scene", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const writes = [];
	const deletes = [];
	const foreignToken = {_id: "base-b", id: "base-b"};
	const region = {
		_id: "region-1",
		id: "region-1",
		_source: {attachment: {token: foreignToken.id}},
		flags: {"token-attacher": {parent: "missing-base", offset: {x: 10}}}
	};
	const tile = {
		_id: "tile-1",
		id: "tile-1",
		flags: {"token-attacher": {parent: "missing-base"}}
	};
	const otherScene = {
		id: "other-scene",
		tokens: new Map(),
		deleteEmbeddedDocuments: async () => { throw new Error("cleanup switched Scenes"); }
	};
	const originScene = {
		id: "origin-scene",
		tokens: new Map([[foreignToken.id, foreignToken]]),
		updateEmbeddedDocuments: async (type, updates, options) => {
			writes.push({type, updates, options});
			context.canvas.scene = otherScene;
			return updates;
		},
		deleteEmbeddedDocuments: async (type, ids, options) => {
			deletes.push({type, ids, options});
			return ids;
		}
	};
	context.canvas.scene = originScene;
	TokenAttacher.registeredLayers = ["Region", "Tile"];
	TokenAttacher.getSceneDocuments = type => type === "Region" ? [region] : type === "Tile" ? [tile] : [];

	const result = await TokenAttacher.deleteMissingLinks();

	assert.equal(result.status, "success");
	assert.equal(result.changed, 2);
	assert.equal(writes.length, 1);
	assert.equal(writes[0].type, "Region");
	assert.equal(Object.hasOwn(writes[0].updates[0], "attachment.token"), false);
	assert.ok(Object.hasOwn(writes[0].updates[0], "flags.token-attacher.parent"));
	assert.deepEqual(Array.from(deletes[0].ids), [tile.id]);
	assert.equal(consoleCalls.warn.length, 1);
	assert.equal(notificationCalls.warn.length, 1);
});

test("missing-link cleanup reports an explicit no-op when nothing needs repair", async () => {
	const {TokenAttacher} = await loadTokenAttacher();
	TokenAttacher.registeredLayers = [];

	const result = await TokenAttacher.deleteMissingLinks();

	assert.equal(result.status, "noop");
	assert.equal(result.changed, 0);
});

test("purge clears native Region ownership only when Token Attacher can prove the relationship", async () => {
	const {TokenAttacher, consoleCalls, context, notificationCalls} = await loadTokenAttacher();
	const writes = [];
	const foreignBase = {_id: "base-b", id: "base-b"};
	const ownedBase = {_id: "base-c", id: "base-c"};
	const foreignRegion = {
		_id: "region-foreign",
		id: "region-foreign",
		_source: {attachment: {token: foreignBase.id}},
		flags: {"token-attacher": {offset: {x: 1}}}
	};
	const ownedRegion = {
		_id: "region-owned",
		id: "region-owned",
		_source: {attachment: {token: ownedBase.id}},
		flags: {"token-attacher": {parent: ownedBase.id, offset: {x: 2}}}
	};
	const scene = {
		id: "purge-scene",
		name: "Purge Scene",
		tokens: new Map([[foreignBase.id, foreignBase], [ownedBase.id, ownedBase]]),
		updateEmbeddedDocuments: async (type, updates, options) => {
			writes.push({type, updates, options});
			return updates;
		},
		update: async () => undefined
	};
	context.canvas.scene = {id: "newly-viewed-scene", tokens: new Map()};
	TokenAttacher.registeredLayers = ["Region"];
	TokenAttacher.getSceneDocuments = () => [foreignRegion, ownedRegion];
	context.document.getElementById = id => id === "tokenAttacher"
		? {dataset: {sceneId: context.canvas.scene.id}}
		: null;
	let paletteCloseCalls = 0;
	TokenAttacher.closeTokenAttacherUI = async () => { paletteCloseCalls += 1; };

	const result = await TokenAttacher.purgeTAData(scene);

	assert.equal(result.status, "success");
	assert.equal(result.changed, 2);
	const regionUpdates = writes[0].updates;
	const foreignUpdate = regionUpdates.find(update => update._id === foreignRegion.id);
	const ownedUpdate = regionUpdates.find(update => update._id === ownedRegion.id);
	assert.equal(Object.hasOwn(foreignUpdate, "attachment.token"), false, "unproven native ownership must survive purge");
	assert.equal(ownedUpdate["attachment.token"], null, "matching TA and native owners prove the relationship");
	assert.equal(paletteCloseCalls, 0, "purging an old Scene must not close a palette belonging to the newly viewed Scene");
	assert.equal(consoleCalls.warn.length, 1);
	assert.equal(notificationCalls.warn.length, 1);
	assert.equal(notificationCalls.info.length, 1);
});

test("only the initiating client dispatches attachment movement from the broadcast update hook", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const current = context.game.user;
	current.isGM = false;
	const activeGM = {id: "gm-1", _id: "gm-1", isGM: true, active: true, viewedScene: context.canvas.scene.id};
	context.game.users = Object.assign([current, activeGM], {find: Array.prototype.find});
	const document = {
		_id: "base-1",
		id: "base-1",
		parent: context.canvas.scene,
		getFlag: (_scope, key) => key === "attached" ? {Tile: ["tile-1"]} : undefined,
		toObject: () => ({_id: "base-1", flags: {"token-attacher": {attached: {Tile: ["tile-1"]}}}})
	};
	let socketCalls = 0;
	TokenAttacher.emitSocketAction = async (_event, _data, options) => {
		socketCalls += 1;
		assert.equal(options.sceneId, context.canvas.scene.id);
		return {status: "success"};
	};
	const options = {"token-attacher": {attachmentsNeedUpdate: true}};

	const ignored = await TokenAttacher.UpdateAttachedOfToken("Token", document, {x: 100}, options, "another-user");
	assert.equal(ignored.status, "ignored");
	assert.equal(socketCalls, 0);

	const sent = await TokenAttacher.UpdateAttachedOfToken("Token", document, {x: 100}, options, current.id);
	assert.equal(sent.status, "success");
	assert.equal(socketCalls, 1);
});

test("Instant Attach is dispatched once by its initiating client with its captured Scene and base", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const current = context.game.user;
	current.isGM = false;
	const activeGM = {id: "gm-1", _id: "gm-1", isGM: true, active: true, viewedScene: context.canvas.scene.id};
	context.game.users = Object.assign([current, activeGM], {find: Array.prototype.find});
	const base = {_id: "base-1", id: "base-1", documentName: "Token", parent: context.canvas.scene};
	context.canvas.scene.getEmbeddedDocument = (type, id) => type === "Token" && id === base.id ? base : undefined;
	const created = {_id: "tile-1", id: "tile-1", parent: context.canvas.scene, flags: {}};
	const options = {"token-attacher": {InstantAttach: {
		userId: current.id,
		sceneId: context.canvas.scene.id,
		baseType: "Token",
		baseId: base.id
	}}};
	const messages = [];
	TokenAttacher.emitSocketAction = async (event, eventdata, socketOptions) => {
		messages.push({event, eventdata, socketOptions});
		return {status: "success"};
	};

	const ignored = await TokenAttacher.InstantAttach("Tile", created, options, "another-user");
	assert.equal(ignored.status, "ignored");
	assert.equal(messages.length, 0);
	const result = await TokenAttacher.InstantAttach("Tile", created, options, current.id);
	assert.equal(result.status, "success");
	assert.equal(messages.length, 1);
	assert.equal(messages[0].event, "AttachToToken");
	assert.equal(messages[0].eventdata[0], base.id);
	assert.equal(messages[0].socketOptions.sceneId, context.canvas.scene.id);
});

test("a selected GM relays document-hook write failures to the initiating user", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	let relayed;
	context.game.socket.emit = (_channel, message) => { relayed = message; };
	TokenAttacher.updateAttachedCreatedToken = async () => { throw new Error("injected create failure"); };
	TokenAttacher.registerHooks();
	const document = {id: "token-1", _id: "token-1", parent: context.canvas.scene};

	context.Hooks.call("createToken", document, {}, "player-1");
	await waitFor(() => relayed?.event === "__hookFailure");
	assert.equal(relayed.requesterId, "player-1");
	assert.match(relayed.error.message, /injected create failure/);

	context.game.user.id = "player-1";
	context.game.user._id = "player-1";
	context.game.userId = "player-1";
	await TokenAttacher.listen(relayed);
	assert.equal(notificationCalls.error.length, 2, "the GM and initiating user should each see the failure on their own client");
});

test("scene attachment migration aborts before writes when an awaited callback outlives its canvas", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let finishMigration;
	let migrationStarted = false;
	let sceneAWrites = 0;
	let sceneBWrites = 0;
	const childA = {_id: "tile-1", id: "tile-1", flags: {"token-attacher": {parent: "base-1"}}};
	const sceneA = {
		id: "scene-a",
		getEmbeddedDocument: (type, id) => type === "Tile" && id === childA.id ? childA : undefined,
		updateEmbeddedDocuments: async () => { sceneAWrites += 1; }
	};
	const sceneB = {
		id: "scene-b",
		getEmbeddedDocument: () => ({_id: "tile-1", id: "tile-1"}),
		updateEmbeddedDocuments: async () => { sceneBWrites += 1; }
	};
	context.canvas.scene = sceneA;
	const base = {_id: "base-1", parent: sceneA, flags: {"token-attacher": {attached: {Tile: [childA.id]}}}};
	const migrating = TokenAttacher.migrateAttached("Token", base, async () => {
		migrationStarted = true;
		return new Promise(resolve => { finishMigration = resolve; });
	}, ["Tile"], false);

	await waitFor(() => migrationStarted);
	context.canvas.scene = sceneB;
	TokenAttacher.canvasInit({scene: sceneB});
	finishMigration([{_id: childA.id, x: 10}]);

	await assert.rejects(migrating, /canvas is no longer active/i);
	assert.equal(sceneAWrites, 0);
	assert.equal(sceneBWrites, 0);
});

test("legacy template conversion fails the whole mixed prefab instead of dropping one attachment", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	context.CONFIG.Region.documentClass._migrateMeasuredTemplateData = () => { throw new Error("bad template"); };

	assert.throws(() => TokenAttacher.preparePrototypeAttachedV14({
		MeasuredTemplate: [{_id: "template-1", x: 0, y: 0}],
		Tile: [{_id: "tile-1", width: 100, height: 100}]
	}), /could not be converted/i);
});

test("movement protection covers elevation and resize fields owned by attachment offsets", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const document = {
		_id: "tile-1",
		id: "tile-1",
		parent: context.canvas.scene,
		flags: {"token-attacher": {offset: {x: 1}, parent: "base-1"}}
	};

	assert.equal(TokenAttacher.isAllowedToMove("Tile", document, {elevation: 10}, {}, context.game.userId), false);
	assert.equal(TokenAttacher.isAllowedToMove("Tile", document, {width: 250}, {}, context.game.userId), false);
	assert.equal(notificationCalls.warn.length, 2);
});

test("prototype updates visibly reject a missing Scene GM only on the initiating client", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	context.game.user.isGM = false;
	context.game.users = Object.assign([context.game.user], {find: Array.prototype.find});
	const actor = {id: "actor-1", _id: "actor-1"};

	const result = await TokenAttacher.updateAttachedPrototype(actor, {}, {}, context.game.userId);
	assert.equal(result.status, "error");
	assert.equal(notificationCalls.error.length, 1);
	const ignored = await TokenAttacher.updateAttachedPrototype(actor, {}, {}, "another-user");
	assert.equal(ignored.status, "ignored");
	assert.equal(notificationCalls.error.length, 1);
});

test("scene migration does not count attachment repairs that made no changes", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	context.canvas.tokens.placeables = [
		{document: {getFlag: () => ({Tile: ["stale-tile"]})}},
		{document: {getFlag: () => ({Tile: ["changed-tile"]})}}
	];
	let calls = 0;
	TokenAttacher._attachElementsToToken = async () => {
		calls += 1;
		return calls === 1
			? {status: "noop", changed: 0}
			: {status: "success", changed: 1};
	};

	const result = await TokenAttacher._migrateScene();

	assert.equal(result.status, "success");
	assert.equal(result.changed, 1);
	assert.equal(notificationCalls.info.length, 1);
});

test("compendium prototype scan returns matching Actors and rejects missing documents", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const matching = {
		id: "actor-with-prefab",
		prototypeToken: {flags: {"token-attacher": {prototypeAttached: {Tile: [{_id: "tile-1"}]}}}}
	};
	const plain = {id: "actor-without-prefab", prototypeToken: {flags: {}}};
	const actorPack = {
		collection: "world.actors",
		documentName: "Actor",
		getIndex: async () => [{_id: matching.id}, {_id: plain.id}],
		getDocument: async id => id === matching.id ? matching : plain
	};
	context.game.packs = [actorPack, {documentName: "Item"}];

	const actors = await TokenAttacher.getActorsWithPrototypeInCompendiums();
	assert.deepEqual(Array.from(actors, actor => actor.id), [matching.id]);

	actorPack.getIndex = async () => [{_id: "missing-actor"}];
	actorPack.getDocument = async () => undefined;
	await assert.rejects(
		TokenAttacher.getActorsWithPrototypeInCompendiums(),
		/missing-actor.*world\.actors/i
	);
});
