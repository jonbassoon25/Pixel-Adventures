//Util Imports
import { Keyboard } from "../util/Keyboard.js";

//UI Object Imports
import { UI } from "./UI.js";

export class PauseMenu {
	static paused = false;
	
	static update() {
		if (Keyboard.escapePressed) {
			this.paused = !this.paused;
		}
		if (this.paused) {
			UI.draw("buttonPressed", 960, 540, 1920, 1080, true);
			UI.draw("placeholder", 960, 540, 400, 600, true);
		}
	}
}