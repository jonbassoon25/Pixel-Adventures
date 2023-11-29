//Util Imports
import { Display } from "./Display.js";

export class HitboxManager {
	//Premade hitbox definitions, start left corner and rotate clockwise for point definitions
	static squareHitbox = [[0, 0], [1, 0], [1, 1], [0, 1]];
	static triangleHitbox = [[0.5, 0], [1, 1], [0, 1]];

	//Are the hitboxes of the two objects intersecting to produce a collision
	static collision(obj1, obj2) {
		return true;
	}

	//Returns the linear equations of all sides of the object hitbox, starting from upper left and going clockwise
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

	static getTileEquations(tile) {
		
	}

	//Amends any object overlapping in collisions by moving both objects apart
	static * amendIntersect(physicsObj1, physicsObj2) {
		yield physicsObj1;
		yield physicsObj2;
	}

	//Amends any object overlapping in collisions of physics and static objects with a buffer of x px
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