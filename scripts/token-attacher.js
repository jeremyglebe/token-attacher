'use strict';
import {libWrapper} from './shim.js';
 
(async () => {
	const moduleName = "token-attacher";
	const templatePath = `/modules/${moduleName}/templates`;
	const dataModelVersion = 3;
	//CONFIG.debug.hooks = true
	const localizedStrings = {
		error: {
			ActionFailed: "TOKENATTACHER.error.ActionFailed",
			ActionInProgress: "TOKENATTACHER.error.ActionInProgress",
			NoChangesMade: "TOKENATTACHER.error.NoChangesMade",
			NothingSelected: "TOKENATTACHER.error.NothingSelected",
			NoTokensSelected: "TOKENATTACHER.error.NoTokensSelected",
			NoAttachments: "TOKENATTACHER.error.NoAttachments",
			NoMatchingAttachments: "TOKENATTACHER.error.NoMatchingAttachments",
			NoCopiedAttachments: "TOKENATTACHER.error.NoCopiedAttachments",
			InvalidCopiedAttachments: "TOKENATTACHER.error.InvalidCopiedAttachments",
			NoEligibleAttachedSelection: "TOKENATTACHER.error.NoEligibleAttachedSelection",
			ObjectsAttachedElsewhere: "TOKENATTACHER.error.ObjectsAttachedElsewhere",
			NoElementsInRectangle: "TOKENATTACHER.error.NoElementsInRectangle",
			CreationPrevented: "TOKENATTACHER.error.CreationPrevented",
			NoActorsToMigrate: "TOKENATTACHER.error.NoActorsToMigrate",
			NoCompendiumsToMigrate: "TOKENATTACHER.error.NoCompendiumsToMigrate",
			NoTokenAttacherData: "TOKENATTACHER.error.NoTokenAttacherData",
			NoActiveScene: "TOKENATTACHER.error.NoActiveScene",
			QuickEditGMOnly: "TOKENATTACHER.error.QuickEditGMOnly",
			ImportFolderMissingParent: "TOKENATTACHER.error.ImportFolderMissingParent",
			ImportFolderCycle: "TOKENATTACHER.error.ImportFolderCycle",
			ImportActorMissingFolder: "TOKENATTACHER.error.ImportActorMissingFolder",
			AttachmentParentMissing: "TOKENATTACHER.error.AttachmentParentMissing",
			AttachedObjectMovementBlocked: "TOKENATTACHER.error.AttachedObjectMovementBlocked",
			NoActiveGMFound: "TOKENATTACHER.error.NoActiveGMFound",
			ExportAllowsOnlyActor: "TOKENATTACHER.error.ExportAllowsOnlyActor",
			NoValidJSONProvided: "TOKENATTACHER.error.NoValidJSONProvided",
			ElementAlreadyAttachedInChain: "TOKENATTACHER.error.ElementAlreadyAttachedInChain",
			ActorDataModelNeedsMigration: "TOKENATTACHER.error.ActorDataModelNeedsMigration",
			MigrationErrorScene: "TOKENATTACHER.error.MigrationErrorScene",
			QuickEditNotFinished: "TOKENATTACHER.error.QuickEditNotFinished",
			PostProcessingNotFinished: "TOKENATTACHER.error.PostProcessingNotFinished",
			OnlyTokenToggleAnimate: "TOKENATTACHER.error.OnlyTokenToggleAnimate",
			BaseDoesntExist: "TOKENATTACHER.error.BaseDoesntExist",
			UIisOpenOnAssign: "TOKENATTACHER.error.UIisOpenOnAssign"
		},
		info: {
			ObjectsAttached: "TOKENATTACHER.info.ObjectsAttached",
			ObjectsDetached: "TOKENATTACHER.info.ObjectsDetached",
			AttachmentsCopied: "TOKENATTACHER.info.AttachmentsCopied",
			AttachmentsHighlighted: "TOKENATTACHER.info.AttachmentsHighlighted",
			AttachmentsHighlightCleared: "TOKENATTACHER.info.AttachmentsHighlightCleared",
			MultiSelectCancelled: "TOKENATTACHER.info.MultiSelectCancelled",
			QuickEditEnabled: "TOKENATTACHER.info.QuickEditEnabled",
			QuickEditDisabled: "TOKENATTACHER.info.QuickEditDisabled",
			PurgeComplete: "TOKENATTACHER.info.PurgeComplete",
			MissingLinksCleaned: "TOKENATTACHER.info.MissingLinksCleaned",
			SelectionSaved: "TOKENATTACHER.info.SelectionSaved",
			MigrationInProgress: "TOKENATTACHER.info.MigrationInProgress",
			MigratedScene: "TOKENATTACHER.info.MigratedScene",
			DataModelMergedTo: "TOKENATTACHER.info.DataModelMergedTo",
			MigratedActors: "TOKENATTACHER.info.MigratedActors",
			MigratingCompendium: "TOKENATTACHER.info.MigratingCompendium",
			MigratedCompendiums: "TOKENATTACHER.info.MigratedCompendiums",
			DragSelectElements: "TOKENATTACHER.info.DragSelectElements",
			PostProcessingFinished: "TOKENATTACHER.info.PostProcessingFinished",
			PastedAndAttached: "TOKENATTACHER.info.PastedAndAttached",
			ObjectsUnlocked: "TOKENATTACHER.info.ObjectsUnlocked",
			ObjectsLocked: "TOKENATTACHER.info.ObjectsLocked",
			ObjectsCanNotMoveConstrained: "TOKENATTACHER.info.ObjectsCanNotMoveConstrained",
			ObjectsCanMoveConstrained: "TOKENATTACHER.info.ObjectsCanMoveConstrained",
			AnimationToggled: "TOKENATTACHER.info.AnimationToggled",
			ImportingJSONStart: "TOKENATTACHER.info.ImportingJSONStart",
			ImportingJSONFinished: "TOKENATTACHER.info.ImportingJSONFinished"
		},
		confirm: {
			DetachAllTitle: "TOKENATTACHER.confirm.DetachAllTitle",
			DetachAllContent: "TOKENATTACHER.confirm.DetachAllContent",
			ResetMigrationTitle: "TOKENATTACHER.confirm.ResetMigrationTitle",
			ResetMigrationContent: "TOKENATTACHER.confirm.ResetMigrationContent",
			PurgeSceneTitle: "TOKENATTACHER.confirm.PurgeSceneTitle",
			PurgeSceneContent: "TOKENATTACHER.confirm.PurgeSceneContent"
		},
		button: {
			AttachToToken:					"TOKENATTACHER.button.AttachToToken",
			DetachFromToken:				"TOKENATTACHER.button.DetachFromToken",
			SaveSelection:					"TOKENATTACHER.button.SaveSelection",
			StartTokenAttach:				"TOKENATTACHER.button.StartTokenAttach",
			ToggleQuickEditMode:			"TOKENATTACHER.button.ToggleQuickEditMode",
			select:							"TOKENATTACHER.button.select",
			link:							"TOKENATTACHER.button.link",
			unlink:							"TOKENATTACHER.button.unlink",
			'unlink-all':					"TOKENATTACHER.button.unlink-all",
			lock:							"TOKENATTACHER.button.lock",
			unlock:							"TOKENATTACHER.button.unlock",
			highlight:						"TOKENATTACHER.button.highlight",
			copy:							"TOKENATTACHER.button.copy",
			paste:							"TOKENATTACHER.button.paste",
			toggleAnimate:					"TOKENATTACHER.button.toggleAnimate",
			close:							"TOKENATTACHER.button.close",
			gmMenu: {
				SceneMigration:				"TOKENATTACHER.button.gmMenu.SceneMigration",
				ActorsMigration:			"TOKENATTACHER.button.gmMenu.ActorsMigration",
				CompendiumsMigration:		"TOKENATTACHER.button.gmMenu.CompendiumsMigration",
				ImportJSONDialog:			"TOKENATTACHER.button.gmMenu.ImportJSONDialog",
				ExportActorsToJSON:			"TOKENATTACHER.button.gmMenu.ExportActorsToJSON",
				ResetMigration:				"TOKENATTACHER.button.gmMenu.ResetMigration",
				PurgeTADataInScene:			"TOKENATTACHER.button.gmMenu.PurgeTADataInScene"
			}
		},
		setting: {
			MLTBlockMovement:				"TOKENATTACHER.setting.MLTBlockMovement",
			MLTBlockMovementHint:			"TOKENATTACHER.setting.MLTBlockMovementHint"
		}
	}
	class TASettings extends FormApplication {
		static init() {
		game.settings.registerMenu(moduleName, 'menu', {
			name: '',
			label: 'Token Attacher GM Menu',
			type: TASettings,
			restricted: true
		  });
		game.settings.register(moduleName, 'MLTBlockMovement', {
			name: game.i18n.localize("TOKENATTACHER.setting.MLTBlockMovement"),
			hint: game.i18n.localize("TOKENATTACHER.setting.MLTBlockMovementHint"),
			scope: "world",
			config: true,
			type: Boolean,
			default: false
		});
		}
	
		static get defaultOptions() {
			return {
				...super.defaultOptions,
				template: `${templatePath}/tokenAttacherSettings.html`,
				height: "auto",
				title: "Token Attacher GM Menu",
				width: 600,
				classes: ["token-attacher-gm-menu","settings"],
				tabs: [ 
					{
						navSelector: '.tabs',
						contentSelector: 'form',
						initial: 'info'
					} 
				],
				submitOnClose: false
			}
		}
	
	
		constructor(object = {}, options) {
			super(object, options);
		}
	
		_getHeaderButtons() {
			return super._getHeaderButtons();
		}
	
	
		getData() {
			return  super.getData();
		}
	
		activateListeners(html) {
			super.activateListeners(html);
			const resetMigration = html.find(".reset-migration");
			const forceSceneMigration = html.find(".scene-migration");
			const forceActorMigration = html.find(".actor-migration");
			const forceCompendiumMigration = html.find(".compendium-migration");
			const importJSONDialog = html.find(".import-json-dialog");
			const exportActorsToJSON = html.find(".export-actors-to-json");
			const purgeTADataInScene = html.find(".purge-ta-data-in-scene");

			const bindAction = (element, actionKey, callback) => {
				element.on("click", event => {
					event.preventDefault();
					void TokenAttacher.runAction(actionKey, callback, {
						element: event.currentTarget,
						context: {surface: "gm-menu"}
					});
				});
			};

			bindAction(resetMigration, localizedStrings.button.gmMenu.ResetMigration, async () => {
				const confirmed = await TokenAttacher.confirmAction(
					localizedStrings.confirm.ResetMigrationTitle,
					localizedStrings.confirm.ResetMigrationContent
				);
				if(!confirmed) return {status: "cancelled"};
				await TokenAttacher._resetMigration();
				return {status: "success"};
			});
			bindAction(forceSceneMigration, localizedStrings.button.gmMenu.SceneMigration, () => TokenAttacher._migrateScene());
			bindAction(forceActorMigration, localizedStrings.button.gmMenu.ActorsMigration, () => TokenAttacher.migrateAllPrototypeActors());
			bindAction(forceCompendiumMigration, localizedStrings.button.gmMenu.CompendiumsMigration, () => TokenAttacher.migrateAllActorCompendiums());
			bindAction(importJSONDialog, localizedStrings.button.gmMenu.ImportJSONDialog, () => TokenAttacher.importFromJSONDialog());
			bindAction(exportActorsToJSON, localizedStrings.button.gmMenu.ExportActorsToJSON, () => TokenAttacher.getActorsWithPrototype());
			bindAction(purgeTADataInScene, localizedStrings.button.gmMenu.PurgeTADataInScene, async () => {
				const scene = canvas.scene;
				if(!scene) return TokenAttacher.noop(localizedStrings.error.NoActiveScene);
				const confirmed = await TokenAttacher.confirmAction(
					localizedStrings.confirm.PurgeSceneTitle,
					localizedStrings.confirm.PurgeSceneContent,
					{scene: scene.name}
				);
				if(!confirmed) return {status: "cancelled"};
				return TokenAttacher.purgeTAData(scene);
			});
		}
	
	}

	class TokenAttacher {
		static CONSTRAINED_TYPE = {
			TOKEN_CONSTRAINED: 0,
			UNCONSTRAINED: 1,
		}

		static isV14(){
			return (game.release?.generation ?? 0) >= 14;
		}

		static v14MovementAction = "tokenAttacher";

		static registerV14MovementAction(){
			if(!TokenAttacher.isV14()) return;
			const actions = CONFIG.Token?.movement?.actions;
			if(!actions || Object.hasOwn(actions, TokenAttacher.v14MovementAction)) return;
			const displace = actions.displace;
			if(!displace) return;
			actions[TokenAttacher.v14MovementAction] = {
				...displace,
				label: "Token Attacher",
				order: (displace.order ?? 8) + 0.1,
				getAnimationOptions: document => ({
					duration: document.movement?.updateOptions?.animation?.duration ?? 0
				})
			};
		}

		static normalizeDocumentType(type){
			if(TokenAttacher.isV14() && type === "MeasuredTemplate") return "Region";
			return type;
		}

		static initMacroAPI(){
			if(foundry.utils.getProperty(window,'tokenAttacher.attachElementToToken')) return;
			window.tokenAttacher = {
				...window.tokenAttacher, 
				attachElementToToken: TokenAttacher.attachElementToToken,
				attachElementsToToken: TokenAttacher.attachElementsToToken,
				detachElementFromToken: TokenAttacher.detachElementFromToken,
				detachElementsFromToken: TokenAttacher.detachElementsFromToken,
				detachAllElementsFromToken: TokenAttacher.detachAllElementsFromToken,
				getAllAttachedElementsOfToken: TokenAttacher.getAllAttachedElementsOfToken,
				getAllAttachedElementsByTypeOfToken: TokenAttacher.getAllAttachedElementsByTypeOfToken,
				getActorsWithPrototype: TokenAttacher.getActorsWithPrototype,
				getActorsWithPrototypeInCompendiums: TokenAttacher.getActorsWithPrototypeInCompendiums,
				importFromJSONDialog: TokenAttacher.importFromJSONDialog,
				importFromJSON: TokenAttacher.importFromJSON,
				setElementsLockStatus: TokenAttacher.setElementsLockStatus,
				setElementsMoveConstrainedStatus: TokenAttacher.setElementsMoveConstrainedStatus,
				regenerateLinks: TokenAttacher.regenerateLinks,
				toggleQuickEditMode: TokenAttacher.toggleQuickEditMode,
				deleteMissingLinks: TokenAttacher.deleteMissingLinks,
				toggleAnimateStatus: TokenAttacher.toggleAnimateStatus,
				setAnimateStatus: TokenAttacher.setAnimateStatus,
				migrateElementsInCompendiums: TokenAttacher.migrateElementsInCompendiums,
				migrateAttachedOfBase: TokenAttacher.migrateAttachedOfBase,
				migrateElementsOfActor: TokenAttacher.migrateElementsOfActor,
				migratePrototype: TokenAttacher.migratePrototype,
				generatePrototypeAttached: TokenAttacher.generatePrototypeAttached,
				transformBaseIntoPrototype: TokenAttacher.transformBaseIntoPrototype,
				isAttachmentBase: TokenAttacher.isAttachmentBase,
				_compatiblity: {
					registerLayerByDocumentName: TokenAttacher._registerLayerByDocumentName,
					updateOffset : TokenAttacher.updateOffset,
					isAllowedToMove : TokenAttacher.isAllowedToMove,
					handleBaseMoved : TokenAttacher.handleBaseMoved,
					doAttachmentsNeedUpdate : TokenAttacher.doAttachmentsNeedUpdate,
					isAllowedToControl : TokenAttacher.isAllowedToControl,
					DetachAfterDelete : TokenAttacher.DetachAfterDelete,
					ReattachAfterUndo : TokenAttacher.ReattachAfterUndo,
					PreInstantAttach : TokenAttacher.PreInstantAttach,
					InstantAttach : TokenAttacher.InstantAttach,
					updateOffset : TokenAttacher.updateOffset,
					getCenter : TokenAttacher.getCenter,
					moveRotatePoint: TokenAttacher.moveRotatePoint,
					visualizeVector: TokenAttacher.visualizeVector
				},

				CONSTRAINED_TYPE: TokenAttacher.CONSTRAINED_TYPE,
			};
			Hooks.callAll(`${moduleName}.macroAPILoaded`);
		}

		static ensureRuntimeState(){
			const state = window.tokenAttacher ?? {};
			window.tokenAttacher = state;
			state.selected ??= {};
			state.listenQueue ??= {running: false, queue: []};
			state.listenQueue.queue ??= [];
			state.listenQueue.running ??= false;
			state.pendingSocketRequests ??= new Map();
			state.canvasEpoch ??= 0;
			return state;
		}

		static async initialize(){
			const state = TokenAttacher.ensureRuntimeState();
			if(TokenAttacher.isFirstActiveGM() && canvas.scene){
				await canvas.scene.unsetFlag(moduleName,"selected");
				console.log("Token Attacher | initialized", {sceneId: canvas.scene.id});
			}

			TokenAttacher.initMacroAPI();
			await TokenAttacher.migrateV14SceneAttachments();
			TokenAttacher.updatedLockedAttached();
			if(state.quickEdit?.scene === canvas.scene?.id){
				await TokenAttacher.ensureQuickEditOverlay();
			}
		}

		static format(key, data={}){
			return game.i18n.format(key, data);
		}

		static notify(level, key, data={}){
			const message = TokenAttacher.format(key, data);
			const notifier = ui.notifications?.[level];
			if(!(notifier instanceof Function)) throw new Error(`Unknown notification level: ${level}`);
			return notifier.call(ui.notifications, message);
		}

		static noop(key, data={}){
			TokenAttacher.notify("warn", key, data);
			return {status: "noop", notified: true};
		}

		static async runAction(actionKey, callback, {element=null, context={}}={}){
			const action = TokenAttacher.format(actionKey);
			if(element?.dataset?.tokenAttacherBusy === "true"){
				return TokenAttacher.noop(localizedStrings.error.ActionInProgress, {action});
			}

			const wasDisabled = element && ("disabled" in element) ? element.disabled : undefined;
			if(element?.dataset) element.dataset.tokenAttacherBusy = "true";
			if(element && ("disabled" in element)) element.disabled = true;
			if(element?.setAttribute) element.setAttribute("aria-busy", "true");

			const diagnostic = {
				action,
				actionKey,
				sceneId: canvas.scene?.id,
				sceneName: canvas.scene?.name,
				userId: game.user?.id,
				...context
			};
			console.debug("Token Attacher | action:start", diagnostic);

			try {
				const result = await callback();
				const status = result?.status ?? "success";
				if(result?.notification){
					TokenAttacher.notify(result.notification.level, result.notification.key, result.notification.data);
				}
				if(status === "noop" && !result?.notified && !result?.notification){
					TokenAttacher.notify("warn", localizedStrings.error.ActionFailed, {
						action,
						message: TokenAttacher.format(localizedStrings.error.NoChangesMade)
					});
				}
				console.debug(`Token Attacher | action:${status}`, diagnostic, result ?? {});
				return result ?? {status};
			}
			catch(error){
				console.error("Token Attacher | action:failed", diagnostic, error);
				TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {
					action,
					message: error?.message ?? String(error)
				});
				return {status: "error", error};
			}
			finally {
				if(element?.dataset) delete element.dataset.tokenAttacherBusy;
				if(element && ("disabled" in element)) element.disabled = wasDisabled;
				if(element?.removeAttribute) element.removeAttribute("aria-busy");
			}
		}

		static async confirmAction(titleKey, contentKey, data={}){
			const title = TokenAttacher.format(titleKey, data);
			const content = `<p>${TokenAttacher.format(contentKey, data)}</p>`;
			const DialogV2 = foundry.applications?.api?.DialogV2;
			if(DialogV2){
				return DialogV2.confirm({window: {title}, content, modal: true, rejectClose: false});
			}

			return new Promise(resolve => Dialog.confirm({
				title,
				content,
				yes: () => resolve(true),
				no: () => resolve(false),
				close: () => resolve(false)
			}));
		}

		static markForDeletion(update, path){
			if(globalThis._del !== undefined){
				update[path] = globalThis._del;
				return update;
			}

			const parts = path.split(".");
			const key = parts.pop();
			update[`${parts.join(".")}.-=${key}`] = null;
			return update;
		}

		static getNativeRegionParentId(document){
			const parent = foundry.utils.getProperty(document, "_source.attachment.token")
				?? foundry.utils.getProperty(document, "attachment.token.id")
				?? foundry.utils.getProperty(document, "attachment.token");
			if(typeof parent === "string") return parent || null;
			return parent?.id ?? parent?._id ?? null;
		}

		static getAttachmentParentIds(document, documentType){
			const parentIds = new Set();
			const flagParentId = document?.getFlag?.(moduleName, "parent")
				?? foundry.utils.getProperty(document, `flags.${moduleName}.parent`)
				?? foundry.utils.getProperty(document, `_source.flags.${moduleName}.parent`);
			if(flagParentId) parentIds.add(flagParentId);
			if(TokenAttacher.isV14() && TokenAttacher.normalizeDocumentType(documentType) === "Region"){
				const nativeParentId = TokenAttacher.getNativeRegionParentId(document);
				if(nativeParentId) parentIds.add(nativeParentId);
			}
			return parentIds;
		}

		static getRegionNativeOwnership(document, scene=canvas.scene){
			const nativeParentId = TokenAttacher.getNativeRegionParentId(document);
			const flagParentId = document?.getFlag?.(moduleName, "parent")
				?? foundry.utils.getProperty(document, `flags.${moduleName}.parent`)
				?? foundry.utils.getProperty(document, `_source.flags.${moduleName}.parent`)
				?? null;
			const nativeBase = nativeParentId ? scene?.tokens?.get?.(nativeParentId) : null;
			const attached = nativeBase?.getFlag?.(moduleName, "attached")
				?? foundry.utils.getProperty(nativeBase, `flags.${moduleName}.attached`)
				?? foundry.utils.getProperty(nativeBase, `_source.flags.${moduleName}.attached`)
				?? {};
			const regionId = document?._id ?? document?.id;
			const listedByNativeBase = [attached.Region, attached.MeasuredTemplate]
				.some(ids => Array.isArray(ids) && ids.includes(regionId));
			return {
				nativeParentId,
				flagParentId,
				nativeBase,
				listedByNativeBase,
				ownedByTokenAttacher: Boolean(nativeParentId && (
					flagParentId === nativeParentId || listedByNativeBase
				))
			};
		}

		static captureRelationshipRollback(document, documentType){
			const update = {_id: document._id ?? document.id};
			for(const key of ["parent", "offset", "unlocked", "canMoveConstrained"]){
				const value = document.getFlag?.(moduleName, key)
					?? foundry.utils.getProperty(document, `flags.${moduleName}.${key}`)
					?? foundry.utils.getProperty(document, `_source.flags.${moduleName}.${key}`);
				const path = `flags.${moduleName}.${key}`;
				if(value === undefined) TokenAttacher.markForDeletion(update, path);
				else update[path] = foundry.utils.duplicate(value);
			}
			if(TokenAttacher.isV14() && TokenAttacher.normalizeDocumentType(documentType) === "Region"){
				update["attachment.token"] = TokenAttacher.getNativeRegionParentId(document);
			}
			return update;
		}

		static captureDocumentUpdateRollback(document, update){
			const rollback = {_id: update._id};
			const source = document?._source ?? document;
			for(const path of Object.keys(update)){
				if(path === "_id") continue;
				const parts = path.split(".");
				const finalPart = parts.at(-1);
				const sourcePath = finalPart?.startsWith("-=")
					? [...parts.slice(0, -1), finalPart.slice(2)].join(".")
					: path;
				let value;
				if(sourcePath.startsWith(`flags.${moduleName}.`) && document?.getFlag){
					value = document.getFlag(moduleName, sourcePath.slice(`flags.${moduleName}.`.length));
				}
				if(value === undefined) value = foundry.utils.getProperty(source, sourcePath);
				if(value === undefined) TokenAttacher.markForDeletion(rollback, sourcePath);
				else rollback[sourcePath] = foundry.utils.duplicate(value);
			}
			return rollback;
		}

		/**
		 * V14 Regions can be attached to Tokens natively. Keep Token Attacher's
		 * existing flags as the portable prefab format and mirror live links into
		 * the core attachment field so every V14 Region shape follows the Token.
		 */
		static async migrateV14SceneAttachments(){
			if(!TokenAttacher.isV14() || !TokenAttacher.isFirstActiveGM() || !canvas.scene) return;

			const scene = canvas.scene;
			const regionParents = new Map();
			const unresolvedNativeParents = [];
			for(const region of scene.regions ?? []){
				const nativeParentId = TokenAttacher.getNativeRegionParentId(region);
				if(nativeParentId){
					regionParents.set(region.id, nativeParentId);
					if(!scene.tokens.get(nativeParentId)){
						unresolvedNativeParents.push({regionId: region.id, nativeParentId});
					}
					continue;
				}
				const parentId = region.getFlag(moduleName, "parent");
				if(parentId && scene.tokens.get(parentId)) regionParents.set(region.id, parentId);
			}

			for(const token of scene.tokens ?? []){
				const attached = foundry.utils.duplicate(token.getFlag(moduleName, "attached") || {});
				const hadLegacyTemplates = Object.hasOwn(attached, "MeasuredTemplate");
				const regionIds = new Set(attached.Region || []);
				for(const id of attached.MeasuredTemplate || []){
					if(scene.regions.get(id)) regionIds.add(id);
				}
				for(const [regionId, parentId] of regionParents){
					if(parentId === token.id) regionIds.add(regionId);
				}

				const validRegionIds = [...regionIds].filter(id => {
					if(!scene.regions.get(id)) return false;
					const parentId = regionParents.get(id);
					return !parentId || parentId === token.id;
				});
				for(const regionId of validRegionIds){
					if(!regionParents.has(regionId)) regionParents.set(regionId, token.id);
				}

				delete attached.MeasuredTemplate;
				if(validRegionIds.length) attached.Region = validRegionIds;
				else delete attached.Region;

				const currentRegionIds = token.getFlag(moduleName, "attached.Region") || [];
				const regionsChanged = (currentRegionIds.length !== validRegionIds.length)
					|| currentRegionIds.some((id, index) => id !== validRegionIds[index]);
				if(hadLegacyTemplates || regionsChanged){
					await scene.updateEmbeddedDocuments("Token", [{
						_id: token.id,
						[`flags.${moduleName}.attached`]: attached
					}], {[moduleName]: {update: true}});
				}
			}

			const regionUpdates = [];
			for(const [regionId, parentId] of regionParents){
				const region = scene.regions.get(regionId);
				if(!region) continue;
				const parent = scene.tokens.get(parentId);
				if(!parent) continue;
				const nativeParentId = TokenAttacher.getNativeRegionParentId(region);
				const flagParentId = region.getFlag(moduleName, "parent") ?? null;
				const update = {_id: regionId};
				if(nativeParentId !== parentId) update["attachment.token"] = parentId;
				if(flagParentId !== parentId) update[`flags.${moduleName}.parent`] = parentId;
				const offset = region.getFlag(moduleName, "offset");
				if(!offset?.shapes?.length){
					update[`flags.${moduleName}.offset`] = TokenAttacher.getElementOffset(
						"Region", region.toObject(), "Token", parent, {}
					);
				}
				if(Object.keys(update).length > 1) regionUpdates.push(update);
			}
			if(regionUpdates.length){
				await scene.updateEmbeddedDocuments("Region", regionUpdates, {[moduleName]: {update: true}});
			}
			if(unresolvedNativeParents.length){
				const diagnostic = {sceneId: scene.id, regions: unresolvedNativeParents};
				console.warn("Token Attacher | preserved Region attachments whose native Token owner is missing", diagnostic);
				TokenAttacher.notify("warn", localizedStrings.error.ActionFailed, {
					action: "Migrate v14 Region attachments",
					message: `${unresolvedNativeParents.length} Region attachment(s) reference a missing Token; their native ownership was preserved.`
				});
			}
		}

		/**
		 * V14 interprets plain Token x/y updates as normal movement, including the
		 * child Actor's movement action and speed. Use an animatable, forced
		 * movement action so attached Tokens remain visually locked to the parent.
		 */
		static async updateEmbeddedDocuments(type, updates, options={}, scene=canvas.scene){
			type = TokenAttacher.normalizeDocumentType(type);
			updates = (updates || []).filter(update => update?._id);
			if(!updates.length) return [];
			if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");

			if(TokenAttacher.isV14() && (type === "Token") && (scene.moveTokens instanceof Function)){
				const movementFields = ["x", "y", "elevation", "width", "height", "depth", "shape", "level"];
				const moving = updates.filter(update => movementFields.some(field => Object.hasOwn(update, field)));
				const stationary = updates.filter(update => !movementFields.some(field => Object.hasOwn(update, field)));
				const successfulDocuments = new Map();

				if(stationary.length){
					const documents = await scene.updateEmbeddedDocuments(type, stationary, options);
					for(const document of documents ?? []){
						successfulDocuments.set(document.id ?? document._id, document);
					}
				}
				if(moving.length){
					const instructions = {};
					const action = Object.hasOwn(CONFIG.Token.movement.actions, TokenAttacher.v14MovementAction)
						? TokenAttacher.v14MovementAction
						: "displace";
					for(const update of moving){
						const {_id, ...destination} = update;
						instructions[_id] = {
							destination: {...destination, action},
							autoRotate: false,
							showRuler: false,
							constrainOptions: {ignoreWalls: true, ignoreCost: true}
						};
					}
					const movementResults = await scene.moveTokens(instructions, {
						...options,
						autoRotate: false,
						showRuler: false,
						constrainOptions: {...options.constrainOptions, ignoreWalls: true, ignoreCost: true}
					});
					const failedIds = [];
					for(const update of moving){
						if(movementResults?.[update._id] === true){
							const document = scene.tokens.get(update._id);
							if(document) successfulDocuments.set(update._id, document);
						}
						else failedIds.push(update._id);
					}
					if(failedIds.length){
						const diagnostic = {sceneId: scene.id, tokenIds: failedIds, movementResults};
						console.warn("Token Attacher | Foundry prevented attached Token movement", diagnostic);
						TokenAttacher.notify("warn", localizedStrings.error.ActionFailed, {
							action: "Move attached Tokens",
							message: `Foundry prevented movement for ${failedIds.length} attached Token(s).`
						});
					}
				}
				return updates.map(update => successfulDocuments.get(update._id)).filter(Boolean);
			}

			return scene.updateEmbeddedDocuments(type, updates, options);
		}

		static registeredLayers = [];

		static _registerLayerByDocumentName(type){
			type = TokenAttacher.normalizeDocumentType(type);
			if(TokenAttacher.registeredLayers.includes(type)) return;
			TokenAttacher.registeredLayers.push(type);
			//Attached elements are not allowed to be moved by anything other then Token Attacher
			Hooks.on(`update${type}`, (document, change, options, userId) => {
				void TokenAttacher.runAction(`Update ${type} attachment offset`, () => TokenAttacher.updateOffset(type, document, change, options, userId), {
					context: {surface: "document-hook", documentId: document.id, documentType: type}
				});
			});
			Hooks.on(`preUpdate${type}`, (document, change, options, userId) => TokenAttacher.isAllowedToMove(type, document, change, options, userId));
			Hooks.on(`preUpdate${type}`, (document, change, options, userId) => TokenAttacher.handleBaseMoved(document, change, options, userId));
			Hooks.on(`preUpdate${type}`, (document, change, options, userId) => TokenAttacher.doAttachmentsNeedUpdate(document, change, options, userId));
			Hooks.on(`preDelete${type}`, (document, options, userId) => TokenAttacher.isAllowedToMove(type, document, {}, options, userId));
			Hooks.on(`control${type}`, (object, isControlled) => TokenAttacher.isAllowedToControl(object, isControlled)); //Check hook signature
			//Deleting attached elements should detach them
			Hooks.on(`delete${type}`, (document, options, userId) => {
				void TokenAttacher.runAction(`Detach deleted ${type}`, () => TokenAttacher.DetachAfterDelete(type, document, options, userId), {
					context: {surface: "document-hook", documentId: document.id, documentType: type}
				});
			});
			//Recreating an element from Undo History will leave them detached, so reattach them
			Hooks.on(`create${type}`, (document, options, userId) => {
				void TokenAttacher.runAction(`Restore ${type} attachment`, () => TokenAttacher.ReattachAfterUndo(type, document, options, userId), {
					context: {surface: "document-hook", documentId: document.id, documentType: type}
				});
			});
			//Instant Attach on create if UI is open
			Hooks.on(`preCreate${type}`, (document, data, options, userId) => TokenAttacher.PreInstantAttach(type, document, data, options, userId));
			Hooks.on(`create${type}`, (document, options, userId) => {
				void TokenAttacher.runAction(`Instantly attach ${type}`, () => TokenAttacher.InstantAttach(type, document, options, userId), {
					context: {surface: "document-hook", documentId: document.id, documentType: type}
				});
			});
		}

		static copyWrapperRegistered = false;

		static registerCopyObjectsWrapper(){
			if(TokenAttacher.copyWrapperRegistered) return;
			if(!(libWrapper?.register instanceof Function)){
				throw new Error("Token Attacher could not initialize its copy integration because libWrapper is unavailable.");
			}

			libWrapper.register(moduleName, "PlaceablesLayer.prototype.copyObjects", function(wrapped, ...args){
				const result = wrapped(...args);
				if(this.constructor.documentName === "Token") TokenAttacher.copyTokens(this, result);
				return result;
			}, "MIXED");
			TokenAttacher.copyWrapperRegistered = true;
		}

		static registerHooks(){
			Hooks.on('init', () => {
				TokenAttacher.ensureRuntimeState();
				TokenAttacher.registerV14MovementAction();
				TokenAttacher.registerSettings();
				TokenAttacher.registerCopyObjectsWrapper();
			});

			Hooks.on('ready', () => {
				TokenAttacher.ensureRuntimeState();
				TokenAttacher.initMacroAPI();
				if(TokenAttacher.isFirstActiveGMAnywhere()){
					void TokenAttacher.runAction("Token Attacher migration", () => TokenAttacher.startMigration(), {
						context: {surface: "ready-hook"}
					});
				}
			});
		
			Hooks.on('getSceneControlButtons', (controls) => TokenAttacher._getControlButtons(controls));
			Hooks.on('canvasReady', () => {
				void TokenAttacher.runAction("Token Attacher initialization", () => TokenAttacher.initialize(), {
					context: {surface: "canvasReady-hook"}
				});
			});
			Hooks.on('canvasTearDown', canvasObj => {
				void TokenAttacher.runAction("Finalize Token Attacher scene state", () => TokenAttacher.handleCanvasTearDown(canvasObj), {
					context: {surface: "canvasTearDown-hook", sceneId: canvasObj.scene?.id}
				});
			});
			Hooks.once('ready', () => {
				TokenAttacher.ensureRuntimeState();
				game.socket.on(`module.${moduleName}`, (message) => TokenAttacher.listen(message));
			});
			
			Hooks.on('canvasReady', () => {
				const callbacks = canvas.mouseInteractionManager?.callbacks;
				const original = callbacks?.dragLeftDrop;
				if(!original || original._tokenAttacherWrapped) return;
				const wrapped = function(...args){
					const result = original.apply(this, args);
					void TokenAttacher.runAction(localizedStrings.button.select, () => TokenAttacher._RectangleSelection(...args), {
						context: {surface: "canvas-rectangle-selection"}
					});
					return result;
				};
				wrapped._tokenAttacherWrapped = true;
				callbacks.dragLeftDrop = wrapped;
			});

			Hooks.on("preUpdateToken", (document, change, options) => {
				if(TokenAttacher.isV14()) return;
				const attached = document.getFlag(moduleName, "attached") || {};
				if(!Object.values(attached).some(ids => ids?.length)) return;
				if(options._movement?.[document.id]?.autoRotate) delete change.rotation;
			});
			Hooks.on("preUpdateToken", (document, change, options, userId) => TokenAttacher.UpdateBasePosition("Token", document, change, options, userId));
			Hooks.on("updateToken", (document, change, options, userId) => {
				void TokenAttacher.runAction("Update attached objects", () => TokenAttacher.UpdateAttachedOfToken("Token", document, change, options, userId), {
					context: {surface: "updateToken-hook", documentId: document.id}
				});
			});
			Hooks.on("preMoveToken", (document, movement) => {
				if(!TokenAttacher.isV14()) return;
				const attached = document.getFlag(moduleName, "attached") || {};
				if(Object.values(attached).some(ids => ids?.length)) movement.autoRotate = false;
			});
			Hooks.on("updateActor", (document, change, options, userId) => {
				void TokenAttacher.runAction("Update attached prototype", () => TokenAttacher.updateAttachedPrototype(document, change, options, userId), {
					context: {surface: "updateActor-hook", documentId: document.id}
				}).then(result => TokenAttacher.relayHookFailure(result, {
					action: "Update attached prototype",
					userId,
					sceneId: game.users.get?.(userId)?.viewedScene
						?? game.users.find(user => user.id === userId || user._id === userId)?.viewedScene,
					documentId: document.id
				}));
			});
			Hooks.on("createActor", (document, options, userId) => {
				if(!canvas.ready) return;
				void TokenAttacher.runAction("Initialize attached prototype", () => TokenAttacher.updateAttachedPrototype(
					document, {prototypeToken: document.prototypeToken.toObject()}, options, userId
				), {context: {surface: "createActor-hook", documentId: document.id}}).then(result => TokenAttacher.relayHookFailure(result, {
					action: "Initialize attached prototype",
					userId,
					sceneId: game.users.get?.(userId)?.viewedScene
						?? game.users.find(user => user.id === userId || user._id === userId)?.viewedScene,
					documentId: document.id
				}));
			});
			Hooks.on("preCreateToken", (document, data, options, userId) => TokenAttacher.preCreateBase(document, data, options, userId));
			Hooks.on("createToken", (document, options, userId) => {
				void TokenAttacher.runAction("Create Token attachments", () => TokenAttacher.updateAttachedCreatedToken("Token", document, options, userId), {
					context: {surface: "createToken-hook", documentId: document.id}
				}).then(result => TokenAttacher.relayHookFailure(result, {
					action: "Create Token attachments",
					userId,
					sceneId: document.parent?.id,
					documentId: document.id
				}));
			});
			Hooks.on("pasteToken", (copy, toCreate) => {
				void TokenAttacher.runAction("Prepare pasted Token attachments", () => TokenAttacher.pasteTokens(copy, toCreate), {
					context: {surface: "pasteToken-hook", tokenCount: toCreate?.length ?? 0}
				});
			});
			Hooks.on("deleteToken", (document, options, userId) => {
				void TokenAttacher.runAction("Delete Token attachments", () => TokenAttacher.deleteToken(document, options, userId), {
					context: {surface: "deleteToken-hook", documentId: document.id}
				}).then(result => TokenAttacher.relayHookFailure(result, {
					action: "Delete Token attachments",
					userId,
					sceneId: document.parent?.id,
					documentId: document.id
				}));
			});
			Hooks.on("canvasInit", canvasObj => {
				void TokenAttacher.runAction("Initialize Token Attacher canvas state", () => TokenAttacher.canvasInit(canvasObj), {
					context: {surface: "canvasInit-hook", sceneId: canvasObj.scene?.id}
				});
			});
			Hooks.on("createPlaceableObjects", (parent, createdObjs, options, userId) => {
				if(foundry.utils.getProperty(options, `${moduleName}.postProcessed`)) return;
				void TokenAttacher.runAction("Post-process attached objects", () => TokenAttacher.batchPostProcess(parent, createdObjs, options, userId), {
					context: {surface: "createPlaceableObjects-hook", sceneId: parent?.id}
				});
			});

			const coreLayers = ["AmbientLight", "AmbientSound", "Drawing", "Note", "Tile", "Token", "Wall"];
			if(TokenAttacher.isV14()) coreLayers.push("Region");
			else coreLayers.push("MeasuredTemplate");
			for (const type of coreLayers) {
				TokenAttacher._registerLayerByDocumentName(type);
			}
			
		
			Hooks.on("getCompendiumContextOptions", (html, options) => {
				const exportPack = target => {
					void TokenAttacher.runAction("Export compendium to JSON", async () => {
						const pack = game.packs.get(target?.dataset?.pack);
						if(!pack) throw new Error("The selected compendium no longer exists.");
						if(pack.documentName !== "Actor"){
							TokenAttacher.notify("warn", localizedStrings.error.ExportAllowsOnlyActor);
							return {status: "noop", notified: true};
						}
						await TokenAttacher.exportCompendiumToJSON(pack);
						return {status: "success"};
					}, {context: {surface: "compendium-context"}});
				};

				if(TokenAttacher.isV14()){
					options.push({
						label: "(TA) Export to JSON",
						visible: () => game.user.isGM,
						icon: "fa-solid fa-file-export",
						onClick: (_event, target) => exportPack(target)
					});
				}
				else {
					options.push({
						name: "(TA) Export to JSON",
						condition: game.user.isGM,
						icon: '<i class="fas fa-file-export"></i>',
						callback: target => exportPack(target)
					});
				}
			});
		}

		static registerSettings() {
			game.settings.register(moduleName,"data-model-version",{
				name: "token attacher dataModelVersion",
				hint: "token attacher dataModelVersion",
				default: dataModelVersion,
				type: Number,
				scope: "world",
				config: false
			});

			TASettings.init();
		}
		static async _resetMigration(){
			await game.settings.set(moduleName, "data-model-version", dataModelVersion-1);
			return TokenAttacher.startMigration();
		}
		static async startMigration(){
			let currentDataModelVersion = game.settings.get(moduleName, "data-model-version");
			//Migration to Model 2 is last supported on 3.2.3
			if(currentDataModelVersion < 3){
				await game.settings.set(moduleName, "data-model-version", dataModelVersion + 99999);
				try {
					await TokenAttacher.migrateToDataModel_3();
				}
				catch(error){
					await game.settings.set(moduleName, "data-model-version", currentDataModelVersion);
					throw error;
				}
			}
			return {status: "success"};
		}

		static async migrateToDataModel_3(){
			TokenAttacher.notify("info", localizedStrings.info.MigrationInProgress, {version: dataModelVersion});
			const sceneIds = [...game.scenes].map(scene => scene.id);
			return TokenAttacher.migrateSceneHook(sceneIds);
		}

		static async _migrateScene({suppressEmpty=false}={}){
			if(!canvas.scene) return TokenAttacher.noop(localizedStrings.error.NoActiveScene);
			let migrated = 0;
			for (const token of canvas.tokens?.placeables ?? []) {
				const attached = token.document.getFlag(moduleName, "attached") || {};
				if(!Object.values(attached).some(ids => Array.isArray(ids) && ids.length)) continue;
				const result = await TokenAttacher._attachElementsToToken(attached, token, true);
				if(result?.status === "success" && (result.changed ?? 0) > 0) migrated += 1;
			}
			if(migrated === 0){
				if(suppressEmpty) return {status: "noop", notified: false, changed: 0};
				return TokenAttacher.noop(localizedStrings.error.NoAttachments);
			}
			TokenAttacher.notify("info", localizedStrings.info.MigratedScene, {scenename: canvas.scene.name, count: migrated});
			return {status: "success", changed: migrated};
		}

		static async migrateSceneHook(sceneIds){
			const originalScene = canvas.scene;
			let migrated = 0;
			try {
				for(const sceneId of sceneIds){
					const scene = game.scenes.get(sceneId);
					if(!scene) throw new Error(`Migration scene ${sceneId} no longer exists.`);
					if(canvas.scene?.id !== scene.id) await scene.view();
					if(canvas.scene?.id !== scene.id) throw new Error(`Could not view scene ${scene.name} for migration.`);
					const result = await TokenAttacher._migrateScene({suppressEmpty: true});
					migrated += result.changed ?? 0;
					if(result.status === "noop"){
						TokenAttacher.notify("info", localizedStrings.info.MigratedScene, {scenename: scene.name, count: 0});
					}
				}
				await game.settings.set(moduleName, "data-model-version", dataModelVersion);
				TokenAttacher.notify("info", localizedStrings.info.DataModelMergedTo, {version: dataModelVersion, count: migrated});
				return {status: "success", changed: migrated};
			}
			finally {
				if(originalScene && canvas.scene?.id !== originalScene.id) await originalScene.view();
			}
		}

		static async migrateAllPrototypeActors(){
			const allActors = [...game.actors].filter(actor =>{
				const attached = foundry.utils.getProperty(actor, `prototypeToken.flags.${moduleName}.prototypeAttached`) || {};
				if(Object.keys(attached).length > 0) return true;
				return false;
			});
			if(allActors.length === 0) return TokenAttacher.noop(localizedStrings.error.NoActorsToMigrate);
			await Promise.all(allActors.map(actor => TokenAttacher.migrateActor(actor)));
			
			console.log("Token Attacher | " + game.i18n.format(localizedStrings.info.MigratedActors) );
			ui.notifications.info(game.i18n.format(localizedStrings.info.MigratedActors, {count: allActors.length}));
			return {status: "success", changed: allActors.length};
		}

		static async migrateActor(actor, return_data = false){
			let tokenData = await TokenAttacher.migrateElement(null, null, foundry.utils.duplicate(foundry.utils.getProperty(actor, `prototypeToken`)), "Token");
			foundry.utils.setProperty(tokenData, `flags.${moduleName}.grid`, TokenAttacher.getCurrentGrid());
			if(!return_data) await actor.update({prototypeToken: tokenData});
			return tokenData;
		}

		static isPrototypeAttachedModel(prototypeAttached, model){
			if(!prototypeAttached || !Object.keys(prototypeAttached).length) return false;
			switch(model){
				case 2:
					return Object.hasOwn(prototypeAttached[Object.keys(prototypeAttached)[0]] ?? {}, "objs");
			}
			return false;
		}

		static async migrateElement(parent_data, parent_type, objData, type, migrationid=1){
			const allocator = migrationid && typeof migrationid.allocate === "function"
				? migrationid
				: {
					next: Number.isFinite(Number(migrationid)) ? Number(migrationid) : 1,
					allocate(){
						return this.next++;
					}
				};
			//Migrate to offset
			if(parent_data){
				const offset = foundry.utils.getProperty(objData, `flags.${moduleName}.offset`);
				let parent_pos = foundry.utils.duplicate(foundry.utils.getProperty(parent_data, `flags.${moduleName}.pos`));
				if(!offset){
					foundry.utils.setProperty(objData, `flags.${moduleName}.parent`, parent_pos.base_id);
					foundry.utils.setProperty(objData, `flags.${moduleName}.offset`, TokenAttacher.getElementOffset(type, objData, parent_type, foundry.utils.mergeObject(foundry.utils.mergeObject(parent_pos, parent_data), parent_pos.xy), {}));
				}
				else{
					let migrated_offset = TokenAttacher.getElementOffset(type, objData, parent_type, foundry.utils.mergeObject(foundry.utils.mergeObject(parent_pos, parent_data), parent_pos.xy), {})
					foundry.utils.setProperty(objData, `flags.${moduleName}.offset`, foundry.utils.mergeObject(migrated_offset, offset));
				}
			}
			//Migrate Attached
			const prototypeAttached = foundry.utils.getProperty(objData, `flags.${moduleName}.prototypeAttached`);
			if(prototypeAttached){
				
				if(TokenAttacher.isPrototypeAttachedModel(prototypeAttached, 2)){					
					//Set Pos
					let posData = foundry.utils.getProperty(objData, `flags.${moduleName}.pos`);
					posData.base_id = allocator.allocate();
					posData.rotation = objData.rotation;
					foundry.utils.setProperty(objData, `flags.${moduleName}.pos`, posData);
					//Update attached
					let migratedPrototypeAttached = {};
					for (const key in prototypeAttached){
						if (prototypeAttached.hasOwnProperty(key)) {
							migratedPrototypeAttached[key]=prototypeAttached[key].objs.map(item => item);
							for (let i = 0; i < migratedPrototypeAttached[key].length; i++) {
								const element = migratedPrototypeAttached[key][i];
								await TokenAttacher.migrateElement(objData, type, element, key, allocator);
							}
						}
					}
					foundry.utils.setProperty(objData, `flags.${moduleName}.prototypeAttached`, migratedPrototypeAttached);
				}
			}
			return objData;
		}

		static async migrateAllActorCompendiums(){
			const allCompendiums = [...game.packs].filter(pack =>{
				if(pack.locked) return false;
				if(pack.documentName !== "Actor") return false;
				return true;
			});
			if(allCompendiums.length === 0) return TokenAttacher.noop(localizedStrings.error.NoCompendiumsToMigrate);
			
			for (let i = 0; i < allCompendiums.length; i++) {
				const pack = allCompendiums[i];
				const packIndex = await pack.getIndex();
				console.log("Token Attacher | " + game.i18n.format(localizedStrings.info.MigratingCompendium, {compendium: pack.metadata.label}) );
				ui.notifications.info(game.i18n.format(localizedStrings.info.MigratingCompendium, {compendium: pack.metadata.label}));
				
				for (const index of packIndex) {
					const entity = await pack.getDocument(index._id);
					const prototypeAttached = foundry.utils.getProperty(entity, `prototypeToken.flags.${moduleName}.prototypeAttached`);
					if(prototypeAttached){
						if(TokenAttacher.isPrototypeAttachedModel(prototypeAttached, 2)){
							const update = await TokenAttacher.migrateActor(entity, true);
							await entity.update({prototypeToken: update});
						}
					}
				}
			}
			console.log("Token Attacher | " + game.i18n.format(localizedStrings.info.MigratedCompendiums));
			ui.notifications.info(game.i18n.format(localizedStrings.info.MigratedCompendiums, {count: allCompendiums.length}));
			return {status: "success", changed: allCompendiums.length};
		}

		static updatedLockedAttached(){
			const tokens = canvas.tokens?.placeables ?? [];
			for (const token of tokens) {
				const attached=token.document.getFlag(moduleName, "attached") || {};
				if(Object.keys(attached).length == 0) continue;
				const isLocked = token.document.getFlag(moduleName, "locked") || false;
				if(isLocked)
					for (const key in attached) {
						if (attached.hasOwnProperty(key) && key !== "unknown") {
							for (const elementid of attached[key]) {
								let element = TokenAttacher.layerGetElement(key, elementid);
								if(element) TokenAttacher.lockElement(key, element, false);
							}
						}
					}
			}
		}

		static lockElement(type, element, interactive){
			if(!element) return false;
			const setInteractive = target => {
				if(!target) return;
				if(TokenAttacher.isV14() || ("eventMode" in target)){
					target.eventMode = interactive ? "static" : "none";
				}
				else target.interactive = interactive;
			};

			if(type === "Wall"){
				setInteractive(element.line);
				setInteractive(element.endpoints);
				return true;
			}

			const target = element.mouseInteractionManager?.target ?? element.controlIcon ?? element;
			setInteractive(target);
			return true;
		}
		static UpdateBasePosition(type, document, change, options, userId){
			//Ignore anything from anyone not in your scene
			if(game.users.find(u => u._id ==userId)?.viewedScene != game.user.viewedScene) return;

			if(!(	change.hasOwnProperty("x")
				||	change.hasOwnProperty("y")
				||	change.hasOwnProperty("c")
				||	change.hasOwnProperty("rotation")
				||	change.hasOwnProperty("direction")
				||	change.hasOwnProperty("width")
				||	change.hasOwnProperty("height")
				||	change.hasOwnProperty("shape")
				||	change.hasOwnProperty("level")
				||	change.hasOwnProperty("radius")
				||	change.hasOwnProperty("dim")
				||	change.hasOwnProperty("bright")
				||	change.hasOwnProperty("distance")
				||	change.hasOwnProperty("hidden")

				||	change.hasOwnProperty("elevation")
				||	change.flags?.levels?.hasOwnProperty("rangeTop")
				||	change.flags?.wallHeight?.hasOwnProperty("wallHeightTop")
				||	change.flags?.['wall-height']?.hasOwnProperty("top")
				)){
				return true;
			}
			if(!document.getFlag(moduleName, "attached")) return true;

			let baseData = foundry.utils.duplicate(document);
			foundry.utils.mergeObject(baseData, change);
			let basePos = TokenAttacher.saveBasePositon(type, baseData, true);
			foundry.utils.mergeObject(change, basePos);
			return true;
		}

		static async UpdateAttachedOfToken(type, document, change, options, userId){
			if(!foundry.utils.getProperty(options, `${moduleName}.attachmentsNeedUpdate`)) return;
			if(game.userId !== userId) return {status: "ignored"};
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene(document, "Move attached objects");
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure("Move attached objects", error, {documentId: document?.id});
			}

			const attached=document.getFlag(moduleName, "attached") || {};
			if(Object.keys(attached).length == 0) return true;

			if(game.userId === userId && game.user.isGM){
				let quickEdit = foundry.utils.getProperty(window, 'tokenAttacher.quickEdit');
				if(quickEdit && canvas.scene._id === quickEdit.scene){
					if(!foundry.utils.getProperty(options, `${moduleName}.QuickEdit`)) return;
					clearTimeout(quickEdit.timer);
					TokenAttacher._quickEditUpdateOffsetsOfBase(quickEdit, type, document);
					quickEdit.timer = TokenAttacher.scheduleQuickEditSave(quickEdit);
					return;
				}
			}
			if(foundry.utils.getProperty(options, `${moduleName}.QuickEdit`)) return;
			if(foundry.utils.getProperty(options, `${moduleName}.update`)) return true;

			const activeGM = game.users.find(user => user.isGM && user.active && user.viewedScene === scene.id);
			if(!activeGM){
				return TokenAttacher.reportSceneActionFailure("Move attached objects", new Error(TokenAttacher.format(localizedStrings.error.NoActiveGMFound)), {
					documentId: document?.id,
					sceneId: scene.id
				});
			}

			const duration = document.movement?.animation?.duration;
			const updateOptions = Number.isFinite(duration) ? {animation: {duration}} : {};
			const resizeFields = ["width", "height", "depth", "shape"];
			const movement = document.movement;
			const resizeRegions = movement?.id
				? resizeFields.some(field => movement.origin?.[field] !== movement.destination?.[field])
				: resizeFields.some(field => Object.hasOwn(change, field));
			const baseData = foundry.utils.mergeObject(document.toObject(), change, {inplace: false});
			const eventdata = [type, baseData, false, updateOptions, resizeRegions];
			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._UpdateAttachedOfBase(...eventdata, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("UpdateAttachedOfBase", eventdata, {
				action: "Move attached objects",
				sceneId: scene.id
			});
		}

		static async _UpdateAttachedOfBase(type, baseData, return_data=false, updateOptions={}, resizeRegions=false, {
			scene=canvas.scene,
			strictScene=false,
			diagnostics=null,
			canvasEpoch=TokenAttacher.ensureRuntimeState().canvasEpoch
		}={}){
			if(!(scene?.updateEmbeddedDocuments instanceof Function)){
				throw new Error("The attachment Scene is unavailable.");
			}
			const assertSceneActive = () => {
				const state = TokenAttacher.ensureRuntimeState();
				if(canvas.scene?.id !== scene.id || state.canvasEpoch !== canvasEpoch){
					throw new Error(`Attached-object movement for Scene ${scene.id} was aborted because its canvas is no longer active.`);
				}
			};
			assertSceneActive();
			diagnostics ??= {foreign: [], unresolved: [], nativeManaged: 0};
			const attached=foundry.utils.getProperty(baseData, `flags.${moduleName}.attached`) || {};
			let attachedEntities = {};
			
			//Get Entities
			for (const key in attached) {
				const documentType = TokenAttacher.normalizeDocumentType(key);
				attachedEntities[documentType] ??= [];
				for(const id of attached[key]){
					const entity = TokenAttacher.getSceneDocument(scene, documentType, id)
						?? (strictScene ? null : TokenAttacher.getElementDocument(documentType, id));
					if(!entity){
						diagnostics.unresolved.push({baseId: baseData._id, documentType, documentId: id});
						continue;
					}
					const parentIds = TokenAttacher.getAttachmentParentIds(entity, documentType);
					const foreignParentIds = [...parentIds].filter(parentId => parentId !== baseData._id);
					if(!parentIds.has(baseData._id) || foreignParentIds.length){
						diagnostics.foreign.push({
							baseId: baseData._id,
							documentType,
							documentId: id,
							actualParentIds: [...parentIds]
						});
						continue;
					}
					attachedEntities[documentType].push(entity);
				}
				if(!attachedEntities[documentType].length) delete attachedEntities[documentType];
			}

			//V14 moves attached Regions itself, including every Region shape type.
			if(TokenAttacher.isV14() && !resizeRegions && attachedEntities.Region){
				attachedEntities.Region = attachedEntities.Region.filter(region => {
					const parentId = TokenAttacher.getNativeRegionParentId(region);
					if(parentId !== baseData._id) return true;
					diagnostics.nativeManaged += 1;
					return false;
				});
				if(!attachedEntities.Region.length) delete attachedEntities.Region;
			}

			let updates = {};

			//Get updates for attached elements
			for (const key in attachedEntities) {
				if (attachedEntities.hasOwnProperty(key)) {
					assertSceneActive();
					if(!updates.hasOwnProperty(key)) updates[key] = [];
					updates[key] = TokenAttacher.offsetPositionOfElements(key, attachedEntities[key].map(entity => foundry.utils.duplicate(entity)), type, baseData, {});
					if(!updates[key]) delete updates[key];
				}
			}

			for (const key in attachedEntities) {
				if (attachedEntities.hasOwnProperty(key)) {
					for (let i = 0; i < attachedEntities[key].length; i++) {
						const element = attachedEntities[key][i];
						const elem_id = element._id;
						
						const elem_attached=foundry.utils.getProperty(element, `flags.${moduleName}.attached`) || {};
						if(Object.keys(elem_attached).length > 0){
							const elem_update = updates[key].find(item => item._id === elem_id );
							const updatedElementData = foundry.utils.mergeObject(foundry.utils.duplicate(element), elem_update);
							const subUpdates = await TokenAttacher._UpdateAttachedOfBase(
								key,
								updatedElementData,
								true,
								updateOptions,
								resizeRegions,
								{scene, strictScene, diagnostics, canvasEpoch}
							);
							assertSceneActive();
							for (const key in subUpdates) {
								if (subUpdates.hasOwnProperty(key)) {
									updates[key] = subUpdates[key].concat(updates[key] ?? []);	
									let base_updates = updates[key].filter(item => item._id === elem_id);
									if(base_updates.length > 0){
										let non_base_updates = updates[key].filter(item => item._id !== elem_id);
										let merge_update = {};
										for (let j = 0; j < base_updates.length; j++) {
											merge_update = foundry.utils.mergeObject(merge_update, base_updates[j]);
											
										}
										non_base_updates.push(merge_update);
										updates[key] = non_base_updates;
									}
								
								}
							}
						}
					}
				}
			}
			if(return_data) return updates;
			const skippedCount = diagnostics.foreign.length + diagnostics.unresolved.length;
			if(skippedCount){
				console.warn("Token Attacher | skipped stale attachment references during movement", {
					sceneId: scene.id,
					foreign: diagnostics.foreign,
					unresolved: diagnostics.unresolved
				});
				TokenAttacher.notify("warn", localizedStrings.error.ActionFailed, {
					action: "Move attached objects",
					message: `${skippedCount} stale or foreign-owned attachment reference(s) were skipped.`
				});
			}
			assertSceneActive();
			
			//Fire all updates together so every attachment starts with the parent.
			const writeResults = await Promise.all(Object.entries(updates).map(async ([key, typeUpdates]) => {
				const documentType = TokenAttacher.normalizeDocumentType(key);
				const documents = await TokenAttacher.updateEmbeddedDocuments(documentType, typeUpdates, {
					...updateOptions,
					[moduleName]: {update: true}
				}, scene);
				return {documentType, typeUpdates, documents};
			}));
			const failedTokenIds = writeResults
				.filter(result => result.documentType === "Token")
				.flatMap(result => {
					const completedIds = new Set((result.documents ?? []).map(document => document.id ?? document._id));
					return result.typeUpdates.map(update => update._id).filter(id => !completedIds.has(id));
				});
			if(failedTokenIds.length){
				const error = new Error(`Foundry prevented movement for attached Token(s): ${failedTokenIds.join(", ")}`);
				error.failedTokenIds = failedTokenIds;
				throw error;
			}

			const changed = Object.values(updates).reduce((count, typeUpdates) => count + typeUpdates.length, 0)
				+ diagnostics.nativeManaged;
			if(changed === 0){
				if(!skippedCount) TokenAttacher.notify("warn", localizedStrings.error.NoAttachments);
				return {status: "noop", changed: 0, notified: true};
			}
			return {status: "success", changed, notified: skippedCount > 0};
		}

		//base can be an PlacableObject but also plain data if return_data is true
		static getBasePositon(type, base, overrideData){
			let pos;
			let objData = base.document ?? base;
			objData = foundry.utils.duplicate(objData);
			const center = TokenAttacher.getCenter(type, objData);
			if(overrideData) objData = foundry.utils.mergeObject(objData, overrideData);

			pos = {base_id: foundry.utils.getProperty(objData, '_id')
				, xy: {x:objData.x, y:objData.y}
				, center: {x:center.x, y:center.y}
				, rotation:objData.rotation ?? objData.direction
				, hidden: objData.hidden
				, elevation: objData.elevation ?? objData.flags?.levels?.rangeBottom ?? objData.flags?.wallHeight?.wallHeightBottom ?? objData.flags?.['wall-height']?.bottom
			};

			let objSizeData = foundry.utils.duplicate(base.document ?? base);
			let validKeys = [
				'width', 'radius', 'distance', 'config','height'
				];
			Object.keys(objSizeData).forEach((key) =>{
				validKeys.includes(key) || delete objSizeData[key];
			});
			if(objSizeData.config){
				validKeys = [
					'dim', 'bright'
					];
				Object.keys(objSizeData.config).forEach((key) =>{
					validKeys.includes(key) || delete objSizeData.config[key];
				});
			}
			pos = foundry.utils.mergeObject(pos, objSizeData);

			return pos;
		}

		//base can be an PlacableObject but also plain data if return_data is true
		static saveBasePositon(type, base, return_data=false, overrideData){
			let objData = base.document ?? base;
			const pos = TokenAttacher.getBasePositon(type, base, overrideData);
			if(!return_data) return base.document.setFlag(moduleName, "pos", pos);

			return {_id:objData._id, 
				[`flags.${moduleName}.pos`]: pos};
		}

		static offsetPositionOfElements(type, objData, baseType, baseData, grid, grid_multi=TokenAttacher.getDefaultGridMultiplier()){
			let baseOffset = {};
			baseOffset.center = TokenAttacher.getCenter(baseType, baseData, grid);
			baseOffset.rotation = foundry.utils.getProperty(baseData, "rotation") ?? foundry.utils.getProperty(baseData, "direction");
			baseOffset.size = TokenAttacher.getSize(baseData);
			baseOffset.elevation = baseData.elevation?.bottom ?? baseData.elevation ?? baseData.flags?.levels?.elevation ?? baseData.flags?.levels?.rangeBottom ?? baseData.flags?.wallHeight?.wallHeightBottom ?? baseData.flags?.['wall-height']?.bottom ?? 0;
			
			if(!Array.isArray(objData)) objData = [objData];

			let updates = objData.map(document => {
				return foundry.utils.mergeObject(
					{_id: document._id},
					TokenAttacher.offsetPositionOfElement(type, document, baseType, baseData, baseOffset, grid_multi)
					);
			});
			if(Object.keys(updates).length == 0)  return; 
			return updates;		
		}

		static offsetPositionOfElement(type, objData, baseType, baseData, baseOffset, grid_multi=TokenAttacher.getDefaultGridMultiplier()){
			foundry.utils.setProperty(objData, `flags.${moduleName}.offset`, 
				TokenAttacher.updateOffsetWithGridMultiplicator(type, objData.flags[moduleName].offset, grid_multi));
			const offset = foundry.utils.getProperty(objData, `flags.${moduleName}.offset`);
			const size_multi = {w: baseOffset.size[0] / offset.size.widthBase, h: baseOffset.size[1] / offset.size.heightBase};
			let update = {};

			//V12 changed z to sort				
			if('z' in objData){
				objData.sort = objData.z;
				delete objData.z;
			}

			//Elevation
			if(typeof offset.elevation?.elevation === "number"){
				update.elevation = baseOffset.elevation + offset.elevation.elevation;
			}

			//Line Entities
			if(type === "Region"){
				// Region geometry is handled by the core compatibility hook below.
			}
			else if('c' in objData){
				let c = foundry.utils.duplicate(objData.c);	
				[offset.x, offset.y] = [offset.c[0], offset.c[1]];
				[c[0],c[1]]  = TokenAttacher.moveRotatePoint(offset, baseOffset.center, baseOffset.rotation, size_multi);
				[offset.x, offset.y] = [offset.c[2], offset.c[3]];
				[c[2],c[3]]  = TokenAttacher.moveRotatePoint(offset, baseOffset.center, baseOffset.rotation, size_multi);
				update.c=c;
				//return update;
			}
			//Rectangle Entities
			else if(('shape' in objData && typeof objData.shape === 'object' && 'width' in objData.shape) 
					|| 'width' in objData 
					|| 'distance' in objData 
					|| 'dim' in objData 
					|| (objData.hasOwnProperty('config') && 'dim' in objData.config) 
					|| 'radius' in objData){
				const [x,y,rotation] =TokenAttacher.moveRotateRectangle(type, objData, offset, baseOffset.center, baseOffset.rotation, size_multi);
				update.x = x;
				update.y = y;
				if(objData.hasOwnProperty("direction")) update.direction = rotation;
				if(objData.hasOwnProperty("rotation")) update.rotation = rotation;
				
				if(objData.hasOwnProperty('width') && objData.width != null){
					update.width 	= offset.size.width  * size_multi.w;
					update.height 	= offset.size.height * size_multi.h;
				}
				if(objData.shape?.hasOwnProperty('width') && objData.shape.width != null){
					if(!update.shape) update.shape = {};
					update.shape.width 	= offset.size.width  * size_multi.w;
					update.shape.height 	= offset.size.height * size_multi.h;
				}
				if(objData.hasOwnProperty('distance')){
					update.distance = offset.size.distance * size_multi.w;
				}
				if(objData.hasOwnProperty('dim')){
					update.dim 		= offset.size.dim    * size_multi.w;
					update.bright 	= offset.size.bright * size_multi.w;
				}
				if(objData.hasOwnProperty('config') && objData.config.hasOwnProperty('dim')){
					update.config = {};
					update.config.dim 		= (offset.size.config?.dim ?? offset.size.dim)   * size_multi.w;
					update.config.bright 	= (offset.size.config?.bright ?? offset.size.bright) * size_multi.w;
				}
				if(objData.hasOwnProperty('radius')){
					update.radius 	= offset.size.radius * size_multi.w;
				}
				if(objData.hasOwnProperty('points')){
					let points = foundry.utils.duplicate(objData.points);
					for (let i = 0; i < points.length; i++) {
						points[i][0] = offset.points[i][0] * size_multi.w;
						points[i][1] = offset.points[i][1] * size_multi.h;					
					}
					update.points = points;
				}
				if(objData.shape?.hasOwnProperty('points')){
					let points = foundry.utils.duplicate(objData.shape.points);
					for (let i = 0; i < points.length/2; i+=2) {
						points[i] = offset.points[i/2][0] * size_multi.w;
						points[i+1] = offset.points[i/2][1] * size_multi.h;					
					}
					if(!update.shape) update.shape = {};
					update.shape.points = points;
				}
				//return update;
			}
			//Point Entities
			else{
				const [x,y] = TokenAttacher.moveRotatePoint(offset, baseOffset.center, baseOffset.rotation, size_multi);
				update.x = x;
				update.y = y;
			}
			if(TokenAttacher.isV14() && (type === "Token") && (baseType === "Token") && baseData.level){
				update.level = baseData.level;
			}
			else if(TokenAttacher.isV14() && Array.isArray(objData.levels) && baseData.level){
				update.levels = [baseData.level];
			}
			if(Object.hasOwn(baseData, "hidden") && Object.hasOwn(objData, "hidden")) update.hidden = baseData.hidden;
			//Other Modules
			Hooks.callAll(`${moduleName}.offsetPositionOfElement`, type, objData, baseType, baseData, baseOffset, grid_multi, update);

			return update;
		}

		static computeRotatedPosition(x,y,x2,y2,rotRad, size_multi){
			const dx = (x2 - x) * size_multi.w,
			dy = (y2 - y) * size_multi.h;
			return [x + Math.cos(rotRad)*dx - Math.sin(rotRad)*dy,
				y + Math.sin(rotRad)*dx + Math.cos(rotRad)*dy];
		}

		/**
		 * Moves a rectangle by offset values and rotates around an anchor
		 * A rectangle is defined by having a center, _id, x, y and rotation or direction
		 */
		static moveRotateRectangle(type, rect, offset, anchorCenter, anchorRot, size_multi){
			let x =anchorCenter.x + offset.x;
			let	y =anchorCenter.y + offset.y; 
			let newRot = (anchorRot + offset.offRot) % 360;
			//if(newRot != offset.rot){
				// get vector from center to template
				const deltaRotRad = Math.toRadians((newRot - offset.rot) % 360);
				// rotate vector around angle
				let rectCenter = {};
				rectCenter.x = anchorCenter.x + offset.centerX;
				rectCenter.y = anchorCenter.y + offset.centerY;
				[rectCenter.x,rectCenter.y] = TokenAttacher.computeRotatedPosition(anchorCenter.x, anchorCenter.y, rectCenter.x, rectCenter.y, deltaRotRad, size_multi);
				if(TokenAttacher.isV14() && (type === "Tile") && (rect.texture?.anchorX !== undefined) && (rect.texture?.anchorY !== undefined)){
					const width = (offset.size.width ?? rect.width) * size_multi.w;
					const height = (offset.size.height ?? rect.height) * size_multi.h;
					const a = Math.toRadians(newRot);
					const dx = (0.5 - rect.texture.anchorX) * width;
					const dy = (0.5 - rect.texture.anchorY) * height;
					x = rectCenter.x - ((Math.cos(a) * dx) - (Math.sin(a) * dy));
					y = rectCenter.y - ((Math.sin(a) * dx) + (Math.cos(a) * dy));
				}
				else{
					x = rectCenter.x - (offset.centerX - offset.x) * size_multi.w;
					y = rectCenter.y - (offset.centerY - offset.y) * size_multi.h;
				}
			//}
			return [x, y, newRot];
		}

		/**
		 * Moves a point by offset values and rotates around an anchor
		 * A point is defined by x,y,rotation
		 */
		static moveRotatePoint(offset, anchorCenter, anchorRot, size_multi){		
			const point = {
				x: 0,
				y: 0,
				rotation: 0
			}	
			point.x = anchorCenter.x + offset.x;
			point.y = anchorCenter.y + offset.y; 
			point.rotation=(anchorRot + offset.offRot) % 360;
			//if(point.rotation != offset.rot){
				// get vector from center to template
				const deltaRotRad = Math.toRadians((point.rotation - offset.rot) % 360);
				// rotate vector around angle
				[point.x, point.y] = TokenAttacher.computeRotatedPosition(anchorCenter.x, anchorCenter.y, point.x, point.y, deltaRotRad, size_multi);
				
			//}	
			return [point.x, point.y, point.rotation];
		}

		/**
		 * Only the first active GM has to do the work
		 */
		static isFirstActiveGM(sceneId=game.user.viewedScene){
			if(!sceneId) return false;
			const firstGm = game.users.find((u) => u.isGM && u.active && u.viewedScene === sceneId);
			if (firstGm && game.user === firstGm) {
				return true;
			}
			return false;
		}

		static isFirstActiveGMAnywhere(){
			const firstGm = game.users.find((user) => user.isGM && user.active);
			return Boolean(firstGm && game.user === firstGm);
		}

		static getDocumentSceneId(value){
			const document = value?.document ?? value;
			const parent = document?.parent;
			if(parent?.documentName === "Scene" || parent?.tokens || parent?.getEmbeddedDocument || parent?.updateEmbeddedDocuments){
				return parent.id ?? parent._id ?? null;
			}
			return value?.scene?.id ?? value?.scene?._id ?? null;
		}

		static resolveOriginatingScene(values, action="Token Attacher action"){
			if(!Array.isArray(values)) values = [values];
			const sceneIds = new Set(values.map(value => TokenAttacher.getDocumentSceneId(value)).filter(Boolean));
			if(sceneIds.size > 1){
				throw new Error(`${action} was rejected because its documents belong to different Scenes.`);
			}
			const sceneId = sceneIds.values().next().value ?? canvas.scene?.id;
			if(!sceneId) throw new Error(`${action} was rejected because its originating Scene is unavailable.`);
			const scene = game.scenes.get(sceneId) ?? (canvas.scene?.id === sceneId ? canvas.scene : null);
			if(!scene) throw new Error(`${action} was rejected because Scene ${sceneId} no longer exists.`);
			return scene;
		}

		static reportSceneActionFailure(action, error, context={}){
			console.error("Token Attacher | scene-bound action rejected", {action, ...context}, error);
			TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {
				action: TokenAttacher.format(action),
				message: error?.message ?? String(error)
			});
			return {status: "error", error};
		}

		static relayHookFailure(result, {action, userId, sceneId=null, documentId=null}={}){
			if(result?.status !== "error" || !userId || userId === game.userId || !game.user.isGM) return false;
			const error = result.error instanceof Error ? result.error : new Error(result.error?.message ?? String(result.error ?? "Unknown hook failure"));
			try {
				game.socket.emit(`module.${moduleName}`, {
					event: "__hookFailure",
					requesterId: userId,
					reporterId: game.userId,
					action: TokenAttacher.format(action),
					sceneId,
					documentId,
					error: {message: error.message, stack: error.stack}
				});
				return true;
			}
			catch(relayError){
				console.error("Token Attacher | failed to relay a document-hook failure to its initiating user", {
					action,
					userId,
					sceneId,
					documentId
				}, relayError);
				return false;
			}
		}

		static handleHookFailure(message){
			if(message?.requesterId !== game.user.id) return false;
			const error = new Error(message.error?.message ?? `${message.action ?? "A Token Attacher hook"} failed.`);
			console.error("Token Attacher | remote document-hook action failed", {
				action: message.action,
				reporterId: message.reporterId,
				sceneId: message.sceneId,
				documentId: message.documentId,
				remoteStack: message.error?.stack
			}, error);
			TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {
				action: message.action ?? "Token Attacher",
				message: error.message
			});
			return true;
		}

		static getSceneDocument(scene, type, id){
			if(!scene || !id) return null;
			type = TokenAttacher.normalizeDocumentType(type);
			try {
				const document = scene.getEmbeddedDocument?.(type, id);
				if(document) return document;
			}
			catch(error){
				console.debug("Token Attacher | Scene document lookup used a compatibility fallback", {
					sceneId: scene.id,
					documentType: type,
					documentId: id,
					error
				});
			}
			const collection = type === "Token" ? scene.tokens : scene.getEmbeddedCollection?.(type);
			return collection?.get?.(id) ?? null;
		}

		static requireSocketScene(message){
			if(typeof message?.sceneId !== "string" || !message.sceneId){
				throw new Error(`Socket ${message?.event ?? "action"} was rejected because it did not identify an originating Scene.`);
			}
			const scene = game.scenes.get(message.sceneId);
			if(!scene){
				throw new Error(`Socket ${message.event} was rejected because Scene ${message.sceneId} no longer exists.`);
			}
			return scene;
		}

		static requireSceneDocument(scene, type, value, label=type){
			const providedDocument = value?.document ?? (typeof value === "object" ? value : null);
			const providedSceneId = TokenAttacher.getDocumentSceneId(providedDocument);
			if(providedSceneId && providedSceneId !== scene.id){
				throw new Error(`${label} belongs to Scene ${providedSceneId}, not the requested Scene ${scene.id}.`);
			}
			const id = providedDocument?._id ?? providedDocument?.id ?? value;
			if(typeof id !== "string" || !id) throw new Error(`${label} did not identify a valid document.`);
			const document = TokenAttacher.getSceneDocument(scene, type, id);
			if(!document) throw new Error(`${label} ${id} was not found in Scene ${scene.id}.`);
			const resolvedSceneId = TokenAttacher.getDocumentSceneId(document);
			if(resolvedSceneId && resolvedSceneId !== scene.id){
				throw new Error(`${label} ${id} resolved to Scene ${resolvedSceneId}, not ${scene.id}.`);
			}
			return document;
		}

		static shouldHandleSocketMessage(message){
			if(typeof message?.sceneId !== "string" || !game.scenes.get(message.sceneId)){
				return TokenAttacher.isFirstActiveGMAnywhere();
			}
			return TokenAttacher.isFirstActiveGM(message.sceneId);
		}

		/**
		 * Warn the player if a token was moved that has attached parts
		 */
		static detectGM(sceneId=game.user.viewedScene){
			const firstGm = game.users.find((u) => u.isGM && u.active && u.viewedScene === sceneId);
			if(!firstGm){
				return ui.notifications.error(game.i18n.format(localizedStrings.error.NoActiveGMFound));
			}
		}

		static emitSocketAction(event, eventdata, {action=event, successKey=null, noopKey=null, sceneId=canvas.scene?.id}={}){
			const state = TokenAttacher.ensureRuntimeState();
			const requestId = foundry.utils.randomID?.()
				?? `${game.user.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			const requesterId = game.user.id;
			const actionLabel = TokenAttacher.format(action);

			return new Promise(resolve => {
				const timeout = setTimeout(() => {
					state.pendingSocketRequests.delete(requestId);
					const error = new Error(`No active GM acknowledged ${actionLabel}.`);
					console.error("Token Attacher | socket request timed out", {event, requestId, requesterId}, error);
					TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {action: actionLabel, message: error.message});
					resolve({status: "error", error});
				}, 15000);
				state.pendingSocketRequests.set(requestId, {resolve, timeout, actionLabel, successKey, noopKey});
				try {
					game.socket.emit(`module.${moduleName}`, {event, eventdata, requestId, requesterId, sceneId});
				}
				catch(error){
					clearTimeout(timeout);
					state.pendingSocketRequests.delete(requestId);
					console.error("Token Attacher | socket request could not be sent", {event, requestId, requesterId}, error);
					TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {action: actionLabel, message: error?.message ?? String(error)});
					resolve({status: "error", error});
				}
			});
		}

		static handleSocketResult(message){
			if(message.requesterId !== game.user.id) return;
			const state = TokenAttacher.ensureRuntimeState();
			const pending = state.pendingSocketRequests.get(message.requestId);
			if(!pending) return;
			state.pendingSocketRequests.delete(message.requestId);
			clearTimeout(pending.timeout);

			if(message.ok){
				const result = message.result ?? {status: "success"};
				if(result.status === "noop" && pending.noopKey){
					TokenAttacher.notify("warn", pending.noopKey);
					result.notified = true;
				}
				else if(result.status !== "noop" && pending.successKey){
					TokenAttacher.notify("info", pending.successKey, {count: result.changed});
				}
				pending.resolve(result);
				return;
			}

			const error = new Error(message.error?.message ?? `The GM could not complete ${pending.actionLabel}.`);
			console.error("Token Attacher | remote socket action failed", {
				requestId: message.requestId,
				action: pending.actionLabel,
				remoteStack: message.error?.stack
			}, error);
			TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {action: pending.actionLabel, message: error.message});
			pending.resolve({status: "error", error});
		}

		/**
		 * Listen to custom socket events, so players can move elements indirectly through the gm
		 */
		static listen(message){
			if(message?.event === "__result"){
				TokenAttacher.handleSocketResult(message);
				return Promise.resolve();
			}
			if(message?.event === "__hookFailure"){
				TokenAttacher.handleHookFailure(message);
				return Promise.resolve();
			}
			window.tokenAttacher ??= {};
			const listenQueue = window.tokenAttacher.listenQueue ??= {queue: [], running: false, worker: null};
			if(!Array.isArray(listenQueue.queue)) listenQueue.queue = [];
			if(typeof listenQueue.running !== "boolean") listenQueue.running = false;
			if(!(listenQueue.worker instanceof Promise)) listenQueue.worker = null;

			listenQueue.queue.push(message);
			if(!listenQueue.worker){
				listenQueue.worker = Promise.resolve().then(() => TokenAttacher.workListenQueue());
			}
			return listenQueue.worker;
		}

		static async workListenQueue(){
			window.tokenAttacher ??= {};
			const listenQueue = window.tokenAttacher.listenQueue ??= {queue: [], running: false, worker: null};
			if(!Array.isArray(listenQueue.queue)) listenQueue.queue = [];
			if(listenQueue.running) return;

			listenQueue.running = true;
			try {
				while(listenQueue.queue.length > 0){
					const message = listenQueue.queue.shift();
					if(!TokenAttacher.shouldHandleSocketMessage(message)) continue;
						try {
							const result = await TokenAttacher._dispatchSocketMessage(message);
							if(message?.requestId){
								game.socket.emit(`module.${moduleName}`, {
									event: "__result",
									requestId: message.requestId,
									requesterId: message.requesterId,
									ok: true,
									result: {
										status: result?.status ?? "success",
										changed: result?.changed
									}
								});
							}
						}
						catch(error){
						const event = message?.event ?? "unknown";
						console.error("Token Attacher | socket event failed", {
							event,
							remainingQueueLength: listenQueue.queue.length
						}, error);
						try {
							TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {
								action: `Socket: ${event}`,
								message: error?.message ?? String(error)
							});
						}
							catch(notificationError){
								console.error("Token Attacher | failed to report socket error", notificationError);
							}
							if(message?.requestId){
								game.socket.emit(`module.${moduleName}`, {
									event: "__result",
									requestId: message.requestId,
									requesterId: message.requesterId,
									ok: false,
									error: {message: error?.message ?? String(error), stack: error?.stack}
								});
							}
						}
				}
			}
			finally {
				listenQueue.running = false;
				listenQueue.worker = null;
				if(listenQueue.queue.length > 0){
					listenQueue.worker = Promise.resolve().then(() => TokenAttacher.workListenQueue());
				}
			}
		}

		static async _dispatchSocketMessage(message){
			if(!message || typeof message.event !== "string" || !Array.isArray(message.eventdata)){
				throw new TypeError("Invalid Token Attacher socket message");
			}
			const scene = TokenAttacher.requireSocketScene(message);

			switch (message.event) {
				case "createPlaceableObjects": {
					const [createdObjs, options, userId] = message.eventdata;
					return TokenAttacher.batchPostProcess(scene, createdObjs, options, userId);
				}
				case "AttachToToken": {
					const [token, elements, suppressNotification=false] = message.eventdata;
					const tokenDocument = TokenAttacher.requireSceneDocument(scene, "Token", token, "Attachment base Token");
					return TokenAttacher._AttachToToken(tokenDocument, elements, suppressNotification, false, {scene, strictScene: true});
				}
				case "DetachFromToken": {
					const [token, elements, suppressNotification=false, options={}] = message.eventdata;
					const tokenDocument = TokenAttacher.requireSceneDocument(scene, "Token", token, "Attachment base Token");
					return TokenAttacher._DetachFromToken(tokenDocument, elements, suppressNotification, {...options, scene, strictScene: true});
				}
				case "attachElementsToToken": {
					const [selected, token, suppressNotification=false] = message.eventdata;
					const tokenDocument = TokenAttacher.requireSceneDocument(scene, "Token", token, "Attachment base Token");
					return TokenAttacher._attachElementsToToken(selected, tokenDocument, suppressNotification, {scene, strictScene: true});
				}
				case "detachElementsFromToken": {
					const [selected, token, suppressNotification=false] = message.eventdata;
					const tokenDocument = TokenAttacher.requireSceneDocument(scene, "Token", token, "Attachment base Token");
					return TokenAttacher._detachElementsFromToken(selected, tokenDocument, suppressNotification, {scene, strictScene: true});
				}
				case "ReattachAfterUndo": {
					const [type, entity, options, userId] = message.eventdata;
					const document = TokenAttacher.requireSceneDocument(scene, type, entity, `${type} attachment`);
					return TokenAttacher._ReattachAfterUndo(type, document, options, userId, {scene, strictScene: true});
				}
				case "UpdateAttachedOfBase": {
					const [type, baseData, returnData=false, updateOptions={}, resizeRegions=false] = message.eventdata;
					TokenAttacher.requireSceneDocument(scene, type, baseData, `${type} attachment base`);
					return TokenAttacher._UpdateAttachedOfBase(type, baseData, returnData, updateOptions, resizeRegions, {scene, strictScene: true});
				}
				case "setElementsLockStatus": {
					const [elements, isLocked, suppressNotification=false] = message.eventdata;
					return TokenAttacher._setElementsLockStatus(elements, isLocked, suppressNotification, {scene, strictScene: true});
				}
				case "setElementsMoveConstrainedStatus": {
					const [elements, canMoveConstrained, suppressNotification=false, options={}] = message.eventdata;
					return TokenAttacher._setElementsMoveConstrainedStatus(elements, canMoveConstrained, suppressNotification, options, {scene, strictScene: true});
				}
				default:
					throw new Error(`Unsupported Token Attacher socket event: ${message.event}`);
			}
		}

		/**
		 * Attach elements to token
		 */
		static async _AttachToToken(token, elements, suppressNotification=false, return_data=false, options={}){
			const scene = options.scene ?? (token?.document ?? token)?.parent ?? canvas.scene;
			if(typeof token === 'string' || token instanceof String){
				token = TokenAttacher.getSceneDocument(scene, "Token", token)
					?? (options.strictScene ? null : canvas.tokens.get(token));
			}
			const tokenDocument = token?.document ?? token;
			if(!tokenDocument){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoTokensSelected);
				return return_data ? {} : {status: "noop", notified: !suppressNotification};
			}
			if(!elements?.hasOwnProperty("type") || !Array.isArray(elements.ids)){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NothingSelected);
				return return_data ? {} : {status: "noop", notified: !suppressNotification};
			}
			elements = {...elements, type: TokenAttacher.normalizeDocumentType(elements.type)};
			const baseType = token.layer?.constructor.documentName ?? tokenDocument.documentName;
			const targetSceneId = TokenAttacher.getDocumentSceneId(tokenDocument);
			if(targetSceneId && targetSceneId !== scene?.id){
				throw new Error(`Attachment base Token belongs to Scene ${targetSceneId}, not ${scene?.id ?? "an available Scene"}.`);
			}
			const getDocument = id => {
				return TokenAttacher.getSceneDocument(scene, elements.type, id)
					?? (options.strictScene ? null : TokenAttacher.getElementDocument(elements.type, id));
			};

			let updates = {};
			const originalAttached = tokenDocument.getFlag(moduleName, `attached.${elements.type}`);
			const rawAttached = foundry.utils.duplicate(originalAttached || []);
			const parentIdsOf = document => TokenAttacher.getAttachmentParentIds(document, elements.type);
			const currentAttached = rawAttached.filter(id => {
				const document = getDocument(id);
				const parentIds = parentIdsOf(document);
				return document && ![...parentIds].some(parentId => parentId !== tokenDocument._id);
			});
			const currentIds = new Set(currentAttached);
			const requestedDocuments = [...new Set(elements.ids)]
				.map(id => [id, getDocument(id)])
				.filter(([, document]) => Boolean(document));
			const blockedIds = requestedDocuments
				.filter(([, document]) => {
					return [...parentIdsOf(document)].some(parentId => parentId !== tokenDocument._id);
				})
				.map(([id]) => id);
			const blockedIdSet = new Set(blockedIds);
			const requestedIds = requestedDocuments
				.map(([id]) => id)
				.filter(id => !blockedIdSet.has(id));
			const newIds = requestedIds.filter(id => !currentIds.has(id));
			const refreshExisting = options.refreshExisting || (return_data && suppressNotification);
			const updateIds = refreshExisting ? requestedIds : newIds;
			const staleIdsRemoved = rawAttached.length - currentAttached.length;
			if(updateIds.length === 0 && staleIdsRemoved === 0){
				if(!suppressNotification && !return_data){
					const key = blockedIds.length
						? localizedStrings.error.ObjectsAttachedElsewhere
						: localizedStrings.error.NoEligibleAttachedSelection;
					TokenAttacher.notify("warn", key, {count: blockedIds.length});
				}
				return return_data ? {} : {status: "noop", notified: !suppressNotification};
			}
			if(updateIds.length === 0){
				const cleanupUpdate = {
					_id: tokenDocument._id,
					[`flags.${moduleName}.attached.${elements.type}`]: currentAttached
				};
				const diagnostic = {
					sceneId: scene?.id,
					baseId: tokenDocument._id,
					documentType: elements.type,
					staleIdsRemoved,
					blockedIds
				};
				console.warn("Token Attacher | cleaned stale base attachment metadata without reattaching foreign objects", diagnostic);
				if(return_data) return {[baseType]: [cleanupUpdate]};
				if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");
				try {
					await scene.updateEmbeddedDocuments(baseType, [cleanupUpdate], {[moduleName]: {update: true}});
				}
				catch(error){
					const rollback = {_id: tokenDocument._id};
					const path = `flags.${moduleName}.attached.${elements.type}`;
					if(originalAttached === undefined) TokenAttacher.markForDeletion(rollback, path);
					else rollback[path] = foundry.utils.duplicate(originalAttached);
					try {
						await scene.updateEmbeddedDocuments(baseType, [rollback], {[moduleName]: {update: true, rollback: true}});
					}
					catch(rollbackError){
						console.error("Token Attacher | stale attachment cleanup rollback failed", diagnostic, rollbackError);
						error.rollbackErrors = [rollbackError];
					}
					throw error;
				}
				if(!suppressNotification){
					const key = blockedIds.length
						? localizedStrings.error.ObjectsAttachedElsewhere
						: localizedStrings.error.NoEligibleAttachedSelection;
					TokenAttacher.notify("warn", key, {count: blockedIds.length});
				}
				return {status: "noop", changed: staleIdsRemoved, notified: !suppressNotification};
			}
			if(blockedIds.length && requestedIds.length && !suppressNotification){
				TokenAttacher.notify("warn", localizedStrings.error.ObjectsAttachedElsewhere, {count: blockedIds.length});
			}
			const attached = currentAttached.concat(newIds);
			let all_attached=foundry.utils.duplicate(tokenDocument.getFlag(moduleName, `attached`) || {});
			all_attached[elements.type] = attached;
			const dup = TokenAttacher.areDuplicatesInAttachChain(token, all_attached, {scene, strictScene: options.strictScene});
			if(dup !== false){
				console.warn("Token Attacher | attempted to create a duplicate attachment chain", dup);
				if(!suppressNotification) TokenAttacher.notify("error", localizedStrings.error.ElementAlreadyAttachedInChain);
				return return_data ? {} : {status: "noop", notified: !suppressNotification};
			}

			let token_update = await TokenAttacher.saveBasePositon(baseType, tokenDocument, true);
			token_update[`flags.${moduleName}.attached.${elements.type}`] = attached;
			updates[baseType] = [token_update];

			if(!updates.hasOwnProperty(elements.type)) updates[elements.type] = [];

			for (const id of updateIds) {
				const element = getDocument(id);
				const update = {_id:id,
					[`flags.${moduleName}.parent`]: tokenDocument._id,
					[`flags.${moduleName}.offset`]: TokenAttacher.getElementOffset(elements.type, element, baseType, tokenDocument, {})};
				if(TokenAttacher.isV14() && (elements.type === "Region")) update["attachment.token"] = tokenDocument._id;
				updates[elements.type].push(update);
			}
			if(return_data){
				return updates;
			}
			if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");
			const baseRollback = {_id: tokenDocument._id};
			const attachedPath = `flags.${moduleName}.attached.${elements.type}`;
			if(originalAttached === undefined) TokenAttacher.markForDeletion(baseRollback, attachedPath);
			else baseRollback[attachedPath] = foundry.utils.duplicate(originalAttached);
			const childRollbacks = updateIds
				.map(id => getDocument(id))
				.filter(Boolean)
				.map(document => TokenAttacher.captureRelationshipRollback(document, elements.type));
			let writeAttempted = false;
			try {
				writeAttempted = true;
				if(baseType !== elements.type) {
					await scene.updateEmbeddedDocuments(baseType, updates[baseType], {[moduleName]: {update: true}});
				}
				await scene.updateEmbeddedDocuments(elements.type, updates[elements.type], {[moduleName]: {update: true}});
			}
			catch(error){
				const rollbackErrors = [];
				if(writeAttempted){
					const rollbackBatches = baseType === elements.type
						? [[baseType, [baseRollback, ...childRollbacks]]]
						: [[elements.type, childRollbacks], [baseType, [baseRollback]]];
					for(const [documentType, rollbackUpdates] of rollbackBatches){
						if(!rollbackUpdates.length) continue;
						try {
							await scene.updateEmbeddedDocuments(documentType, rollbackUpdates, {[moduleName]: {update: true, rollback: true}});
						}
						catch(rollbackError){
							rollbackErrors.push(rollbackError);
							console.error("Token Attacher | attachment rollback failed", {
								sceneId: scene.id,
								baseId: tokenDocument._id,
								documentType
							}, rollbackError);
						}
					}
				}
				if(rollbackErrors.length) error.rollbackErrors = rollbackErrors;
				throw error;
			}

			if(!suppressNotification) TokenAttacher.notify("info", localizedStrings.info.ObjectsAttached, {count: newIds.length});
			return {status: "success", changed: newIds.length};
		}

		/**
		 * Detach previously saved selection of walls to the currently selected token
		 */
		static async _StartTokenAttach(token){
			if(!token) return TokenAttacher.noop(localizedStrings.error.NoTokensSelected);
			await TokenAttacher.showTokenAttacherUI(token);
			return {status: "success"};
		}

		/**
		 * Update Offset of all Attached elements
		 */
		static async _updateAttachedOffsets({type, element, scene=canvas.scene}){
			const getDocument = (documentType, id) => {
				const document = scene?.getEmbeddedDocument?.(TokenAttacher.normalizeDocumentType(documentType), id);
				if(document || scene?.id !== canvas.scene?.id) return document;
				return TokenAttacher.getElementDocument(documentType, id);
			};
			const updateFunc = async (base) =>{
				if(!base) return;
				const baseDocument = base.document ?? base;
				let attached=baseDocument.getFlag(moduleName, "attached") || {};
				for (const key in attached) {
					if (attached.hasOwnProperty(key) && key !== "unknown") {
						await TokenAttacher._AttachToToken(baseDocument, {type:key, ids:attached[key]}, true, false, {refreshExisting: true, scene});
						await TokenAttacher._updateAttachedOffsets({type:key, element:attached[key], scene});
					}
				}
			}
			if(typeof element === 'string' || element instanceof String) element = getDocument(type, element);
			if(Array.isArray(element)){
				for (let i = 0; i < element.length; i++) {
					const elem = getDocument(type, element[i]);
					if(elem) await updateFunc(elem);
				}
			}
			else await updateFunc(element);
		}

		/**
		 * Detach previously saved selection of walls to the currently selected token
		 */
		static async _DetachFromToken(token, elements, suppressNotification=false, options={}){
			if(!token){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoTokensSelected);
				return {status: "noop", notified: !suppressNotification};
			}
			const scene = options?.scene ?? (token?.document ?? token)?.parent ?? canvas.scene;
			if(typeof token === 'string' || token instanceof String){
				token = TokenAttacher.getSceneDocument(scene, "Token", token)
					?? (options?.strictScene ? null : canvas.tokens.get(token));
			}
			const tokenDocument = token?.document ?? token;
			if(!tokenDocument){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoTokensSelected);
				return {status: "noop", notified: !suppressNotification};
			}
			options ??= {};
			const targetSceneId = TokenAttacher.getDocumentSceneId(tokenDocument);
			if(targetSceneId && targetSceneId !== scene?.id){
				throw new Error(`Attachment base Token belongs to Scene ${targetSceneId}, not ${scene?.id ?? "an available Scene"}.`);
			}
			const getDocument = (documentType, id) => {
				return TokenAttacher.getSceneDocument(scene, documentType, id)
					?? (options.strictScene ? null : TokenAttacher.getElementDocument(documentType, id));
			};
			const updateDocuments = async (documentType, updates) => {
				if(!updates.length || options.skip_update) return;
				if(!options.strictScene && scene?.id === canvas.scene?.id){
					await TokenAttacher.updateEmbeddedDocuments(documentType, updates, {[moduleName]: {update: true}});
					return;
				}
				if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");
				await scene.updateEmbeddedDocuments(documentType, updates, {[moduleName]: {update: true}});
			};
			const rollbackDocuments = async (documentType, updates) => {
				if(!updates.length) return;
				if(!options.strictScene && scene?.id === canvas.scene?.id){
					await TokenAttacher.updateEmbeddedDocuments(documentType, updates, {[moduleName]: {update: true, rollback: true}});
					return;
				}
				if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");
				await scene.updateEmbeddedDocuments(documentType, updates, {[moduleName]: {update: true, rollback: true}});
			};
			if(!elements || !elements.hasOwnProperty("type")){
				//Detach all
				const attached = tokenDocument.getFlag(moduleName, "attached") || {};
				const attachedEntries = Object.entries(attached)
					.filter(([, ids]) => Array.isArray(ids) && ids.length > 0);
				if(attachedEntries.length === 0){
					if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoAttachments);
					return {status: "noop", notified: !suppressNotification};
				}

				const operations = attachedEntries.map(([key, ids]) => {
					const documentType = TokenAttacher.normalizeDocumentType(key);
					const documents = ids.map(id => getDocument(documentType, id));
					const deletes = documents
						.map((document, index) => TokenAttacher._detachRelationshipUpdate(
							ids[index], documentType, tokenDocument._id, document
						))
						.filter(Boolean);
					const rollbackIds = new Set(deletes.map(update => update._id));
					const rollbacks = documents
						.filter(document => document && rollbackIds.has(document._id ?? document.id))
						.map(document => TokenAttacher.captureRelationshipRollback(document, documentType));
					return {documentType, deletes, rollbacks};
				});
				const attempted = [];
				let baseWriteAttempted = false;
				try {
					for(const operation of operations){
						if(!options.skip_update && operation.deletes.length) attempted.push(operation);
						await updateDocuments(operation.documentType, operation.deletes);
					}
					baseWriteAttempted = true;
					await tokenDocument.unsetFlag(moduleName, "attached");
				}
				catch(error){
					const rollbackErrors = [];
					for(const operation of attempted.reverse()){
						try {
							await rollbackDocuments(operation.documentType, operation.rollbacks);
						}
						catch(rollbackError){
							rollbackErrors.push(rollbackError);
							console.error("Token Attacher | detach-all relationship rollback failed", {
								sceneId: scene?.id,
								baseId: tokenDocument._id,
								documentType: operation.documentType
							}, rollbackError);
						}
					}
					if(baseWriteAttempted){
						try {
							await tokenDocument.setFlag(moduleName, "attached", foundry.utils.duplicate(attached));
						}
						catch(rollbackError){
							rollbackErrors.push(rollbackError);
							console.error("Token Attacher | detach-all base rollback failed", {
								sceneId: scene?.id,
								baseId: tokenDocument._id
							}, rollbackError);
						}
					}
					if(rollbackErrors.length) error.rollbackErrors = rollbackErrors;
					throw error;
				}
				if(!suppressNotification) ui.notifications.info(game.i18n.format(localizedStrings.info.ObjectsDetached));
				return {status: "success", changed: attachedEntries.reduce((count, [, ids]) => count + ids.length, 0)};
			}
			else{
				//Detach all passed elements
				elements = {...elements, type: TokenAttacher.normalizeDocumentType(elements.type)};
				const attached = tokenDocument.getFlag(moduleName, `attached.${elements.type}`) || [];
				const requestedIds = Array.isArray(elements.ids) ? elements.ids : [];
				const attachedIds = new Set(Array.isArray(attached) ? attached : []);
				const matchedIds = [...new Set(requestedIds.filter(id => attachedIds.has(id)))];
				if(matchedIds.length === 0){
					if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoMatchingAttachments);
					return {status: "noop", notified: !suppressNotification};
				}

				const matchedIdSet = new Set(matchedIds);
				const remaining = attached.filter(id => !matchedIdSet.has(id));
				const documents = matchedIds.map(id => getDocument(elements.type, id));
				const deletes = documents
					.map((document, index) => TokenAttacher._detachRelationshipUpdate(
						matchedIds[index], elements.type, tokenDocument._id, document
					))
					.filter(Boolean);
				const rollbackIds = new Set(deletes.map(update => update._id));
				const rollbacks = documents
					.filter(document => document && rollbackIds.has(document._id ?? document.id))
					.map(document => TokenAttacher.captureRelationshipRollback(document, elements.type));
				let childWriteAttempted = false;
				let baseWriteAttempted = false;
				try {
					childWriteAttempted = !options.skip_update && deletes.length > 0;
					await updateDocuments(elements.type, deletes);
					baseWriteAttempted = true;
					await tokenDocument.setFlag(moduleName, `attached.${elements.type}`, remaining);
				}
				catch(error){
					const rollbackErrors = [];
					if(childWriteAttempted){
						try {
							await rollbackDocuments(elements.type, rollbacks);
						}
						catch(rollbackError){
							rollbackErrors.push(rollbackError);
							console.error("Token Attacher | detach relationship rollback failed", {
								sceneId: scene?.id,
								baseId: tokenDocument._id,
								documentType: elements.type
							}, rollbackError);
						}
					}
					if(baseWriteAttempted){
						try {
							await tokenDocument.setFlag(moduleName, `attached.${elements.type}`, foundry.utils.duplicate(attached));
						}
						catch(rollbackError){
							rollbackErrors.push(rollbackError);
							console.error("Token Attacher | detach base rollback failed", {
								sceneId: scene?.id,
								baseId: tokenDocument._id,
								documentType: elements.type
							}, rollbackError);
						}
					}
					if(rollbackErrors.length) error.rollbackErrors = rollbackErrors;
					throw error;
				}
				if(!suppressNotification) ui.notifications.info(game.i18n.format(localizedStrings.info.ObjectsDetached));
				return {status: "success", changed: matchedIds.length};
			}
		}

		static _detachRelationshipUpdate(id, documentType, expectedParentId=null, document=null){
			if(!document) return null;
			const currentParentId = document.getFlag?.(moduleName, "parent")
				?? foundry.utils.getProperty(document, `flags.${moduleName}.parent`);
			if(expectedParentId && currentParentId && currentParentId !== expectedParentId){
				console.warn("Token Attacher | removed a stale attachment reference without changing the object's current relationship", {
					documentId: id,
					documentType,
					expectedParentId,
					currentParentId
				});
				return null;
			}
			const update = {_id: id};
			for (const key of ["parent", "offset", "unlocked", "canMoveConstrained"]){
				TokenAttacher.markForDeletion(update, `flags.${moduleName}.${key}`);
			}
			if(TokenAttacher.isV14() && documentType === "Region"){
				const nativeParent = TokenAttacher.getNativeRegionParentId(document);
				if(!expectedParentId || nativeParent === expectedParentId) update["attachment.token"] = null;
			}
			return update;
		}
		
		/**
		 * Hook into the toolbar and add buttons 
		 */
		static _getControlButtons(controls){
			TokenAttacher.ensureRuntimeState();
			const tokens = controls.tokens;
			if(!tokens) return;
			const nextOrder = Math.max(0, ...Object.values(tokens.tools).map(tool => tool.order ?? 0)) + 1;
			const startAttach = event => {
				void TokenAttacher.runAction(localizedStrings.button.StartTokenAttach, () => TokenAttacher._StartTokenAttach(canvas.tokens.controlled[0]), {
					element: event?.currentTarget,
					context: {surface: "scene-controls"}
				});
			};
			const toggleQuickEdit = (event, active) => {
				void TokenAttacher.runAction(localizedStrings.button.ToggleQuickEditMode, () => TokenAttacher.setQuickEditMode(Boolean(active)), {
					element: event?.currentTarget,
					context: {surface: "scene-controls", active: Boolean(active)}
				});
			};
			tokens.tools['TAStartTokenAttach'] = {
				name: "TAStartTokenAttach",
				title: game.i18n.format(localizedStrings.button.StartTokenAttach),
				icon: "fas fa-link",
				order: nextOrder,
				visible: game.user.isGM,
				onChange: startAttach,
				button: true
				};
			tokens.tools['TAToggleQuickEdit'] = {
				name: "TAToggleQuickEdit",
				title: game.i18n.format(localizedStrings.button.ToggleQuickEditMode),
				icon: "fas fa-feather-alt",
				order: nextOrder + 1,
				visible: game.user.isGM,
				onChange: toggleQuickEdit,
				toggle: true,
				active: !!foundry.utils.getProperty(window, 'tokenAttacher.quickEdit'),
			};
			console.log("Token Attacher | Tools added.");
		}

		static async activateTokenSelectTool(){
			await ui.controls.activate({control: "tokens", tool: "select"});
			return {status: "success"};
		}

		static async attachElementToToken(element, target_token, suppressNotification=false){
			const type = element.layer.constructor.documentName;
			const selected = [element.document?._id ?? element._id];
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene([target_token, element], localizedStrings.button.link);
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure(localizedStrings.button.link, error);
			}

			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._AttachToToken(target_token, {type:type, ids:selected}, suppressNotification, false, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("AttachToToken", [target_token.document._id, {type:type, ids:selected}, suppressNotification], {
				action: localizedStrings.button.link,
				successKey: suppressNotification ? null : localizedStrings.info.ObjectsAttached,
				noopKey: suppressNotification ? null : localizedStrings.error.NoEligibleAttachedSelection,
				sceneId: scene.id
			});
			
		}

		static async attachElementsToToken(element_array, target_token, suppressNotification=false){
			let selected = {}
			for (const element of element_array) {
				const type = element.layer.constructor.documentName;
				if(!selected.hasOwnProperty(type)) selected[type] = [];
				selected[type].push(element.document?._id ?? element._id);
			}
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene([target_token, ...element_array], localizedStrings.button.link);
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure(localizedStrings.button.link, error);
			}
			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._attachElementsToToken(selected, target_token, suppressNotification, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("attachElementsToToken", [selected, target_token.document._id, suppressNotification], {
				action: localizedStrings.button.link,
				successKey: suppressNotification ? null : localizedStrings.info.ObjectsAttached,
				noopKey: suppressNotification ? null : localizedStrings.error.NoEligibleAttachedSelection,
				sceneId: scene.id
			});
		}

		static async _attachElementsToToken(selected, target_token, suppressNotification=false, {scene=null, strictScene=false}={}){
			scene ??= (target_token?.document ?? target_token)?.parent ?? canvas.scene;
			if(typeof target_token === 'string' || target_token instanceof String){
				target_token = TokenAttacher.getSceneDocument(scene, "Token", target_token)
					?? (strictScene ? null : canvas.tokens.get(target_token));
			}
			if(!target_token){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoTokensSelected);
				return {status: "noop", notified: !suppressNotification};
			}
			let updates = {};
			let attachedCount = 0;
			const targetDocument = target_token.document ?? target_token;
			const targetSceneId = TokenAttacher.getDocumentSceneId(targetDocument);
			if(targetSceneId && targetSceneId !== scene?.id){
				throw new Error(`Attachment base Token belongs to Scene ${targetSceneId}, not ${scene?.id ?? "an available Scene"}.`);
			}
			const type = target_token.layer?.constructor.documentName ?? targetDocument.documentName;
			for (const key in selected) {
				if (selected.hasOwnProperty(key)) {
					const newUpdates = await TokenAttacher._AttachToToken(
						target_token,
						{type:key, ids:selected[key]},
						suppressNotification,
						true,
						{scene, strictScene}
					);
					if(!newUpdates || Object.keys(newUpdates).length === 0) continue;
					attachedCount += Object.entries(newUpdates).reduce((count, [documentType, documentUpdates]) => {
						if(!Array.isArray(documentUpdates)) return count;
						return count + documentUpdates.filter(update =>
							!(documentType === type && update?._id === targetDocument._id)
						).length;
					}, 0);
					if(Object.keys(updates).length <= 0) updates = newUpdates;
					else{
						for (const key in newUpdates) {
							if (newUpdates.hasOwnProperty(key)) {
								if(!updates.hasOwnProperty(key)) updates[key] = [];
								updates[key] = updates[key].concat(newUpdates[key]);
							}
						}
					}
				}
			}
			if(Object.keys(updates).length === 0){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoEligibleAttachedSelection);
				return {status: "noop", notified: !suppressNotification};
			}
			if(updates.hasOwnProperty(type)){
				let target_token_updates = updates[type].filter(item => item._id === targetDocument._id);
				let other_updates = updates[type].filter(item => item._id !== targetDocument._id);
				let base_updates = {};
				for (let i = 0; i < target_token_updates.length; i++) {
					base_updates = foundry.utils.mergeObject(base_updates, target_token_updates[i]);					
				}
				if(Object.keys(base_updates).length > 0) other_updates.push(base_updates);
				updates[type] = other_updates;
			}

			if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");
			const getDocument = (documentType, id) => {
				if(documentType === type && id === targetDocument._id) return targetDocument;
				return TokenAttacher.getSceneDocument(scene, documentType, id)
					?? (strictScene ? null : TokenAttacher.getElementDocument(documentType, id));
			};
			const batches = Object.entries(updates)
				.filter(([, documentUpdates]) => Array.isArray(documentUpdates) && documentUpdates.length)
				.map(([documentType, documentUpdates]) => ({
					documentType,
					documentUpdates,
					rollbacks: documentUpdates.map(update => {
						const document = getDocument(documentType, update._id);
						return document ? TokenAttacher.captureDocumentUpdateRollback(document, update) : null;
					}).filter(Boolean)
				}));
			const attempted = [];
			try {
				for(const batch of batches){
					attempted.push(batch);
					await scene.updateEmbeddedDocuments(batch.documentType, batch.documentUpdates, {[moduleName]:{update:true}});
				}
			}
			catch(error){
				const rollbackErrors = [];
				for(const batch of attempted.reverse()){
					if(!batch.rollbacks.length) continue;
					try {
						await scene.updateEmbeddedDocuments(batch.documentType, batch.rollbacks, {[moduleName]:{update:true, rollback:true}});
					}
					catch(rollbackError){
						rollbackErrors.push(rollbackError);
						console.error("Token Attacher | batched attachment rollback failed", {
							sceneId: scene.id,
							baseId: targetDocument._id,
							documentType: batch.documentType
						}, rollbackError);
					}
				}
				if(rollbackErrors.length) error.rollbackErrors = rollbackErrors;
				throw error;
			}
			if(attachedCount === 0){
				console.warn("Token Attacher | attachment request only repaired stale base metadata", {
					sceneId: scene.id,
					baseId: targetDocument._id
				});
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoEligibleAttachedSelection);
				return {status: "noop", changed: 0, notified: !suppressNotification};
			}
			if(!suppressNotification) TokenAttacher.notify("info", localizedStrings.info.ObjectsAttached, {count: attachedCount});
			return {status: "success", changed: attachedCount};
		}

		static isAttachmentUIOpen(){
			return window.document.getElementById("tokenAttacher") !== null;
		}

		static resolveAttachmentUIBase(attachmentUI=window.document.getElementById("tokenAttacher")){
			if(!attachmentUI || !canvas.scene) return null;
			const sceneId = attachmentUI.dataset.sceneId;
			const baseType = attachmentUI.dataset.baseType;
			const baseId = attachmentUI.dataset.baseId;
			if(sceneId !== canvas.scene.id || !baseType || !baseId) return null;

			const sceneBase = canvas.scene.getFlag(moduleName, "attach_base");
			if(sceneBase?.type !== baseType || sceneBase?.element !== baseId) return null;
			return TokenAttacher.layerGetElement(baseType, baseId);
		}

		static getControlledAttachedToBase(base){
			const controlled = canvas.activeLayer?.controlled ?? [];
			return controlled.filter(element => element.document?.getFlag(moduleName, "parent") === base.document._id);
		}
		
		static async showTokenAttacherUI(token){
			if(!token) return TokenAttacher.noop(localizedStrings.error.NoTokensSelected);
			if(!canvas.scene) return TokenAttacher.noop(localizedStrings.error.NoActiveScene);
			if(TokenAttacher.isAttachmentUIOpen()) await TokenAttacher.closeTokenAttacherUI();

			const state = TokenAttacher.ensureRuntimeState();
			const canvasEpoch = state.canvasEpoch;
			const scene = canvas.scene;
			const baseType = token.layer.constructor.documentName;
			const baseId = token.document._id;
			await scene.setFlag(moduleName, "attach_base", {type: baseType, element: baseId});
			let attachmentUI = null;
			try {
			const assertCurrentScene = () => {
				if(state.canvasEpoch !== canvasEpoch || canvas.scene?.id !== scene.id){
					throw new Error("The scene changed while the Token Attacher controls were opening. Reopen them on the current scene.");
				}
			};
			assertCurrentScene();
			const tokenImage = token.document.texture?.src ?? "icons/svg/mystery-man.svg";
			const myHtml = await foundry.applications.handlebars.renderTemplate(`${templatePath}/tokenAttacherUI.html`, {
				["token-image"]: tokenImage,
				["token-name"]: token.document.name,
				["token-video"]: /\.(?:webm|mp4|m4v|ogv)(?:\?.*)?$/i.test(tokenImage)
			});
			assertCurrentScene();

			const anchor = window.document.getElementById("hud");
			if(!anchor) throw new Error("Foundry's HUD container is unavailable.");
			anchor.insertAdjacentHTML('afterend', myHtml);

			attachmentUI = window.document.getElementById("tokenAttacher");
			if(!attachmentUI) throw new Error("The Token Attacher controls could not be rendered.");
			attachmentUI.dataset.sceneId = scene.id;
			attachmentUI.dataset.baseType = baseType;
			attachmentUI.dataset.baseId = baseId;

			const bindAction = (selector, actionKey, callback, {requiresBase=true}={}) => {
				const button = attachmentUI.querySelector(selector);
				if(!button) throw new Error(`Missing Token Attacher control: ${selector}`);
				button.addEventListener("click", event => {
					event.preventDefault();
					void TokenAttacher.runAction(actionKey, async () => {
						const base = requiresBase ? TokenAttacher.resolveAttachmentUIBase(attachmentUI) : null;
						if(requiresBase && !base){
							await TokenAttacher.closeTokenAttacherUI({saveOffsets: false});
							TokenAttacher.notify("error", localizedStrings.error.BaseDoesntExist);
							return {status: "noop", notified: true};
						}
						return callback(base, button);
					}, {
						element: button,
						context: {surface: "attachment-palette", baseId, baseType, sceneId: scene.id}
					});
				});
			};

			bindAction(".close", localizedStrings.button.close, () => TokenAttacher.closeTokenAttacherUI(), {requiresBase: false});
			bindAction(".link", localizedStrings.button.link, async base => {
				const selected = canvas.activeLayer?.controlled ?? [];
				if(selected.length === 0) return TokenAttacher.noop(localizedStrings.error.NothingSelected);
				return TokenAttacher.attachElementsToToken(selected, base);
			});
			bindAction(".unlink", localizedStrings.button.unlink, async base => {
				const selected = canvas.activeLayer?.controlled ?? [];
				if(selected.length === 0) return TokenAttacher.noop(localizedStrings.error.NothingSelected);
				return TokenAttacher.detachElementsFromToken(selected, base);
			});
			bindAction(".unlink-all", localizedStrings.button["unlink-all"], async base => {
				const attached = base.document.getFlag(moduleName, "attached") || {};
				if(!Object.values(attached).some(ids => Array.isArray(ids) && ids.length)){
					return TokenAttacher.noop(localizedStrings.error.NoAttachments);
				}
				const confirmed = await TokenAttacher.confirmAction(localizedStrings.confirm.DetachAllTitle, localizedStrings.confirm.DetachAllContent);
				if(!confirmed) return {status: "cancelled"};
				return TokenAttacher.detachAllElementsFromToken(base);
			});
			bindAction(".select", localizedStrings.button.select, async (_base, button) => {
				const active = !button.classList.contains("active");
				button.classList.toggle("active", active);
				if(!active){
					TokenAttacher.notify("info", localizedStrings.info.MultiSelectCancelled);
					return {status: "cancelled"};
				}
				await TokenAttacher.activateTokenSelectTool();
				TokenAttacher.notify("info", localizedStrings.info.DragSelectElements);
				return {status: "success"};
			});
			bindAction(".highlight", localizedStrings.button.highlight, (base, button) => TokenAttacher.highlightAttached(base, button));
			bindAction(".copy", localizedStrings.button.copy, base => TokenAttacher.copyAttached(base));
			bindAction(".paste", localizedStrings.button.paste, base => TokenAttacher.pasteAttached(base));
			bindAction(".toggle-animate", localizedStrings.button.toggleAnimate, async () => {
				const layer = canvas.activeLayer;
				const selected = layer?.controlled ?? [];
				if(selected.length === 0) return TokenAttacher.noop(localizedStrings.error.NothingSelected);
				if(layer.constructor.documentName !== "Token") return TokenAttacher.noop(localizedStrings.error.OnlyTokenToggleAnimate);
				await TokenAttacher.toggleAnimateStatus(selected);
				return {status: "success", changed: selected.length};
			});
			bindAction(".lock", localizedStrings.button.lock, async base => {
				const selected = TokenAttacher.getControlledAttachedToBase(base);
				if(selected.length === 0) return TokenAttacher.noop(localizedStrings.error.NoEligibleAttachedSelection);
				return TokenAttacher.setElementsLockStatus(selected, true);
			});
			bindAction(".unlock", localizedStrings.button.unlock, async base => {
				const selected = TokenAttacher.getControlledAttachedToBase(base);
				if(selected.length === 0) return TokenAttacher.noop(localizedStrings.error.NoEligibleAttachedSelection);
				return TokenAttacher.setElementsLockStatus(selected, false);
			});
			return {status: "success"};
			}
			catch(error){
				attachmentUI?.remove();
				await scene.unsetFlag(moduleName, "attach_base");
				throw error;
			}
		}
		static async setElementsMoveConstrainedStatus(elements, canMoveConstrained, suppressNotification = false, options={}){
			if(!Array.isArray(elements)) elements=[elements];
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene(elements, "Change constrained movement");
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure("Change constrained movement", error);
			}
			options = foundry.utils.mergeObject({type: TokenAttacher.CONSTRAINED_TYPE.TOKEN_CONSTRAINED}, options, {
				insertKeys: true,
				insertValues: true,
				overwrite: true,
				inplace: false
			});
			let selected = {};
			for (const element of elements) {
				const type = element.layer.constructor.documentName;
				if(!selected.hasOwnProperty(type)) selected[type] = [];
				selected[type].push(element.document._id);
			}
			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._setElementsMoveConstrainedStatus(
					selected,
					canMoveConstrained,
					suppressNotification,
					options,
					{scene, strictScene: true}
				);
			}
			return TokenAttacher.emitSocketAction("setElementsMoveConstrainedStatus", [selected, canMoveConstrained, suppressNotification, options], {
				action: "Change constrained movement",
				successKey: suppressNotification ? null : (canMoveConstrained ? localizedStrings.info.ObjectsCanNotMoveConstrained : localizedStrings.info.ObjectsCanMoveConstrained),
				noopKey: suppressNotification ? null : localizedStrings.error.NoEligibleAttachedSelection,
				sceneId: scene.id
			});

		}

		static async _setElementsMoveConstrainedStatus(elements, canMoveConstrained, suppressNotification, options, {scene=canvas.scene, strictScene=false}={}){
			if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");
			let updates = {};
			let changed = 0;
			for (const key in elements) {
				if (elements.hasOwnProperty(key)) {
					for (let i = 0; i < elements[key].length; i++) {
						const document = TokenAttacher.getSceneDocument(scene, key, elements[key][i])
							?? (strictScene ? null : TokenAttacher.layerGetElement(key, elements[key][i])?.document);
						if(document && foundry.utils.getProperty(document, `flags.${moduleName}.parent`)){
							if(!updates.hasOwnProperty(key)) updates[key] = [];
							if(canMoveConstrained) updates[key].push({_id:document._id, [`flags.${moduleName}.canMoveConstrained`]:options});
							else updates[key].push(TokenAttacher.markForDeletion({_id:document._id}, `flags.${moduleName}.canMoveConstrained`));
							changed += 1;
						}
					}
				}
			}
			//Fire Updates
			for (const key in updates) {
				if (updates.hasOwnProperty(key)) {
					if(updates[key].length > 0){
						await scene.updateEmbeddedDocuments(TokenAttacher.normalizeDocumentType(key), updates[key], {[moduleName]:{update:true}});
					}
				}
			}
			if(changed === 0){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoEligibleAttachedSelection);
				return {status: "noop", notified: !suppressNotification};
			}
			if(!suppressNotification) {
				if(!canMoveConstrained) TokenAttacher.notify("info", localizedStrings.info.ObjectsCanMoveConstrained, {count: changed});
				else TokenAttacher.notify("info", localizedStrings.info.ObjectsCanNotMoveConstrained, {count: changed});
			}
			return {status: "success", changed};
		}

		static async setElementsLockStatus(elements, isLocked, suppressNotification = false){
			if(!Array.isArray(elements)) elements=[elements];
			const action = isLocked ? localizedStrings.button.lock : localizedStrings.button.unlock;
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene(elements, action);
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure(action, error);
			}
			let selected = {}
			for (const element of elements) {
				const type = element.layer.constructor.documentName;
				if(!selected.hasOwnProperty(type)) selected[type] = [];
				selected[type].push(element.document._id);
			}
			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._setElementsLockStatus(selected, isLocked, suppressNotification, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("setElementsLockStatus", [selected, isLocked, suppressNotification], {
				action,
				successKey: suppressNotification ? null : (isLocked ? localizedStrings.info.ObjectsLocked : localizedStrings.info.ObjectsUnlocked),
				noopKey: suppressNotification ? null : localizedStrings.error.NoEligibleAttachedSelection,
				sceneId: scene.id
			});

		}

		static async _setElementsLockStatus(elements, isLocked, suppressNotification, {scene=canvas.scene, strictScene=false}={}){
			if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment Scene is unavailable.");
			let updates = {};
			let changed = 0;
			for (const key in elements) {
				if (elements.hasOwnProperty(key)) {
					for (let i = 0; i < elements[key].length; i++) {
						const document = TokenAttacher.getSceneDocument(scene, key, elements[key][i])
							?? (strictScene ? null : TokenAttacher.layerGetElement(key, elements[key][i])?.document);
						if(document && foundry.utils.getProperty(document, `flags.${moduleName}.parent`)){
							const currentlyUnlocked = Boolean(document.getFlag(moduleName, "unlocked"));
							if((isLocked && !currentlyUnlocked) || (!isLocked && currentlyUnlocked)) continue;
							if(!updates.hasOwnProperty(key)) updates[key] = [];
							if(!isLocked) updates[key].push({_id:document._id, [`flags.${moduleName}.unlocked`]:true});
							else updates[key].push(TokenAttacher.markForDeletion({_id:document._id}, `flags.${moduleName}.unlocked`));
							changed += 1;
						}
					}
				}
			}
			//Fire Updates
			for (const key in updates) {
				if (updates.hasOwnProperty(key)) {
					if(updates[key].length > 0){
						await scene.updateEmbeddedDocuments(TokenAttacher.normalizeDocumentType(key), updates[key], {[moduleName]:{update:true}});
					}
				}
			}
			if(changed === 0){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoEligibleAttachedSelection);
				return {status: "noop", notified: !suppressNotification};
			}
			if(!suppressNotification) {
				if(!isLocked) TokenAttacher.notify("info", localizedStrings.info.ObjectsUnlocked, {count: changed});
				else TokenAttacher.notify("info", localizedStrings.info.ObjectsLocked, {count: changed});
			}
			return {status: "success", changed};
		}

		static lockAttached(token, button){
			const attached=token.document.getFlag(moduleName, "attached") || {};
			if(Object.keys(attached).length == 0) return;
			const isLocked = token.document.getFlag(moduleName, "locked") || false;
			let icons = button.getElementsByTagName("i");
			
			for (const key in attached) {
				if (attached.hasOwnProperty(key) && key !== "unknown") {
					for (const elementid of attached[key]) {
						let element = TokenAttacher.layerGetElement(key, elementid);
						if(!isLocked) TokenAttacher.lockElement(key, element, false);
						else TokenAttacher.lockElement(key, element, true);
					}
				}
			}
			if(!isLocked){
				icons[0].classList.toggle("hidden", true);
				icons[1].classList.toggle("hidden", false);
			}
			else{
				icons[0].classList.toggle("hidden", false);
				icons[1].classList.toggle("hidden", true);
			}
			token.document.setFlag(moduleName, "locked", !isLocked); 
		}

		static clearAttachedHighlight({notify=false}={}){
			const state = TokenAttacher.ensureRuntimeState();
			const highlighted = state.highlighted;
			if(!highlighted) return 0;

			let restored = 0;
			if(canvas.scene?.id === highlighted.sceneId){
				for(const entry of highlighted.elements){
					const element = TokenAttacher.layerGetElement(entry.type, entry.id);
					if(!element) continue;
					element.alpha = entry.alpha;
					restored += 1;
				}
			}
			delete state.highlighted;

			const icons = window.document.querySelectorAll("#tokenAttacher .highlight i");
			icons[0]?.classList.toggle("hidden", false);
			icons[1]?.classList.toggle("hidden", true);
			if(notify) TokenAttacher.notify("info", localizedStrings.info.AttachmentsHighlightCleared, {count: restored});
			return restored;
		}

		static highlightAttached(token, button){
			const state = TokenAttacher.ensureRuntimeState();
			const active = state.highlighted?.sceneId === canvas.scene?.id
				&& state.highlighted?.baseId === token.document._id;
			if(active){
				const changed = TokenAttacher.clearAttachedHighlight({notify: true});
				return {status: "success", changed};
			}

			TokenAttacher.clearAttachedHighlight();
			const attached = token.document.getFlag(moduleName, "attached") || {};
			const elements = [];
			for(const [type, ids] of Object.entries(attached)){
				if(type === "unknown" || !Array.isArray(ids)) continue;
				for(const id of ids){
					const element = TokenAttacher.layerGetElement(type, id);
					if(!element){
						console.warn("Token Attacher | missing highlighted attachment", {type, id, baseId: token.document._id});
						continue;
					}
					elements.push({type, id, alpha: element.alpha});
					element.alpha = 0.5;
				}
			}
			if(elements.length === 0) return TokenAttacher.noop(localizedStrings.error.NoAttachments);

			state.highlighted = {sceneId: canvas.scene.id, baseId: token.document._id, elements};
			const icons = button.querySelectorAll("i");
			icons[0]?.classList.toggle("hidden", true);
			icons[1]?.classList.toggle("hidden", false);
			TokenAttacher.notify("info", localizedStrings.info.AttachmentsHighlighted, {count: elements.length});
			return {status: "success", changed: elements.length};
		}

		static async closeTokenAttacherUI({saveOffsets=true}={}){
			const attachmentUI = window.document.getElementById("tokenAttacher");
			const sceneId = attachmentUI?.dataset.sceneId ?? canvas.scene?.id;
			const scene = game.scenes.get(sceneId) ?? (canvas.scene?.id === sceneId ? canvas.scene : null);
			const attachmentBase = attachmentUI ? {
				type: attachmentUI.dataset.baseType,
				element: attachmentUI.dataset.baseId
			} : scene?.getFlag(moduleName, "attach_base");

			try {
				if(saveOffsets && scene?.id === canvas.scene?.id && attachmentBase?.type && attachmentBase?.element){
					const base = TokenAttacher.layerGetElement(attachmentBase.type, attachmentBase.element);
					if(base) await TokenAttacher._updateAttachedOffsets({...attachmentBase, scene});
				}
			}
			finally {
				TokenAttacher.clearAttachedHighlight();
				attachmentUI?.remove();
				if(scene) await scene.unsetFlag(moduleName, "attach_base");
			}
			return {status: "success"};
		}

		static async detachElementFromToken(element, target_token, suppressNotification=false){
			const type = element.layer.constructor.documentName;
			const selected = [element.document?._id ?? element._id];
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene([target_token, element], localizedStrings.button.unlink);
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure(localizedStrings.button.unlink, error);
			}

			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._DetachFromToken(target_token, {type:type, ids:selected}, suppressNotification, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("DetachFromToken", [target_token.document._id, {type:type, ids:selected}, suppressNotification], {
				action: localizedStrings.button.unlink,
				successKey: suppressNotification ? null : localizedStrings.info.ObjectsDetached,
				noopKey: suppressNotification ? null : localizedStrings.error.NoMatchingAttachments,
				sceneId: scene.id
			});
		}

		static async detachElementsFromToken(element_array, target_token, suppressNotification=false){
			let selected = {}
			for (const element of element_array) {
				const type = element.layer.constructor.documentName;
				if(!selected.hasOwnProperty(type)) selected[type] = [];
				selected[type].push(element.document?._id ?? element._id);
			}
		
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene([target_token, ...element_array], localizedStrings.button.unlink);
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure(localizedStrings.button.unlink, error);
			}
			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._detachElementsFromToken(selected, target_token, suppressNotification, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("detachElementsFromToken", [selected, target_token.document._id, suppressNotification], {
				action: localizedStrings.button.unlink,
				successKey: suppressNotification ? null : localizedStrings.info.ObjectsDetached,
				noopKey: suppressNotification ? null : localizedStrings.error.NoMatchingAttachments,
				sceneId: scene.id
			});
		}

		static async _detachElementsFromToken(selected, target_token, suppressNotification=false, {scene=null, strictScene=false}={}){
			scene ??= (target_token?.document ?? target_token)?.parent ?? canvas.scene;
			if(typeof target_token === 'string' || target_token instanceof String){
				target_token = TokenAttacher.getSceneDocument(scene, "Token", target_token)
					?? (strictScene ? null : canvas.tokens.get(target_token));
			}
			const targetSceneId = TokenAttacher.getDocumentSceneId(target_token);
			if(targetSceneId && targetSceneId !== scene?.id){
				throw new Error(`Attachment base Token belongs to Scene ${targetSceneId}, not ${scene?.id ?? "an available Scene"}.`);
			}
			let changed = 0;
			for (const key in selected) {
				if (selected.hasOwnProperty(key)) {
					const result = await TokenAttacher._DetachFromToken(
						target_token,
						{type:key, ids:selected[key]},
						true,
						{scene, strictScene}
					);
					changed += result?.changed ?? 0;
				}
			}
			if(changed === 0){
				if(!suppressNotification) TokenAttacher.notify("warn", localizedStrings.error.NoMatchingAttachments);
				return {status: "noop", notified: !suppressNotification};
			}
			if(!suppressNotification) TokenAttacher.notify("info", localizedStrings.info.ObjectsDetached, {count: changed});
			return {status: "success", changed};
		}

		static async detachAllElementsFromToken(target_token, suppressNotification=false){
			let scene;
			try {
				scene = TokenAttacher.resolveOriginatingScene(target_token, localizedStrings.button["unlink-all"]);
			}
			catch(error){
				return TokenAttacher.reportSceneActionFailure(localizedStrings.button["unlink-all"], error);
			}
			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._DetachFromToken(target_token, {}, suppressNotification, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("DetachFromToken", [target_token.document._id, {}, suppressNotification], {
				action: localizedStrings.button["unlink-all"],
				successKey: suppressNotification ? null : localizedStrings.info.ObjectsDetached,
				noopKey: suppressNotification ? null : localizedStrings.error.NoAttachments,
				sceneId: scene.id
			});
		}

		static getAllAttachedElementsOfToken(target_token, suppressNotification=false){
			return target_token.document.getFlag(moduleName, "attached") || {};
		}

		static getAllAttachedElementsByTypeOfToken(target_token, type, suppressNotification=false){
			return target_token.document.getFlag(moduleName, `attached.${type}`) || {};
		}

		/*
			Calculates the offset of and element relative to a position(center) and rotation
			x/y 		= offset of x/y of element to the passed center
			centerX/Y 	= offset of center x/y of element to the passed center
			rot			= initial rotation of the element
			offRot		= offset rotation of element to the passed rotation 
			size		= width/height/distance/dim/bright/radius of element and widthBase/heightBase of parent
		*/
		static getElementOffset(type, objData, base_type, baseDoc, grid){
			const center = TokenAttacher.getCenter(base_type, baseDoc, grid);
			const rotation =  baseDoc.rotation ?? baseDoc.direction;
			let offset = {x:Number.MAX_SAFE_INTEGER, y:Number.MAX_SAFE_INTEGER, rot:Number.MAX_SAFE_INTEGER};
			offset.x = objData.x ?? (objData.c?.[0] < objData.c?.[2] ? objData.c?.[0] : objData.c?.[2]);
			offset.y = objData.y ?? (objData.c?.[1] < objData.c?.[3] ? objData.c?.[1] : objData.c?.[3]);
			const offsetCenter = TokenAttacher.getCenter(type, objData, grid);;
			[offset.centerX, offset.centerY] = [offsetCenter.x, offsetCenter.y];
			offset.rot = objData.rotation ?? objData.direction ?? rotation;
			offset.offRot = objData.rotation ?? objData.direction ?? rotation;
			if(objData.hasOwnProperty('c')){
				offset.c = [];
				offset.c[0] = objData.c[0] - center.x;
				offset.c[2] = objData.c[2] - center.x;
				offset.c[1] = objData.c[1] - center.y;
				offset.c[3] = objData.c[3] - center.y;
			}
			
			if(objData.hasOwnProperty('points')){
				offset.points = [];
				for (let i = 0; i < objData.points.length; i++) {
					offset.points[i] = [];
					offset.points[i][0] = objData.points[i][0];
					offset.points[i][1] = objData.points[i][1];			
				}
			}

			if(objData.shape?.hasOwnProperty('points')){
				offset.points = [];
				if(!offset.shape) offset.shape = {};
				for (let i = 0; i < objData.shape.points.length; i+=2) {
					offset.points[i/2] = [];
					offset.points[i/2][0] = objData.shape.points[i];
					offset.points[i/2][1] = objData.shape.points[i+1];			
				}
				offset.shape.points = offset.points;
			}

			offset.x -= center.x; 
			offset.y -= center.y;
			offset.centerX -= center.x;
			offset.centerY -= center.y;
			offset.offRot -= rotation % 360;
			offset.rot %= 360;
			offset.offRot %= 360;

			offset.size = {};
			if(objData.hasOwnProperty('width') && objData.width != null){
				offset.size.width  	= objData.width;
				offset.size.height	= objData.height;
			}
			if(objData.shape?.hasOwnProperty('width') && objData.shape.width != null){
				offset.size.width  	= objData.shape.width;
				offset.size.height	= objData.shape.height;
			}
			if(objData.hasOwnProperty('distance')){
				offset.size.distance= objData.distance;
			}
			if(objData.hasOwnProperty('dim')){
				offset.size.dim= objData.dim;
				offset.size.bright= objData.bright;
			}
			if(objData.hasOwnProperty('config') && objData.config.hasOwnProperty('dim')){
				offset.size.config = {};
				offset.size.config.dim 		= objData.config.dim;
				offset.size.config.bright 	= objData.config.bright;
			}
			if(objData.hasOwnProperty('radius')){
				offset.size.radius= objData.radius;
			}
			let  base_elevation = baseDoc.elevation?.bottom ?? baseDoc.elevation ?? baseDoc.flags['levels']?.elevation ?? baseDoc.flags['levels']?.rangeBottom ?? baseDoc.flags['wallHeight']?.wallHeightBottom ?? baseDoc.flags['wall-height']?.bottom ?? 0;
			offset.elevation = {};
			offset.elevation.flags = {};
			if(typeof objData.elevation === "number"){
				offset.elevation.elevation= objData.elevation;
				if([null, Infinity, -Infinity].includes(offset.elevation.elevation) === false) offset.elevation.elevation -= base_elevation;
			}
			[offset.size.widthBase, offset.size.heightBase] = TokenAttacher.getSize(baseDoc);
			
			Hooks.callAll(`${moduleName}.getElementOffset`, type, objData, base_type, baseDoc, grid, offset);
			return offset;
		}

		//Modify offset based on grid_multi
		static updateOffsetWithGridMultiplicator(type, offset, grid_multi){
			offset.x *= grid_multi.sizeX;
			offset.y *= grid_multi.sizeY;
			offset.centerX *= grid_multi.sizeX;
			offset.centerY *= grid_multi.sizeY;
			if(offset.hasOwnProperty('c')){
				offset.c[0] *= grid_multi.sizeX;
				offset.c[2] *= grid_multi.sizeX;
				offset.c[1] *= grid_multi.sizeY;
				offset.c[3] *= grid_multi.sizeY;
			}
			if(offset.hasOwnProperty('points')){
				for (let i = 0; i < offset.points.length; i++) {
					offset.points[i][0] *= grid_multi.sizeX;
					offset.points[i][1] *= grid_multi.sizeY;					
				}
			}

			if(type === "Tile" || type === "Drawing"){
				offset.size.width  *= grid_multi.sizeX;
				offset.size.height *= grid_multi.sizeY;
			}
			
			//Other Modules
			Hooks.callAll(`${moduleName}.updateOffsetWithGridMultiplicator`, type, offset, grid_multi);
			return offset;
		}

		static getElementSize(element){
			let size = {};
			size.width 	= element.document.width 	?? element.document.distance ?? element.document.config?.dim ?? element.document.dim ?? element.document.radius;
			size.height = element.document.height 	?? element.document.distance ?? element.document.config?.dim ?? element.document.dim ?? element.document.radius;
			return size;
		}

		static migrateTileDataV14(tileData){
			if(!TokenAttacher.isV14()) return tileData;
			const tile = foundry.utils.duplicate(tileData);
			if((tile.overhead === true) && !Number.isFinite(tile.elevation)){
				tile.elevation = 4 * (canvas.scene?.grid?.distance ?? game.system.grid?.distance ?? 5);
			}
			if("roof" in tile){
				tile.restrictions ??= {};
				tile.restrictions.light = !!tile.roof;
				tile.restrictions.weather = !!tile.roof;
				delete tile.roof;
			}
			delete tile.overhead;
			tile.texture = (tile.texture && (typeof tile.texture === "object")) ? tile.texture : {};
			const legacyPosition = (tile.texture.anchorX === undefined) && (tile.texture.anchorY === undefined);
			tile.texture.anchorX ??= 0.5;
			tile.texture.anchorY ??= 0.5;
			if(legacyPosition){
				if(Number(tile.rotation ?? 0) === 0){
					tile.texture.anchorX -= 0.5;
					tile.texture.anchorY -= 0.5;
				}
				else{
					tile.x = Math.round((tile.x ?? 0) + ((tile.width ?? 0) / 2));
					tile.y = Math.round((tile.y ?? 0) + ((tile.height ?? 0) / 2));
				}
			}
			return tile;
		}

		static preparePrototypeAttachedV14(prototypeAttached){
			if(!TokenAttacher.isV14()) return foundry.utils.duplicate(prototypeAttached);
			const prepared = {};
			for(const [sourceType, sourceDocuments] of Object.entries(foundry.utils.duplicate(prototypeAttached) || {})){
				if(!Array.isArray(sourceDocuments)) continue;
				const documentType = TokenAttacher.normalizeDocumentType(sourceType);
				prepared[documentType] ??= [];
				for(let documentData of sourceDocuments){
					if(sourceType === "MeasuredTemplate"){
						try {
							const legacyOffset = foundry.utils.duplicate(foundry.utils.getProperty(documentData, `flags.${moduleName}.offset`));
							const templatePosition = {x: Number(documentData.x ?? 0), y: Number(documentData.y ?? 0)};
							documentData = CONFIG.Region.documentClass._migrateMeasuredTemplateData(documentData, {
								grid: canvas.grid,
								gridTemplates: game.settings.get("core", "gridTemplates"),
								coneTemplateType: game.settings.get("core", "coneTemplateType"),
								users: game.users.map(user => user.toObject())
							});
							if(legacyOffset){
								const baseCenter = {
									x: templatePosition.x - Number(legacyOffset.x ?? 0),
									y: templatePosition.y - Number(legacyOffset.y ?? 0)
								};
								const baseRotation = Number(legacyOffset.rot ?? documentData.shapes?.[0]?.rotation ?? 0)
									- Number(legacyOffset.offRot ?? 0);
								delete legacyOffset.shapes;
								Hooks.callAll(`${moduleName}.getElementOffset`, "Region", documentData, "AmbientLight", {
									...baseCenter,
									rotation: baseRotation,
									elevation: 0,
									flags: {}
								}, {}, legacyOffset);
								for(const shapeOffset of legacyOffset.shapes || []) shapeOffset._taSkipGridScale = true;
								foundry.utils.setProperty(documentData, `flags.${moduleName}.offset`, legacyOffset);
							}
						}
						catch(error){
							const migrationError = new Error("A legacy Measured Template attachment could not be converted to a v14 Region.", {cause: error});
							migrationError.documentData = documentData;
							throw migrationError;
						}
					}
					if(documentType === "Tile") documentData = TokenAttacher.migrateTileDataV14(documentData);
					prepared[documentType].push(documentData);
				}
			}
			return prepared;
		}

		static getObjectsFromIds(base_type, base_data, type, idArray){
			type = TokenAttacher.normalizeDocumentType(type);
			let copyArray = [];
			for (const elementid of idArray) {
				const element = TokenAttacher.getElementDocument(type, elementid);
				if(!element){
					console.warn(`Token Attacher | Ignoring missing ${type} attachment ${elementid}.`);
					continue;
				}
				let dup_data = element.toObject instanceof Function ? element.toObject() : foundry.utils.duplicate(element);
				delete dup_data._id;
				foundry.utils.setProperty(dup_data, `flags.${moduleName}.offset`, TokenAttacher.getElementOffset(type, dup_data, base_type, 
					foundry.utils.mergeObject(
						foundry.utils.mergeObject(
							foundry.utils.duplicate(base_data), 
							foundry.utils.getProperty(base_data, `flags.${moduleName}.pos.xy`)), 
							foundry.utils.getProperty(base_data, `flags.${moduleName}.pos`)
							), {}));
				if(TokenAttacher.isAttachmentBase(element)){
					const prototypeAttached = TokenAttacher.generatePrototypeAttached(element);
					delete dup_data.flags[moduleName].attached;
					dup_data.flags[moduleName].prototypeAttached = prototypeAttached;
				}
				copyArray.push(dup_data);
			}
			return copyArray;
		}

		static async copyAttached(token){
			const copyObjects = {map: {}};
			const attached=token.document.getFlag(moduleName, "attached") || {};
			if(!Object.values(attached).some(ids => Array.isArray(ids) && ids.length)){
				return TokenAttacher.noop(localizedStrings.error.NoAttachments);
			}
		
			let copied = 0;
			for (const key in attached) {
				if (attached.hasOwnProperty(key) && key !== "unknown") {
					copyObjects.map[key] = TokenAttacher.getObjectsFromIds("Token", token.document, key, attached[key]);
					copied += copyObjects.map[key].length;
					if(copyObjects.map[key].length === 0) delete copyObjects.map[key];
				}
			}
			if(copied === 0) return TokenAttacher.noop(localizedStrings.error.NoAttachments);
			copyObjects.grid = TokenAttacher.getCurrentGrid();
			TokenAttacher.ensureRuntimeState().copyCache = foundry.utils.duplicate(copyObjects);
			await game.user.unsetFlag(moduleName, "copy");			
			await game.user.setFlag(moduleName, "copy", copyObjects);	
			TokenAttacher.notify("info", localizedStrings.info.AttachmentsCopied, {count: copied});
			return {status: "success", changed: copied};
		}

		static async pasteAttached(token){
			const state = TokenAttacher.ensureRuntimeState();
			const rawCopy = state.copyCache ?? game.user.getFlag(moduleName, "copy");
			if(rawCopy === undefined || rawCopy === null){
				return TokenAttacher.noop(localizedStrings.error.NoCopiedAttachments);
			}
			const isRecord = value => value && (typeof value === "object") && !Array.isArray(value);
			const validGrid = isRecord(rawCopy.grid)
				&& [rawCopy.grid.size, rawCopy.grid.sizeX, rawCopy.grid.sizeY].every(value => Number.isFinite(value) && value > 0);
			const validMap = isRecord(rawCopy.map)
				&& Object.values(rawCopy.map).every(value => Array.isArray(value));
			if(!validGrid || !validMap){
				throw new Error(TokenAttacher.format(localizedStrings.error.InvalidCopiedAttachments));
			}
			const copyObjects = foundry.utils.duplicate(rawCopy);
			if(!Object.values(copyObjects.map).some(values => values.length)){
				return TokenAttacher.noop(localizedStrings.error.NoCopiedAttachments);
			}
			await TokenAttacher.saveBasePositon(token.layer.constructor.documentName, token);
			//Set parent in copyObjects
			for (const key in copyObjects.map) {
				if (copyObjects.map.hasOwnProperty(key) && key !== "unknown") {
					for (let i = 0; i < copyObjects.map[key].length; i++) {
						foundry.utils.setProperty(copyObjects.map[key][i], `flags.${moduleName}.parent`, token.document._id);
					}
				}				
			}
			const currentGrid = TokenAttacher.getCurrentGrid();
			let grid_multi = copyObjects.grid;
				grid_multi.size = currentGrid.size / grid_multi.size;
				grid_multi.sizeX = currentGrid.sizeX / grid_multi.sizeX;
				grid_multi.sizeY = currentGrid.sizeY / grid_multi.sizeY;
			const result = await TokenAttacher.regenerateAttachedFromPrototype(token.layer.constructor.documentName, token, copyObjects.map, grid_multi, {});
			return result ?? {status: "success"};
		}

		static async updateAttachedPrototype(document, change, options, userId){
			if(foundry.utils.getProperty(options, `${moduleName}.update`)) return {status: "ignored"};
			const initiatingUser = game.users.get?.(userId)
				?? game.users.find(user => user._id === userId || user.id === userId);
			const sceneId = initiatingUser?.viewedScene;
			const scene = sceneId ? game.scenes.get(sceneId) : null;
			if(!scene){
				if(game.userId !== userId) return {status: "ignored"};
				return TokenAttacher.reportSceneActionFailure("Update attached prototype", new Error("The initiating user's Scene is unavailable."), {
					documentId: document?.id,
					sceneId
				});
			}
			const firstSceneGM = game.users.find(user => user.isGM && user.active && user.viewedScene === scene.id);
			if(!firstSceneGM){
				if(game.userId !== userId) return {status: "ignored"};
				return TokenAttacher.reportSceneActionFailure("Update attached prototype", new Error(TokenAttacher.format(localizedStrings.error.NoActiveGMFound)), {
					documentId: document?.id,
					sceneId: scene.id
				});
			}
			if(game.user !== firstSceneGM) return {status: "ignored"};
			if(canvas.scene?.id !== scene.id) throw new Error(`The assigned GM is no longer viewing Scene ${scene.id}.`);
			if(!change.prototypeToken?.flags?.[moduleName]) return {status: "ignored"};

			const prototypeToken = foundry.utils.mergeObject(
				document.prototypeToken.toObject(),
				change.prototypeToken,
				{inplace: false}
			);
			if(!TokenAttacher.isAttachmentBase(prototypeToken)) return {status: "ignored"};

			if(TokenAttacher.isAttachmentUIOpen()){			
				console.log("Token Attacher | " + 	game.i18n.format(localizedStrings.error.UIisOpenOnAssign));			
				ui.notifications.error(game.i18n.format(localizedStrings.error.UIisOpenOnAssign));
			}

			let prototypeAttached = TokenAttacher.generatePrototypeAttached(prototypeToken);
			let newToken = foundry.utils.duplicate(prototypeToken);
			foundry.utils.deleteProperty(newToken, `flags.${moduleName}.attached`);
			newToken.flags ??= {};
			newToken.flags[moduleName] ??= {};
			if(globalThis._del !== undefined) newToken.flags[moduleName].attached = globalThis._del;
			else newToken.flags[moduleName]["-=attached"] = null;
			foundry.utils.setProperty(newToken, `flags.${moduleName}.prototypeAttached`, prototypeAttached);
			foundry.utils.setProperty(newToken, `flags.${moduleName}.grid`, TokenAttacher.getCurrentGrid());
			await document.update({prototypeToken: newToken}, {diff:false, [moduleName]: {update: true}});
			return {status: "success", changed: 1};
		}

		static generatePrototypeAttached(token_data, attached={}){
			let prototypeAttached = {};			
			if(Object.keys(attached).length == 0) attached = token_data.flags[moduleName].attached;

			for (const key in attached) {
				if (attached.hasOwnProperty(key)) {
					const documentType = TokenAttacher.normalizeDocumentType(key);
					prototypeAttached[documentType] ??= [];
					prototypeAttached[documentType].push(...TokenAttacher.getObjectsFromIds("Token", token_data, documentType, attached[key]));
				}
			}	
			return prototypeAttached;
		}

		static transformBaseIntoPrototype(baseDocument){
			const transformedData = baseDocument.toCompendium();
			const prototypeAttached = TokenAttacher.generatePrototypeAttached(transformedData);

			delete transformedData.flags[moduleName].attached;
			transformedData.flags[moduleName].prototypeAttached = prototypeAttached;
			transformedData.flags[moduleName].grid = TokenAttacher.getCurrentGrid();
			return transformedData;
		}

		static isAttachmentBase(document){
			return document?.flags?.[moduleName]?.hasOwnProperty("attached");
		}

		static copyTokens(layer, tokens){
			const copyPrototypeMap = {map: {}};
			const prototypeMap= {};
			for(const token of tokens ?? []){
				if(TokenAttacher.isAttachmentBase(token.document)){
					prototypeMap[token.document.id] = TokenAttacher.generatePrototypeAttached(token.document);
				}
			}
			copyPrototypeMap.map[layer.constructor.documentName] = prototypeMap;
			copyPrototypeMap.grid = TokenAttacher.getCurrentGrid();
			TokenAttacher.ensureRuntimeState().copyPrototypeMap = foundry.utils.duplicate(copyPrototypeMap);
			void TokenAttacher.runAction("Save copied Token attachment metadata", async () => {
				await game.user.setFlag(moduleName, "copyPrototypeMap", copyPrototypeMap);
				return {status: "success"};
			}, {context: {surface: "copy-wrapper", tokenCount: tokens?.length ?? 0}});
			return copyPrototypeMap;
		}

		static pasteTokens(copy, toCreate){
			const copyPrototypeMap = TokenAttacher.ensureRuntimeState().copyPrototypeMap
				?? game.user.getFlag(moduleName, "copyPrototypeMap");
			const validMap = copyPrototypeMap?.map && (typeof copyPrototypeMap.map === "object");
			for (let i = 0; i < (toCreate?.length ?? 0); i++) {
				toCreate[i].flags ??= {};
				if(toCreate[i].flags.hasOwnProperty(moduleName)
					&& 	toCreate[i].flags[moduleName].hasOwnProperty("attached")){
					delete toCreate[i].flags[moduleName].attached;
					const source = copy?.[i];
					const clsname = source?.layer?.constructor?.documentName;
					if(validMap && clsname && copyPrototypeMap.map.hasOwnProperty(clsname)){
						toCreate[i].flags[moduleName].prototypeAttached = copyPrototypeMap.map[clsname][copy[i].document._id];	
						toCreate[i].flags[moduleName].grid = copyPrototypeMap.grid;	
					}
					else {
						console.warn("Token Attacher | copied Token attachment metadata is unavailable", {index: i, clsname});
						TokenAttacher.notify("warn", localizedStrings.error.InvalidCopiedAttachments);
					}
				}
			}
		}

		static async deleteToken(document, options, userId){
			const scene = document.parent ?? canvas.scene;
			if(!(scene?.deleteEmbeddedDocuments instanceof Function)){
				throw new Error("The Token's Scene is unavailable for attachment cleanup.");
			}
			const activeGM = game.users.find(user => user.isGM && user.active);
			if(!activeGM){
				const error = new Error(`No active GM is available to clean attachments for Token ${document._id}.`);
				if(userId === game.user.id || userId === game.user._id){
					console.error("Token Attacher | Token deletion attachment cleanup has no active GM", {
						sceneId: scene.id,
						tokenId: document._id,
						userId
					}, error);
					TokenAttacher.notify("error", localizedStrings.error.ActionFailed, {
						action: "Delete Token attachments",
						message: error.message
					});
					return {status: "error", error, notified: true};
				}
				return {status: "ignored", changed: 0};
			}
			if(game.user !== activeGM) return {status: "ignored", changed: 0};
			const attached=foundry.utils.getProperty(document, `flags.${moduleName}.attached`) || {};
			if(Object.keys(attached).length == 0) return {status: "ignored", changed: 0};

			if(foundry.utils.getProperty(options, `${moduleName}.update`)) return {status: "ignored", changed: 0};
			//Combine with eventual bases
			const ownershipConflicts = [];
			let deletes = TokenAttacher.getChildrenIds(attached, {}, {
				scene,
				expectedParentId: document._id,
				ownershipConflicts
			});
			if(ownershipConflicts.length){
				console.warn("Token Attacher | preserved stale-listed children owned by another attachment base", {
					sceneId: scene.id,
					deletingTokenId: document._id,
					children: ownershipConflicts
				});
				TokenAttacher.notify("warn", localizedStrings.error.ObjectsAttachedElsewhere, {
					count: ownershipConflicts.length
				});
			}
			let nativeCascadeCount = 0;
			if(TokenAttacher.isV14() && deletes.Region){
				const deletingTokenIds = new Set([document._id, ...(deletes.Token || [])]);
				const preservedForeignRegions = [];
				deletes.Region = deletes.Region.filter(id => {
					const region = scene.getEmbeddedDocument("Region", id);
					const parentId = TokenAttacher.getNativeRegionParentId(region);
					if(!parentId) return true;
					if(!deletingTokenIds.has(parentId)) preservedForeignRegions.push({regionId: id, nativeParentId: parentId});
					else nativeCascadeCount += 1;
					// Foundry owns native Region cascading. Never explicitly delete a
					// native attachment, especially one owned by a foreign Token.
					return false;
				});
				if(!deletes.Region.length) delete deletes.Region;
				if(preservedForeignRegions.length){
					console.warn("Token Attacher | preserved Regions whose native owner is not being deleted", {
						sceneId: scene.id,
						deletingTokenId: document._id,
						regions: preservedForeignRegions
					});
					TokenAttacher.notify("warn", localizedStrings.error.ObjectsAttachedElsewhere, {
						count: preservedForeignRegions.length
					});
				}
			}

			//Fire deletes
			let changed = nativeCascadeCount;
			for (const key in deletes) {
				if (deletes.hasOwnProperty(key)) {
					const documentType = TokenAttacher.normalizeDocumentType(key);
					const ids = deletes[key].filter(id => scene.getEmbeddedDocument(documentType, id));
					if(ids.length){
						await scene.deleteEmbeddedDocuments(documentType, ids, {[moduleName]:{update:true}});
						changed += ids.length;
					}
				}
			}
			if(changed === 0){
				const alreadyNotified = ownershipConflicts.length > 0;
				if(!alreadyNotified){
					console.warn("Token Attacher | deleted Token had attachment metadata but no owned child documents could be removed", {
						sceneId: scene.id,
						tokenId: document._id,
						attached
					});
					TokenAttacher.notify("warn", localizedStrings.error.NoAttachments);
				}
				return {status: "noop", changed: 0, notified: true};
			}
			return {status: "success", changed, notified: ownershipConflicts.length > 0};
		}

		static getChildrenIds(attached, all_ids, {
			scene=canvas.scene,
			visited=new Set(),
			expectedParentId=null,
			ownershipConflicts=[]
		}={}){
			for (const key in attached) {
				if (attached.hasOwnProperty(key)) {
					if(!all_ids.hasOwnProperty(key)) all_ids[key] = [];

					for (let i = 0; i < attached[key].length; i++) {
						const id = attached[key][i];
						const documentType = TokenAttacher.normalizeDocumentType(key);
						const visitKey = `${documentType}:${id}`;
						if(visited.has(visitKey)) continue;
						visited.add(visitKey);

						let element = scene?.getEmbeddedDocument?.(documentType, id);
						if(!element && scene?.id === canvas.scene?.id) element = TokenAttacher.getElementDocument(documentType, id);
						if(!element) continue;		
						const parentIds = TokenAttacher.getAttachmentParentIds(element, documentType);
						const expectedOwnerMissing = Boolean(expectedParentId && !parentIds.has(expectedParentId));
						const foreignParentIds = expectedParentId
							? [...parentIds].filter(parentId => parentId !== expectedParentId)
							: [];
						if(expectedOwnerMissing || foreignParentIds.length){
							ownershipConflicts.push({
								documentType,
								documentId: id,
								expectedParentId,
								actualParentIds: [...parentIds]
							});
							continue;
						}

						all_ids[key].push(id);
						const child_attached=foundry.utils.getProperty(element, `flags.${moduleName}.attached`) || {};

						if(Object.keys(child_attached).length > 0) {
							TokenAttacher.getChildrenIds(child_attached, all_ids, {
								scene,
								visited,
								expectedParentId: id,
								ownershipConflicts
							});
						}
						
					}
				}
			}
			return all_ids;
		}

		static preCreateBase(document, objData, options, userId){
			//Ignore anything from anyone not in your scene
			if(game.users.find(u => u._id ==userId)?.viewedScene != game.user.viewedScene) return;
			
			let updates = {};
			if(foundry.utils.getProperty(document,`flags.${moduleName}.prototypeAttached`)){				
				foundry.utils.setProperty(updates, `flags.${moduleName}.needsPostProcessing`, true);
			}
			if(foundry.utils.getProperty(document,`flags.${moduleName}.pos`) && !document.flags[moduleName].pos.width){
				let pos = TokenAttacher.getBasePositon('Token', document);
				foundry.utils.setProperty(updates, `flags.${moduleName}.pos`, foundry.utils.mergeObject(pos, document.flags[moduleName].pos));
			}
			if(Object.keys(updates).length> 0) document.updateSource(updates);
			return true;
		}

		static async updateAttachedCreatedToken(type, document, options, userId){
			const scene = document.parent ?? game.scenes.get(TokenAttacher.getDocumentSceneId(document));
			if(!scene){
				if(game.userId !== userId) return {status: "ignored"};
				return TokenAttacher.reportSceneActionFailure("Create Token attachments", new Error("The created Token's Scene is unavailable."), {
					documentId: document?._id
				});
			}
			const firstSceneGM = game.users.find(user => user.isGM && user.active && user.viewedScene === scene.id);
			if(!firstSceneGM){
				if(game.userId !== userId) return {status: "ignored"};
				return TokenAttacher.reportSceneActionFailure("Create Token attachments", new Error(TokenAttacher.format(localizedStrings.error.NoActiveGMFound)), {
					documentId: document?._id,
					sceneId: scene.id
				});
			}
			if(game.user !== firstSceneGM) return {status: "ignored"};
			if(canvas.scene?.id !== scene.id){
				throw new Error(`The GM assigned to create Token attachments is no longer viewing Scene ${scene.id}.`);
			}
			const tokenObject = document.object ?? canvas.tokens.get(document._id);
			const token = tokenObject ?? document;
			//Checks for multilevel tokens and v&m
			if(tokenObject && foundry.utils.getProperty(game, 'multilevel')) {
				if(game.multilevel._isReplicatedToken(tokenObject)) await document.unsetFlag(moduleName, 'attached');
			}
			if(foundry.utils.getProperty(options, "isUndo") === true && foundry.utils.getProperty(options, "mlt_bypass") === true) return {status: "ignored"};

			if(foundry.utils.getProperty(options, `${moduleName}.update`)) return {status: "ignored"};
			
			const prototypeAttached = document.getFlag(moduleName, "prototypeAttached") || {};
			const attached = document.getFlag(moduleName, "attached") || {};
			
			if(foundry.utils.getProperty(options, "isUndo") === true){
				if(Object.keys(attached).length > 0){
					return TokenAttacher.regenerateAttachedFromHistory(token, attached);
				}
				return {status: "ignored"};
			}

			if(Object.keys(prototypeAttached).length > 0){
				if(TokenAttacher.isPrototypeAttachedModel(prototypeAttached, 2)){
					const error = new Error(TokenAttacher.format(localizedStrings.error.ActorDataModelNeedsMigration));
					console.warn("Token Attacher | old prototype data blocked attachment creation", {
						documentId: document._id,
						sceneId: scene.id
					}, error);
					TokenAttacher.notify("error", localizedStrings.error.ActorDataModelNeedsMigration);
					return {status: "error", error, notified: true};
				}
				
				let grid_multi = document.getFlag(moduleName, "grid") || TokenAttacher.getCurrentGrid();
				//Convert pre V12
				grid_multi.sizeX = grid_multi.w ?? grid_multi.sizeX; 
				grid_multi.sizeY = grid_multi.h ?? grid_multi.sizeY; 
				
				const currentGrid = TokenAttacher.getCurrentGrid();

				grid_multi.size = currentGrid.size / grid_multi.size;
				grid_multi.sizeX = currentGrid.sizeX / grid_multi.sizeX;
				grid_multi.sizeY = currentGrid.sizeY / grid_multi.sizeY;
				const creationOptions = {...options, [moduleName]: {...options[moduleName], sceneId: scene.id}};
				return TokenAttacher.regenerateAttachedFromPrototype(type, token, prototypeAttached, grid_multi, creationOptions);
			}
			return {status: "ignored"};
		}

		static async regenerateAttachedFromPrototype(baseType, base, prototypeAttached, grid_multi, options={},  return_data = false){
			options = {...options, [moduleName]: {...options[moduleName]}};
			grid_multi = foundry.utils.mergeObject({size:1, sizeX: 1, sizeY:1}, grid_multi);
			let pasted = {};
			let toCreate = {};
			const baseDocument = base.document ?? base;
			const scene = baseDocument.parent
				?? game.scenes.get(options[moduleName].sceneId)
				?? canvas.scene;
			if(!scene) throw new Error("The attachment Scene is unavailable for object creation.");
			options[moduleName].sceneId = scene.id;
			const state = TokenAttacher.ensureRuntimeState();
			options[moduleName].canvasEpoch ??= state.canvasEpoch;
			options[moduleName].canvasSceneId ??= scene.id;
			const assertCurrentCanvas = () => {
				if(state.canvasEpoch !== options[moduleName].canvasEpoch || canvas.scene?.id !== options[moduleName].canvasSceneId){
					throw new Error("The scene changed while attached objects were being created. The partial paste was cancelled.");
				}
			};
			assertCurrentCanvas();
			const grid = this.getCurrentGrid();
			
			prototypeAttached = TokenAttacher.preparePrototypeAttachedV14(prototypeAttached);

			for (const key in prototypeAttached) {
				if (prototypeAttached.hasOwnProperty(key) && key !== "unknown" && prototypeAttached[key].length > 0) {
					if(!toCreate.hasOwnProperty(key)) toCreate[key] = [];
					toCreate[key] = await TokenAttacher.offsetPositionOfElements(key, prototypeAttached[key], baseType, baseDocument, grid, grid_multi);
					assertCurrentCanvas();
					
					for (let i = 0; i < toCreate[key].length; i++) {
						let entity = toCreate[key][i];
						entity = foundry.utils.mergeObject(prototypeAttached[key][i], entity);
						delete entity._id;
						if(TokenAttacher.isV14() && (key === "Region")){
							entity.attachment ??= {};
							entity.attachment.token = baseDocument._id ?? null;
							if(baseDocument._id) foundry.utils.setProperty(entity, `flags.${moduleName}.parent`, baseDocument._id);
						}
						toCreate[key][i] = entity;
					}

					if(!toCreate[key]) delete toCreate[key];					
				}
			}

			
			for (const key in prototypeAttached) {
				for (let i = 0; i < prototypeAttached[key].length; i++) {
					const element = prototypeAttached[key][i];
					const element_protoAttached = foundry.utils.getProperty(element, `flags.${moduleName}.prototypeAttached`);
					if(element_protoAttached){
						const toCreateElement = toCreate[key].find(item => foundry.utils.getProperty(item , `flags.${moduleName}.pos.base_id`) === foundry.utils.getProperty(element , `flags.${moduleName}.pos.base_id`));
						let subCreated = await TokenAttacher.regenerateAttachedFromPrototype(key, toCreateElement, element_protoAttached, grid_multi, options, true);
						assertCurrentCanvas();
						for (const subKey in subCreated) {
							if (subCreated.hasOwnProperty(subKey)) {
								const element = subCreated[subKey];
								if(!toCreate.hasOwnProperty(subKey)) toCreate[subKey] = [];
								toCreate[subKey] = toCreate[subKey].concat(subCreated[subKey]);
							}
						}
					}
				}
			}
			if(return_data) return toCreate;
			const toCreateCount = Object.values(toCreate).reduce((count, values) => count + (values?.length ?? 0), 0);
			if(toCreateCount === 0) return TokenAttacher.noop(localizedStrings.error.NoAttachments);
			
			foundry.utils.setProperty(options,`${moduleName}.base`, {type: baseType, doc: baseDocument})
			foundry.utils.setProperty(options,`${moduleName}.update`, true)
			const allowed = Hooks.call("preCreatePlaceableObjects", scene, toCreate, options, game.userId);
			if (allowed === false) {
				console.warn(`${moduleName} | creation of PlaceableObjects prevented by preCreatePlaceableObjects hook`);
				return TokenAttacher.noop(localizedStrings.error.CreationPrevented);
			}

			try {
				for (const key in toCreate) {
					if (!toCreate.hasOwnProperty(key)) continue;
					assertCurrentCanvas();
					if(key === "Tile") {
						toCreate[key] = TokenAttacher.zSort(true, key, toCreate[key]);
						let promises = [];
						for (let i = 0; i < toCreate[key].length; i++) {
							const element = toCreate[key][i];
							if(element.img){
								element.texture = {...element.texture, src: element.img};
								delete element.img;
							}
							if(element.texture?.src && element.texture?.src !== "" && element.texture?.src !== null) promises.push(loadTexture(element.texture?.src, {fallback: 'icons/svg/hazard.svg'}));
						}
						await Promise.all(promises);
						assertCurrentCanvas();
					}
					if(key === "Drawing") {
						let promises = [];
						for (let i = 0; i < toCreate[key].length; i++) {
							const element = toCreate[key][i];
							if(element.img){
								element.texture = {...element.texture, src: element.img};
								delete element.img;
							}
							if(element.texture?.src && element.texture?.src !== "" && element.texture?.src !== null) promises.push(loadTexture(element.texture?.src, {fallback: 'icons/svg/hazard.svg'}));
						}
						await Promise.all(promises);
						assertCurrentCanvas();
					}
					if(!(scene.createEmbeddedDocuments instanceof Function)) throw new Error(`Scene ${scene.id} cannot create ${key} documents.`);
					const created = await scene.createEmbeddedDocuments(key, toCreate[key], options);
					const createdDocuments = Array.isArray(created) ? created.filter(Boolean) : (created ? [created] : []);
					if(createdDocuments.length) {
						pasted[key] ??= [];
						pasted[key].push(...createdDocuments);
					}
					if(createdDocuments.length !== toCreate[key].length){
						throw new Error(`Scene ${scene.id} created ${createdDocuments.length} of ${toCreate[key].length} requested ${key} document(s).`);
					}
					assertCurrentCanvas();
				}

				const postProcessResult = game.user.isGM
					? await TokenAttacher.batchPostProcess(scene, pasted, options, game.userId)
					: await TokenAttacher.emitSocketAction("createPlaceableObjects", [pasted, options, game.userId], {
						action: "Post-process attached objects",
						sceneId: scene.id
					});
				if(postProcessResult?.status === "error"){
					throw postProcessResult.error ?? new Error("The GM could not post-process the created attachments.");
				}
				if(!postProcessResult || ["noop", "cancelled", "ignored"].includes(postProcessResult.status)){
					throw new Error("The created attachments were not post-processed.");
				}
				foundry.utils.setProperty(options, `${moduleName}.postProcessed`, true);
				Hooks.callAll("createPlaceableObjects", scene, pasted, options, game.userId);
				ui.notifications.info(game.i18n.format(localizedStrings.info.PastedAndAttached));
				return {status: "success", changed: toCreateCount};
			}
			catch(error){
				const rollbackErrors = [];
				if(scene.deleteEmbeddedDocuments instanceof Function){
					for(const [key, documents] of Object.entries(pasted).reverse()){
						const ids = documents.map(document => document?._id ?? document?.id).filter(Boolean);
						if(!ids.length) continue;
						try {
							await scene.deleteEmbeddedDocuments(TokenAttacher.normalizeDocumentType(key), ids, {
								[moduleName]: {update: true, rollback: true}
							});
						}
						catch(rollbackError){
							rollbackErrors.push(rollbackError);
							console.error("Token Attacher | created attachment rollback failed", {
								sceneId: scene.id,
								documentType: key,
								documentIds: ids
							}, rollbackError);
						}
					}
				}
				else if(Object.keys(pasted).length){
					rollbackErrors.push(new Error(`Scene ${scene.id} cannot roll back created attachments.`));
				}
				if(rollbackErrors.length) error.rollbackErrors = [...(error.rollbackErrors ?? []), ...rollbackErrors];
				throw error;
			}
		}

		/*	RegenerateLinks on pasted objects
			example: pasted = {'Token': [someobject....]}
		*/
		static async regenerateLinks(createdDocs, options={}, userId="", scene=canvas.scene){
			if(!scene) throw new Error("The attachment Scene is unavailable for link regeneration.");
			const getDocument = (type, id) => {
				const document = scene.getEmbeddedDocument?.(TokenAttacher.normalizeDocumentType(type), id);
				if(document || scene.id !== canvas.scene?.id) return document;
				return TokenAttacher.getElementDocument(type, id);
			};
			let updates = {};
			let afterUpdates = {};
			const pushUpdate = (key, update, updateObj) => {
				if(!updateObj.hasOwnProperty(key)) updateObj[key] = [];
				const dupIndex = updateObj[key].findIndex(item => update._id === item._id);
				if(dupIndex === -1) updateObj[key].push(update);
				else updateObj[key][dupIndex] = foundry.utils.mergeObject(updateObj[key][dupIndex], update);
			};
			for (const key in createdDocs) {
				if (createdDocs.hasOwnProperty(key)) {
					const arr = createdDocs[key];
					for (let i = 0; i < arr.length; i++) {
						const baseDoc = arr[i];
						const old_base_id = foundry.utils.getProperty(baseDoc , `flags.${moduleName}.pos.base_id`);
						if(old_base_id) {
							let current_attached = foundry.utils.duplicate(foundry.utils.getProperty(baseDoc , `flags.${moduleName}.attached`) ?? {});
							let new_attached = {}; 
							for (const type in createdDocs) {
								if (createdDocs.hasOwnProperty(type)) {
									new_attached[type] = createdDocs[type].filter(doc => foundry.utils.getProperty(doc , `flags.${moduleName}.parent`) === old_base_id);
									for (let j = 0; j < new_attached[type].length; j++) {
										const attached_element = new_attached[type][j];	
										let update =  {_id: attached_element._id};	
										update[`flags.${moduleName}.parent`] = baseDoc._id;
										if(TokenAttacher.isV14() && (type === "Region")) update["attachment.token"] = baseDoc._id;
										pushUpdate(type, update, updates);
									}
									new_attached[type] = new_attached[type].map(doc => doc._id);
									if(current_attached && current_attached.hasOwnProperty(type)){
									current_attached[type] = current_attached[type].filter(item => foundry.utils.getProperty(getDocument(type, item), `flags.${moduleName}.parent`) === baseDoc._id);
										new_attached[type] = [...new Set(new_attached[type].concat(current_attached[type]))];
									}
									if(new_attached[type].length <= 0) delete new_attached[type];
								}
							}
							let update = {
								_id: baseDoc._id, 
								hidden: foundry.utils.getProperty(baseDoc, `flags.${moduleName}.pos.hidden`) ?? baseDoc.hidden, 
								[`flags.${moduleName}.attached`]: new_attached, 
								[`flags.${moduleName}.pos.base_id`]: baseDoc._id
							};
							TokenAttacher.markForDeletion(update, `flags.${moduleName}.prototypeAttached`);
							TokenAttacher.markForDeletion(update, `flags.${moduleName}.grid`);
							let afterUpdate = {
								_id: baseDoc._id,
								[`flags.${moduleName}.pos`]: TokenAttacher.getBasePositon('Token', baseDoc)
							};
							TokenAttacher.markForDeletion(afterUpdate, `flags.${moduleName}.needsPostProcessing`);
							pushUpdate(key, update, updates);
							pushUpdate(key, afterUpdate, afterUpdates);
						}				
					}
				}
			}

			//Instant attach?			
			if(foundry.utils.getProperty(options, `${moduleName}.InstantAttach.userId`) === userId){
				
				if(foundry.utils.getProperty(options, `${moduleName}.base`)){				
					const attach_base = scene.getFlag(moduleName, "attach_base");
					const element = attach_base?.type && attach_base?.element
						? getDocument(attach_base.type, attach_base.element)
						: null;

					const child = foundry.utils.getProperty(options, `${moduleName}.base`);

					let subUpdates = element
						? await TokenAttacher._AttachToToken(element, {type:child.type, ids:[child.doc?._id]}, true, true, {scene})
						: {};
					for (const key in subUpdates) {
						if (subUpdates.hasOwnProperty(key)) {
							const updateArray = subUpdates[key];
							for (let i = 0; i < updateArray.length; i++) {
								const upd = updateArray[i];
								pushUpdate(key, upd, updates);								
							}
						}
					}
				}
			}

			const batches = [];
			for(const updateGroup of [updates, afterUpdates]){
				for(const [key, documentUpdates] of Object.entries(updateGroup)){
					if(!documentUpdates.length) continue;
					const documentType = TokenAttacher.normalizeDocumentType(key);
					const rollbacks = documentUpdates.map(update => {
						const document = getDocument(documentType, update._id);
						if(!document){
							throw new Error(`${documentType} ${update._id} disappeared before attachment links could be regenerated.`);
						}
						return TokenAttacher.captureDocumentUpdateRollback(document, update);
					});
					batches.push({documentType, documentUpdates, rollbacks});
				}
			}

			const attempted = [];
			try {
				for(const batch of batches){
					attempted.push(batch);
					await scene.updateEmbeddedDocuments(batch.documentType, batch.documentUpdates, {[moduleName]:{update:true}});
				}
			}
			catch(error){
				const rollbackErrors = [];
				for(const batch of attempted.reverse()){
					try {
						await scene.updateEmbeddedDocuments(batch.documentType, batch.rollbacks, {
							[moduleName]: {update: true, rollback: true}
						});
					}
					catch(rollbackError){
						rollbackErrors.push(rollbackError);
						console.error("Token Attacher | regenerated link rollback failed", {
							sceneId: scene.id,
							documentType: batch.documentType,
							documentIds: batch.documentUpdates.map(update => update._id)
						}, rollbackError);
					}
				}
				if(rollbackErrors.length) error.rollbackErrors = [...(error.rollbackErrors ?? []), ...rollbackErrors];
				throw error;
			}
			return {status: "success", changed: Object.values(updates).reduce((count, values) => count + values.length, 0)};
		}

		static async deleteMissingLinks(){		
			const scene = canvas.scene;
			if(!scene) return TokenAttacher.noop(localizedStrings.error.NoActiveScene);
			let deletes = {};
			let repairs = {};
			const preservedNativeRegions = [];
			const pushUpdate = (key, update, updateObj) => {
				if(!updateObj.hasOwnProperty(key)) updateObj[key] = [];
				const dupIndex = updateObj[key].findIndex(item => update=== item);
				if(dupIndex === -1) updateObj[key].push(update);
			};
			for (const type of TokenAttacher.registeredLayers) {
				for(const document of TokenAttacher.getSceneDocuments(type, scene)){
					const needsPostProcessing = Boolean(foundry.utils.getProperty(document, `flags.${moduleName}.needsPostProcessing`));
					const flagParentId = foundry.utils.getProperty(document, `flags.${moduleName}.parent`)
						?? document.getFlag?.(moduleName, "parent");
					const missingFlagParent = Boolean(flagParentId && !scene.tokens.get(flagParentId));
					if(!needsPostProcessing && !missingFlagParent) continue;

					if(TokenAttacher.isV14() && TokenAttacher.normalizeDocumentType(type) === "Region"){
						const ownership = TokenAttacher.getRegionNativeOwnership(document, scene);
						if(ownership.nativeBase && ownership.nativeParentId !== flagParentId){
							const repair = {_id: document._id};
							for(const key of ["parent", "offset", "unlocked", "canMoveConstrained", "needsPostProcessing"]){
								TokenAttacher.markForDeletion(repair, `flags.${moduleName}.${key}`);
							}
							pushUpdate("Region", repair, repairs);
							preservedNativeRegions.push({
								regionId: document._id,
								staleParentId: flagParentId,
								nativeParentId: ownership.nativeParentId
							});
							continue;
						}
					}
					pushUpdate(type, document._id, deletes);
				}
			}
			for(const [type, typeRepairs] of Object.entries(repairs)){
				await scene.updateEmbeddedDocuments(TokenAttacher.normalizeDocumentType(type), typeRepairs, {[moduleName]:{update:true}});
			}
			//Fire deletes
			for (const key in deletes){
				if (deletes.hasOwnProperty(key)) {
					await scene.deleteEmbeddedDocuments(TokenAttacher.normalizeDocumentType(key), deletes[key], {[moduleName]:{update:true}});
				}
			}
			if(preservedNativeRegions.length){
				console.warn("Token Attacher | preserved native Regions while cleaning stale Token Attacher links", {
					sceneId: scene.id,
					regions: preservedNativeRegions
				});
				TokenAttacher.notify("warn", localizedStrings.error.ObjectsAttachedElsewhere, {
					count: preservedNativeRegions.length
				});
			}
			const changed = Object.values(deletes).reduce((count, ids) => count + ids.length, 0)
				+ Object.values(repairs).reduce((count, values) => count + values.length, 0);
			if(changed === 0) return {...TokenAttacher.noop(localizedStrings.error.NoTokenAttacherData), changed: 0};
			TokenAttacher.notify("info", localizedStrings.info.MissingLinksCleaned, {count: changed});
			return {status: "success", changed, notified: true};
		}
		
		static async batchPostProcess(parent, createdDocs, options, userId){	
			if(!game.user.isGM) return {status: "ignored"};
			const scene = typeof parent === "string" ? game.scenes.get(parent) : parent;
			if(!scene) throw new Error("The Scene for attachment post-processing no longer exists.");
			let myCreatedDocs = createdDocs;
			if(foundry.utils.getProperty(options, `${moduleName}.base`)){
				const base = foundry.utils.getProperty(options, `${moduleName}.base`);
				myCreatedDocs = foundry.utils.duplicate(createdDocs);
				if(!foundry.utils.getProperty(myCreatedDocs, base.type)) myCreatedDocs[base.type] = [base.doc];
				else{
					if(!myCreatedDocs[base.type].find(doc => doc._id === base.doc._id)){
						myCreatedDocs[base.type].push(base.doc);
					}
				}
			}
			await TokenAttacher.regenerateLinks(myCreatedDocs, options, userId, scene);
			ui.notifications.info(game.i18n.format(localizedStrings.info.PostProcessingFinished));
			return {status: "success"};
		}

		static async regenerateAttachedFromHistory(token, attached){
			TokenAttacher.detectGM();
			const tokenDocument = token.document ?? token;
			const newattached= {};
			for (const key in attached) {
				if (attached.hasOwnProperty(key) && attached[key].length > 0) {
					let layer = TokenAttacher.getLayerOrCollection(key);
					
					const undone = await layer.undoHistory();
					if(Array.isArray(undone)){
						newattached[key] = undone.map((obj)=>{
							return obj.id ?? obj.document?._id;
						}).filter(Boolean);
					}
					else{
						newattached[key] = [undone?.id ?? undone?.document?._id].filter(Boolean);
					}
				}
			}
			
			await tokenDocument.setFlag(moduleName, `attached`, newattached);
			return {
				status: "success",
				changed: Object.values(newattached).reduce((count, ids) => count + ids.length, 0)
			};
		}

		static mapActorForExport(actor){
			return {img:actor.img, name:actor.name, folder:actor.folder?.id ?? actor._source?.folder ?? null, prototypeToken: actor.prototypeToken, flags: actor.flags};
		}

		static async showJSONExportDialog(title, content){
			const html = await foundry.applications.handlebars.renderTemplate(`${templatePath}/ImExportUI.html`, {
				label_content: "Copy the JSON below:",
				content
			});
			const DialogV2 = foundry.applications?.api?.DialogV2;
			if(DialogV2){
				await DialogV2.prompt({
					window: {title},
					content: html,
					ok: {label: "Close", callback: () => true},
					modal: true,
					rejectClose: false
				});
				return {status: "success"};
			}

			await Dialog.prompt({title, content: html, callback: () => true});
			return {status: "success"};
		}

		static async promptForJSON(title, html){
			const DialogV2 = foundry.applications?.api?.DialogV2;
			if(DialogV2){
				return DialogV2.prompt({
					window: {title},
					content: html,
					ok: {
						label: "Import",
						callback: (_event, button) => button.form?.elements?.JSONContent?.value ?? ""
					},
					modal: true,
					rejectClose: false
				});
			}

			return Dialog.prompt({
				title,
				content: html,
				callback: dialogHtml => dialogHtml.find('[name="JSONContent"]').val() ?? ""
			});
		}

		static async getActorsWithPrototype(){
			const folders = {};
			const allActors = [...game.actors].filter(actor =>{
				const attached = foundry.utils.getProperty(actor, `prototypeToken.flags.${moduleName}.prototypeAttached`) || {};
				if(Object.keys(attached).length > 0) return true;
				return false;
			});
			const allMappedActors = allActors.map(TokenAttacher.mapActorForExport);

			let addParentFolder = (folders, folder) =>{
				const parent = folder.folder || null;
				if(parent){
					folders[parent._id] = parent;
					addParentFolder(folders, parent);
				}
			};

			allMappedActors.forEach(actor => {
				const folder = game.folders.get(actor.folder) || null;
				if(folder){
					folders[folder._id] = folder;
					addParentFolder(folders, folder);
				}
			});
			return TokenAttacher.showJSONExportDialog("Export Actors to JSON", JSON.stringify({
				folder: folders,
				actors: allMappedActors,
				['data-model']: game.settings.get(moduleName, "data-model-version")
			}));
		}

		static async getActorsWithPrototypeInCompendiums(){
			const allCompendiums = [...game.packs].filter(pack =>{
				if(pack.documentName !== "Actor") return false;
				return true;
			});
			const actors = [];

			for (const pack of allCompendiums) {
				const packIndex = await pack.getIndex();
				for (const index of packIndex) {
					const actor = await pack.getDocument(index._id);
					if(!actor){
						throw new Error(`Actor ${index._id} could not be loaded from compendium ${pack.collection ?? pack.metadata?.name ?? "unknown"}.`);
					}
					const attached = foundry.utils.getProperty(actor, `prototypeToken.flags.${moduleName}.prototypeAttached`) || {};
					if(Object.values(attached).some(entries => Array.isArray(entries) && entries.length)) actors.push(actor);
				}
			}
			return actors;
		}

		static async exportCompendiumToJSON(pack){
			const folders = {};			
			const sidebarFolders = {};
			const packIndex = await pack.getIndex();
			let actors = [];
			for (const index of packIndex) {
				const entity = await pack.getDocument(index._id);
				actors.push(TokenAttacher.mapActorForExport(entity));
			}

			let addParentFolder = (folders, folder) =>{
				if(!folder) return;
				const parent = folder.folder || null;
				if(parent && !folders[parent._id]){
					folders[parent._id] = parent;
					addParentFolder(folders, parent);
				}
			};
			//Sidebar folders of compendium
			const bottomLevelSidebarFolder = pack.folder || null;
			if(bottomLevelSidebarFolder) {
				sidebarFolders[bottomLevelSidebarFolder._id] = bottomLevelSidebarFolder;
				addParentFolder(sidebarFolders, bottomLevelSidebarFolder);
			}

			//folders in compendium
			actors.forEach(actor => {
				const folder = pack.folders?.get(actor.folder) ?? game.folders.get(actor.folder) ?? null;
				if(folder){
					folders[folder._id] = folder;
					addParentFolder(folders, folder);
				}
			});

			return TokenAttacher.showJSONExportDialog("Export Actors to JSON", JSON.stringify({
				compendium: {
					name:pack.metadata.name, 
					label:pack.metadata.label,
					folder: bottomLevelSidebarFolder?._id
				}, 
				actors: actors, 
				['data-model']: game.settings.get(moduleName, "data-model-version"),
				compendiumFolders: folders,
				sidebarFolders: sidebarFolders
				}));
		}

		static async importFromJSONDialog(){
			const html = await foundry.applications.handlebars.renderTemplate(`${templatePath}/ImExportUI.html`, {label_content:"Paste JSON below:", content:""});
			while(true){
				const json = await TokenAttacher.promptForJSON("Import Actors from JSON", html);
				if(json === null || json === undefined) return {status: "cancelled"};
				if(!String(json).trim()){
					TokenAttacher.notify("warn", localizedStrings.error.NoValidJSONProvided);
					continue;
				}
				try {
					const parsed = JSON.parse(json);
					if(!parsed || typeof parsed !== "object" || !Array.isArray(parsed.actors) || (!parsed.folder && !parsed.compendium)){
						throw new Error("JSON does not contain a Token Attacher actor export.");
					}
				}
				catch(error){
					console.warn("Token Attacher | invalid import JSON", error);
					TokenAttacher.notify("warn", localizedStrings.error.NoValidJSONProvided);
					continue;
				}
				await TokenAttacher.importFromJSON(json);
				return {status: "success"};
			}
		}
		static async importFromJSON(json, options={}){
			const imported = JSON.parse(json);
			if(!imported || typeof imported !== "object" || !Array.isArray(imported.actors) || (!imported.folder && !imported.compendium)){
				throw new Error(TokenAttacher.format(localizedStrings.error.NoValidJSONProvided));
			}
			if(imported.folder) TokenAttacher.validateImportFolderGraph(imported.folder, imported.actors);
			if(imported.compendium) TokenAttacher.validateImportFolderGraph(imported.compendiumFolders || {}, imported.actors);
			const name = imported.folder || imported.compendium?.label;
			console.log("Token Attacher - Starting JSON Import for " + name);
			ui.notifications.info(game.i18n.format(localizedStrings.info.ImportingJSONStart, {name: name}));
			if(imported.folder)	await TokenAttacher.importFromJSONWithFolders(imported, options);
			if(imported.compendium)	await TokenAttacher.importFromJSONWithCompendium(imported, options);
			console.log("Token Attacher - Finished JSON Import for " + name);
			ui.notifications.info(game.i18n.format(localizedStrings.info.ImportingJSONFinished, {name: imported.folder || imported.compendium?.name}));
		}

		static getDefaultActorForSystem(){
			let actorType;
			let documentTypes = game.documentTypes?.Actor ?? game.system.documentTypes?.Actor ?? [];
			let typesArray = Array.isArray(documentTypes) ? documentTypes : Object.keys(documentTypes);
			if(game.system.id == 'wfrp4e') actorType = typesArray.find(a => a == 'character');
			if(!actorType) actorType = typesArray.find(a => a == 'npc');
			if(!actorType) actorType = typesArray[0]
			return actorType;
		}

		static normalizeImportFolderId(value){
			if(value && typeof value === "object") value = value._id ?? value.id;
			if(value === null || value === undefined || value === "") return null;
			return String(value);
		}

		static validateImportFolderGraph(folders, actors=[]){
			if(!folders || typeof folders !== "object" || Array.isArray(folders) || !Array.isArray(actors)){
				throw new Error(TokenAttacher.format(localizedStrings.error.NoValidJSONProvided));
			}

			const nodes = new Map();
			for(const [key, folder] of Object.entries(folders)){
				if(!folder || typeof folder !== "object" || Array.isArray(folder)){
					throw new Error(TokenAttacher.format(localizedStrings.error.NoValidJSONProvided));
				}
				const id = TokenAttacher.normalizeImportFolderId(folder._id ?? folder.id ?? key);
				if(!id || nodes.has(id)){
					throw new Error(TokenAttacher.format(localizedStrings.error.NoValidJSONProvided));
				}
				const parentId = TokenAttacher.normalizeImportFolderId(folder.folder ?? folder.parent);
				nodes.set(id, {id, parentId, folder});
			}

			for(const node of nodes.values()){
				if(node.parentId !== null && !nodes.has(node.parentId)){
					throw new Error(TokenAttacher.format(localizedStrings.error.ImportFolderMissingParent, {
						folder: node.folder.name ?? node.id,
						parent: node.parentId
					}));
				}
			}

			const state = new Map();
			const ordered = [];
			const visit = node => {
				const currentState = state.get(node.id) ?? 0;
				if(currentState === 2) return;
				if(currentState === 1){
					throw new Error(TokenAttacher.format(localizedStrings.error.ImportFolderCycle, {
						folder: node.folder.name ?? node.id
					}));
				}
				state.set(node.id, 1);
				if(node.parentId !== null) visit(nodes.get(node.parentId));
				state.set(node.id, 2);
				ordered.push(node);
			};
			for(const node of nodes.values()) visit(node);

			for(const actor of actors){
				const folderId = TokenAttacher.normalizeImportFolderId(actor?.folder);
				if(folderId !== null && !nodes.has(folderId)){
					throw new Error(TokenAttacher.format(localizedStrings.error.ImportActorMissingFolder, {
						actor: actor?.name ?? "",
						folder: folderId
					}));
				}
			}

			return {nodes, ordered};
		}

		static async importFromJSONWithFolders(imported, options={}){
			const folders = imported.folder;
			const actors = imported.actors;
			const {ordered} = TokenAttacher.validateImportFolderGraph(folders, actors);
			const parentMap = new Map([[null, null]]);
			for(const {id, parentId, folder} of ordered){
				const newFolder = await Folder.create({
					name: folder.name,
					type: "Actor",
					folder: parentMap.get(parentId)
				});
				parentMap.set(id, newFolder._id);
			}
			const actorType = TokenAttacher.getDefaultActorForSystem();
			await Promise.all(actors.map(actor => Actor.create({
				type: actorType,
				img: actor.img,
				name: actor.name,
				folder: parentMap.get(TokenAttacher.normalizeImportFolderId(actor.folder)),
				prototypeToken: actor.prototypeToken ?? actor.token,
				flags: actor.flags
			})));
		}

		static async importFromJSONWithCompendium(imported, options={}){
			const compendium = imported.compendium;
			const actors = imported.actors;
			const folders = imported.compendiumFolders || {};
			const sidebarFolders = imported.sidebarFolders || {};
			const {ordered} = TokenAttacher.validateImportFolderGraph(folders, actors);
			let name = compendium.name;
			let label = compendium.label;
			if(options.hasOwnProperty("module")) name = options.module + "-" + name;
			if(options.hasOwnProperty("module-label")) label = "("+options["module-label"] + ")" + label;
			let slugified_name = name.slugify({strict:true});
			if(name !== slugified_name){
				console.error("Token Attacher - Importing a JSON Compendium where the name is not slugified, contact the author to slugify the name: ", label, name);
			} 
			//Add folder of compendium before creating the compendium
			let parentMap = {null:{value:null}};
			let allPromises = [];
			let sideBarFolder = null;
			
			// if(options.addSidebarFolders){
			// 	for (const key in sidebarFolders) {
			// 		if (sidebarFolders.hasOwnProperty(key)) {
			// 			const folder = sidebarFolders[key];
			// 			allPromises.push((async (folder)=>{
			// 				if(!parentMap.hasOwnProperty(folder.folder)) {
			// 					let resolver;
			// 					parentMap[folder.folder] = {value:new Promise((resolve)=>{resolver = resolve}), signal: resolver};
			// 				}
			// 				const parent = await parentMap[folder.folder].value._id;
			// 				let newFolder;
			// 				let existingFolders = game.folders.filter(f => f.name == folder.name);
			// 				if(existingFolders.length == 0){
			// 					newFolder = await Folder.create({name: folder.name, type: "Compendium", folder: parent}, {});
			// 				} 
			// 				else {
								
			// 				}
			// 				if(!parentMap.hasOwnProperty(folder._id)) {
			// 					parentMap[folder._id] = {value:new Promise((resolve) => (resolve(newFolder)))};
			// 				}
			// 				else {
			// 					parentMap[folder._id].signal(newFolder);
			// 				}
			// 			})(folder));
			// 		}
			// 	}
			// 	await Promise.all(allPromises);
			// 	sideBarFolder = await parentMap[compendium.folder].value;
			// }

			let worldCompendium = await CompendiumCollection.createCompendium({label:label, name: slugified_name, type:"Actor", folder: sideBarFolder});


			//Add Folders in compedium
			parentMap = new Map([[null, null]]);
			for(const {id, parentId, folder} of ordered){
				const newFolder = await Folder.create({
					name: folder.name,
					type: "Actor",
					folder: parentMap.get(parentId)
				}, {pack: worldCompendium.collection});
				parentMap.set(id, newFolder._id);
			}
			let creates = [];
			const actorType = TokenAttacher.getDefaultActorForSystem();
			actors.forEach(actor => creates.push({
				type: actorType,
				img: actor.img,
				name: actor.name,
				prototypeToken: actor.prototypeToken ?? actor.token,
				flags: actor.flags,
				folder: parentMap.get(TokenAttacher.normalizeImportFolderId(actor.folder))
			}));
			// if(!imported.hasOwnProperty('data-model') || imported['data-model'] !== game.settings.get(moduleName, "data-model-version")){
			// 		//Maybe add some compendium migration code if necessary	
			// }
			return await worldCompendium.documentClass.create(creates, {pack:worldCompendium.collection});
		}
		
		//Attached elements are only allowed to be moved by token attacher functions.
		static isAllowedToMove(type, document, change={}, options={}, userId){
			const initiatingUser = game.users.get?.(userId) ?? game.users.find?.(user => user._id === userId || user.id === userId);
			// A pre-update on another viewed Scene is irrelevant to this client.
			if(initiatingUser?.viewedScene && initiatingUser.viewedScene !== game.user.viewedScene) return true;
			const currentUserId = game.user?.id ?? game.user?._id;
			const shouldNotify = !userId || userId === game.user?.id || userId === game.user?._id;
			const veto = (key, data={}, {level="warn", reason=key}={}) => {
				if(shouldNotify){
					console.warn("Token Attacher | movement blocked", {
						reason,
						documentId: document?.id ?? document?._id,
						documentType: type,
						parentId: foundry.utils.getProperty(document, `flags.${moduleName}.parent`) ?? null,
						sceneId: document?.parent?.id ?? canvas.scene?.id,
						userId: userId ?? currentUserId
					});
					TokenAttacher.notify(level, key, data);
				}
				return false;
			};
			const offsetOwnedFields = [
				"x", "y", "c", "rotation", "direction", "width", "height", "depth",
				"shape", "shapes", "level", "radius", "dim", "bright", "distance",
				"hidden", "elevation"
			];
			const positionChanged = offsetOwnedFields.some(field => Object.hasOwn(change, field))
				|| ["dim", "bright"].some(field => Object.hasOwn(change.config ?? {}, field))
				|| ["anchorX", "anchorY"].some(field => Object.hasOwn(change.texture ?? {}, field))
				|| ["elevation", "rangeBottom", "rangeTop"].some(field => Object.hasOwn(change.flags?.levels ?? {}, field))
				|| ["wallHeightBottom", "wallHeightTop"].some(field => Object.hasOwn(change.flags?.wallHeight ?? {}, field))
				|| ["bottom", "top"].some(field => Object.hasOwn(change.flags?.["wall-height"] ?? {}, field));
			
			if(	(positionChanged || Object.keys(change).length == 0)
				&&	foundry.utils.getProperty(document, `flags.${moduleName}.needsPostProcessing`) 
				&& !foundry.utils.getProperty(options, `${moduleName}`)) {				
				return veto(localizedStrings.error.PostProcessingNotFinished, {}, {
					level: "error",
					reason: "post-processing-incomplete"
				});
			}

			if(!positionChanged) return true;
			if(options._attachedRegions) return true;

			let animate = foundry.utils.getProperty(document, `flags.${moduleName}.animate`) ?? true;
			if(!animate) foundry.utils.setProperty(options, `animate`, animate);

			let offset = foundry.utils.getProperty(document, `flags.${moduleName}.offset`) || {};
			if(Object.keys(offset).length === 0) return true;
			if(foundry.utils.getProperty(options, `${moduleName}.update`)) return true;
			let objParent = foundry.utils.getProperty(document, `flags.${moduleName}.parent`) || "";
			if(TokenAttacher.isAttachmentUIOpen() && TokenAttacher.isCurrentAttachUITarget(objParent)) return true;
			if(game.user.isGM){
				let quickEdit = foundry.utils.getProperty(window, 'tokenAttacher.quickEdit');
				if(quickEdit && (canvas.scene?.id ?? canvas.scene?._id) === quickEdit.scene) {
					foundry.utils.setProperty(options, `${moduleName}.QuickEdit`, true);
					return true;
				}
			}
			if(!foundry.utils.getProperty(options, `${moduleName}.update`)
			&& foundry.utils.getProperty(document, `flags.${moduleName}.canMoveConstrained`)) {
				const parentDocument = document?.parent?.tokens?.get?.(objParent)
					?? canvas.scene?.tokens?.get?.(objParent)
					?? canvas.tokens?.get?.(objParent)?.document;
				if(!parentDocument){
					return veto(localizedStrings.error.AttachmentParentMissing, {parent: objParent}, {
						reason: "attachment-parent-missing"
					});
				}
				const canMoveConstrained = foundry.utils.getProperty(document, `flags.${moduleName}.canMoveConstrained`);
				
				const updatedDocumentData= foundry.utils.mergeObject(foundry.utils.duplicate(document), change);

				let isAllowed = false;
				switch(canMoveConstrained.type){
					case TokenAttacher.CONSTRAINED_TYPE.TOKEN_CONSTRAINED:
						isAllowed = (type === "Token" && TokenAttacher.isMovingInParent(updatedDocumentData, parentDocument));
						break;
					case TokenAttacher.CONSTRAINED_TYPE.UNCONSTRAINED:
						isAllowed = (type === "Token");
						break;
					default:
						isAllowed = (type === "Token" && TokenAttacher.isMovingInParent(updatedDocumentData, parentDocument));
						break;
				}
				if(isAllowed){
					const base_type = "Token";
					const new_offset = TokenAttacher.getElementOffset(type, updatedDocumentData, base_type, parentDocument, {});
					foundry.utils.setProperty(change, `flags.${moduleName}.offset`, new_offset);
					return true;
				}
			}
			return veto(localizedStrings.error.AttachedObjectMovementBlocked, {}, {
				reason: "attached-object-direct-movement"
			});
		}
		
		static isMovingInParent(child, base) {			
			const currentGrid = TokenAttacher.getCurrentGrid();

			return Number.between(child.x, base.x, base.x + (base.width * currentGrid.sizeX)) 
			&& Number.between(child.y, base.y, base.y + (base.height * currentGrid.sizeY))
			&& Number.between(child.x + (child.width * currentGrid.sizeX), base.x, base.x + (base.width * currentGrid.sizeX)) 
			&& Number.between(child.y + (child.height * currentGrid.sizeY), base.y, base.y + (base.height * currentGrid.sizeY));;
		}

		static handleBaseMoved(document, change, options, userId){
			//Ignore anything from anyone not in your scene
			if(game.users.find(u => u._id ==userId)?.viewedScene != game.user.viewedScene) return;
			
			if(!(	change.hasOwnProperty("x")
				||	change.hasOwnProperty("y")
				||	change.hasOwnProperty("c")
				||	change.hasOwnProperty("rotation"))){
				return true;
			}
			let attached = foundry.utils.getProperty(document, `flags.${moduleName}.attached`);
			if(!attached) return true;			
			
			const mlt_block_movement = game.settings.get(moduleName, 'MLTBlockMovement') || false;
			if(mlt_block_movement){
				if(TokenAttacher.hasVehiclesDrawing(attached)){
					if(foundry.utils.getProperty(options, "isUndo") === true)
						if(foundry.utils.getProperty(options, "mlt_bypass") === true) return false;
				}
			}

			let animate = foundry.utils.getProperty(document, `flags.${moduleName}.animate`) ?? true;
			if(!animate) foundry.utils.setProperty(options, `animate`, animate);

			if(game.user.isGM){
				let quickEdit = foundry.utils.getProperty(window, 'tokenAttacher.quickEdit');
				if(quickEdit && canvas.scene._id === quickEdit.scene) {
					foundry.utils.setProperty(options, `${moduleName}.QuickEdit`, true);
				}
			}
			return true;
		}

		static doAttachmentsNeedUpdate(document, change, options, userId){
			const attached=document.getFlag(moduleName, "attached") || {};
			if(Object.keys(attached).length == 0) return true;
			
			let needUpdate = true;
			if(!(	change.hasOwnProperty("x")
				||	change.hasOwnProperty("y")
				||	change.hasOwnProperty("c")
				||	change.hasOwnProperty("rotation")
				||	change.hasOwnProperty("direction")
				||	change.hasOwnProperty("width")
				||	change.hasOwnProperty("height")
				||	change.hasOwnProperty("shape")
				||	change.hasOwnProperty("level")
				||	change.hasOwnProperty("radius")
				||	change.hasOwnProperty("dim")
				||	change.hasOwnProperty("bright")
				||	change.hasOwnProperty("distance")
				||	change.hasOwnProperty("hidden")

				||	change.hasOwnProperty("elevation")
				)){
				needUpdate = false;
			}

			if(foundry.utils.getProperty(options, `${moduleName}.QuickEdit`)) needUpdate = false;

			if(foundry.utils.getProperty(options, `${moduleName}.update`)) needUpdate = false;			

			foundry.utils.setProperty(options, `${moduleName}.attachmentsNeedUpdate`, needUpdate);
			Hooks.callAll(`${moduleName}.doAttachmentsNeedUpdate`, document, change, options, userId);
			return true;
		}

		static hasVehiclesDrawing(attached){
			let result = false;
			for (const key in attached) {
				if (attached.hasOwnProperty(key)) {
					for (let i = 0; i < attached[key].length; i++) {
						const id = attached[key][i];		

						let element = TokenAttacher.layerGetElement(key, id);
						if(!element) continue;		

						const child_attached=foundry.utils.getProperty(element.document, `flags.${moduleName}.attached`) || {};

						if(Object.keys(child_attached).length > 0) {
							result = result || TokenAttacher.hasVehiclesDrawing(child_attached);
						}		

						if(key === 'Drawing'){
							result = result || (foundry.utils.getProperty(element.document, `flags.vehicles.captureTokens`) > 0);
						}				
					}
				}
			}
			return result;
			
		}
		//Attached elements are only allowed to be selected while token attacher ui is open.
		static isAllowedToControl(object, isControlled){
			let offset = object.document.getFlag(moduleName, 'offset') || {};
			if(Object.keys(offset).length === 0) return;
			let objParent = object.document.getFlag(moduleName, 'parent') || {};
			if(TokenAttacher.isAttachmentUIOpen() && TokenAttacher.isCurrentAttachUITarget(objParent)) return;
			let unlocked = object.document.getFlag(moduleName, 'unlocked');
			if(unlocked) return;
			
			if(game.user.isGM){
				let quickEdit = foundry.utils.getProperty(window, 'tokenAttacher.quickEdit');
				if(quickEdit && canvas.scene._id === quickEdit.scene) return;
			}
			return object.release();
		}

		static isCurrentAttachUITarget(id){
			if(!TokenAttacher.isAttachmentUIOpen() || !canvas.scene) return false;
			const attachmentUI = window.document.getElementById("tokenAttacher");
			if(!attachmentUI) return false;
			const {sceneId, baseType, baseId} = attachmentUI.dataset;
			if(sceneId !== canvas.scene.id || !baseType || !baseId) return false;
			const attachmentBase = canvas.scene.getFlag(moduleName, "attach_base");
			if(attachmentBase?.type !== baseType || attachmentBase?.element !== baseId) return false;
			return baseId === id && Boolean(TokenAttacher.layerGetElement(baseType, baseId));
		}

		//Detach Elements when they get deleted
		static async DetachAfterDelete(type, document, options, userId){
			if(foundry.utils.getProperty(options, `${moduleName}.update`)) return {status: "ignored"};
			if(game.userId !== userId) return {status: "ignored"};
			const objParent = foundry.utils.getProperty(document, `flags.${moduleName}.parent`) || "";
			if(!objParent) return {status: "ignored"};
			const sceneId = TokenAttacher.getDocumentSceneId(document);
			const scene = sceneId ? game.scenes.get(sceneId) : null;
			if(!scene){
				const error = new Error("Detach deleted attachment was rejected because its originating Scene is unavailable.");
				return TokenAttacher.reportSceneActionFailure("Detach deleted attachment", error, {documentId: document?._id});
			}
			const eventdata = [objParent, {type, ids:[document._id]}, true, {skip_update:true}];
			if(TokenAttacher.isFirstActiveGM(scene.id)){
				return TokenAttacher._DetachFromToken(
					objParent,
					{type, ids:[document._id]},
					true,
					{skip_update:true, scene, strictScene: true}
				);
			}
			return TokenAttacher.emitSocketAction("DetachFromToken", eventdata, {
				action: "Detach deleted attachment",
				sceneId: scene.id
			});
		}

		//Reattach elements that are recreated via Undo
		static async ReattachAfterUndo(type, document, options, userId){
			if(game.userId !== userId) return {status: "ignored"};
			const objParent = foundry.utils.getProperty(document, `flags.${moduleName}.parent`) || "";
			if(!objParent) return {status: "ignored"};
			if(foundry.utils.getProperty(options, "isUndo") === true){
				if(foundry.utils.getProperty(options, "mlt_bypass") === true) return {status: "ignored"};
				const sceneId = TokenAttacher.getDocumentSceneId(document);
				const scene = sceneId ? game.scenes.get(sceneId) : null;
				if(!scene){
					const error = new Error("Restore attachment was rejected because its originating Scene is unavailable.");
					return TokenAttacher.reportSceneActionFailure("Restore attachment", error, {documentId: document?._id});
				}
				if(TokenAttacher.isFirstActiveGM(scene.id)){
					return TokenAttacher._ReattachAfterUndo(type, document, options, userId, {scene, strictScene: true});
				}
				return TokenAttacher.emitSocketAction("ReattachAfterUndo", [type, document._id, options, userId], {
					action: "Restore attachment",
					sceneId: scene.id
				});
			}
			return {status: "ignored"};
		}

		//Reattach elements that are recreated via Undo or remove the attachment completly if the base doesn't exist anymore
		static async _ReattachAfterUndo(type, entity, options, userId, {scene=entity?.parent ?? canvas.scene, strictScene=false}={}){
			if(!scene) throw new Error("The Scene for restoring an attachment is unavailable.");
			let objParent = foundry.utils.getProperty(entity, `flags.${moduleName}.parent`) || "";
			const parent_token = TokenAttacher.getSceneDocument(scene, "Token", objParent)
				?? (strictScene ? null : canvas.scene?.tokens?.get(objParent));
			if(parent_token){
				return TokenAttacher._AttachToToken(parent_token, {type:type, ids:[entity._id]}, true, false, {scene, strictScene});
			}
			else{
				const element = TokenAttacher.getSceneDocument(scene, type, entity._id)
					?? (strictScene ? null : TokenAttacher.getElementDocument(type, entity._id));
				if(!element) throw new Error(`${type} ${entity._id} is no longer available to restore or clean up.`);
				const relationshipUpdate = TokenAttacher._detachRelationshipUpdate(
					entity._id,
					TokenAttacher.normalizeDocumentType(type),
					objParent,
					element
				);
				if(!relationshipUpdate) return {status: "ignored"};
				delete relationshipUpdate._id;
				await element.update(relationshipUpdate, {[moduleName]: {update: true}});
				return {status: "success", changed: 1};
			}
		}

		//Rectangle Selection hook to select and attach every element on every layer inside the rectangle 
		static async _RectangleSelection(event){
			if(game.activeTool !== "select") return {status: "cancelled"};
			const attachmentUI = window.document.getElementById("tokenAttacher");
			const selectButton = attachmentUI?.querySelector(".control-tool.select");
			if(!selectButton?.classList.contains("active")) return {status: "cancelled"};
			selectButton.classList.remove("active");

			const token = TokenAttacher.resolveAttachmentUIBase(attachmentUI);
			if(!token){
				await TokenAttacher.closeTokenAttacherUI({saveOffsets: false});
				TokenAttacher.notify("error", localizedStrings.error.BaseDoesntExist);
				return {status: "noop", notified: true};
			}
			const coords = event?.interactionData?.coords;
			if(!coords) throw new Error("Foundry did not provide rectangle-selection coordinates.");
			const {x, y, width, height, releaseOptions={}, controlOptions={}}=coords;
			let selected = {};	
			const baseId = token.document._id;
			for (const type of TokenAttacher.registeredLayers) {
				const layer = canvas.getLayerByEmbeddedName(type) ?? TokenAttacher.getLayerByEmbeddedName(type);
				const selectAll = (layer) => {
					if(!layer) return;
					//if (layer.options.controllableObjects) {
						// Identify controllable objects
						const controllable = layer.placeables.filter(obj => !obj.document.locked
							&& ((type === "Region") || obj.visible)
							&& (obj.control instanceof Function));
						const newSet = controllable.filter(obj => {
							let c = obj.center;
							//filter base out
							if(obj.document._id === baseId) return;
							//Filter attached elements except when they are already attached to the base
							const parent = obj.document.getFlag(moduleName, 'parent') || "";
							if(parent !== "" && parent !== baseId) return;
							//filter all inside selection
							return Number.between(c.x, x, x+width) && Number.between(c.y, y, y+height);
						});	
						if(!Array.isArray(selected[type])) selected[type] = [];	
						selected[type] = selected[type].concat(newSet.map(a => a.document._id).filter(a => !selected[type].includes(a)));
						if(selected[type].length <= 0) delete selected[type];		
					//}
					}
				selectAll(layer);
				if(type === "Tile" && canvas.foreground){
					selectAll(canvas.foreground);
				}
			}
			if(Object.keys(selected).length === 0) return TokenAttacher.noop(localizedStrings.error.NoElementsInRectangle);
			return TokenAttacher._attachElementsToToken(selected, token, false);
		}

		static areDuplicatesInAttachChain(base, attached, {scene=null, strictScene=false}={}){
			const baseDocument = base.document ?? base;
			scene ??= baseDocument.parent ?? canvas.scene;
			const baseType = TokenAttacher.normalizeDocumentType(
				base.layer?.constructor.documentName ?? baseDocument.documentName
			);
			const visiting = new Set();
			const visited = new Set();
			const getDocument = (documentType, id) => {
				documentType = TokenAttacher.normalizeDocumentType(documentType);
				return TokenAttacher.getSceneDocument(scene, documentType, id)
					?? (strictScene ? null : TokenAttacher.getElementDocument(documentType, id));
			};
			const visit = (document, documentType, proposedAttached=null) => {
				if(!document) return false;
				documentType = TokenAttacher.normalizeDocumentType(documentType ?? document.documentName);
				const documentId = document._id ?? document.id;
				const key = `${documentType}:${documentId}`;
				if(visiting.has(key) || visited.has(key)) return document;
				visiting.add(key);
				const children = proposedAttached ?? document.getFlag?.(moduleName, "attached") ?? {};
				for(const [childType, childIds] of Object.entries(children)){
					if(childType === "unknown" || !Array.isArray(childIds)) continue;
					for(const childId of childIds){
						const child = getDocument(childType, childId);
						const duplicate = visit(child, childType);
						if(duplicate) return duplicate;
					}
				}
				visiting.delete(key);
				visited.add(key);
				return false;
			};

			return visit(baseDocument, baseType, attached);
		}

		static getCenter(type, objData, grid = {}){
			grid = foundry.utils.mergeObject({sizeX: canvas.grid.sizeX, sizeY:canvas.grid.sizeY}, grid);
			const [x,y] = [objData.x, objData.y];
			let center = {x:x, y:y};

			//Tokens are a special case because their center depends on the type of grid
			if(type == "Token"){
				if(TokenAttacher.isV14()){
					let tokenDocument = objData instanceof CONFIG.Token.documentClass ? objData : canvas.scene?.tokens?.get(objData._id);
					try {
						tokenDocument ??= new CONFIG.Token.documentClass(objData, {parent: canvas.scene});
						return tokenDocument.getCenterPoint(objData);
					}
					catch(error){
						console.warn("Token Attacher | Falling back to legacy Token center calculation.", error);
					}
				}
				if(canvas.grid.type == CONST.GRID_TYPES.GRIDLESS || canvas.grid.type == CONST.GRID_TYPES.SQUARE){
					let [width, height] = [objData.width * grid.sizeX, objData.height * grid.sizeY]
					center={x:x + (Math.abs(width) / 2), y:y + (Math.abs(height) / 2)};
					return center;
				}
				if([CONST.GRID_TYPES.HEXODDR, CONST.GRID_TYPES.HEXEVENR].includes(canvas.grid.type)){
					let horizontalSpacing = grid.sizeX;
					let verticalSpacing = 3/4 * grid.sizeY;
					let [width, height] = [
						objData.width * horizontalSpacing, 
						objData.height * verticalSpacing + (1/3 * verticalSpacing)
					];
					center={
						x:x + (Math.abs(width) / 2),
					 	y:y + (Math.abs(height) / 2)
					};
					return center;
				}
				if([CONST.GRID_TYPES.HEXODDQ, CONST.GRID_TYPES.HEXEVENQ].includes(canvas.grid.type)){
					let horizontalSpacing = 3/4 * grid.sizeX;
					let verticalSpacing = grid.sizeY;
					let [width, height] = [
						objData.width * horizontalSpacing  + (1/3 * horizontalSpacing), 
						objData.height * verticalSpacing 
					];
					center={
						x:x + (Math.abs(width) / 2),
					 	y:y + (Math.abs(height) / 2)
					};
					return center;
				}
			}

			//V14 Tile x/y is an anchor pivot, not always the top-left corner.
			if(TokenAttacher.isV14() && (type === "Tile") && (objData.texture?.anchorX !== undefined) && (objData.texture?.anchorY !== undefined)){
				const a = Math.toRadians(objData.rotation ?? 0);
				const dx = (0.5 - objData.texture.anchorX) * objData.width;
				const dy = (0.5 - objData.texture.anchorY) * objData.height;
				return {
					x: x + ((Math.cos(a) * dx) - (Math.sin(a) * dy)),
					y: y + ((Math.sin(a) * dx) + (Math.cos(a) * dy))
				};
			}

			//Tiles
			if (objData.width && objData.height && objData.width != null) {
				let [width, height] = [objData.width, objData.height];
				if(TokenAttacher.isGridSpace(type)) [width, height] = [width * grid.sizeX, height * grid.sizeY]
				center={x:x + (Math.abs(width) / 2), y:y + (Math.abs(height) / 2)};
			}
			//Drawings
			if (objData.shape?.width && objData.shape?.height && objData.shape?.width != null) {
				let [width, height] = [objData.shape.width, objData.shape.height];
				if(TokenAttacher.isGridSpace(type)) [width, height] = [width * grid.sizeX, height * grid.sizeY]
				center={x:x + (Math.abs(width) / 2), y:y + (Math.abs(height) / 2)};
			}
			//Walls
			if("c" in objData){
				center = {x:(objData.c[0] + objData.c[2]) / 2, y: (objData.c[1] + objData.c[3]) / 2}
			}
			//TODO: Add hook
			return center;
			
		}

		static visualizeColor = parseInt("FFFFFF", 16);

		static async visualizeVector(x1, y1, x2, y2){
			const drawingData = {
				shape: {
					height: 50, 
					points : [0, 0, x2-x1, y2-y1], 
					type: Drawing.SHAPE_TYPES.POLYGON, 
					width: 50
				}, 
				x:x1, 
				y:y1,
				strokeColor: "#" + TokenAttacher.visualizeColor.toString(16)
			};
			TokenAttacher.visualizeColor = Math.round(Math.random() * 16777215);
			const options = {};
			foundry.utils.setProperty(options,`${moduleName}.base`, {});

			return await canvas.scene.createEmbeddedDocuments("Drawing", [drawingData], options);
		}

		//TODO: Add getRotation and hook
		//TODO: Add getElevation and hook

		static getSize(objData){
			return [objData.width ?? objData.radius  ?? objData.distance 
				?? (objData.config?.dim > objData.config?.bright ? objData.config?.dim: objData.config?.bright) 
				?? (objData.dim > objData.bright ? objData.dim: objData.bright),
			objData.height ?? objData.radius ?? objData.distance 
			?? (objData.config?.dim > objData.config?.bright ? objData.config?.dim: objData.config?.bright) 
			?? (objData.dim > objData.bright ? objData.dim: objData.bright)];

		}
		//Update z in elements_data and return elements_data
		static zSort(up, type, elements_data) {	
			const layer = canvas.getLayerByEmbeddedName(type) ?? TokenAttacher.getLayerByEmbeddedName(type);
			if(!layer) return elements_data;
			const overhead_layer = canvas.foreground ?? layer;
			const siblings = layer.placeables;	
			const overhead_siblings = overhead_layer.placeables;	
			// Determine target sort index
			let z_background = 0;
			let z_foreround = 0;
			if ( up ) {
				elements_data.sort((a, b) => a.sort - b.sort);
			  	z_background = siblings.length ? Math.max(...siblings.map(o => o.document.sort)) + 1 : 1;
			  	z_foreround = overhead_siblings.length ? Math.max(...overhead_siblings.map(o => o.document.sort)) + 1 : 1;
			}
			else {
				elements_data.sort((a, b) => b.sort - a.sort);
			  	z_background = siblings.length ? Math.min(...siblings.map(o => o.document.sort)) - 1 : -1;
			  	z_foreround = overhead_siblings.length ? Math.max(...overhead_siblings.map(o => o.document.sort)) + 1 : 1;
			}
		
			// Update all controlled objects
			for (let i = 0, j =0, k = 0; i < elements_data.length; i++) {
				let d;
				if(elements_data[i]?.overhead === "true"){
					d = up ? k++ : k++ * -1;
				}
				else{					
					d = up ? j++ : j++ * -1;
				}
				elements_data[i].sort = z_background + d;				
			}
			return elements_data;
		}

		static isGridSpace(type){
			if(type === "Tile") return false;
			if(type === "Drawing") return false;
			let additionalTypes = Hooks.call(`${moduleName}.isGridSpace`, type);

			return true && additionalTypes;
		}
		static async toggleQuickEditMode(){
			const quickEdit = TokenAttacher.ensureRuntimeState().quickEdit;
			return TokenAttacher.setQuickEditMode(!quickEdit);
		}

		static async ensureQuickEditOverlay({scene=canvas.scene, canvasEpoch=TokenAttacher.ensureRuntimeState().canvasEpoch}={}){
			if(!scene) throw new Error("The Quick Edit Scene is unavailable.");
			const state = TokenAttacher.ensureRuntimeState();
			const assertCurrentScene = () => {
				if(state.canvasEpoch !== canvasEpoch || canvas.scene?.id !== scene.id){
					throw new Error("The scene changed while Quick Edit Mode was opening. Enable it again on the current scene.");
				}
			};
			assertCurrentScene();

			const existing = window.document.getElementById("tokenAttacherQuickEdit");
			if(existing){
				const existingSceneId = existing.dataset?.sceneId;
				if(existingSceneId && existingSceneId !== scene.id){
					existing.remove();
					throw new Error(`A stale Quick Edit indicator for Scene ${existingSceneId} was removed.`);
				}
				if(existing.dataset) existing.dataset.sceneId = scene.id;
				return false;
			}

			const myHtml = await foundry.applications.handlebars.renderTemplate(`${templatePath}/QuickEdit.html`, {});
			assertCurrentScene();
			const anchor = window.document.getElementById("pause");
			if(!anchor) throw new Error("Foundry's pause container is unavailable.");
			anchor.insertAdjacentHTML('afterend', myHtml);
			const overlay = window.document.getElementById("tokenAttacherQuickEdit");
			if(!overlay) throw new Error("The Quick Edit indicator could not be rendered.");
			if(overlay.dataset) overlay.dataset.sceneId = scene.id;
			return true;
		}

		static async setQuickEditMode(value){
			if(!game.user.isGM) return TokenAttacher.noop(localizedStrings.error.QuickEditGMOnly);
			if(!canvas.scene) return TokenAttacher.noop(localizedStrings.error.NoActiveScene);
			const state = TokenAttacher.ensureRuntimeState();
			const scene = canvas.scene;
			const canvasEpoch = state.canvasEpoch;
			const assertCurrentScene = () => {
				if(state.canvasEpoch !== canvasEpoch || canvas.scene?.id !== scene.id){
					throw new Error("The scene changed while Quick Edit Mode was opening. Enable it again on the current scene.");
				}
			};

			if(value) {
				if(state.quickEditRecovery){
					await TokenAttacher.saveAllQuickEditOffsets(state.quickEditRecovery, game.scenes.get(state.quickEditRecovery.scene));
					delete state.quickEditRecovery;
					assertCurrentScene();
				}
				if(state.quickEdit?.scene === scene.id){
					const restored = await TokenAttacher.ensureQuickEditOverlay({scene, canvasEpoch});
					if(restored) TokenAttacher.notify("info", localizedStrings.info.QuickEditEnabled);
					return {status: "success", changed: Number(restored)};
				}
				if(state.quickEdit) throw new Error("Quick Edit Mode is still active for another scene.");

				window.document.getElementById("tokenAttacherQuickEdit")?.remove();
				await TokenAttacher.ensureQuickEditOverlay({scene, canvasEpoch});
				assertCurrentScene();
				state.quickEdit = {
					scene: scene.id,
					timer: null,
					elements: {},
					bases: {}
				};
				TokenAttacher.notify("info", localizedStrings.info.QuickEditEnabled);
				return {status: "success", changed: 1};
			}

			const quickEdit = state.quickEdit;
			if(!quickEdit){
				window.document.getElementById("tokenAttacherQuickEdit")?.remove();
				return {status: "success", changed: 0};
			}
			clearTimeout(quickEdit.timer);
			quickEdit.timer = null;
			const snapshot = foundry.utils.duplicate(quickEdit);
			try {
				await TokenAttacher.saveAllQuickEditOffsets(snapshot, game.scenes.get(snapshot.scene));
			}
			catch(error){
				await ui.controls.render?.();
				throw error;
			}
			delete state.quickEdit;
			window.document.getElementById("tokenAttacherQuickEdit")?.remove();
			TokenAttacher.notify("info", localizedStrings.info.QuickEditDisabled);
			return {status: "success", changed: 1};
		}

		static scheduleQuickEditSave(quickEdit){
			clearTimeout(quickEdit?.timer);
			return setTimeout(() => {
				void TokenAttacher.runAction("Save Quick Edit offsets", () => TokenAttacher.saveAllQuickEditOffsets(), {
					context: {surface: "quick-edit-timer", sceneId: quickEdit?.scene}
				});
			}, 1000);
		}

		static mergeQuickEditElements(target, source){
			for(const [type, entries] of Object.entries(source ?? {})){
				target[type] ??= [];
				for(const entry of entries){
					if(target[type].some(current => current._id === entry._id)) continue;
					target[type].push(entry);
				}
			}
		}

		static async saveAllQuickEditOffsets(quickEdit, scene){
			const state = TokenAttacher.ensureRuntimeState();
			const liveQuickEdit = quickEdit ? null : state.quickEdit;
			if(!quickEdit){
				if(!liveQuickEdit) return {status: "success", changed: 0};
				clearTimeout(liveQuickEdit.timer);
				quickEdit = foundry.utils.duplicate(liveQuickEdit);
				liveQuickEdit.elements = {};
				liveQuickEdit.bases = {};
				liveQuickEdit.timer = null;
			}
			scene ??= game.scenes.get(quickEdit.scene);
			if(!scene) throw new Error(`Quick Edit scene ${quickEdit.scene} no longer exists.`);

			let changed = 0;
			try {
				for (const [rawType, entries] of Object.entries(quickEdit.elements ?? {})) {
					const type = TokenAttacher.normalizeDocumentType(rawType);
					const updates = entries
						.filter(entry => scene.getEmbeddedDocument?.(type, entry._id) ?? (scene.id === canvas.scene?.id && TokenAttacher.getElementDocument(type, entry._id)))
						.map(entry => ({_id: entry._id, [`flags.${moduleName}.offset`]: entry.offset}));
					if(!updates.length) continue;
					await scene.updateEmbeddedDocuments(type, updates, {[moduleName]: {update: true}});
					changed += updates.length;
				}
			}
			catch(error){
				if(liveQuickEdit) TokenAttacher.mergeQuickEditElements(liveQuickEdit.elements, quickEdit.elements);
				throw error;
			}
			return {status: "success", changed};
		}

		static updateOffset(type, document, change, options, userId){
			//Ignore anything from anyone not in your scene
			if(game.users.find(u => u._id ==userId)?.viewedScene != game.user.viewedScene) return;
			
			//Only attached need to do anything
			let offset = foundry.utils.getProperty(document, `flags.${moduleName}.offset`);
			if(!offset) return;
			if(!foundry.utils.getProperty(options, `${moduleName}.QuickEdit`)) return;

			if(game.userId === userId && game.user.isGM){
				let quickEdit = foundry.utils.getProperty(window, 'tokenAttacher.quickEdit');
				if(quickEdit && canvas.scene._id === quickEdit.scene){					
					if(!foundry.utils.getProperty(options, `${moduleName}.QuickEdit`)) return;
					clearTimeout(quickEdit.timer);
					const parent_type = "Token";
					const parent_id = foundry.utils.getProperty(document, `flags.${moduleName}.parent`);
					const parent = TokenAttacher.getElementDocument(parent_type, parent_id);
					if(!parent) return;
					TokenAttacher.updateOffsetOfElement(quickEdit, parent_type, parent, type, document._id);
					quickEdit.timer = TokenAttacher.scheduleQuickEditSave(quickEdit);
				}
			}
		}

		static updateOffsetOfElement(quickEdit, base_type, base_data, type, element_id){
			type = TokenAttacher.normalizeDocumentType(type);
			const element = TokenAttacher.getElementDocument(type, element_id);
			if(!element) return;
			const new_offset = TokenAttacher.getElementOffset(type, element, base_type, base_data, {});
			//set offset locally only so the user see's the effects immediatly
			foundry.utils.setProperty(element, `flags.${moduleName}.offset`, new_offset);
			if(!foundry.utils.getProperty(quickEdit, `elements.${type}`)) quickEdit.elements[type] = [];
			const elemIndex = quickEdit.elements[type].findIndex(item => item._id === element_id);
			if(elemIndex === -1) quickEdit.elements[type].push({_id:element_id, offset:new_offset});
			else quickEdit.elements[type][elemIndex].offset = new_offset;
		}

		
		static _quickEditUpdateOffsetsOfBase(quickEdit, type, base_data){
			let attached = foundry.utils.getProperty(base_data, `flags.${moduleName}.attached`) || {};
			for (const key in attached) { 
				for (let i = 0; i < attached[key].length; i++) {
					const element_id = attached[key][i];
					const element = TokenAttacher.getElementDocument(key, element_id);
					if(!element) continue;
					TokenAttacher.updateOffsetOfElement(quickEdit, type, base_data, key, element_id);
					if(element.getFlag(moduleName, 'attached')){
						TokenAttacher._quickEditUpdateOffsetsOfBase(quickEdit, TokenAttacher.normalizeDocumentType(key), element);
					}
				}

			}
		}

		static async handleCanvasTearDown(canvasObj){
			const state = TokenAttacher.ensureRuntimeState();
			state.canvasEpoch += 1;
			const scene = canvasObj.scene;
			const pending = [];

			if(TokenAttacher.isAttachmentUIOpen()){
				pending.push(Promise.resolve(TokenAttacher.closeTokenAttacherUI({saveOffsets: true})));
			}
			else if(scene?.getFlag(moduleName, "attach_base")){
				pending.push(scene.unsetFlag(moduleName, "attach_base"));
			}
			window.document.getElementById("tokenAttacher")?.remove();
			TokenAttacher.clearAttachedHighlight();

			if(state.quickEdit){
				clearTimeout(state.quickEdit.timer);
				state.quickEdit.timer = null;
				const quickEdit = foundry.utils.duplicate(state.quickEdit);
				delete state.quickEdit;
				const quickEditScene = game.scenes.get(quickEdit.scene) ?? (scene?.id === quickEdit.scene ? scene : null);
				pending.push(TokenAttacher.saveAllQuickEditOffsets(quickEdit, quickEditScene).catch(error => {
					state.quickEditRecovery = quickEdit;
					throw error;
				}));
			}
			window.document.getElementById("tokenAttacherQuickEdit")?.remove();
			await Promise.all(pending);
			return {status: "success"};
		}

		static canvasInit(canvasObj){
			window.document.getElementById("tokenAttacher")?.remove();
			const state = TokenAttacher.ensureRuntimeState();
			state.canvasEpoch += 1;
			if(state.quickEdit && state.quickEdit.scene !== canvasObj.scene?.id){
				clearTimeout(state.quickEdit.timer);
				delete state.quickEdit;
				window.document.getElementById("tokenAttacherQuickEdit")?.remove();
				TokenAttacher.notify("error", localizedStrings.error.QuickEditNotFinished);
			}
			else if(!state.quickEdit) window.document.getElementById("tokenAttacherQuickEdit")?.remove();
		}

		static getLayerOrCollection(key){
			key = TokenAttacher.normalizeDocumentType(key);
			return canvas.getLayerByEmbeddedName(key) ?? TokenAttacher.getLayerByEmbeddedName(key) ?? game.collections.get(key);
		}

		static async setAnimateStatus(tokens, animate, suppressNotification=false){			
			let updates = tokens.map(elem =>{
				return {_id:elem.document._id, [`flags.${moduleName}.animate`]: animate};
			});
			await TokenAttacher.updateEmbeddedDocuments(tokens[0].layer.constructor.documentName, updates, {[moduleName]:{update:true}});
			if(!suppressNotification) ui.notifications.info(game.i18n.format(localizedStrings.info.AnimationToggled, {count: tokens.length}));
		}

		static async  toggleAnimateStatus(tokens, suppressNotification=false){
			let updates = tokens.map(elem =>{
				return {_id:elem.document._id, [`flags.${moduleName}.animate`]: !(elem.document.getFlag(moduleName,`animate`) ?? true)};
			});
			await TokenAttacher.updateEmbeddedDocuments(tokens[0].layer.constructor.documentName, updates, {[moduleName]:{update:true}});
			if(!suppressNotification) ui.notifications.info(game.i18n.format(localizedStrings.info.AnimationToggled, {count: tokens.length}));
		}

		static layerGetElement(layer, id){
			layer = TokenAttacher.normalizeDocumentType(layer);
			const layerObj = canvas.getLayerByEmbeddedName(layer) ?? TokenAttacher.getLayerByEmbeddedName(layer);
			const foreground = canvas.foreground ?? layerObj;
			let result = {element:null};
			if(layer) result.element = layerObj?.get?.(id) ?? foreground?.get?.(id);
			if(!result.element) Hooks.callAll(`${moduleName}.layerGetElement`, layer, id, result);
			return result.element;
		}

		static getElementDocument(type, id){
			type = TokenAttacher.normalizeDocumentType(type);
			try {
				const document = canvas.scene?.getEmbeddedDocument(type, id);
				if(document) return document;
			}
			catch(error){
				// Compatibility layers may not be core embedded document types.
			}
			return TokenAttacher.layerGetElement(type, id)?.document ?? null;
		}

		static getSceneDocuments(type, scene=canvas.scene){
			type = TokenAttacher.normalizeDocumentType(type);
			try {
				return [...scene.getEmbeddedCollection(type)];
			}
			catch(error){
				if(scene?.id !== canvas.scene?.id) return [];
				const layer = canvas.getLayerByEmbeddedName(type) ?? TokenAttacher.getLayerByEmbeddedName(type);
				return (layer?.placeables || []).map(element => element.document);
			}
		}

		static async migrateElementsInCompendiums(migrateFunc, elementTypes, topLevelOnly){
			const allCompendiums = [...game.packs].filter(pack =>{
				if(pack.locked) return false;
				if(pack.documentName !== "Actor") return false;
				return true;
			});
			let elementCount = 0;
			for (let i = 0; i < allCompendiums.length; i++) {
				const pack = allCompendiums[i];
				const packIndex = await pack.getIndex();
				let options = {};
				options.pack = pack;
				for (const index of packIndex) {
					const entity = await pack.getDocument(index._id);
					const prototypeAttached = foundry.utils.getProperty(entity, `prototypeToken.flags.${moduleName}.prototypeAttached`);
					if(prototypeAttached){
						const new_token = await TokenAttacher.migratePrototype(
							foundry.utils.getProperty(entity, `prototypeToken`),
							migrateFunc,
							elementTypes,
							topLevelOnly,
							options,
							entity
						);
						await entity.update({prototypeToken: new_token}, options);
						elementCount++;
					}
				}
				console.log("Token Attacher - Done migrating Elements in " + pack.metadata.label);
			}				
			console.log(`Token Attacher - Done migrating ${elementCount} Elements in ${allCompendiums.length} Compendiums!`);
			return {status: "success", changed: elementCount};
		}

		static async migrateElementsOfActor(actor, migrateFunc, elementTypes, topLevelOnly, options={}){
			const prototypeAttached = foundry.utils.getProperty(actor, `prototypeToken.flags.${moduleName}.prototypeAttached`);
			if(prototypeAttached){
				const new_token = await TokenAttacher.migratePrototype(foundry.utils.getProperty(actor, `prototypeToken`), migrateFunc, elementTypes, topLevelOnly, options);
				await actor.update({prototypeToken: new_token}, options);
			}
		}

		static async migratePrototype(prototypeToken, migrateFunc, elementTypes, topLevelOnly, options={}, baseEntity=prototypeToken){
			const prototypeAttached = foundry.utils.getProperty(prototypeToken, `flags.${moduleName}.prototypeAttached`);
			if(prototypeAttached){
				const new_token = foundry.utils.duplicate(prototypeToken);
				const migratedTypes = new Set(elementTypes);
				const updateBase = async base => {
					const children = foundry.utils.getProperty(base, `flags.${moduleName}.prototypeAttached`)
						?? foundry.utils.getProperty(base, `flags.${moduleName}.attached`);
					if(!children) return;
					for(const [childType, childElements] of Object.entries(children)){
						if(!Array.isArray(childElements)) continue;
						for(const element of childElements){
							if(typeof element === "string" || element instanceof String){
								console.error("Token Attacher - Migration Error, attached child is not an object.", {
									base,
									baseEntity,
									childType,
									childId: String(element)
								});
								continue;
							}
							if(migratedTypes.has(childType)) await migrateFunc(element, childType, baseEntity);
							await updateBase(element);
						}
					}
				};
				if(migratedTypes.has("Token")) await migrateFunc(new_token, "Token", baseEntity);
				if(!topLevelOnly) await updateBase(new_token);
				return new_token;
			}
			return prototypeToken;
		}

		static async purgeTAData(scene=canvas.scene){
			if(!scene) return TokenAttacher.noop(localizedStrings.error.NoActiveScene);
			let updates = {};
			const preservedNativeRegions = [];
			const pushUpdate = (key, update, updateObj) => {
				if(!updateObj.hasOwnProperty(key)) updateObj[key] = [];
				const dupIndex = updateObj[key].findIndex(item => update._id=== item._id);
				if(dupIndex === -1) updateObj[key].push(update);
			};
			for (const type of TokenAttacher.registeredLayers) {
				for(const document of TokenAttacher.getSceneDocuments(type, scene)){
					if(!foundry.utils.getProperty(document, `flags.${moduleName}`)) continue;
					const update = TokenAttacher.markForDeletion({_id: document._id}, `flags.${moduleName}`);
					if(TokenAttacher.isV14() && TokenAttacher.normalizeDocumentType(type) === "Region"){
						const ownership = TokenAttacher.getRegionNativeOwnership(document, scene);
						if(ownership.nativeParentId){
							if(ownership.ownedByTokenAttacher) update["attachment.token"] = null;
							else preservedNativeRegions.push({
								regionId: document._id,
								flagParentId: ownership.flagParentId,
								nativeParentId: ownership.nativeParentId
							});
						}
					}
					pushUpdate(type, update, updates);
				}
			}
			let changed = Object.values(updates).reduce((count, values) => count + values.length, 0);
			const hasSceneData = Boolean(foundry.utils.getProperty(scene, `flags.${moduleName}`));
			if(changed === 0 && !hasSceneData) return TokenAttacher.noop(localizedStrings.error.NoTokenAttacherData);
			const attachmentUI = window.document.getElementById("tokenAttacher");
			if(attachmentUI?.dataset?.sceneId === scene.id){
				await TokenAttacher.closeTokenAttacherUI({saveOffsets: false});
			}
			//Fire updates
			for (const key in updates){
				if (updates.hasOwnProperty(key)) {
					await scene.updateEmbeddedDocuments(TokenAttacher.normalizeDocumentType(key), updates[key], {[moduleName]:{update:true}});
				}
			}
			if(hasSceneData){
				await scene.update(TokenAttacher.markForDeletion({}, `flags.${moduleName}`));
				changed += 1;
			}
			if(preservedNativeRegions.length){
				console.warn("Token Attacher | purge preserved native Region relationships without Token Attacher ownership proof", {
					sceneId: scene.id,
					regions: preservedNativeRegions
				});
				TokenAttacher.notify("warn", localizedStrings.error.ObjectsAttachedElsewhere, {
					count: preservedNativeRegions.length
				});
			}
			console.log("Token Attacher | scene data purged", {sceneId: scene.id, changed});
			TokenAttacher.notify("info", localizedStrings.info.PurgeComplete, {scene: scene.name, count: changed});
			return {status: "success", changed};
		}
		
		static async migrateAttachedOfBase(base, migrateFunc, elementTypes, topLevelOnly, return_data=false){
			return TokenAttacher.migrateAttached(base.layer.constructor.documentName, base, migrateFunc, elementTypes, topLevelOnly, return_data);
		}

		static async migrateAttached(type, baseElement, migrateFunc, elementTypes, topLevelOnly, return_data=false, migrationContext=null){
			if(!(migrateFunc instanceof Function)) throw new TypeError("Attachment migration requires a migration callback.");
			elementTypes = elementTypes.map(elementType => TokenAttacher.normalizeDocumentType(elementType));
			const baseDocument = baseElement.document ?? baseElement;
			const isRoot = !migrationContext;
			const scene = migrationContext?.scene ?? baseDocument.parent ?? canvas.scene;
			if(!(scene?.updateEmbeddedDocuments instanceof Function)) throw new Error("The attachment migration Scene is unavailable.");
			if(isRoot){
				migrationContext = {
					scene,
					canvasEpoch: TokenAttacher.ensureRuntimeState().canvasEpoch,
					visiting: new Set(),
					visited: new Set(),
					missing: []
				};
			}
			const assertSceneActive = () => {
				if(canvas.scene?.id !== scene.id || TokenAttacher.ensureRuntimeState().canvasEpoch !== migrationContext.canvasEpoch){
					throw new Error(`Attachment migration for Scene ${scene.id} was aborted because its canvas is no longer active.`);
				}
			};
			assertSceneActive();
			const normalizedType = TokenAttacher.normalizeDocumentType(type);
			const baseId = baseDocument._id ?? baseDocument.id;
			const visitKey = `${normalizedType}:${baseId}`;
			if(migrationContext.visiting.has(visitKey)) throw new Error(`Attachment migration detected a cycle at ${visitKey}.`);
			if(migrationContext.visited.has(visitKey)) return {};
			migrationContext.visiting.add(visitKey);

			const attached = foundry.utils.getProperty(baseDocument, `flags.${moduleName}.attached`) || {};
			const attachedEntities = {};
			for(const [rawType, ids] of Object.entries(attached)){
				if(!Array.isArray(ids)) continue;
				const documentType = TokenAttacher.normalizeDocumentType(rawType);
				attachedEntities[documentType] ??= [];
				for(const id of ids){
					const document = TokenAttacher.getSceneDocument(scene, documentType, id);
					if(document) attachedEntities[documentType].push(document);
					else migrationContext.missing.push({baseId, documentType, documentId: id});
				}
			}

			const updates = {};
			for(const [documentType, documents] of Object.entries(attachedEntities)){
				if(!elementTypes.includes(documentType)) continue;
				const migrated = await migrateFunc(documentType, documents.map(document => foundry.utils.duplicate(document)), baseDocument);
				assertSceneActive();
				if(migrated === undefined || migrated === null) continue;
				if(!Array.isArray(migrated)) throw new TypeError(`Attachment migration for ${documentType} must return an array of updates.`);
				if(migrated.length) updates[documentType] = migrated;
			}

			if(!topLevelOnly){
				for(const [documentType, documents] of Object.entries(attachedEntities)){
					for(const document of documents){
						const childAttached = foundry.utils.getProperty(document, `flags.${moduleName}.attached`) || {};
						if(!Object.keys(childAttached).length) continue;
						const documentUpdate = updates[documentType]?.find(update => update._id === document._id);
						const updatedDocument = foundry.utils.mergeObject(
							foundry.utils.duplicate(document),
							documentUpdate ?? {},
							{inplace: false}
						);
						const childUpdates = await TokenAttacher.migrateAttached(
							documentType,
							updatedDocument,
							migrateFunc,
							elementTypes,
							false,
							true,
							migrationContext
						);
						assertSceneActive();
						for(const [childType, typeUpdates] of Object.entries(childUpdates)){
							updates[childType] ??= [];
							updates[childType].push(...typeUpdates);
						}
					}
				}
			}

			migrationContext.visiting.delete(visitKey);
			migrationContext.visited.add(visitKey);
			if(return_data || !isRoot) return updates;
			if(migrationContext.missing.length){
				console.warn("Token Attacher | attachment migration skipped missing documents", {
					sceneId: scene.id,
					documents: migrationContext.missing
				});
				TokenAttacher.notify("warn", localizedStrings.error.ActionFailed, {
					action: "Migrate attached objects",
					message: `${migrationContext.missing.length} referenced attachment(s) no longer exist.`
				});
			}
			const batches = Object.entries(updates).filter(([, typeUpdates]) => typeUpdates.length);
			if(!batches.length){
				if(!migrationContext.missing.length) TokenAttacher.notify("warn", localizedStrings.error.NoAttachments);
				return {status: "noop", changed: 0, notified: true};
			}
			for(const [documentType, typeUpdates] of batches){
				assertSceneActive();
				await TokenAttacher.updateEmbeddedDocuments(documentType, typeUpdates, {[moduleName]:{update:true}}, scene);
			}
			return {
				status: "success",
				changed: batches.reduce((count, [, typeUpdates]) => count + typeUpdates.length, 0),
				notified: migrationContext.missing.length > 0
			};
		}

		static PreInstantAttach(type, document, data, options, userId){
			if(!TokenAttacher.isAttachmentUIOpen()) return true;
			const attachmentUI = window.document.getElementById("tokenAttacher");
			const {sceneId, baseType, baseId} = attachmentUI?.dataset ?? {};
			if(!sceneId || sceneId !== canvas.scene?.id || !baseType || !baseId) return true;

			foundry.utils.setProperty(options, `${moduleName}.InstantAttach`, {
				userId,
				sceneId,
				baseType,
				baseId
			});
		}

		static async InstantAttach(type, document, options, userId){
			const instantAttach = foundry.utils.getProperty(options, `${moduleName}.InstantAttach`);
			if(!instantAttach) return {status: "ignored"};
			if(game.userId !== userId || instantAttach.userId !== userId) return {status: "ignored"};
			if(foundry.utils.getProperty(document,`flags.${moduleName}.prototypeAttached`)) return {status: "ignored"};
			if(foundry.utils.getProperty(options,`${moduleName}.base`)) return {status: "ignored"};

			const scene = document.parent ?? game.scenes.get(instantAttach.sceneId);
			if(!scene || scene.id !== instantAttach.sceneId){
				return TokenAttacher.reportSceneActionFailure("Instantly attach created object", new Error("The attachment Scene changed before the object was created."), {
					documentId: document?._id,
					sceneId: instantAttach.sceneId
				});
			}
			const baseDocument = TokenAttacher.getSceneDocument(scene, instantAttach.baseType, instantAttach.baseId);
			if(!baseDocument) {
				await TokenAttacher.closeTokenAttacherUI({saveOffsets: false});
				TokenAttacher.notify("error", localizedStrings.error.BaseDoesntExist);
				return {status: "noop", notified: true};
			}
			const activeGM = game.users.find(user => user.isGM && user.active && user.viewedScene === scene.id);
			if(!activeGM){
				return TokenAttacher.reportSceneActionFailure("Instantly attach created object", new Error(TokenAttacher.format(localizedStrings.error.NoActiveGMFound)), {
					documentId: document?._id,
					sceneId: scene.id
				});
			}
			const elements = {type: TokenAttacher.normalizeDocumentType(type), ids: [document._id]};
			if(game.user === activeGM){
				return TokenAttacher._AttachToToken(baseDocument, elements, false, false, {scene, strictScene: true});
			}
			return TokenAttacher.emitSocketAction("AttachToToken", [baseDocument._id, elements, false], {
				action: "Instantly attach created object",
				successKey: localizedStrings.info.ObjectsAttached,
				noopKey: localizedStrings.error.NoEligibleAttachedSelection,
				sceneId: scene.id
			});
		}

		static getLayerByEmbeddedName(type){
			type = TokenAttacher.normalizeDocumentType(type);
			return canvas.layers.find(l => l.constructor.documentName === type);
		}

		static getCurrentGrid(){
			return {size: canvas.grid.size, sizeX: canvas.grid.sizeX, sizeY: canvas.grid.sizeY};
		}

		static getDefaultGridMultiplier(){
			return {size: 1, sizeX: 1, sizeY: 1};
		}
	}
	TokenAttacher.registerHooks();
})();
