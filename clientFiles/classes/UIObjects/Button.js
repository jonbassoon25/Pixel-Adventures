import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";
import { UI } from "./UI.js"

export class Button {
	constructor(image, x, y, width, height) {
		//Absolute position (on 1920 by 1080 screen)
		this.absX = x;
		this.absY = y;
		this.absWidth = width;
		this.absHeight = height;
		//Relative position (to screen size);
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimenstions(x, y, width, height)];
		//Assign image
		this.image = image;
	}

	//Single frame call of the isReleased() method, for, exclusively, programatic buttons (no image or highlight)
	static simpleButton(x, y, width, height, resize = true) {
		if (resize) {
			[x, y, width, height] = [...Display.calcElementDimenstions(x, y, width, height)];
		}
		return Mouse.x > x && Mouse.x < x + width && Mouse.y > y && Mouse.y < y + height && Mouse.button1Released;
	}

	//Returns a boolean of if the mouse is over the button
	#isHovered() {
		return Mouse.x > this.x && Mouse.x < this.x + this.width && Mouse.y > this.y && Mouse.y < this.y + this.height;
	}

	//Returns a boolean of if the button has been released (mouse up over button)
	isReleased() {
		return this.#isHovered() && Mouse.button1Released;
	}

	//Returns a boolean of if the button has been pressed (mouse down over button)
	#isPressed() {
		return this.#isHovered() && Mouse.button1Down;
	}

	//Updates the button's position relative to screen size
	#updateRelativePosition() {
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimenstions(this.absX, this.absY, this.absWidth, this.absHeight)];
	}

	//Draws the button and updates with new values
	update() {
		this.#updateRelativePosition();
		UI.draw(this.image, this.x, this.y, this.width, this.height, false);
		if (this.#isPressed()) {
			UI.draw("buttonPressed", this.x, this.y, this.width, this.height, false);
		} else if (this.#isHovered()) {
			UI.draw("buttonHovered", this.x, this.y, this.width, this.height, false);
		}
	}

	//For use in an if statement, updates the button and returns the output of the isReleased() method
	subsistAsButton() {
		this.update();
		return this.isReleased();
	}
}