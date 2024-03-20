//Util Imports
import { Display } from "../util/Display.js";
import { Util } from "../util/Util.js";

//Game Object Imports
import { SceneTile } from "./SceneTile.js";

//ChestTile Class
export class ChestTile extends SceneTile {
	//Constructor
	/**
	 * @param {String} background - background of the ChestTile
	 * @param {number} col - column the tile is at
	 * @param {number} row - row the tile is at
	 * @param {boolean} hasVines - does the background have vines
	 * @param {number[]} coinRange - amount of coins that can be in the chest [min, max]
	 */
	constructor(background, col, row, hasVines, coinRange = [0, 10]) {
		super(background, col, row, false, hasVines);

		this.coinRange = coinRange;

		this.coins = Util.randInt(coinRange[0], coinRange[1]);

		this.isOpen = false

		this.type = "ChestTile";
	}

	//*********************************************************************//
	//Public Methods

	/** Updates and Draws this ChestTile */
	update() {
		super.update();
		Display.draw(((this.isOpen)? "placeholder" : "placeholder"), this.x, this.y, this.width/1.2, this.height/1.2)
	}
}