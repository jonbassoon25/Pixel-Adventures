//Util Imports
import { Vector } from "../util/Vector.js";
import { Scene } from "../util/Scene.js";
import { Util } from "../util/Util.js";

//UI Object Imports

//Gamestate Imports

//Game Object Imports

//Game Entity Imports

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";

//Particle Class
export class Particle extends DynamicObject {
	//Static Variables
	static particles = [];
	//Constructor

	/**
	* @param {number} x - initial x position of the particle
	* @param {number} y - initial y position of the particle
	* @param {Vector} velocity - initial velocity of the particle
	* @param {number} lifeSpan - the lifeSpan of the particle in seconds
	*/
	constructor(type, x, y, width, height, velocity, lifeSpan, dragMultiplier = 0.9775, hasGravity = true, hasCollision = true, shade = true) {
		super(type, 4, x, y, width, height, hasCollision, shade);
		//Attempted to delete particles upon attempted generation inside walls. Didn't work
		/*if (this.hasCollision) {
			for (let i = 0; i < Scene.structure.length; i++) {
				for (let j = 0; j < Scene.structure[i].length; j++) {
					let sceneTile = Scene.structure[i][j];
					if (sceneTile.hasCollision && sceneTile.isFullyEnclosing(this)) {
						console.log("found");
						delete this;
						return;
					}
				}
			}
		}*/
		this.velocity = velocity;
		//Correct for expected fps
		this.lifeSpan = lifeSpan * 60;

		this.visualWidth = this.width * 1.1;
		this.visualHeight = this.height * 1.1;
		
		this.dragMultiplier = dragMultiplier;
		this.hasGravity = hasGravity;
		Particle.particles.push(this);
	}


	//*********************************************************************//
	//Private Methods
	

	//*********************************************************************//
	//Public Methods
	
	static clear() {
		for (let i = 0; i < Particle.particles.length; i++) {
			Particle.particles[i].delete();
		}
		Particle.particles = [];
	}
	
	delete() {
		super.delete();
		Particle.particles = Util.delValue(Particle.particles, this);
	}
	
	update() {
		if (!this.hasGravity) {
			this.velocity.add(Vector.GRAVITY, -1);
		} 
		this.velocity.x *= this.dragMultiplier;
		this.velocity.y *= this.dragMultiplier;
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