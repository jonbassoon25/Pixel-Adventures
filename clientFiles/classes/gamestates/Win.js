//Util Imports
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Display } from "../util/Display.js";

//UI Object Imports
import { DialogueBox } from "../UIObjects/DialogueBox.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Game Object Imports

//Game Entity Imports

//Win Class
export class Win extends Gamestate {
	//Static Variables

	static dialogueBox = new DialogueBox(1920/2, 1080 * 3 / 4 + 80, 1920/2, 140);

	//*********************************************************************//
	//Public Static Methods

	/** Initializes the Win gamestate to its default values */
	static init() {
		//Play win audio
		AudioPlayer.play("win");

		//Load win animations
		AnimationPlayer.load("educationShard");
		AnimationPlayer.load("progressShard");
		AnimationPlayer.load("serviceShard");

		//Load win text into dialogue box
		this.dialogueBox.displayText("You've found the shard of service!\nYou've reassembled the FBLA logo. Congratulations!\nThanks for playing!", 50);

		//Progress to win gamestate
		this.setScene("win");
	}

	/** Updates the Win Gamestate */
	static update() {
		//Draw background
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);

		//If the dialogue box's continue button is pressed
		if (!this.dialogueBox.update()) {
			//Progress to saveScore scene
			this.setScene("initSaveScore");
		}
		
		//If there are no more animations, draw a static image
		if (AnimationPlayer.currentAnimations.length == 0) {
			Display.draw("shard3", 1920/2, 1080/2, 540, 480);
		}
	}
}