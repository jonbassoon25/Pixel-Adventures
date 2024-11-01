//Util Imports
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";

//Basic Object Imports
import { VisualObject } from "../basicObjects/VisualObject.js";

//DialogueBox Class
export class DialogueBox extends VisualObject {
	//Constructor

	constructor(x, y, width, height) {
		super("shader_15", x, y, width, height);
		this.writingText = false;
		this.text = [""];
		this.textLength = 0;
		this.textQueue = "";
		this.speed = 5;
		this.frames = 0;
	}

	//*********************************************************************//
	//Public Methods

	/**
	 * Loads text to be Displayed on this dialogue box
	 * @param {string} text - the text to display
	 * @param {number} speed - speed for text to be displayed in chars/sec (default: 5)
	 */
	displayText(text, speed = 5) {
		this.text = [""];
		this.textLength = 0;
		this.textQueue = text;
		this.speed = speed;
		this.frames = 0;
	}

	/** Updates and Draws this Dialogue Box */
	update() {
		super.update();

		//Update displayed text based on frames
		while (this.textQueue.length != 0) {
			if (this.textLength == Math.round(this.speed / 60 * this.frames)) {
				break;
			}
			if (this.textQueue.length != 1 && this.textQueue.substring(0, 1) == "\n") {
				this.text.push("");
				this.textQueue = this.textQueue.substring(1);
			}
			this.text[this.text.length - 1] += this.textQueue[0];
			this.textLength++;
			this.textQueue = this.textQueue.substring(1);
		}

		for (let i = 0; i < this.text.length; i++) {
			Display.drawText(this.text[i], this.x + 25 - this.width/2, this.y + 50 - this.height/2 + 25 * i, 25, true, "white");
		}
		
		if (this.textQueue.length == 0) {
			Display.drawText("continue", this.x + this.width/2 - "continue".length * 15, this.y + this.height/2 - 10, 25, true, "white");
			
			if (Button.simpleButton(this.x + this.width/2 - "continue".length * 15 + 30, this.y + this.height/2 - 28, "continue".length * 20, 25)) {
				return false;
			}
		}
		if (Keyboard.isKeyPressed(" ")) {
			if (this.textQueue == "") {
				return false;
			} else {
				this.text[this.text.length - 1] += this.textQueue.split("\n")[0];
				let leftoverLines = this.textQueue.split("\n");
				leftoverLines.shift();
				this.text.push(...leftoverLines);
				this.textQueue = "";
			}
		}

		this.frames++;
		return true;
	}
}