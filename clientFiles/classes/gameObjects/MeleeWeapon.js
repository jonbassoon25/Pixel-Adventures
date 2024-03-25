//Util Imports
import { VisualObject } from "../util/VisualObject.js";

//Sword, Mace, Claymore, Dual Knives
//Weapon Class
export class MeleeWeapon extends VisualObject {
	//Constructor

	constructor(parentObject, relX, relY, width, height, damage, reach, animations) {
		super("none", relX, relY, width, height);
		this.parent = parentObject;
		this.animations = animations;
		if (this.animations["idle"] == undefined || this.animations["idle"].length == 0) {
			this.animations["idle"] = {"0": "placeholder"};
		}
		this.damage = damage;
		this.reach = reach;
		this.currentAnimation = "idle";
		this.animationFrame = 0;
	}

	//*********************************************************************//
	//Private Methods

	#drawAnimationFrame() {
		if (frame >= this.animations[this.currentAnimation][toString(this.animationFrame)].length) {
			this.animationFrame = 0;
			this.currentAnimation = "idle";
			this.#drawAnimationFrame();
			return;
		}
	}

	//*********************************************************************//
	//Public Methods

	attack() {
		
	}

	/** Updates and Draws this MeleeWeapon */
	update() {
		this.#drawAnimationFrame();
	}
}