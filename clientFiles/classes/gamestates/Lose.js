//Util Imports
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Display } from "../util/Display.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";
import { Game } from "./Game.js";

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
	static returnButton = new Button("none", 1920/2, 1080/2 + 180, 742, 56);

	//*********************************************************************//
	//Private Static Methods - No required JSDocs


	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs
	static init() {
		super.init();
		AnimationPlayer.load("fadeIn");
		AnimationPlayer.loadPack("death");
		AudioPlayer.play("lose");
		Display.clear();
		DynamicObject.clear();
		ShadedObject.clear();
		
		Game.level = 1;
		this.setScene("lose");
	}

	static update() {
		if (AnimationPlayer.currentAnimations.length == 0) {
			Display.draw("skull", 1920/2, 1080/2 - 200, 420, 420);
			Display.draw("youDied", 1920/2, 1080/2 + 50, 570, 80);
			Display.draw("redGrave", 1920/2 - 400, 1080 - 120, 240, 240);
			Display.draw("blueGrave", 1920/2 + 400, 1080 - 120, 240, 240);
			Display.draw("clickToReturn", 1920/2, 1080/2 + 180, 742, 56);
		}
		if (AnimationPlayer.isPlaying("clickToReturn")) {
			if (AnimationPlayer.getAnimation("clickToReturn").frames > 150) {
				if (this.returnButton.subsistAsButton()) {
					AnimationPlayer.clear();
					this.setScene("initMenu");
				}
			}
		} else {
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