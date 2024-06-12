//Util Imports
import { Util } from "../util/Util.js";

//Basic Object Imports
import { ShadedObject } from "./ShadedObject.js";

//Interactable Object Class
export class InteractableObject extends ShadedObject {
	//Static Variables

	static interactableObjects = [];

	static clear() {
		this.interactableObjects = [];
	}

	//*********************************************************************//
	//Public Static Methods


	//*********************************************************************//
	//Constructor

	constructor(image, orderNum, x, y, width, height) {
		super(image, orderNum, x, y, width, height);
		
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
		super.delete();
		Util.delValue(InteractableObject.interactableObjects, this);
	}
}