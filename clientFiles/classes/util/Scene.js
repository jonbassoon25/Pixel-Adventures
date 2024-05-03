//Util Imports
import { Display } from "./Display.js";
import { Util } from "./Util.js";

//Game Object Imports
import { SceneTile } from "../gameObjects/SceneTile.js";
import { Door } from "../gameObjects/Door.js";

//Scene Class
export class Scene {
	//Static Variables
	
	static structure = null;
	static shaderStructure = null;
	static tileSize = 40;
	static background = null;
	static shaderBackground = null;
	static shadersToUpdate = [];
	//Must be in function 2^x power. x >= 1. x is an element of all integers. Recommended under 8
	static lightQuality = Math.pow(2, 1);

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
		
		this.flash();
	}

	/** Draws the background of the Scene, flashes the screen on canvas resize */
	static drawBackground() {
		//Flash the screen on canvas resize to avoid size errors
		if (Display.resized) {
			this.flash();

			return;
		}
		if (this.background != null) {
			Display.drawData(this.background, 0, 0);
		}
	}

	/** Draws the shader background of the Scene */
	static drawShaderBackground() {
		if (this.shaderBackground != null) {
			Display.drawData(this.shaderBackground, 0, 0, true);
		}
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
		this.displayAllTiles();
		Display.drawShaders();
	}

	static displayAllTiles() {
		if (this.structure == null) return;
		for (let i = 0; i < this.structure.length; i++) {
			for (let j = 0; j < this.structure[i].length; j++) {
				this.structure[i][j].update();
			}
		}
	}

	static displayAllShaders() {
		if (this.shaderStructure == null) return;
		for (let i = 0; i < this.shaderStructure.length; i++) {
			for (let j = 0; j < this.shaderStructure[i].length; j++) {
				this.shaderStructure[i][j].update();
			}
		}
		Display.drawShaders();
	}

	static updateDoor() {};

	/** Flashes the new shader background and background to memory and draws tile background */
	static flash() {
		//Capture new backgrounds
		Display.clear();
		this.displayAllShaders();
		this.shaderBackground = Display.imageData;
		Display.clear();

		this.displayAllTiles();
		this.background = Display.imageData;
	}
}