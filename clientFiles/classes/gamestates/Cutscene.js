//Util Imports
import { AudioPlayer } from "../util/AudioPlayer.js";
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";

//UI Object Imports
import { DialogueBox } from "../UIObjects/DialogueBox.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js"
import { Game } from "./Game.js";

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
		switch(Game.level) {
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
		AudioPlayer.play("door");

		this.setScene("cutscene");
	}

	/** Updates the Cutscene Gamestate */
	static update() {
		//Update SceneTiles and shaders
		Scene.drawBackground();

		Scene.drawShadedObjects();

		//If animations are done playing, draw static images
		if (AnimationPlayer.currentAnimations.length == 0) {
			Display.draw((Game.level == 2)? "shard1" : "shard2", 1920/2, 1080/2, 540, 480);
		}

		//Update Dialogue box
		if(!this.dialogueBox.update()) {
			this.setScene("initShop");
		}
	}
}