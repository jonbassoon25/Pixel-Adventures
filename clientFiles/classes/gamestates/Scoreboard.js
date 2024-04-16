//Util Imports

//UI Object Imports
import { Leaderboard } from "../UIObjects/Leaderboard.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Game Object Imports

//Game Entity Imports

//Scoreboard Class
export class Scoreboard extends Gamestate {
	//Static Variables

	static leaderboard = new Leaderboard(1920/2, 1080/2, 780, 1140);

	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs

	static init() {
		super.init();
		this.emit("getLeaderboard");
		Leaderboard.data = null;
		this.setScene("leaderboard");
	}

	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		
		if (back.subsistAsButton()) {
			this.setScene("initMenu");
		}
		
		this.leaderboard.update();
	}
}