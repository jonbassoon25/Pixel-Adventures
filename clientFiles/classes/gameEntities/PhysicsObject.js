//Util Imports
import { Display } from "../util/Display.js";
import { Physics } from "../util/Physics.js";
import { Util } from "../util/Util.js";

//UI Object Imports
import { UI } from "../UIObjects/UI.js";

export class PhysicsObject {
	//Mass cannot be 0 because it will cause a divide by 0 error in physics calculations
	constructor(image, x, y, mass, hitboxPoints = []) {
		//Name of the physicsObject (what subclass is it)
		this.name = "PhysicsObject";
		//Set absolute position values
		this.absX = x;
		this.absY = y;
		this.width = 0; //Assigned in update step
		this.height = 0; //Assigned in update step
		//Set relative position values
		let trash;
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimenstions(x, y, 0, 0)];
		//Mass of object relative to others
		this.mass = mass;
		//Velocity vector of the object expressed in px/sec, positive is right and down
		this.velocityVector = [0, 0];
		//Rotation in degrees, 0 is up, increasing value represents clockwise rotation
		this.rotation = 0;
		//Assign image
		this.image = image;
		//Assign hitboxPoints
		if (hitboxPoints.length < 2) {
			console.warn("Too few hitboxPoints in PhysicsObject (" + hitboxPoints.length + "/2)\n\tLocation: (" + this.x + ", " + this.y + ")" + "\n\tConverting hitbox to standard box (50px * 50px)");
			this.hitboxPoints = [[0, 0], [50, 0], [50, 50], [0, 50]];
		} else {
			this.hitboxPoints = hitboxPoints;
		}
		//Add this object to the physicsObjects array in Physics to keep track of it
		Physics.physicsObjects.push(this);
	}

	//Update physics object values with those of another physics object
	#updatePhysicsValues(physicsObj) {
		this.x = physicsObj.x;
		this.y = physicsObj.y;
		this.velocityVector = physicsObj.velocityVector;
	}

	//Update the physics object position relative to user screen size
	#updatePosition() {
		let max = [Number.MIN_VALUE, Number.MIN_VALUE];
		for (let i = 0; i < this.hitboxPoints.length; i++) {
			max[0] = Math.max(max[0], this.hitboxPoints[i][0]);
			max[1] = Math.max(max[1], this.hitboxPoints[i][1]);
		}
		[this.x, this.y, this.width, this.height] = [...Display.calcElementDimenstions(this.absX, this.absY, max[0], max[1])];
	}

	//Does this object collide with the other given physics object
	collidesWith(physicsObject) {
		return Physics.isCollision(this, physicsObject);
	}

	//Deletes this object from the physicsObjects array
	delete() {
		Physics.physicsObjects = Util.delValue(Physics.physicsObjects, this);
	}

	isOutOfBounds() {
		return this.x < 0 || this.x > 1920 || this.y < 0 || this.y > 1080;
	}
	
	//Updates the physics object
	update() {
		this.#updatePhysicsValues(Physics.simulate(this));
		this.#updatePosition();
		if (this.isOutOfBounds()) {
			this.delete();
			return;
		}
		UI.draw(this.image, this.x, this.y, this.width, this.height);
	}
}