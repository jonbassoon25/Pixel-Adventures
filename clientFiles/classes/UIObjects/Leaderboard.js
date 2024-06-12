//Util Imports
import { Display } from "../util/Display.js";
import { textures } from "../util/Textures.js";

import { VisualObject } from "../basicObjects/VisualObject.js";

//Leaderboard Class
export class Leaderboard extends VisualObject {
	//Static Variables
	static data = null;

	//*********************************************************************//
	//Constructor
	//1920/2, 1080/2, 780, 1140
	constructor(x, y, width, height) {
		super("leaderboardPlaque", x, y, width, height);
	}

	//*********************************************************************//
	//Public Static Methods

	/** Draws and Updates this Leaderboard */
	update() {
		super.update();
		//Bounding box
		Display.drawText("Leaderboard", this.x - "Leaderboard".length * 50 * 0.55/2, 130, 50, true, "white");

		if (Leaderboard.data == null) {
			Display.drawText("Loading...", 600, 200, 25, true, "white");
			return;
		}
		//For each user on the leaderboard, no more than 20
		for (let i = 0; i < Leaderboard.data["order"].length && i < 20; i++) {
			//Prevent scores of 0 from being displayed
			if (Leaderboard.data[Leaderboard.data["order"][i]] <= 0) return;
			//Draw placement and username text
			Display.drawText("#" + (i + 1).toString() + " " + Leaderboard.data["order"][i] + ":", 1920/2 - textures["leaderboardPlaque"].width/2 + 50, 250 + i * 40, 25, true, "white");
			//Draw score
			Display.drawText(Leaderboard.data[Leaderboard.data["order"][i]].toString(), 1920/2 + textures["leaderboardPlaque"].width/2 - 50 - Leaderboard.data[Leaderboard.data["order"][i]].toString().length * 25 * 0.55, 250 + i * 40, 25, true, "white");
		}
	}
}