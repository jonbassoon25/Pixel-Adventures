//Util Imports
import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";


//Class SceneTile
export class SceneTile {
	//Constructor

	/*
	@param {string} image - image of the scene tile
	@param {number} row - row of the scene structure this scene tile is at
	@param {number} col - column of the scene structure this scene tile is at
	*/
	constructor(image, col, row, hasCollision = false, hasVines = false) {
		this.type = "SceneTile"
		this.image = image;
		this.col = col;
		this.row = row;
		this.hasCollision = hasCollision;
		this.hasVines = hasVines;
	}

	//*********************************************************************//
	//Public Methods

	isEnclosing(point) {
		return point[0] >= this.x - this.width/2 && point[0] <= this.x + this.width/2 && point[1] >= this.y - this.height/2 && point[1] <= this.y + this.height/2;
	}

	isColliding(other) {
		return this.isEnclosing(other.upperLeft) || this.isEnclosing(other.upperRight) || this.isEnclosing(other.bottomRight) || this.isEnclosing(other.bottomLeft);
	}

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
	get width() {
		return Scene.tileSize;
	}
	get height() {
		return Scene.tileSize;
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
}