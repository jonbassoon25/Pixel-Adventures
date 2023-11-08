/*
Created by Jonathan Hanson and Zac Young

client.js

Client side javascript for FBLA Game 2023 - 2024

Created: 11.4.23
*/

//Page Link: https://fbla-game.jonbassoon25.repl.co/

//To kick random users to google
//window.location.replace("http://www.google.com");

//------------------------------------------------------------------------------------//
//Imports

//Util Classes

import { Display } from "./classes/util/Display.js"
import { Keyboard } from "./classes/util/Keyboard.js"
import { Mouse } from "./classes/util/Mouse.js";

//UI Object Classes

import { Button } from "./classes/UIObjects/Button.js";
import { Textbox } from "./classes/UIObjects/Textbox.js";
import { Slider } from "./classes/UIObjects/Slider.js";
import { UI } from "./classes/UIObjects/UI.js";


//------------------------------------------------------------------------------------//
//Constants

const canvas = document.getElementById("gameScreen");

//Initalize the server communication handler
const socket = io();

//------------------------------------------------------------------------------------//
//Main Function

//Define test classes
let testButton = new Button("placeholder", 100, 100, 100, 100);
let testTextbox = new Textbox(500, 100, 500, 50);
let testSlider = new Slider(500, 200, 500, 50, 0, 100, 5);

function updateGame() {
	Display.calcScreenSize();

	//Test button class using subsistAsButton() method
	if (testButton.subsistAsButton()) {
		console.log("Button Released");
	}

	//Test textbox class
	testTextbox.update();

	//Test slider class
	testSlider.update();
	UI.drawText(testSlider.snapOutput().toString(), 800, 230, 50, true);
	

	
	//Reset single frame input varialbes
	Mouse.resetVars();
	Keyboard.resetVars();
}


//------------------------------------------------------------------------------------//
//Intervals

//Update Interval, fires 30 times per second
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
}, 1000/30);

//------------------------------------------------------------------------------------//
//Event Listeners

//triggers on all mouse down events, sets mouseButtonState to "down"
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

//triggers on all mouse up events, sets mouseButtonState to "false"
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
			console.log("Unknown Mouse Button Released: " + event.button);
	}
});

//triggers on all mouse movements
canvas.addEventListener('mousemove', (event) => {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
});

//Triggers on all key presses and sets the keyPressed value to true
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
		default:
			if (event.key.length !== 1) {
				console.log("Unsupported Key Pressed: " + event.key);
			}
	}
	//allow key presses to register in-game
	updateGame();
});

//Removes the key from keysPressed on key release
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
		default:
			if (event.key.length !== 1) {
				console.log("Unsupported Key Released: " + event.key);
			}
	}
	//allow key presses to register in-game
	updateGame();
});

//------------------------------------------------------------------------------------//
//Server Events

socket.on("error", (msg) => {
	console.log(msg);
});