//Util Imports
import { Util } from "./Util.js";
import { HitboxManager } from "./HitboxManager.js";

//UI Object Imports
import { PauseMenu } from "../UIObjects/PauseMenu.js";

//Expects 60 updates per second
export class Physics {
	//Acceleration due to gravity in px/sec^2
	static g = 600;
	//Max falling speed in px/sec
	static maxFallingSpeed = 900;
	//Max lateral speed in px/sec
	static maxLateralSpeed = 300;
	//Amount of converted energy in a collison, 1 is 100%. Do not set <= 50% (won't error, but just don't)
	static collisionEnergyTransfer = 0.9;

	//Array of all known PhysicsObjects
	static physicsObjects = [];

	//Changes the values of the physics object to represent it at this time
	static simulate(physicsObj) {
		//If the game is paused, don't update the object's position
		if (PauseMenu.paused) {
			return physicsObj;
		}
		//Update the y velocity vector of the physics object for gravity
		physicsObj.velocityVector[1] += this.g / 60;
		//Constrain the x velocity vector of the physics object within max values
		if (physicsObj.velocityVector[0] > this.maxLateralSpeed) {
			physicsObj.velocityVector[0] = this.maxLateralSpeed;
		} else if (Math.abs(physicsObj.velocityVector[0]) > this.maxLateralSpeed) {
			physicsObj.velocityVector[0] = -this.maxLateralSpeed;
		}
		//Constrain the y velocity vector of the physics object for terminal speed
		if (physicsObj.velocityVector[1] > this.maxFallingSpeed) {
			physicsObj.velocityVector[1] = this.maxFallingSpeed;
		} else if (Math.abs(physicsObj.velocityVector[1]) > this.maxFallingSpeed) {
			physicsObj.velocityVector[1] = -this.maxFallingSpeed;
		}
		physicsObj.absX += physicsObj.velocityVector[0] / 60;
		physicsObj.absY += physicsObj.velocityVector[1] / 60;
		return physicsObj;
	}
	//Add a force to an object based on a velocity (in pixels/second) and a direction (in degrees)
	static addForce(physicsObj, velocityVector) {
		//Convert the velocity and direction to component form (x velocity, y velocity) and apply it to the object
		physicsObj.velocityVector[0] += velocityVector[0];
		physicsObj.velocityVector[1] += velocityVector[1];
		return physicsObj;
	}
	
	//Simulate the 2d collision of two physics objects
	static * collide(physicsObj1, physicsObj2, collisionEnergyTransfer = this.collisionEnergyTransfer) {
		if (physicsObj1.mass <= 0 || physicsObj2.mass <= 0) {
			console.error("Mass <= 0 in Collision:\n\t" + physicsObj1.name + " (" + physicsObj1.mass + ")\t" + physicsObj2.name + " (" + physicsObj2.mass + ")\n Aborting Collision");
			yield physicsObj1;
			yield physicsObj2;
			return;
		}
		if (collisionEnergyTransfer <= 0.5) {
			console.warn("Collision energy transfer (" + collisionEnergyTransfer * 100 + "%) < 50%\nPhysics object collision:\n\t" + physicsObj1.name + " - " + physicsObj2.name);
		}
		//Calculate the collision for the x velocity vector
		let temp = physicsObj1.velocityVector[0];
		
		physicsObj1.velocityVector[0] = (
				physicsObj2.velocityVector[0]
				* collisionEnergyTransfer
				* physicsObj2.mass
				) 
			/ physicsObj1.mass;
		
		physicsObj2.velocityVector[0] = (
				(temp * collisionEnergyTransfer * physicsObj1.mass) 
				/ physicsObj2.mass
			) 
			+ (
				physicsObj2.velocityVector[0] * (1 - collisionEnergyTransfer)
			);
		
		physicsObj1.velocityVector[0] += (temp * (1 - collisionEnergyTransfer));

		
		//Calculate the collision for the y velocity vector
		temp = physicsObj1.velocityVector[1];
		physicsObj1.velocityVector[1] = (
				physicsObj2.velocityVector[1]
				* collisionEnergyTransfer
				* physicsObj2.mass
				) 
			/ physicsObj1.mass;

		physicsObj2.velocityVector[1] = (
				(temp * collisionEnergyTransfer * physicsObj1.mass) 
				/ physicsObj2.mass
			) 
			+ (
				physicsObj2.velocityVector[1] * (1 - collisionEnergyTransfer)
			);

		physicsObj1.velocityVector[1] += (temp * (1 - collisionEnergyTransfer));

		//Return physics objects' velocites rounded to the 5th decimal place
		physicsObj1.velocityVector[0] = Util.round(physicsObj1.velocityVector[0], 5);
		physicsObj1.velocityVector[1] = Util.round(physicsObj1.velocityVector[1], 5);
		physicsObj2.velocityVector[0] = Util.round(physicsObj2.velocityVector[0], 5);
		physicsObj2.velocityVector[1] = Util.round(physicsObj2.velocityVector[1], 5);
		yield physicsObj1
		yield physicsObj2
	}

	//Do physicsObj1 and physicsObj2 have the possibily of colliding (obj2 can be a physics object or static object)
	static isCollision(physicsObj1, obj2) {
		let xCollision = false;
		let yCollision = false;
		if ((physicsObj1.x < obj2.x && physicsObj1.x + physicsObj1.width >= obj2.x) || (physicsObj1.x >= obj2.x && physicsObj1.x < obj2.x + obj2.width)) {
			xCollision = true;
		}
		if ((physicsObj1.y < obj2.y && physicsObj1.y + physicsObj1.height >= obj2.y) || (physicsObj1.y >= obj2.y && physicsObj1.y < obj2.y + obj2.height)) {
			yCollision = true;
		}
		return xCollision && yCollision;
	}

	//Check all physics objects for collisions with one another
	static #checkForCollisions() {
		//Loop through all physics objects
		for (let obj1Index = 0; obj1Index < this.physicsObjects.length; obj1Index++) {
			//Loop through all other physics objects
			for (let obj2Index = 0; obj2Index < this.physicsObjects.length; obj2Index++) {
				let physicsObj1 = this.physicsObjects[obj1Index];
				let physicsObj2 = this.physicsObjects[obj2Index];
				if (obj1Index == obj2Index) {
					continue;
				}
				//Check if the physics objects don't have the possibility of colliding
				if (!this.isCollision(physicsObj1, physicsObj2)) {
					continue;
				}
				//Check if the physics objects are colliding
				if (HitboxManager.collision(physicsObj1, physicsObj2)) {
					console.log("collision");
					//Make sure the objects aren't intersecting
					//[this.physicsObjects[obj1Index], this.physicsObjects[obj2Index]] = HitboxManager.amendIntersect(physicsObj1, physicsObj2);
					//Calculate the collision
					[this.physicsObjects[obj1Index], this.physicsObjects[obj2Index]] = [...this.collide(physicsObj1, physicsObj2)];
				}
			}
		}
	}

	//Simulate the 2d collision of a physics object and an immovable object
	static staticCollide(physicsObj, horizontalImpact, collisionEnergyTransfer = this.collisionEnergyTransfer) {
		if (horizontalImpact) {
			physicsObj.velocityVector[0] *= -collisionEnergyTransfer;
		} else {
			physicsObj.velocityVector[1] *= -collisionEnergyTransfer;
		}
		return physicsObj;
	}

	//Updates all physics objects
	static #updatePhysicsObjects() {
		for (let i = 0; i < this.physicsObjects.length; i++) {
			this.physicsObjects[i].update();
		}
	}

	//Updates all physics objects
	static update() {
		if (PauseMenu.paused) {
			return;
		}
		this.#updatePhysicsObjects();
		this.#checkForCollisions();
		
	}
	
}