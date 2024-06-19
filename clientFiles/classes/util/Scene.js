//Util Imports
import { Display } from "./Display.js";
import { Util } from "./Util.js";

//Game Object Imports
import { SceneTile } from "../gameObjects/SceneTile.js";

//Basic Object Imports
import { ShadedObject } from "../basicObjects/ShadedObject.js";

//Scene Class
export class Scene {
	//Static Variables
	
	static structure = null;
	static shaderStructure = null;
	static tileSize = 40;
	static background = null;
	static tileBackground = null;
	static shaderBackground = null;
	static shadersToUpdate = [];
	static decorations = [];
	static lightSources = [];
	//Must be in function 2^x power. x >= 1. x is an element of all integers
	static lightQuality = Math.pow(2, 3);

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
		this.lightSources = [];
		//Identify light sources for particle generation
		for (let i = 0; i < structure.length; i++) {
			for (let j = 0; j < structure[i].length; j++) {
				if (structure[i][j].type == "LightTile") {
					//Don't spawn particles at a light source if it is obscured by a decoration
					let allowed = true;
					for (let k = 0; k < this.decorations.length; k++) {
						if (this.decorations[k].isEnclosing([structure[i][j].x, structure[i][j].y])) {
							allowed = false;
							break;
						}
					}
					if (allowed) this.lightSources.push([structure[i][j].x, structure[i][j].y]);
				}
			}
		}
		this.flash();
	}

	/** Draws the background of the Scene, flashes the screen on canvas resize */
	static drawBackground() {
		//Flash the screen on canvas resize to avoid size errors
		if (Display.resized) {
			this.flash(true);

			return;
		}
		if (this.background != null) {
			Display.drawData(this.background, 0, 0);
		}
	}

	/** Draws all background decorations */
	static drawDecorations() {
		for (let i = 0; i < this.decorations.length; i++) {
			this.decorations[i].update();
		}
		return;
	}
	
	/** Draws the shaders for all shadedObjects */
	static drawShadedObjects() {
		let curObj;

		//Update Tile Backgrounds
		for (let i = Object.keys(ShadedObject.shadedObjects).length - 1; i >= 0; i--) {
			for (let j = 0; j < Object.values(ShadedObject.shadedObjects)[i].length; j++) {
				//Assign current object
				curObj = Object.values(ShadedObject.shadedObjects)[i][j];
				if (!curObj.shaded) continue;
				Display.drawData(this.tileBackground, 0, 0, ...curObj.vUpperLeft, curObj.visualWidth, curObj.visualHeight);
			}
			
		}

		//Draw Shaded Objects
		for (let i = Object.keys(ShadedObject.shadedObjects).length - 1; i >= 0; i--) {
			for (let j = 0; j < Object.values(ShadedObject.shadedObjects)[i].length; j++) {
				//Draw current object
				Object.values(ShadedObject.shadedObjects)[i][j].draw();
			}

		}

		Display.updateCurrentData();

		//Update Shader Overlay
		for (let i = Object.keys(ShadedObject.shadedObjects).length - 1; i >= 0; i--) {
			for (let j = 0; j < Object.values(ShadedObject.shadedObjects)[i].length; j++) {
				curObj = Object.values(ShadedObject.shadedObjects)[i][j];
				if (!curObj.shaded) continue;
				Display.drawData(this.shaderBackground, 0, 0, ...curObj.vUpperLeft, curObj.visualWidth, curObj.visualHeight, true);
			}

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
	 * @param {number} x - x block coordinate to calculate
	 * @param {number} y - y block coordinate to calculate
	 * @returns {number[]} Coordinates of the passed in point. Formatted as [x, y]
	 */
	static inverseCalcBlockCoordinates(col, row) {
		return [Math.floor(col * this.tileSize + this.tileSize / 2), Math.floor(row * this.tileSize + this.tileSize / 2)];
	}

	/**
	 * @param {number} x - x block coordinate to calculate
	 * @param {number} y - y block coordinate to calculate
	 * @returns {number[]} Coordinates of the passed in point, snaped to the nearest tile. Formatted as [x, y]
	 */
	static snapCoordinates(x, y) {
		return [...Scene.inverseCalcBlockCoordinates(...Scene.calcBlockCoordinates(x, y))];
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

	/** Flashes the new shader background and background to memory */
	static flash(drawBackground = false) {		
		//Capture new backgrounds
		Display.clear();
		
		this.displayAllShaders();
		this.shaderBackground = Display.imageData;
		Display.clear();

		this.displayAllTiles();
		this.drawDecorations();
		
		this.tileBackground = Display.imageData;

		this.displayAllShaders();
		this.background = Display.imageData;

		if (!drawBackground) {
			Display.clear();
		}
	}
}