//Util Imports
import { Display } from "../util/Display.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";
import { Textbox } from "../UIObjects/Textbox.js";

//Gamestate Imports
import { Difficulty } from "../util/Difficulty.js";
import { Game } from "./Game.js";
import { Gamestate } from "./Gamestate.js";

//Game Object Imports

//Game Entity Imports
import { DynamicObject } from "../gameEntities/DynamicObject.js";

//SaveScore Class
export class SaveScore extends Gamestate {
	//Static Variables
	
	static textbox = new Textbox(1920/2, 1080/2, 580, 100);
	static submit = new Button("saveScore", 1920/2, 1080/2 + 200, 385, 40);

	//*********************************************************************//
	//Public Static Methods

	static init() {
		super.init();
		this.textbox.isSelected = true;
		if (Difficulty.pointMultiplier != 0) {
			this.setScene("saveScore");
		} else {
			this.setScene("initMenu");
		}
	}
	
	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		
		Display.drawText("Your Score: " + Math.round((Game.player1.points + Game.player2.points) * Difficulty.pointMultiplier).toString(), 1920/2 - ("Your Score: " + Math.round((Game.player1.points + Game.player2.points) * Difficulty.pointMultiplier).toString()).length * 40 * 0.55 / 2, 1920/2 - 300, 40, true, "white");
		
		this.textbox.update();
		this.submit.update();
		
		if (this.submit.isReleased() && this.textbox.text != "") {
			this.textbox.isSelected = false;
			this.emit("updateLeaderboard", [this.textbox.text, Math.round((Game.player1.points + Game.player2.points) * Difficulty.pointMultiplier)]);
			Game.player1 = null;
			Game.player2 = null;
			DynamicObject.dynamicObjects = [];
			this.setScene("initMenu");
		}
	}
}