//Util Imports
import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";
import { VisualObject } from "../util/VisualObject.js";


//SceneTile Class
export class SceneTile extends VisualObject {
	//Constructor

	/**
	 * @param {string} image - image of the scene tile
	 * @param {number} col - column of the scene structure this scene tile is at
	 * @param {number} row - row of the scene structure this scene tile is at
	 * @param {boolean} hasCollision - if this SceneTile has collision
	 * @param {boolean} hasVines - if this SceneTile has vines
	*/
	constructor(image, col, row, hasCollision = false, hasVines = false) {
		super(image, 0, 0, Scene.tileSize, Scene.tileSize);
		this.type = "SceneTile"
		this.image = image;
		this.col = col;
		this.row = row;
		this.hasCollision = hasCollision;
		this.hasVines = hasVines;
	}

	//*********************************************************************//
	//Public Methods

	/** Updates and Draws this SceneTile */
	update() {
		Display.draw(this.image, this.x, this.y, Scene.tileSize, Scene.tileSize);
		if (this.hasVines) {
			Display.draw("vines", this.x, this.y, Scene.tileSize, Scene.tileSize);
		}
	}

	//*********************************************************************//
	//Getters
	
	get x() {
		return this.col * Scene.tileSize + Scene.tileSize/2;
	}
	get y() {
		return this.row * Scene.tileSize + Scene.tileSize/2;
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

	//*********************************************************************//
	//Setters

	//Needed to avoid set errors in the VisualObject constructor
	set x(x) {}
	set y(y) {}
}