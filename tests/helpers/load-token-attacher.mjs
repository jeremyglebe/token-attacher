import {readFile} from "node:fs/promises";
import vm from "node:vm";

const modulePath = new URL("../../scripts/token-attacher.js", import.meta.url);

function getProperty(object, path) {
	if(!path) return object;
	return String(path).split(".").reduce((value, key) => value?.[key], object);
}

function setProperty(object, path, value) {
	const parts = String(path).split(".");
	const finalKey = parts.pop();
	let target = object;
	for(const key of parts) target = target[key] ??= {};
	target[finalKey] = value;
	return true;
}

function mergeObject(original={}, other={}, options={}) {
	const output = options.inplace === false ? duplicate(original) : original;
	for(const [key, value] of Object.entries(other ?? {})) {
		if(value && (typeof value === "object") && !Array.isArray(value)) {
			const base = output[key] && (typeof output[key] === "object") && !Array.isArray(output[key])
				? output[key]
				: {};
			output[key] = mergeObject(base, value, options);
		}
		else output[key] = value;
	}
	return output;
}

function duplicate(value) {
	if(value === undefined) return undefined;
	return structuredClone(value);
}

function makeHooks() {
	const callbacks = new Map();
	const add = (name, callback) => {
		const list = callbacks.get(name) ?? [];
		list.push(callback);
		callbacks.set(name, list);
		return callback;
	};
	return {
		callbacks,
		on: add,
		once: add,
		call(name, ...args) {
			let result;
			for(const callback of callbacks.get(name) ?? []) result = callback(...args);
			return result;
		},
		callAll(name, ...args) {
			for(const callback of callbacks.get(name) ?? []) callback(...args);
		}
	};
}

function createDefaultContext() {
	const notificationCalls = {error: [], info: [], warn: []};
	const consoleCalls = {debug: [], error: [], log: [], warn: []};
	const notifications = Object.fromEntries(Object.keys(notificationCalls).map(level => [
		level,
		message => {
			notificationCalls[level].push(message);
			return message;
		}
	]));
	const scene = {
		id: "scene-1",
		_id: "scene-1",
		name: "Test Scene",
		getFlag: () => undefined,
		setFlag: async () => undefined,
		unsetFlag: async () => undefined,
		tokens: new Map(),
		updateEmbeddedDocuments: async () => []
	};
	const user = {
		id: "user-1",
		_id: "user-1",
		active: true,
		isGM: true,
		viewedScene: scene.id,
		getFlag: () => undefined,
		setFlag: async () => undefined,
		unsetFlag: async () => undefined
	};
	const document = {
		getElementById: () => null,
		querySelector: () => null,
		querySelectorAll: () => []
	};
	const window = {document, tokenAttacher: {selected: {}}};
	const game = {
		activeTool: "select",
		i18n: {
			format: (key, data={}) => {
				const suffix = Object.keys(data).length ? ` ${JSON.stringify(data)}` : "";
				return `${key}${suffix}`;
			},
			localize: key => key
		},
		release: {generation: 14},
		scenes: {
			active: scene,
			get: id => id === scene.id ? scene : undefined
		},
		settings: {
			get: () => undefined,
			set: async () => undefined,
			register: () => undefined,
			registerMenu: () => undefined
		},
		socket: {emit: () => undefined, on: () => undefined},
		system: {grid: {distance: 5}},
		user,
		userId: user.id,
		users: Object.assign([user], {find: Array.prototype.find})
	};
	const canvas = {
		activeLayer: {controlled: []},
		foreground: null,
		getLayerByEmbeddedName: () => undefined,
		grid: {size: 100, sizeX: 100, sizeY: 100, type: 1},
		layers: [],
		ready: true,
		scene,
		tokens: {controlled: [], get: id => scene.tokens.get(id), placeables: []}
	};
	const foundry = {
		applications: {
			api: {DialogV2: {confirm: async () => true, prompt: async () => undefined}},
			handlebars: {renderTemplate: async () => ""}
		},
		utils: {duplicate, getProperty, mergeObject, setProperty}
	};
	const Hooks = makeHooks();

	class FormApplication {
		static get defaultOptions() { return {}; }
		activateListeners() {}
		getData() { return {}; }
		_getHeaderButtons() { return []; }
	}

	class PlaceablesLayer {
		copyObjects() { return []; }
	}

	const context = {
		$: () => ({click: () => undefined, find: () => []}),
		CONFIG: {
			Region: {documentClass: {_migrateMeasuredTemplateData: value => value}},
			Token: {documentClass: class {}, movement: {actions: {}}}
		},
		CONST: {
			GRID_TYPES: {GRIDLESS: 0, SQUARE: 1, HEXODDR: 2, HEXEVENR: 3, HEXODDQ: 4, HEXEVENQ: 5}
		},
		FormApplication,
		Function,
		Hooks,
		Number,
		PlaceablesLayer,
		_del: Symbol("forced-deletion"),
		canvas,
		clearTimeout,
		console: {
			debug: (...args) => consoleCalls.debug.push(args),
			error: (...args) => consoleCalls.error.push(args),
			log: (...args) => consoleCalls.log.push(args),
			warn: (...args) => consoleCalls.warn.push(args)
		},
		document,
		foundry,
		game,
		libWrapper: {register: () => undefined},
		setTimeout,
		ui: {
			controls: {activate: async () => undefined},
			notifications
		},
		window
	};

	return {consoleCalls, context, notificationCalls};
}

/**
 * Load Token Attacher without importing Foundry or installing its hooks.
 *
 * The production source is evaluated as-is except for its shim import and final
 * hook-registration call. This keeps the tests coupled to real class methods,
 * while each test receives a clean fake Foundry runtime.
 */
export async function loadTokenAttacher() {
	let source = await readFile(modulePath, "utf8");
	source = source.replace(/^import\s+\{libWrapper\}\s+from\s+["']\.\/shim\.js["'];\s*$/m, "");

	const registration = /TokenAttacher\.registerHooks\(\);\s*\}\)\(\);\s*$/;
	if(!registration.test(source)) {
		throw new Error("Unable to find Token Attacher's final hook-registration call");
	}
	source = source.replace(registration, `
	globalThis.__tokenAttacherTest = {TokenAttacher, TASettings, localizedStrings, moduleName};
})();`);

	const {consoleCalls, context, notificationCalls} = createDefaultContext();
	vm.createContext(context);
	const evaluation = new vm.Script(source, {filename: modulePath.pathname}).runInContext(context);
	await evaluation;

	if(!context.__tokenAttacherTest?.TokenAttacher) {
		throw new Error("Token Attacher did not expose its test API");
	}

	return {
		...context.__tokenAttacherTest,
		consoleCalls,
		context,
		notificationCalls
	};
}

export async function waitFor(predicate, {timeout=1000, interval=5}={}) {
	const deadline = Date.now() + timeout;
	while(Date.now() < deadline) {
		if(predicate()) return;
		await new Promise(resolve => setTimeout(resolve, interval));
	}
	throw new Error(`Condition was not met within ${timeout}ms`);
}
