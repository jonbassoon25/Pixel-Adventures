//Util Imports
import { Scene } from "../util/Scene.js";
import { Vector } from "../util/Vector.js";
import { VisualObject } from "../util/VisualObject.js";
import { Util } from "../util/Util.js";

//Class DynamicObject
export class DynamicObject extends VisualObject {
	//Static Variables
	
	//All currently spawned dynamic objects
	static dynamicObjects = [];

	//*********************************************************************//
	//Public Static Methods

	/** Despawns all dynamic objects */
	static clear() {
		this.dynamicObjects = [];
	}

	/** Draws all currently spawned dynamic objects */
	static drawObjects() {
		for (let i = 0; i < this.dynamicObjects.length; i++) {
			this.dynamicObjects[i].draw();
		}
	}
	
	/** Updates all currently spawned dynamic objects */
	static updateObjects() {
		for (let i = 0; i < this.dynamicObjects.length; i++) {
			this.dynamicObjects[i].update();
		}
	}
	
	//*********************************************************************//
	//Constructor
	/**
	 * @param {string} image - image to display
	 * @param {number} x - initial x value 
	 * @param {number} y - initial y value
	 */
	constructor(image, x, y, width, height, hasCollision = true) {
		super(image, x, y, width, height)
		this.image = image;
		this.velocity = new Vector(0, 0);
		this.accelerations = [];
		this.isGrounded = false;
		this.hasCollision = hasCollision;
		DynamicObject.dynamicObjects.push(this);
	}

	//*********************************************************************//
	//Public Methods
	
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
	}

	/**
	 * Carries out the collision of a dynamic object
	 */
	collide() {
		//Don't do collisions if this object doesn't have collisions
		if (!this.hasCollision) return;
		for (let i = 0; i < Scene.structure.length; i++) {
			for (let j = 0; j < Scene.structure[i].length; j++) {
				let sceneTile = Scene.structure[i][j];
				if (sceneTile.hasCollision && this.isColliding(sceneTile)) {
					//if the collision is vertical
					let startPos = [this.x - this.velocity.x, this.y - this.velocity.y];
					//What time this obj collides with the sceneTile
					//small values added/subtracted to avoid 0/0 errors
					let times = {
						"top": (sceneTile.y - sceneTile.height/2 - startPos[1] - this.height/2 + 0.0001)/this.velocity.y,
						"bottom": (sceneTile.y + sceneTile.height/2 - startPos[1] + this.height/2 - 0.0001)/this.velocity.y,
						"left": (sceneTile.x - sceneTile.width/2 - startPos[0] - this.width/2 + 0.0001)/this.velocity.x,
						"right": (sceneTile.x + sceneTile.width/2 - startPos[0] + this.width/2 - 0.0001)/this.velocity.x
					}
					for (let i = 0; i < Object.keys(times).length; i++) {
						if (Object.values(times)[i] < 0) {
							times[Object.keys(times)[i]] = 1/0;
						}
					}
					//Check to see if it hits a vertical or horizontal side first
					/* Vertical if 
					 * Min time is on top or bottom, not left or right
					 * right side of this and left side of sceneTile aren't the same
					 * left side of this and right side of sceneTile aren't the same
					 * bottom of this + gravity is less than top of sceneTile
					 * top of this and bottom of sceneTile aren't the same
					 * All other cases: Horizontal
					*/
					if ((Math.min(times["top"], times["bottom"]) <= Math.min(times["left"], times["right"]) && this.x + this.width/2 != sceneTile.x - sceneTile.width/2 && this.x - this.width/2 != sceneTile.x + sceneTile.width/2) || this.y + this.height/2 <= sceneTile.y - sceneTile.height/2 + Vector.GRAVITY.magnitude || this.y - this.height/2 == sceneTile.y + sceneTile.height/2) {
						//Vertical collision
						if (times["top"] < times["bottom"]) {
							this.y = sceneTile.y - sceneTile.height/2 - this.height/2;
							this.isGrounded = true;
						} else if (times["top"] != times["bottom"]) {
							this.y = sceneTile.y + sceneTile.height/2 + this.height/2;
						}
						this.velocity.y = 0;
					} else {
						//Horizontal collision
						if (times["left"] < times["right"]) {
							this.x = sceneTile.x - sceneTile.width/2 - this.width/2;
						} else if (times["left"] != times["right"]) {
							this.x = sceneTile.x + sceneTile.width/2 + this.width/2;
						}
						this.velocity.x = 0;
					}
				}
			}
		}
	}

	/** Deletes this object from the dynamicObjects list */
	delete() {
		DynamicObject.dynamicObjects = Util.delValue(DynamicObject.dynamicObjects, this);
	}

	/** Applies forces and moves this object */
	update() {
		this.isGrounded = false;
		this.accelerations.push(Vector.GRAVITY);
		for (let i = 0; i < this.accelerations.length; i++) {
			this.velocity.add(this.accelerations[i]);
		}
		this.accelerations = [];
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.collide();
	}
}