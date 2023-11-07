//Util Imports
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";
import { Mouse } from "../util/Mouse.js";

//UI Object Imports
import { Button } from "./Button.js";
import { UI } from "./UI.js";


export class Textbox {
	constructor(x, y, width, height) {
		//Absolute position (on 1920 by 1080 screen)
		this.absX = x;
		this.absY = y;
		this.absWidth = width;
		this.absHeight = height;
		//Relative position (to screen size);
		let packet = [...Display.calcElementDimenstions(x, y, width, height)];
		this.x = packet[0];
		this.y = packet[1];
		this.width = packet[2];
		this.height = packet[3];
		//Textbox Data
		this.text = "";
		this.isSelected = false;
		this.charLimit = Math.floor((2 * this.absWidth) / (this.absHeight + 5));
	}

	#updateRelativePosition() {
		let packet = [...Display.calcElementDimenstions(this.absX, this.absY, this.absWidth, this.absHeight)];
		this.x = packet[0];
		this.y = packet[1];
		this.width = packet[2];
		this.height = packet[3];
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
		UI.drawText(this.text, this.absX - this.absWidth / 2 + 5, this.absY + this.absHeight / 2 + 10, this.absHeight - 5);
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
		this.#updateRelativePosition();
		this.#checkIsSelected();
		if (this.isSelected) {
			this.#logInput();
		}
		this.#draw();
	}
}