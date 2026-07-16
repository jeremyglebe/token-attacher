'use strict';
//This is named core, but for now this will only contain logic for Regions.
//TODO: Refactor out the rest of the core PlacableObjects logic into this file
(async () => {
	const moduleNameTA = "token-attacher";
	const isV14 = () => (game.release?.generation ?? 0) >= 14;

	function createV14Shape(shapeData){
		const ShapeData = foundry.data.BaseShapeData.TYPES[shapeData.type];
		return ShapeData ? new ShapeData(shapeData, {parent: canvas.scene}) : null;
	}

	function scaleV14Shape(shape, scaleX, scaleY, origin, scaleToken=true){
		scaleX = Number.isFinite(scaleX) ? scaleX : 1;
		scaleY = Number.isFinite(scaleY) ? scaleY : 1;
		const scaleRadius = (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
		switch(shape.type){
			case "rectangle":
				shape.width *= scaleX;
				shape.height *= scaleY;
				break;
			case "circle":
			case "cone":
				shape.radius *= scaleRadius;
				break;
			case "ellipse":
				shape.radiusX *= scaleX;
				shape.radiusY *= scaleY;
				break;
			case "ring":
				shape.radius *= scaleRadius;
				shape.innerWidth *= scaleRadius;
				shape.outerWidth *= scaleRadius;
				break;
			case "line":
				shape.length *= scaleX;
				shape.width *= scaleY;
				break;
			case "polygon":
				if(origin && Array.isArray(shape.points)){
					for(let i = 0; i < shape.points.length; i += 2){
						shape.points[i] = origin.x + ((shape.points[i] - origin.x) * scaleX);
						shape.points[i + 1] = origin.y + ((shape.points[i + 1] - origin.y) * scaleY);
					}
				}
				break;
			case "token":
				if(scaleToken){
					shape.width *= scaleX;
					shape.height *= scaleY;
				}
				break;
			case "emanation":
				shape.radius *= scaleRadius;
				if(shape.base) scaleV14Shape(shape.base, scaleX, scaleY, origin, scaleToken);
				break;
		}
		return shape;
	}

	function doAttachmentsNeedUpdate(document, change, options, userId){
		if(foundry.utils.getProperty(options, `${moduleNameTA}.attachmentsNeedUpdate`)) return;

		if(!change.elevation || !(Object.hasOwn(change.elevation, "bottom") || Object.hasOwn(change.elevation, "top"))) return;

		foundry.utils.setProperty(options, `${moduleNameTA}.attachmentsNeedUpdate`, true);
	}

	// const myLayer = "SomeLayerName";
	// function layerGetElement(layer, id, result){
	// 	if(layer != myLayer) return;

	// 	//Implement your get method here if your elements live in a non standard layer
	// 	//result.element = someobject.get(id);
	// }

	function getElementOffset(type, objData, base_type, baseDoc, grid, offset){
		const baseCenter = tokenAttacher._compatiblity.getCenter(base_type, baseDoc, grid);
		const baseRotation =  baseDoc.rotation ?? baseDoc.direction;
		//As this is core functionality, allow all PlacableObjects to be checked
		
		//Regions consist of multiple shapes
		if(objData.shapes){
			offset.shapes = [];
			for (let i = 0; i < objData.shapes.length; i++) {
				const shape = objData.shapes[i];
				offset.shapes[i] = foundry.utils.duplicate(shape);
				if(isV14()){
					try {
						const shapeModel = createV14Shape(shape);
						if(shapeModel){
							offset.shapes[i]._taOrigin = {
								x: shapeModel.origin.x - baseCenter.x,
								y: shapeModel.origin.y - baseCenter.y
							};
							offset.shapes[i]._taShapeOrigin = {x: shapeModel.origin.x, y: shapeModel.origin.y};
							offset.shapes[i]._taBaseRotation = baseRotation ?? 0;
							continue;
						}
					}
					catch(error){
						console.warn("Token Attacher | Could not store a V14 Region shape offset.", error);
					}
				}
				switch (shape.type) {
					case 'rectangle':
						offset.shapes[i].width = shape.width;
						offset.shapes[i].height = shape.height;	
						offset.shapes[i].center = {};
						offset.shapes[i].center.x = shape.x + shape.width/2  - baseCenter.x;
						offset.shapes[i].center.y = shape.y + shape.height/2 - baseCenter.y;
						offset.shapes[i].x = offset.shapes[i].center.x;
						offset.shapes[i].y = offset.shapes[i].center.y;
						offset.shapes[i].rotation = shape.rotation % 360;
						offset.shapes[i].offsetRotation = (shape.rotation - baseRotation) % 360;
						break;
					case 'ellipse':
						offset.shapes[i].radiusX = shape.radiusX;
						offset.shapes[i].radiusY = shape.radiusY;	
						offset.shapes[i].x = shape.x - baseCenter.x;
						offset.shapes[i].y = shape.y - baseCenter.y;
						offset.shapes[i].rotation = shape.rotation % 360;	
						offset.shapes[i].offsetRotation = (shape.rotation - baseRotation) % 360;		
						break;	
					case 'polygon':
						offset.shapes[i].points = [];
						for (let j = 0; j < shape.points.length; j+=2) {
							offset.shapes[i].points[j/2] = [];
							offset.shapes[i].points[j/2][0] = shape.points[j] 	- baseCenter.x;
							offset.shapes[i].points[j/2][1] = shape.points[j+1] - baseCenter.y;			
						}	
						offset.shapes[i].rotation = 0;	
						offset.shapes[i].offsetRotation = (-baseRotation) % 360;		
						break;				
					default:
						break;
				}
			}
		}

		let  baseElevation = baseDoc.elevation?.bottom ?? baseDoc.elevation ?? baseDoc.flags['levels']?.elevation ?? baseDoc.flags['levels']?.rangeBottom ?? baseDoc.flags['wallHeight']?.wallHeightBottom ?? baseDoc.flags['wall-height']?.bottom ?? 0;

		if(objData.elevation && (Object.hasOwn(objData.elevation, "top") || Object.hasOwn(objData.elevation, "bottom"))){
			offset.elevation = offset.elevation ?? {};
			offset.elevation.top = objData.elevation.top ?? null;
			offset.elevation.bottom = objData.elevation.bottom ?? null;
			
			if([null, Infinity, -Infinity].includes(offset.elevation.top) === false) offset.elevation.top -= baseElevation;
			if([null, Infinity, -Infinity].includes(offset.elevation.bottom) === false) offset.elevation.bottom -= baseElevation;
		}
	}
	
	function offsetPositionOfElement(type, objData, baseType, baseData, baseOffset, grid_multi, update){
		//As this is core functionality, allow all PlacableObjects to be checked
		
		const offset = foundry.utils.getProperty(objData, `flags.${moduleNameTA}.offset`);
		const size_multi = {w: baseOffset.size[0] / offset.size.widthBase, h: baseOffset.size[1] / offset.size.heightBase};
		const baseRotation =  baseData.rotation ?? baseData.direction;

		//Regions consist of multiple shapes
		if(offset.shapes){
			const shapes = foundry.utils.duplicate(objData.shapes);	
			for (let i = 0; i < offset.shapes.length; i++) {
				const shapeOffset = offset.shapes[i];	
				let x,y;	
				if(isV14() && shapeOffset._taOrigin){
					try {
						const {
							_taOrigin,
							_taShapeOrigin,
							_taBaseRotation,
							_taSkipGridScale,
							...shapeData
						} = foundry.utils.duplicate(shapeOffset);
						scaleV14Shape(shapeData, size_multi.w, size_multi.h, _taShapeOrigin);
						const shapeModel = createV14Shape(shapeData);
						if(shapeModel){
							const deltaRotation = (baseRotation ?? 0) - (_taBaseRotation ?? 0);
							const a = Math.toRadians(deltaRotation);
							const dx = _taOrigin.x * size_multi.w;
							const dy = _taOrigin.y * size_multi.h;
							shapeModel.move({
								x: baseOffset.center.x + ((Math.cos(a) * dx) - (Math.sin(a) * dy)),
								y: baseOffset.center.y + ((Math.sin(a) * dx) + (Math.cos(a) * dy))
							});
							if(deltaRotation) shapeModel.rotate(deltaRotation);
							shapes[i] = shapeModel.toObject();
							continue;
						}
					}
					catch(error){
						console.warn("Token Attacher | Could not position a V14 Region shape.", error);
					}
				}
				switch (shapeOffset.type) {
					case 'rectangle':
						shapes[i].width = shapeOffset.width * size_multi.w;
						shapes[i].height = shapeOffset.height * size_multi.h;	
						[x,y] = tokenAttacher._compatiblity.moveRotatePoint(
							{
								...shapeOffset, 
								rot: shapeOffset.rotation, 
								offRot:  shapeOffset.offsetRotation
							}, 
							baseOffset.center, baseOffset.rotation, size_multi);
						shapes[i].x = x - shapes[i].width  / 2;
						shapes[i].y = y - shapes[i].height / 2;
						shapes[i].rotation = (shapeOffset.offsetRotation + baseRotation) % 360;
						break;
					case 'ellipse':
						shapes[i].radiusX = shapeOffset.radiusX * size_multi.w;
						shapes[i].radiusY = shapeOffset.radiusY * size_multi.h;	
						[x,y] = tokenAttacher._compatiblity.moveRotatePoint(
							{
								...shapeOffset, 
								rot: shapeOffset.rotation,
								 offRot:  shapeOffset.offsetRotation
							}, 
							baseOffset.center, baseOffset.rotation, size_multi);
						shapes[i].x = x;
						shapes[i].y = y;		
						shapes[i].rotation = (shapeOffset.offsetRotation + baseRotation) % 360;		
						break;	
					case 'polygon':								
						const points = shapes[i].points;
						for (let j = 0; j < points.length; j+=2) {
							[x,y] = tokenAttacher._compatiblity.moveRotatePoint(
								{
									x: shapeOffset.points[j/2][0], 
									y: shapeOffset.points[j/2][1], 
									...shapeOffset, 
									rot: shapeOffset.rotation,
									 offRot:  shapeOffset.offsetRotation
								}, 
								baseOffset.center, baseOffset.rotation, size_multi);
							points[j] 	= x;
							points[j+1] = y;					
						}
					break;
					default:
						break;
				}
			}
			update[`shapes`] = shapes;
		}

		if(offset.elevation && (Object.hasOwn(offset.elevation, "top") || Object.hasOwn(offset.elevation, "bottom"))){
			update.elevation = foundry.utils.duplicate(objData.elevation || {});
			for(const key of ["bottom", "top"]){
				if(!Object.hasOwn(offset.elevation, key)) continue;
				const value = offset.elevation[key];
				update.elevation[key] = [null, Infinity, -Infinity].includes(value) ? value : baseOffset.elevation + value;
			}
		}
	}

	//Modify offset based on grid_multi
	function updateOffsetWithGridMultiplicator(type, offset, grid_multi){	
		//As this is core functionality, allow all PlacableObjects to be checked	

		//Regions consist of multiple shapes
		if(offset.shapes){
			const shapes = offset.shapes;	
			for (let i = 0; i < shapes.length; i++) {
				const shapeOffset = shapes[i];	
				if(isV14() && shapeOffset._taOrigin){
					shapeOffset._taOrigin.x *= grid_multi.sizeX;
					shapeOffset._taOrigin.y *= grid_multi.sizeY;
					if(!shapeOffset._taSkipGridScale){
						scaleV14Shape(shapeOffset, grid_multi.sizeX, grid_multi.sizeY, shapeOffset._taShapeOrigin, false);
					}
					continue;
				}
				switch (shapeOffset.type) {
					case 'rectangle':
						shapes[i].width  *= grid_multi.sizeX;
						shapes[i].height *= grid_multi.sizeY;	
						shapes[i].x *= grid_multi.sizeX;
						shapes[i].y *= grid_multi.sizeY;
						break;
					case 'ellipse':
						shapes[i].radiusX *= grid_multi.sizeX;
						shapes[i].radiusY *= grid_multi.sizeY;	
						shapes[i].x *= grid_multi.sizeX;
						shapes[i].y *= grid_multi.sizeY;	
						break;	
					case 'polygon':								
						const points = shapes[i].points;
						for (let j = 0; j < points.length; j++) {
							points[j][0] *= grid_multi.sizeX;
							points[j][1] *= grid_multi.sizeY;
						}
						break;
					default:
						break;
				}
			}
		}
		return offset;
	}

	function initCompatibility(){
		window.tokenAttacher._compatiblity.registerLayerByDocumentName("Region");
	}

	Hooks.on(`${moduleNameTA}.doAttachmentsNeedUpdate`, doAttachmentsNeedUpdate);
	//Hooks.on(`${moduleNameTA}.layerGetElement`, layerGetElement);
	Hooks.on(`${moduleNameTA}.getElementOffset`, getElementOffset);
	Hooks.on(`${moduleNameTA}.offsetPositionOfElement`, offsetPositionOfElement);
	Hooks.on(`${moduleNameTA}.updateOffsetWithGridMultiplicator`, updateOffsetWithGridMultiplicator);
	Hooks.once(`${moduleNameTA}.macroAPILoaded`, initCompatibility);

})();
