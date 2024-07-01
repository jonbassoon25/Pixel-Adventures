//Util Imports
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Vector } from "../util/Vector.js";

//Game Object Imports
import { Mace } from "../gameObjects/Mace.js";

//Game Entity Imports
import { Enemy } from "./Enemy.js";
import { Particle } from "./Particle.js";

//Basic Object Imports
import { AnimatedObject } from "../basicObjects/AnimatedObject.js";
import { Display } from "../util/Display.js";

//Template Class
export class Effigy extends Enemy {
	//Constructor

	constructor(x, y, onDeathTrigger) {
		super("effigy", x, y, 16, 56, 3, 70, 180, 400, 0.4);
		this.maxSpeed = this.speed;
		this.targetCompleteDistance = 50;
		this.visualWidth = 80;
		this.visualHeight = 75;
		this.weapon = new Mace(this, this.damage);
		this.weapon.knockback = new Vector([10, -4]);
		this.triggered = false;
		this.onDeathTrigger = onDeathTrigger;
		this.setAnimation("statue");
		this.weapon.setAnimation("dormant");
		//this.trigger();
	}

	//*********************************************************************//
	//Public Methods

	trigger() {
		this.triggered = true;
		AudioPlayer.play("effigyWake");
		this.setAnimation("maceCharge");
		this.weapon.setAnimation("charge");
	}

	die() {
		for (let i = 0; i < 12; i++) {
			new Particle("death", this.x, this.y, 12, 12, new Vector([((i < 6)? 1 : -1) * (Math.random() * 2 + 2), ((i < 6)? 1 : -1) * Math.random() * 3 - 2]), 0.75, 0.95, true, true, false);
		}
		if (this.onDeathTrigger != undefined) {
			for (let i = 0; i < this.onDeathTrigger.length; i++) {
				this.onDeathTrigger[i].trigger();
			}
		}
		this.delete();
	}

	delete() {
		super.delete();
		this.weapon.delete();
	}

	takeKnockback(weapon) {
		this.accelerations.push(new Vector([weapon.knockback.x * this.knockbackMultiplier * ((weapon.parent.x < this.x)? 1 : -1), 0]));
	}

	update() {
		if (!this.triggered) return;
		if (this.currentAnimation == "maceCharge") this.weapon.update(this.flipped, this.isGrounded);
		console.log(this.currentAnimation);
		console.log(this.weapon.currentFrame);
		if (this.weapon.currentAnimation == "charge") {
			Display.draw("effigy", this.x, this.y, 32, 56);
			//Increment the current frame
			this.currentFrame++;

			//If the current keyframe isn't correct
			if (true) {
				let possibleKeyframes = Object.values(AnimatedObject.globalAnimations[this.type][this.currentAnimation]);
				for (let i = 0; i < possibleKeyframes.length; i++) {
					if (this.currentFrame >= possibleKeyframes[i].startFrame && this.currentFrame < possibleKeyframes[i].endFrame) {
						this.currentKeyframe = possibleKeyframes[i];
						return;
					}
				}
				//No keyframe was found, loop if the last keyframe is of frame length 0
				let checkedFrame = possibleKeyframes[possibleKeyframes.length - 1];
				if (checkedFrame.endFrame - checkedFrame.startFrame == 0) {
					this.currentFrame = 0;
					this.currentKeyframe = possibleKeyframes[0];
					return;
				}
				//No keyframe was found, loop last frame if the last keyframe is of frame length -1
				checkedFrame = possibleKeyframes[possibleKeyframes.length - 1];
				if (checkedFrame.endFrame - checkedFrame.startFrame == -1) {
					//Stay on the last frame
					this.currentFrame--;
					//Current keyframe is the last keyframe in the animation
					this.currentKeyframe = possibleKeyframes[possibleKeyframes.length - 1];
					return;
				}
				//No keyframe was found and the keyframe doesn't loop
				this.resetAnimation();
			}
			return;
		}
		//Update mace
		this.weapon.update(this.flipped, this.isGrounded);
		if (this.weapon.currentAnimation == "attack") this.velocity.x = 0;
		super.update();
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
			if (this.weapon.currentAnimation == "idle" && Math.abs(this.target[0] - this.x) <= this.targetCompleteDistance) {
				this.weapon.attack();
			}
		}
	}
}