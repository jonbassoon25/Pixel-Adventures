//Util imports
import { Display } from "../util/Display.js";

//Game Object imports
import { SceneTile } from "./SceneTile.js";

//LightTile class
export class LightTile extends SceneTile {
	//Constructor

	/**
	@param {string} background - background for the light tile
	@param {number} row - row of the LightTile
	@param {number} col - column of the LightTile
	@param {number} strength - max strength of light tile (max 20)
	@param {number} radius - radius where light output is 0
	*/
	constructor(background, col, row, strength, radius, hasCollision = false) {
		super(background, col, row, hasCollision);
		this.type = "LightTile";
		this.str = strength;
		this.rad = radius;
	}

	//*********************************************************************//
	//Public Methods

	/** Updates this LightTile */
	update() {
		super.update();
		Display.draw("placeholder", this.x, this.y, this.width/3, this.height/3);
	}

	//*********************************************************************//
	//Getters

	get strength() {
		return this.str;
	}

	get radius() {
		return this.rad;
	}
	

	//*********************************************************************//
	//Setters

	set strength(value) {
		if (value > 20) {
			this.str = 20;
		} else if (value < 0) {
			this.str = 0;
		} else {
			this.str = value;
		}
	}

	set radius(value) {
		if (value < 0) {
			this.rad = 0;
		} else {
			this.rad = value;
		}
	}
	
}