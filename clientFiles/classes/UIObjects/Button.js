//Util Imports
import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";
import { VisualObject } from "../util/VisualObject.js";
import { PauseMenu } from "./PauseMenu.js";


//Button Class
export class Button extends VisualObject {
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
	static simpleButton(x, y, width, height, resize = true) {
		//If the passed in values are absolute (need to be resized)
		if (resize) {
			[x, y, width, height] = Display.calcElementDimensions(x, y, width, height);
		}
		//Return if the mouse is over the simpleButton area and the mouse is released
		return Mouse.x > x && Mouse.x < x + width && Mouse.y > y && Mouse.y < y + height && Mouse.button1Released && !PauseMenu.paused;
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
	constructor(image, x, y, width, height, ignorePaused = false) {
		//Call super constructor to assign absolute and relative values of: x, y, width, height
		super(image, x, y, width, height);
		this.ignorePaused = ignorePaused;
	}

	//*********************************************************************//
	//Private Methods

	/** 
  	@returns {boolean} Is the mouse over the button
 	*/
	#isHovered() {
		let relX;
		let relY;
		let relWidth;
		let relHeight;
		[relX, relY, relWidth, relHeight] = Display.calcElementDimensions(this.x, this.y, this.width, this.height);
		return Mouse.x > relX && Mouse.x < relX + relWidth && Mouse.y > relY && Mouse.y < relY + relHeight && (!PauseMenu.paused || this.ignorePaused);
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
		//Draw the base button image
		if (this.image == "redPlayer" || this.image == "redPlayerJump") {
			if (this.#isHovered()) this.image = "redPlayerJump"; else this.image = "redPlayer";
		}
		if (this.image == "bluePlayerFlipped" || this.image == "bluePlayerJumpFlipped") {
			if (this.#isHovered()) this.image = "bluePlayerJumpFlipped"; else this.image = "bluePlayerFlipped";
		}
		Display.draw(this.image, this.x, this.y, this.width, this.height);
		if (this.image == "redPlayerJump" || this.image == "bluePlayerJumpFlipped") return;
		//If the button is pressed
		if (this.isPressed()) {
			//Draw the partially transparent "buttonPressed" image over the button
			Display.draw("buttonPressed", this.x, this.y, this.width, this.height);
		//Else if the button is hovered
		} else if (this.#isHovered()) {
			//Draw the partially transparent "buttonHovered" image over the button
			Display.draw("buttonHovered", this.x, this.y, this.width, this.height);
		}
		//Else do nothing
	}
}