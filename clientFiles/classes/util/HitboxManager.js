//Util Imports
import { Vector } from "./Vector.js";

//HitboxManager Class
export class HitboxManager {
	//Static Variables
	
	//Premade hitbox definitions, start left corner and rotate clockwise for point definitions
	static squareHitbox = [[0, 0], [1, 0], [1, 1], [0, 1]];
	static triangleHitbox = [[0.5, 0], [1, 1], [0, 1]];


	//*********************************************************************//
	//Public Static Methods

	/** 
	Checks to see if the given hitbox points are valid
	@param {Number[][]} hitboxPoints - Array of hitbox points
	@returns {Number[][]} hitboxPoints - Checked hitbox points
	*/
	static assignHitboxPoints(hitboxPoints) {
		if (hitboxPoints.length < 2) {
			console.warn("Too few hitboxPoints in hitbox\n\tConverting hitbox to standard box");
			return this.squareHitbox;
		} else {
			return hitboxPoints;
		}
	}
	/** 
 	@param {PhysicsObject} physicsObject1 - Main object that is being checked for collision}
  	@param {PhysicsObject} physicsObject2 - Other object that could be colliding with the main object
 	@returns {boolean} True if the two objects are intersecting and there should be a collision
 	*/
	static physicsCollision(physicsObj1, physicsObj2) {
		return true;
	}

	/** 
 	@param {PhysicsObject} physicsObj - Object that is being checked for collision
  	@param {SceneTile} staticObj - Object that the physicsObj could be colliding with
 	@returns {boolean} True if the two objects are intersecting and there should be a collision
 	*/
	static staticCollision(physicsObj, staticObj) {
		return true;
	}

	//Returns the linear equations of all sides of the object hitbox, starting from upper left and going clockwise
	/** 
 	@param {Object} object - Object that's hitbox is being calculated
  	@returns {Array} Array of dictionaries which represent all sides of the object hitbox, with equations
 	*/
	static getEquations(object) {
		let output = [];
		for (let pointIndex = 0; pointIndex < object.hitboxPoints.length - 1; pointIndex++) {
			let origin = [
				object.x + object.width * object.hitboxPoints[pointIndex][0],
				object.y + object.height * object.hitboxPoints[pointIndex][1]
			];
			let deltaY = 
				(object.y + object.height * object.hitboxPoints[pointIndex][1])
				- (object.y + object.height * object.hitboxPoints[pointIndex + 1][1])
			;
			
			output.push(
				{
					"origin": origin,
					"slope": (
						deltaY
						/ ((object.x + object.width * object.hitboxPoints[pointIndex][0])
						- (object.x + object.width * object.hitboxPoints[pointIndex + 1][0]))
					)
				}
			)
		}
		//Do the line of the last element to the first element
		let origin = [
			object.x + object.width * object.hitboxPoints[object.hitboxPoints.length - 1][0],
			object.y + object.height * object.hitboxPoints[object.hitboxPoints.length - 1][1]
		];
		let deltaY = 
			(object.y + object.height * object.hitboxPoints[object.hitboxPoints.length - 1][1])
			- (object.y + object.height * object.hitboxPoints[0][1])
		;


		output.push(
			{
				"origin": origin,
				"slope": (
					deltaY
					/ ((object.x + object.width * object.hitboxPoints[object.hitboxPoints.length - 1][0])
					- (object.x + object.width * object.hitboxPoints[0][0]))
				)
			}
		)
		return output;
	}

	/** 
	Amends any object overlapping in collisions by moving the faster moving object out of the slower object
 	@param {PhysicsObject} physicsObj1 - 1st object in the collision
  	@param {PhysicsObject} physicsObj2 - 2nd object in the collision
 	@returns {PhysicsObject[]} [physicsObj1, physicsObj2] - updated objects after collision
  	*/
	static * amendIntersect(physicsObj1, physicsObj2) {
		let obj1Moved = false;
		let movingObject = physicsObj2;
		let otherObject = physicsObj1;

		//Calculate if object 1 should be the adjusted object
		if (physicsObj1.velocity.magnitude >= physicsObj2.velocity.magnitude) {
			movingObject = physicsObj1;
			otherObject = physicsObj2;
			obj1Moved = true;
		}
		//Calulate if the collision should be represented as horizontal (middle of moving object is lower than top of other object and higher than the bottom) and (right side of moving object is to the left of the middle of the other object or the left side of the moving object is to the right of the middle of the other object)
		let isHorizontalCollision = 
			(
				movingObject.y >= otherObject.y - otherObject.height/2 && 
				 movingObject.y <= otherObject.y + otherObject.height/2
			) && (
				movingObject.x + movingObject.width/2 <= otherObject.x || 
				movingObject.x - movingObject.width/2 >= otherObject.x
			);

		//Use the amendStaticIntersect method to move the moving object
		movingObject = this.amendStaticIntersect(movingObject, otherObject, isHorizontalCollision);

		//If obj1 was the moving object
		if (obj1Moved) {
			yield movingObject;
			yield otherObject;
		} else {
		//If it wasn't
			yield otherObject;
			yield movingObject;
		}
	}

	/** 
	Amends any object overlapping in collisions of physics and static objects
 	@param {PhysicsObject} physicsObj - Object that is being checked for collision
  	@param {SceneTile} staticObj - Object that the physicsObj could be colliding with
   	@param {boolean} horizontalImpact - True if the collision is horizontal, false if vertical
	@param {number} buffer - Amount of pixels to buffer the collision by
 	@returns {PhysicsObject} Updated physicsObj after collision
  	*/
	static amendStaticIntersect(physicsObj, otherObj, isHorizontalImpact) {
		let slope;
		let relVelocity;

		//If the other object has a velocity
		if (otherObj.velocity !== undefined) {
			//Create new relative velocity
			relVelocity = new Vector(physicsObj.velocity.componatizedVector);
			//Subtract the other object's velocity
			relVelocity.add(otherObj.velocity, -1);
		} else {
			//Set the relative velocity to the physicsObj's velocity
			relVelocity = physicsObj.velocity;
		}

		
		try {
			//Create the slope based on the faster object's velocity (if the faster object isn't moving it will equate to 0/0, which errors)
			slope = relVelocity.y / relVelocity.x
			//console.log("Slope: " + slope);
		} catch {
			//Neither object is moving
			console.warn("0/0 error, using standard amendIntersect");
			return decrepitAmendIntersect(physicsObj, otherObj, isHorizontalImpact);
		}

		
		if (isHorizontalImpact) {
			let newX;
			//If the physics object is on the left
			if (physicsObj.x < otherObj.x) {
				//Calculate the new x value that is on the left of the otherObj
				newX = otherObj.x - otherObj.width/2 - physicsObj.width/2;
			} else { //The physics object is on the right
				//Calculate the new x value that is on the right of the otherObj
				newX = otherObj.x + otherObj.width/2 + physicsObj.width/2;
			}
			//Calculate the new y and assign the newX to x
			//y = m(x - x1) + y1
			if (Math.abs(slope) <= 1000) {
				physicsObj.y = slope * (newX - physicsObj.x) + physicsObj.y;
			//If the slope is too big
			} else if (physicsObj.y < otherObj.y) {
				physicsObj.y = otherObj.y - otherObj.height/2 - physicsObj.height/2;
			} else {
				physicsObj.y = otherObj.y + otherObj.height/2 + physicsObj.height/2;
			}
			
			physicsObj.x = newX;
			//console.log("Moving to " + [physicsObj.x, physicsObj.y] + " Horizontal");
		} else { //The impact was vertical
			let newY;
			//If the physics object is on the top
			if (physicsObj.y < otherObj.y) {
				//Caculate the new y value that is above the otherObj
				newY = otherObj.y - otherObj.height/2 - physicsObj.height/2;
			} else { //The physics object is on the bottom
				//Calculate the new y value that is below the otherObj
				newY = otherObj.y + otherObj.height/2 + physicsObj.height/2;
			}
			//Calculate the new x and assign the newY to y
			//y = 1/m (x - y1) + x1
			physicsObj.x = 1/slope * (newY - physicsObj.y) + physicsObj.x;
			physicsObj.y = newY;
			//console.log("Moving to " + [physicsObj.x, physicsObj.y] + " Vertical");
		}
		
		return physicsObj;
	}

	static decrepitAmendIntersect(physicsObj, staticObj, horizontalImpact, buffer = 0) {
		//If the collison was horizontal
		if (horizontalImpact) {
			//If the physics obj is to the left of the static obj
			if (physicsObj.x <= staticObj.x) {
				//Move the physicsObj to the left
				physicsObj.x = staticObj.x - staticObj.width/2 - physicsObj.width/2 - buffer;
			//If the physics obj is to the right of the static obj
			} else if (physicsObj.x >= staticObj.x) {
				//Move the physicsObj to the right
				physicsObj.x = staticObj.x + staticObj.width/2 + physicsObj.width/2 + buffer;
			}
		} else {
			//If the physics obj is above the static obj
			if (physicsObj.y <= staticObj.y) {
				//Move the physicsObj up
				physicsObj.y = staticObj.y - staticObj.height/2 - physicsObj.height/2 - buffer;
			//If the physics obj is below the static obj
			} else if (physicsObj.y > staticObj.y) {
				//Move the physicsObj down
				physicsObj.y = staticObj.y + staticObj.height/2 + physicsObj.height/2 + buffer;
			}
		}
		return physicsObj;
	}

	
}