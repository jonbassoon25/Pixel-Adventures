//Util Imports
import { Util } from "../util/Util.js";

//Basic Object Imports
import { VisualObject } from "../basicObjects/VisualObject.js";

//Class Item
export class Item extends VisualObject {
	//Static Variables

	static items = [];

	static clear() {
		this.items = [];
	}
	
	//*********************************************************************//
	//Static Methods

	static clear() {
		this.items = [];
	}

	static drawItems() {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].draw();
		}
	}

	static updateItems() {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].update();
		}
	}
	
	//*********************************************************************//
	//Constructor

	constructor(image, x, y, width, height) {
		super(image, x, y, width, height);
		this.type = "item";
		Item.items.push(this);
	}

	//*********************************************************************//
	//Public Method

	delete() {
		Item.items = Util.delValue(Item.items, this);
	}
}