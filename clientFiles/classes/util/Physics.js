//Util Imports
import { HitboxManager } from "./HitboxManager.js";
import { Scene } from "./Scene.js";
import { Vector } from "./Vector.js";

//UI Object Imports
import { PauseMenu } from "../UIObjects/PauseMenu.js";

//Physics Class
export class Physics {
	/** Amount of converted energy in a collision, 1 is 100% */
	static collisionEnergyTransfer = 0.9;
	
	/** Gravitational acceleration (px/sec^2) */
	static gravity = new Vector("Gravity", [0, 600]);
	
	/** Maximum falling speed in px/sec */
	static maxFallingSpeed = 1800;
	
	/** Maximum lateral movement speed in px/sec */
	static maxLateralSpeed = 300;
	
	/** Array of all PhysicsObjects that currently exist */
	static physicsObjects = [];

	//*********************************************************************//
	//Private Static Methods

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
				if (!this.isPhysicsCollision(physicsObj1, physicsObj2)) {
					continue;
				}
				//Check if the physics objects are colliding
				if (HitboxManager.physicsCollision(physicsObj1, physicsObj2)) {
					//Calculate the collision
					[this.physicsObjects[obj1Index], this.physicsObjects[obj2Index]] = [...this.collide(physicsObj1, physicsObj2)];
					//Make sure the objects aren't intersecting
					[this.physicsObjects[obj1Index], this.physicsObjects[obj2Index]] = HitboxManager.amendIntersect(physicsObj1, physicsObj2);
				}
			}
			//Loop through all scene objects
			for (let sceneCol = 0; sceneCol < Scene.structure.length; sceneCol++) {
				for (let sceneRow = 0; sceneRow < Scene.structure[sceneCol].length; sceneRow++) {
					//Check for collisions
					//If the scene tile doesn't have collision
					if(!Scene.structure[sceneCol][sceneRow].collides) {
						continue;
					}
					//If there is a collision
					if (this.isStaticCollision(this.physicsObjects[obj1Index], Scene.structure[sceneCol][sceneRow])) {
						this.physicsObjects[obj1Index] = this.staticCollide(this.physicsObjects[obj1Index], false);
						this.physicsObjects[obj1Index] = HitboxManager.amendStaticIntersect(this.physicsObjects[obj1Index], Scene.structure[sceneCol][sceneRow], false);
					}
				}
			}
		}
	}

	//Updates all physics objects
	static #updatePhysicsObjects() {
		for (let i = 0; i < this.physicsObjects.length; i++) {
			this.physicsObjects[i].update();
			//Error before this line
		}
	}

	//*********************************************************************//
	//Public Static Methods
	
	/** 
	Updates the values of the physics object to represent it as time moves forward
	@param {PhysicsObject} physicsObj - The physics object to update
	@returns {PhysicsObject} The updated physics object
	*/
	static simulate(physicsObj) {
		//If the game is paused, don't update the object's position
		if (PauseMenu.paused) {
			return physicsObj;
		}
		
  		//Apply gravity to the phyisics object
		physicsObj.velocity.forces.push(Physics.gravity);
		
		//Zac's Normal Forces, pre-Vector
		/*
  		//Check for normal forces
		for (let i = 0; i < physicsObjects.length; i++) {
  			if (physicsObject.absX + physicsObj.absWidth/2 == physicsObjects[i].absX - physicsObjects[i].absWidth/2
	 			&& physicsObj.absY - physicsObj.absHeight/2 < physicsObjects[i].absY + physicsObjects[i].absHeight/2
	 			&& physicsObj.absY + physicsObj.absHeight/2 > physicsObjects[i].absY - physicsObjects[i].absHeight/2
	 			) {
	 			//physicsObj's right side is in contact with physicsObjects[i]'s left side
	 			//Normal force from the left opposes net force in the positive x direction (will need to be adjusted if rotation is added)
	 			let sumForces = 0;
	 			for (int j = 0; j < physicsObj.forces.length; j++) {
	 				sumForces += physicsObj.forces[j].xComponent;
				}
				if (sumForces > 0) {
					physicsObj.forces.append("normal force", -sumForces);
				} else {
					//Do nothing since the net force does not cause any normal force
				}
			}
			if (physicsObject.absX - physicsObj.absWidth/2 == physicsObjects[i].absX + physicsObjects[i].absWidth/2) {
				//Normal force from the right opposes all movement in the negative x direction
				physicsObj.forces.append("normal force", -Math.abs(physicsObject.velocity.x));
			}
			if (physicsObject.absY + physicsObj.absHeight/2 == physicsObjects[i].absY - physicsObjects[i].absHeight/2) {
				//Normal force from below opposes all movement in the positive y direction
				physicsObj.forces.append("normal force", -Math.abs(physicsObject.velocity.y));
			}
			if (physicsObject.absY - physicsObj.absHeight/2 == physicsObjects[i].absY + physicsObjects[i].absHeight/2) {
				//Normal force from above opposes all movement in the negative y direction
				physicsObj.forces.append("normal force", Math.abs(physicsObject.velocity.y));
			}
		}
  		*/

		//Update the vector
		physicsObj.velocity.update();
		
		//Constrain the x velocity vector of the physics object within max values
		physicsObj.velocity.limitComponatizedValues(this.maxLateralSpeed, this.maxFallingSpeed);
		
		//Round the values of the velocity vector and add their values to the absolute X and Y values
		physicsObj.velocity.round(5);

		//Move the physics object based on the velocity vectors, divide by 60 to get to units/frame instead of units/sec
		physicsObj.absX += physicsObj.velocity.x / 60;
		physicsObj.absY += physicsObj.velocity.y / 60;
		
		//Return the physics object
		return physicsObj;
	}
	
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
				* collisionEnergyTransfer/collisionEnergyTransfer //Zac: I don't think vertical collisions should lose any energy (makes midair horizontal collisions really janky)
				* physicsObj2.mass
				) 
			/ physicsObj1.mass;

		physicsObj2.velocity.y = (
				(temp * collisionEnergyTransfer/collisionEnergyTransfer * physicsObj1.mass) 
				/ physicsObj2.mass
			) 
			+ (
				physicsObj2.velocity.y * (1 - collisionEnergyTransfer/collisionEnergyTransfer)
			);

		physicsObj1.velocity.y += (temp * (1 - collisionEnergyTransfer/collisionEnergyTransfer));

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
		if ((physicsObj1.absX - physicsObj1.absWidth/2 <= physicsObj2.absX + physicsObj2.absWidth/2 && physicsObj1.absX + physicsObj1.absWidth/2 >= physicsObj2.absX - physicsObj2.absWidth/2) || (physicsObj1.absX - physicsObj1.absWidth/2 >= physicsObj2.absX + physicsObj2.absWidth/2 && physicsObj1.absX - physicsObj1.absWidth/2 <= physicsObj2.absX + physicsObj2.absWidth/2)) {
			xCollision = true;
		}
		//Check if there is a collision with object 1 on the top
		if (physicsObj1.absY - physicsObj1.absHeight/2 <= physicsObj2.absY + physicsObj2.absHeight/2 && physicsObj1.absY >= physicsObj2.absY) {
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
		if ((physicsObj1.absX - physicsObj1.absWidth/2 <= obj2.absX + obj2.absWidth/2 && physicsObj1.absX + physicsObj1.absWidth/2 >= obj2.absX - obj2.absWidth/2) || (physicsObj1.absX - physicsObj1.absWidth/2 >= obj2.absX + obj2.absWidth/2 && physicsObj1.absX - physicsObj1.absWidth/2 <= obj2.absX + obj2.absWidth/2)) {
			xCollision = true;
		}
		if ((physicsObj1.absY - physicsObj1.absHeight/2 <= obj2.absY + obj2.absHeight/2 && physicsObj1.absY + physicsObj1.absHeight/2 >= obj2.absY - obj2.absHeight/2) || (physicsObj1.absY - physicsObj1.absHeight/2 >= obj2.absY + obj2.absHeight/2 && physicsObj1.absY - physicsObj1.absHeight/2 <= obj2.absY + obj2.absHeight/2)) {
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

	/** Deletes all known PhysicsObjects */
	static clearAll() {
		for (let i = this.physicsObjects.length - 1; i >= 0; i--) {
			this.physicsObjects[i].delete();
		}
	}

	/** Updates all known PhysicsObjects */
	static update() {
		if (PauseMenu.paused) {
			return;
		}
		this.#updatePhysicsObjects();
		this.#checkForCollisions();
	}
}