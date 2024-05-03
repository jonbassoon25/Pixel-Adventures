//Util Imports
import { Display } from "../util/Display.js";
import { Util } from "../util/Util.js";

//Game Object Imports
import { SceneTile } from "./SceneTile.js";

//ChestTile Class
export class ChestTile extends SceneTile {
	static chestTiles = [];

	static clear() {
		this.chestTiles = [];
	}
	
	//Constructor
	/**
	 * @param {String} background - background of the ChestTile
	 * @param {number} col - column the tile is at
	 * @param {number} row - row the tile is at
	 * @param {boolean} hasVines - does the background have vines
	 * @param {number[]} coinRange - amount of coins that can be in the chest [min, max]
	 */
	constructor(background, col, row, hasVines, coinRange = [5, 10]) {
		super(background, col, row, false, hasVines);

		this.coinRange = coinRange;

		this.coins = Util.randInt(coinRange[0], coinRange[1]);

		this.type = "ChestTile";
		
		this.visualWidth = 35;

		ChestTile.chestTiles.push(this);
	}

	//*********************************************************************//
	//Public Methods

	draw() {}

	/** Updates and Draws this ChestTile */
	update() {
		super.update();
		console.log("updated");
		Display.draw(((this.coins == 0)? "chestOpened" : "chest"), this.x, this.y, this.width, this.height)
	}
}