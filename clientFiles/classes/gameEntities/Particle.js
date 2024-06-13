//Util Imports
import { Vector } from "../util/Vector.js";

//UI Object Imports

//Gamestate Imports

//Game Object Imports

//Game Entity Imports

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";

//Particle Class
export class Particle extends DynamicObject {
	//Constructor

	/**
	* @param {number} x - initial x position of the particle
	* @param {number} y - initial y position of the particle
	* @param {Vector} velocity - initial velocity of the particle
	* @param {number} lifeSpan - the lifeSpan of the particle in seconds
	*/
	constructor(type, x, y, width, height, velocity, lifeSpan, dragMultiplier = 0.9775, hasGravity = true, hasCollision = true, shade = true) {
		super(type, 4, x, y, width, height, hasCollision, shade);
		this.velocity = velocity;
		//Correct for expected fps
		this.lifeSpan = lifeSpan * 60;

		this.visualWidth = this.width * 1.1;
		this.visualHeight = this.height * 1.1;
		
		this.dragMultiplier = dragMultiplier;
		this.hasGravity = hasGravity;
	}


	//*********************************************************************//
	//Private Methods
	

	//*********************************************************************//
	//Public Methods

	update() {
		if (!this.hasGravity) {
			this.velocity.add(Vector.GRAVITY, -1);
		} else this.velocity.x *= this.dragMultiplier;
		super.update();
		this.lifeSpan--;
		if (this.lifeSpan <= 0) {
			this.delete();
		}
	}

	//*********************************************************************//
	//Getters


	//*********************************************************************//
	//Setters


}