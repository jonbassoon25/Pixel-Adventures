export class Scene {
	static structure = [[]];
	static tileSize = 80;
	//How many pixels have been scrolled (positive = user walking right). 
	static scrollAmount = 0; 

	static initScene(structure, tileSize = 50) {
		this.structure = structure;
		this.tileSize = tileSize;
	}

	static update() {
		for (let row = 0 ; row < this.structure.length ; row++) {
		  for (let col = 0 ; col < this.structure[row].length ; col++) {
			  this.structure[row][col].update();
			}
		}
	}
}