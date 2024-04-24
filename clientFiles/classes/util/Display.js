//Util Imports
import { textures } from "./Textures.js";

//Game entity imports

//Define the canvas
const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

export class Display {
	//Static Variables

	static sizeMult = 1;
	static horizontalOffset = 0;
	static verticalOffset = 0;
	static resized = false;
	static frames = 0;
	static fps = 0;


	//*********************************************************************//
	//Public Static Methods

	static setAlpha(num) {
		ctx.globalAlpha = num;
	}
	/** 
	 * Updates Display variables to reflect whatever the user's screen diminsions are
	 */
	static calcScreenSize() {
		let prevValues = [this.sizeMult, this.horizontalOffset, this.verticalOffset];
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
		if (this.sizeMult != prevValues[0] || this.horizontalOffset != prevValues[1] || this.verticalOffset != prevValues[2]) {
			this.resized = true;
		}
	}

	/** 
	 * Calculates the relative dimensions of an element based on the screen dimensions
	 * @param {number} x - The absolute x position of the element
	 * @param {number} y - The absolute y position of the element
	 * @param {number} width - The absolute width of the element
	 * @param {number} height - The absolute height of the element
	 * @returns {number[]} The relative dimensions of the element [x, y, width, height]
	 */
	static * calcElementDimensions(x, y, width, height) {
		yield (x - width/2) * this.sizeMult + this.horizontalOffset;
		yield (y - height/2) * this.sizeMult + this.verticalOffset;
		yield width * this.sizeMult;
		yield height * this.sizeMult;
	}

	/** Draws black bounding boxes on the screen edges to ensure relative 1920 by 1080 canvas */
	static drawBounds() {
		//Top bounding box
		ctx.drawImage(textures["blackTile"], 0, 0, canvas.width, this.verticalOffset);
		//Right bounding box
		ctx.drawImage(textures["blackTile"], canvas.width - this.horizontalOffset, canvas.height, this.horizontalOffset, canvas.height);
		//Bottom bounding box
		ctx.drawImage(textures["blackTile"], 0, canvas.height - this.verticalOffset, canvas.width, this.verticalOffset);
		//Left bounding box
		ctx.drawImage(textures["blackTile"], 0, 0, this.horizontalOffset, canvas.height);
	}

	/** 
	 * Calculates the absolute dimensions of an element based on the screen dimensions
	 * @param {number} x - The relative x position of the element
	 * @param {number} y - The relative y position of the element
	 * @param {number} width - The relative width of the element
	 * @param {number} height - The relative height of the element
	 * @returns {number[]} The absolute dimensions of the element [x, y, width, height]
	 */
	static * inverseCalcElementDimensions(x, y, width, height) {
		yield (x - this.horizontalOffset) / this.sizeMult + width/2;
		yield (y - this.verticalOffset) / this.sizeMult + height/2;
		yield width / this.sizeMult;
		yield height / this.sizeMult;
	}

	/** 
	 * @param {number[]} point - point to check
	 * @param {boolean} absCoord - are the given coordinates absolute
	 * @param {number} padding - how many pixels outside of the display area can the object be before it is out of bounds
	 * @returns {boolean} True if the point is outside the display area
	 */
	static isOutOfBounds(point, absCoord = true, padding = 50) {
		if (absCoord) {
			let trash;
			[point[0], point[1], trash, trash] = this.calcElementDimensions(point[0], point[1], 0, 0);
		}
		return point[0] < 0 - padding || point[0] > canvas.width + padding || point[1] < 0 - padding || point[1] > canvas.height + padding;
	}

	static clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	/** 
	 * Draws a given image onto the canvas, pulls from textures for image strings, can take relative or absolute values
	 * @param {string} image - The image to draw
	 * @param {number} x - The x position of the object
	 * @param {number} y - The y position of the object
	 * @param {number} width - The width of the object
	 * @param {number} height - The height of the object
	 * @param {boolean} resize - Are the passed in values absolute (true) or relative (false) (optional)
	 */
	static draw(image, x, y, width, height, resize = true, flipped = false) {
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
			if (image.length == "shader_##".length && image.substring(0, "shader_".length) == "shader_") {
				//Draw the shader
				this.setAlpha(Number(image.substring(image.length - 2)) * 5 / 100);
				//console.log("alpha" + Number(image.substring(image.length - 2)));
				ctx.drawImage(textures["shader_black"], x, y, width, height);
				this.setAlpha(1);
				return;
			}
			if (flipped) {
				image += "Flipped";
			}
			if (textures[image] == undefined) {
				console.error("Image " + image + " Not Found.");
				return;
			}
			ctx.drawImage(textures[image], x, y, width, height);

		//The image is a plain image
		} else if (image instanceof Image) {
			ctx.drawImage(image, x, y, width, height);
		} else {
			console.error("Data not recognized as string or Image. " + image);
		}
	}

	/**
	 * Draws given image data onto the canvas
	 */
	static drawData(imageData, x, y, resize = true) {
		if (resize) {
			let newX;
			let newY;
			let trash;
			[newX, newY, trash, trash] = Display.calcElementDimensions(x, y, 0, 0);
			ctx.putImageData(imageData, Math.round(newX), Math.round(newY));
		} else {
			console.log("no resize");
			ctx.putImageData(imageData, Math.round(x), Math.round(y));
		}
	}

	//Draws specified text onto the canvas, can take relative or absolute values
	/** 
	 * Draws text onto the canvas, can take relative or absolute values
	 * @param {string} text - The text to draw
	 * @param {number} x - The x position of the text
	 * @param {number} y - The y position of the text
	 * @param {number} size - The height of the text
	 * @param {boolean} resize - Are the passed in values absolute (true) or relative (false) (optional)
	 * @param {string} color - The color of the text (optional)
	 */
	static drawText(text, x, y, size, resize = true, color = "#ffffff") {
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Use trash variable to store the unneeded return from Display.calcElementDimensions
			let trash;//🗑️
			[x, y, trash, size] = this.calcElementDimensions(x, y, 0, size);
		}
		//Set the font size to fill the textbox from top to bottom
		ctx.font = "bold " + size.toString() + "px Monospace";
		//Set the text color to the given color
		ctx.fillStyle = color;
		//Draw the text onto the canvas
		ctx.fillText(text, x, y);
	}

	static markPlayerDisplay(player1, player2) {
		//Player display has a minimum width of 320
		//Player display has a maximum width of 1920
		//Player display must retain aspect ratio of 16:9
		//Player display (preferably) won't exit the bounds of the scene
		let width = ((Math.abs(player2.x - player1.x) + 300 < 480)? 480 : 0);
		let dimensions;
		dimensions = {"x": (player1.x + player2.x)/2, 
						  "y": (player1.y + player2.y)/2,
						  "width": width, 
						  "height": width * 9/16
						 }
		Display.draw("selectionBox", dimensions["x"], dimensions["y"], dimensions["width"], dimensions["height"]);
	}

	//*********************************************************************//
	//Getters

	static get imageData() {
		let x;
		let y;
		let width;
		let height;
		[x, y, width, height] = this.calcElementDimensions(1920/2, 1080/2, 1920, 1080);
		x = Math.round(x);
		y = Math.round(y);
		return ctx.getImageData(x, y, width, height);
	}
}