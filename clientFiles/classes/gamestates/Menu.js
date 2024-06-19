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
	
	static leaderboardButton = new Button("leaderboard", 1920/2, 1080/2 + 144 - 25 + 30, 408, 96);
	
	static helpButton = new Button("help", 1920/2, 1080/2 + 240 + 60, 408, 144);

	static settingsButton = new Button("settings", 1920 - 100, 1080 - 100, 128, 128);

	static firstLoad = true;
	
	//*********************************************************************//
	//Public Static Methods

	/** Initializes the menu to its default values */
	static init() {
		super.init();
		//Load menu animations
		AnimationPlayer.load("pano", true, true);
		if (Menu.firstLoad) {
			console.log("loaded");
			AnimationPlayer.load("flasher", true);
			Menu.firstLoad = false;
		}
		AnimationPlayer.load("fadeIn");
		this.setScene("menu", false);
	}

	/** Updates the Menu Gamestate */
	static update() {
		//Draw the main logo
		Display.draw("banner", 1920/2, 1080/2 - 150, 600, 300);
		//Draw button plaques
		/*
		Display.draw("buttonPlaque", 1920/2, 1080/2, 408, 176);
		Display.draw("buttonPlaque", 1920/2, 1080/2 + 144 - 25 + 30, 408, 176);
		Display.draw("buttonPlaque", 1920/2, 1080/2 + 240 + 60, 408, 176);
		*/
		//Update Buttons
		this.playButton.update();
		this.leaderboardButton.update();
		this.helpButton.update();
		this.settingsButton.update();

		//Check for button presses, change scene if button pressed
		if (this.playButton.isReleased()) {
			this.setScene("initGameSelection");
		}
		if (this.leaderboardButton.isReleased()) {
			this.setScene("initLeaderboard");
		}
		if (this.helpButton.isReleased()) {
			this.setScene("initHelp");
		}
		if (this.settingsButton.isReleased()) {
			this.setScene("initSettings");
		}
	}
}