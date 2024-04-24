//Util Imports
import { Keyboard } from "../util/Keyboard.js";
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Display } from "../util/Display.js";
import { Difficulty } from "../util/Difficulty.js";
import { Level } from "../util/Level.js";
import { Scene } from "../util/Scene.js";
import { SceneBuilder } from "../util/SceneBuilder.js";

//UI Object Imports

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Game Object Imports
import { ChestTile } from "../gameObjects/ChestTile.js";
import { Grave } from "../gameObjects/Grave.js";
import { TriggerRegion } from "../gameObjects/TriggerRegion.js";

//Game Entity Imports
import { DynamicObject } from "../gameEntities/DynamicObject.js";
import { Item } from "../gameEntities/Item.js";
import { Player } from "../gameEntities/Player.js";

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
			Player.upgradesBought = {"playerOneWeapon": 0, "playerOneHealth": 0, "playerOneRegen": 0, "playerOneSpeed": 0, "playerOneJump": 0, "playerTwoWeapon": 0, "playerTwoHealth": 0, "playerTwoRegen": 0, "playerTwoSpeed": 0, "playerTwoJump": 0};
		}
		ChestTile.clear();
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
					this.substate = "game";
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

				Scene.drawBackground();

				//Update/move items and dynamic objects
				Item.updateItems();
				DynamicObject.updateObjects();

				//Scene Editor
				if (Keyboard.shiftPressed) {
					Player.retainedValues["p1Coins"] = this.player1.coins;
					Player.retainedValues["p2Coins"] = this.player2.coins;
					Player.retainedValues["p1Score"] = this.player1.points;
					Player.retainedValues["p2Score"] = this.player2.points;
					DynamicObject.clear();
					this.player1 = null;
					this.player2 = null;
					//console.log("Scene builder");
					SceneBuilder.printInstructions();
					SceneBuilder.init();
					this.setScene("sceneCreator");
					break;
				}

				//Update backgrounds of new moving objects in Scene
				Scene.update(Item.items);
				Scene.update(DynamicObject.dynamicObjects);
				Scene.update(ChestTile.chestTiles);
				Scene.update(Grave.graves);

				//Update Doors
				Scene.updateDoor();

				//Draw items and dynamicObjects in Scene
				Item.drawItems();
				DynamicObject.drawObjects();

				//Shade the scene
				Scene.shade();
				Display.drawText("Player 1 Coins: " + this.player1.coins.toString(), 50, 50, 40, true, "white");
				Display.drawText("Player 2 Coins: " + this.player2.coins.toString(), 1920 - ("Player 2 Coins: " + this.player2.coins.toString()).length * 30, 50, 40, true, "white");
				Display.drawText("Score: " + Math.round((this.player1.points + this.player2.points) * Difficulty.pointMultiplier).toString(), 1920/2 - ("Combined Points: " + Math.round((this.player1.points + this.player2.points) * Difficulty.pointMultiplier).toString()).length * 40 * 0.55 / 2, 50, 40, true, "white");

				//Update trigger regions
				//TriggerRegion.update();
				//(For Testing) Display player visual dimensions
				//Display.markPlayerDisplay(this.player1, this.player2);
				break;
		}
	}

	//*********************************************************************//
	//Constructor - Must have JSDocs


	//*********************************************************************//
	//Private Methods - No required JSDocs


	//*********************************************************************//
	//Public Methods - Must have JSDocs


	//*********************************************************************//
	//Getters - No required JSDocs


	//*********************************************************************//
	//Setters - Must have JSDocs


}