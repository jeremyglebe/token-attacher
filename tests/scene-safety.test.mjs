import assert from "node:assert/strict";
import test from "node:test";

import {loadTokenAttacher, waitFor} from "./helpers/load-token-attacher.mjs";

test("a palette still rendering cannot appear after the canvas changes", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	const oldScene = context.canvas.scene;
	let attachBase;
	let inserted = 0;
	let finishRender;
	let renderStarted = false;
	oldScene.setFlag = async (_scope, key, value) => {
		if(key === "attach_base") attachBase = value;
	};
	oldScene.unsetFlag = async (_scope, key) => {
		if(key === "attach_base") attachBase = undefined;
	};
	context.foundry.applications.handlebars.renderTemplate = () => {
		renderStarted = true;
		return new Promise(resolve => { finishRender = resolve; });
	};
	context.document.getElementById = id => id === "hud"
		? {insertAdjacentHTML: () => { inserted += 1; }}
		: null;
	const token = {
		layer: {constructor: {documentName: "Token"}},
		document: {_id: "base-1", name: "Base", texture: {src: "base.png"}}
	};

	const opening = TokenAttacher.showTokenAttacherUI(token);
	await waitFor(() => renderStarted);
	context.canvas.scene = {id: "scene-2", _id: "scene-2"};
	TokenAttacher.canvasInit({scene: context.canvas.scene});
	finishRender("<nav id=\"tokenAttacher\"></nav>");

	await assert.rejects(opening, /scene changed/i);
	assert.equal(inserted, 0);
	assert.equal(attachBase, undefined);
});

test("Quick Edit cannot finish opening on a different canvas", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	let finishRender;
	let renderStarted = false;
	let inserted = 0;
	let overlay = null;
	context.foundry.applications.handlebars.renderTemplate = () => {
		renderStarted = true;
		return new Promise(resolve => { finishRender = resolve; });
	};
	context.document.getElementById = id => {
		if(id === "tokenAttacherQuickEdit") return overlay;
		if(id === "pause") {
			return {
				insertAdjacentHTML: () => {
					inserted += 1;
					overlay = {dataset: {}, remove: () => { overlay = null; }};
				}
			};
		}
		return null;
	};

	const enabling = TokenAttacher.setQuickEditMode(true);
	await waitFor(() => renderStarted);
	context.canvas.scene = {id: "scene-2", _id: "scene-2"};
	TokenAttacher.canvasInit({scene: context.canvas.scene});
	finishRender("<aside id=\"tokenAttacherQuickEdit\"></aside>");

	await assert.rejects(enabling, /scene changed/i);
	assert.equal(inserted, 0);
	assert.equal(context.window.tokenAttacher.quickEdit, undefined);
	assert.equal(notificationCalls.info.length, 0);
});

test("purge confirmation retains the Scene the user actually confirmed", async () => {
	const {TASettings, TokenAttacher, context} = await loadTokenAttacher();
	const elements = new Map();
	const html = {
		find: selector => {
			if(!elements.has(selector)){
				const element = {
					attributes: new Map(),
					dataset: {},
					disabled: false,
					on: (_event, callback) => { element.callback = callback; },
					removeAttribute: name => element.attributes.delete(name),
					setAttribute: (name, value) => element.attributes.set(name, value)
				};
				elements.set(selector, element);
			}
			return elements.get(selector);
		}
	};
	const sceneA = {id: "scene-a", name: "Scene A"};
	const sceneB = {id: "scene-b", name: "Scene B"};
	context.canvas.scene = sceneA;
	let finishConfirmation;
	let confirmationStarted = false;
	TokenAttacher.confirmAction = async () => {
		confirmationStarted = true;
		return new Promise(resolve => { finishConfirmation = resolve; });
	};
	let purgedScene;
	TokenAttacher.purgeTAData = async scene => {
		purgedScene = scene;
		return {status: "success"};
	};
	new TASettings().activateListeners(html);
	const purgeButton = elements.get(".purge-ta-data-in-scene");

	purgeButton.callback({preventDefault: () => undefined, currentTarget: purgeButton});
	await waitFor(() => confirmationStarted);
	context.canvas.scene = sceneB;
	finishConfirmation(true);
	await waitFor(() => purgedScene);

	assert.equal(purgedScene, sceneA);
});

test("replicated-token cleanup is awaited and its failure propagates", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	TokenAttacher.isFirstActiveGM = () => true;
	context.game.multilevel = {_isReplicatedToken: () => true};
	const document = {
		_id: "token-1",
		parent: context.canvas.scene,
		object: {},
		unsetFlag: async () => { throw new Error("unset failed"); }
	};

	await assert.rejects(
		TokenAttacher.updateAttachedCreatedToken("Token", document, {}, context.game.userId),
		/unset failed/
	);
});

test("Token attachment creation reports a missing Scene GM only to the initiating user", async () => {
	const {TokenAttacher, context, consoleCalls, notificationCalls} = await loadTokenAttacher();
	context.game.user.isGM = false;
	context.game.users = Object.assign([context.game.user], {find: Array.prototype.find});
	const document = {_id: "token-1", parent: context.canvas.scene};

	const initiatingResult = await TokenAttacher.updateAttachedCreatedToken(
		"Token",
		document,
		{},
		context.game.userId
	);
	assert.equal(initiatingResult.status, "error");
	assert.equal(consoleCalls.error.length, 1);
	assert.equal(notificationCalls.error.length, 1);

	consoleCalls.error.length = 0;
	notificationCalls.error.length = 0;
	const ignoredResult = await TokenAttacher.updateAttachedCreatedToken("Token", document, {}, "another-user");
	assert.equal(ignoredResult.status, "ignored");
	assert.equal(consoleCalls.error.length, 0);
	assert.equal(notificationCalls.error.length, 0);
});

test("attachment deletion stays on the deleted Token's parent Scene", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	TokenAttacher.isFirstActiveGM = () => true;
	TokenAttacher.isV14 = () => false;
	let releaseFirstDelete;
	const callsA = [];
	const callsB = [];
	const sceneA = {
		id: "scene-a",
		getEmbeddedDocument: (type, id) => ({
			_id: id,
			documentName: type,
			flags: {"token-attacher": {parent: "base"}}
		}),
		deleteEmbeddedDocuments: async (type, ids) => {
			callsA.push({type, ids});
			if(callsA.length === 1) await new Promise(resolve => { releaseFirstDelete = resolve; });
		}
	};
	const sceneB = {
		id: "scene-b",
		getEmbeddedDocument: (type, id) => ({_id: id, documentName: type, flags: {}}),
		deleteEmbeddedDocuments: async (type, ids) => callsB.push({type, ids})
	};
	const document = {
		_id: "base",
		parent: sceneA,
		flags: {"token-attacher": {attached: {Tile: ["tile-1"], Drawing: ["drawing-1"]}}}
	};

	const deleting = TokenAttacher.deleteToken(document, {}, context.game.userId);
	await waitFor(() => callsA.length === 1);
	context.canvas.scene = sceneB;
	releaseFirstDelete();
	await deleting;

	assert.deepEqual(Array.from(callsA, call => call.type), ["Tile", "Drawing"]);
	assert.equal(callsB.length, 0);
});

test("prototype regeneration uses the base Scene and waits for post-processing", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let releaseTexture;
	let textureStarted = false;
	let releasePostProcess;
	let postProcessStarted = false;
	let settled = false;
	const sceneACalls = [];
	const sceneBCalls = [];
	const sceneA = {
		id: "scene-a",
		createEmbeddedDocuments: async (type, creates) => {
			sceneACalls.push({type, creates});
			return creates.map((create, index) => ({...create, _id: `created-${index}`}));
		}
	};
	const sceneB = {
		id: "scene-b",
		createEmbeddedDocuments: async (type, creates) => {
			sceneBCalls.push({type, creates});
			return [];
		}
	};
	context.game.scenes.get = id => id === sceneA.id ? sceneA : (id === sceneB.id ? sceneB : undefined);
	context.canvas.scene = sceneA;
	context.loadTexture = async () => {
		textureStarted = true;
		await new Promise(resolve => { releaseTexture = resolve; });
	};
	TokenAttacher.preparePrototypeAttachedV14 = value => value;
	TokenAttacher.offsetPositionOfElements = async (_type, values) => values.map(value => ({...value}));
	TokenAttacher.zSort = (_up, _type, values) => values;
	TokenAttacher.batchPostProcess = async scene => {
		assert.equal(scene, sceneA);
		postProcessStarted = true;
		await new Promise(resolve => { releasePostProcess = resolve; });
		return {status: "success"};
	};
	const baseDocument = {_id: "base", parent: sceneA};
	const regenerating = TokenAttacher.regenerateAttachedFromPrototype(
		"Token",
		{document: baseDocument},
		{Tile: [{_id: "prototype-tile", texture: {src: "tile.webp"}}]},
		{size: 1, sizeX: 1, sizeY: 1},
		{}
	).then(result => {
		settled = true;
		return result;
	});

	await waitFor(() => textureStarted);
	releaseTexture();
	await waitFor(() => postProcessStarted);
	assert.equal(settled, false, "success must wait for relationship post-processing");
	releasePostProcess();
	const result = await regenerating;

	assert.equal(result.status, "success");
	assert.deepEqual(Array.from(sceneACalls, call => call.type), ["Tile"]);
	assert.equal(sceneBCalls.length, 0);
});

test("prototype regeneration aborts before using geometry from a newly selected Scene", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let releaseTexture;
	let textureStarted = false;
	const sceneACalls = [];
	const sceneBCalls = [];
	const sceneA = {
		id: "scene-a",
		createEmbeddedDocuments: async (type, creates) => {
			sceneACalls.push({type, creates});
			return creates.map((create, index) => ({...create, _id: `created-${index}`}));
		}
	};
	const sceneB = {
		id: "scene-b",
		createEmbeddedDocuments: async (type, creates) => {
			sceneBCalls.push({type, creates});
			return [];
		}
	};
	context.game.scenes.get = id => id === sceneA.id ? sceneA : (id === sceneB.id ? sceneB : undefined);
	context.canvas.scene = sceneA;
	context.loadTexture = async () => {
		textureStarted = true;
		await new Promise(resolve => { releaseTexture = resolve; });
	};
	TokenAttacher.preparePrototypeAttachedV14 = value => value;
	TokenAttacher.offsetPositionOfElements = async (_type, values) => values.map(value => ({...value}));
	TokenAttacher.zSort = (_up, _type, values) => values;
	const regenerating = TokenAttacher.regenerateAttachedFromPrototype(
		"Token",
		{document: {_id: "base", parent: sceneA}},
		{Tile: [{_id: "prototype-tile", texture: {src: "tile.webp"}}]},
		{size: 1, sizeX: 1, sizeY: 1},
		{}
	);

	await waitFor(() => textureStarted);
	context.canvas.scene = sceneB;
	TokenAttacher.canvasInit({scene: sceneB});
	releaseTexture();

	await assert.rejects(regenerating, /scene changed/i);
	assert.equal(sceneACalls.length, 0);
	assert.equal(sceneBCalls.length, 0);
});

test("prototype regeneration rolls created documents back when GM post-processing fails", async () => {
	const {TokenAttacher, context, notificationCalls} = await loadTokenAttacher();
	const deleted = [];
	const scene = {
		id: "scene-a",
		createEmbeddedDocuments: async (type, creates) => creates.map((create, index) => ({
			...create,
			_id: `${type.toLowerCase()}-${index}`
		})),
		deleteEmbeddedDocuments: async (type, ids, options) => deleted.push({type, ids, options})
	};
	context.canvas.scene = scene;
	context.game.scenes.get = id => id === scene.id ? scene : undefined;
	context.game.user.isGM = false;
	TokenAttacher.preparePrototypeAttachedV14 = value => value;
	TokenAttacher.offsetPositionOfElements = async (_type, values) => values.map(value => ({...value}));
	const remoteError = new Error("post-processing failed");
	TokenAttacher.emitSocketAction = async () => ({status: "error", error: remoteError});

	await assert.rejects(
		TokenAttacher.regenerateAttachedFromPrototype(
			"Token",
			{document: {_id: "base", parent: scene}},
			{Wall: [{_id: "prototype-wall", flags: {"token-attacher": {}}}]},
			{size: 1, sizeX: 1, sizeY: 1},
			{}
		),
		/post-processing failed/
	);

	assert.deepEqual(Array.from(deleted, call => ({type: call.type, ids: Array.from(call.ids)})), [
		{type: "Wall", ids: ["wall-0"]}
	]);
	assert.equal(deleted[0].options["token-attacher"].rollback, true);
	assert.equal(notificationCalls.info.length, 0, "a rolled-back paste must not announce success");
});

test("link regeneration restores fields removed with Foundry deletion keys after a later batch fails", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	context._del = undefined;
	const getFlag = function(scope, key) {
		return context.foundry.utils.getProperty(this, `flags.${scope}.${key}`);
	};
	const base = {
		_id: "base-new",
		id: "base-new",
		hidden: false,
		flags: {"token-attacher": {
			attached: {Drawing: ["old-drawing"]},
			grid: {size: 100, sizeX: 100, sizeY: 100},
			needsPostProcessing: true,
			pos: {base_id: "base-old", hidden: false},
			prototypeAttached: {Tile: [{name: "prototype"}]}
		}},
		getFlag
	};
	const child = {
		_id: "tile-new",
		id: "tile-new",
		flags: {"token-attacher": {parent: "base-old"}},
		getFlag
	};
	const documents = new Map([
		["Token:base-new", base],
		["Tile:tile-new", child]
	]);
	let forwardCalls = 0;
	const rollbackCalls = [];
	const scene = {
		id: "scene-a",
		getEmbeddedDocument: (type, id) => documents.get(`${type}:${id}`),
		getFlag: () => undefined,
		updateEmbeddedDocuments: async (type, updates, options) => {
			if(options?.["token-attacher"]?.rollback){
				rollbackCalls.push({type, updates});
				return updates;
			}
			forwardCalls += 1;
			if(forwardCalls === 3) throw new Error("after-update failed");
			return updates;
		}
	};
	context.canvas.scene = scene;
	TokenAttacher.getBasePositon = () => ({base_id: "base-new"});

	await assert.rejects(
		TokenAttacher.regenerateLinks({Token: [base], Tile: [child]}, {}, context.game.userId, scene),
		/after-update failed/
	);

	assert.equal(rollbackCalls.length, 3);
	const restoredBase = Object.assign({}, ...rollbackCalls
		.filter(call => call.type === "Token")
		.flatMap(call => Array.from(call.updates))
		.filter(update => update._id === base.id));
	assert.deepEqual(restoredBase["flags.token-attacher.prototypeAttached"], base.flags["token-attacher"].prototypeAttached);
	assert.deepEqual(restoredBase["flags.token-attacher.grid"], base.flags["token-attacher"].grid);
	assert.equal(restoredBase["flags.token-attacher.needsPostProcessing"], true);
	assert.equal(Object.keys(restoredBase).some(key => key.includes("-=-=")), false);
});

test("undo cleanup removes only a stale relationship and preserves unrelated Token Attacher data", async () => {
	const {TokenAttacher, context} = await loadTokenAttacher();
	let appliedUpdate;
	const element = {
		_id: "tile-1",
		id: "tile-1",
		flags: {"token-attacher": {
			animate: true,
			attached: {Drawing: ["drawing-1"]},
			offset: {x: 12},
			parent: "missing-base",
			unlocked: true
		}},
		getFlag(scope, key) {
			return context.foundry.utils.getProperty(this, `flags.${scope}.${key}`);
		},
		update: async update => { appliedUpdate = update; }
	};
	const scene = {
		id: "scene-a",
		tokens: new Map(),
		getEmbeddedDocument: (type, id) => type === "Tile" && id === element.id ? element : undefined
	};
	element.parent = scene;

	const result = await TokenAttacher._ReattachAfterUndo("Tile", element, {isUndo: true}, context.game.userId, {
		scene,
		strictScene: true
	});

	assert.equal(result.status, "success");
	assert.ok(Object.hasOwn(appliedUpdate, "flags.token-attacher.parent"));
	assert.ok(Object.hasOwn(appliedUpdate, "flags.token-attacher.offset"));
	assert.equal(Object.keys(appliedUpdate).some(key => key.includes("animate")), false);
	assert.equal(Object.keys(appliedUpdate).some(key => key.includes("attached")), false);
	assert.equal(Object.hasOwn(appliedUpdate, "flags.token-attacher"), false);
});
