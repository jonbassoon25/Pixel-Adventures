import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { AudioPlayer } from "../util/AudioPlayer.js";

//Gamestate Class
export class Gamestate {
	//Public Static Methods

	/** Changes the scene in client.js by sending a sceneChange event */
	static setScene(scene) {
		document.dispatchEvent(new CustomEvent("sceneChange", {"detail": scene}));
	}

	/** Changes all background features to have default values */
	static init() {
		AnimationPlayer.clear();
		AudioPlayer.pauseAll();
	}
}