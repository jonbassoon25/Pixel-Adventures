//Util Imports
import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";

//UI Object Imports
import { UI } from "./UI.js"
import { UIObject } from "./UIObject.js";

//Button Class
export class Button extends UIObject {
	//Public Static Methods
	
	/** 
  	Simple button, used exclusively for programatic buttons (no image or highlight)
  	@param {number} x - Absolue x position of the button
	@param {number} y - Absolue y position of the button
  	@param {number} width - Absolute width of the button
	@param {number} height - Absolute height of the button
  	@param {boolean} resize - If the button should be resized to fit the text (optional)
 	@returns {boolean} Is the button clicked
  	*/
	static simpleButton(x, y, width, height, resize = false) {
		//If the passed in values are absolute (need to be resized)
		if (resize) {
			//Convert the absolute values to be relative (to current screen size)
			[x, y, width, height] = [...Display.calcElementDimenstions(x, y, width, height)];
		}
		//Return if the mouse is over the simpleButton area and the mouse is released
		return Mouse.x > x && Mouse.x < x + width && Mouse.y > y && Mouse.y < y + height && Mouse.button1Released;
	}

	//*********************************************************************//
	//Constructor

	/** 
  	@param {string} image
	@param {number} x - Absolue x position of the button
  	@param {number} y - Absolue y position of the button
	@param {number} width - Absolute width of the button
  	@param {number} height - Absolute height of the button
  	*/
	constructor(image, x, y, width, height) {
		//Call super constructor to assign absolute and relative values of: x, y, width, height
		super(x, y, width, height);
		//Assign image
		this.image = image;
	}

	//*********************************************************************//
	//Private Methods

	/** 
  	@returns {boolean} Is the mouse over the button
 	*/
	#isHovered() {
		return Mouse.x > this.x && Mouse.x < this.x + this.width && Mouse.y > this.y && Mouse.y < this.y + this.height;
	}


	//*********************************************************************//
	//Public Methods

	/** 
	@returns {boolean} If the button is pressed (mouse down over button)
	*/
	isPressed() {
		return this.#isHovered() && Mouse.button1Down;
	}
	
	/**  
 	@returns {boolean} If the button is released (mouse up over button)
 	*/
	isReleased() {
		return this.#isHovered() && Mouse.button1Released;
	}

	/** 
	Updates the button and calls the isReleased() method
	@returns {boolean} If the button is released (mouse up over button)
	*/
	subsistAsButton() {
		this.update();
		return this.isReleased();
	}

	/** 
  	Draws the button and updates button values
 	*/
	update() {
		//Update relative position values with respect to current screen size
		super.updatePosition();
		//Draw the base button image
		UI.draw(this.image, this.x, this.y, this.width, this.height);
		//If the button is pressed
		if (this.isPressed()) {
			//Draw the partially transparent "buttonPressed" image over the button
			UI.draw("buttonPressed", this.x, this.y, this.width, this.height);
		//Else if the button is hovered
		} else if (this.#isHovered()) {
			//Draw the partially transparent "buttonHovered" image over the button
			UI.draw("buttonHovered", this.x, this.y, this.width, this.height);
		}
		//Else do nothing
	}
}