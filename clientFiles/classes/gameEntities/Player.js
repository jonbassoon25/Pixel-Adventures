//Util imports
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";
import { Scene } from "../util/Scene.js";
import { Util } from "../util/Util.js";

//Game Entity Imports
import { DynamicObject } from "./DynamicObject.js";
import { Slime } from "./Slime.js";
import { Item } from "./Item.js";

//Game Object Imports
import { ChestTile } from "../gameObjects/ChestTile.js";
import { Door } from "../gameObjects/Door.js";
import { Sword } from "../gameObjects/Sword.js";
import { Vector } from "../util/Vector.js";
import { Grave } from "../gameObjects/Grave.js";

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
	constructor(x, y, color, controlType = "wadfs") {
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
		this.maxHealth = 100;
		this.regen = 0.1;
		this.isDead = false;
		this.visualWidth = 80;
		this.visualHeight = 80;
		this.weapon = new Sword(this, 20);
		this.grave = null;
		this.facingLeft = false;
		this.jumpSpeed = 7.5;
	}

	//*********************************************************************//
	//Private Methods

	#jump() {
		if (!this.isGrounded) {
			return;
		}
		this.weapon.jumpAnim();
		this.velocity.y = -this.jumpSpeed;
	}
	#haltX() {
		this.velocity.x = 0;
	}
	#haltY() {
		this.velocity.y = 0;
	}
	#moveLeft() {
		this.facingLeft = true;
		this.velocity.x = -this.speed;
		//this.health-=5;
	}
	#moveRight() {
		this.facingLeft = false;
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
		if (Keyboard.isKeyDown(this.keybinds["attack"])) {
			this.weapon.attack();
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

		if (Scene.structure[row][col] instanceof Door) {
			Scene.level++;
		}

		if (Scene.structure[row][col] instanceof Grave) {
			this.coins += Scene.structure[row][col].coins;
			Scene.structure[row][col].revive();
		}
	}

	#spawnGrave() {
		let col;
		let row;
		[col, row] = Scene.calcBlockCoordinates(this.x, this.y);
		let prevTile = Scene.getTile(this.x, this.y);
		for (let i = 2; !(prevTile.type == "SceneTile") || prevTile.hasCollision; i++) {
			//Find another prevTile
			prevTile = null;
			let nextCol = 0;
			//Check left, right, left, right, left, ...
			if (i % 2 == 0 && col - i/2 > 0) {
				nextCol = col - i/2;
			} else if (col + (i - 1)/2 < Scene.structure[row].length) {
				nextCol = col + (i - 1)/2;
			}
			if (Scene.structure[row][nextCol].hasCollision) {
				continue;
			}
			let nextRow = 0;
			//Find collision tile below the grave col
			for (let i = row; i < Scene.structure.length; i++) {
				if (Scene.structure[i][nextCol].hasCollision) {
					nextRow = i - 1;
				}
			}
			prevTile = Scene.structure[nextRow][nextCol];
		}
		Scene.structure[row][col] = new Grave(this, prevTile.col, prevTile.row, prevTile.image, prevTile.hasVines);
	}

	#takeDamage() {
		if (this.stunned > 0) {
			return;
		}
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			let other = DynamicObject.dynamicObjects[i];
			if (other instanceof Slime) {
				if (this.isColliding(other)) {
					this.health -= other.damage;
					this.stunned = 30;
					/*
					@Zac
					Push vectors to accelerations. Not simpleVector arrays
					Error was this.velocity.y = NAN because it called Vector.add([1, -1])
					Correct is Vector.add(Vector)
					Terinary operator is used to have direction to the knockback
					*/
					this.accelerations.push(new Vector([(this.x > other.x)? 2 : -2, -4]));
					return;
				}
			}
		}
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

	//*********************************************************************//
	//Public Methods

	/** Kills the player */
	die() {
		this.isDead = true;
		this.hasCollision = false;
		this.health = this.maxHealth;
		//Create grave that other players can use coins to respawn this player from
		this.#spawnGrave();
	}

	/** Draws the player with animations */
	draw() {
		if (!this.isDead) {
			this.weapon.update(this.facingLeft, this.isGrounded);
			if (!this.isGrounded) {
				Display.draw(this.color + "PlayerJump", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			} else if (this.velocity.x == 0) {
				Display.draw(this.color + "Player", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			} else if ((Display.frames % 20) < 10) {
				Display.draw(this.color + "Player", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			} else {
				Display.draw(this.color + "PlayerWalk", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			}
			//Draw player healthbar
			let totalWidth = this.width * (this.maxHealth / 100);
			Display.draw("shader_05", this.x, this.y - this.height/2 - 5, totalWidth, 5);
			let redWidth = this.width * (this.maxHealth / 100) * (this.health / this.maxHealth);
			Display.draw("redTile", this.x - (totalWidth - redWidth)/2, this.y - this.height/2 - 5, redWidth, 5);
		} else {
			if ((Display.frames % 20) < 10) {
				Display.draw(this.color + "Ghost", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			} else {
				Display.draw(this.color + "GhostAlt", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			}
		}
	}
	/** Updates the Player */
	update() {
		super.update();
		
		//Keep the player in bounds
		if (this.x > 1920) {
			this.x = 1920;
		} else if (this.x < 0) {
			this.x = 0;
		}
		if (this.y > 1080) {
			this.y = 1080;
		} else if (this.y < 0) {
			this.y = 0;
		}
		//If the player is dead, take flying inputs
		if (this.isDead) {
			this.#takeGhostInput();
			//Counter the force of gravity on this player
			this.velocity.add(Vector.GRAVITY, -1);
			return;
		}
		this.#takeDamage();
		if (this.health <= 0) {
			this.die();
		}
		if (this.health < this.maxHealth) this.health += this.regen;
		if (this.stunned > 0) {
			this.stunned--;
			return;
		}
		this.#takeInput();
		this.#interact();
		this.#collectItems();
	}
	
	upgradeHealth() {
		if (this.maxHealth < 300) this.maxHealth += 25;
		console.log("Max health increased to " + this.maxHealth);
	}
	
	upgradeRegen() {
		this.regen += 0.02;
	}

	upgradeWeapon() {
		this.weapon.upgrade();
	}

	upgradeSpeed() {
		this.speed += 0.5;
	}

	upgradeJump() {
		this.jumpSpeed += 0.5;
	}
}