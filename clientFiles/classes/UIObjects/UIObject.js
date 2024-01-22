//Util Imports
import { Display } from "../util/Display.js";

//UIObject Class
export class UIObject {
	//Constructor

	/** 
	@param {string} image
	@param {number} x - Absolue x position of the button
	@param {number} y - Absolue y position of the button
	@param {number} width - Absolute width of the button
	@param {number} height - Absolute height of the button
	*/
	constructor(image, x, y, width, height) {
		//Set name
		this.name = "UIObject";
		//Set image
		this.image = image;
		//Set absolute position values
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	//*********************************************************************//
	//Public Methods
	
	/** Updates and draws this UI object */
	update() {
		Display.draw(this.image, this.x, this.y, this.width, this.height);
	}
}