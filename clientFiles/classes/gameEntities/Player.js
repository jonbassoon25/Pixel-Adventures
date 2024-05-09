//Util imports
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";
import { Scene } from "../util/Scene.js";

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
import { Level } from "../util/Level.js";

//Player Class
export class Player extends DynamicObject {
	static upgradesBought = {"playerOneWeapon": 0, "playerOneHealth": 0, "playerOneRegen": 0, "playerOneSpeed": 0, "playerOneJump": 0, "playerTwoWeapon": 0, "playerTwoHealth": 0, "playerTwoRegen": 0, "playerTwoSpeed": 0, "playerTwoJump": 0};
	static retainedValues = {"p1Score": 0, "p2Score": 0, "p1Coins": 0, "p2Coins": 0};
	//Constructor
	/**
	 * @param {string} image - image to display
	 * @param {number} x - initial x position of player
	 * @param {number} y - initial y position of player
	 * @param {string} color - can be "red" or "blue" any others are converted to red
	 * @param {string} controlType - keys that control the player, default is wadfs (up, left, right, attack, interact)
	 */
	constructor(x, y, color, controlType = "wadfs") {
		super("none", 0, x, y, 20, 52);
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
		this.coins = Player.retainedValues["p" + ((color == "red")? "1": "2") + "Coins"];
		this.speed = 3 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Speed"] * 0.25;
		this.stunned = 0;
		this.deaths = 0;
		this.maxHealth = 100 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Health"] * 25;
		this.health = this.maxHealth;
		this.regen = 0.1 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Regen"] * 0.02;
		this.isDead = false;
		this.visualWidth = 65;
		this.visualHeight = 80;
		this.weapon = new Sword(this, 20);
		this.weapon.damage += Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Weapon"] * 5;
		this.grave = null;
		this.points = Player.retainedValues["p" + ((color == "red")? "1": "2") + "Score"];
		this.jumpSpeed = 7.5 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Jump"] * 0.25;
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
			this.points += chest.coins * 10;
			this.coins += chest.coins;
			chest.coins = 0;
			Scene.flash();
			console.log("Got " + (this.coins - startCoins) + " Coins");
		}

		if (Scene.structure[row][col] instanceof Door) {
			AudioPlayer.play("door");
			Level.level++;
		}

		if (Scene.structure[row][col] instanceof Grave) {
			this.coins += Scene.structure[row][col].coins;
			Scene.structure[row][col].revive();
			Scene.flash();
		}
	}

	#spawnGrave() {
		let col;
		let row;
		[col, row] = Scene.calcBlockCoordinates(this.x, this.y);
		let nextRow = row;
		//Find collision tile below the grave col
		for (let i = row; i < Scene.structure.length; i++) {
			if (Scene.structure[i][col].hasCollision) {
				nextRow = i - 1;
				break;
			}
		}
		let potentialTile = Scene.structure[nextRow][col];
		
		for (let i = 2; !(potentialTile.type == "SceneTile") || potentialTile.hasCollision; i++) {
			//Find another potentialTile
			potentialTile = null;
			let nextCol = 0;
			//Check left, right, left, right, left, ...
			if (i % 2 == 0 && col - i/2 > 0) {
				nextCol = col - i/2;
			} else if (col + (i - 1)/2 < Scene.structure[row].length) {
				nextCol = col + (i - 1)/2;
			}
			if (Scene.structure[row][nextCol].hasCollision) {
				//continue;
			}
			let nextRow = 0;
			//Find collision tile below the grave col
			for (let i = row; i < Scene.structure.length; i++) {
				if (Scene.structure[i][nextCol].hasCollision) {
					nextRow = i - 1;
					break;
				}
			}
			potentialTile = Scene.structure[nextRow][nextCol];
		}
		Scene.structure[potentialTile.row][potentialTile.col] = new Grave(this, potentialTile.col, potentialTile.row, potentialTile.image, potentialTile.hasVines);
		Scene.flash();
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
					this.points += 10;
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
		AudioPlayer.play("die");
		//Create grave that other players can use coins to respawn this player from
		this.#spawnGrave();
		if (this.points >= 1000) {
			this.points -= 1000;
		} else {
			this.points = 0;
		}
	}

	/** Draws the player with animations */
	draw() {
		if (!this.isDead) {
			this.weapon.update(this.facingLeft, this.isGrounded);
			if (!this.isGrounded) {
				Display.draw(this.color + "PlayerJump", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			} else if (this.velocity.x == 0 || (Display.frames % 20) < 10) {
				Display.draw(this.color + "Player", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
			} else {
				Display.draw(this.color + "PlayerWalk", this.visualX, this.visualY, 60, 60, true, this.facingLeft);
				AudioPlayer.play("step");
			}
			//Draw player healthbar
			let totalWidth = this.width * 2;
			Display.draw("shader_05", this.x, this.y - this.height/2 - 7, totalWidth, 10);
			let redWidth = this.width * 2 * (this.health / this.maxHealth);
			Display.draw("redTile", this.x - (totalWidth - redWidth)/2, this.y - this.height/2 - 7, redWidth, 10);
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
		if (this.health <= 0 && !this.isDead) {
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
		this.speed += 0.25;
	}

	upgradeJump() {
		this.jumpSpeed += 0.25;
	}

	static resetData() {
		Player.upgradesBought = {"playerOneWeapon": 0, "playerOneHealth": 0, "playerOneRegen": 0, "playerOneSpeed": 0, "playerOneJump": 0, "playerTwoWeapon": 0, "playerTwoHealth": 0, "playerTwoRegen": 0, "playerTwoSpeed": 0, "playerTwoJump": 0};
		Player.retainedValues = {"p1Score": 0, "p2Score": 0, "p1Coins": 0, "p2Coins": 0};
	}
}