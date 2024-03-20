import { Display } from "../util/Display.js";
import { Util } from "../util/Util.js";

//Scene Class
export class Scene {
	//Static Variables
	
	static structure = null;
	static shaderStructure = null;
	static tileSize = 40;
	//How many pixels have been scrolled (positive = user walking right). 
	static scrollAmount = 0;
	static background = null;
	static shadersToUpdate = [];

	//*********************************************************************//
	//Public Static Methods

	/** 
	Initalizes a new game scene
	@param {SceneTile[][]} structure - The new scene's structure
	@param {number} tileSize - The new size of each tile (optional)
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
	 * @param {VisualObject[]} objects - objects that need to have their background updated, defaults to all dynamicObjects
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

	static drawBackground() {
		if (Display.resized) {
			this.displayAll();
			return;
		}
		if (this.background != null) {
			Display.drawData(this.background, 0, 0);
		}
	}

	static update(objects) {
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

	static shade() {
		for (let i = 0; i < this.shadersToUpdate.length; i++) {
			this.shadersToUpdate[i].update();
		}
		this.shadersToUpdate = [];
	}

	static calcBlockCoordinates(x, y) {
		return [Math.floor(x / this.tileSize), Math.floor(y / this.tileSize)];
	}

	static getTile(x, y) {
		[x, y] = this.calcBlockCoordinates(x, y);
		if (!this.isInBounds(x, y)) {
			console.error("Out Of Bounds: Scene.getTile(" + x + ", " + y + ")");
		}
		return this.structure[y][x];
	}

	static isInBounds(x, y) {
		[x, y] = this.calcBlockCoordinates(x, y);
		return !(x < 0 || x >= this.structure[0].length || y < 0 || y >= this.structure.length);
	}

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