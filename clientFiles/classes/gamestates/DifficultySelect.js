//Util Imports
import { AudioPlayer } from "../util/AudioPlayer.js";
import { Difficulty } from "../util/Difficulty.js";
import { Display } from "../util/Display.js";

//UI Object Imports
import { BackButton } from "../UIObjects/BackButton.js";
import { Button } from "../UIObjects/Button.js";
import { Slider } from "../UIObjects/Slider.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";
import { Game } from "./Game.js";

//Game Object Imports

//Game Entity Imports
import { Player } from "../gameEntities/Player.js";

//Template Class
export class DifficultySelect extends Gamestate {
	//Static Variables

	//Difficulty Select Buttons
	static back = new BackButton(150, 100);
	static easy = new Button("easy", 1920/2, 1080/2 - 300, 500, 150);
	static medium = new Button("medium", 1920/2, 1080/2 - 100, 500, 150);
	static hard = new Button("hard", 1920/2, 1080/2 + 100, 500, 150);
	static custom = new Button("custom", 1920/2, 1080/2 + 300, 500, 150);

	//Custom Difficulty Sliders
	static enemyHealth = new Slider(1920/2, 1080/2 - 300, 600, 90, 0.25, 3, 0.25, 1);
	static enemyDamage = new Slider(1920/2, 1080/2 - 120, 600, 90, 0.25, 3, 0.25, 1);
	static enemySpeed = new Slider(1920/2, 1080/2 + 60, 600, 90, 0.25, 3, 0.25, 1);
	static price = new Slider(1920/2, 1080/2 + 240, 600, 90, 0.25, 3, 0.25, 1);

	//Custom Difficulty Buttons
	static continue = new Button("continue", 1920/2, 1080/2 + 420, 456, 64);

	//Substate of difficulty select
	static substate = "difficultySelect";
	
	//*********************************************************************//
	//Private Static Methods - No required JSDocs


	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs

	static init() {
		super.init();
		this.substate = "difficultySelect";
		this.setScene("difficultySelect");
	}
	
	static update() {
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);

		this.back.update();
		
		if (this.substate == "custom") {
			if (this.back.isReleased()) {
				this.substate = "difficultySelect";
			}

			//Enemy Health Slider
			this.enemyHealth.update();
			//Enemy Health Text
			Display.drawText("Enemy Health Multiplier", 1920/2 - "Enemy Health Multiplier".length*60*0.55/2, 1080/2 - 300 - 40, 60, true, "black");
			Display.drawText(this.enemyHealth.snappedOutput.toString(), 1920/2 + 320, 1080/2 - 300 + 50, 60, true, "black");

			//Enemy Damage Slider
			this.enemyDamage.update();
			//Enemy Damage Text
			Display.drawText("Enemy Damage Multiplier", 1920/2 - "Enemy Damage Multiplier".length*60*0.55/2, 1080/2 - 120 - 40, 60, true, "black");
			Display.drawText(this.enemyDamage.snappedOutput.toString(), 1920/2 + 320, 1080/2 - 120 + 50, 60, true, "black");

			//Enemy Speed Slider
			this.enemySpeed.update();
			//Enemy Speed Text
			Display.drawText("Enemy Speed Multiplier", 1920/2 - "Enemy Speed Multiplier".length*60*0.55/2, 1080/2 + 60 - 40, 60, true, "black");
			Display.drawText(this.enemySpeed.snappedOutput.toString(), 1920/2 + 320, 1080/2 + 60 + 50, 60, true, "black");

			//Price Slider
			this.price.update();
			Display.drawText("Price Multiplier", 1920/2 - "Price Multiplier".length*60*0.55/2, 1080/2 + 240 - 40, 60, true, "black");
			Display.drawText(this.price.snappedOutput.toString(), 1920/2 + 320, 1080/2 + 240 + 50, 60, true, "black");

			//Continue Button
			if (this.continue.subsistAsButton()) {
				Difficulty.enemyDamageMult = this.enemyDamage.snappedOutput;
				Difficulty.enemyHealthMult = this.enemyHealth.snappedOutput;
				Difficulty.enemySpeedMult = this.enemySpeed.snappedOutput;
				Difficulty.priceMult = this.price.snappedOutput;
				Difficulty.pointMultiplier = 0;
				Game.player1 = new Player(100, 100, "red", "wadfs");
				Game.player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
				Player.upgradesBought = {"playerOneWeapon": 0, "playerOneHealth": 0, "playerOneRegen": 0, "playerOneSpeed": 0, "playerOneJump": 0, "playerTwoWeapon": 0, "playerTwoHealth": 0, "playerTwoRegen": 0, "playerTwoSpeed": 0, "playerTwoJump": 0};
				AudioPlayer.play("ambience", true);
				this.setScene("initGame");
			}
			return;
		}
		
		if (this.back.isReleased()) {
			this.setScene("initMenu");
		}
		//Easy button
		if (this.easy.subsistAsButton()) {
			Difficulty.setEasy();
			AudioPlayer.play("ambience", true);
			this.setScene("initGame");
		}
		//Medium button
		if (this.medium.subsistAsButton()) {
			Difficulty.setMedium();
			AudioPlayer.play("ambience", true);
			this.setScene("initGame");
		}
		//Hard button
		if (this.hard.subsistAsButton()) {
			Difficulty.setHard();
			AudioPlayer.play("ambience", true);
			this.setScene("initGame");
		}
		//Custom button
		if (this.custom.subsistAsButton()) {
			this.substate = "custom";
		}
		
		if (this.easy.isReleased() || this.medium.isReleased() || this.hard.isReleased()) {
			//console.log("players initialized");
			Game.player1 = new Player(100, 100, "red", "wadfs");
			Game.player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
			Player.upgradesBought = {"playerOneWeapon": 0, "playerOneHealth": 0, "playerOneRegen": 0, "playerOneSpeed": 0, "playerOneJump": 0, "playerTwoWeapon": 0, "playerTwoHealth": 0, "playerTwoRegen": 0, "playerTwoSpeed": 0, "playerTwoJump": 0};
		}
	}
}