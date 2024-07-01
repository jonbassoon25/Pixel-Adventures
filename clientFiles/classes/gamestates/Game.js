//Util Imports
import { Keyboard } from "../util/Keyboard.js";
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Display } from "../util/Display.js";
import { Difficulty } from "../util/Difficulty.js";
import { Scene } from "../util/Scene.js";
import { SceneBuilder } from "../util/SceneBuilder.js";
import { Vector } from "../util/Vector.js";
import { AudioPlayer } from "../util/AudioPlayer.js";
import { FileManager } from "../util/FileManager.js";
import { Spawner } from "../util/Spawner.js";

//Game Object Imports
import { TriggerRegion } from "../gameObjects/TriggerRegion.js";

//UI Object Imports

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";

//Game Entity Imports
import { Item } from "../gameEntities/Item.js";
import { Player } from "../gameEntities/Player.js";
import { Particle } from "../gameEntities/Particle.js";
import { Enemy } from "../gameEntities/Enemy.js";
import { MovingTileSet } from "../gameEntities/MovingTileSet.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { InteractableObject } from "../basicObjects/InteractableObject.js";
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { Util } from "../util/Util.js";
import { Shop } from "./Shop.js";
import { Effigy } from "../gameEntities/Effigy.js"



//Game Class
export class Game extends Gamestate {
	//Static Variables

	static substate = "init";

	static player1 = null;

	static player2 = null;

	static level = 1;

	//*********************************************************************//
	//Private Static Methods - No required JSDocs


	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs

	static init() {
		super.init();
		
		Display.clear(); 
		if (this.level == 1) {
			Shop.maceBought = false;
			Shop.glassBroken = false;
			Player.resetData();
		}
		
		AudioPlayer.play("ambience", true);
		ShadedObject.clear();
		InteractableObject.clear();
		DynamicObject.clear();
		//Initiate the level
		Item.clear();
		Enemy.clear();
		InteractableObject.clear();
		TriggerRegion.clear();
		console.log("above");
		Scene.structure = null;
		Scene.shaderStructure = null;
		Scene.decorations = [];
		FileManager.load("level" + this.level.toString());
		this.substate = "requestingLevel";
		this.setScene("game");
		console.log("above2");
	}
	
	static spawnMovingTiles() {
		MovingTileSet.clear();
		TriggerRegion.clear();
		switch(Game.level) {
			case 1:
				//Testing the effigy
				//new TriggerRegion(...Scene.snapCoordinates(1000, 240), 80, 80, new Effigy(1120, 236));
				new MovingTileSet("wood", ...Scene.snapCoordinates(260, 740), 40, 40, 1, "up");
				new MovingTileSet("wood", ...Scene.snapCoordinates(300, 740), 40, 40, 1, "up");
				new MovingTileSet("wood", ...Scene.snapCoordinates(340, 740), 40, 40, 1, "up");
				new MovingTileSet("wood", ...Scene.snapCoordinates(380, 740), 40, 40, 1, "up");
				new MovingTileSet("wood", ...Scene.snapCoordinates(300, 780), 40, 40, 1, "down");
				new MovingTileSet("wood", ...Scene.snapCoordinates(340, 780), 40, 40, 1, "down");
				new MovingTileSet("wood", ...Scene.snapCoordinates(380, 780), 40, 40, 1, "down");
				new TriggerRegion(...Scene.snapCoordinates(580, 980), 200, 120, MovingTileSet.movingTileSets);
				break;
			//Some levels spawn the player in different positions than the default.
			case 2:
				new MovingTileSet("cobblestone", ...Scene.snapCoordinates(659, 577), 40, 40, 4, "right", 110, "autoRepeat");
				for (let i = 0; i < Spawner.currentEntities.length; i++) {
					if (Spawner.currentEntities[i].type == "skeleton" && Spawner.currentEntities[i].x == 1780) {
						Spawner.currentEntities[i].trigger = new MovingTileSet("cobblestone", ...Scene.snapCoordinates(1540, 337), 40, 40, 2, "right", 110, "await");
					}
				}
				break;
			case 3:
				//Door shutting behind players in the arena
				new MovingTileSet("cobblestone", ...Scene.snapCoordinates(536, 216), 40, 40, 2, "up", 30, "reverse");
				new MovingTileSet("cobblestone", ...Scene.snapCoordinates(455, 211), 40, 40, 2, "up", 30, "reverse");
				//Skeleton released in arena
				new MovingTileSet("wood", ...Scene.snapCoordinates(1019, 211), 40, 40, 2, "up", 70, "await");
				new TriggerRegion(820, 200, 280, 160, MovingTileSet.movingTileSets.slice(0), false, true);
				//Floor opening in arena
				for (let i = 0; i < Spawner.currentEntities.length; i++) {
					if (Spawner.currentEntities[i].type == "skeleton" && Spawner.currentEntities[i].x == 1060) {
						//Makes the skeleton run out more consistently
						Spawner.currentEntities[i].visibility = 500;
						Spawner.currentEntities[i].trigger = [
							new MovingTileSet("wood", ...Scene.snapCoordinates(1098, 300), 40, 40, 7, "right", 250, "await"),
							new MovingTileSet("wood", ...Scene.snapCoordinates(1098, 340), 40, 40, 7, "right", 250, "await"),
							new MovingTileSet("wood", ...Scene.snapCoordinates(573, 300), 40, 40, 7, "left", 250, "await"),
							new MovingTileSet("wood", ...Scene.snapCoordinates(573, 340), 40, 40, 7, "left", 250, "await"),
						];
					}
				}
				//Skeleton drop at the chest area
				new TriggerRegion(180, 660, 120, 120, [new MovingTileSet("wood", ...Scene.snapCoordinates(297, 497), 40, 40, 2, "right", 40, "await")]);
				//Parkour
				new MovingTileSet("cobblestone", ...Scene.snapCoordinates(1576, 741), 40, 40, 3, "right", 110, "autoRepeat");
				new MovingTileSet("cobblestone", ...Scene.snapCoordinates(1254, 618), 40, 40, 4, "up", 170, "autoRepeat");
				new MovingTileSet("cobblestone", ...Scene.snapCoordinates(977, 855), 40, 40, 2, "left", 140, "autoRepeat");
				//Effigy room locks
				new TriggerRegion(460, 940, 120, 120, [new MovingTileSet("cobblestone", ...Scene.snapCoordinates(736, 940), 40, 40, 2, "up", 30, "toggle"),
													  new MovingTileSet("cobblestone", ...Scene.snapCoordinates(696, 940), 40, 40, 2, "up", 30, "toggle"),
													  new MovingTileSet("cobblestone", ...Scene.snapCoordinates(376, 940), 40, 40, 2, "up", 30, "toggle"),
													  new MovingTileSet("cobblestone", ...Scene.snapCoordinates(336, 940), 40, 40, 2, "up", 30, "toggle"), new Effigy(540, 972, MovingTileSet.movingTileSets.slice(11))], false, true);
				break;
			default:
		}
	}
	
	static spawnPlayers() {
		try {
			Game.player1.delete();
			Game.player1 = null;
		} catch {}
		try {
			Game.player2.delete();
			Game.player2 = null;
		} catch {}
		switch(Game.level) {
			//Some levels spawn the player in different positions than the default.
			case 2:
				Game.player1 = new Player(60, 1000, "red", "wadfs");
				Game.player2 = new Player(175, 1000, "blue", ["up", "left", "right", "/", "down"]);
				break;
			default:
				Game.player1 = new Player(100, 100, "red", "wadfs");
				Game.player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
				
		}
	}

	static update() {
		switch (this.substate) {
			case "requestingLevel":
				if (!(Scene.structure == null)) {
					/*console.log(Scene.decorations);
					console.log(InteractableObject.interactableObjects);
					console.log(Spawner.currentEntities);*/
					this.spawnPlayers();
					this.spawnMovingTiles();
					this.player1.health = this.player1.maxHealth;
					this.player2.health = this.player2.maxHealth;
					this.player1.isDead = false;
					this.player2.isDead = false;
					this.player1.hasCollision = true;
					this.player2.hasCollision = true;
					this.player1.facingLeft = false;
					this.player2.facingLeft = false;
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
					this.level = 1;

					this.setScene("initGame");
				}

				if (Keyboard.backquoteDown && Keyboard.isKeyPressed("p")) {
					Game.spawnPlayers();
				}

				Scene.drawBackground();

				//Update/move items, dynamic objects, and moving tile sets
				Item.updateItems();
				DynamicObject.updateObjects();
				MovingTileSet.update();
			
				
				//Scene Editor
				if (Keyboard.shiftPressed && Keyboard.backquoteDown) {
					Player.retainedValues["p1Coins"] = this.player1.coins;
					Player.retainedValues["p2Coins"] = this.player2.coins;
					Player.retainedValues["p1Score"] = this.player1.points;
					Player.retainedValues["p2Score"] = this.player2.points;
					DynamicObject.clear();
					this.player1.delete();
					this.player2.delete();
					this.player1 = null;
					this.player2 = null;
					Difficulty.pointMultiplier = 0;
					//console.log("Scene builder");
					SceneBuilder.printInstructions();
					SceneBuilder.init();
					this.setScene("sceneCreator");
					break;
				}
				if (Keyboard.controlPressed && Keyboard.backquoteDown) {
					this.setScene("initSpawner");
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
				if (Util.randInt(2) == 0 && Display.frames % 1 == 0) {
					for (let i = 0; i < Scene.lightSources.length; i++) {
						if (Util.randInt(100) == 0) {
							let angle = Util.randInt(119);
							let vel = 5;
							new Particle("sparkSlow", Scene.lightSources[i][0], Scene.lightSources[i][1], 4, 4, new Vector([vel * Math.cos(angle * Math.PI/180), vel * Math.sin(angle * Math.PI/180)]), 0.5, 0.7, false, false, false);
							new Particle("sparkSlow", Scene.lightSources[i][0], Scene.lightSources[i][1], 4, 4, new Vector([vel * Math.cos(angle * Math.PI/180 - (2 * Math.PI/3)), vel * Math.sin(angle * Math.PI/180 - (2 * Math.PI/3))]), 0.5, 0.7, false, false, false);
							new Particle("sparkSlow", Scene.lightSources[i][0], Scene.lightSources[i][1], 4, 4, new Vector([vel * Math.cos(angle * Math.PI/180 - (4 * Math.PI/3)), vel * Math.sin(angle * Math.PI/180 - (4 * Math.PI/3))]), 0.5, 0.7, false, false, false);
						}
					}
				}
				//Update trigger regions
				TriggerRegion.update();
				//(For Testing) Display player visual dimensions
				//Display.markPlayerDisplay(this.player1, this.player2);
				break;
		}
	}
}