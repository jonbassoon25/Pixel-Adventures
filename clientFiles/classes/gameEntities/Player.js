import { Keyboard } from "../util/Keyboard.js";
//Game Entity Imports
import { PhysicsObject } from "./PhysicsObject.js";

export class Player extends PhysicsObject {
	constructor(x, y) {
		super("placeholder", x, y, 50, 50, 50)
		//Speed in px/sec
		this.speed = 400;
		//Jump speed in px/sec
		this.jumpSpeed = 300
		//Is the player on the ground
		this.isOnGround = false;
	}

	//Allows user input to change player velocity
	takeInput() {
		if (Keyboard.isKeyDown("a")) {
			this.velocityVector[0] = -this.speed;
		} else if (Keyboard.isKeyDown("d")) {
			this.velocityVector[0] = this.speed;
		} else {
			this.velocityVector[0] = 0;
		}
		if (Keyboard.isKeyDown("w") || Keyboard.isKeyDown(" ")) {
			this.velocityVector[1] = -this.jumpSpeed;
		}
	}

	update() {
		super.update();
		this.takeInput();
	}

}