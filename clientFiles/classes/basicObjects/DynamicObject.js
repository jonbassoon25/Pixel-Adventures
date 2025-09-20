//Util Imports
import { Scene } from "../util/Scene.js";
import { Util } from "../util/Util.js";
import { Vector } from "../util/Vector.js";

//Game Entity Imports
import { MovingTileSet } from "../gameEntities/MovingTileSet.js";

//Basic Object Imports
import { AnimatedObject } from "../basicObjects/AnimatedObject.js";

//Class DynamicObject
export class DynamicObject extends AnimatedObject {
	//Static Variables
	
	//All currently spawned dynamic objects
	static dynamicObjects = [];

	//*********************************************************************//
	//Public Static Methods

	/** Despawns all dynamic objects */
	static clear() {
		for (let i = this.dynamicObjects.length - 1; i >= 0; i--) {
			this.dynamicObjects[i].delete();
		}
	}

	/** Draws all currently spawned dynamic objects */
	static drawObjects() {
		for (let i = 0; i < this.dynamicObjects.length; i++) {
			this.dynamicObjects[i].draw();
			//Display.draw("visualDimensions", this.dynamicObjects[i].visualX, this.dynamicObjects[i].visualY, this.dynamicObjects[i].visualWidth, this.dynamicObjects[i].visualHeight);
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
	 * @param {string} type - type of the dynamic object
	 * @param {number} x - initial x value 
	 * @param {number} y - initial y value
	 */
	constructor(type, orderNum, x, y, width, height, hasCollision = true, shade = true) {
		super(type, orderNum, x, y, width, height, shade);
		this.velocity = new Vector(0, 0);
		this.accelerations = [];
		this.isGrounded = false;
		this.hasCollision = hasCollision;
		this.flipped = false;
		this.knockbackMultiplier = 1;
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
		//Check for collision with scene tiles
		for (let i = 0; i < Scene.structure.length; i++) {
			for (let j = 0; j < Scene.structure[i].length; j++) {
				let sceneTile = Scene.structure[i][j];
				if (sceneTile.hasCollision && this.isColliding(sceneTile)) {
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
					 * bottom of this + gravity is above top of sceneTile
					 * top of this and bottom of sceneTile aren't the same
					 * All other cases: Horizontal
					*/
					//Will this collide with the top/bottom sides of the sceneTile before collding with the left/right sides?
					let check1 = (Math.min(times["top"], times["bottom"]) <= Math.min(times["left"], times["right"]));
					//Is this not exactly beside the sceneTile on the right?
					let check2 = (this.x + this.width/2 != sceneTile.x - sceneTile.width/2);
					//Is this not exactly beside the sceneTile on the left?
					let check3 = (this.x - this.width/2 != sceneTile.x + sceneTile.width/2);
					//Prevents horizontal collisions while travelling horizontally across sceneTiles
					let check4 = !check1 && (this.y + this.height/2 <= sceneTile.y - sceneTile.height/2 + Vector.GRAVITY.magnitude);
					//Top of this and bottom of sceneTile aren't the same
					let check5 = (this.y - this.height/2 == sceneTile.y + sceneTile.height/2);
					if ((check1 && check2 && check3) || check4 || check5) {
						//Vertical collision
						if (times["top"] < times["bottom"]) {
							this.y = sceneTile.y - sceneTile.height/2 - this.height/2;
							this.isGrounded = true;
						} else if (times["top"] != times["bottom"]) {
							this.y = sceneTile.y + sceneTile.height/2 + this.height/2;
						}
						this.velocity.y = 0;
						/*
						if (this.color == "blue") {
							if (!(check1 && check2 && check3) && check4) console.log([check1, check2, check3, check4]);
						};
						*/
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

		//Handle collision with moving tile sets
		for (let i = 0; i < MovingTileSet.movingTileSets.length; i++) {
			let tileSet = MovingTileSet.movingTileSets[i];
			if (this.isColliding(tileSet, true, false)) {
				let startPos = [this.x - this.velocity.x, this.y - this.velocity.y];
				//What time this obj collides with the sceneTile
				//small values added/subtracted to avoid 0/0 errors
				let times = {
					"top": Math.abs(tileSet.realY - tileSet.realHeight/2 - startPos[1] - this.height/2 + 0.0001)/Math.abs(((tileSet.direction == "up" || true)? -tileSet.currentVelocity[1] : 0) + this.velocity.y),
					"bottom": Math.abs(tileSet.realY + tileSet.realHeight/2 - startPos[1] + this.height/2 - 0.0001)/Math.abs(((tileSet.direction == "down" || true)? -tileSet.currentVelocity[1] : 0) + this.velocity.y),
					"left": Math.abs(tileSet.realX - tileSet.realWidth/2 - startPos[0] - this.width/2 + 0.0001)/Math.abs(((tileSet.direction == "left" || true)? -tileSet.currentVelocity[0] : 0) + this.velocity.x),
					"right": Math.abs(tileSet.realX + tileSet.realWidth/2 - startPos[0] + this.width/2 - 0.0001)/Math.abs(((tileSet.direction == "right" || true)? -tileSet.currentVelocity[0] : 0) + this.velocity.x)
				}
				//Check to see if it hits a vertical or horizontal side first
				/* Vertical if 
				 * Min time is on top or bottom, not left or right
				 * right side of this and left side of tileSet aren't the same
				 * left side of this and right side of tileSet aren't the same
				 * bottom of this + gravity is above top of tileSet
				 * top of this and bottom of tileSet aren't the same
				 * All other cases: Horizontal
				*/
				//Will this collide with the top/bottom sides of the tileSet before collding with the left/right sides?
				let check1 = (Math.min(times["top"], times["bottom"]) <= Math.min(times["left"], times["right"]));
				//Is this not exactly beside the tileSet on the right?
				let check2 = (this.x + this.width/2 != tileSet.realX - tileSet.realWidth/2);
				//Is this not exactly beside the tileSet on the left?
				let check3 = (this.x - this.width/2 != tileSet.realX + tileSet.realWidth/2);
				//Prevents horizontal collisions while travelling horizontally across tileSets
				let check4 = !check1 && (this.y + this.height/2 <= tileSet.realY - tileSet.realHeight/2 + Vector.GRAVITY.magnitude);
				//Top of this and bottom of tileSet aren't the same
				let check5 = (this.y - this.height/2 == tileSet.realY + tileSet.realHeight/2);
				if ((check1 && check2 && check3) || check4 || check5) {
					//Vertical collision
					if (times["top"] < times["bottom"]) {
						this.y = tileSet.realY - tileSet.realHeight/2 - this.height/2;
						this.isGrounded = true;
					} else if (times["top"] != times["bottom"]) {
						this.y = tileSet.realY + tileSet.realHeight/2 + this.height/2;
					}
					this.velocity.y = 0;
					/*
					if (this.color == "blue") {
						if (!(check1 && check2 && check3) && check4) console.log([check1, check2, check3, check4]);
					};
					*/
				} else {
					//Horizontal collision
					if (times["left"] < times["right"]) {
						this.x = tileSet.realX - tileSet.realWidth/2 - this.width/2;
					} else if (times["left"] != times["right"]) {
						this.x = tileSet.realX + tileSet.realWidth/2 + this.width/2;
					}
					this.velocity.x = 0;
				}
			}
		}
	}

	/** Deletes this object from the dynamicObjects list */
	delete() {
		super.delete();
		DynamicObject.dynamicObjects = Util.delValue(DynamicObject.dynamicObjects, this);
	}

	takeKnockback(weapon) {
		this.accelerations.push(new Vector([weapon.knockback.x * this.knockbackMultiplier * ((weapon.parent.x < this.x)? 1 : -1), weapon.knockback.y * this.knockbackMultiplier]));
	}

	/** Applies forces and moves this object */
	update(onlyUpdateSuper = false) {
		if (onlyUpdateSuper) {
			super.update(false);
			return;
		}
		super.update();
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