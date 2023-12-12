//Util Imports
import { Display } from "../util/Display.js";
import { textures } from "../util/Textures.js";

//UI Object Imports
const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

//UI Class
export class UI {
	//Static Variables
	
	//-1 is flipped, 1 is normal
	static #flipPercent = 1;
	static flipped = false;

	//*********************************************************************//
	//Public Static Methods
	
	/** 
  	Draws a given image onto the canvas, pulls from textures for image strings, can take relative or absolute values
  	@param {string} image - The image to draw
	@param {number} x - The x position of the object
  	@param {number} y - The y position of the object
	@param {number} width - The width of the object
  	@param {number} height - The height of the object
	@param {boolean} resize - Are the passed in values absolute (true) or relative (false) (optional)
 	*/
	static draw(image, x, y, width, height, resize = true) {
		//If there is no image to draw, return
		if (image == "none") {
			return;
		}
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Calculate the new element dimensions
			[x, y, width, height] = [...Display.calcElementDimensions(x, y, width, height)];
		}
		//Determine if the image given needs to be taken from textures
		if (typeof image === "string") {
			ctx.drawImage(textures[image], x, y, width, height);
		//The image is a plain image
		} else {
			ctx.drawImage(image, x, y, width, height);
		}
	}

	//Draws specified text onto the canvas, can take relative or absolute values
	/** 
  	Draws text onto the canvas, can take relative or absolute values
	@param {string} text - The text to draw
  	@param {number} x - The x position of the text
  	@param {number} y - The y position of the text
	@param {number} size - The height of the text
  	@param {boolean} resize - Are the passed in values absolute (true) or relative (false) (optional)
  	@param {string} color - The color of the text (optional)
 	*/
	static drawText(text, x, y, size, resize = true, color = "#ffffff") {
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Use trash variable to store the unneeded return from Display.calcElementDimensions
			let trash;
			[x, y, trash, size] = [...Display.calcElementDimensions(x, y, 0, size)];
		}
		//Set the font size to fill the textbox from top to bottom
		ctx.font = size.toString() + "px Monospace";
		//Set the text color to the given color
		ctx.fillStyle = color;
		//Draw the text onto the canvas
		ctx.fillText(text, x, y);
	}

	/** 
  	Flips the scene, left become right and background is now the other wall
	@returns {boolean} True when the scene has been flipped
 	*/
	static flipScene() {
		if (this.flipped && this.#flipPercent > -1) {
			this.#flipPercent -= 0.05;
		} else if (this.flipPercent < 1) {
			this.#flipPercent += 0.05;
		} else {
			return true;
		}
		return false;
	}
}