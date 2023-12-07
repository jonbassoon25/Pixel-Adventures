//Util Imports
import { Display } from "../util/Display.js";

//UIObject Class
export class UIObject {
	//Constructor

	/** 
  	@param {number} x - The absolute x position of the UIObject
	@param {number} y - The absolute y position of the UIObject
  	@param {number} width - The absolute width of the UIObject
	@param {number} height - The absolute height of the UIObject
 	*/
	constructor(x, y, width, height) {
		//Set absolute position values
		this.absX = x;
		this.absY = y;
		this.absWidth = width;
		this.absHeight = height;
		//Set relative position values
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimensions(x, y, width, height)];
	}
	
	//*********************************************************************//
	//Public Methods

	/** 
  	Updates the relative position values of the UIObject through calculations of the absolute ones
 	*/
	updatePosition() {
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimensions(this.absX, this.absY, this.absWidth, this.absHeight)];
	}
}