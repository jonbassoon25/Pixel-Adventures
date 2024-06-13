//Util Imports
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Scene } from "../util/Scene.js";
import { Util } from "../util/Util.js";
import { Vector } from "../util/Vector.js";

//Game Entity Imports
import { Enemy } from "./Enemy.js";
import { Particle } from "./Particle.js";
import { Healthbar } from "../gameEntities/Healthbar.js";

//Gamestate Imports
import { Settings } from "../gamestates/Settings.js";

export class Slime extends Enemy {
	/*
	Notes:
		Special movement and drawing - bouncing instead of smooth movement
	*/

	//*********************************************************************//
	//Constructor - Must have JSDocs
	
	/**Creates a new slime */
	constructor(x, y) {
		super("slime", x, y, 30, 30, 100, 25, 100, 1000);
		this.type = "slime";
		this.visualWidth = this.width * 1.3;
		this.visualHeight = this.height * 1.3;
		this.idleTime = 0;
		if (Settings.debug) this.healthbar = new Healthbar(this);
	}

	//*********************************************************************//
	//Public Methods
	
	//Moves along the determined path to the target
	move() {
		//console.log("moving");
		if (this.isGrounded) {
			this.velocity.x = 0;
			if (this.currentAnimation == "jump") {
				this.setAnimation("land");
			}
		}
		if (this.idleTime <= 30) {
			return;
		}
		if (this.x%Scene.tileSize == 15 && this.isGrounded) {
			AudioPlayer.play("slime");
			if (this.currentAnimation == "idle") this.setAnimation("jump");
			this.accelerations.push(new Vector([2.4, -3]));
			return;
		}
		if (this.x%Scene.tileSize == (Scene.tileSize - 15) && this.isGrounded) {
			AudioPlayer.play("slime");
			if (this.currentAnimation == "idle") this.setAnimation("jump");
			this.accelerations.push(new Vector([-2.4, -3]));
			return;
		}
		//If there is no target, find a target
		if (this.target == null || this.target.length == 0) {
			this.findTarget();
		}
		//Basic movement, moves towards the target at all times regardless of physical surroundings
		if (!this.pathfinding) {
			this.simplePathfinding();
			return;
		}
	}
	
	//Simple pathfinding, can't navigate around obstacles. Uses jumping instead of smooth movement
	simplePathfinding() {
		//console.log("pathing");
		if (this.target == null) return;
		if (this.idleTime <= 15) return;
		if (this.x < this.target[0]) {
			if (!(this.velocity.x > this.speed)) {
				if (this.currentAnimation == "idle") this.setAnimation("jump");
				this.accelerations.push(new Vector([this.speed/90 * Util.randInt(1, 3), -7]));
				AudioPlayer.play("slime");
			}
		} else if (this.x > this.target[0]) {
			if (!(this.velocity.x < -this.speed)) {
				if (this.currentAnimation == "idle") this.setAnimation("jump");
				this.accelerations.push(new Vector([-this.speed/90 * Util.randInt(1, 3), -7]));
				AudioPlayer.play("slime");
			}
		} else {
			this.velocity.x = 0;
		}
		if (this.accelerations.length == 0) { return; }
		
		//Don't look for blocks if the NPC isn't in the bounds
		let col;
		let row;
		[col, row] = Scene.calcBlockCoordinates(this.x, this.y);
		if ((col < 1 || col >= Scene.structure[0].length - 1 || row < 1 || row >= Scene.structure.length - 1)) {
			return;
		}
	}
	delete() {
		let v = 3;
		for (let i = 0; i < 9; i++) {
			new Particle("slimeDeath", this.x + (10 * (Math.floor(i/3) - 1)), this.y + (10 * (Math.floor(i%3) - 1)), 12, 12, new Vector([v/9 * i - v/2, ((i % 3 == 2)? -2 * v/3 : -2 * Math.random() * v)]), 1.6, 0.95, true, true);
		}
		if (Settings.debug) this.healthbar.delete();
		super.delete();
	}
	update() {
		if (this.isGrounded) {
			this.idleTime++;
		} else {
			this.idleTime = Util.randInt(-15, 0);
		}
		super.update();
	}
}
