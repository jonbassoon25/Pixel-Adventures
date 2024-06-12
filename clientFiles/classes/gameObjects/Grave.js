//Basic Object Imports
import { InteractableObject } from "../basicObjects/InteractableObject.js";

//Grave Class
export class Grave extends InteractableObject {
	//Constructor

	/**
	 * @param {Player} player - player this grave is referencing
	 * @param {number} col - column of this grave
	 * @param {number} row - row of this grave
	 */
	constructor(player, x, y) {
		super(player.color + "Grave", 4, x, y, 40, 40);
		this.player = player;
		this.coins = player.coins;
		this.type = "grave";
		player.coins = 0;
	}

	//*********************************************************************//
	//Public Methods

	/** Revives the player and spawns them at this grave*/
	revive() {
		this.player.isDead = false;
		this.player.health = 100;
		this.player.hasCollision = true;
		this.player.x = this.x;
		this.player.y = this.y + this.height/2 - this.player.height/2;
		this.player.velocity.multiply(0);
		this.player.setAnimation("idle");
		this.delete();
	}

	/**
	 * @param {Player} - The player that is interacting with this InteractableObject
	 */
	interactWith(player) {
		player.coins += this.coins;
		this.revive();
	}
}