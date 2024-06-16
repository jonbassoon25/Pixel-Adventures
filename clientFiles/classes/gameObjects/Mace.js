//Util Imports
import { Display } from "../util/Display.js";
import { Vector } from "../util/Vector.js";
import { Util } from "../util/Util.js";
import { Keyframe } from "../util/Keyframe.js";

//Game Entity Imports
import { Enemy } from "../gameEntities/Enemy.js";
import { Particle } from "../gameEntities/Particle.js";
import { Player } from "../gameEntities/Player.js";
import { Healthbar } from "../gameEntities/Healthbar.js";

//Game Object Imports
import { MeleeWeapon } from "./MeleeWeapon.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js"
import { VisualObject } from "../basicObjects/VisualObject.js";


//Mace Class
export class Mace extends MeleeWeapon {
    //Constructor
    constructor(parentObject, damage = 50) {
		let type;
		if (parentObject.type == "redPlayer" || parentObject.type == "bluePlayer") {
			type = "playerMace";
		} else {
			type = parentObject.type + "Mace";
		}
        super(parentObject, 80, 80, damage, 100, type, 1);
		this.knockback = new Vector([8, -4.5]);
    }
	
	charge() {
		if (this.currentAnimation == "idle") {
			this.setAnimation("charge");
			this.parent.setAnimation("maceCharge");
		} else if (this.currentAnimation == "cancelCharge") {
			this.currentAnimation = "charge";
			this.currentFrame = 70 - this.currentFrame;
			//Update the current keyframe
			super.update(false, false, true);
			//Update player animation
			this.parent.currentAnimation = "maceCharge";
			this.parent.currentFrame = 70 - this.parent.currentFrame;
			this.parent.update(true);
		}
	}
	
	attack() {
		if (this.parent.type == "redPlayer" || this.parent.type == "bluePlayer") {
			if (this.currentAnimation == "charge" && this.currentFrame != 70) {
				this.currentAnimation = "cancelCharge";
				this.currentFrame = 70 - this.currentFrame;
				//Update the current keyframe
				super.update(false, false, true);
				//Update player animation
				this.parent.currentAnimation = "maceCancelCharge";
				this.parent.currentFrame = 70 - this.parent.currentFrame;
				this.parent.update(true);
			} else if (this.currentAnimation == "charge") {
				this.setAnimation("attack");
				this.parent.setAnimation("maceAttack");
			}
		} else if (this.parent.type == "effigy") {
			if (this.currentAnimation == "charge" && this.currentFrame != 35) {
				this.currentAnimation = "cancelCharge";
				this.currentFrame = 35 - this.currentFrame;
				//Update the current keyframe
				super.update(false, false, true);
				//Update player animation
				this.parent.currentAnimation = "maceCancelCharge";
				this.parent.currentFrame = 35 - this.parent.currentFrame;
				this.parent.update(true);
			} else if (this.currentAnimation == "charge") {
				this.setAnimation("attack");
				this.parent.setAnimation("maceAttack");
			}
		}
	}
	
	upgrade() {
		super.upgrade(5);
	}
	
	update() {
		super.update();
		if (this.parent.velocity.x != 0 && this.currentAnimation == "idle" && Display.frames % 4 == 0) {
		new Particle("spark", this.x - (22 * ((this.parent.flipped)? -1 : 1)), this.y + 19, 6, 6, new Vector([((Util.randInt(1) == 0)? 2 : -2) * Math.random(), Math.random() * -3]), 0.25);
		}
		//Restrict the speed of the player when used
		if (this.parent.type == "redPlayer" || this.parent.type == "bluePlayer") {
			if (this.currentAnimation == "charge") {
				this.parent.speed = this.parent.maxSpeed * (90 - this.currentFrame)/100;
			} else if (this.currentAnimation == "cancelCharge") {
				this.parent.speed = this.parent.maxSpeed * (20 + this.currentFrame)/100;
			} else if (this.currentFrame < 15 && this.currentAnimation == "attack") {
				this.parent.speed = 0;
			} else {
				this.parent.speed = this.parent.maxSpeed;
			}
		}
		if (this.currentFrame == 15 && this.currentAnimation == "attack") {
			let attackBox = new VisualObject("placeholder", this.parent.x + 22 * (this.parent.flipped? -1 : 1), this.parent.y, this.reach, this.parent.height);
			//Damage Enemies
			for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
				let curObj = DynamicObject.dynamicObjects[i];
				//Don't let enemies attack enemies or let players attack players (also prevents entities from attacking themselves)
				if ((this.parent instanceof Enemy && curObj instanceof Enemy) || (this.parent instanceof Player && curObj instanceof Player)) {
					continue;
				}
				if (attackBox.isColliding(curObj)) {
					if (curObj instanceof Healthbar) continue;
					let radius = 100; //attackEfficacy is currently inversely linearly proportional to curObj's distance from the strike point. At (radius) pixels away, the attackEfficacy will be 0, at 0 pixels away, it will be 1 (max).
					let strikePoint = new Vector([this.x + (this.parent.flipped? -22 : 22), this.y + 19]);
					let attackEfficacy = Keyframe.getRawValue((radius - Util.pythagorean(strikePoint.x - curObj.x, 1/3 * (strikePoint.y - curObj.y)))/radius, "linear");
					console.log("Strike efficacy: " + attackEfficacy);
					curObj.health -= attackEfficacy * this.damage;
					let tempKnockback = new Vector([this.knockback.x, this.knockback.y]);
					this.knockback.multiply(attackEfficacy);
					curObj.takeKnockback(this);
					this.knockback = new Vector(tempKnockback.x, tempKnockback.y);
					if (curObj.health < 0 && this.parent instanceof Player) {
						this.awardPoints(curObj);
					}
					if (curObj instanceof Player) curObj.stunned = 15;
				}
			}
			for (let i = 0; i < 12; i++) {
				new Particle("spark", this.x + (22 * ((this.parent.flipped)? -1 : 1)), this.y + 19, 6, 6, new Vector([((Util.randInt(1) == 0)? 5 : -5) * Math.random(), Math.random() * -6]), 0.25);
			}
		}
	}
}