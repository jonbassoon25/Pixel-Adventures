//Util Imports
import { Display } from "../util/Display.js";
import { Vector } from "../util/Vector.js";
import { Util } from "../util/Util.js";

//UI Object Imports

//Player Imports

//Game Object Imports
import { Sword } from "../gameObjects/Sword.js";

//Game Entity Imports
import { Enemy } from "./Enemy.js";
import { Particle } from "../gameEntities/Particle.js";
import { Healthbar } from "../gameEntities/Healthbar.js";

//Gamestate Imports
import { Settings } from "../gamestates/Settings.js";

//Skeleton Class
export class Skeleton extends Enemy {
	//Constructor

	constructor(x, y, tag) {
		super("skeleton", x, y, 16, 52, 2, 15, 120, 300, 1);
		this.targetCompleteDistance = 50;
		this.weapon = new Sword(this, this.damage);
		this.tags.push(tag);
		if (Settings.debug) this.healthbar = new Healthbar(this);
	}

	//*********************************************************************//
	//Public Methods

	

	draw() {
		//Draws this skeleton with correct animation state
		super.draw();
		
	}

	die() {
		for (let i = 0; i < 12; i++) {
			new Particle("death", this.x, this.y, 12, 12, new Vector([((i < 6)? 1 : -1) * (Math.random() * 2 + 2), ((i < 6)? 1 : -1) * Math.random() * 3 - 2]), 0.75, 0.95, true, true, false);
		}
		if (this.trigger != undefined) {
			if (!Array.isArray(this.trigger)) {
				this.trigger.trigger();
			} else {
				for (let i = 0; i < this.trigger.length; i++) {
					this.trigger[i].trigger();
				}
			}
		}
		this.delete();
	}
	
	update() {
		super.update();

		//Update sword
		this.weapon.update(this.flipped, this.isGrounded);
		
		if (!this.isGrounded) {
			this.setAnimation("jump");
			this.weapon.setAnimation("jump");
		}
		if (this.isGrounded && this.currentAnimation == "jump") {
			this.setAnimation("idle");
		}
		//Make the skeleton walk if the x velocity isn't 0 and the skeleton isn't jumping. Always makes the skeleton finish their step when they aren't supposed to be moving unless the skeleton jumps
		if (this.velocity.x != 0 && this.currentAnimation != "jump" && this.currentAnimation != "walk") {
			this.setAnimation("walk");
		}
		
		if (this.target == null) return;
		if (Math.abs(this.target[0] - this.x) <= this.targetCompleteDistance && !(this.target[0] == this.returnPoint[0] && this.target[1] == this.returnPoint[1])) {
			this.weapon.attack();
		}
	}
}