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
	constructor(image, row, col, hasCollision = false) {
		this.image = image;
		this.row = row;
		this.col = col;
		this.hasCollision = hasCollision;
	}

	//*********************************************************************//
	//Public Methods

	update() {
		Display.draw(this.image, this.row * Scene.tileSize + Scene.tileSize/2 + Scene.scrollAmount, this.col * Scene.tileSize + Scene.tileSize/2, Scene.tileSize, Scene.tileSize);
	}
}