//Scene Class
export class Scene {
	//Static Variables
	
	static structure = null;
	static shaderStructure = null;
	static tileSize = 40;
	//How many pixels have been scrolled (positive = user walking right). 
	static scrollAmount = 0;

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
	}

	/** 
	Updates all scene objects in the scene structure
	*/
	static updateTiles() {
		if (this.structure == null) {
			return;
		}
		for (let col = 0 ; col < this.structure.length ; col++) {
		  for (let row = 0 ; row < this.structure[col].length ; row++) {
			  this.structure[col][row].update();
			}
		}
	}

	static updateShaders() {
		if (this.shaderStructure == null) {
			return;
		}
		for (let col = 0; col < this.shaderStructure.length; col++) {
			for (let row = 0; row < this.shaderStructure[col].length; row++) {
				this.shaderStructure[col][row].update();
			}
		}
	}

	static update() {
		this.updateTiles();
		this.updateShaders();
	}
}