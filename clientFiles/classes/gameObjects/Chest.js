//Util Imports
import { Display } from "../util/Display.js";
import { Util } from "../util/Util.js";

//Basic Object Imports
import { InteractableObject } from "../basicObjects/InteractableObject.js";

//Chest Class
export class Chest extends InteractableObject {
	//Public Static Variables

	static pointsPerCoin = 10;

	//*********************************************************************//
	//Constructor

	constructor(x, y, coinRange = [8, 12]) {
		//Image, orderNum, x, y, width, height
		super("chest", 5, x, y, 40, 40);
		this.coinRange = coinRange;
		this.coinRange = coinRange;
		this.coins = Util.randInt(coinRange[0], coinRange[1]);
		this.type = "chest";
	}

	//*********************************************************************//
	//Public Methods

	/** Refills this chest with a random coin count in the coin range */
	refill() {
		this.coins = Util.randInt(this.coinRange[0], this.coinRange[1]);
	}

	/**
	 * @param {Player} - The player that is interacting with this ChestTile
	 */
	interactWith(player) {
		player.coins += this.coins;
		player.points += this.coins * Chest.pointsPerCoin;
		this.coins = 0;
	}

	/** Draws this chest */
	draw() {
		Display.draw(((this.coins == 0)? "chestOpened" : "chest"), this.x, this.y, this.width, this.height);
	}
}