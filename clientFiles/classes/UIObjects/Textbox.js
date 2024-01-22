//Util Imports
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";
import { Mouse } from "../util/Mouse.js";

//UI Object Imports
import { Button } from "./Button.js";

import { UIObject } from "./UIObject.js";

//Textbox Class
export class Textbox extends UIObject {
	//Constructor

	/** 
	@param {number} x - The x position of the textbox
	@param {number} y - The y position of the textbox
	@param {number} width - The width of the textbox
	@param {number} height - The height of the textbox
	*/
	constructor(x, y, width, height) {
		//Call super constructor to assign absolute and relative values of: x, y, width, height
		super(x, y, width, height);
		//Set inital textbox text to an empty string
		this.text = "";
		//The textbox is not selected by the user
		this.isSelected = false;
		//Calculate and set the character limit of the textbox
		this.charLimit = Math.floor((2 * this.width) / (this.height + 5));
	}

	//*********************************************************************//
	//Private Methods

	//Logs text input from the Keyboard object in this.text
	#logInput() {
		//If backspace is pressed
		if (Keyboard.backspacePressed) {
			//Remove the last character of the textbox text
			this.text = this.text.slice(0, -1);
		}
		//If the character limit is reached or exceeded, don't allow more characters to be entered
		if (this.text.length >= this.charLimit) {
			return;
		}
		//For every key pressed this frame, add it to the textbox text
		for (let i = 0; i < Keyboard.keysPressed.length; i++) {
			this.text += Keyboard.keysPressed[i];
		}
	}

	//Checks to see if the textbox has been selected or deselected and updates the isSelected variable
	#checkIsSelected() {
		//If the textbox is clicked
		if (Button.simpleButton(this.x, this.y, this.width, this.height)) {
			//It has been selected
			this.isSelected = true;
		//Else if the mouse has been pressed outside of the textbox
		} else if (Mouse.button1Down) {
			//It has been deselected
			this.isSelected = false;
		}
	}

	//*********************************************************************//
	//Public Methods

	/** 
  	Draws the Textbox and updates it with new values
 	*/
	update() {
		//Check to see if the textbox has been selected or deselected this frame
		this.#checkIsSelected();
		//If the textbox is selected
		if (this.isSelected) {
			//Log keyboard text input in the textbox
			this.#logInput();
		}
		//Draw the textbox
		Display.draw("placeholder", this.x, this.y, this.width, this.height);
		//Draw the textbox text
		Display.drawText(this.text, this.x - this.width / 2 + 2.5, this.y + this.height / 2 + 10, this.height - 5);
	}
}