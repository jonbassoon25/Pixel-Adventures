//Basic Object Imports
import { InteractableObject } from "../basicObjects/InteractableObject.js";
import { Vector } from "../util/Vector.js";

//Grave Class
export class Grave extends InteractableObject {
	//Constructor

	/**
	 * @param {Player} player - player this grave is referencing
	 * @param {number} x - x of this grave
	 * @param {number} y - y of this grave
	 */
	constructor(player, x, y, velocity, accelerations) {
		super(player.color + "Grave", 4, x, y, 40, 40);
		this.player = player;
		this.coins = player.coins;
		player.coins = 0;
		this.velocity = velocity;
		this.accelerations = accelerations;
		this.velocity = new Vector([this.velocity.x, -6])
		this.setAnimation("flower");
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
		this.setAnimation("despawn");
	}

	/**
	 * @param {Player} - The player that is interacting with this InteractableObject
	 */
	interactWith(player) {
		if (this.currentAnimation != "idle") return;
		player.coins += this.coins;
		this.revive();
	}

	update() {
		super.update();
		if (this.currentAnimation == "flower" && this.velocity.y == 0) {
			this.velocity.multiply(0);
			this.setAnimation("spawn");
		}
		if (this.currentAnimation == "despawn" && this.currentFrame >= 45) {
			this.delete();
		}
	}
}