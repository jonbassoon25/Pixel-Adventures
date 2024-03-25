//Util Imports
import { VisualObject } from "../util/VisualObject.js";

//Sword, Mace, Claymore, 
//Weapon Class
export class MeleeWeapon extends VisualObject {
	//Constructor

	constructor(texture, parentObject, xOffset, yOffset, width, height, damage, reach, animationFrames = {}) {
		this.parent = parentObject;
		this.animationFrames["0"] = texture;
		this.
	}
}