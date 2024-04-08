//Util Imports
import { Vector } from "../util/Vector.js";

//Game Object Imports
import { MeleeWeapon } from "./MeleeWeapon.js";

//Sword Class
export class Sword extends MeleeWeapon {
    //Constructor

    constructor(parentObject, damage) {
        super(parentObject, 12, 4, 80, 80, damage, 45, {"idle": {"0": "sword+0"}, "attack": {"1": "sword+15", "2": "sword+30", "3": "sword+45", "4": "sword+60", "5": "sword+75", "6": "sword+90", "7": "sword+75", "8": "sword+60", "10": "sword+45", "12": "sword+30", "14": "sword+15", "16": "sword+0"}, "jump": {"10000": "sword-90"}});
		this.knockback = new Vector([3, -2]);
    }

	upgrade() {
		super.upgrade(5);
	}
}