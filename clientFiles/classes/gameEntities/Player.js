//Util Imports
import { Keyboard } from "../util/Keyboard.js";
import { Vector } from "../util/Vector.js";

//Game Entity Imports
import { PhysicsObject } from "./PhysicsObject.js";

//Player Class
export class Player extends PhysicsObject {
	//Static Variables
	
	//Horizontal speed in px/sec
	static SPEED = 400;
	//Jump v0y in px/sec
	static jumpSpeed = 300;
	//Movement Vectors applied to the player on attempted movement
	static rightMovementVector = new Vector("Player Right", Player.SPEED, 0);
	static leftMovementVector = new Vector("Player Left", -Player.SPEED, 0);
	static jumpMovementVector = new Vector("player Jump", 0, Player.jumpSpeed);

	//*********************************************************************//
	//Constructor
	
	/** 
  	@param {number} x - Inital x position of the player
	@param {number} y - Inital y position of the player
  	*/
	constructor(x, y) {
		super("placeholder", x, y, 50, 50, 50)
		//Speed in px/sec
		this.speed = 400;
		//Jump speed in px/sec
		this.jumpSpeed = 300
		//Is the player on the ground
		this.isOnGround = false;

		//Abilities
		this.abilities = {};
		this.strengths = {};
		this.weaknesses = {};
	}

	//*********************************************************************//
	//Private Methods

	//Takes the player input to move the player object
	#takeInput() {
		this.velocity.componatizedVector = [0, this.velocity.y];
		if (Keyboard.isKeyDown("a")) {
			this.velocity.add(Player.leftMovementVector);
		} else if (Keyboard.isKeyDown("d")) {
			this.velocity.add(Player.rightMovementVector);
		}
		if (Keyboard.isKeyDown("w") || Keyboard.isKeyDown(" ")) {
			this.velocity.add(Player.jumpMovementVector);
		}
	}

	//*********************************************************************//
	//Public Methods

 	/** 
  	Updates the player and takes user input
  	*/
	update() {
		super.update();
		this.#takeInput();
	}
}