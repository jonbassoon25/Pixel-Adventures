//Util Imports
import { Display } from "../util/Display.js";
import { VisualObject } from "../util/VisualObject.js";


//Leaderboard Class
export class Leaderboard extends VisualObject {
	//Static Variables
	static data = null;

	//*********************************************************************//
	//Constructor
	//1920/2, 1080/2, 850, 990
	constructor(x, y, width, height) {
		super("placeholder", x, y, width, height);
	}

	//*********************************************************************//
	//Public Static Methods

	/** Draws and Updates this Leaderboard */
	update() {
		super.update();
		//Bounding box
		Display.drawText("Leaderboard", this.x - "Leaderboard".length * 30 / 2, 130, 50, true, "white");

		if (Leaderboard.data == null) {
			Display.drawText("Loading...", 545, 200, 25, true, "white");
			return;
		}
		//For each user on the leaderboard
		for (let i = 0; i < Leaderboard.data["order"].length && i <= 20; i++) {
			//Draw placement and username text
			Display.drawText("#" + (i + 1).toString() + " " + Leaderboard.data["order"][i] + ":", 545, 200 + i * 40, 25, true, "white");
			//Draw score
			Display.drawText(Leaderboard.data[Leaderboard.data["order"][i]].toString(), 1370 - Leaderboard.data[Leaderboard.data["order"][i]].toString().length * 25 * 0.6, 200 + i * 40, 25, true, "white");
		}
	}
}