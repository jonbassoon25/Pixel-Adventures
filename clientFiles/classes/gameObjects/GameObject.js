import { Scene } from "../util/Scene.js";

import { UI } from "../UIObjects/UI.js";
import { UIObject } from "../UIObjects/UIObject.js";

export class GameObject extends UIObject {
	constructor(image, x, y, hitboxPoints = []) {
		//Calculate absolute values of x
		super(x * Scene.tileSize - Scene.scrollAmount + Scene.tileSize / 2, y * Scene.tileSize + Scene.tileSize / 2, Scene.tileSize, Scene.tileSize);
		//Coordinates of the GameObject, expressed relative to coordinte system array
		this.relX = x;
		this.relY = y;
		//Assign image
		this.image = image;
		//Hitbox points, expressed relative to the individual coordinate square: 0 = left / up, 1 = right / down. Decimal values to express any value in between. Hitbox points is an 2d array for every point
		if (hitboxPoints.length < 2) {
			console.warn("Too few hitboxPoints in GameObject (" + hitboxPoints.length + "/2)\n\tLocation: (" + this.x + ", " + this.y + ")" + "\n\tConverting hitbox to standard box.");
			this.hitboxPoints = [[0, 0], [1, 0], [1, 1], [0, 1]];
		} else {
			this.hitboxPoints = hitboxPoints;
		}
		
	}
	
	update() {
		super.updatePosition();
		UI.draw(this.image, this.x, this.y, this.width, this.height);
	}
}