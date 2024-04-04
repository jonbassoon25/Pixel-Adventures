//Game Entity Imports
import { DynamicObject } from "./DynamicObject.js";
import { NPC } from "./NPC.js";

//Util Imports
import { Util } from "../util/Util.js";
import { Vector } from "../util/Vector.js";
import { Scene } from "../util/Scene.js";
import { Player } from "./Player.js";

export class Slime extends NPC {
	/*
	Notes:
		Special movement and drawing - bouncing instead of smooth movement
	*/

	//*********************************************************************//
	//Static Variables


	//*********************************************************************//
	//Private Static Methods - No required JSDocs


	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs


	//*********************************************************************//
	//Constructor - Must have JSDocs
	constructor(x, y) {
		super(x, y, 30, 30, 0, "slime", 100);
		this.idleTime = 0;
		this.stretch = 0;
		this.damage = 34;
	}

	//*********************************************************************//
	//Private Methods - No required JSDocs
	//Moves along the determined path to the target
	move() {
		if (this.isGrounded) {
			this.velocity.x = 0;
		}
		if (this.idleTime <= 30) {
			return;
		}
		if (this.x%Scene.tileSize == 15 && this.isGrounded) {
			this.accelerations.push(new Vector([2.4, -3]));
			return;
		}
		if (this.x%Scene.tileSize == (Scene.tileSize - 15) && this.isGrounded) {
			this.accelerations.push(new Vector([-2.4, -3]));
			return;
		}
		//console.log(this.x%Scene.tileSize);
		//If there is no target, find a target
		if (this.target.length == 0) {
			this.findTarget();
		}
		//Basic movement, moves towards the target at all times regardless of physical surroundings
		if (!this.pathfinding) {
			this.simplePathfinding();
			return;
		}
		/*
		if (this.path.length == 0) {
			//If the npc is within the wander distance of the target, allow the npc to wander
			if (this.x <= this.target[0] - this.wanderDistance && this.x >= this.target[0] + this.wanderDistance) {
				this.path.push(((this.x < this.target[0])? this.target[0] + this.wanderDistance : this.target[0] - this.wanderDistance));
			} else {
				//Calculate a new path because we aren't at the target and don't have a path
				this.calculatePath();
				return;
			}
		}
		*/
	}
	//Simple pathfinding, can't navigate around obstacles. Uses jumping instead of smooth movemenet
	simplePathfinding() {
		if (this.idleTime <= 30) return;
		if (this.x < this.target[0]) {
			if (!(this.velocity.x > this.speed)) {
				this.accelerations.push(new Vector([this.speed/90 * Util.randInt(1, 3), -7]));
			}
		} else if (this.x > this.target[0]) {
			if (!(this.velocity.x < -this.speed)) {
				this.accelerations.push(new Vector([-this.speed/90 * Util.randInt(1, 3), -7]));
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
		/* Slime is not smart enough to not fall off ledges
		//Don't let the NPC fall off of ledges
		for (let i = Scene.calcBlockCoordinates(this.x, this.y)[1]; i < Scene.structure.length; i++) {
			//If there is a tile under the next tile that the NPC is trying to move to
			//console.log(Scene.getTile(this.x + ((this.velocity.x > 0)? Scene.tileSize : -Scene.tileSize), i * Scene.tileSize).hasCollision);
			if (Scene.getTile(this.x + ((this.velocity.x > 0)? Scene.tileSize : -Scene.tileSize), i * Scene.tileSize).hasCollision) {
				//Let the NPC move
				return;
			}
		}
		//Don't let the NPC move because there are no tiles that it can move to
		this.accelerations = Util.delIndex(this.accelerations, this.accelerations.length - 1);
		this.velocity.x = 0;
		*/
	}
	

	//*********************************************************************//
	//Public Methods - Must have JSDocs

	findTarget() {
		//console.log("finding target");
		//The slime targets the closest player
		let distance = 1000;
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			if (DynamicObject.dynamicObjects[i] instanceof Player) {
				if (Math.abs(DynamicObject.dynamicObjects[i].x - this.x) < distance) {
					distance = Math.abs(DynamicObject.dynamicObjects[i].x - this.x);
					this.target = [DynamicObject.dynamicObjects[i].x, DynamicObject.dynamicObjects[i].y];
				}
			}
		}
	}
	update() {
		this.findTarget();
		if (this.isGrounded) {
			this.idleTime++;
		} else {
			this.idleTime = Util.randInt(-30, 0);
		}
		super.update();
	}

	//*********************************************************************//
	//Getters - No required JSDocs


	//*********************************************************************//
	//Setters - Must have JSDocs
}
