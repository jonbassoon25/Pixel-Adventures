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
import { Particle } from "../gameEntities/Particle.js";

//Basic Object Imports
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { Vector } from "../util/Vector.js";

//Win Class
export class Win extends Gamestate {
	//Static Variables

	static dialogueBox = new DialogueBox(1920/2, 1080 * 3 / 4 + 80, 1920/2, 140);

	//*********************************************************************//
	//Private Static Methods
	
	static #updateParticles() {
		for (let i = Object.keys(ShadedObject.shadedObjects).length - 1; i >= 0; i--) {
			for (let j = 0; j < Object.values(ShadedObject.shadedObjects)[i].length; j++) {
				if (ShadedObject.shadedObjects[i][j] instanceof Particle) {
					//Update and draw the particle
					Object.values(ShadedObject.shadedObjects)[i][j].draw();
					Object.values(ShadedObject.shadedObjects)[i][j].update();
				}
			}
		}
	}
	//*********************************************************************//
	//Public Static Methods

	/** Initializes the Win gamestate to its default values */
	static init() {
		//Play win audio
		AudioPlayer.play("win");

		//Load win animations
		/*AnimationPlayer.load("educationShard");
		AnimationPlayer.load("progressShard");
		AnimationPlayer.load("serviceShard");*/

		//Load win animations
		AnimationPlayer.load("educationShardWin");
		AnimationPlayer.load("progressShardWin");
		AnimationPlayer.load("serviceShardWin");

		//Progress to win gamestate
		this.setScene("win");
	}

	/** Updates the Win Gamestate */
	static update() {
		//Draw background
		//Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		
		if (AnimationPlayer.isPlaying("serviceShardWin")) if (AnimationPlayer.getAnimation("serviceShardWin").frames == 150) {
			//First Shard
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 1000, 570, 6, 6, new Vector([-6 + (12 * Math.random()), Math.random() * 8]), 0.75, 0.975, true, false, false);
			}
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 840, 570, 6, 6, new Vector([-6 + (12 * Math.random()), Math.random() * 8]), 0.75, 0.975, true, false, false);
			}
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 750, 690, 6, 6, new Vector([-6 + (12 * Math.random()), Math.random() * 8]), 0.75, 0.975, true, false, false);
			}
			//Second Shard
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 900, 560, 6, 6, new Vector([-6 + (12 * Math.random()), Math.random() * -12]), 0.75, 0.975, true, false, false);
			}
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 970, 690, 6, 6, new Vector([-6 + (12 * Math.random()), Math.random() * -12]), 0.75, 0.975, true, false, false);
			}
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 1140, 720, 6, 6, new Vector([-6 + (12 * Math.random()), Math.random() * -12]), 0.75, 0.975, true, false, false);
			}
			//Third shard
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 958, 640, 6, 6, new Vector([-12 * Math.random(), Math.random() * -8]), 0.75, 0.975, true, false, false);
			}
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 1050, 500, 6, 6, new Vector([-12 * Math.random(), Math.random() * -8]), 0.75, 0.975, true, false, false);
			}
			for (let i = 0; i < 50; i++) {
				new Particle("sparkSlow", 990, 360, 6, 6, new Vector([-12 * Math.random(), Math.random() * -8]), 0.75, 0.975, true, false, false);
			}
			AnimationPlayer.load("congratulations");
		}
		if (AnimationPlayer.isPlaying("congratulations")) if (AnimationPlayer.getAnimation("congratulations").frames == 150) {
			//Load win text into dialogue box
			this.dialogueBox.displayText("You've found the shard of service!\nYou've reassembled the FBLA logo.\nThanks for playing!", 50);
		}
		//If the logo assembly animations have completed, draw a static image of the full FBLA logo and load text
		if (!AnimationPlayer.isPlaying("serviceShardWin")) {
			Display.draw("shard3", 1920/2, 1080/2, 540, 480);	
		}
		if (AnimationPlayer.currentAnimations.length == 0) {
			//If the dialogue box's continue button is pressed
			if (!this.dialogueBox.update()) {
				//Progress to saveScore scene
				this.setScene("initSaveScore");
			}
		}
		Win.#updateParticles();
	}
}