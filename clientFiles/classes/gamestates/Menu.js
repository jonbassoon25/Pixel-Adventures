//Util Imports
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Display } from "../util/Display.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Menu Class
export class Menu extends Gamestate {
	//Static Variables

	static playButton = new Button("playButton", 1920/2, 1080/2, 408, 144);
	
	static leaderboardButton = new Button("leaderboard", 1920/2, 1080/2 + 144 - 25, 408, 96);
	
	static helpButton = new Button("help", 1920/2, 1080/2 + 240, 408, 144);

	//*********************************************************************//
	//Public Static Methods

	/** Initializes the menu to its default values */
	static init() {
		super.init();
		//Load menu animations
		AnimationPlayer.load("pano", true, true);
		AnimationPlayer.load("fadeIn");
		this.setScene("menu", false);
	}

	/** Updates the Menu Gamestate */
	static update() {
		//Draw the main logo
		Display.draw("banner", 1920/2, 1080/2 - 150, 600, 300);

		//Update Buttons
		this.playButton.update();
		this.leaderboardButton.update();
		this.helpButton.update();

		//Check for button presses, change scene if button pressed
		if (this.playButton.isReleased()) {
			AnimationPlayer.clear();
			this.setScene("difficultySelect");
		}
		if (this.leaderboardButton.isReleased()) {
			AnimationPlayer.clear();
			this.setScene("initLeaderboard");
		}
		if (this.helpButton.isReleased()) {
			AnimationPlayer.clear();
			this.setScene("initHelp");
		}
		
	}
}