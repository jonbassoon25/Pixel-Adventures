//Util Imports
import { Keyboard } from "../util/Keyboard.js";

//UI Object Imports
import { UI } from "./UI.js";

//PauseMenu Class
export class PauseMenu {
	//Static Variables
	
	static paused = false;
	
	//*********************************************************************//
	//Public Static Methods

	/** Updates the pause menu and draws it */
	static update() {
		if (Keyboard.escapePressed) {
			this.paused = !this.paused;
		}
		if (this.paused) {
			UI.draw("buttonPressed", 960, 540, 1920, 1080);
			UI.draw("placeholder", 960, 540, 400, 600);
		}
	}
}