//Util Imports
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Display } from "../util/Display.js";
import { Level } from "../util/Level.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { ShadedObject } from "../basicObjects/ShadedObject.js";


//Template Class
export class Lose extends Gamestate {
	/*
	Notes:
		- stuff
	*/

	//*********************************************************************//
	//Static Variables
	static returnButton = new Button("none", 1920/2, 1080/2 + 150, 1000, 144);

	//*********************************************************************//
	//Private Static Methods - No required JSDocs


	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs
	static init() {
		super.init();
		AnimationPlayer.load("fadeIn");
		AudioPlayer.play("lose");
		Display.clear();
		DynamicObject.clear();
		ShadedObject.clear();
		
		Level.level = 1;
		this.setScene("lose");
	}

	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		Display.drawText("you lost...", 1920/2 - "you lost...".length*60/2, 1080/2, 100, true, "black");
		if (!AnimationPlayer.isPlaying("fadeIn")) {
			Display.drawText("click to return", 1920/2 - "click to return".length*60/2, 1080/2 + 250, 100, true, "black");
			if (this.returnButton.subsistAsButton()) {
				AnimationPlayer.clear();
				this.setScene("initMenu");
			}
		}
	}
	//*********************************************************************//
	//Constructor - Must have JSDocs


	//*********************************************************************//
	//Private Methods - No required JSDocs


	//*********************************************************************//
	//Public Methods - Must have JSDocs


	//*********************************************************************//
	//Getters - No required JSDocs


	//*********************************************************************//
	//Setters - Must have JSDocs


}