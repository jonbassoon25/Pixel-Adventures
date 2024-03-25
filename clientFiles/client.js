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
import { PauseMenu } from "./classes/UIObjects/PauseMenu.js";
import { Slider } from "./classes/UIObjects/Slider.js";
import { Textbox } from "./classes/UIObjects/Textbox.js";

//Game Object Imports
import { ChestTile } from "./classes/gameObjects/ChestTile.js";
import { LightTile } from "./classes/gameObjects/LightTile.js";
import { SceneTile } from "./classes/gameObjects/SceneTile.js";
import { ShaderTile } from "./classes/gameObjects/ShaderTile.js";

//Game Entity Imports
import { DynamicObject } from "./classes/gameEntities/DynamicObject.js";
import { Player } from "./classes/gameEntities/Player.js";
import { NPC } from "./classes/gameEntities/NPC.js";
import { Coin } from "./classes/gameEntities/Coin.js";
import { Item } from "./classes/gameEntities/Item.js";


//------------------------------------------------------------------------------------//
//Constants

const canvas = document.getElementById("gameScreen");

//Initalize the server communication handler
const socket = io();

//------------------------------------------------------------------------------------//
//Variables

let buttons = {};

let sliders = {};

let textboxes = {};

let boxes = {};

//------------------------------------------------------------------------------------//
//Util Functions

function clearUI() {
	buttons = {};
	sliders = {};
	textboxes = {};
	boxes = {};
}

//------------------------------------------------------------------------------------//
//Main Function

//State variable
let scene = "initMenu";
let npc;

function updateGame() {
	//Update Display values
	Display.calcScreenSize();

	if (Mouse.button2Pressed) {
		let mouse = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, 0, 0)];
		console.log([Math.round(mouse[0]), Math.round(mouse[1])]);
		console.log(Scene.calcBlockCoordinates(mouse[0], mouse[1]));
	}

	switch (scene) {
		case "initMenu":
			clearUI();
			buttons["button1"] = new Button("playButton", 1920/2, 1080/2, 408, 144);
		case "menu":
			buttons["button1"].update();
			if (buttons["button1"].isPressed()) {
				
				scene = "initGame";
			}
			break;
		case "initGame":
			clearUI();
			let structure = SceneCreator.createTestScene(48, 27);
			Scene.initScene(structure, SceneBuilder.bakeScene(structure), 40);
			console.log("coin spawned");
			new Coin(416, 736);
			scene = "game";
		case "game":
			Scene.drawBackground();

			if (Keyboard.isKeyPressed("r")) {
				npc = new NPC(200, 20);
			}
			if (Keyboard.isKeyPressed("t")) {
				new Player(100, 100, "red", "wadfs");
				new Player(300, 100, "blue", ["up", "left", "right", "/", "down"]);
			}
			if (Mouse.button1Pressed) {
				if (npc != undefined) {
					let newTarget = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, 0, 0)];
					npc.target = [newTarget[0], newTarget[1]];
				}
			}

			//Update backgrounds of old moving objects in Scene
			Scene.update(Item.items);
			Scene.update(DynamicObject.dynamicObjects);

			//Update/move items and dynamic objects
			Item.updateItems();
			DynamicObject.updateObjects();
			
			//Update backgrounds of new moving objects in Scene
			Scene.update(Item.items);
			Scene.update(DynamicObject.dynamicObjects);
			
			if (Keyboard.isKeyPressed("c")) {
				DynamicObject.clear();
			}
			if (Keyboard.shiftPressed) {
				DynamicObject.clear();
				console.log("Scene builder");
				SceneBuilder.printInstructions();
				SceneBuilder.init();
				scene = "sceneCreator";
			}

			//Draw items and dynamicObjects in Scene
			Item.drawItems();
			DynamicObject.drawObjects();

			//Shade the scene
			Scene.shade();

			//If the background isn't null, set the background to the current screen
			if (Scene.background != null) {
				Scene.background = Display.imageData;
			}
			break;
		case "sceneCreator":
			if (Keyboard.shiftPressed) {
				Display.clear();
				Scene.displayAll();
				Scene.background = Display.imageData;
				scene = "game";
			}
			SceneBuilder.update();
			break;
	}

	if (scene == "sceneCreator") {
		SceneBuilder.drawCursor();
	}
	

	//Update Pause Menu
	PauseMenu.update();

	//Reset single frame input varialbes
	Display.resized = false;
	Mouse.resetVars();
	Keyboard.resetVars();
}


//------------------------------------------------------------------------------------//
//Intervals

//Update Interval, fires 60 times per second
setInterval(() => {
	//Display the game if the page is completely loaded
	if (document.readyState === "complete") {
		Display.clear();
		updateGame();
		if (Display.frames >= Number.MAX_VALUE) {
			Display.frames = 0;
		}
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

socket.on("log", (msg) => {
	console.log(msg);
});

//Log any recieved server errors
socket.on("error", (msg) => {
	console.warn("Server Error:\n\t" + msg);
});