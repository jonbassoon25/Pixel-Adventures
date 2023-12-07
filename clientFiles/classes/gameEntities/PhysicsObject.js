//Util Imports
import { HitboxManager } from "../util/HitboxManager.js";
import { Physics } from "../util/Physics.js";
import { Vector } from "../util/Vector.js";
import { Util } from "../util/Util.js";

//UI Object Imports
import { UI } from "../UIObjects/UI.js";
import { UIObject } from "../UIObjects/UIObject.js";

//PhysicsObject Class
export class PhysicsObject extends UIObject {
	//Constructor
	
	/** 
 	@param {string} image - Image name to use
   	@param {number} x - Starting X position
	@param {number} y - Starting Y position
   	@param {number} width - Width of the object
	@param {number} height - Height of the object
   	@param {number} mass - Mass of the object
	@param {arrayList} hitboxPoints - Array of points to use for the hitbox (optional)
 	**/
	constructor(image, x, y, width, height, mass, hitboxPoints = []) {
		super(x, y, width, height);
		//Name of the physicsObject (what subclass is it)
		this.name = "PhysicsObject";
		//Mass of object relative to others
		this.mass = mass;
		//Velocity vector of the object expressed in px/sec, positive is right and down
		this.velocity = new Vector("Velocity of " + this.name, [0, 0]);
		//Array of all forces acting upon the object, all in units/sec not units/frame
		this.forces = [];
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

	//*********************************************************************//
	//Public Methods
	
	/** 
	Destroys all refrences to this physicsObject
 	*/
	delete() {
		Physics.physicsObjects = Util.delValue(Physics.physicsObjects, this);
		this.velocity.delete();
	}

	/** 
  	@returns {boolean} - True if the object is out of bounds
 	*/
	isOutOfBounds() {
		return false;
		//return this.absX < 0 || this.absX > 1920 || this.absY < 0 || this.absY > 1080;
	}

	/** 
	Copy the position and velocity of a different physicsObject to this one
	@param {PhysicsObject} physicsObj - Physics object to copy the values from
	*/
	updatePhysicsValues(physicsObj) {
		this.x = physicsObj.x;
		this.y = physicsObj.y;
		this.velocityVector = physicsObj.velocityVector;
	}
	
	/** 
 	Updates this physicsObject and draws it onto the screen
  	*/
	update() {
		super.updatePosition();
		this.updatePhysicsValues(Physics.simulate(this));
		if (this.isOutOfBounds()) {
			this.delete();
			return;
		}
		UI.draw(this.image, this.x, this.y, this.width, this.height);
	}
}