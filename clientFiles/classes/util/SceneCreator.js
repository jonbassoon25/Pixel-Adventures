import { SceneTile } from "../gameObjects/SceneTile.js";
import { ShaderTile } from "../gameObjects/ShaderTile.js";
import { LightTile } from "../gameObjects/LightTile.js";

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
		let structure = [];
		
		for (let row = 0; row < height - 1; row++) {
			structure.push([]);
			for (let col = 0; col < width; col++) {
				structure[col].push(new SceneTile("none", col, row));
			}
		}
		
		structure.push([]);
		for (let col = 0; col < width; col++) {
			structure[height - 1].push(new SceneTile("placeholder", col, height - 1, true));
		}
		
		return structure;
	}

	static createTestScene(width, height) {
		let structure = [];

		for (let row = 0; row < height; row++) {
			structure.push([]);
			for (let col = 0; col < width; col++) {
				if (row == col) {
					structure[row].push(new SceneTile("placeholder", col, row, true));
				} else {
					structure[row].push(new SceneTile("none", col, row));
				}
			}
		}
		structure[0][0] = new LightTile("none", 0, 0, 10, 30);
		structure[Math.round(height/2)][Math.floor(width/2)] = new LightTile("none", Math.round(width/2), Math.round(height/2), 20, ((width > height)? width : height) / 2);
		return structure;
	}

	static createEmptyScene(width, height) {
		let structure = [];

		for (let row = 0; row < height; row++) {
			structure.push([]);
			for (let col = 0; col < width; col++) {
				structure[row].push(new SceneTile("none", col, row));
			}
		}

		return structure;
	}

	/** Creates an empty shader scene with the specified with and height (in scene tile blocks) */
	static createShaderStructure(width, height) {
		let structure = [];
			
		for (let row = 0; row < height * 2; row++) {
			structure.push([]);
			for (let col = 0; col < width * 2; col++) {
				structure[row].push(new ShaderTile(col, row));
			}
		}

		return structure;
	}

	static createEmptyShadedScene(width, height) {
		return [this.createEmptyScene(width, height), this.createShaderStructure(width, height)];
	}
}