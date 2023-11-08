//Util Imports
import { Keyboard } from "../util/Keyboard.js";
import { Mouse } from "../util/Mouse.js";

//UI Object Imports
import { Button } from "./Button.js";
import { UI } from "./UI.js";
import { UIObject } from "./UIObject.js";


export class Textbox extends UIObject{
	constructor(x, y, width, height) {
		super(x, y, width, height);
		//Textbox Data
		this.text = "";
		this.isSelected = false;
		this.charLimit = Math.floor((2 * this.absWidth) / this.absHeight);
	}

	#logInput() {
		if (Keyboard.backspacePressed) {
			this.text = this.text.slice(0, -1);
		}
		if (this.text.length >= this.charLimit) {
			return;
		}
		for (let i = 0; i < Keyboard.keysPressed.length; i++) {
			this.text += Keyboard.keysPressed[i];
		}
	}

	//Draws the textBox
	#draw() {
		UI.draw("placeholder", this.x, this.y, this.width, this.height, false);
		UI.drawText(this.text, this.absX - this.absWidth / 2 + 2.5, this.absY + this.absHeight / 2 + 10, this.absHeight - 5, true);
	}

	#checkIsSelected() {
		if (Button.simpleButton(this.x, this.y, this.width, this.height, false)) {
			this.isSelected = true;
		} else if (Mouse.button1Down) {
			this.isSelected = false;
		}
	}

	//Updates the object with new values, should be called every frame
	update() {
		super.updatePosition();
		this.#checkIsSelected();
		if (this.isSelected) {
			this.#logInput();
		}
		this.#draw();
	}
}