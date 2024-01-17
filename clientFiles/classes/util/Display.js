//Util Imports
import { textures } from "./Textures.js";

//Define the canvas
const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

export class Display {
	//Static Variables
	
	static sizeMult = 1;
	static horizontalOffset = 0;
	static verticalOffset = 0;
	

	//*********************************************************************//
	//Public Static Methods

	/** 
  	Updates Display variables to reflect whatever the user's screen diminsions are
  	*/
	static calcScreenSize() {
		//Make sure that the canvas covers the whole screen
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		//setup for 16:9 aspect ratio at 1920px * 1080px base
		if (canvas.width / 16 > canvas.height / 9) {
			this.sizeMult = canvas.height/1080;
			this.horizontalOffset = (canvas.width / 16 - canvas.height / 9) * 16 / 2;
			this.verticalOffset = 0;
		} else {
			this.sizeMult = canvas.width/1920;
			this.verticalOffset = (canvas.height / 9 - canvas.width / 16) * 9 / 2;
			this.horizontalOffset = 0;
		}
	}

	/** 
  	Calculates the relative dimensions of an element based on the screen dimensions
	@param {number} x - The absolute x position of the element
  	@param {number} y - The absolute y position of the element
	@param {number} width - The absolute width of the element
  	@param {number} height - The absolute height of the element
	@returns {number[]} The relative dimensions of the element [x, y, width, height]
 	*/
	static * calcElementDimensions(x, y, width, height) {
		yield (x - width/2) * this.sizeMult + this.horizontalOffset;
		yield (y - height/2) * this.sizeMult + this.verticalOffset;
		yield width * this.sizeMult;
		yield height * this.sizeMult;
	}

	/** 
  	Calculates the absolute dimensions of an element based on the screen dimensions
	@param {number} x - The relative x position of the element
  	@param {number} y - The relative y position of the element
	@param {number} width - The relative width of the element
  	@param {number} height - The relative height of the element
	@returns {number[]} The absolute dimensions of the element [x, y, width, height]
 	*/
	static * inverseCalcElementDimensions(x, y, width, height) {
		yield (x - this.horizontalOffset) / this.sizeMult + width/2;
		yield (y - this.verticalOffset) / this.sizeMult + height/2;
		yield width / this.sizeMult;
		yield height / this.sizeMult;
	}

	/** 
	@param {number[]} point - point to check
	@param {boolean} absCoord - are the given coordinates absolute
	@param {number} padding - how many pixels outside of the display area can the object be before it is out of bounds
	@returns {boolean} True if the point is outside the display area
	*/
	static isOutOfBounds(point, absCoord = true, padding = 50) {
		if (absCoord) {
			let trash;
			[point[0], point[1], trash, trash] = this.calcElementDimensions(point[0], point[1], 0, 0);
		}
		return point[0] < 0 - padding || point[0] > canvas.width + padding || point[1] < 0 - padding || point[1] > canvas.height + padding;
	}

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
			[x, y, width, height] = this.calcElementDimensions(x, y, width, height);
		}
		//y = canvas.height - y;
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
			[x, y, trash, size] = this.calcElementDimensions(x, y, 0, size);
		}
		//Set the font size to fill the textbox from top to bottom
		ctx.font = size.toString() + "px Monospace";
		//Set the text color to the given color
		ctx.fillStyle = color;
		//Draw the text onto the canvas
		ctx.fillText(text, x, y);
	}
}