import { SceneTile } from "../gameObjects/SceneTile.js";

//SceneCreator Class
export class SceneCreator {
	//Public Static Methods

	/** 
	Creates a basic placeholder scene
	@param {number} width - The width of the scene in tiles
	@param {number} height - The height of the scene in tiles
	@returns {SceneTile[][]} The new scene
	*/
	static createPlaceholderScene(width, height) {
		let output = [];
		for (let col = 0; col < height - 1; col++) {
			output.push([]);
			for (let row = 0; row < width; row++) {
				output[col].push(new SceneTile("none", row, col, [[0, 0], [1, 0], [1, 1], [0, 1]]));
			}
		}
		output.push([]);
		for (let row = 0; row < width; row++) {
			output[height - 1].push(new SceneTile("placeholder", row, height - 1, [[0, 0], [1, 0], [1, 1], [0, 1]]));
		}
		
		return output;
	}
}