//Util Imports
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Display } from "../util/Display.js";

//UI Object Imports
import { BackButton } from "../UIObjects/BackButton.js";
import { Button } from "../UIObjects/Button.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Help Class
export class Help extends Gamestate {
	//Static Variables

	static backButton = new BackButton(150, 100);

	static redPlayerButton = new Button("redPlayer", 1920/2 - 450, 1080/2, 600, 600);

	static bluePlayerButton = new Button("bluePlayerFlipped", 1920/2 + 450, 1080/2, 600, 600);

	static substate = "help";

	//*********************************************************************//
	//Public Static Methods

	/** Initializes the help menu to its default values */
	static init() {
		super.init();
		this.setScene("help");
	}

	/** Updates the Help Gamestate */
	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		
		switch (this.substate) {
			case "help":
				if (this.backButton.subsistAsButton()) this.setScene("initMenu");

				let redUpdate = true;
				let blueUpdate = true;
				//Draw needed static images if animations aren't playing
				for (let i = 0; i < AnimationPlayer.currentAnimations.length; i++) {
					let curAnimation = AnimationPlayer.currentAnimations[i];
					if (curAnimation.name == "redHelpReturn") {
						//Don't draw the red player
						redUpdate = false;
					}
					if (curAnimation.name == "blueHelpReturn") {
						//Don't draw the blue player
						blueUpdate = false;
					}
				}

				if (redUpdate) this.redPlayerButton.update();
				if (blueUpdate) this.bluePlayerButton.update();
				
				if (this.redPlayerButton.isReleased()) {
					AnimationPlayer.clear();
					AnimationPlayer.load("redHelp");
					this.substate = "redHelp";
				}
				if (this.bluePlayerButton.isReleased()) {
					AnimationPlayer.clear();
					AnimationPlayer.load("blueHelp");
					this.substate = "blueHelp";
				}
				break;
			case "redHelp":
				if (this.backButton.subsistAsButton()) {
					AnimationPlayer.clear();
					AnimationPlayer.load("redHelpReturn");
					this.substate = "help";
				}
				
				//If the animation is done, draw a static image
				if (AnimationPlayer.currentAnimations.length == 0) Display.draw("redPlayer", 1920/2, 1080/2, 600, 600);
				
				//Update blue player button
				let blueUpdate2 = true;
				for (let i = 0; i < AnimationPlayer.currentAnimations.length; i++) {
					let curAnimation = AnimationPlayer.currentAnimations[i];
					if (curAnimation.name == "blueHelpReturn") {
						//Don't draw the blue player
						blueUpdate2 = false;
					}
				}

				if (blueUpdate2) this.bluePlayerButton.update();
					
				if (this.bluePlayerButton.isReleased()) {
					AnimationPlayer.clear();
					AnimationPlayer.load("redHelpReturn");
					AnimationPlayer.load("blueHelp");
					this.substate = "blueHelp";
				}
				
				//Draw instruction text
				Display.drawText("The red player", 1920/2 - 600, 1080/2 - 50, 20, true, "white");
				Display.drawText("uses WAD to move,", 1920/2 - 600, 1080/2 - 10, 20, true, "white");
				Display.drawText("S to interact,", 1920/2 - 600, 1080/2 + 30, 20, true, "white");
				Display.drawText("and F to attack.", 1920/2 - 600, 1080/2 + 70, 20, true, "white");
				break;
			case "blueHelp":
				if (this.backButton.subsistAsButton()) {
					AnimationPlayer.clear();
					AnimationPlayer.load("blueHelpReturn");
					this.substate = "help";
				}
				
				//If the animation is done, draw a static image
				if (AnimationPlayer.currentAnimations.length == 0) Display.draw("bluePlayerFlipped", 1920/2, 1080/2, 600, 600);

				//Update red player button
				let redUpdate2 = true;
				for (let i = 0; i < AnimationPlayer.currentAnimations.length; i++) {
					let curAnimation = AnimationPlayer.currentAnimations[i];
					if (curAnimation.name == "redHelpReturn") {
						//Don't draw the red player
						redUpdate2 = false;
					}
				}

				if (redUpdate2) this.redPlayerButton.update();
				
				if (this.redPlayerButton.isReleased()) {
					AnimationPlayer.clear();
					AnimationPlayer.load("blueHelpReturn");
					AnimationPlayer.load("redHelp");
					this.substate = "redHelp";
				}

				//Draw instruction text
				Display.drawText("The blue player uses", 1920/2 + 600 - "the blue player uses".length * 20 * 0.6, 1080/2 - 50, 20, true, "white");
				Display.drawText("arrow keys to move,", 1920/2 + 600 - "arrow keys to move".length * 20 * 0.6, 1080/2 - 10, 20, true, "white");
				Display.drawText("down to interact,", 1920/2 + 600 - "down to interact".length * 20 * 0.6, 1080/2 + 30, 20, true, "white");
				Display.drawText("and / to attack.", 1920/2 + 600 - "and / to attack".length * 20 * 0.6, 1080/2 + 70, 20, true, "white");
				break;
		}
	}
}