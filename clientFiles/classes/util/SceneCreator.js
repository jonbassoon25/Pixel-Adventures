import { GameObject } from "../gameObjects/GameObject.js";

export class SceneCreator {
	static createPlaceholderScene(width, height) {
		let output = [];
		for (let row = 0; row < width; row++) {
			output.push([]);
			for (let col = 0; col < height; col++) {
				output[row].push(new GameObject("placeholder", row, col, [[0, 0], [1, 0], [1, 1], [0, 1]]));
			}
		}
		return output;
	}
}