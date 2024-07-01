//Util Imports
import { Animation } from "./Animation.js";
import { AudioPlayer } from "./AudioPlayer.js";
import { AnimationPlayer } from "./AnimationPlayer.js";
import { Display } from "./Display.js";
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
import { Scene } from "./Scene.js";
import { SceneBuilder } from "./SceneBuilder.js";
import { Spawner } from "./Spawner.js";

//UI Object Imports
import { Leaderboard } from "../UIObjects/Leaderboard.js";
import { PauseMenu } from "../UIObjects/PauseMenu.js";

//Gamestate Imports
import { Cutscene } from "../gamestates/Cutscene.js";
import { Dialogue } from "../gamestates/Dialogue.js";
import { DifficultySelect } from "../gamestates/DifficultySelect.js";
import { Game } from "../gamestates/Game.js";
import { Help } from "../gamestates/Help.js";
import { Scoreboard } from "../gamestates/Scoreboard.js";
import { Lose } from "../gamestates/Lose.js";
import { Menu } from "../gamestates/Menu.js";
import { SaveScore } from "../gamestates/SaveScore.js";
import { Settings } from "../gamestates/Settings.js";
import { Shop } from "../gamestates/Shop.js";
import { Win } from "../gamestates/Win.js";

//Game Object Imports
import { LightTile } from "../gameObjects/LightTile.js";
import { SceneTile } from "../gameObjects/SceneTile.js";
import { Chest } from "../gameObjects/Chest.js";
import { Door } from "../gameObjects/Door.js";

//Game Entity Imports
import { Player } from "../gameEntities/Player.js";
import { Skeleton } from "../gameEntities/Skeleton.js";
import { Slime } from "../gameEntities/Slime.js";
import { MovingTileSet } from "../gameEntities/MovingTileSet.js";
import { Particle } from "../gameEntities/Particle.js";

//Basic Object Imports
import { AnimatedObject } from "../basicObjects/AnimatedObject.js";
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { VisualObject } from "../basicObjects/VisualObject.js";
import { InteractableObject } from "../basicObjects/InteractableObject.js";
import { TriggerRegion } from "../gameObjects/TriggerRegion.js";

//Data Manager Class
export class DataManager {
	/*
	Notes:
		Used to debug 
	*/
	
	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs
	static logData() {
		console.log("Animations: "); console.log(AnimationPlayer.currentAnimations);
		console.log("Audio: "); console.log(AudioPlayer.currentAudio);
		console.log("Current Entities: "); console.log(Spawner.currentEntities);
		console.log("Decorations: "); console.log(Scene.decorations);
		console.log("Dynamic Objects: "); console.log(DynamicObject.dynamicObjects);
		console.log("Interactable Objects: "); console.log(InteractableObject.interactableObjects);
		console.log("MovingTileSets: "); console.log(MovingTileSet.movingTileSets);
		console.log("Particles: "); console.log(Particle.particles);
		console.log("Shaded Objects: "); console.log(ShadedObject.shadedObjects);
		console.log("Trigger Regions: "); console.log(TriggerRegion.triggerRegions);
		console.log("");
		console.log("Level: " + Game.level);
		console.log("Player1: "); console.log(Game.player1);
		console.log("Player2: "); console.log(Game.player2);
		console.log("Spawner.grabbedObject: "); console.log(Spawner.grabbedObject);
		console.log("Spawner.selectedObject: "); console.log(Spawner.selectedObject);
	}
}