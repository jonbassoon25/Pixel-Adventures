//Util Imports
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Display } from "../util/Display.js";
import { Level } from "../util/Level.js";
import { Scene } from "../util/Scene.js";

//UI Object Imports
import { DialogueBox } from "../UIObjects/DialogueBox.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js"

//Cutscene Class
export class Cutscene extends Gamestate {
	//Static Variables

	static dialogueBox = new DialogueBox(1920/2, 1080 * 3 / 4 + 80, 1920/2, 140);

	//*********************************************************************//
	//Public Static Methods

	/** Initializes the Cutscene to its default values */
	static init() {
		super.init();
		
		//Load animations and dialogue box text
		switch(Level.level) {
			case 2:
				AnimationPlayer.load("educationShard");
				this.dialogueBox.displayText("You found the shard of education!\nYou've learned how to play the game.", 50);
				break;
			case 3:
				AnimationPlayer.load("educationShard");
				AnimationPlayer.load("progressShard");
				this.dialogueBox.displayText("You found the shard of progress!\nYou've advanced on your quest to reassemble the shards.\nOne more shard left!", 50);
				break;

		}

		this.setScene("cutscene");
	}

	/** Updates the Cutscene Gamestate */
	static update() {
		//Update SceneTiles and shaders
		Scene.drawBackground();

		//If animations are done playing, draw static images
		if (AnimationPlayer.currentAnimations.length == 0) {
			Display.draw((Level.level == 2)? "shard1" : "shard2", 1920/2, 1080/2, 540, 480);
		}

		//Update Dialogue box
		if(!this.dialogueBox.update()) {
			this.setScene("initShop");
		}
	}
}