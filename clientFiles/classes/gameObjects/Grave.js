//Util Imports
import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";
import { Util } from "../util/Util.js";

//Game Object Imports
import { SceneTile } from "./SceneTile.js";

//Grave Class
export class Grave extends SceneTile {
	static graves = [];

	
	//Constructor

	/**
	 * @param {Player} player - player this grave is referencing
	 * @param {number} col - column of this grave
	 * @param {number} row - row of this grave
	 */
	constructor(player, col, row, background, hasVines) {
		super(background, col, row, false, hasVines);
		this.player = player;
		this.coins = player.coins;
		this.type = "grave";
		player.coins = 0;
		Grave.graves.push(this);
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
		this.delete();
	}

	delete() {
		Scene.structure[this.row][this.col] = new SceneTile(this.image, this.col, this.row, false, this.hasVines);
		Grave.graves = Util.delValue(Grave.graves, this);
	}

	/** Updates and Draws this tile */
	update() {
		super.update();
		Display.draw(this.player.color + "Grave", this.x, this.y, this.width, this.height);
	}
}