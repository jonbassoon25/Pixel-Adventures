//Game Object Imports
import { SceneTile } from "./SceneTile.js";

export class PlatformTile extends SceneTile {
	//Constructor
	
	/** 
  	@param {number} x - The x position of the tile on the grid
	@param {number} y - The y position of the tile on the grid
 	*/
	constructor(x, y) {
		super("placeholder", x, y, SceneTile.squareHitbox);
	}
}