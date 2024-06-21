//Util imports
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";
import { Scene } from "../util/Scene.js";
import { Mouse } from "../util/Mouse.js";

//Game Entity Imports
import { Slime } from "./Slime.js";
import { Item } from "./Item.js";
import { Healthbar } from "./Healthbar.js";

//Game Object Imports
import { Sword } from "../gameObjects/Sword.js";
import { Mace } from "../gameObjects/Mace.js";
import { Vector } from "../util/Vector.js";
import { Grave } from "../gameObjects/Grave.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { InteractableObject } from "../basicObjects/InteractableObject.js";

//Gamestate Imports
import { Settings } from "../gamestates/Settings.js";

//Player Class
export class Player extends DynamicObject {
	//Static Variables
	
	static upgradesBought = {
		"playerOneWeapon": 0, 
		"playerOneHealth": 0, 
		"playerOneRegen": 0, 
		"playerOneSpeed": 0, 
		"playerOneJump": 0, 
		"playerTwoWeapon": 0, 
		"playerTwoHealth": 0, 
		"playerTwoRegen": 0, 
		"playerTwoSpeed": 0, 
		"playerTwoJump": 0
	};
	
	static retainedValues = {
		"p1Score": 0, 
		"p2Score": 0, 
		"p1Coins": 0, 
		"p2Coins": 0,
		"p1Weapon": Sword,
		"p2Weapon": Sword
	};

	//*********************************************************************//
	//Constructor
	
	/**
	 * @param {string} image - image to display
	 * @param {number} x - initial x position of player
	 * @param {number} y - initial y position of player
	 * @param {string} color - can be "red" or "blue" any others are converted to red
	 * @param {string} controlType - keys that control the player, default is wadfs (up, left, right, attack, interact)
	 */
	constructor(x, y, color, controlType = "wadfs") {
		super(color + "Player", 1, x, y, 20, 52);
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
		this.maxSpeed = 3 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Speed"] * 0.25;
		this.speed = this.maxSpeed;
		this.stunned = 0;
		this.deaths = 0;
		this.maxHealth = 100 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Health"] * 25;
		this.health = this.maxHealth;
		this.regen = 0.1 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Regen"] * 0.02;
		this.isDead = false;
		this.visualWidth = 65;
		this.visualHeight = 65;
		if (color == "red") this.weapon = new Player.retainedValues["p1Weapon"](this); else this.weapon = new Player.retainedValues["p2Weapon"](this);
		this.weapon.damage += Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Weapon"] * 5;
		this.grave = null;
		this.points = Player.retainedValues["p" + ((color == "red")? "1": "2") + "Score"];
		this.jumpSpeed = 7.5 + Player.upgradesBought["player" + ((color == "red")? "One": "Two") + "Jump"] * 0.25;
		this.healthbar = new Healthbar(this);
	}

	//*********************************************************************//
	//Private Methods

	#jump() {
		if (!this.isGrounded) {
			return;
		}
		this.setAnimation("jump");
		this.weapon.setAnimation("jump");
		this.velocity.y = -this.jumpSpeed;
	}
	#haltX() {
		this.velocity.x = 0;
	}
	#haltY() {
		this.velocity.y = 0;
	}
	#moveLeft() {
		this.flipped = true;
		this.velocity.x = -this.speed;
		//if (this.weapon.type == "playerMace")
	}
	#moveRight() {
		this.flipped = false;
		this.velocity.x = this.speed;
	}
	#moveUp() {
		this.velocity.y = -this.speed;
	}
	#moveDown() {
		this.velocity.y = this.speed;
	}

	#takeInput() {
		if (Keyboard.isKeyDown(this.keybinds["up"]) || Keyboard.isKeyPressed(this.keybinds["up"]) ) {
			this.#jump();
		}
		if (Keyboard.isKeyDown(this.keybinds["attack"])) {
			if (this.weapon instanceof Mace) {
				this.weapon.charge();
			} else {
				this.weapon.attack();
			}
		}
		if (Keyboard.isKeyReleased(this.keybinds["attack"])) {
			if (this.weapon instanceof Mace) {
				this.weapon.attack();
			}
		}
		if (Keyboard.isKeyDown(this.keybinds["left"])) {
			this.#moveLeft();
		} else if (Keyboard.isKeyDown(this.keybinds["right"])) {
			this.#moveRight();
		} else {
			this.#haltX();
		}
		if (Mouse.button1Released && Settings.debug) {
			[this.x, this.y] = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)];
			this.y -= this.height/2;
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

		let objList = InteractableObject.interactableObjects;
		for (let i = 0; i < objList.length; i++) {
			if (this.isColliding(objList[i])) {
				objList[i].interactWith(this);
			}
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
		new Grave(this, ...Scene.inverseCalcBlockCoordinates(potentialTile.col, potentialTile.row));
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
		this.setAnimation("ghost");
		AudioPlayer.play("die");
		//Create grave that other players can use coins to respawn this player from
		this.#spawnGrave();
		if (this.points >= 1000) {
			this.points -= 1000;
		} else {
			this.points = 0;
		}
	}

	/** Draws the player */
	draw() {
		super.draw();
		//Draw player healthbar
		/*if (!this.isDead) {
			let totalWidth = this.width * 2;
			Display.draw("shader_05", this.x, this.y - this.height/2 - 7, totalWidth, 10);
			let redWidth = this.width * 2 * (this.health / this.maxHealth);
			Display.draw("redTile", this.x - (totalWidth - redWidth)/2, this.y - this.height/2 - 7, redWidth, 10);
		}*/
	}
	

	
	/** Updates the Player */
	update(onlyUpdateSuper = false) {
		if (onlyUpdateSuper) {
			super.update(true);
			return;
		}
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

			if (this.currentAnimation != "ghost") {
				this.currentAnimation = "ghost";
			}
			return;
		}
		
		//Update the player's weapon 
		this.weapon.update(this.flipped, this.isGrounded && this.stunned == 0);
		
		//Set the player's animation to jump if the player isn't grounded
		if (!this.isGrounded) {
			if (this.weapon instanceof Mace && this.weapon.currentAnimation == "attack" && this.weapon.currentFrame < 16) {
				//Allow the mace to finish its attack
			} else {
				this.setAnimation("jump");
				this.weapon.setAnimation("jump");
			}
		}
		
		this.#takeDamage();
		if (this.health <= 0 && !this.isDead) {
			this.die();
		}
		if (this.health < this.maxHealth) this.health += this.regen;
		if (this.stunned > 0) {
			if (this.weapon instanceof Mace && this.weapon.currentAnimation == "attack" && this.weapon.currentFrame < 16) {
				//Allow the mace to finish its attack
			} else {
				this.setAnimation("jump");
				this.weapon.setAnimation("jump");
			}
			this.stunned--;
			return;
		}
		if (this.isGrounded && this.currentAnimation == "jump") {
			this.setAnimation("idle");
		}
		//Make the player walk if the x velocity isn't 0 and the player isn't jumping. Always makes the player finish their step when they aren't supposed to be moving unless they player jumps
		if (this.velocity.x != 0 && this.currentAnimation == "idle") {
			this.setAnimation("walk");
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
		console.log("data reset");
		Player.upgradesBought = {"playerOneWeapon": 0, "playerOneHealth": 0, "playerOneRegen": 0, "playerOneSpeed": 0, "playerOneJump": 0, "playerTwoWeapon": 0, "playerTwoHealth": 0, "playerTwoRegen": 0, "playerTwoSpeed": 0, "playerTwoJump": 0};
		Player.retainedValues = {"p1Score": 0, "p2Score": 0, "p1Coins": 0, "p2Coins": 0, "p1Weapon": Sword, "p2Weapon": Sword};
	}
}