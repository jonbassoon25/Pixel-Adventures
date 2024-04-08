/*
Created by Jonathan Hanson, Zac Young

client.js

Main client side javascript file for FBLA Game 2023 - 2024

Created: 11.4.23
*/

//Page Link: https://d80c44ec-f284-4dc2-9448-f7794e4564a2-00-rpr7p62yh9tn.picard.replit.dev/

//To kick random users to google
//window.location.replace("http://www.google.com");

//------------------------------------------------------------------------------------//
//Imports

//Util Imports
import { Animation } from "./classes/util/Animation.js";
import { AnimationPlayer } from "./classes/util/AnimationPlayer.js";
import { Difficulty } from "./classes/util/Difficulty.js";
import { Display } from "./classes/util/Display.js";
import { Keyboard } from "./classes/util/Keyboard.js";
import { Level } from "./classes/util/Level.js";
import { Mouse } from "./classes/util/Mouse.js";
import { Scene } from "./classes/util/Scene.js";
import { SceneBuilder } from "./classes/util/SceneBuilder.js";
import { SceneCreator } from "./classes/util/SceneCreator.js";
import { textures } from "./classes/util/Textures.js";
import { Util } from "./classes/util/Util.js";
import { Vector } from "./classes/util/Vector.js";
import { VisualObject } from "./classes/util/VisualObject.js";


//UI Object Imports
import { Button } from "./classes/UIObjects/Button.js";
import { DialogueBox } from "./classes/UIObjects/DialogueBox.js";
import { Leaderboard } from "./classes/UIObjects/Leaderboard.js";
import { PauseMenu } from "./classes/UIObjects/PauseMenu.js";
import { Slider } from "./classes/UIObjects/Slider.js";
import { Textbox } from "./classes/UIObjects/Textbox.js";
import { BackButton } from "./classes/UIObjects/BackButton.js";

//Game Object Imports
import { ChestTile } from "./classes/gameObjects/ChestTile.js";
import { Door } from "./classes/gameObjects/Door.js";
import { LightTile } from "./classes/gameObjects/LightTile.js";
import { SceneTile } from "./classes/gameObjects/SceneTile.js";
import { ShaderTile } from "./classes/gameObjects/ShaderTile.js";
import { Grave } from "./classes/gameObjects/Grave.js";

//Game Entity Imports
import { DynamicObject } from "./classes/gameEntities/DynamicObject.js";
import { Player } from "./classes/gameEntities/Player.js";
import { NPC } from "./classes/gameEntities/NPC.js";
import { Coin } from "./classes/gameEntities/Coin.js";
import { Item } from "./classes/gameEntities/Item.js";
import { Slime } from "./classes/gameEntities/Slime.js";
import { Skeleton } from "./classes/gameEntities/Skeleton.js";
import { AuidoPlayer } from "./classes/util/AudioPlayer.js";


//------------------------------------------------------------------------------------//
//Constants

const canvas = document.getElementById("gameScreen");

//Initalize the server communication handler
const socket = io();

//------------------------------------------------------------------------------------//
//Variables

let buttons = {};

let sliders = {};

let textBoxes = {};

let dialogueBoxes = {};

let boxes = {};

let leaderboard = null;

let lastFrameTime = new Date().getTime();

let lastLevel = 1;

//------------------------------------------------------------------------------------//
//Util Functions

function clearUI() {
	buttons = {};
	sliders = {};
	textBoxes = {};
	dialogueBoxes = {};
	boxes = {};
	AnimationPlayer.clear();
}

//------------------------------------------------------------------------------------//
//Main Function

//State variable
let scene = "initMenu";
let player1;
let player2;
let back = new BackButton(150, 100);

function updateGame() {
	//Update Display values
	Display.calcScreenSize();

	AnimationPlayer.playUnderlayAnimations();

	if (Mouse.button2Pressed) {
		let mouse = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, 0, 0)];
		console.log([Math.round(mouse[0]), Math.round(mouse[1])]);
		console.log(Scene.calcBlockCoordinates(mouse[0], mouse[1]));
	}

	AnimationPlayer.playUnderlayAnimations();

	if (Level.level != lastLevel) {
		scene = "initCutscene";
		lastLevel = Level.level;
	}
	
	switch (scene) {
		case "initMenu":
			clearUI();
			AnimationPlayer.load("pano", true, true);
			AnimationPlayer.load("fadeIn");
			buttons["play"] = new Button("playButton", 1920/2, 1080/2, 408, 144);
			buttons["leaderboard"] = new Button("leaderboard", 1920/2, 1080/2 + 144 - 25, 408, 96);
			//dialogueBoxes["dia"] = new DialogueBox(1000, 500, 1000, 200);
			//dialogueBoxes["dia"].displayText("Lorem ipsum dolor sit amet\n consectetur adipiscing elit\n sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n Sit amet commodo nulla facilisi nullam vehicula ipsum a\n Porttitor lacus luctus accumsan tortor posuere\n Viverra vitae congue eu consequat ac felis\n Purus non enim praesent elementum", 80);
			scene = "menu";
			//scene = "initLose";
		case "menu":
			Display.draw("banner", 1920/2, 1080/2 - 150, 600, 300);
			buttons["play"].update();
			buttons["leaderboard"].update();
			if (buttons["play"].isReleased()) {
				scene = "initDifficultySelect";
			}
			if (buttons["leaderboard"].isReleased()) {
				AnimationPlayer.clear();
				scene = "initLeaderboard";
			}
			//Delete the dialoge box when it is done updating
			//if (dialogueBoxes["dia"] != undefined && !dialogueBoxes["dia"].update()) {
			//	delete dialogueBoxes["dia"];
			//}
			break;
		case "initCutscene":
			dialogueBoxes["diaBox"] = new DialogueBox(1920/2, 1080 * 3 / 4 + 80, 1920/2, 140);
			switch(Level.level) {
				case 2:
					AnimationPlayer.load("educationShard");
					dialogueBoxes["diaBox"].displayText("You found the shard of education!\nYou've learned how to play the game.", 20);
					break;
				case 3:
					AnimationPlayer.load("educationShard");
					AnimationPlayer.load("progressShard");
					dialogueBoxes["diaBox"].displayText("You found the shard of progress!\nYou've advanced on your quest to reassemble the shards.\nOne more shard left!", 20);
					break;
				
			}
			
			
			scene = "cutscene";
		case "cutscene":
			//Update SceneTiles and shaders
			Scene.drawBackground();
			Scene.updateDoor();
			if (AnimationPlayer.currentAnimations.length == 0) {
				Display.draw((Level.level == 2)? "shard1" : "shard2", 1920/2, 1080/2, 540, 480);
			}
			//Dialogue box
			if(!dialogueBoxes["diaBox"].update()) {
				scene = "initShop";
			}
			break;
		case "initGame":
			Display.clear();
			clearUI();
			//let structure = SceneCreator.createTestScene(48, 27);
			//Scene.initScene(structure, SceneBuilder.bakeScene(structure), 40);
			Level.init();
			scene = "requestingLevel";
			break;
		case "requestingLevel":
			if (!(Scene.structure == null)) {
				scene = "spawningEntities";
			}
			break;
		case "spawningEntities":
			console.log("entities spawned");
			player1.x = 100;
			player1.y = 100;
			player2.x = 300;
			player2.y = 100;
			player1.health = player1.maxHealth;
			player2.health = player2.maxHealth;
			player1.isDead = false;
			player2.isDead = false;
			player1.hasCollision = true;
			player2.hasCollision = true;
			player1.facingLeft = false;
			player2.facingLeft = false;
			Level.spawnEntities();
			scene = "game";
			break;
		case "game":
			//Game calculations
			if (player1.isDead && player2.isDead) {
				AnimationPlayer.clear();
				AnimationPlayer.load("fadeOut");
				scene = "initLose";
				player1 = null;
				player2 = null;
				break;
			}

			Scene.drawBackground();

			//Update/move items and dynamic objects
			Item.updateItems();
			DynamicObject.updateObjects();

			//Scene Editor
			if (Keyboard.shiftPressed) {
				DynamicObject.clear();
				player1 = null;
				player2 = null;
				console.log("Scene builder");
				SceneBuilder.printInstructions();
				SceneBuilder.init();
				scene = "sceneCreator";
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
			Display.drawText("Player 1 Coins: " + player1.coins.toString(), 50, 50, 40, true, "white");
			Display.drawText("Player 2 Coins: " + player2.coins.toString(), 1920 - ("Player 2 Coins: " + player2.coins.toString()).length * 30, 50, 40, true, "white");
			break;
		case "initShop":
			clearUI();
			
			//Player 1 Upgrades
			buttons["player1UpgradeWeapon"] = new Button("upgradeWeapon", 1920/4 - 30, 1080/2 - 300 + 40, 408, 96);
			buttons["player1UpgradeHealth"] = new Button("upgradeMaxHealth", 1920/4 - 30, 1080/2 - 150 + 40, 408, 96);
			buttons["player1UpgradeRegen"] = new Button("upgradeRegen", 1920/4 - 30, 1080/2 + 0 + 40, 408, 96);
			buttons["player1UpgradeSpeed"] = new Button("upgradeSpeed", 1920/4 - 30, 1080/2 + 150 + 40, 408, 96);
			buttons["player1UpgradeJump"] = new Button("upgradeJump", 1920/4 - 30, 1080/2 + 300 + 40, 408, 96);

			//Player 2 Upgrades
			buttons["player2UpgradeWeapon"] = new Button("upgradeWeapon", 1920/4 * 3 + 30, 1080/2 - 300 + 40, 408, 96);
			buttons["player2UpgradeHealth"] = new Button("upgradeMaxHealth", 1920/4 * 3 + 30, 1080/2 - 150 + 40, 408, 96);
			buttons["player2UpgradeRegen"] = new Button("upgradeRegen", 1920/4 * 3 + 30, 1080/2 + 0 + 40, 408, 96);
			buttons["player2UpgradeSpeed"] = new Button("upgradeSpeed", 1920/4 * 3 + 30, 1080/2 + 150 + 40, 408, 96);
			buttons["player2UpgradeJump"] = new Button("upgradeJump", 1920/4 * 3 + 30, 1080/2 + 300 + 40, 408, 96);

			buttons["continue"] = new Button("continue", 1920/2, 1080/2, 456 * 3/4, 64 * 3/4);
			scene = "shop";
		case "shop":
			//Display Shop Background, player icons, and plaques
			Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
			Display.draw("upgradePlaque", 420, 1080/2, 702, 1026);
			Display.draw("upgradePlaque", 1920-420, 1080/2, 702, 1026);
			Display.draw("redPlayer", 1920/2 - 800, 1080/2, 240, 240);
			Display.draw("bluePlayerFlipped", 1920/2 + 800, 1080/2, 240, 240);

			let p1WCost = Math.round((6 + Player.upgradesBought["playerOneWeapon"] * 4) * Difficulty.priceMult);
			let p2WCost = Math.round((6 + Player.upgradesBought["playerTwoWeapon"] * 4) * Difficulty.priceMult);
			let p1HCost = Math.round((6 + Player.upgradesBought["playerOneHealth"] * 4) * Difficulty.priceMult);
			let p2HCost = Math.round((6 + Player.upgradesBought["playerTwoHealth"] * 4) * Difficulty.priceMult);
			let p1RCost = Math.round((6 + Player.upgradesBought["playerOneRegen"] * 4) * Difficulty.priceMult);
			let p2RCost = Math.round((6 + Player.upgradesBought["playerTwoRegen"] * 4) * Difficulty.priceMult);
			let p1SCost = Math.round((6 + Player.upgradesBought["playerOneSpeed"] * 4) * Difficulty.priceMult);
			let p2SCost = Math.round((6 + Player.upgradesBought["playerTwoSpeed"] * 4) * Difficulty.priceMult);
			let p1JCost = Math.round((6 + Player.upgradesBought["playerOneJump"] * 4) * Difficulty.priceMult);
			let p2JCost = Math.round((6 + Player.upgradesBought["playerTwoJump"] * 4) * Difficulty.priceMult);
			
			//Update Shop Buttons and price displays for Player 1
			buttons["player1UpgradeWeapon"].update();
			Display.drawText(p1WCost.toString() + "￠", 1920/4 - 30 + 260, 1080/2 - 300 + 70, 40, true, "white");
			buttons["player1UpgradeHealth"].update();
			Display.drawText(p1HCost.toString() + "￠", 1920/4 - 30 + 260, 1080/2 - 150 + 70, 40, true, "white");
			buttons["player1UpgradeRegen"].update();
			Display.drawText(p1RCost.toString() + "￠", 1920/4 - 30 + 260, 1080/2 + 0 + 70, 40, true, "white");
			buttons["player1UpgradeSpeed"].update();
			Display.drawText(p1SCost.toString() + "￠", 1920/4 - 30 + 260, 1080/2 + 150 + 70, 40, true, "white");
			buttons["player1UpgradeJump"].update();
			Display.drawText(p1JCost.toString() + "￠", 1920/4 - 30 + 260, 1080/2 + 300 + 70, 40, true, "white");
			
			//Update Shop Buttons and price displays for Player 2
			buttons["player2UpgradeWeapon"].update();
			Display.drawText(p2WCost + "￠", 1920/4 * 3 + 30 - 350 - p2WCost.toString().length * 40 * 0.55, 1080/2 - 300 + 70, 40, true, "white");
			buttons["player2UpgradeHealth"].update();
			Display.drawText(p2HCost + "￠", 1920/4 * 3 + 30 - 350 - p2HCost.toString().length * 40 * 0.55, 1080/2 - 150 + 70, 40, true, "white");
			buttons["player2UpgradeRegen"].update();
			Display.drawText(p2RCost + "￠", 1920/4 * 3 + 30 - 350 - p2RCost.toString().length * 40 * 0.55, 1080/2 + 0 + 70, 40, true, "white");
			buttons["player2UpgradeSpeed"].update();
			Display.drawText(p2SCost + "￠", 1920/4 * 3 + 30 - 350 - p2SCost.toString().length * 40 * 0.55, 1080/2 + 150 + 70, 40, true, "white");
			buttons["player2UpgradeJump"].update();
			Display.drawText(p2JCost + "￠", 1920/4 * 3 + 30 - 350 - p2JCost.toString().length * 40 * 0.55, 1080/2 + 300 + 70, 40, true, "white");

			buttons["continue"].update();
			//Detect upgrade button presses and upgrade selected
			//Player 1
			if (buttons["player1UpgradeWeapon"].isReleased() && player1.coins >= p1WCost) { player1.upgradeWeapon(); player1.coins -= p1WCost; Player.upgradesBought["playerOneWeapon"]++;}
			if (buttons["player1UpgradeHealth"].isReleased() && player1.coins >= p1HCost) { player1.upgradeHealth(); player1.coins -= p1HCost; Player.upgradesBought["playerOneHealth"]++;}
			if (buttons["player1UpgradeRegen"].isReleased() && player1.coins >= p1RCost) { player1.upgradeRegen(); player1.coins -= p1RCost; Player.upgradesBought["playerOneRegen"]++;}
			if (buttons["player1UpgradeSpeed"].isReleased() && player1.coins >= p1SCost) { player1.upgradeSpeed(); player1.coins -= p1SCost; Player.upgradesBought["playerOneSpeed"]++;}
			if (buttons["player1UpgradeJump"].isReleased() && player1.coins >= p1JCost) { player1.upgradeJump(); player1.coins -= p1JCost;Player.upgradesBought["playerOneJump"]++;}
			
			//Player 2
			if (buttons["player2UpgradeWeapon"].isReleased() && player2.coins >= p2WCost) { player2.upgradeWeapon();  player2.coins -= p2WCost; Player.upgradesBought["playerTwoWeapon"]++;}
			if (buttons["player2UpgradeHealth"].isReleased() && player2.coins >= p2WCost) { player2.upgradeHealth();  player2.coins -= p2HCost; Player.upgradesBought["playerTwoHealth"]++;}
			if (buttons["player2UpgradeRegen"].isReleased() && player2.coins >= p2WCost) { player2.upgradeRegen();  player2.coins -= p2RCost;Player.upgradesBought["playerTwoRegen"]++;}
			if (buttons["player2UpgradeSpeed"].isReleased() && player2.coins >= p2WCost) { player2.upgradeSpeed();  player2.coins -= p2SCost; Player.upgradesBought["playerTwoSpeed"]++;}
			if (buttons["player2UpgradeJump"].isReleased() && player2.coins >= p2WCost) { player2.upgradeJump();  player2.coins -= p2JCost; Player.upgradesBought["playerTwoJump"]++;}

			if (buttons["continue"].isReleased()) scene = "initGame";
			
			//Display Player Balances
			Display.drawText("Player 1 Coins: " + player1.coins.toString(), 240, 220, 40, true, "white");
			Display.drawText("Player 2 Coins: " + player2.coins.toString(), 1920 - ("Player 2 Coins: " + player2.coins.toString()).length * 40 * 0.55 - 240, 220, 40, true, "white");
			break;
		case "initDifficultySelect":
			clearUI();
			buttons["easy"] = new Button("easy", 1920/2, 1080/2 - 300, 500, 150);
			buttons["medium"] = new Button("medium", 1920/2, 1080/2 - 100, 500, 150);
			buttons["hard"] = new Button("hard", 1920/2, 1080/2 + 100, 500, 150);
			buttons["custom"] = new Button("custom", 1920/2, 1080/2 + 300, 500, 150);
			scene = "difficultySelect";
		case "difficultySelect":
			Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
			back.update();
			if (back.isReleased()) scene = "initMenu";
			buttons["easy"].update();
			buttons["medium"].update();
			buttons["hard"].update();
			buttons["custom"].update();
			if (buttons["easy"].isReleased()) {
				Difficulty.setEasy();
				scene = "initGame";
			}
			if (buttons["medium"].isReleased()) {
				Difficulty.setMedium();
				scene = "initGame";
			}
			if (buttons["hard"].isReleased()) {
				Difficulty.setHard();
				scene = "initGame";
			}
			if (buttons["custom"].isReleased()) {
				scene = "initCustomDifficulty";
			}
			if (scene == "initGame") {
				player1 = new Player(100, 100, "red", "wadfs");
				player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
			}
			break;
		case "initCustomDifficulty":
			clearUI();
			sliders["customEnemyHealthMult"] = new Slider(1920/2, 1080/2 - 300, 600, 90, 0.25, 3, 0.25, 1);
			sliders["customEnemyDamageMult"] = new Slider(1920/2, 1080/2 - 120, 600, 90, 0.25, 3, 0.25, 1);
			sliders["customEnemySpeedMult"] = new Slider(1920/2, 1080/2 + 60, 600, 90, 0.25, 3, 0.25, 1);
			sliders["customPriceMult"] = new Slider(1920/2, 1080/2 + 240, 600, 90, 0.25, 3, 0.25, 1);

			buttons["continue"] = new Button("continue", 1920/2, 1080/2 + 420, 456, 64);
			
			scene = "customDifficulty";
		case "customDifficulty":
			Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
			back.update();
			if (back.isReleased()) scene = "initDifficultySelect";
			
			//Enemy Health Slider
			Display.drawText("Enemy Health Multiplier", 1920/2 - "Enemy Health Multiplier".length*60*0.55/2, 1080/2 - 300 - 40, 60, true, "black");
			sliders["customEnemyHealthMult"].update();
			Display.drawText(sliders["customEnemyHealthMult"].snappedOutput.toString(), 1920/2 + 320, 1080/2 - 300 + 50, 60, true, "black");
			
			//Enemy Damage Slider
			Display.drawText("Enemy Damage Multiplier", 1920/2 - "Enemy Damage Multiplier".length*60*0.55/2, 1080/2 - 120 - 40, 60, true, "black");
			sliders["customEnemyDamageMult"].update();
			Display.drawText(sliders["customEnemyDamageMult"].snappedOutput.toString(), 1920/2 + 320, 1080/2 - 120 + 50, 60, true, "black");
			
			//Enemy Speed Slider
			Display.drawText("Enemy Speed Multiplier", 1920/2 - "Enemy Speed Multiplier".length*60*0.55/2, 1080/2 + 60 - 40, 60, true, "black");
			sliders["customEnemySpeedMult"].update();
			Display.drawText(sliders["customEnemySpeedMult"].snappedOutput.toString(), 1920/2 + 320, 1080/2 + 60 + 50, 60, true, "black");

			//Price Slider
			Display.drawText("Price Multiplier", 1920/2 - "Price Multiplier".length*60*0.55/2, 1080/2 + 240 - 40, 60, true, "black");
			sliders["customPriceMult"].update();
			Display.drawText(sliders["customPriceMult"].snappedOutput.toString(), 1920/2 + 320, 1080/2 + 240 + 50, 60, true, "black");

			//Continue Button
			buttons["continue"].update();
			if (buttons["continue"].isReleased()) {
				Difficulty.enemyDamageMult = sliders["customEnemyDamageMult"].snappedOutput;
				Difficulty.enemyHealthMult = sliders["customEnemyHealthMult"].snappedOutput;
				Difficulty.enemySpeedMult = sliders["customEnemySpeedMult"].snappedOutput;
				Difficulty.priceMult = sliders["customPriceMult"].snappedOutput;
				player1 = new Player(100, 100, "red", "wadfs");
				player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
				scene = "initGame";
			}
			break;
		case "initLose":
			clearUI();
			AnimationPlayer.clear();
			AnimationPlayer.load("fadeIn");
			Display.clear();
			DynamicObject.clear();
			Level.level = 1;
			lastLevel = 1;
			buttons["return"] = new Button("none", 1920/2, 1080/2 + 300, 1000, 144);
			scene = "lose";
		case "lose":
			Display.drawText("you lost...", 1920/2 - "you lost...".length*60/2, 1080/2, 100, true, "white");
			if (!AnimationPlayer.isPlaying("fadeIn")) {
				Display.drawText("click to return", 1920/2 - "click to return".length*60/2, 1080/2 + 400, 100, true, "white");
				buttons["return"].update();
				if (buttons["return"].isReleased()) {
					AnimationPlayer.clear();
					DynamicObject.clear();
					scene = "initMenu";
				}
			}
			break;
		case "sceneCreator":
			if (Keyboard.shiftPressed) {
				Display.clear();
				Scene.displayAll();
				Scene.background = Display.imageData;
				player1 = new Player(100, 100, "red", "wadfs");
				player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
				Level.spawnEntities();
				scene = "game";
			}
			SceneBuilder.update();
			break;
		case "saveScore":
			
			break;
		case "initLeaderboard":
			clearUI();
			socket.emit("getLeaderboard", null);
			Leaderboard.data = null;
			leaderboard = new Leaderboard(1920/2, 1080/2, 780, 1140);
			scene = "leaderboard";
		case "leaderboard":
			Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
			back.update();
			if (back.isReleased()) scene = back.destination;
			leaderboard.update();
			break;
		case "help":
			
			break;
		case "animationTest":
			break;
		default:
			Display.drawText(scene, 1920/2 - scene.length*60/2, 1080/2, 100, true, "white");
			break;
	}

	if (scene == "sceneCreator") {
		SceneBuilder.drawCursor();
	}

	AnimationPlayer.playOverlayAnimations();
	

	//Update Pause Menu
	PauseMenu.update();

	//Draw black tiles on the screen bounds where the player's screen ends
	Display.drawBounds();

	//Reset single frame input varialbes
	Display.resized = false;
	Mouse.resetVars();
	Keyboard.resetVars();
}


//------------------------------------------------------------------------------------//
//Intervals

//Update Interval, fires 60 times per second
setInterval(() => {
	let thisTime = new Date().getTime();
	//Display the game if the page is completely loaded
	if (document.readyState === "complete" && Animation.compiled) {
		if (thisTime - lastFrameTime > 1000/30) {
			//console.warn("LOW FPS: " + Math.round(1000 / (thisTime - lastFrameTime)));
		}
		lastFrameTime = thisTime;
		Display.clear();
		//console.log("start frame");
		updateGame();
		//console.log("end frame");
		if (Display.frames >= Number.MAX_VALUE) {
			Display.frames = 0;
		}
		Display.fps = Math.round(1000 / (thisTime - lastFrameTime));
		Display.frames++;
	}
}, 1000 / 60);

//------------------------------------------------------------------------------------//
//Event Listeners

//Triggers on all mouse down events, updates Mouse to reflect the current situation
canvas.addEventListener("mousedown", (event) => {
	switch (event.button) {
		case 0:
			Mouse.button1Down = true;
			Mouse.button1Pressed = true;
			break;
		case 2:
			Mouse.button2Down = true;
			Mouse.button2Pressed = true;
			break;
		default:
			console.log("Unknown Mouse Button Pressed: " + event.button);
	}
});

//Triggers on all mouse up events, updates Mouse to reflect the current situation
canvas.addEventListener("mouseup", (event) => {
	switch (event.button) {
		case 0:
			Mouse.button1Down = false;
			Mouse.button1Released = true;
			break;
		case 2:
			Mouse.button2Down = false;
			Mouse.button2Released = true;
			break;
		default:
			//Other mouse buttons (middle click) may be useful at some point
			console.log("Unknown Mouse Button Released: " + event.button);
	}
});

//Triggers on all mouse movements, updates Mouse.x and Mouse.y to reflect the current mouse coordinates
canvas.addEventListener('mousemove', (event) => {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
});

//Triggers on all key down events and updates Keyboard to reflect the current situation
document.addEventListener("keydown", (event) => {
	//If the key is a standard character key
	if (event.key.length === 1) {
		Keyboard.keyDown(event.key.toLowerCase());
	}
	//Special key pressed
	switch (event.key) {
		case "Shift":
			Keyboard.shiftDown = true;
			Keyboard.shiftPressed = true;
			break;
		case "Backspace":
			Keyboard.backspaceDown = true;
			Keyboard.backspacePressed = true;
			break;
		case "Escape":
			Keyboard.escapeDown = true;
			Keyboard.escapePressed = true;
			break;
		case "ArrowUp":
			Keyboard.keyDown("up");
			break;
		case "ArrowDown":
			Keyboard.keyDown("down");
			break;
		case "ArrowLeft":
			Keyboard.keyDown("left");
			break;
		case "ArrowRight":
			Keyboard.keyDown("right");
			break;
		default:
			if (event.key.length !== 1) {
				console.log("Unsupported Key Pressed: " + event.key);
			}
	}
});

//Triggers on all key up events and updates Keyboard to reflect the current situation
document.addEventListener("keyup", (event) => {
	//If the key is a standard character key
	if (event.key.length === 1) {
		Keyboard.keyUp(event.key.toLowerCase());
	}
	//Special key pressed
	switch (event.key) {
		case "Shift":
			Keyboard.shiftDown = false;
			break;
		case "Backspace":
			Keyboard.backspaceDown = false;
			break;
		case "Escape":
			Keyboard.escapeDown = false;
			break;
		case "ArrowUp":
			Keyboard.keyUp("up");
			break;
		case "ArrowDown":
			Keyboard.keyUp("down");
			break;
		case "ArrowLeft":
			Keyboard.keyUp("left");
			break;
		case "ArrowRight":
			Keyboard.keyUp("right");
			break;
		default:
			if (event.key.length !== 1) {
				console.log("Unsupported Key Released: " + event.key);
			}
	}
});

document.addEventListener("readystatechange", () => {
	AuidoPlayer.muted = confirm("Enable Audio?");
	Animation.compileTemplates();
});

//------------------------------------------------------------------------------------//
//Server Events

export function sendRequest(name, data) {
	socket.emit(name, data);
}

//Catch scene from server
socket.on("scene", (data) => {
	let structure = [];
	//Create SceneTiles from scene title values
	for (let i = 0; i < data.length; i++) {
		structure.push([]);
		for (let j = 0; j < data[i].length; j++) {
			if (data[i][j]["type"] == "SceneTile") {
				structure[i].push(new SceneTile(data[i][j]["image"], data[i][j]["col"], data[i][j]["row"], data[i][j]["hasCollision"], data[i][j]["hasVines"]));
			} else if (data[i][j]["type"] == "LightTile") {
				structure[i].push(new LightTile(data[i][j]["image"], data[i][j]["col"], data[i][j]["row"], data[i][j]["str"], data[i][j]["rad"], data[i][j]["hasCollision"], data[i][j]["hasVines"]));
			} else if (data[i][j]["type"] == "ChestTile") {
				structure[i].push(new ChestTile(data[i][j]["image"], data[i][j]["col"], data[i][j]["row"], data[i][j]["hasVines"], data[i][j]["coinRange"]));
			} else if (data[i][j]["type"] == "door") {
				structure[i].push(new Door(data[i][j]["image"], data[i][j]["col"], data[i][j]["row"], data[i][j]["hasVines"]));
			} else {
				console.warn("Undetermined SceneTile type. Creating with default values")
				structure[i].push(new SceneTile(data[i][j]["image"], data[i][j]["col"], data[i][j]["row"], data[i][j]["hasCollision"], data[i][j]["hasVines"]));
			}
			
		}
	}
	Scene.initScene(structure, SceneBuilder.bakeScene(structure));
	
	SceneBuilder.structure = structure;
	SceneBuilder.shaderStructure = Scene.shaderStructure;
	
	console.log("recieved");
});

socket.on("leaderboardUpdate", (data) => {
	Leaderboard.data = data;
});

socket.on("log", (msg) => {
	console.log(msg);
});

//Log any recieved server errors
socket.on("error", (msg) => {
	console.warn("Server Error:\n\t" + msg);
});