/*
Created by Jonathan Hanson and Zac Young

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
import { AudioPlayer } from "./classes/util/AudioPlayer.js";
import { Display } from "./classes/util/Display.js";
import { Keyboard } from "./classes/util/Keyboard.js";
import { Mouse } from "./classes/util/Mouse.js";
import { Scene } from "./classes/util/Scene.js";
import { SceneBuilder } from "./classes/util/SceneBuilder.js";
import { Spawner } from "./classes/util/Spawner.js";
import { DataManager } from "./classes/util/DataManager.js";

//UI Object Imports
import { Leaderboard } from "./classes/UIObjects/Leaderboard.js";
import { PauseMenu } from "./classes/UIObjects/PauseMenu.js";

//Gamestate Imports
import { Cutscene } from "/classes/gamestates/Cutscene.js";
import { Dialogue } from "./classes/gamestates/Dialogue.js";
import { DifficultySelect } from "./classes/gamestates/DifficultySelect.js";
import { Game } from "./classes/gamestates/Game.js";
import { Help } from "./classes/gamestates/Help.js";
import { Scoreboard } from "./classes/gamestates/Scoreboard.js";
import { Lose } from "./classes/gamestates/Lose.js";
import { Menu } from "./classes/gamestates/Menu.js";
import { SaveScore } from "./classes/gamestates/SaveScore.js";
import { Settings } from "./classes/gamestates/Settings.js";
import { Shop } from "./classes/gamestates/Shop.js";
import { Win } from "./classes/gamestates/Win.js";

//Game Object Imports
import { LightTile } from "./classes/gameObjects/LightTile.js";
import { SceneTile } from "./classes/gameObjects/SceneTile.js";
import { Chest } from "./classes/gameObjects/Chest.js";
import { Door } from "./classes/gameObjects/Door.js";

//Game Entity Imports
import { Player } from "./classes/gameEntities/Player.js";
import { Skeleton } from "./classes/gameEntities/Skeleton.js";
import { Slime } from "./classes/gameEntities/Slime.js";

//Basic Object Imports
import { AnimatedObject } from "./classes/basicObjects/AnimatedObject.js";
import { DynamicObject } from "./classes/basicObjects/DynamicObject.js";
import { ShadedObject } from "./classes/basicObjects/ShadedObject.js";
import { VisualObject } from "./classes/basicObjects/VisualObject.js";
import { InteractableObject } from "./classes/basicObjects/InteractableObject.js";


//------------------------------------------------------------------------------------//
//Constants

const canvas = document.getElementById("gameScreen");

//Initalize the server communication handler
const socket = io();

//------------------------------------------------------------------------------------//
//Variables

let lastFrameTime = new Date().getTime();

//------------------------------------------------------------------------------------//
//Main Function

//State variable
let scene = "initClient";//"initClient";

function updateGame() {
	//Update Display values
	Display.calcScreenSize();

	//Update AudioPlayer
	AudioPlayer.update();

	if (Mouse.button2Pressed) {
		let mouse = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, 0, 0)];
		console.log([Math.round(mouse[0]), Math.round(mouse[1])]);
		console.log(Scene.calcBlockCoordinates(mouse[0], mouse[1]));
	}

	AnimationPlayer.playUnderlayAnimations();

	if (Game.level == 0) {
		Game.level = 1;
		DynamicObject.clear();
		scene = "initMenu";
	}
	
	switch (scene) {
		case "none":
			if (Keyboard.isKeyDown("f")) {
				Display.draw("redPlayer", 1920/2, 1080/2, 500, 200);
			}
			if (Keyboard.isKeyPressed(" ")) {
				scene = "initClient";
			}
			break;
		//Initializes menu and other client elements
		case "initClient":
			Menu.init();
			Game.player1 = null;
			Game.player2 = null;
			Player.resetData();
			AnimationPlayer.remove("fadeIn");
			AnimationPlayer.load("menuFadeIn");
			scene = "menu";
			break;
		//Menu Gamestate
		case "initMenu":
			Game.player1 = null;
			Game.player2 = null;
			DynamicObject.dynamicObjects = [];
			Player.resetData();
			Menu.init();
		case "menu":
			Menu.update();
			break;

		//Help Gamestate
		case "initHelp":
			Help.init();
		case "help":
			Help.update();
			break;

		//Cutscene Gamestate
		case "initCutscene":
			Cutscene.init();
		case "cutscene":
			Cutscene.update();
			break;

		//Dialogue Gamestate
		case "initDialogue":
			Dialogue.loadDialogue(Game.level);
			scene = "dialogue";
		case "dialogue":
			switch (Game.level) {
				case 1:
					Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
					break;
				case 2:
					Scene.drawBackground();
					Scene.updateDoor();
					Scene.shade();
					Display.draw("shard1", 1920/2, 1080/2, 540, 480);
					break;
				case 3:
					Scene.drawBackground();
					Scene.updateDoor();
					Scene.shade();
					Display.draw("shard2", 1920/2, 1080/2, 540, 480);
					break;
				case 4:
					Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
					break;
			}
			
			if (!Dialogue.update()) {
				//Game.level++;
				scene = "initDialogue";
				//scene = "initGame";
			}
			
			break;

		//Game Gamestate
		case "initGame":
			Game.init();
		case "game":
			Game.update();
			break;

		//Shop Gamestate
		case "initShop":
			Shop.init();
		case "shop":
			Shop.update();
			break;

		//GameSelection Gamestate
		case "initGameSelection":
			GameSelection.init();
		case "gameSelection":
			GameSelection.update();
			break;

		//DifficultySelect Gamestate
		case "initDifficultySelect":
			DifficultySelect.init();
		case "difficultySelect":
			DifficultySelect.update();
			break;

		//Win Gamestate
		case "initWin":
			Win.init();
		case "win":
			Win.update();
			break;

		//Lose Gamestate
		case "initLose":
			Lose.init();
		case "lose":
			Lose.update();
			break;

		//Scene Creator Gamestate
		case "sceneCreator":
			if (Keyboard.shiftPressed) {
				//Respawn entities
				for (let i = 0; i < Spawner.currentEntities.length; i++) {
					let curEntity = Spawner.currentEntities[i];
					switch (curEntity.type) {
						case "slime":
							new Slime(curEntity.x, curEntity.y);
							break;
						case "skeleton":
							new Skeleton(curEntity.x, curEntity.y);
							break;
						default:
							console.warn("Undetermined Entity Type: " + curEntity.type + ".");
					}
				}
				Scene.flash();
				Game.spawnPlayers();
				Game.spawnMovingTiles();
				document.dispatchEvent(new CustomEvent("sceneChange", {"detail": "game"}));
			}
			SceneBuilder.update();
			break;

		//Save Score Gamestate
		case "initSaveScore":
			SaveScore.textbox.isSelected = true;
			SaveScore.init();
			break;
		case "saveScore":
			SaveScore.update();
			break;

		//Leaderboard Gamestate
		case "initLeaderboard":
			Scoreboard.init();
		case "leaderboard":
			Scoreboard.update();
			break; 

		//Settings Gamestate
		case "initSettings":
			Settings.init();
		case "settings":
			Settings.update();
			break;
			
		//Other Gamestates
		case "initAnimationTest":
			AnimationPlayer.load("effigyAwakens", true);
			scene = "animationTest";
		case "animationTest":
			
			//DynamicObject.updateObjects();
			//Scene.drawShadedObjects();
			break;
		case "initSpawner":
			Spawner.init();
			scene = "spawner";
			break;
		case "spawner":
			Spawner.update();
			break;
		default:
			Display.drawText(scene, 1920/2 - Display.getTextWidth(scene, 100)/2, 1080/2, 100, true, "white");
			break;
	}

	Display.drawShaders();

	AnimationPlayer.playOverlayAnimations();
	
	//Update Pause Menu
	PauseMenu.update();

	//Draw black tiles on the screen bounds where the player's screen ends
	Display.drawBounds();

	//Reset single frame input varialbes
	Display.resized = false;
	Mouse.resetVars();
	if (Keyboard.isKeyPressed("q")) DataManager.logData();
	Keyboard.resetVars();
}


//------------------------------------------------------------------------------------//
//Intervals

//Update Interval, fires 60 times per second
setInterval(() => {
	let thisTime = new Date().getTime();
	//Display the game if the page is completely loaded
	if (document.readyState === "complete" && Animation.compiled) {
		if (Display.frames % 120 == 0 && Display.fps <= 30) {
			console.log("LOW FPS: " + Display.fps);
		}
		//if (Display.frames % 10 == 0) {
			//console.log("FPS: " + Display.fps);
		//}
		Display.clear();
		//console.log("start frame");
		updateGame();
		//console.log("end frame");
		if (Display.frames >= Number.MAX_VALUE) {
			Display.frames = 0;
		}
		Display.fps = Math.round(1000 / (thisTime - lastFrameTime));
		lastFrameTime = thisTime;
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
	if (event.key.length === 1 && event.code.includes("Key")) {
		Keyboard.keyDown(event.key.toLowerCase());
	}
	//If the key is a standard number key
	if (event.key.length === 1 && event.code.includes("Digit")) {
		Keyboard.keyDown(event.code.substring(5).toLowerCase());
	}
	//If the key is a space
	if (event.key == " ") {
		Keyboard.keyDown(event.key);
	}
	//Special key pressed
	switch (event.code) {
		case "ShiftLeft":
		case "ShiftRight":
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
		case "AltLeft":
		case "AltRight":
			Keyboard.altDown = true;
			Keyboard.altPressed = true;
			break;
		case "ControlLeft":
		case "ControlRight":
			Keyboard.controlDown = true;
			Keyboard.controlPressed = true;
			break;
		case "Slash":
			Keyboard.keyDown("/");
			break;
		case "Backquote":
			if (Settings.debug) {
				Keyboard.backquoteDown = true;
				Keyboard.backquotePressed = true;
			}
			break;
		default:
			if (event.key.length !== 1) {
				console.log("Unsupported Key Pressed: " + event.key);
			}
	}
});

//Triggers on all key up events and updates Keyboard to reflect the current situation
document.addEventListener("keyup", (event) => {
	//If the key is a standard letter key
	if (event.key.length === 1 && event.code.includes("Key")) {
		Keyboard.keyUp(event.key.toLowerCase());
	}
	//If the key is a standard number key
	if (event.key.length === 1 && event.code.includes("Digit")) {
		Keyboard.keyUp(event.code.substring(5).toLowerCase());
	}
	//If the key is a space
	if (event.key == " ") {
		Keyboard.keyUp(event.key);
	}
	//Special key pressed
	switch (event.code) {
		case "ShiftLeft":
		case "ShiftRight":
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
		case "AltLeft":
		case "AltRight":
			Keyboard.altDown = false;
			break;
		case "ControlLeft":
		case "ControlRight":
			Keyboard.controlDown = false;
			break;
		case "Slash":
			Keyboard.keyUp("/");
			break;
		case "Backquote":
			Keyboard.backquoteDown = false;
			break;
		default:
			if (event.key.length !== 1) {
				console.log("Unsupported Key Released: " + event.key);
			}
	}
});

document.addEventListener("readystatechange", () => {
	AnimatedObject.compileAnimations();
	Animation.compileTemplates();
});

document.addEventListener("sceneChange", (event) => {
	scene = event.detail;
});

document.addEventListener("emit", (event) => {
	socket.emit(event.detail["name"], event.detail["data"]);
});

//------------------------------------------------------------------------------------//
//Server Events

//Catch scene from server
socket.on("scene", (data) => {
	console.log("Received Scene Data from Server.");
	console.log("Clearing data...");
	DynamicObject.clear();
	InteractableObject.clear();
	Scene.decorations = [];

	//Load Decorations
	console.log("Loading Decorations...");
	let receivedDecorations = data["decorations"];
	
	for (let i = 0; i < receivedDecorations.length; i++) {
		let curDecor = receivedDecorations[i];
		Scene.decorations.push(new VisualObject(curDecor["image"], curDecor["x"], curDecor["y"], curDecor["width"], curDecor["height"]));
	}

	//Load and Spawn Objects
	console.log("Loading Objects...");
	let receivedObjects = data["objects"];
	InteractableObject.interactableObjects = [];
	
	for (let i = 0; i < receivedObjects.length; i++) {
		let curObj = receivedObjects[i];
		switch (curObj["type"]) {
			case "chest":
				new Chest(curObj["x"], curObj["y"], curObj["coinRange"]);
				break;
			case "door":
				new Door(curObj["x"], curObj["y"]);
				break;
			default:
				console.warn("Undetermined Object Type: " + curObj["type"] + ". Creating Standard Object");
				new ShadedObject(curObj["image"], curObj["orderNum"], curObj["x"], curObj["y"], curObj["width"], curObj["height"], curObj["shade"]);
		}
	}

	//Load and Spawn Entities
	console.log("Loading Entities...");
	let receivedEntities = data["entities"];
	Spawner.currentEntities = [];
	for (let i = 0; i < receivedEntities.length; i++) {
		let curEntity = receivedEntities[i];
		//Spawner.currentEntities.push(curEntity);
		switch (curEntity["type"]) {
			case "slime":
				Spawner.currentEntities.push(new Slime(curEntity["x"], curEntity["y"]));
				break;
			case "skeleton":
				Spawner.currentEntities.push(new Skeleton(curEntity["x"], curEntity["y"]));
				break;
			default:
				console.warn("Undetermined Entity Type: " + curEntity["type"] + ". Creating Standard Entity");
				Spawner.currentEntities.push(new DynamicObject(curEntity["type"], curEntity["orderNum"], curEntity["x"], curEntity["y"], curEntity["width"], curEntity["height"], curEntity["hasCollision"], curEntity["shade"]));
		}
	}

	let receivedStructure = data["structure"];
	let structure = [];

	//Create SceneTiles from scene title values
	console.log("Loading Structure...");
	for (let i = 0; i < receivedStructure.length; i++) {
		structure.push([]);
		for (let j = 0; j < receivedStructure[i].length; j++) {

			let curTile = receivedStructure[i][j];

			switch (curTile["type"]) {
				case "SceneTile":
					structure[i].push(new SceneTile(curTile["image"], curTile["col"], curTile["row"], curTile["hasCollision"]));
					break;
				case "LightTile":
					structure[i].push(new LightTile(curTile["image"], curTile["col"], curTile["row"], curTile["str"], curTile["rad"], curTile["hasCollision"]));
					break;
				default:
					console.warn("Undetermined SceneTile Type: " + curTile["type"] + ". Creating Standard SceneTile");
					structure[i].push(new SceneTile(curTile["image"], curTile["col"], curTile["row"], curTile["hasCollision"]));
			}
		}
	}
	console.log("Baking Scene...");
	Scene.initScene(structure, SceneBuilder.bakeScene(structure));
	//Link by reference
	SceneBuilder.structure = Scene.structure;
	SceneBuilder.shaderStructure = Scene.shaderStructure;

	console.log("Flashing Scene...");
	Scene.flash();
	
	console.log("Loading Completed.");
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