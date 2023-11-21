class ComplexHitbox {
	constructor(x, y, hitboxPoints) {
		this.x = x;
		this.y = y;
		this.hitboxPoints = hitboxPoints;
		//Build the complex hitbox
		
	}

	updatePosition(x, y) {
		this.x = x;
		this.y = y;
	}

	//Returns a boolean of if this hitbox collides with the other hitbox
	collidesWith(complexHitbox) {
		
	}
}