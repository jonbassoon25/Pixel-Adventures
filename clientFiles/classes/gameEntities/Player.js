//Util imports
import { Keyboard } from "../util/Keyboard.js";

import { DynamicObject } from "./DynamicObject.js";

//Player Class
export class Player extends DynamicObject {
	//Constructor

	/**
	@param {string} image - image to display
	@param {number} x - initial x position of player
	@param {number} y - initial y position of player
	*/
	constructor(x, y) {
		super("placeholder", x, y, 30, 30);
	}

	//*********************************************************************//
	//Private Methods

	#jump() {
		if (!this.isGrounded) {
			return;
		}
		this.velocity.y = -5;
	}

	#halt() {
		this.velocity.x = 0;
	}

	#moveLeft() {
		this.velocity.x = -3;
	}

	#moveRight() {
		this.velocity.x = 3;
	}

	#takeInput() {
		if (Keyboard.isKeyDown("w")) {
			this.#jump();
		}
		if (Keyboard.isKeyDown("a")) {
			this.#moveLeft();
		} else if (Keyboard.isKeyDown("d")) {
			this.#moveRight();
		} else {
			this.#halt();
		}
	}

	//*********************************************************************//
	//Public Methods

	update() {
		super.update();
		this.#takeInput();
	}
}