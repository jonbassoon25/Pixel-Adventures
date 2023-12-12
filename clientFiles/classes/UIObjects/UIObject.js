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
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}