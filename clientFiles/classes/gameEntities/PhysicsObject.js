//Util Imports
import { HitboxManager } from "../util/HitboxManager.js";
import { Physics } from "../util/Physics.js";
import { Util } from "../util/Util.js";

//UI Object Imports
import { UI } from "../UIObjects/UI.js";
import { UIObject } from "../UIObjects/UIObject.js";

export class PhysicsObject extends UIObject {
	//Mass cannot be 0 because it will cause a divide by 0 error in physics calculations
	constructor(image, x, y, width, height, mass, hitboxPoints = []) {
		super(x, y, width, height);
		//Name of the physicsObject (what subclass is it)
		this.name = "PhysicsObject";
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
			this.hitboxPoints = HitboxManager.triangleHitbox;
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

	//Deletes this object from the physicsObjects array
	delete() {
		Physics.physicsObjects = Util.delValue(Physics.physicsObjects, this);
	}

	isOutOfBounds() {
		return false;
		
		//return this.x < 0 || this.x > 1920 || this.y < 0 || this.y > 1080;
	}

	calcHitboxWidth() {
		let maxWidth = Number.MIN_VALUE;
		for (let hitboxIndex = 0; hitboxIndex < hitboxPoints.length; hitboxIndex++) {
			
		}

		return maxWidth;
	}
	
	//Updates the physics object
	update() {
		super.updatePosition();
		this.#updatePhysicsValues(Physics.simulate(this));
		if (this.isOutOfBounds()) {
			this.delete();
			return;
		}
		UI.draw(this.image, this.x, this.y, this.width, this.height);
	}
}