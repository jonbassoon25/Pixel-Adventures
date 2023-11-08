import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";
import { UI } from "./UI.js"
import { UIObject } from "./UIObject.js";

export class Button extends UIObject {
	constructor(image, x, y, width, height) {
		super(x, y, width, height);
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

	//Draws the button and updates with new values
	update() {
		super.updatePosition();
		UI.draw(this.image, this.x, this.y, this.width, this.height);
		if (this.#isPressed()) {
			UI.draw("buttonPressed", this.x, this.y, this.width, this.height);
		} else if (this.#isHovered()) {
			UI.draw("buttonHovered", this.x, this.y, this.width, this.height);
		}
	}

	//For use in an if statement, updates the button and returns the output of the isReleased() method
	subsistAsButton() {
		this.update();
		return this.isReleased();
	}
}