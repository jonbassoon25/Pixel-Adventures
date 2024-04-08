//Util Imports
import { Display } from "./Display.js";

//UIObject Class
export class VisualObject {
	//Constructor

	/** 
	@param {string} image
	@param {number} x - Absolue x position of the button
	@param {number} y - Absolue y position of the button
	@param {number} width - Absolute width of the button
	@param {number} height - Absolute height of the button
	*/
	constructor(image, x, y, width, height) {
		//Set name
		this.name = "VisualObject";
		//Set image
		this.image = image;
		//Set absolute position values
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
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
	isColliding(other, firstCall = true) {
		if (firstCall) {
			return this.isEnclosing(other.upperLeft) || this.isEnclosing(other.upperRight) || this.isEnclosing(other.bottomRight) || this.isEnclosing(other.bottomLeft) || other.isColliding(this, false);
		}
		return this.isEnclosing(other.upperLeft) || this.isEnclosing(other.upperRight) || this.isEnclosing(other.bottomRight) || this.isEnclosing(other.bottomLeft);
	}

	isVisualColliding(other, firstCall = true) {
		if (firstCall) {
			return this.isVisualEnclosing(other.vUpperLeft) || this.isVisualEnclosing(other.vUpperRight) || this.isVisualEnclosing(other.vBottomRight) || this.isVisualEnclosing(other.vBottomLeft) || other.isVisualColliding(this, false);
		}
		return this.isVisualEnclosing(other.vUpperLeft) || this.isVisualEnclosing(other.vUpperRight) || this.isVisualEnclosing(other.vBottomRight) || this.isVisualEnclosing(other.vBottomLeft);
	}

	/** 
	 * @returns {boolean} is the point inside of this object (Inclusive of borders)
	 */
	isEnclosing(point) {
		return point[0] >= this.x - this.width/2 && point[0] <= this.x + this.width/2 && point[1] >= this.y - this.height/2 && point[1] <= this.y + this.height/2;
	}

	isVisualEnclosing(point) {
		return point[0] >= this.visualX - this.visualWidth/2 && point[0] <= this.visualX + this.visualWidth/2 && point[1] >= this.visualY - this.visualHeight/2 && point[1] <= this.visualY + this.visualHeight/2;
	}

	/** Draws this VisualObject */
	draw() {
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