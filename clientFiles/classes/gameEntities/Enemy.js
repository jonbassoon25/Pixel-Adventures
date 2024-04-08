//Util Imports
import { Util } from "../util/Util.js";
import { Difficulty } from "../util/Difficulty.js";

//Game Entity Imports
import { NPC } from "./NPC.js";
import { Player } from "./Player.js";
import { DynamicObject } from "./DynamicObject.js";
import { Vector } from "../util/Vector.js";
import { Scene } from "../util/Scene.js";

//Enemy Class
export class Enemy extends NPC {
	//Constructor

	constructor(image, x, y, width, height, speed, damage, health, visibility = -1, knockbackMultiplier = 1) {
		super(x, y, width, height, 0, image, speed);
		this.speed *= Difficulty.enemySpeedMult;
		this.damage = damage * Difficulty.enemyDamageMult;
		this.health = health * Difficulty.enemyHealthMult;
		this.visibility = visibility;
		this.idleTime = 0;
		this.target = [x, y];
		this.knockbackMultiplier = knockbackMultiplier;
	}

	//*********************************************************************//
	//Public Methods

	findTarget() {
		this.target = null;
		//The enemy targets the closest player
		let distance = this.visibility;
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			let curObj = DynamicObject.dynamicObjects[i];
			if (curObj instanceof Player && !curObj.isDead) {
				if ((Math.abs(curObj.x - this.x) < distance || distance == -1) && (this.y - Scene.tileSize * 3 < curObj.y && this.y + Scene.tileSize * 3 > curObj.y)) {
					distance = Math.abs(curObj.x - this.x);
					this.target = [curObj.x, curObj.y];
				}
			}
		}
	}

	

	update() {
		if (this.health < 0) {
			this.delete();
		}
		this.findTarget();
		if (this.isGrounded) {
			this.idleTime++;
		} else {
			this.idleTime = Util.randInt(-15, 0);
		}
		super.update();
	}
}