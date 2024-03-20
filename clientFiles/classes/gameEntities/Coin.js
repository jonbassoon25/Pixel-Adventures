//Util Imports
import { Scene } from "../util/Scene.js";

//Game Entity Imports
import { Item } from "./Item.js";

//Class Coin
export class Coin extends Item {
	//Constructor

	constructor(x, y) {
		super("coin", x, y, Scene.tileSize/2, Scene.tileSize/2);
		this.type = "coin";
	}
}