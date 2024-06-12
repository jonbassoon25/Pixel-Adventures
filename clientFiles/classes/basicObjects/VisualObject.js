//Util Imports
import { Display } from "../util/Display.js";

//UIObject Class
export class VisualObject {
	//Constructor

	/** 
	@param {string} image
	@param {number} x - Absolue x position of the visualObject
	@param {number} y - Absolue y position of the visualObject
	@param {number} width - Absolute width of the visualObject
	@param {number} height - Absolute height of the visualObject
	*/
	constructor(image, x, y, width = -1, height = -1) {
		//Set name
		this.name = "VisualObject";
		//Set image
		this.image = image;
		//Set absolute position values
		this.x = x;
		this.y = y;
		this.width = (width == -1)? image.width : width;
		this.height = (height == -1)? image.height : height;
		this.xOffset = 0;
		this.yOffset = 0;
		this.visualWidth = width;
		this.visualHeight = height;
	}

	//*********************************************************************//
	//Public Methods

	/**
	 * @param {VisualObject} other - other object to check
	 * @param {boolean} firstCall - Is this the first time this function has been called (true)
	 * @returns {boolean} is this object colliding with the other object
	 */
	isColliding(other, firstCall = true, inclusive = true) {
		if (firstCall) {
			return this.isEnclosing(other.upperLeft, inclusive) || this.isEnclosing(other.upperRight, inclusive) || this.isEnclosing(other.bottomRight, inclusive) || this.isEnclosing(other.bottomLeft, inclusive) || other.isColliding(this, false, inclusive);
		}
		return this.isEnclosing(other.upperLeft, inclusive) || this.isEnclosing(other.upperRight, inclusive) || this.isEnclosing(other.bottomRight, inclusive) || this.isEnclosing(other.bottomLeft, inclusive);
	}

	isVisualColliding(other, firstCall = true, inclusive = true) {
		if (firstCall) {
			return this.isVisualEnclosing(other.vUpperLeft, inclusive) || this.isVisualEnclosing(other.vUpperRight, inclusive) || this.isVisualEnclosing(other.vBottomRight, inclusive) || this.isVisualEnclosing(other.vBottomLeft, inclusive) || other.isVisualColliding(this, false, inclusive);
		}
		return this.isVisualEnclosing(other.vUpperLeft, inclusive) || this.isVisualEnclosing(other.vUpperRight, inclusive) || this.isVisualEnclosing(other.vBottomRight, inclusive) || this.isVisualEnclosing(other.vBottomLeft, inclusive);
	}

	/** 
	 * @returns {boolean} is the point inside of this object (Default: inclusive of borders)
	 */
	isEnclosing(point, inclusive = true) {
		if (inclusive) {
			return point[0] >= this.x - this.width/2 && point[0] <= this.x + this.width/2 && point[1] >= this.y - this.height/2 && point[1] <= this.y + this.height/2;
		} else {
			return point[0] > this.x - this.width/2 && point[0] < this.x + this.width/2 && point[1] > this.y - this.height/2 && point[1] < this.y + this.height/2;
		}
	}

	isVisualEnclosing(point, inclusive = true) {
		if (inclusive) {
			return point[0] >= this.visualX - this.visualWidth/2 && point[0] <= this.visualX + this.visualWidth/2 && point[1] >= this.visualY - this.visualHeight/2 && point[1] <= this.visualY + this.visualHeight/2;
		} else {
			return point[0] > this.visualX - this.visualWidth/2 && point[0] < this.visualX + this.visualWidth/2 && point[1] > this.visualY - this.visualHeight/2 && point[1] < this.visualY + this.visualHeight/2;
		}
	}

	/** Draws this VisualObject */
	draw() {
		if (this.image == "sparkRed") console.log("drawn");
		Display.draw(this.image, this.visualX, this.visualY, this.visualWidth, this.visualHeight);
	}
	
	/** Updates and draws this VisualObject */
	update() {
		Display.draw(this.image, this.visualX, this.visualY, this.visualWidth, this.visualHeight);
	}

	//*********************************************************************//
	//Getter Methods

	get center() {
		return [this.x, this.y];
	}

	get upperLeft() {
		return [this.x - this.width/2, this.y - this.height/2];
	}

	get upperRight() {
		return [this.x + this.width/2, this.y - this.height/2];
	}

	get bottomLeft() {
		return [this.x - this.width/2, this.y + this.height/2];
	}

	get bottomRight() {
		return [this.x + this.width/2, this.y + this.height/2];
	}

	//Visual Points

	get vCenter() {
		return [this.visualX, this.visualY];
	}

	get vUpperLeft() {
		return [this.visualX - this.visualWidth/2, this.visualY - this.visualHeight/2];
	}

	get vUpperRight() {
		return [this.visualX + this.visualWidth/2, this.visualY - this.visualHeight/2];
	}

	get vBottomLeft() {
		return [this.visualX - this.visualWidth/2, this.visualY + this.visualHeight/2];
	}

	get vBottomRight() {
		return [this.visualX + this.visualWidth/2, this.visualY + this.visualHeight/2];
	}

	get visualX() {
		return this.x + this.xOffset;
	}
	get visualY() {
		return this.y + this.yOffset;
	}
}