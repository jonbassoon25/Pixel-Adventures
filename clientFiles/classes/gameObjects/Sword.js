//Util Imports
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Vector } from "../util/Vector.js";

//Game Object Imports
import { MeleeWeapon } from "./MeleeWeapon.js";

//Game Entity Imports
import { Enemy } from "../gameEntities/Enemy.js";
import { Player } from "../gameEntities/Player.js";
import { Healthbar } from "../gameEntities/Healthbar.js";

//Basic Object Imports
import { VisualObject } from "../basicObjects/VisualObject.js";
import { DynamicObject } from "../basicObjects/DynamicObject.js";

//Sword Class
export class Sword extends MeleeWeapon {
    //Constructor
    constructor(parentObject, damage = 10) {
		let type;
		if (parentObject.type.length >= "redPlayer".length && (parentObject.type.substring(0, 3) == "red" || parentObject.type.substring(0, 4) == "blue")) {
			type = "playerSword";
		} else {
			type = parentObject.type + "Sword";
		}
		
        super(parentObject, 80, 80, damage, 35, type);
		
		this.knockback = new Vector([3, -2]);
    }

	upgrade() {
		super.upgrade(5);
	}
	attack() {
		if (this.currentAnimation == "idle") {
			AudioPlayer.play("swordSwing");
		}
		super.attack();
	}
	update(flipped = false, grounded = false) {
		super.update(flipped, grounded);
		//Await specific frame of attack animation prior to dealing damage
		if (this.currentAnimation == "attack" && (this.currentFrame == 4 || this.currentFrame == 12)) {
			let attackBox = new VisualObject("none", this.parent.x + ((this.parent.flipped)? -this.reach/2 : this.reach/2), this.parent.y, this.reach, this.parent.height);
			//attackBox.update();
			for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
				let curObj = DynamicObject.dynamicObjects[i];
				//Don't let enemies attack enemies or let players attack players (also prevents entities from attacking themselves)
				if ((this.parent instanceof Enemy && curObj instanceof Enemy) || (this.parent instanceof Player && curObj instanceof Player)) {
					continue;
				}
				if (attackBox.isColliding(curObj)) {
					if (curObj.type == "effigy" && curObj.currentAnimation == "statue") continue;
					if (curObj instanceof Healthbar) continue;
					curObj.health -= this.damage;
					curObj.takeKnockback(this);
					if (curObj.health <= 0 && this.parent instanceof Player) {
						this.awardPoints(curObj);
					}
				}
			}
		}
	}
}