//Util Imports
import { Display } from "../util/Display.js";

export class UIObject {
	//Super constructor for all children of UIObject
	constructor(x, y, width, height) {
		//Set absolute position values
		this.absX = x;
		this.absY = y;
		this.absWidth = width;
		this.absHeight = height;
		//Set relative position values
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimensions(x, y, width, height)];
	}

	//Returns the relative position values of the given absolute position values
	updatePosition() {
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimensions(this.absX, this.absY, this.absWidth, this.absHeight)];
	}
}