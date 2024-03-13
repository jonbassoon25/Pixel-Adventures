//Util imports
import { Keyboard } from "../util/Keyboard.js";
import { Scene } from "../util/Scene.js";
import { Vector } from "../util/Vector.js";

//Game Entity Imports
import { DynamicObject } from "./DynamicObject.js";

//Game Object Imports
import { ChestTile } from "../gameObjects/ChestTile.js";

//Player Class
export class Player extends DynamicObject {
	//Constructor

	/**
	@param {string} image - image to display
	@param {number} x - initial x position of player
	@param {number} y - initial y position of player
	@param {string} controlType - keys that control the player, default is wasd (up, left, down, right, attack)
	*/
	constructor(x, y, controlType = "wadfs") {
		super("placeholder", x, y, 30, 30);
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
		this.coins = 0;
		this.speed = 3;
		this.stunned = 120;
	}

	//*********************************************************************//
	//Private Methods

	#jump() {
		if (!this.isGrounded) {
			return;
		}
		this.velocity.y = -7.5;
	}

	#halt() {
		this.velocity.x = 0;
	}

	#moveLeft() {
		this.velocity.x = -this.speed;
	}

	#moveRight() {
		this.velocity.x = this.speed;
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
			this.#halt();
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

	//*********************************************************************//
	//Public Methods

	earn(quantity) {
		this.coins += quantity;
	}
	
	update() {
		super.update();
		if (this.stunned > 0) {
			this.stunned--;
			return;
		}
		this.#takeInput();
		this.#interact();
	}
}