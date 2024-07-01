//Util Imports
import { Display } from "../util/Display.js";
import { AnimationPlayer } from "../util/AnimationPlayer.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";
import { Textbox } from "../UIObjects/Textbox.js";

//Gamestate Imports
import { Difficulty } from "../util/Difficulty.js";
import { Game } from "./Game.js";
import { Gamestate } from "./Gamestate.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";

//SaveScore Class
export class SaveScore extends Gamestate {
	//Static Variables
	
	static textbox = new Textbox(1920/2, 1080/2, 1260, 100);
	static submit = new Button("saveScore", 1920/2, 1080/2 + 200, 522, 144);

	//*********************************************************************//
	//Public Static Methods

	static init() {
		super.init();
		AnimationPlayer.load("fadeIn");
		this.textbox.isSelected = true;
		this.textbox.text = "";
		if (Difficulty.pointMultiplier != 0) {
			this.setScene("saveScore");
		} else {
			this.setScene("initMenu");
		}
	}
	
	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		
		Display.drawText("Your Score: " + Math.round((Game.player1.points + Game.player2.points) * Difficulty.pointMultiplier).toString(), 1920/2 - Display.getTextWidth(("Your Score: " + Math.round(Game.player1.points + Game.player2.points) * Difficulty.pointMultiplier).toString(), 80)/2, 1080/2 - 70, 80, true, "white");
		
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