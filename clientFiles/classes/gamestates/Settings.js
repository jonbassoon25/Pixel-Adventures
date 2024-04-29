//Util Imports
import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";
import { BackButton } from "../UIObjects/BackButton.js";
import { Slider } from "../UIObjects/Slider.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";


//Game Object Imports

//Game Entity Imports

//Settings Class
export class Settings extends Gamestate {
	//Static Variables

	static backButton = new BackButton(150, 100);

	static lightQualitySlider = new Slider(1920/2, 1080/2, 600, 90, 0, 3, 1, Math.log2(Scene.lightQuality));


	//*********************************************************************//
	//Private Static Methods


	//*********************************************************************//
	//Public Static Methods

	/**
	 * Initializes the settings menu
	 * @param {string} destination - destination after exiting the settings menu
	 */
	static init(destination = "initMenu") {
		super.init();
		this.backButton.destination = destination;
		this.setScene("settings");
	}

	/** Updates the Settings menu */
	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		
		if (this.backButton.subsistAsButton()) {
			this.setScene(this.backButton.destination);
		}

		this.lightQualitySlider.update();
		
		Scene.lightQuality = Math.pow(2, this.lightQualitySlider.snappedOutput);
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