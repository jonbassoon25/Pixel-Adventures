//Util Imports
import { Display } from "../util/Display.js";
import { Keyboard } from "../util/Keyboard.js";
import { AudioPlayer } from "../util/AudioPlayer.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";
import { Game } from "../gamestates/Game.js";
import { Util } from "../util/Util.js";


//PauseMenu Class
export class PauseMenu {
	//Static Variables
	
	static paused = false;

	//Cannot make button because button is importing pauseMenu
	static menuButton = null;

	static audioToggle = null;

	static audioUp = null;

	static audioDown = null;

	
	//*********************************************************************//
	//Public Static Methods

	/** Updates the pause menu and draws it */
	static update() {
		if (this.menuButton == null) {
			this.menuButton = new Button("escape", 1920/2, 1080/2 + 125, 250, 125, true);
		}
		if (this.audioToggle == null) {
			this.audioToggle = new Button((AudioPlayer.muted)? "musicDisabled" : "musicEnabled", 1920/2, 1080/2 - 50, 100, 100, true);
		}
		if (this.audioUp == null) {
			this.audioUp = new Button("plus", 1920/2 + 75, 1080/2 - 25 - 50, 25, 25, true);
		}
		if (this.audioDown == null) {
			this.audioDown = new Button("minus", 1920/2 + 75, 1080/2 + 25 - 50, 25, 25, true);
		}
		if (AudioPlayer.muted) {
			this.audioToggle.image = "musicDisabled";
		} else {
			this.audioToggle.image = "musicEnabled";
		}
		if (Keyboard.escapePressed) {
			this.paused = !this.paused;
		}
		if (this.paused) {
			Display.draw("buttonPressed", 960, 540, 1920, 1080);
			Display.draw("upgradePlaque", 960, 540, 351, 513);
			Display.drawText("Menu", 960 - Display.getTextWidth("Menu", 60)/2, 1080/2 - 160, 60, true, "white");
			if (this.menuButton.subsistAsButton()) {
				Game.level = 0;
				this.paused = false;
			}
			if (this.audioToggle.subsistAsButton()) {
				AudioPlayer.toggleMute();
			}
			if (this.audioDown.subsistAsButton()) {
				if (AudioPlayer.volume > 0.1) {
					AudioPlayer.updateVolume(Util.round(AudioPlayer.volume - 0.1, 1));
					console.log(AudioPlayer.volume);
				}
				AudioPlayer.play("upgrade");
			}
			if (this.audioUp.subsistAsButton()) {
				if (AudioPlayer.volume < 1) {
					AudioPlayer.updateVolume(Util.round(AudioPlayer.volume + 0.1, 1));
					console.log(AudioPlayer.volume);
				}
				AudioPlayer.play("upgrade");
			}
		}
	}
}