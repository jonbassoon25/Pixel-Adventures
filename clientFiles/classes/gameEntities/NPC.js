//Util Imports
import { Scene } from "../util/Scene.js";
import { Vector } from "../util/Vector.js";
import { Util } from "../util/Util.js";

//Game Entity Imports
import { DynamicObject } from "./DynamicObject.js";

//NPC Class
export class NPC extends DynamicObject {
	//Constructor
	constructor(x, y, width = 30, height = 30, wanderDistance = 0) {
		super("placeholder", x, y, width, height);
		//Maximum speed of the enemy in px/frame
		this.speed = 2;
		this.jumpspeed = 7.5;
		//Enable or disable pathfinding
		this.pathfinding = false;
		//Radius around the target / path value is where it is considered to be reached, in px
		this.targetCompleteDistance = 5;
		//Final target of the enemy
		this.target = [];
		//Calculated path to reach the target
		this.path = [];
		//Distance that the npc is allowed to wander around its target point
		this.wanderDistance = wanderDistance;
	}

	//*********************************************************************//
	//Private Methods

	//Moves along the determined path to the target
	#move() {
		//If there is no target, find a target
		if (this.target.length == 0) {
			this.findTarget();
		}
		//Basic movement, moves towards the target at all times regardless of physical surroundings
		if (!this.pathfinding) {
			this.#simplePathfinding();
			return;
		}
		
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
		
		if (this.y > this.path[0][1] + this.velocity.y && this.isGrounded) {
			this.velocity.y = -this.jumpspeed;
		}
		if (this.x < this.path[0][0] - this.targetCompleteDistance) {
			if (!(this.velocity.x > this.speed)) {
				this.accelerations.push(new Vector([this.speed/((this.velocity.x < 0)? 5 : 20), 0]));
			}
		} else if (this.x > this.path[0][0] + this.targetCompleteDistance) {
			if (!(this.velocity.x < -this.speed)) {
				this.accelerations.push(new Vector([-this.speed/((this.velocity.x > 0)? 5 : 20), 0]));
			}
		} else {
			this.velocity.x = 0;
			this.path = Util.delIndex(this.path, 0);
		}
	}

	//Simple pathfinding, can't navigate around obstacles
	#simplePathfinding() {
		if (this.x < this.target[0]) {
			if (!(this.velocity.x > this.speed)) {
				this.accelerations.push(new Vector([this.speed/((this.velocity.x < 0)? 5 : 20), 0]));
			}
		} else if (this.x > this.target[0]) {
			if (!(this.velocity.x < -this.speed)) {
				this.accelerations.push(new Vector([-this.speed/((this.velocity.x > 0)? 5 : 20), 0]));
			}
		} else {
			this.velocity.x = 0;
		}
		if (this.y - this.height/2 > this.target[1] && this.isGrounded) {
			this.velocity.y = -this.jumpspeed;
		}
		if (this.accelerations.length == 0) { return; }
		//Don't look for blocks if the NPC isn't in the bounds
		let col;
		let row;
		[col, row] = Scene.calcBlockCoordinates(this.x, this.y);
		if ((col < 1 || col >= Scene.structure[0].length - 1 || row < 1 || row >= Scene.structure.length - 1)) {
			return;
		}
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
	}

	//Calculate the possibilities from this path, yield each path in order for them to be added to unresolved paths. Reject the promise if the path is resolved. Path is resolved if there aren't any possible places to move to or if the path has reached the target
	#calculateNext(unresolvedPath) {
		//console.log(Util.clone(unresolvedPath));
		
		//Define the current tile
		let currentTile = Scene.structure[unresolvedPath[unresolvedPath.length - 1][1]][unresolvedPath[unresolvedPath.length - 1][0]];

		//Set up array for possible moves
		let possibleMoves = [];

		//Add any possible moves that the NPC could make from this tile to the possibleMoves array
		//3 * 2 == 6, there are 6 possible places that the NPC could move to if there were no restrictions (2 columns of 3 rows)
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 2; j++) {
				let targetCol = currentTile.col - 1 + 2 * j //2 * j to ignore column that the NPC is standing on (npc cannot move up or down)
				let targetRow = currentTile.row - 1 + i;

				//console.log("checking " + targetCol + ", " + targetRow);

				//If col or row are outside of the bounds of the scene structure (including top row), ignore the tile
				if (targetRow < 1 || targetRow >= Scene.structure.length || targetCol < 0 || targetCol >= Scene.structure[0].length) {
					//console.log(1);
					continue;
				}

				let targetTile = Scene.structure[targetRow][targetCol];
				
				//Checks to see if the position is a valid spot to move

				//Ignore tiles already in path
				let tileInPath = false;
				for (let k = 0; k < unresolvedPath.length; k++) {
					if (unresolvedPath[k][0] == targetTile.col && unresolvedPath[k][1] == targetTile.row) {
						tileInPath = true;
						break;
					}
				}
				if (tileInPath) {
					//console.log(2);
					continue;
				}

				//Ignore tiles without collision
				if (!targetTile.hasCollision) {
					//console.log(3);
					continue;
				}

				//Ignore tiles with a collision tile on top of them
				if (Scene.structure[targetRow - 1][targetCol].hasCollision) {
					//console.log(4);
					continue;
				}

				//Ignore upper left and upper right tiles if the tile above the NPC has collision

				//If there is a tile above the npc, do the check
				if (targetRow - 2 >= 0) {
					//If the tile above the player has collision and the targetTile is on the top row ignore the tile
					if (Scene.structure[targetRow - 2][targetCol].hasCollision && i == 0) {
						//console.log(5);
						continue;
					}
				}
				//console.log("Valid tile");

				//All checks have been passed, add targetTile's position to possibleMoves
				possibleMoves.push([targetTile.col, targetTile.row]);
			}
		}

		//If there are no possible moves, return an empty rejected promise
		if (possibleMoves.length == 0) {
			return Promise.reject([]);
		}
		
		let finalTarget = [Math.floor(this.target[0] / Scene.tileSize) - 1, Math.floor(this.target[1] / Scene.tileSize)];

		let unresolvedPaths = [];
		while (possibleMoves.length > 0) {
			//If any of the possible moves brings us to the target, resolve the path
			if (/*unresolvedPath.length > 4 ||*/ (possibleMoves[0][0] == finalTarget[0] && possibleMoves[0][1] == finalTarget[1])) {
				return Promise.resolve(unresolvedPath);
			}

			//Duplicate the unresolvedPath for each possible move and add them together, then add it to unresolvedPaths
			let newPath = Util.clone(unresolvedPath);
			newPath.push(possibleMoves[0]);
			unresolvedPaths.push(newPath);
			possibleMoves = Util.delIndex(possibleMoves, 0);
		}
		//Add the last possible move to the unresolved path and push it to unresolvedPaths
		return Promise.reject(unresolvedPaths);
	}

	//Finds all possible paths to the target
	async #calculatePaths() {
		let unresolvedPaths = [];
		let resolvedPaths = [];

		//if the NPC is outside of the screen bounds, don't do anything
		if (this.x < 0 || this.x > 1920 || this.y < 0 || this.y > 1080) {
			console.warn("NPC OUT OF BOUNDS:\n\tMoving NPC to 0, 0");
			this.x = 20;
			this.y = 20;
		}

		//create path with tile below this npc, use row col not x y, and add to unresolvedPaths
		unresolvedPaths.push([[Math.round(this.x / Scene.tileSize) - 1, Math.round(this.y / Scene.tileSize)]]);

		//While there are unresolved paths

		let maxRunning = 0;
		let reps = 0;
		while (unresolvedPaths.length > 0 && reps < 10000) {
			//If there aren't any unresolved paths, allow present calculations to finish
			if (unresolvedPaths.length == 0) {
				continue;
			}
			//Calculate the path, use a then to handle the return
			await this.#calculateNext(unresolvedPaths[0]).then(
				(resolvedPath) => {
					resolvedPaths.push(resolvedPath);
				},
				(newUnresolvedPaths) => {
					unresolvedPaths.push(...newUnresolvedPaths);
				}
			);
			//Remove the old unresolved path from the list of unresolved paths
			unresolvedPaths = Util.delIndex(unresolvedPaths, 0);
			reps++;
		}
		if (reps >= 10000) {
			console.warn("Too many paths, stopped early");
		}
		return resolvedPaths;
	}

	//*********************************************************************//
	//Public Methods

	/** Finds the best path to the target */
	async calculatePath() {
		let paths = await this.#calculatePaths();

		if (paths.length == 0) {
			console.warn("No valid path to target: " + [Math.floor(this.target[0] / Scene.tileSize) - 1, Math.floor(this.target[1] / Scene.tileSize)]);
			this.path = [];
			return;
		}

		let path = paths[0];
		for (let i = 1; i < paths.length; i++) {
			if (paths[i].length < path.length) {
				path = paths[i];
			}
		}

		for (let i = 0; i < path.length; i++) {
			path[i] = [path[i][0] * Scene.tileSize + Scene.tileSize/2, (path[i][1] - 1) * Scene.tileSize + Scene.tileSize/2];
		}

		this.path = Util.delIndex(path, 0);
	}

	/** Finds the target point for the NPC to move to */
	findTarget() {
		this.target = [100, 60];
		//this.target = [460, 420];
	}

	/** Updates the NPC */
	update() {
		this.#move();
		super.update();
	}
}