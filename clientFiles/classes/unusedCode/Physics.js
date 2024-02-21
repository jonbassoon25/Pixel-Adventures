//Util Imports
import { Util } from "./Util.js";

//Class Physics
export class Physics {
	//Public Static Variables
	static physicsObjects = [];

	//*********************************************************************//
	//Private Static Methods

	static #areColliding(obj1, obj2) {
		return (
			obj1.isEnclosing(obj2.upperLeft())
			|| obj1.isEnclosing(obj2.upperRight())
			|| obj1.isEnclosing(obj2.lowerRight())
			|| obj1.isEnclosing(obj2.lowerLeft())
		)
	}
	
	static #findCollisions(frameValues) {
		let collisions = [];
		for (let i = 0; i < frameValues.length; i++) {
			for (let j = i + 1; j < frameValues.length; j++) {
				if (this.#areColliding(frameValues[i], frameValues[j])) {
					collisions.push([frameValues[i], frameValues[j]]);
				}
			}
		}
		return collisions;
	}

	static #multiCollisionCheck(collisions) {
		for (let mainIndex = 0; mainIndex < collisions.length; mainIndex++) {
			let mainCollision = collisions[mainIndex];
			for (let i = 0; i < mainCollision.length; i++) {
				for (let checkIndex = mainIndex + 1; checkIndex < collisions.length; checkIndex++) {
					if (collisions[checkIndex].includes(mainCollision[i]) && checkIndex != mainIndex) {
						collisions[mainIndex] = Util.combine(mainCollision, collisions[checkIndex]);
						if (mainIndex < checkIndex) {
							i--;
						}
						continue;
					}
				}
			}
		}
		return collisions;
	}

	static #resolveCollision(collision) {
		if (collision.length == 2) {
			this.#resolveSingleCollision();
			return;
		} else if (collision.length < 2) {
			console.warn("Collision of length < 2. Aborting collision");
			return;
		}
		
		for (let i = 0; i < collision.length - 1; i++) {
			if (!areColliding(collision[i], collision[i + 1])) {
				continue;
			}
			//Resolve collisions with forces based on how many objects are on each side of the other objects
		}
	}

	static #resolveSingleCollision(collision) {
		
	}

	static #resolveCollisions(collisions) {
		for (let i = 0; i < collisions.length; i++) {
			this.#resolveCollision(collisions[i]);
		}
	}

	static #simulateNextFrame() {
		for (let i = 0; i < this.physicsObjects.length; i++) {
			this.physicsObjects[i].update();
		}
	}

	static #zeroPhysicsObjects() {
		for (let i = 0; i < this.physicsObjects.length; i++) {
			this.physicsObjects[i].x = 0;
			this.physicsObjects[i].y = 0;
			this.physicsObjects[i].velocity.scaleTo(0);
		}
	}

	


	//*********************************************************************//
	//Public Static Methods

	static update() {
		//Update physicsObject values for next frame
		this.#simulateNextFrame();
		let frameValues = Util.clone(this.physicsObjects); //No methods in frameValues
		//Zero velocity and position values in physicsObjects
		this.#zeroPhysicsObjects();
		//Find collisions between objects
		let collisions = this.#findCollisions(frameValues);
		collisions = this.#multiCollisionCheck(collisions);

		for (let i = 0; i < collisions.length; i++) {
			this.#resolveCollisions(collisions);
		}
	}
}