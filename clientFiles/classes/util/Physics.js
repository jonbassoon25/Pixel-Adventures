//Util Imports
import { Scene } from "./Scene.js";
import { Vector } from "./Vector.js";
import { Util } from "./Util.js";

//UI Object Imports
import { DynamicUIObject } from "../UIObjects/DynamicUIObject.js";
import { PauseMenu } from "../UIObjects/PauseMenu.js";
import { HitboxManager } from "./HitboxManager.js";

//Physics Class
export class Physics {
	/** Amount of converted energy in a collision, 1 is 100% */
	static collisionEnergyTransfer = 0.9;

	/** Gravitational acceleration (px/sec^2) */
	static gravity = new Vector("Gravity", [0, 600]);

	/** Maximum calculations per frame for Physics.update() */
	static maxCalculations = 100;
	
	/** Maximum falling speed in px/sec */
	//Allows for max speed of 20px / frame
	static maxFallingSpeed = 1200;

	/** Maximum lateral movement speed in px/sec */
	static maxLateralSpeed = 300;

	static pastValues = [];

	/** Array of all PhysicsObjects that currently exist */
	static physicsObjects = [];
	

	//*********************************************************************//
	//Private Static Methods
	
	//Check all physics objects for collisions with one another
	static #findCollisions() {
		let collisions = [];
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
				if (!Physics.isPhysicsCollision(physicsObj1, physicsObj2)) {
					continue;
				}
				//Check if the physics objects are colliding
				if (HitboxManager.physicsCollision(physicsObj1, physicsObj2)) {
					//Calculate the collision
					console.log(":0 PHYSICS COLLISION!!!")
					collisions.push([this.physicsObjects[obj1Index], this.physicsObjects[obj2Index]]);
				}
			}
			//Loop through all scene objects
			for (let sceneCol = 0; sceneCol < Scene.structure.length; sceneCol++) {
				for (let sceneRow = 0; sceneRow < Scene.structure[sceneCol].length; sceneRow++) {
					//Check for collisions
					//If the scene tile doesn't have collision
					if (this.isStaticCollision(this.physicsObjects[obj1Index], Scene.structure[sceneCol][sceneRow])) {
						continue;
					}
					//If there is a collision
					if (Physics.isStaticCollision(this.physicsObjects[obj1Index], Scene.structure[sceneCol][sceneRow])) {
						collisions.push([this.physicsObjects[obj1Index]]);
						console.log("Static collision :3");
					}
				}
			}
		}
		return collisions;
	}

	/** 
	Simulates the next physics frame
	*/
	static #simulateNextFrame() {
		for (let i = 0; i < this.physicsObjects.length; i++) {
			this.physicsObjects[i].update();
		}
	}
	
	//*********************************************************************//
	//Public Static Methods

	/** 
	Calculates if a collision should be represented as horizontal or not
	@param {PhysicsObject} physicsObj - Physics object to calculate the direction of
	@param {CollisionObject} otherObj - Other object that the object is colliding with
	@returns {boolean} is the collision horizontal
	*/
	static calcCollisionDirection(physicsObj, otherObj) {
		let slope;
		try {
			//Create the slope based on the difference in positions between the objects (if they're in the same position it is 0/0 and errors)
			slope = (physicsObj.y - otherObj.y) / (physicsObj.x - otherObj.x);
		} catch {
			console.warn("Objects in Same Position. Collision assumed to be vertical");
			slope = Number.MAX_VALUE;
		}
		if (Math.abs(slope) >= 1) {
			return false;
		} else {
			return true;
		}
	}

	static clearAll() {
		this.physicsObjects = [];
	}
	
	/** 
	Updates the values of the physics object to represent it as time moves forward
	@param {PhysicsObject} physicsObj - The physics object to update
	@returns {PhysicsObject} The updated physics object
	*/

	/** 
	Simulates the 2D collision of two physics objects
	@param {PhysicsObject} physicsObj1 - The first physics object to collide
	@param {PhysicsObject} physicsObj2 - The second physics object to collide
	@param {number} collisionEnergyTransfer - The amount of energy transferred between objects in the collision
	@returns {PhysicsObject[]} [physicsObj1, physicsObj2] - The two physics objects post-collision
	*/
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
		//Don't calculate the collision if it is insignificant, < 10px/sec
		if (physicsObj1.velocity.magnitude < 10 || physicsObj2.velocity.magnitude < 10) {
			yield physicsObj1;
			yield physicsObj2;
			return;
		}
		//Calculate the collision for the x velocity vector
		let temp = physicsObj1.velocity.x;
		physicsObj1.velocity.x = (
			physicsObj2.velocity.x
			* collisionEnergyTransfer
			* physicsObj2.mass
		)
			/ physicsObj1.mass;

		physicsObj2.velocity.x = (
			temp
			* collisionEnergyTransfer
			* physicsObj1.mass
		)
			/ physicsObj2.mass
			+ (
				physicsObj2.velocity.x * (1 - collisionEnergyTransfer)
			);

		physicsObj1.velocity.x += (temp * (1 - collisionEnergyTransfer));
		//Calculate the collision for the y velocity vector
		temp = physicsObj1.velocity.y;
		physicsObj1.velocity.y = (
			physicsObj2.velocity.y
			* collisionEnergyTransfer / collisionEnergyTransfer
			* physicsObj2.mass
		)
			/ physicsObj1.mass;

		physicsObj2.velocity.y = (
			(temp * collisionEnergyTransfer / collisionEnergyTransfer * physicsObj1.mass)
			/ physicsObj2.mass
		)
			+ (
				physicsObj2.velocity.y * (1 - collisionEnergyTransfer / collisionEnergyTransfer)
			);

		physicsObj1.velocity.y += (temp * (1 - collisionEnergyTransfer / collisionEnergyTransfer));

		//Round the physics objects' velocites to the 5th decimal place
		physicsObj1.velocity.round(5);
		physicsObj2.velocity.round(5);

		//Update the physics objects to properly relect all values
		physicsObj1.velocity.componatizedVector = [physicsObj1.velocity.x, physicsObj1.velocity.y];
		physicsObj2.velocity.componatizedVector = [physicsObj2.velocity.x, physicsObj2.velocity.y];

		//Yield the physics objects
		yield physicsObj1;
		yield physicsObj2;
	}

	/** 
	@param {PhysicsObject} physicsObj1 - The 1st physics object to check for collision
	@param {PhysicsObject} physicsObj2 - The 2nd physics object to check for collision
	@returns {boolean} True if the 2 physics objects have the possibility of colliding
	*/
	static isPhysicsCollision(physicsObj1, physicsObj2) {
		let xCollision = false;
		let yCollision = false;
		//Check if there is a collision with object 1 on the left or right side
		if ((physicsObj1.x - physicsObj1.width / 2 < physicsObj2.x + physicsObj2.width / 2 && physicsObj1.x + physicsObj1.width / 2 > physicsObj2.x - physicsObj2.width / 2) || (physicsObj1.x - physicsObj1.width / 2 > physicsObj2.x + physicsObj2.width / 2 && physicsObj1.x - physicsObj1.width / 2 < physicsObj2.x + physicsObj2.width / 2)) {
			xCollision = true;
		}
		//Check if there is a collision with object 1 on the top
		if (physicsObj1.y - physicsObj1.height / 2 < physicsObj2.y + physicsObj2.height / 2 && physicsObj1.y > physicsObj2.y) {
			yCollision = true;
		}
		return xCollision && yCollision;
	}

	/** 
	@param {PhysicsObject} physicsObj1 - The physics object to check for collision
	@param {SceneTile} obj2 - The static object to check for collision
	@returns {boolean} True if the 2 objects have the possibility of colliding
	*/
	static isStaticCollision(physicsObj1, obj2) {
		let xCollision = false;
		let yCollision = false;
		if ((physicsObj1.x - physicsObj1.width / 2 < obj2.x + obj2.width / 2 && physicsObj1.x + physicsObj1.width / 2 > obj2.x - obj2.width / 2) || (physicsObj1.x - physicsObj1.width / 2 > obj2.x + obj2.width / 2 && physicsObj1.x - physicsObj1.width / 2 < obj2.x + obj2.width / 2)) {
			xCollision = true;
		}
		if ((physicsObj1.y - physicsObj1.height / 2 < obj2.y + obj2.height / 2 && physicsObj1.y + physicsObj1.height / 2 > obj2.y - obj2.height / 2) || (physicsObj1.y - physicsObj1.height / 2 > obj2.y + obj2.height / 2 && physicsObj1.y - physicsObj1.height / 2 < obj2.y + obj2.height / 2)) {
			yCollision = true;
		}
		return xCollision && yCollision;
	}

	/** 
	Simulates the 2d collision of a physics object and a static object
	@param {PhysicsObject} physicsObj - The physics object to collide
	@param {boolean} horizontalImpact - True if the physics object impacts on the horizontal axis
	@param {number} collisionEnergyTransfer - The amount of energy transferred between objects in the collision
	@returns {PhysicsObject} physicsObj - The physics object post-collision
	*/
	static staticCollide(physicsObj, horizontalImpact, collisionEnergyTransfer = this.collisionEnergyTransfer) {
		if (horizontalImpact) {
			physicsObj.velocity.componatizedVector = [
				physicsObj.velocity.x * -collisionEnergyTransfer,
				physicsObj.velocity.y * collisionEnergyTransfer
			];
			//physicsObj.velocity.forces.push(new Vector("Friction", [0, (collisionEnergyTransfer - 1) * physicsObj.velocity.y]));
		} else {
			physicsObj.velocity.componatizedVector = [
				physicsObj.velocity.x * collisionEnergyTransfer,
				physicsObj.velocity.y * -collisionEnergyTransfer
			];
			//physicsObj.velocity.forces.push(new Vector("Friction", [(collisionEnergyTransfer - 1) * physicsObj.velocity.x, 0]));
		}
		return physicsObj;
	}

	static amendIntersects(collisions) {
		let reps = 0;
		while (collisions.length > 0 && reps < this.maxCalculations) {
			//Amend the position of the two objects involved in the collision
			for (let i = 0; i < collisions.length; i++) {
				if (collisions[i][1].velocity != undefined) {
					[collisions[i][0], collisions[i][1]] = HitboxManager.amendIntersect(collisions[i][0], collisions[i][1]);
				} else if (collisions[i][0].velocity != undefined) {
					collisions[i][0] = HitboxManager.amendStaticIntersect(collisions[i][0], collisions[i][1], calcCollisionDirection(collisions[i][0], collisions[i][1]));
				} else {
					console.warn("Invalid Collision Array:\n\t" + collisions[i] + ". No intersect amended");
				}
			}

			collisions = this.#findCollisions();

			reps++;
		}
		if (reps >= this.maxCalculations) {
			console.warn("Ininite Recursion Detected");
		}
		return collisions;
	}

	static applyCollisions(collisions) {
		for (let i = 0; i < collisions.length; i++) {
			if (collisions[i][1].velocity != undefined) {
				[collisions[i][0], collisions[i][1]] = this.collide(collisions[i][0], collisions[i][1]);
			} else if (collisions[i][0].velocity != undefined) {
				collisions[i][0] = this.staticCollide(collisions[i][0], calcCollisionDirection(collisions[i][0], collisions[i][1]));
			} else {
				console.warn("Invalid Collision Array:\n\t" + collisions[i] + ". No Collision Applied");
			}
		}
		return collisions;
	}

	static clonePhysicsObjects() {
		return Util.clone(this.physicsObjects);
	}

	//Zac's method
	static async update2() {
		this.pastValues = [];
		this.pastValues = this.clonePhysicsObjects();
		
		//Step 1: Clear all forces and apply constant forces to every object
		for (let i = 0; i < this.physicsObjects.length; i++) {
			this.physicsObjects[i].forces = [this.gravity];
		}
		//Step 2: Move all the physics objects
		this.#simulateNextFrame();
		
		//Step 3: Find all collisions between objects occuring
		let collisions = this.#findCollisions();

		//Step 4: Apply collision forces
		this.applyCollisions(collisions);
		//Step 5: Amend intersects
		this.amendIntersects(collisions);
		
		while (this.pastValues == []) {
			//Do nothing
		}
		//Step 6: Reassign past position values
		for (let i = 0; i < this.pastValues.length; i++) {
			this.physicsObjects[i].x = pastValues[i].x;
			this.physicsObjects[i].y = pastValues[i].y;
		}

		//Step 7: Move
		
	}

	//New method
	static update3() {
		//Step 1: Copy current object values
		this.pastValues = [];
		this.pastValues = this.clonePhysicsObjects();
		
		//Step 2: Clear all forces and apply constant forces to every object
		for (let i = 0; i < this.physicsObjects.length; i++) {
			this.physicsObjects[i].forces = [this.gravity];
		}

		//Step 3: Simulate the next frame to find collisions
		this.#simulateNextFrame();
		
		//Step 4: Find all collisions between objects (dynamic and static)
		let collisions = this.#findCollisions();

		//Step 4: Reassign past position values
		for (let i = 0; i < this.pastValues.length; i++) {
			this.physicsObjects[i].x = pastValues[i].x;
			this.physicsObjects[i].y = pastValues[i].y;
		}

		//Step 4: Assign collision data to colliding objects
		collisions = this.assignCollisionData(collisions);

		//Step 5: Simulate the next frame
		this.#simulateNextFrame();
		
		
	}

	//Assigns collision data to all objects colliding
	static assignCollisionData(collisions) {
		for (let i = 0; i < collisions.length; i++) {
			//If neither veloicty is undefined (dynamic collision)
			if (collisions[i][1].velocity != undefined) {
				//Do nothing for now
			//If second velocity is undefined (static collision)
			} else if (collisions[i][0].velocity != undefined) {
				//Assign collision data to the dynamic object
				
			} else {
				console.warn("Invalid Collision Array:\n\t" + collisions[i] + ". No Collision Applied");
			}
		}
		return collisions;
	}

	//Update function
	static update() {
		//this.update2();
		this.update3();
	}
}