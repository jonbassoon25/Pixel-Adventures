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
import { Display } from "./classes/util/Display.js";
import { Keyboard } from "./classes/util/Keyboard.js";
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

//------------------------------------------------------------------------------------//
//Util Functions

function clearUI() {
	buttons = {};
	sliders = {};
	textBoxes = {};
	dialogueBoxes = {};
	boxes = {};
}

//------------------------------------------------------------------------------------//
//Main Function

//State variable
let scene = "initMenu";
let npc;
let player1;
let player2;
let slime;

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
			break;
		case "menu":
			Display.draw("banner", 1920/2, 1080/2 - 150, 600, 300);
			buttons["play"].update();
			buttons["leaderboard"].update();
			if (buttons["play"].isPressed()) {
				AnimationPlayer.clear();
				player1 = new Player(100, 100, "red", "wadfs");
				player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
				player1.coins = 1000000;
				player2.coins = 1000000;
				scene = "initGame";
				//scene = "initShop";
			}
			if (buttons["leaderboard"].isPressed()) {
				AnimationPlayer.clear();
				scene = "initLeaderboard";
			}
			//Delete the dialoge box when it is done updating
			//if (dialogueBoxes["dia"] != undefined && !dialogueBoxes["dia"].update()) {
			//	delete dialogueBoxes["dia"];
			//}
			break;
		case "initGame":
			clearUI();
			let structure = SceneCreator.createTestScene(48, 27);
			Scene.initScene(structure, SceneBuilder.bakeScene(structure), 40);
			new Coin(416, 736);
			player1 = new Player(100, 100, "red", "wadfs");
			player2 = new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
			slime = new Slime(900, 100);
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
				slime = null;
				break;
			}

			Scene.drawBackground();
			
			//Update backgrounds of old moving objects in Scene
			Scene.update(Item.items);
			Scene.update(DynamicObject.dynamicObjects);

			//Update/move items and dynamic objects
			Item.updateItems();
			DynamicObject.updateObjects();
			
			//Update backgrounds of new moving objects in Scene
			Scene.update(Item.items);
			Scene.update(DynamicObject.dynamicObjects);
			Scene.update(ChestTile.chestTiles);
			Scene.update(Grave.graves);

			if (Keyboard.shiftPressed) {
				DynamicObject.clear();
				player1 = null;
				player2 = null;
				slime = null;
				console.log("Scene builder");
				SceneBuilder.printInstructions();
				SceneBuilder.init();
				scene = "sceneCreator";
				break;
			}

			//Draw items and dynamicObjects in Scene
			Item.drawItems();
			DynamicObject.drawObjects();

			//Shade the scene
			Scene.shade();
			Display.drawText("Player 1 Coins: " + player1.coins.toString(), 50, 50, 40, true, "white");
			Display.drawText("Player 2 Coins: " + player2.coins.toString(), 1920 - ("Player 2 Coins: " + player2.coins.toString()).length * 30, 50, 40, true, "white");
			break;
		case "initShop":
			//Player 1 Upgrades
			buttons["player1UpgradeWeapon"] = new Button("placeholder", 1920/4, 1080/2 - 300, 408, 144);
			buttons["player1UpgradeHealth"] = new Button("placeholder", 1920/4, 1080/2 - 100, 408, 144);
			buttons["player1UpgradeRegen"] = new Button("placeholder", 1920/4, 1080/2 + 100, 408, 144);
			buttons["player1UpgradeSpeed"] = new Button("placeholder", 1920/4, 1080/2 + 300, 408, 144);
			buttons["player1UpgradeJump"] = new Button("placeholder", 1920/4, 1080/2 + 500, 408, 144);
			
			//Player 2 Upgrades
			buttons["player2UpgradeWeapon"] = new Button("placeholder", 1920/4 * 3, 1080/2 - 300, 408, 144);
			buttons["player2UpgradeHealth"] = new Button("placeholder", 1920/4 * 3, 1080/2 - 100, 408, 144);
			buttons["player2UpgradeRegen"] = new Button("placeholder", 1920/4 * 3, 1080/2 + 100, 408, 144);
			buttons["player2UpgradeSpeed"] = new Button("placeholder", 1920/4 * 3, 1080/2 + 300, 408, 144);
			buttons["player2UpgradeJump"] = new Button("placeholder", 1920/4 * 3, 1080/2 + 500, 408, 144);
			scene = "shop";
			break;
		case "shop":
			//Display Shop Background, darkened stone bricks
			Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);

			//Update Shop Buttons for Player 1
			buttons["player1UpgradeWeapon"].update();
			buttons["player1UpgradeHealth"].update();
			buttons["player1UpgradeRegen"].update();
			buttons["player1UpgradeSpeed"].update();
			buttons["player1UpgradeJump"].update();
			//Update Shop Buttons for Player 2
			buttons["player2UpgradeWeapon"].update();
			buttons["player2UpgradeHealth"].update();
			buttons["player2UpgradeRegen"].update();
			buttons["player2UpgradeSpeed"].update();
			buttons["player2UpgradeJump"].update();
			//Detect upgrade button presses and upgrade selected
			//Player 1
			if (buttons["player1UpgradeWeapon"].isReleased()) player1.upgradeWeapon();
			if (buttons["player1UpgradeHealth"].isReleased()) player1.upgradeHealth();
			if (buttons["player1UpgradeRegen"].isReleased()) player1.upgradeRegen();
			if (buttons["player1UpgradeSpeed"].isReleased()) player1.upgradeSpeed();
			if (buttons["player1UpgradeJump"].isReleased()) player1.upgradeJump();
			//Player 2
			if (buttons["player2UpgradeWeapon"].isReleased()) player2.upgradeWeapon();
			if (buttons["player2UpgradeHealth"].isReleased()) player2.upgradeHealth();
			if (buttons["player2UpgradeRegen"].isReleased()) player2.upgradeRegen();
			if (buttons["player2UpgradeSpeed"].isReleased()) player2.upgradeSpeed();
			if (buttons["player2UpgradeJump"].isReleased()) player2.upgradeJump();
			//Display Player Coins
			Display.drawText("Player 1 Coins: " + player1.coins.toString(), 50, 50, 40, true, "white");
			Display.drawText("Player 2 Coins: " + player2.coins.toString(), 1920 - ("Player 2 Coins: " + player2.coins.toString()).length * 30, 50, 40, true, "white");

			//Combined coins

			break;
		case "initLose":
			AnimationPlayer.clear();
			AnimationPlayer.load("fadeIn");
			Display.clear();
			buttons["return"] = new Button("none", 1920/2, 1080/2 + 300, 1000, 144);
			scene = "lose";
			break;
		case "lose":
			Display.drawText("you lost...", 1920/2 - "you lost...".length*60/2, 1080/2, 100, true, "white");
			if (!AnimationPlayer.isPlaying("fadeIn")) {
				Display.drawText("click to return", 1920/2 - "click to return".length*60/2, 1080/2 + 400, 100, true, "white");
				buttons["return"].update();
				if (buttons["return"].isPressed()) {
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
				slime = new Slime(900, 100);
				scene = "game";
			}
			SceneBuilder.update();
			break;
		case "saveScore":
			
			break;
		case "initLeaderboard":
			socket.emit("getLeaderboard", null);
			Leaderboard.data = null;
			leaderboard = new Leaderboard(1920/2, 1080/2, 850, 990);
			scene = "leaderboard";
			break;
		case "leaderboard":
			Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
			/* back button code */
			let back = new BackButton(150, 100);
			back.update();
			if (back.isPressed()) scene = back.destination;
			leaderboard.update();
			break;
		case "help":
			
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
		if (thisTime - lastFrameTime > 1000/45) {
			console.warn("LOW FPS: " + Math.round(1000 / (thisTime - lastFrameTime)));
		}
		lastFrameTime = thisTime;
		Display.clear();
		updateGame();
		if (Display.frames >= Number.MAX_VALUE) {
			Display.frames = 0;
		}
		Display.fps = Math.round(1000 / (thisTime - lastFrameTime));
		Display.frames++;
	}
	//console.log(frames);
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