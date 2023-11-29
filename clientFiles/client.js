/*
Created by Jonathan Hanson and Zac Young

client.js

Main client side javascript file for FBLA Game 2023 - 2024

Created: 11.4.23
*/

//Page Link: https://fbla-game.jonbassoon25.repl.co/

//To kick random users to google
//window.location.replace("http://www.google.com");

//------------------------------------------------------------------------------------//
//Imports

//Util Imports

import { Display } from "./classes/util/Display.js"
import { Keyboard } from "./classes/util/Keyboard.js"
import { Mouse } from "./classes/util/Mouse.js";
import { HitboxManager } from "./classes/util/HitboxManager.js";
import { Physics } from "./classes/util/Physics.js";
import { Scene } from "./classes/util/Scene.js";
import { SceneCreator } from "./classes/util/SceneCreator.js";
import { textures } from "./classes/util/Textures.js";
import { Util } from "./classes/util/Util.js";

//UI Object Imports

import { Button } from "./classes/UIObjects/Button.js";
import { PauseMenu } from "./classes/UIObjects/PauseMenu.js";
import { Slider } from "./classes/UIObjects/Slider.js";
import { Textbox } from "./classes/UIObjects/Textbox.js";
import { UI } from "./classes/UIObjects/UI.js";

//Game Object Imports
import { SceneTile } from "./classes/gameObjects/SceneTile.js";

//Game Entity Imports
import { PhysicsObject } from "./classes/gameEntities/PhysicsObject.js";
import { Player } from "./classes/gameEntities/Player.js";

Scene.initScene(SceneCreator.createPlaceholderScene(48, 27));

//------------------------------------------------------------------------------------//
//Constants

//Define the canvas
const canvas = document.getElementById("gameScreen");

//Initalize the server communication handler
const socket = io();

//------------------------------------------------------------------------------------//
//Main Function

//Define test classes
let testButton = new Button("placeholder", 100, 100, 100, 100);
let testTextbox = new Textbox(500, 100, 500, 50);
let testSlider = new Slider(500, 200, 500, 50, 0, 100, 5);

let obj1;
let obj2;

function updateGame() {
	Display.calcScreenSize();

	//For UI Element Testing
	/*
	//Test button class using subsistAsButton() method
	if (testButton.subsistAsButton()) {
		console.log("Button Released");
	}

	//Test textbox class, currently textbox char limit and text y position aren't calculated correctly
	testTextbox.update();

	//Test slider class
	testSlider.update();
	UI.drawText(testSlider.snapOutput().toString(), 800, 230, 50, true);
 	*/

	//Update Scene
	Scene.update();

	if (Keyboard.isKeyPressed("r")) {
		obj1 = new PhysicsObject("placeholder", 570, 100, 50, 50, 50);
		obj2 = new PhysicsObject("placeholder", 1350, 100, 50, 50, 50);

		obj1.velocityVector = [600, 0];
		obj2.velocityVector = [-200, 0];
	} 
	if (Keyboard.isKeyPressed("c")) {
		Physics.clearAll();
	}
	if (Keyboard.isKeyPressed("p")) {
		console.log(Util.clone(obj1));
	}
	

	

	//Update Physics Objects
	Physics.update();

	//Update Pause Menu
	PauseMenu.update();
	
	//Reset single frame input varialbes
	Mouse.resetVars();
	Keyboard.resetVars();
}


//------------------------------------------------------------------------------------//
//Intervals

//Update Interval, fires 60 times per second
setInterval(() => {
	//Display the game if the page is completely loaded
	if (document.readyState === "complete") {
		updateGame();
	}
	//Stop frames from going over the max value that can be expressed by the variable
	if (frames >= Number.MAX_VALUE) {
		frames = 0;
	}
	//Incriment frames once per frame
	frames++;
}, 1000/60);

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
		default:
			if (event.key.length !== 1) {
				console.log("Unsupported Key Released: " + event.key);
			}
	}
});

//------------------------------------------------------------------------------------//
//Server Events

//Log any recieved server errors
socket.on("error", (msg) => {
	console.log(msg);
});