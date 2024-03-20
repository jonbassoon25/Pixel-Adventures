//Util Imports
import { VisualObject } from "../util/VisualObject.js";
import { Util } from "../util/Util.js";

//Class Item
export class Item extends VisualObject {
	//Static Variables

	static items = [];
	
	//*********************************************************************//
	//Static Methods

	static updateItems() {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].update();
		}
	}

	static drawItems() {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].draw();
		}
	}

	static clear() {
		this.items = [];
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