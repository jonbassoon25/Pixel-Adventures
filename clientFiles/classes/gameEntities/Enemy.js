//Util Imports
import { Difficulty } from "../util/Difficulty.js";
import { Display } from "../util/Display.js";

//Game Entity Imports
import { NPC } from "./NPC.js";
import { Player } from "./Player.js";
import { Scene } from "../util/Scene.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";

//Gamestate Imports
import { Settings } from "../gamestates/Settings.js";

//Enemy Class
export class Enemy extends NPC {
	static clear() {
		for (let i = this.dynamicObjects.length - 1; i >= 0; i--) {
			if (DynamicObject.dynamicObjects[i] instanceof Enemy) DynamicObject.dynamicObjects[i].delete();
		}
		
	}
	
	//Constructor

	constructor(type, x, y, width, height, speed, damage, health, visibility = -1, knockbackMultiplier = 1) {
		super(type, x, y, width, height, 0, speed);
		this.speed *= Difficulty.enemySpeedMult;
		this.damage = damage * Difficulty.enemyDamageMult;
		this.health = health * Difficulty.enemyHealthMult;
		this.maxHealth = this.health;
		this.visibility = visibility;
		this.target = [x, y];
		this.returnPoint = [x, y];
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
		if (this.target == null) {
			this.target = this.returnPoint;
		}
	}

	

	update() {
		if (this.health <= 0) {
			this.delete();
		}
		this.findTarget();
		//Flip if change in position between this and target < 0
		if (this.target[0] - this.x < 0) {
			this.flipped = true;
		} else if (this.target[0] - this.x > 0) {
			this.flipped = false;
		}
		let totalWidth = this.width * 2;
		super.update();
		if (Settings.debug) {
			Display.draw("shader_05", this.x, this.y - this.height/2 - 7, totalWidth, 10);
			let redWidth = this.width * 2 * (this.health / this.maxHealth);
			Display.draw("redTile", this.x - (totalWidth - redWidth)/2, this.y - this.height/2 - 7, redWidth, 10);
		}
	}
}