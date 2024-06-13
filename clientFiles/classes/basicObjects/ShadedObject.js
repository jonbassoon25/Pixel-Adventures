//Util Imports
import { Util } from "../util/Util.js";

//Basic Object Imports
import { VisualObject } from "../basicObjects/VisualObject.js";

//Shaded Object Class
export class ShadedObject extends VisualObject {
	//Static Variables

	static shadedObjects = {};
	
	//*********************************************************************//
	//Public Static Methods

	static clear() {
		this.shadedObjects = {};
	}

	//*********************************************************************//
	//Constructor

	constructor(image, orderNum, x, y, width, height, shade = true) {
		super(image, x, y, width, height);
		//Current order: 0: UI and debug info, 1: players, 2: NPCs, 3: Weapons, 4: Particles, 5: Background elements
		orderNum *= 2;
		if (orderNum < 0) {
			console.warn("Order num < 0. Setting to 0");
			orderNum = 0;
		}

		let length = Object.keys(ShadedObject.shadedObjects).length;
		//If there is a gap between orderNum and the last element of ShadedObject
		this.shaded = shade;
		if (orderNum > length) {
			//Populate the places with gaps
			for (let i = length; i < orderNum; i++) {
				ShadedObject.shadedObjects[i] = [];
			}
			ShadedObject.shadedObjects[orderNum] = [this];
		} else if (orderNum == length) {
			ShadedObject.shadedObjects[orderNum] = [this];
		} else {
			ShadedObject.shadedObjects[orderNum].push(this);
		}
	}

	delete() {
		for (let i = 0; i < Object.keys(ShadedObject.shadedObjects).length; i++) {
			let key = Object.keys(ShadedObject.shadedObjects)[i];
			if (ShadedObject.shadedObjects[key].indexOf(this) > -1) {
				ShadedObject.shadedObjects[key] = Util.delValue(ShadedObject.shadedObjects[key], this);
				return;
			}
		}
	}
}