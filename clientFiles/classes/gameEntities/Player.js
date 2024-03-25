//Util imports
import { Keyboard } from "../util/Keyboard.js";
import { Scene } from "../util/Scene.js";

//Game Entity Imports
import { DynamicObject } from "./DynamicObject.js";
import { Item } from "./Item.js";

//Game Object Imports
import { ChestTile } from "../gameObjects/ChestTile.js";
import { Display } from "../util/Display.js";

//Player Class
export class Player extends DynamicObject {
	//Constructor

	/**
	 * @param {string} image - image to display
	 * @param {number} x - initial x position of player
	 * @param {number} y - initial y position of player
	 * @param {string} color - can be "red" or "blue" any others are converted to red
	 * @param {string} controlType - keys that control the player, default is wadfs (up, left, right, attack, interact)
	 */
	constructor(x, y, color, controlType = "wadfs", maxDeaths = -1) {
		super("none", x, y, 20, 52);
		if (controlType.length < 5) {
			controlType = "wadfs";
		}
		this.keybinds = {
			"up": controlType[0],
			"left": controlType[1],
			"right": controlType[2],
			"attack": controlType[3],
			"interact": controlType[4]
		}
		this.color = color;
		this.coins = 0;
		this.speed = 3;
		this.stunned = 0;
		this.deaths = 0;
		this.health = 100;
		this.maxDeaths = maxDeaths;
		this.isDead = false;
		this.visualWidth = 60;
		this.visualHeight = 60;
		this.weapon = new Sword();
	}

	//*********************************************************************//
	//Private Methods

	#jump() {
		if (!this.isGrounded) {
			return;
		}
		this.velocity.y = -7.5;
	}
	#haltX() {
		this.velocity.x = 0;
	}
	#haltY() {
		this.velocity.y = 0;
	}
	#moveLeft() {
		this.velocity.x = -this.speed;
	}
	#moveRight() {
		this.velocity.x = this.speed;
	}
	#moveUp() {
		this.velocity.y = -this.speed;
	}
	#moveDown() {
		this.velocity.y = this.speed;
	}

	#takeInput() {
		if (Keyboard.isKeyDown(this.keybinds["up"])) {
			this.#jump();
		}
		if (Keyboard.isKeyDown(this.keybinds["left"])) {
			this.#moveLeft();
		} else if (Keyboard.isKeyDown(this.keybinds["right"])) {
			this.#moveRight();
		} else {
			this.#haltX();
		}
	}

	#takeGhostInput() {
		if (Keyboard.isKeyDown(this.keybinds["up"])) {
			this.#moveUp();
		} else if (Keyboard.isKeyDown(this.keybinds["interact"])) {
			this.#moveDown();
		} else {
			this.#haltY();
		}
		if (Keyboard.isKeyDown(this.keybinds["left"])) {
			this.#moveLeft();
		} else if (Keyboard.isKeyDown(this.keybinds["right"])) {
			this.#moveRight();
		} else {
			this.#haltX();
		}
	}

	#interact() {
		if (!Keyboard.isKeyPressed(this.keybinds["interact"])) {
			return;
		}
		let col = Math.floor(this.x / Scene.tileSize);
		let row = Math.floor(this.y / Scene.tileSize);

		if (row < 0 || row > Scene.structure.length || col < 0 || col > Scene.structure[0].length) {
			return;
		}
		
		if (Scene.structure[row][col] instanceof ChestTile) {
			let startCoins = this.coins;
			let chest = Scene.structure[row][col];
			this.coins += chest.coins;
			chest.coins = 0;
			console.log("Got " + (this.coins - startCoins) + " Coins");
		}
	}

	#spawnGrave() {
		
	}

	#collectItems() {
		for (let i = 0; i < Item.items.length; i++) {
			let item = Item.items[i];
			if (this.isColliding(item)) {
				if (item.type == "coin") {
					this.coins++;
					item.delete();
				}
			}
		}
	}

	#attack() {
		if ()
	}

	//*********************************************************************//
	//Public Methods

	/** Kills the player */
	die() {
		if (++this.deaths > this.maxDeaths && this.maxDeaths >= 0) {
			this.isDead = true;
			this.hasCollision = false;
			this.image = "placeholder"; //Change to ghost image
			console.log("player died");
			//Create grave that other players can use coins to respawn this player from
			this.#spawnGrave();
		}
	}

	/** Draws the player with animations */
	draw() {
		if (!this.isDead) {
			if (!this.isGrounded) {
				Display.draw(this.color + "PlayerJump", this.visualX, this.visualY, this.visualWidth, this.visualHeight);
			} else if (this.velocity.x == 0) {
				Display.draw(this.color + "Player", this.visualX, this.visualY, this.visualWidth, this.visualHeight);
			} else if ((Display.frames % 40) < 20) {
				Display.draw(this.color + "Player", this.visualX, this.visualY, this.visualWidth, this.visualHeight);
			} else {
				Display.draw(this.color + "PlayerWalk", this.visualX, this.visualY, this.visualWidth, this.visualHeight);
			}
		} else {
			if ((Display.frames % 20) < 10) {
				Display.draw(this.color + "Ghost", this.visualX, this.visualY, this.visualWidth, this.visualHeight);
			} else {
				Display.draw(this.color + "GhostAlt", this.visualX, this.visualY, this.visualWidth, this.visualHeight);
			}
		}
	}

	/** Updates the Player */
	update() {
		super.update();
		//If the player is dead, take flying inputs
		if (this.isDead) {
			this.#takeGhostInput();
			return;
		}
		if (this.stunned > 0) {
			this.stunned--;
			return;
		}
		this.#takeInput();
		this.#interact();
		this.#collectItems();
	}
}