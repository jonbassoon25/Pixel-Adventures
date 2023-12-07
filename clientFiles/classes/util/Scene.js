//Scene Class
export class Scene {
	//Static Variables
	
	static structure = [[]];
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
	static initScene(structure, tileSize = 50) {
		this.structure = structure;
		this.tileSize = tileSize;
	}

	/** 
	Updates all scene objects in the scene structure
	*/
	static update() {
		for (let row = 0 ; row < this.structure.length ; row++) {
		  for (let col = 0 ; col < this.structure[row].length ; col++) {
			  this.structure[row][col].update();
			}
		}
	}
}