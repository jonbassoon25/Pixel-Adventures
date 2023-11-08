//Util Imports
import { Keyboard } from "../util/Keyboard.js";
import { Mouse } from "../util/Mouse.js";

//UI Object Imports
import { Button } from "./Button.js";
import { UI } from "./UI.js";
import { UIObject } from "./UIObject.js";



//Textbox Class
export class Textbox extends UIObject {
	constructor(x, y, width, height) {
		//Call super constructor to assign absolute and relative values of: x, y, width, height
		super(x, y, width, height);
		//Set inital textbox text to an empty string
		this.text = "";
		//The textbox is not selected by the user
		this.isSelected = false;
		//Calculate and set the character limit of the textbox
		this.charLimit = Math.floor((2 * this.absWidth) / this.absHeight);
	}

	//Logs text input from the Keyboard object
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

	//Checks to see if the textbox has been selected or deselected
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

	//Draws the object and updates it with new values
	update() {
		//Update relative position values with respect to current screen size
		super.updatePosition();
		//Check to see if the textbox has been selected or deselected this frame
		this.#checkIsSelected();
		//If the textbox is selected
		if (this.isSelected) {
			//Log keyboard text input in the textbox
			this.#logInput();
		}
		//Draw the textbox
		UI.draw("placeholder", this.x, this.y, this.width, this.height, false);
		//Draw the textbox text
		UI.drawText(this.text, this.absX - this.absWidth / 2 + 2.5, this.absY + this.absHeight / 2 + 10, this.absHeight - 5, true);
	}
}