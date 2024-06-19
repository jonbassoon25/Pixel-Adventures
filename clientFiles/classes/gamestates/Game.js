//Util Imports
import { Keyboard } from "../util/Keyboard.js";
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Display } from "../util/Display.js";
import { Difficulty } from "../util/Difficulty.js";
import { Level } from "../util/Level.js";
import { Scene } from "../util/Scene.js";
import { SceneBuilder } from "../util/SceneBuilder.js";
import { Vector } from "../util/Vector.js";
import { AudioPlayer } from "../util/AudioPlayer.js";

//UI Object Imports

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Game Entity Imports
import { Item } from "../gameEntities/Item.js";
import { Player } from "../gameEntities/Player.js";
import { Particle } from "../gameEntities/Particle.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { InteractableObject } from "../basicObjects/InteractableObject.js";
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { Util } from "../util/Util.js";
import { Shop } from "./Shop.js";


//Game Class
export class Game extends Gamestate {
	//Static Variables

	static substate = "init";

	static player1 = null;

	static player2 = null;


	//*********************************************************************//
	//Private Static Methods - No required JSDocs


	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs

	static init() {
		super.init();
		
		Display.clear(); 
		if (Level.level == 1) {
			Shop.maceBought = false;
			Shop.glassBroken = false;
			Player.resetData();
		}
		
		AudioPlayer.play("ambience", true);
		ShadedObject.clear();
		InteractableObject.clear();
		DynamicObject.clear();
		Game.player1 = new Player(100, 100, "red", "wadfs");
		Game.player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
		Item.clear();
		Level.init();
		this.substate = "requestingLevel";
		this.setScene("game");
	}

	static update() {
		switch (this.substate) {
			case "requestingLevel":
				if (!(Scene.structure == null)) {
					this.player1.x = 100;
					this.player1.y = 100;
					this.player2.x = 300;
					this.player2.y = 100;
					this.player1.health = this.player1.maxHealth;
					this.player2.health = this.player2.maxHealth;
					this.player1.isDead = false;
					this.player2.isDead = false;
					this.player1.hasCollision = true;
					this.player2.hasCollision = true;
					this.player1.facingLeft = false;
					this.player2.facingLeft = false;
					Level.spawnEntities();
					Level.loadDecorations();
					this.substate = "game";
					AnimationPlayer.load("fadeIn");
				}
				break;
			case "game":
				if (this.player1.isDead && this.player2.isDead) {
					AnimationPlayer.clear();
					AnimationPlayer.load("fadeOut");
					this.player1 = null;
					this.player2 = null;
					this.setScene("initLose");
					break;
				}

				if (Keyboard.backquoteDown && Keyboard.isKeyPressed("r")) {
					Display.clear();
					DynamicObject.clear();
					Level.level = 1;

					this.setScene("initGame");
				}

				Scene.drawBackground();

				//Update/move items and dynamic objects
				Item.updateItems();
				DynamicObject.updateObjects();

				
				//Scene Editor
				if (Keyboard.shiftPressed && Keyboard.backquoteDown) {
					Player.retainedValues["p1Coins"] = this.player1.coins;
					Player.retainedValues["p2Coins"] = this.player2.coins;
					Player.retainedValues["p1Score"] = this.player1.points;
					Player.retainedValues["p2Score"] = this.player2.points;
					DynamicObject.clear();
					this.player1 = null;
					this.player2 = null;
					Difficulty.pointMultiplier = 0;
					//console.log("Scene builder");
					SceneBuilder.printInstructions();
					SceneBuilder.init();
					this.setScene("sceneCreator");
					break;
				}
				
				//Draw items and dynamicObjects in Scene
				Item.drawItems();

				Scene.drawShadedObjects();

				Display.drawText("Player 1 Coins: " + this.player1.coins.toString(), 50, 50, 40, true, "white");
				Display.drawText("Player 2 Coins: " + this.player2.coins.toString(), 1920 - Display.getTextWidth("Player 2 Coins: " + this.player2.coins.toString(), 40) - 50, 50, 40, true, "white");

				if (Difficulty.pointMultiplier != 0) {
					Display.drawText("Score: " + Math.round((this.player1.points + this.player2.points) * Difficulty.pointMultiplier).toString(), 1920/2 - Display.getTextWidth("Score: " + Math.round((this.player1.points + this.player2.points) * Difficulty.pointMultiplier).toString(), 40) / 2, 50, 40, true, "white");
				}

				//Spawn random light source particles
				if (Util.randInt(2) == 0 && Display.frames % 20 == 0) {
					for (let i = 0; i < Scene.lightSources.length; i++) {
						if (Util.randInt(3) == 0) {
							let angle = Util.randInt(119);
							let vel = 0.5;
							new Particle("spark", Scene.lightSources[i][0], Scene.lightSources[i][1], 4, 4, new Vector([vel * Math.cos(angle * Math.PI/180), vel * Math.sin(angle * Math.PI/180)]), 0.5, 0.7, false, false, false);
							new Particle("spark", Scene.lightSources[i][0], Scene.lightSources[i][1], 4, 4, new Vector([vel * Math.cos(angle * Math.PI/180 - (2 * Math.PI/3)), vel * Math.sin(angle * Math.PI/180 - (2 * Math.PI/3))]), 0.5, 0.7, false, false, false);
							new Particle("spark", Scene.lightSources[i][0], Scene.lightSources[i][1], 4, 4, new Vector([vel * Math.cos(angle * Math.PI/180 - (4 * Math.PI/3)), vel * Math.sin(angle * Math.PI/180 - (4 * Math.PI/3))]), 0.5, 0.7, false, false, false);
						}
					}
				}
				//Update trigger regions
				//TriggerRegion.update();
				//(For Testing) Display player visual dimensions
				//Display.markPlayerDisplay(this.player1, this.player2);
				break;
		}
	}
}