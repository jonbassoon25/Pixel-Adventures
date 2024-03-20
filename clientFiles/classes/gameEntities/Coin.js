//Util Imports
import { Scene } from "../util/Scene.js";

//Game Entity Imports
import { Item } from "./Item.js";

//Coin Class
export class Coin extends Item {
	//Constructor

	/**
	 * @param {number} x - inital x position of the coin
	 * @param {number} y - inital y position of the coin
	 */
	constructor(x, y) {
		super("coin", x, y, Scene.tileSize/2, Scene.tileSize/2);
		this.type = "coin";
	}
}