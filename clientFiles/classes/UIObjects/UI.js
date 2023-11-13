//Util Imports
import { Display } from "../util/Display.js";
import { textures } from "../util/Textures.js";

//UI Object Imports
const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");



//UI Class
export class UI {
	//Draws an image onto the canvas, can take a image string or image, can take relative or absolute values
	static draw(image, x, y, width, height, resize = false) {
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Calculate the new element dimensions
			[x, y, width, height] = [...Display.calcElementDimenstions(x, y, width, height)];
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
	static drawText(text, x, y, size, resize = false, color = "#ffffff") {
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Use trash variable to store the unneeded return from Display.calcElementDimensions
			let trash = 0;
			[x, y, trash, size] = [...Display.calcElementDimenstions(x, y, 0, size)];
		}
		//Set the font size to fill the textbox from top to bottom
		ctx.font = size.toString() + "px Monospace";
		//Set the text color to the given color
		ctx.fillStyle = color;
		//Draw the text onto the canvas
		ctx.fillText(text, x, y);
	}
}