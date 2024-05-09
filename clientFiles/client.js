/*
Created by Jonathan Hanson, Zac Young, Mariasha Taariq

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
import { Display } from "./classes/util/Display.js";
import { Keyboard } from "./classes/util/Keyboard.js";
import { Level } from "./classes/util/Level.js";
import { Mouse } from "./classes/util/Mouse.js";
import { Scene } from "./classes/util/Scene.js";
import { SceneBuilder } from "./classes/util/SceneBuilder.js";
import { Util } from "./classes/util/Util.js";

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
import { Shop } from "./classes/gamestates/Shop.js";
import { Win } from "./classes/gamestates/Win.js";

//Game Object Imports
import { ChestTile } from "./classes/gameObjects/ChestTile.js";
import { Door } from "./classes/gameObjects/Door.js";
import { LightTile } from "./classes/gameObjects/LightTile.js";
import { SceneTile } from "./classes/gameObjects/SceneTile.js";

//Game Entity Imports
import { DynamicObject } from "./classes/gameEntities/DynamicObject.js";
import { Player } from "./classes/gameEntities/Player.js";
import { Settings } from "./classes/gamestates/Settings.js";


//------------------------------------------------------------------------------------//
//Constants

const canvas = document.getElementById("gameScreen");

//Initalize the server communication handler
const socket = io();

//------------------------------------------------------------------------------------//
//Variables

let lastFrameTime = new Date().getTime();

let lastLevel = 1;

//------------------------------------------------------------------------------------//
//Util Functions

//------------------------------------------------------------------------------------//
//Main Function

//State variable
let scene = "initClient";

function updateGame() {
	//Update Display values
	Display.calcScreenSize();

	if (Mouse.button2Pressed) {
		let mouse = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, 0, 0)];
		console.log([Math.round(mouse[0]), Math.round(mouse[1])]);
		console.log(Scene.calcBlockCoordinates(mouse[0], mouse[1]));
	}

	AnimationPlayer.playUnderlayAnimations();

	if (Level.level == 0) {
		Level.level = 1;
		lastLevel = 1;
		DynamicObject.clear();
		scene = "initMenu";
	}

	if (Level.level != lastLevel && !(Level.level == 4)) {
		scene = "initCutscene";
		lastLevel = Level.level;
	} else if (Level.level == 4) {
		Level.level = 1;
		lastLevel = 1;
		scene = "initWin";
	}
	
	switch (scene) {
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
			Dialogue.loadDialogue(Level.level);
			scene = "dialogue";
		case "dialogue":
			switch (Level.level) {
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
				Level.level++;
				lastLevel = Level.level;
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
			lastLevel = 1;
			Lose.init();
		case "lose":
			Lose.update();
			break;

		//Scene Creator Gamestate
		case "sceneCreator":
			if (Keyboard.shiftPressed) {
				Scene.flash();
				
				Game.player1 = new Player(100, 100, "red", "wadfs");
				Game.player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
				Level.spawnEntities();
				scene = "game";
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
			
		//Other Gamestates
		case "animationTest":
			break;
		default:
			Display.drawText(scene, 1920/2 - scene.length*60/2, 1080/2, 100, true, "white");
			break;
	}

	if (scene == "sceneCreator") {
		SceneBuilder.drawCursor();
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
		if (Display.frames % 120 == 0) {
			console.log("FPS: " + Display.fps);
		}
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
	console.log("initializing scene");
	
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