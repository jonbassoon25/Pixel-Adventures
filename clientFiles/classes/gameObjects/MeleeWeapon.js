//Util Imports
import { Display } from "../util/Display.js";
import { VisualObject } from "../util/VisualObject.js";
import { AnimationPlayer } from "../util/AnimationPlayer.js";

//Sword, Mace, Claymore, Dual Knives
//Weapon Class
export class MeleeWeapon extends VisualObject {
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
	constructor(parentObject, relX, relY, width, height, damage, reach, animations) {
		super("none", parentObject.x, parentObject.y, width, height);
		this.parent = parentObject;
		this.animations = animations;
		if (this.animations["idle"] == undefined || this.animations["idle"].length == 0) {
			this.animations["idle"] = {"20": "placeholder"};
		}
		this.damage = damage;
		this.reach = reach;
		this.relX = relX;
		this.relY = relY;
		this.animationName = "idle";
		this.animationFrame = 0;
	}

	//*********************************************************************//
	//Private Methods

	#drawAnimationFrame(flipped = false) {
		let currentAnimation = this.animations[this.animationName];
		let currentAnimationTimes = Object.keys(currentAnimation);
		//If the frame is more than the highest animation frame
		if (this.animationFrame > currentAnimationTimes[currentAnimationTimes.length - 1]) {
			//Set the frame to 0 and use the idle animation
			this.animationFrame = 0;
			this.animationName = "idle";
			//Reinitialize the variables to draw the correct animation
			currentAnimation = this.animations[this.animationName];
			currentAnimationTimes = Object.keys(currentAnimation);
		}

		//For every keyframe in the animation
		for (let i = 0; i < currentAnimationTimes.length; i++) {
			//If the frame is less than or equal to the current animation time, draw the frame and don't draw any more
			if (this.animationFrame <= currentAnimationTimes[i]) {
				Display.draw(currentAnimation[currentAnimationTimes[i]] + ((flipped)? "Flipped": ""), this.x - ((flipped)? (this.width/2 - 15): 0), this.y - ((this.animationName == "jump")? 20 : 0), this.width, this.height);
				this.animationFrame++;
				return;
			}
		}

		//No image was drawn this frame
		console.error("Animation Error: No Image Drawn");
	}

	//*********************************************************************//
	//Public Methods

	attack() {
		if (this.animationName == "attack") return;
		this.animationName = "attack";
	}

	cancelAttack() {
		this.animationName = "idle";
	}

	jumpAnim() {
		if (this.animationName == "jump") return;
		this.animationName = "jump";
	}

	/** Updates and Draws this MeleeWeapon */
	update(flipped = false, grounded = false) {
		if (!grounded) this.animationName = "jump";
		if (this.animationName == "jump" && grounded) this.animationName = "idle";
		this.#drawAnimationFrame(flipped);
	}

	upgrade(amount) {
		this.damage += amount;
	}

	//*********************************************************************//
	//Getters

	get x() {
		return this.parent.x + this.relX;
	}

	get y() {
		return this.parent.y + this.relY;
	}

	//*********************************************************************//
	//Setters

	set x(val) {}
	set y(val) {}
}