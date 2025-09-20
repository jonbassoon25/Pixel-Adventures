//Util Imports
import { Util } from "../util/Util.js";

//Basic Object Imports
import { DynamicObject } from "./DynamicObject.js";

//Interactable Object Class
export class InteractableObject extends DynamicObject {
	//Static Variables

	static interactableObjects = [];

	static clear() {
		this.interactableObjects = [];
	}

	//*********************************************************************//
	//Public Static Methods


	//*********************************************************************//
	//Constructor
	//type, orderNum, x, y, width, height
	constructor(type, orderNum, x, y, width, height) {
		super(type, orderNum, x, y, width, height);
		
		InteractableObject.interactableObjects.push(this);
	}

	//*********************************************************************//
	//Public Methods

	/**
	 * @param {Player} - The player that is interacting with this InteractableObject
	 */
	interactWith(player) {
		console.log(player.color + " Player interacted with an InteractableObject");
	}

	delete() {
		Util.delValue(InteractableObject.interactableObjects, this);
		super.delete();
	}
}