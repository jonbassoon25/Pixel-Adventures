//Util Imports
import { Vector } from "../util/Vector.js";
import { Util } from "../util/Util.js";

//Basic Object Imports
import { AnimatedObject } from "../basicObjects/AnimatedObject.js";
import { VisualObject } from "../basicObjects/VisualObject.js";

//Sword, Mace, Claymore, Dual Knives
//Weapon Class
export class MeleeWeapon extends AnimatedObject {
	//Constructor

	/**
	 * @param {VisualObject} parentObject - VisualObject that this MeleeWeapon is linked to
	 * @param {number} relX - X position relative to the parent object
	 * @param {number} relY - Y position relative to the parent object
	 * @param {number} width - Width of this MeleeWeapon
	 * @param {number} height - Height of this MeleeWeapon
	 * @param {number} damage - Damage of this MeleeWeapon (1 - 100)
	 * @param {number} reach - Reach of this MeleeWeapon in px
	 * @param {Object} animations - Animations that this weapon has. Formatted as {"name": {"length": imageName}}. Must have idle animation
	 */
	constructor(parentObject, width, height, damage, reach, type, orderNum = 3) {
		super(type, orderNum, 0, 0, width, height);
		this.parent = parentObject;
		this.damage = damage;
		this.reach = reach;
		this.visualWidth = 2 * width; //For flipping
		this.knockback = new Vector([2.5, -4]);
		this.flipped = false;
	}

	//*********************************************************************//
	//Private Methods

	

	//*********************************************************************//
	//Public Methods

	//Generic attack function
	attack() {
		if (this.currentAnimation != "idle") return;
		this.setAnimation("attack");
	}

	draw() {
		if (this.parent.isDead) {
			return;
		}
		this.currentKeyframe.draw(this.currentFrame, this.parent.x, this.y, this.flipped, true);
	}
	awardPoints(curObj) {
		if (curObj.type == "slime") {
			this.parent.points += 500;
		} else if (curObj.type == "skeleton") {
			this.parent.points += 1500;
		} else if (curObj.type == "effigy") {
			this.parent.points += 2500;
		} else {
			console.error("Type: " + curObj.type + " not recognized as enemy. No points awarded.")
		}
	}

	/*jumpAnim() {
		if (this.currentAnimation == "jump") return;
		this.setAnimation("jump");
	}*/

	/** Updates this MeleeWeapon */
	update(flipped = this.parent.flipped, grounded = this.parent.isGrounded, onlyCallSuper = false) {
		if (onlyCallSuper) {
			super.update(false); 
			return;
		}
		this.flipped = flipped;
		if (this.currentAnimation == "jump" && grounded) this.setAnimation("idle");
		super.update();
	}

	upgrade(amount) {
		this.damage += amount;
	}

	//*********************************************************************//
	//Getters

	//x = this.getValue(frame, , this.finalPosition[0] * ((flipped && hasParent)? -1 : 1), this.xTransitionType) + xOffset;
	
	get x() {
		return this.currentKeyframe.getValue(this.currentFrame, this.currentKeyframe.initialPosition[0] * ((this.parent.flipped)? -1 : 1), this.currentKeyframe.finalPosition[0] * ((this.parent.flipped)? -1 : 1), this.currentKeyframe.xTransitionType) + this.parent.x;
	}

	get y() {
		return this.currentKeyframe.getValue(this.currentFrame, this.currentKeyframe.initialPosition[1], this.currentKeyframe.finalPosition[1], this.currentKeyframe.yTransitionType) + this.parent.y;
	}

	//*********************************************************************//
	//Setters

	set x(val) {}
	set y(val) {}
}