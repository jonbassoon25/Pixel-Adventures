//Util Imports
import { Display } from "./Display.js";
import { Util } from "./Util.js";

//Game Object Imports
import { SceneTile } from "../gameObjects/SceneTile.js";

//Scene Class
export class Scene {
	//Static Variables
	
	static structure = null;
	static shaderStructure = null;
	static tileSize = 40;
	static background = null;
	static shadersToUpdate = [];

	//*********************************************************************//
	//Public Static Methods

	/** 
	 * Initalizes a new game scene
	 * @param {SceneTile[][]} structure - The new scene's structure
	 * @param {number} tileSize - The new size of each tile (optional)
	 */
	static initScene(structure, shaderStructure = null, tileSize = 40) {
		this.structure = structure;
		this.shaderStructure = shaderStructure;
		this.tileSize = tileSize;
		this.displayAll();
		this.background = Display.imageData;
	}

	/** 
	 * Updates all scene objects in the scene structure
	 * @param {VisualObject[]} objects - objects that need to have their background updated
	 */
	static updateTiles(objects) {
		if (this.structure == null) {
			return;
		}
		for (let i = 0; i < objects.length; i++) {
			for (let j = 0; j < this.structure.length; j++) {
				for (let k = 0; k < this.structure[j].length; k++) {
					if (objects[i].isVisualColliding(this.structure[j][k])) {
						this.structure[j][k].update();
					}
				}
			}
		}
	}

	/**
	 * Updates all shaders in the shader structure
	 * @param {VisualObject[]} objects - objects that need to have their background updated
	 */
	static updateShaders(objects) {
		if (this.shaderStructure == null) {
			return;
		}
		for (let i = 0; i < objects.length; i++) {
			for (let j = 0; j < this.structure.length; j++) {
				for (let k = 0; k < this.structure[j].length; k++) {
					if (objects[i].isVisualColliding(this.structure[j][k])) {
						for (let l = 0; l < 2; l++) {
							for (let n = 0; n < 2; n++) {
								Scene.shaderStructure[j * 2 + l][k * 2 + n].update();
							}
						}
					}
				}
			}
		}
	}

	/** Draws the background of the Scene, flashes the screen on canvas resize */
	static drawBackground() {
		//Flash the screen on canvas resize to avoid size errors
		if (Display.resized) {
			this.displayAll();
			return;
		}
		if (this.background != null) {
			Display.drawData(this.background, 0, 0);
		}
	}

	/**
	 * Updates all SceneTiles and ShaderTiles that need to be updated
	 * @param {VisualObject[]} objects - objects that need to have their background updated
	 */
	static update(objects) {
		if (this.structure == null) {
			return;
		}
		for (let i = 0; i < objects.length; i++) {
			for (let j = 0; j < this.structure.length; j++) {
				//If not the top of the dynamic object is above the bottom of the first structure tile in the row and the bottom of the dynamic object is below the top of the first structure tile in the row
				if (!(objects[i].y - objects[i].visualHeight/2 < this.structure[j][0].y + this.structure[j][0].height/2 && objects[i].y + objects[i].visualHeight/2 > this.structure[j][0].y - this.structure[j][0].height/2)) {
					//The dynamic object won't collide with any tiles in that row
					continue;
				}
				//console.log(objects[i].visualWidth);
				for (let k = 0; k < this.structure[j].length; k++) {
					if (objects[i].isVisualColliding(this.structure[j][k])) {
						this.structure[j][k].update();
						if (this.shaderStructure == null) {
							continue;
						}
						for (let l = 0; l < 2; l++) {
							for (let n = 0; n < 2; n++) {
								this.shadersToUpdate = Util.combine(this.shadersToUpdate, [this.shaderStructure[j * 2 + l][k * 2 + n]]);
							}
						}
					}
				}
			}
		}
	}

	/** Updates all shaders that need to be updated */
	static shade() {
		for (let i = 0; i < this.shadersToUpdate.length; i++) {
			this.shadersToUpdate[i].update();
		}
		this.shadersToUpdate = [];
	}

	/**
	 * @param {number} x - x coordinate to calculate
	 * @param {number} y - y coordinate to calculate
	 * @returns {number[]} Block coordinates of the passed in point. Formatted as [col, row]
	 */
	static calcBlockCoordinates(x, y) {
		return [Math.floor(x / this.tileSize), Math.floor(y / this.tileSize)];
	}

	/**
	 * @param {number} x - x coordinate of request
	 * @param {number} y - y coordinate of request
	 * @param {boolean} ignoreOutsideBoundsErr - should an error message not be printed on bounds error, default: false
	 * @returns {SceneTile} SceneTile at the requested x and y coordinates or a new SceneTile at [-1, -1] (col, row) on bounds error
	 */
	static getTile(x, y, ignoreOutsideBoundsErr = false) {
		[x, y] = this.calcBlockCoordinates(x, y);
		if (!this.isInBounds(x, y)) {
			if (!ignoreOutsideBoundsErr) {
				console.error("Out Of Bounds: Scene.getTile(" + x + ", " + y + ")");
			}
			return new SceneTile("none", -1, -1, false, false);
		}
		return this.structure[y][x];
	}

	/**
	 * @param {number} x - x coordinate of request
	 * @param {number} y - y coordinate of request
	 * @returns {boolean} is the requested block out of bounds
	 */
	static isInBounds(x, y) {
		[x, y] = this.calcBlockCoordinates(x, y);
		return !(x < 0 || x >= this.structure[0].length || y < 0 || y >= this.structure.length);
	}

	/** Displays all SceneTiles and ShaderTiles */
	static displayAll() {
		if (this.structure == null) {
			return;
		}
		for (let i = 0; i < this.structure.length; i += 0.5) {
			for (let j = 0; j < this.structure[0].length; j += 0.5) {
				if (i % 1 == 0 && j % 1 == 0) {
					this.structure[i][j].update();
				}
				if (this.shaderStructure == null) {
					j += 0.5; //improves efficiency by 25% when shader structure doesn't exist
					continue;
				}
				this.shaderStructure[i * 2][j * 2].update();
			}
			if (this.shaderStructure == null) {
				i += 0.5; //improves efficiency by 25% when shader structure doesn't exist
			}
		}
	}
}