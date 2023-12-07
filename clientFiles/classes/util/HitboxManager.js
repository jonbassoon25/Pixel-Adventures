//Util Imports
import { Display } from "./Display.js";
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

		//Calculate if object 1 should be the moving object
		if (Vector.calcVector(physicsObj1.velocityVector) >= Vector.calcVector(physicsObj2.velocityVector)) {
			movingObject = physicsObj1;
			otherObject = physicsObj2;
			obj1Moved = true;
		}
		
		//Calulate if the collision should be represented as horizontal (middle of moving object is lower than top of other object and higher than the bottom)
		let isHorizontalCollision = movingObject.absY >= otherObject.absY - otherObject.height/2 && movingObject.absY <= otherObject.absY + otherObject.height/2;

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
	static amendStaticIntersect(physicsObj, staticObj, horizontalImpact, buffer = 0) {
		//If the collison was horizontal
		if (horizontalImpact) {
			//If the physics obj is to the left of the static obj
			if (physicsObj.absX <= staticObj.absX) {
				//Move the physicsObj to the left
				physicsObj.absX = staticObj.absX - staticObj.absWidth/2 - physicsObj.absWidth/2 - buffer;
			//If the physics obj is to the right of the static obj
			} else if (physicsObj.absX >= staticObj.absX) {
				//Move the physicsObj to the right
				physicsObj.absX = staticObj.absX + staticObj.absWidth/2 + physicsObj.absWidth/2 + buffer;
			}
		} else {
			//If the physics obj is above the static obj
			if (physicsObj.absY <= staticObj.absY) {
				//Move the physicsObj up
				physicsObj.absY = staticObj.absY - staticObj.absHeight/2 - physicsObj.absHeight/2 - buffer;
			//If the physics obj is below the static obj
			} else if (physicsObj.y >= staticObj.y) {
				//Move the physicsObj down
				physicsObj.absY = staticObj.absY + staticObj.absHeight/2 + physicsObj.absHeight/2 + buffer;
			}
		}
		let trash;
		[physicsObj.x, physicsObj.y, trash, trash] = [...Display.calcElementDimensions(physicsObj.absX, physicsObj.absY, 0, 0)];
		return physicsObj;
	}
}