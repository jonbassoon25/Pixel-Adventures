import { Display } from "../util/Display.js";
import { textures } from "../util/Textures.js";

const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

export class UI {
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

	static drawText(text, x, y, size, resize = false) {
		if (resize) {
			let packet = [...Display.calcElementDimenstions(x, y, 0, size)];
			x = packet[0];
			y = packet[1];
			size = packet[3];
		}
		ctx.font = size.toString() + "px Monospace";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(text, x, y);
	}
}