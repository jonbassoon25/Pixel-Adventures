//Util Imports
import { Display } from "../util/Display.js";
import { Vector } from "../util/Vector.js";
import { Util } from "../util/Util.js";

//UI Object Imports

//Player Imports

//Game Object Imports
import { Mace } from "../gameObjects/Mace.js";

//Game Entity Imports
import { Enemy } from "./Enemy.js";
import { Particle } from "./Particle.js";

//Template Class
export class Effigy extends Enemy {
	//Constructor

	constructor(x, y) {
		super("effigy", x, y, 16, 52, 3, 70, 180, 400, 0.4);
		this.maxSpeed = this.speed;
		this.targetCompleteDistance = 50;
		this.visualWidth = 80;
		this.visualHeight = 75;
		this.weapon = new Mace(this, this.damage);
		this.weapon.knockback = new Vector([10, -4]);
	}

	//*********************************************************************//
	//Public Methods

	

	draw() {
		//Draws this effigy with correct animation state
		super.draw();
		
	}

	delete() {
		for (let i = 0; i < 12; i++) {
			new Particle("death", this.x, this.y, 12, 12, new Vector([((i < 6)? 1 : -1) * (Math.random() * 2 + 2), ((i < 6)? 1 : -1) * Math.random() * 3 - 2]), 0.75, 0.95, true, true, false);
		}
		super.delete();
		this.weapon.delete();
	}

	takeKnockback(weapon) {
		this.accelerations.push(new Vector([weapon.knockback.x * this.knockbackMultiplier * ((weapon.parent.x < this.x)? 1 : -1), 0]));
	}

	update() {
		super.update();

		//Update mace
		this.weapon.update(this.flipped, this.isGrounded);
		
		if (!this.isGrounded) {
			this.setAnimation("jump");
			this.weapon.setAnimation("jump");
		}
		if (this.isGrounded && this.currentAnimation == "jump") {
			this.setAnimation("idle");
			this.weapon.setAnimation("idle");
		}
		//Make the effigy walk if the x velocity isn't 0 and the effigy isn't jumping. Always makes the effigy finish their step when they aren't supposed to be moving unless the effigy jumps
		if (this.velocity.x != 0 && this.currentAnimation != "jump" && this.currentAnimation != "walk") {
			this.setAnimation("walk");
		}
		
		if (this.target == null) return;
		if (Math.abs(this.target[0] - this.x) <= this.weapon.reach && !(this.target[0] == this.returnPoint[0] && this.target[1] == this.returnPoint[1])) {
			//Effigy is ready to attack
			if ((this.weapon.currentAnimation == "idle" || this.weapon.currentAnimation == "walk") || (this.weapon.currentAnimation == "charge" && this.weapon.currentFrame < 35)) {
				this.weapon.charge();
			} else if (this.weapon.currentAnimation == "charge" && this.weapon.currentFrame == 35 && Math.abs(this.target[0] - this.x) <= this.targetCompleteDistance) {
				this.weapon.attack();
			}
		}
	}
}