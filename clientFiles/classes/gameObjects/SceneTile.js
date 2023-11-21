//Util Imports
import { HitboxManager } from "../util/HitboxManager.js";
import { Scene } from "../util/Scene.js";

import { UI } from "../UIObjects/UI.js";
import { UIObject } from "../UIObjects/UIObject.js";

export class SceneTile extends UIObject {
	constructor(image, x, y, hitboxPoints = SceneTile.squareHitbox) {
		//Calculate absolute values of x
		super(x * Scene.tileSize - Scene.scrollAmount + Scene.tileSize / 2, y * Scene.tileSize + Scene.tileSize / 2, Scene.tileSize, Scene.tileSize);
		//Coordinates of the GameObject, expressed relative to coordinte system array
		this.relX = x;
		this.relY = y;
		//Assign image
		this.image = image;
		//Does this object have collision
		this.collides = image != "none";
		//Hitbox points, expressed relative to the individual coordinate square: 0 = left / up, 1 = right / down. Decimal values to express any value in between. Hitbox points is an 2d array
		if (hitboxPoints.length < 2 && this.collides) {
			console.warn("HitboxPoints in SceneTile is too short (" + hitboxPoints.length + "/2)\nConverting to Square Hitbox.");
			this.hitboxPoints = HitboxManager.squareHitbox;
		} else {
			this.hitboxPoints = hitboxPoints;
		}
	}

	//Returns true or false of if the given point has the possibility of colliding with this object
	checkPossibleCollision(x, y) {
		if (this.collides) {
			return false;
		}
		return x >= this.x && x <= this.x + Scene.tileSize && y >= this.y && y <= this.y + Scene.tileSize;
	}
	
	update() {
		super.updatePosition();
		UI.draw(this.image, this.x, this.y, this.width, this.height);
	}
}