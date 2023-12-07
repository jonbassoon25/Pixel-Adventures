//ComplexHitbox Class
class ComplexHitbox {
	//Constructor

	/** 
	@param {number} x - The x position of the hitbox
	@param {number} y - The y position of the hitbox
	@param {number[]} hitboxPoints - An array of points that make up the hitbox
	*/
	constructor(x, y, hitboxPoints) {
		this.x = x;
		this.y = y;
		this.hitboxPoints = hitboxPoints;
		//Build the complex hitbox
		
	}

	//*********************************************************************//
	//Public Methods

	/** 
  	Updates the position of this object
	@param {number} x - The new x position of this object
  	@param {number} y - The new y position of this object
 	*/
	updatePosition(x, y) {
		this.x = x;
		this.y = y;
	}

	/** 
	@param {ComplexHitbox} other - The other hitbox to check against
  	@returns {boolean} - True if this hitbox collides with the other hitbox
 	*/
	collidesWith(complexHitbox) {
		return false;
	}
}