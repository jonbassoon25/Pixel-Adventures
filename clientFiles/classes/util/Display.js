//Util Imports
import { textures } from "./Textures.js";
import { Util } from "./Util.js";

//Basic Object Imports
import { VisualObject } from "../basicObjects/VisualObject.js";

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
	static currentData = null;
	static specialCharacters = {
		"￠": "centCharacter"
	}

	static queuedShaders = {}
	
	//*********************************************************************//
	//Public Static Methods

	static getTextWidth(text, size) {
		ctx.font = size + "px ThaleahFat"
		return ctx.measureText(text).width;
	}
	
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
	 * Calculates the relative dimensions of an element based on the screen dimensions. Put -1 to negate return of the given value
	 * @param {number} x - The absolute x position of the element
	 * @param {number} y - The absolute y position of the element
	 * @param {number} width - The absolute width of the element
	 * @param {number} height - The absolute height of the element
	 * @returns {number[]} The relative dimensions of the element [x, y, width, height]
	 */
	static * calcElementDimensions(x, y, width, height) {
		if (x != -1 && width != -1) {
			yield (x - width/2) * this.sizeMult + this.horizontalOffset;
		} else if (width == -1) {
			yield x * this.sizeMult + this.horizontalOffset;
		}
		if (y != -1 && height != -1) {
			yield (y - height/2) * this.sizeMult + this.verticalOffset;
		} else if (height == -1) {
			yield y * this.sizeMult + this.verticalOffset;
		}
		if (width != -1) yield width * this.sizeMult;
		if (height != -1) yield height * this.sizeMult;
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
		if (x != -1 && width != -1) {
			yield (x - this.horizontalOffset) / this.sizeMult + width/2;
		} else if (width == -1) {
			yield (x - this.horizontalOffset) / this.sizeMult;
		} 
		if (y != -1 && height != -1) {
			yield (y - this.verticalOffset) / this.sizeMult + height/2;
		} else if (height == -1) {
			yield (y - this.verticalOffset) / this.sizeMult;
		}
		if (width != -1) yield width / this.sizeMult;
		if (height != -1) yield height / this.sizeMult;
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

	/** Populates the current data ImageData */
	static updateCurrentData() {
		this.currentData = this.imageData;
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
	static draw(image, x, y, width, height, resize = true, flipped = false, degreesRotated = 0, opacity = 100) {
		//If there is no image to draw, return
		if (image == "none") {
			return;
		}
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Calculate the new element dimensions
			[x, y, width, height] = this.calcElementDimensions(x, y, width, height);
		}
		//Determine if the image given needs to be taken from textures
		if (typeof image === "string") {
			//Complex image syntax: "image+-degreesFlipped? altIndex/numAlts". Should work, just please avoid using this in practice
			if ((image.length == "shader_##".length || image.length == "shader_###".length) && image.substring(0, "shader_".length) == "shader_") {
				//Draw the shader
				if (image.length == "shader_##".length) {
					//console.log(Number(image.substring(image.length - 2)) * 5 / 100);
					this.drawShader(Number(image.substring(image.length - 2)) * 5 / 100, x, y, width, height, false);
				} else {
					//console.log(Number(image.substring(image.length - 2)) / 100);
					this.drawShader(Number(image.substring(image.length - 3)) / 100, x, y, width, height, false);
				}
				return;
			}
			let altSyntax = "1/1";
			if (image.includes(" ")) {
				altSyntax = image.substring(image.lastIndexOf(" ") + 1);
				image = image.substring(0, image.lastIndexOf(" "));
			}
			let altIndex = parseInt(altSyntax.substring(0, altSyntax.indexOf("/")));
			let numAlts = parseInt(altSyntax.substring(altSyntax.indexOf("/") + 1));

			//Systems for backwards compatibility
			if (image.includes("Flipped")) {
				image = image.substring(0, image.indexOf("Flipped"));
				flipped = true;
			}
			if (image.includes("+") || image.includes("-")) {
				//Image needs to be rotated
				degreesRotated += parseInt(image.substring(image.indexOf(image.includes("+")? "+" : "-")));
				image = image.substring(0, image.indexOf(image.includes("+")? "+" : "-"));
			}
			
			//Is the image loaded?
			if (textures[image] == undefined) {
				console.error("Image " + image + " Not Found.");
				return;
			}
			//Handles opacity
			if (opacity != 100) ctx.globalAlpha = opacity/100;
			//Handles rotation
			if (degreesRotated != 0) {
				x += width/2;
				y += height/2;
				ctx.setTransform(flipped? -1 : 1, 0, 0, 1, x, y);
				ctx.rotate(degreesRotated * Math.PI/180);
				ctx.drawImage(textures[image], 0, 0 + (altIndex - 1) * textures[image].height/numAlts, textures[image].width, textures[image].height/numAlts, -width/2, -height/2, width, height);
				ctx.resetTransform();
			} else {
				//Handles image flipping
				if (flipped) {
					ctx.setTransform(-1, 0, 0, 1, x, y);
					ctx.drawImage(textures[image], 0, 0 + (altIndex - 1) * textures[image].height/numAlts, textures[image].width, textures[image].height/numAlts, -width, 0, width, height);
					ctx.resetTransform();
				} else {
					ctx.drawImage(textures[image], 0, 0 + (altIndex - 1) * textures[image].height/numAlts, textures[image].width, textures[image].height/numAlts, x, y, width, height);
				}
			}
			//Resets opacity
			if (opacity != 100) ctx.globalAlpha = 1;
		//If the image is a plain image
		} else if (image instanceof Image) {
			ctx.drawImage(image, x, y, width, height);
		} else {
			console.error("Data not recognized as string or Image: " + image);
		}
	}

	static drawCanvas(canvas, x = 0, y = 0) {
		[x, y] = this.calcElementDimensions(x, y, -1, -1);
		ctx.drawImage(canvas, x, y);
	}
	
	static drawSet(image, x, y, width, height, setLength, extensionDirection) {
		//Limited use, so lacks support for complex images
		[x, y, width, height] = this.calcElementDimensions(x, y, width, height);
		if (textures[image] == undefined) {
			console.error("Image " + image + " Not Found.");
			return;
		}
		switch (extensionDirection) {
			case "up":
				if (textures[image + "Vertical"] instanceof Image) image += "Vertical";
				for (let i = 0; i < setLength; i++) {
					if (i == 0 && textures[image + "EndDown"] instanceof Image) {
						if (i == Math.floor(setLength)) {
							ctx.drawImage(textures[image + "EndDown"], 
										  0, //Sample x
										  0 + (1 - (setLength - i)) * textures[image].height, //Sample y
										  textures[image].width, //Sample width
										  (setLength - i) * textures[image].height, //Sample height
										  x, //Destination x
										  y - (i * height) + (1 - (setLength - i)) * height, //Destination y
										  width, //Destination width
										  (setLength - i) * height //Destination height
										 );

						} else {
							ctx.drawImage(textures[image + "EndDown"], 
										  x, //Destination x
										  y - (i * height), //Destination y
										  width, //Destination width
										  height //Destination height
										 );
						}
						continue;
					}
					if (i == Math.floor(setLength)) {
						ctx.drawImage(textures[image], 
									  0, //Sample x
									  0 + (1 - (setLength - i)) * textures[image].height, //Sample y
									  textures[image].width, //Sample width
									  (setLength - i) * textures[image].height, //Sample height
									  x, //Destination x
									  y - (i * height) + (1 - (setLength - i)) * height, //Destination y
									  width, //Destination width
									  (setLength - i) * height //Destination height
									 );
						
					} else {
						ctx.drawImage(textures[image], 
									  x, //Destination x
									  y - (i * height), //Destination y
									  width, //Destination width
									  height //Destination height
									 );
					}
				}
				break;
			case "down":
				if (textures[image + "Vertical"] instanceof Image) image += "Vertical";
				for (let i = 0; i < setLength; i++) {
					if (i == 0 && textures[image + "EndUp"] instanceof Image) {
						if (i == Math.floor(setLength)) {
							ctx.drawImage(textures[image + "EndUp"], 
										  0, //Sample x
										  0, //Sample y
										  textures[image].width, //Sample width
										  (setLength - i) * textures[image].height, //Sample height
										  x, //Destination x
										  y + (i * height), //Destination y
										  width, //Destination width
										  (setLength - i) * height //Destination height
										 );
						} else {
							ctx.drawImage(textures[image + "EndUp"], 
										  x, //Destination x
										  y + (i * height), //Destination y
										  width, //Destination width
										  height //Destination height
										 );
						}
						continue;
					}
					if (i == Math.floor(setLength)) {
						ctx.drawImage(textures[image], 
									  0, //Sample x
									  0, //Sample y
									  textures[image].width, //Sample width
									  (setLength - i) * textures[image].height, //Sample height
									  x, //Destination x
									  y + (i * height), //Destination y
									  width, //Destination width
									  (setLength - i) * height //Destination height
									 );
					} else {
						ctx.drawImage(textures[image], 
									  x, //Destination x
									  y + (i * height), //Destination y
									  width, //Destination width
									  height //Destination height
									 );
					}
				}
				break;
			case "left":
				if (textures[image + "Horizontal"] instanceof Image) image += "Horizontal";
				for (let i = 0; i < setLength; i++) {
					if (i == 0 && textures[image + "EndRight"] instanceof Image) {
						if (i == Math.floor(setLength)) {
							ctx.drawImage(textures[image + "EndRight"], 
										  0 + (1 - (setLength - i)) * textures[image].width, //Sample x
										  0, //Sample y
										  (setLength - i) * textures[image].width, //Sample width
										  textures[image].height, //Sample height
										  x - (i * width) + (1 - (setLength - i)) * width, //Destination x
										  y, //Destination y
										  (setLength - i) * width, //Destination width
										  height //Destination height
										 );
						} else {
							ctx.drawImage(textures[image + "EndRight"], 
										  x - (i * width), //Destination x
										  y, //Destination y
										  width, //Destination width
										  height //Destination height
										 );
						}
						continue;
					}
					if (image == "cobblestoneHorizontal") image += "Flipped";
					if (i == Math.floor(setLength)) {
						ctx.drawImage(textures[image], 
									  0 + (1 - (setLength - i)) * textures[image].width, //Sample x
									  0, //Sample y
									  (setLength - i) * textures[image].width, //Sample width
									  textures[image].height, //Sample height
									  x - (i * width) + (1 - (setLength - i)) * width, //Destination x
									  y, //Destination y
									  (setLength - i) * width, //Destination width
									  height //Destination height
									 );
					} else {
						ctx.drawImage(textures[image], 
									  x - (i * width), //Destination x
									  y, //Destination y
									  width, //Destination width
									  height //Destination height
									 );
					}
				}
				break;
			case "right":
				if (textures[image + "Horizontal"] instanceof Image) image += "Horizontal";
				for (let i = 0; i < setLength; i++) {
					if (i == 0 && textures[image + "EndLeft"] instanceof Image) {
						if (i == Math.floor(setLength)) {
							ctx.drawImage(textures[image + "EndLeft"], 
										  0, //Sample x
										  0, //Sample y
										  (setLength - i) * textures[image].width, //Sample width
										  textures[image].height, //Sample height
										  x + (i * width), //Destination x
										  y, //Destination y
										  (setLength - i) * width, //Destination width
										  height //Destination height
										 );
						} else {
							ctx.drawImage(textures[image + "EndLeft"], 
										  x + (i * width), //Destination x
										  y, //Destination y
										  width, //Destination width
										  height //Destination height
										 );
						}
						continue;
					}
					if (i == Math.floor(setLength)) {
						ctx.drawImage(textures[image], 
									  0, //Sample x
									  0, //Sample y
									  (setLength - i) * textures[image].width, //Sample width
									  textures[image].height, //Sample height
									  x + (i * width), //Destination x
									  y, //Destination y
									  (setLength - i) * width, //Destination width
									  height //Destination height
									 );
					} else {
						ctx.drawImage(textures[image], 
									  x + (i * width), //Destination x
									  y, //Destination y
									  width, //Destination width
									  height //Destination height
									 );
					}
				}
				break;
		}
	}

	/**
	 * Draws a shader
	 * @param {number} shaderNum - number between 0.00 and 1
	 */
	static queueShader(shaderNum, x, y, width, height, resize = true) {
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Calculate the new element dimensions
			[x, y, width, height] = this.calcElementDimensions(x, y, width, height);
		}
		
		if (this.queuedShaders[shaderNum] == undefined) {
			this.queuedShaders[shaderNum] = [new VisualObject("shader_black", x, y , width, height)];
		} else {
			this.queuedShaders[shaderNum].push(new VisualObject("shader_black", x, y, width, height));
		}
	}

	static drawShader(shaderNum, x, y, width, height) {
		//Draw the shader
		this.setAlpha(shaderNum);
		ctx.drawImage(textures["shader_black"], x, y, width, height);
		this.setAlpha(1);
	}

	static drawShaders() {
		let keys = Object.keys(this.queuedShaders);
		for (let j = 0; j < keys.length; j++) {
			let key = keys[j];
			this.setAlpha(key);
			for (let i = 0; i < this.queuedShaders[key].length; i++) {
				let curShad = this.queuedShaders[key][i];
				ctx.drawImage(textures["shader_black"], curShad.x, curShad.y, curShad.width, curShad.height);
			}
		}
		this.setAlpha(1);
		this.queuedShaders = {};
	}

	/**
	 * Draws given image data onto the canvas
	 * @param {ImageData} imageData - the image data to draw
	 * @param {number} x - x position to draw at
	 * @param {number} y - y position to draw at
	 * @param {number} dx - x position to start data extraction from (default: 0)
	 * @param {number} dy - y position to start data extraction from (default: 0)
	 * @param {number} dw - width of extracted data (default: -1 / full width)
	 * @param {number} dh - height of extracted data (default: -1 / full height)
	 */
	static drawData(imageData, x, y, dx = 0, dy = 0, dw = -1, dh = -1, shaderData = false, resize = true) {
		console.warn("draw data used");
		//Assign x and y
		if (resize) {
			[x, y] = this.calcElementDimensions(x, y, -1, -1);
			dx = Math.round(dx * this.sizeMult);
			dy = Math.round(dy * this.sizeMult);
		}
		
		//Assign width
		if (dw < 0) {
			//full width
			dw = imageData.width - dx;
		} else if (resize) {
			dw = Math.round(dw * this.sizeMult);
		}

		//Assign height
		if (dh < 0) {
			//full height
			dh = imageData.height - dy;
		} else if (resize) {
			dh = Math.round(dh * this.sizeMult);
		}
		
		if (shaderData) {
			let curData = this.currentData; //[x, y] is always [0, 0]
			
			//Linked to refrence to avoid repeating unneeded operation to reference data
			let curDat = curData.data;
			let imgDat = imageData.data;
			let finalData = new ImageData(curData.width, curData.height);
			let finDat = finalData.data;

			//Variable declarations to avoid unneeded let operation for every pixel
			let opac;
			let invOpac;

			//let finalImageData = new ImageData(dw, dh);
			//let finDat = finalImageData.data;

			for (let y = dy; y < dy + dh; y++) {
				for (let x = dx; x < dx + dw; x++) {
					let offset = ((y * curData.width) + x) * 4;
					//let finalDataOffset = (((y - dy) * dw) + (x - dx)) * 4;
					
					opac = imgDat[offset + 3] / 255;

					//Assign to avoid many 1 - opac operations
					invOpac = 1 - opac;

					//A
					finDat[offset + 3] = 255;

					//Assign final color values
					//1 - opacity * current pixel value + opacity * additive pixel value

					//Manual definitions to avoid looping operations

					//~~ is typecasting to 32 bit integer number, much faster than round or floor

					//B
					finDat[offset + 2] = ~~(invOpac * curDat[offset + 2] + opac * imgDat[offset + 2]);

					//G
					finDat[offset + 1] = ~~(invOpac * curDat[offset + 1] + opac * imgDat[offset + 1]);

					//R
					finDat[offset] = ~~(invOpac * curDat[offset] + opac * imgDat[offset]);
				}
			}

			//Draw the final data
			ctx.putImageData(finalData, Math.round(x), Math.round(y), dx, dy, dw, dh);
				

			/*
			for (let i = 3; i < minlen; i += 4) {
				opac = imgDat[i] / 255;

				//Assign to avoid many 1 - opac operations
				invOpac = 1 - opac;

				//A
				curDat[i] = 255;

				//Assign final color values
				//1 - opacity * current pixel value + opacity * additive pixel value

				//Manual definitions to avoid looping operations

				//~~ is typecasting to 32 bit integer number, much faster than round or floor
				
				//B
				curDat[i - 1] = ~~(invOpac * curDat[i - 1] + opac * imgDat[i - 1]);

				//G
				curDat[i - 2] = ~~(invOpac * curDat[i - 2] + opac * imgDat[i - 2]);

				//R
				curDat[i - 3] = ~~(invOpac * curDat[i - 3] + opac * imgDat[i - 3]);
			}

			//Draw the final data
			ctx.putImageData(curData, Math.round(x), Math.round(y));
			*/

			
			
		} else {
			ctx.putImageData(imageData, Math.round(x), Math.round(y), dx, dy, dw, dh);
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
	static drawText(text, x, y, size, resize = true, color = "#ffffff", dropShadowMultiplier = 1) {
		//Recursion for handling /n
		if (text.includes("\n")) {
			this.drawText(text.substring(0, text.indexOf("\n")), x, y, size, resize, color, dropShadowMultiplier);
			this.drawText(text.substring(text.indexOf("\n") + 1), x, y + size * 1.1, size, resize, color, dropShadowMultiplier);
			return;
		}
		
		//Recursion for handling special characters
		let keys = Object.keys(this.specialCharacters);
		for (let i = 0; i < keys.length; i++) {
			if (text.includes(keys[i])) {
				//Draw the text portion preceding the special character
				this.drawText(text.substring(0, text.indexOf(keys[i])), x, y, size, true, color);
				//Draw the special character
				Display.draw("blackTile", x + this.getTextWidth(text.substring(0, text.indexOf(keys[i]) - 1) + size/4, size), y - (2*size/3), size/2, size/2);
				//Draw the text portion succeeding the special character
				this.drawText(text.substring(text.indexOf(keys[i]) + 1), x + this.getTextWidth(text.substring(0, text.indexOf(keys[i])), size) + size/2, y, size, true, color);
				return;
			}
		}
		//console.log("Drawing text " + text);
		//If the coordinates passed in are absolute (they need to be resized)
		if (resize) {
			//Use trash variable to store the unneeded return from Display.calcElementDimensions
			let trash;//🗑️
			[x, y, trash, size] = this.calcElementDimensions(x, y, 0, size);
		}
		//Set the font size to fill the textbox from top to bottom
		//ctx.font = "bold " + size.toString() + "px Monospace"; (old font)
		ctx.font = size.toString() + "px ThaleahFat"
		//Set the text color to the given color
		ctx.fillStyle = color;
		//Draw the text onto the canvas
		ctx.fillText(text, x, y);
		//Draw the drop shadow
		ctx.globalAlpha = 0.4;
		ctx.fillText(text, x, y + (size/20 * dropShadowMultiplier));
		ctx.globalAlpha = 1;
	}

	static markPlayerDisplay(player1, player2) {
		//Player display has a minimum width of 320
		//Two player display must retain aspect ratio of 16:9
		//One player display must retain aspect ratio of 8:9
		//Player display (preferably) won't exit the bounds of the scene
		if (Math.abs(player1.x - player2.x) + 300 < 480) {
			
		}
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

	static get displayCanvas() {
		let shadowCanvas = document.createElement('canvas');
		let shadowCtx = shadowCanvas.getContext('2d');

		let data = this.imageData;
		
		shadowCanvas.width = window.innerWidth;
		shadowCanvas.height = window.innerHeight;

		
		for (let y = 0; y < data.height; y++) {
			for (let x = 0; x < data.width; x++) {
				let rgba = [
					data.data[(y * data.width + x) * 4],
					data.data[(y * data.width + x) * 4 + 1],
					data.data[(y * data.width + x) * 4 + 2],
					data.data[(y * data.width + x) * 4 + 3]/255
				]
				//console.log(rgba);
				shadowCtx.fillStyle = "rgba(" + rgba + ")";

				shadowCtx.fillRect(x, y, 1, 1);
			}
		}
		return shadowCanvas;
	}
}