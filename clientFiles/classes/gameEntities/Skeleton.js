//Util Imports
import { Display } from "../util/Display.js";
//UI Object Imports

//Player Imports

//Game Object Imports
import { Sword } from "../gameObjects/Sword.js";

//Game Entity Imports
import { Enemy } from "./Enemy.js";


//Template Class
export class Skeleton extends Enemy {
	//Constructor

	constructor(x, y) {
		super("none", x, y, 16, 52, 2, 50, 120, 300, 0.75);
		this.targetCompleteDistance = 50;
		this.visualWidth = 80;
		this.visualHeight = 80;
		this.weapon = new Sword(this, this.damage);
		this.weapon.animations["attack"]["40"] = "sword+0";
		this.weapon.relY = 6;
	}

	//*********************************************************************//
	//Private Methods



	//*********************************************************************//
	//Public Methods

	

	draw() {
		//Draws this skeleton with correct animation state
		this.weapon.update(this.facingLeft, this.isGrounded);
		if (!this.isGrounded) {
			Display.draw("skeletonJump", this.visualX, this.visualY, 34, 52, true, this.facingLeft);
		} else if (this.velocity.x == 0 || (Display.frames % 20) < 10) {
			Display.draw("skeleton", this.visualX, this.visualY, 34, 52, true, this.facingLeft);
		} else {
			Display.draw("skeletonWalk", this.visualX, this.visualY, 34, 52, true, this.facingLeft);
		}
	}

	update() {
		super.update();
		if (this.target == null) return;
		this.facingLeft = this.target[0] < this.x;
		if (Math.abs(this.target[0] - this.x) <= this.targetCompleteDistance) {
			this.weapon.attack();
		}
	}
	

	//*********************************************************************//
	//Getters


	//*********************************************************************//
	//Setters


}