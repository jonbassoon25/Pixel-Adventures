//Util Imports
import { Display } from "../util/Display.js";
import { Physics } from "../util/Physics.js";
import { Util } from "../util/Util.js";
import { Vector } from "../util/Vector.js";

//Class DynamicObject
export class DynamicObject {
	//Constructor
	/**
	@param {string} image - image to display
	@param {number} x - initial x value 
	@param {number} y - initial y value
	*/
	constructor(image, x, y, width, height, mass = 1) {
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.mass = 0;
		this.velocity = new Vector([0, 0]);
		this.forces = [];
	}

	//*********************************************************************//
	//Private Methods

	#copyForces(forceArray) {
		newArray = [];
		for (let i = 0; i < forceArray.length; i++) {
			newArray.push(new Vector(forceArray[i].componatizedVector));
		}
		return newArray;
	}

	//*********************************************************************//
	//Public Methods

	/** Applys this object's forces to its velocity */
	applyForces() {
		for (let i = 0; i < forces.length; i++) {
			velocity.add(forces[i]);
		}
	}
	
	/** 
	Copies values from another object
	@param {DynamicObject} otherObject - object to copy values from
	*/
	assignValues(otherObject) {
		this.image = otherObject.image;
		this.x = otherObject.x;
		this.y = otherObject.y;
		this.width = otherObject.width;
		this.height = otherObject.height;
		this.mass = otherObject.mass;
		this.velocity = new Velocity(otherObject.velocity.componatizedVector);
		this.forces = this.#copyForces(otherObject.forces);
	}

	/** Deletes this object's references */
	delete() {
		Physics.physicsObjects = Util.delValue(Physics.physicsObjects, this);
	}

	/** 
	@returns {boolean} is the point inside of this object
	*/
	isEnclosing(point){
		return point >= x && point <= x + width && point >= y && point <= y + height;
	}

	/** Moves the object based on its velocity */
	move() {
		x += velocity.x;
		y += velocity.y;
	}

	/** Draws this object to the display */
	draw() {
		Display.draw(this.image, this.x, this.y, this.width, this.height);
	}

	/** Applies forces, moves, and draws this object */
	update() {
		this.applyForces();
		this.move();
		this.draw();
	}

	//*********************************************************************//
	//Getter Methods

	center() {
		return [this.x, this.y];
	}

	topLeft() {
		return [this.x - this.width/2, this.y - this.height/2];
	}

	topRight() {
		return [this.x + this.width/2, this.y - this.height/2];
	}

	bottomLeft() {
		return [this.x - this.width/2, this.y + this.height/2];
	}

	bottemRight() {
		return [this.x + this.width/2, this.y + this.height/2];
	}
}