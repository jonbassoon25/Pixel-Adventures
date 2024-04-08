//Socket Communicator Import
import { SocketCommunicator } from "../SocketCommunicator.js";

//Util Imports
import { Display } from "./Display.js"
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
import { Scene } from "./Scene.js";
import { SceneCreator } from "./SceneCreator.js";

//Game Object Imports
import { ChestTile } from "../gameObjects/ChestTile.js";
import { Door } from "../gameObjects/Door.js";
import { LightTile } from "../gameObjects/LightTile.js";
import { SceneTile } from "../gameObjects/SceneTile.js";

//SceneBuilder Class
export class SceneBuilder {
	//Static Variables
	static cursorX = 0;
	static cursorY = 0;
	static structure = [[]];
	static mouseControlsEnabled = false;
	static collisionEditor = false;
	static instructions = 
	"Controls:\n" + 
	"	WASD to move\n" + 
	"	Use arrow keys to edit block specific properties\n" +
	"	Press 'b' to bake scene lighting\n" +
	"	Press 'c' to clear current scene\n" + 
	"	Press 'k' to save current scene\n" + 
	"	Press 'l' to load last saved scene\n" +
	"	Press 'm' to enable mouse controls\n" + 
	"	Press 'n' to toggle collision for placed blocks\n" +
	"	Press 'o' to toggle collision editor\n" +
	"	Press 'z' to log the currently selected tile\n" +
	"	Press '1' to replace tile with air\n" + 
	"	Press '2' to replace tile with stone bricks\n" + 
	"	Press '4' to replace tile with rotten wood\n" + 
	"	Press '6' to place light\n" + 
	"	Press '7' to place vines\n" +
	"	Press '8' to place chest\n" +
	"	Press '9' to place door\n" +
	"	Press '=' to replace tile with placeholder\n" + 
  "\n	Press 'h' to relog instructions";

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

	static #setNone() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("none", this.cursorX, this.cursorY);
	}

	static #setLight() {
		let replacedTile = this.structure[this.cursorY][this.cursorX];
		this.structure[this.cursorY][this.cursorX] = new LightTile(replacedTile.image, this.cursorX, this.cursorY, 15, 10, false, replacedTile.hasVines);
	}

	static #setPlaceholder() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("placeholder", this.cursorX, this.cursorY, false);
	}

	static #setStone() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("stoneBrick", this.cursorX, this.cursorY, false);
	}

	static #setRottenWood() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("wood", this.cursorX, this.cursorY, true);
	}

	static #setChest() {
		let replacedTile = this.structure[this.cursorY][this.cursorX];
		this.structure[this.cursorY][this.cursorX] = new ChestTile(replacedTile.image, this.cursorX, this.cursorY, replacedTile.hasVines);
	}

	static #setDoor() {
		let replacedTile = this.structure[this.cursorY][this.cursorX];
		this.structure[this.cursorY][this.cursorX] = new Door(replacedTile.image, this.cursorX, this.cursorY, replacedTile.hasVines);
	}

	static #save() {
		SocketCommunicator.send("saveScene", ["lastSaved", this.structure]);
		console.log("saving scene");
	}

	static #load(name = "lastSaved") {
		SocketCommunicator.send("loadScene", name);
		this.init();
		this.clear();
		Scene.structure = null;
		Scene.shaderStructure = null;
		this.structure = null;
		console.log("loading scene");
		return;
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
		//Save
		if (Keyboard.isKeyDown("`") && Keyboard.isKeyPressed("k")) {
			this.#save();
		}

		//Load
		if (Keyboard.isKeyDown("`") && Keyboard.isKeyPressed("l")) {
			this.#load();
			return;
		}

		//Erase
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

		//Bake lighting
		if (Keyboard.isKeyPressed("b")) {
			this.#bakeLighting();
		}

		if (Keyboard.isKeyPressed("o")) {
			this.collisionEditor = !this.collisionEditor;
			console.log("Collision editor " + ((this.collisionEditor)? "enabled" : "disabled"));
		}

		if (Keyboard.isKeyPressed("h")) {
			this.printInstructions();
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
			if (currentTile instanceof ChestTile) {
				currentTile.coinRange[1]++;
				console.log("New Coin Range: " + currentTile.coinRange);
			}
		}
		
		if (Keyboard.isKeyPressed("down")) {
			if (currentTile instanceof LightTile) {
				currentTile.strength -= 1;
				console.log("New Light Strength: " + currentTile.strength);
			}
			if (currentTile instanceof ChestTile) {
				if (currentTile.coinRange[1] > currentTile.coinRange[0]) {
					currentTile.coinRange[1]--;
					console.log("New Coin Range: " + currentTile.coinRange);
				} else if (currentTile.coinRange[0] > 1) {
					currentTile.coinRange[0]--;
					currentTile.coinRange[1]--;
					console.log("New Coin Range: " + currentTile.coinRange);
				} else {
					console.log("coinRange cannot go lower");
				}
			}
		}
		
		if (Keyboard.isKeyPressed("left")) {
			if (currentTile instanceof LightTile) {
				currentTile.radius -= 1;
				console.log("New Light Radius: " + currentTile.radius);
			}
			if (currentTile instanceof ChestTile) {
				if (currentTile.coinRange[0] > 1) {
					currentTile.coinRange[0]--;
					console.log("New Coin Range: " + currentTile.coinRange);
				} else {
					console.log("Min coins cannot go lower")
				}
			}
		}
		
		if (Keyboard.isKeyPressed("right")) {
			if (currentTile instanceof LightTile) {
				currentTile.radius += 1;
				console.log("New Light Radius: " + currentTile.radius);
			}
			if (currentTile instanceof ChestTile) {
				if (currentTile.coinRange[0] < currentTile.coinRange[1]) {
					currentTile.coinRange[0]++;
					console.log("New Coin Range: " + currentTile.coinRange);
				} else {
					currentTile.coinRange[0]++;
					currentTile.coinRange[1]++;
					console.log("New Coin Range: " + currentTile.coinRange);
				}
			}
		}

		//Toggle collision for sceneTile
		if (Keyboard.isKeyPressed("n")) {
			currentTile.hasCollision = !currentTile.hasCollision;
			console.log("Collision " + ((currentTile.hasCollision)? "enabled" : "disabled"));
		}

		//Tile placing inputs
		if (Keyboard.isKeyDown("1")) {
			this.#setNone();
		}
		if (Keyboard.isKeyDown("2")) {
			this.#setStone();
		}
		if (Keyboard.isKeyDown("4")) {
			this.#setRottenWood();
		}
		
		if (Keyboard.isKeyDown("6")) {
			this.#setLight();
		}
		if (Keyboard.isKeyPressed("7")) {
			currentTile.hasVines = !currentTile.hasVines;
			console.log("Vines " + ((currentTile.hasVines)? "enabled" : "disabled"));
		}
		if (Keyboard.isKeyPressed("8")) {
			this.#setChest();
		}
		if (Keyboard.isKeyPressed("9")) {
			this.#setDoor();
		}
		if (Keyboard.isKeyDown("=")) {
			this.#setPlaceholder();
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
				this.shaderStructure[i][j].shaderLevel = 20;
			}
		}

		//For every light tile
		for (let i = 0; i < lightTiles.length; i++) {
			let light = lightTiles[i];
			//loop through the box around every light tile (determined by radius) and change the shaderTile values on a linear scale based on their distance from the light source. If not 20, assign the lighter of the 2
			for (let j = Math.max(2 * (light.row - light.radius + 1), 0); j < this.shaderStructure.length && j < 2 * (light.row + light.radius); j++) {
				for (let i = Math.max(2 * (light.col - light.radius + 1), 0); i < this.shaderStructure[j].length && i < 2 * (light.col + light.radius); i++) {
					let shaderTile = this.shaderStructure[j][i];
					
					let shaderLevel = Math.min(-1 + (20 - light.strength) + Math.round(20 * (Math.sqrt(Math.pow((0.5 * (shaderTile.col - 1/2)) - light.col, 2) + Math.pow((0.5 * (shaderTile.row - 1/2)) - light.row, 2))) / light.radius), shaderTile.shaderLevel);
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
		this.mouseControlsEnabled = false;
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
		if (this.structure == null) {
			this.structure = Scene.structure;
		}
		if (this.shaderStructure == null) {
			this.shaderStructure = Scene.shaderStructure;
		}
		this.#takeInput();
		if (this.structure == null) {
			return;
		}
		for (let i = 0; i < Scene.structure.length; i++) {
			for (let j = 0; j < Scene.structure[i].length; j++) {
				Scene.structure[i][j].update();
			}
		}
		if (this.collisionEditor) {
			this.#displayCollisionTiles();
		}
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