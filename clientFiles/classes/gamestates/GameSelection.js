//Util Imports
import { Display } from "../util/Display.js";

//UI Object Imports
import { BackButton } from "../UIObjects/BackButton.js";
import { Button } from "../UIObjects/Button.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Game Selection Class
export class GameSelection extends Gamestate {
	//Static Variables

	static backButton = new BackButton(150, 100);
	static singlePlayer = new Button("placeholder", 1920/2, 500, 200, 100);
	static localMultiplayer = new Button("placeholder", 1920/2, 650, 200, 100);
	static onlineMultiplayer = new Button("placeholder", 1920/2, 800, 200, 100);

	//*********************************************************************//
	//Public Static Methods

	static init() {
		super.init();
		
		this.setScene("gameSelection");
	}

	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		
		if (this.singlePlayer.subsistAsButton()) {
			this.setScene("initSinglePlayerDifficultySelect");
		}

		if (this.localMultiplayer.subsistAsButton()) {
			this.setScene("initDifficultySelect");
		}
		
		if (this.backButton.subsistAsButton()) {
			this.setScene(this.backButton.destination);
		}
	}

}