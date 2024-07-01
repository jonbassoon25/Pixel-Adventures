//Util Imports
import { Display } from "./Display.js"
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
import { Scene } from "./Scene.js";
import { SceneCreator } from "./SceneCreator.js";
import { Util } from "./Util.js";

//Game Object Imports
import { LightTile } from "../gameObjects/LightTile.js";
import { SceneTile } from "../gameObjects/SceneTile.js";

//Basic Object Imports
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { FileManager } from "./FileManager.js";

//Gamestate Imports
import { Game } from "../gamestates/Game.js";

//Scene Builder Class
export class SceneBuilder {
	//Static Variables
	static cursorX = 0;
	static cursorY = 0;
	static structure = [[]];
	static mouseControlsEnabled = true;
	static collisionEditor = false;

	static collisionTileIndex = 0;
	static collisionTiles = [
		"wood",
		"stoneBrick"
	]

	static collisionlessTileIndex = 0;
	static collisionlessTiles = [
		"stoneBrick",
		"dirt",
		"none"
	]

	
	static instructions = 
	"Controls:\n" + 
	"	Hold control and left/right click to select\n		collision (left) and collisionless (right) tiles\n" + 
	"	Left click to place a collision tile\n" + 
	"	Right click to place a collisionless tile\n" + 
	"	Press 'l' to place a lantern\n" + 
	"	Use arrow keys to edit block specific properties\n		(ex: light radius and strength)" +
	"	Press 'b' to bake scene lighting\n" +
	"	Press '~ + alt + 1-9' to save current scene\n" + 
	"	Press '~ + 1-9' to load last saved scene\n" +
	"	Press 'm' to toggle mouse controls\n" + 
	"	With keyboard controls, press WASD to move\n" + 
	"	Press 'n' to toggle collision for hovered tile\n" +
	"	Press 'o' to toggle collision viewer\n" +
	"	Press 'z' to log the currently selected tile\n" +
  "\n	Hold 'h' to display controls";
	//"	Press 'c' to clear current scene\n" + (doesn't work)

	//*********************************************************************//
	//Private Static Methods

	static #moveLeft() {
		if (this.cursorX > 0) {
			this.cursorX -= 1;
		}
	}

	static #moveRight() {
		if (this.cursorX < this.structure[0].length - 1) {
			this.cursorX += 1;
		}
	}

	static #moveUp() {
		if (this.cursorY > 0) {
			this.cursorY -= 1;
		}
	}

	static #moveDown() {
		if (this.cursorY < this.structure.length - 1) {
			this.cursorY += 1;
		}
	}

	static #setTile(name, hasCollision = false) {
		switch (name) {
			case "none":
			case "wood":
			case "stoneBrick":
			case "dirt":
				this.structure[this.cursorY][this.cursorX] = new SceneTile(name, this.cursorX, this.cursorY, hasCollision);
				break;
			case "light":
				let replacedTile = this.structure[this.cursorY][this.cursorX];
				this.structure[this.cursorY][this.cursorX] = new LightTile(replacedTile.image, this.cursorX, this.cursorY, 15, 10, replacedTile.hasCollision, false);
				break;
			default:
				this.structure[this.cursorY][this.cursorX] = new SceneTile("placeholder", this.cursorX, this.cursorY, hasCollision);
				break;
		}
	}

	static #updateCoords() {
		for (let i = 0; i < this.structure.length; i++) {
			for (let j = 0; j < this.structure[i].length; j++) {
				let x = j * Scene.tileSize;
				let y = i * Scene.tileSize;
				let width = Scene.tileSize;
				let height = Scene.tileSize;
				[x, y, width, height] = Display.calcElementDimensions(x, y, width, height);
				if (Mouse.x - width/2 >= x && Mouse.x - width/2 <= x + width && Mouse.y - height/2 >= y && Mouse.y - height/2 <= y + height) {
					this.cursorX = j;
					this.cursorY = i;
				}
			}
		}
	}

	static #takeInput() {

		//Erase (doesn't work)
		if (Keyboard.isKeyPressed("c")) {
			this.structure = SceneCreator.createEmptyScene(48, 27);
		}

		//Toggle mouse controls
		if (Keyboard.isKeyPressed("m")) {
			this.mouseControlsEnabled = !this.mouseControlsEnabled;
			console.log("Mouse control " + ((this.mouseControlsEnabled)? "enabled" : "disabled"));
		}

		let currentTile = this.structure[this.cursorY][this.cursorX];

		//Print tile components
		if (Keyboard.isKeyPressed("z")) {
			console.log(currentTile);
		}

		//Display tile information
		if (Keyboard.isKeyDown("z")) {
			let x;
			let y;
			let tileInfo = 
				"Type: " + currentTile.type + "\n" +
				"Image: " + currentTile.image + "\n" +
				"Row: " + currentTile.row + "\n" +
				"Column: " + currentTile.col + "\n" +
				"hasCollision: " + currentTile.hasCollision + "\n";
			[x, y] = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)];
			Display.drawText(tileInfo, x + 50, y - 15, 25, true, "white");
		}

		//Bake lighting
		if (Keyboard.isKeyPressed("b")) {
			this.#bakeLighting();
		}

		if (Keyboard.isKeyPressed("o")) {
			this.collisionEditor = !this.collisionEditor;
			console.log("Collision editor " + ((this.collisionEditor)? "enabled" : "disabled"));
		}

		if (Keyboard.isKeyDown("h")) {
			let x;
			let y;
			[x, y] = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)];
			Display.drawText(this.instructions, x + 50, y - 15, 25, true, "white");
			//this.printInstructions();
		}

		//Movement inputs
		if (Keyboard.isKeyPressed("w")) {
			this.#moveUp();
		}
		if (Keyboard.isKeyPressed("a")) {
			this.#moveLeft();
		}
		if (Keyboard.isKeyPressed("s")) {
			this.#moveDown();
		}
		if (Keyboard.isKeyPressed("d")) {
			this.#moveRight();
		}

		//Mouse inputs
		if (this.mouseControlsEnabled) {
			this.#updateCoords();
		}

		//Tile editing inputs
		if (Keyboard.isKeyPressed("up")) {
			if (currentTile instanceof LightTile) {
				currentTile.strength += 1;
				console.log("New Light Strength: " + currentTile.strength);
			}
		}
		
		if (Keyboard.isKeyPressed("down")) {
			if (currentTile instanceof LightTile) {
				currentTile.strength -= 1;
				console.log("New Light Strength: " + currentTile.strength);
			}
		}
		
		if (Keyboard.isKeyPressed("left")) {
			if (currentTile instanceof LightTile) {
				currentTile.radius -= 1;
				console.log("New Light Radius: " + currentTile.radius);
			}
		}
		
		if (Keyboard.isKeyPressed("right")) {
			if (currentTile instanceof LightTile) {
				currentTile.radius += 1;
				console.log("New Light Radius: " + currentTile.radius);
			}
		}

		//Toggle collision for sceneTile
		if (Keyboard.isKeyPressed("n")) {
			currentTile.hasCollision = !currentTile.hasCollision;
			console.log("Collision " + ((currentTile.hasCollision)? "enabled" : "disabled"));
		}

		//Tile placing inputs
		if (Keyboard.isKeyDown("l")) {
			this.#setTile("light");
		}
		if (Keyboard.controlDown) {
			let x;
			let y;
			[x, y] = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)];
			Display.draw("blackTile", x, y, 120, 52, true, false, 0, 50);
			Display.draw(this.collisionTiles[this.collisionTileIndex], x - 35, y, 40, 40);
			Display.draw(this.collisionlessTiles[this.collisionlessTileIndex], x + 35, y, 40, 40);

			if (Mouse.button1Pressed) {
				if (++this.collisionTileIndex == this.collisionTiles.length) this.collisionTileIndex = 0;
			}
			if (Mouse.button2Pressed) {
				if (++this.collisionlessTileIndex == this.collisionlessTiles.length) this.collisionlessTileIndex = 0;
			}
		} else if (Mouse.button1Down) {
			this.#setTile(this.collisionTiles[this.collisionTileIndex], true);
		} else if (Mouse.button2Down) {
			this.#setTile(this.collisionlessTiles[this.collisionlessTileIndex], false);
		}
	}

	static #bakeLighting() {
		let lightTiles = [];
		//find light tiles
		for (let i = 0; i < this.structure.length; i++) {
			for (let j = 0; j < this.structure[i].length; j++) {
				if (this.structure[i][j] instanceof LightTile) {
					lightTiles.push(this.structure[i][j]);
				}
			}
		}

		//set all shaderTiles to have maximum darkness
		for (let i = 0; i < this.shaderStructure.length; i++) {
			for (let j = 0; j < this.shaderStructure[i].length; j++) {
				//this.shaderStructure[i][j].shaderLevel = 20;
				this.shaderStructure[i][j].shaderLevel = 1 ;
			}
		}

		//For every light tile
		for (let i = 0; i < lightTiles.length; i++) {
			let light = lightTiles[i];
			//loop through the box around every light tile (determined by radius) and change the shaderTile values on a linear scale based on their distance from the light source. If not 20, assign the lighter of the 2
			for (let j = Math.max(Scene.lightQuality * (light.row - light.radius + 1), 0); j < this.shaderStructure.length && j < Scene.lightQuality * (light.row + light.radius); j++) {
				for (let i = Math.max(Scene.lightQuality * (light.col - light.radius + 1), 0); i < this.shaderStructure[j].length && i < Scene.lightQuality * (light.col + light.radius); i++) {
					let shaderTile = this.shaderStructure[j][i];
					let shaderLevel = Math.pow(Util.pythagorean(((1/Scene.lightQuality) * (shaderTile.col - Scene.lightQuality/2 + 1/2)) - light.col, ((1/Scene.lightQuality) * (shaderTile.row - Scene.lightQuality/2 + 1/2)) - light.row)/light.radius, 1) * 20/light.strength;
					shaderLevel = Math.min(shaderLevel, shaderTile.shaderLevel);
					shaderTile.shaderLevel = shaderLevel;
				}
			}
		}
	}

	static #displayCollisionTiles() {
		for (let i = 0; i < this.structure.length; i++) {
			for (let j = 0; j < this.structure[i].length; j++) {
				let currentTile = this.structure[i][j];
				if (currentTile.hasCollision) {
					Display.draw("redTile", currentTile.x, currentTile.y, currentTile.width, currentTile.height);
				} else {
					Display.draw("blueTile", currentTile.x, currentTile.y, currentTile.width, currentTile.height);
				}
			}
		}
	}

	//*********************************************************************//
	//Public Static Methods

	/** Resets all SceneBuilder variables to defaults */
	static init() {
		[this.structure, this.shaderStructure] = [Scene.structure, Scene.shaderStructure];
		this.collision = false;
		this.mouseControlsEnabled = true;
		this.cursorX = 0;
		this.cursorY = 0;
	}

	static bakeScene(structure) {
		this.clear();
		this.structure = structure;
		this.#bakeLighting();
		return this.shaderStructure;
	}

	

	/** Clears the current scene data */
	static clear() {
		[this.structure, this.shaderStructure] = SceneCreator.createEmptyShadedScene(48, 27);
	}

	/** Draws the scene editor cursor */
	static drawCursor() {
		Display.draw("crosshair", (this.cursorX * Scene.tileSize + Scene.tileSize/2), (this.cursorY * Scene.tileSize + 20), Scene.tileSize, Scene.tileSize);
	}
	
	/** Prints the SceneBuilder Instructions */
	static printInstructions() {
		console.log(this.instructions);
	}

	/** Updates the SceneBuilder by taking user input and drawing the updated scene */
	static update() {
		if (Scene.structure == null) {
			return;
		}
		//Handles saving and loading of files
		FileManager.takeInput();
		if (Scene.structure == null) {
			return;
		}
		
		if (this.structure == null) {
			this.structure = Scene.structure;
		}
		if (this.shaderStructure == null) {
			this.shaderStructure = Scene.shaderStructure;
		}
		for (let i = 0; i < Scene.structure.length; i++) {
			for (let j = 0; j < Scene.structure[i].length; j++) {
				Scene.structure[i][j].update();
			}
		}
		if (this.collisionEditor) {
			this.#displayCollisionTiles();
		}
		this.drawCursor();
		this.#takeInput();
	}

	//*********************************************************************//
	//Getters

	static get position() {
		return [this.cursorX, this.cursorY];
	}

	//*********************************************************************//
	//Setters

	/**
	Sets the position of the cursor
	@param {number[]} position - New position of cursor
	*/
	static set position(position) {
		this.cursorX = position[0];
		this.cursorY = position[1];
	}
}