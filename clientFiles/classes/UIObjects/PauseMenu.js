//Util Imports
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";


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
			Display.draw("buttonPressed", 960, 540, 1920, 1080);
			Display.draw("placeholder", 960, 540, 400, 600);
		}
	}
}