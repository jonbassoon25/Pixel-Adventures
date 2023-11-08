import { Display } from "../util/Display.js";

export class UIObject {
	constructor(x, y, width, height) {
		//Set absolute position values
		this.absX = x;
		this.absY = y;
		this.absWidth = width;
		this.absHeight = height;
		//Set relative position values
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimenstions(x, y, width, height)];
	}
	
	updatePosition() {
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimenstions(this.absX, this.absY, this.absWidth, this.absHeight)];
	}
}