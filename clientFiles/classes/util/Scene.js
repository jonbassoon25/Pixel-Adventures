import { Display } from "../util/Display.js";
import { Util } from "../util/Util.js";

import { DynamicObject } from "../gameEntities/DynamicObject.js";

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
	Updates all scene objects in the scene structure
	*/
	static updateTiles() {
		if (this.structure == null) {
			return;
		}
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			for (let j = 0; j < this.structure.length; j++) {
				for (let k = 0; k < this.structure[j].length; k++) {
					if (DynamicObject.dynamicObjects[i].isColliding(this.structure[j][k])) {
						this.structure[j][k].update();
					}
				}
			}
		}
	}

	static updateShaders() {
		if (this.shaderStructure == null) {
			return;
		}
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			for (let j = 0; j < this.structure.length; j++) {
				for (let k = 0; k < this.structure[j].length; k++) {
					if (DynamicObject.dynamicObjects[i].isColliding(this.structure[j][k])) {
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

	static update() {
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			for (let j = 0; j < this.structure.length; j++) {
				//If not the top of the dynamic object is above the bottom of the first structure tile in the row and the bottom of the dynamic object is below the top of the first structure tile in the row
				if (!(DynamicObject.dynamicObjects[i].y - DynamicObject.dynamicObjects[i].height/2 < this.structure[j][0].y + this.structure[j][0].height/2 && DynamicObject.dynamicObjects[i].y + DynamicObject.dynamicObjects[i].height/2 > this.structure[j][0].y - this.structure[j][0].height/2)) {
					//The dynamic object won't collide with any tiles in that row
					continue;
				}
				for (let k = 0; k < this.structure[j].length; k++) {
					if (DynamicObject.dynamicObjects[i].isColliding(this.structure[j][k])) {
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