//Game Entity Imports
import { Enemy } from "./Enemy.js";

//Util Imports
import { Util } from "../util/Util.js";
import { Vector } from "../util/Vector.js";
import { Scene } from "../util/Scene.js";



export class Slime extends Enemy {
	/*
	Notes:
		Special movement and drawing - bouncing instead of smooth movement
	*/

	//*********************************************************************//
	//Constructor - Must have JSDocs
	
	/**Creates a new slime */
	constructor(x, y) {
		super("slime", x, y, 30, 30, 100, 30, 100, 1000);
		this.stretch = 0; //Not used
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
		if (this.target == null) return;
		if (this.idleTime <= 15) return;
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
	}
	

	//*********************************************************************//
	//Public Methods - Must have JSDocs

	
	
}
