//Util Imports
import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";

//UI Object Imports
import { UI } from "./UI.js"
import { UIObject } from "./UIObject.js";



//Button Class
export class Button extends UIObject {
	constructor(image, x, y, width, height) {
		//Call super constructor to assign absolute and relative values of: x, y, width, height
		super(x, y, width, height);
		//Assign image
		this.image = image;
	}

	//Single frame call of the isReleased() method, for, exclusively, programatic buttons (no image or highlight)
	static simpleButton(x, y, width, height, resize = false) {
		//If the passed in values are absolute (need to be resized)
		if (resize) {
			//Convert the absolute values to be relative (to current screen size)
			[x, y, width, height] = [...Display.calcElementDimenstions(x, y, width, height)];
		}
		//Return a boolean of if the mouse is over the simpleButton area and the mouse is released (button pressed)
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
		//Update relative position values with respect to current screen size
		super.updatePosition();
		//Draw the base button image
		UI.draw(this.image, this.x, this.y, this.width, this.height);
		//If the button is pressed
		if (this.#isPressed()) {
			//Draw the partially transparent "buttonPressed" image over the button
			UI.draw("buttonPressed", this.x, this.y, this.width, this.height);
		//Else if the button is hovered
		} else if (this.#isHovered()) {
			//Draw the partially transparent "buttonHovered" image over the button
			UI.draw("buttonHovered", this.x, this.y, this.width, this.height);
		}
		//Else do nothing
	}

	//For use in an if statement, updates the button and returns the output of the isReleased() method
	subsistAsButton() {
		this.update();
		return this.isReleased();
	}
}