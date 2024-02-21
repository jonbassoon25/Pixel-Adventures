//Socket Communicator Import
import { SocketCommunicator } from "../SocketCommunicator.js";

//Util Imports
import { Display } from "./Display.js"
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
import { Scene } from "./Scene.js";
import { SceneCreator } from "./SceneCreator.js";

//Game Object Imports
import { SceneTile } from "../gameObjects/SceneTile.js";
import { LightTile } from "../gameObjects/LightTile.js";

//Add baked lighting options
//shared files from Zac (school)
//add dynamic lighting for player

//SceneBuilder Class
export class SceneBuilder {
	//Static Variables
	static cursorX = 0;
	static cursorY = 0;
	static structure = [[]];
	static shaderStructure = null;
	static mouseControlsEnabled = false;
	static collision = false;
	static shaderEditor = false;

	//*********************************************************************//
	//Private Static Methods

	static #moveLeft() {
		if (this.cursorX > 0) {
			this.cursorX -= 1;
		}
	}

	static #moveRight() {
		if (this.cursorX < this.structure[0].length * ((this.shaderEditor)? 2 : 1) - 1) {
			this.cursorX += 1;
		}
	}

	static #moveUp() {
		if (this.cursorY > 0) {
			this.cursorY -= 1;
		}
	}

	static #moveDown() {
		if (this.cursorY < this.structure.length * ((this.shaderEditor)? 2 : 1) - 1) {
			this.cursorY += 1;
		}
	}

	static #setNone() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("none", this.cursorX, this.cursorY);
	}

	static #setLight() {
		let background = this.structure[this.cursorY][this.cursorX].image;
		this.structure[this.cursorY][this.cursorX] = new LightTile(background, this.cursorX, this.cursorY, 15, 10, this.collision);
	}

	static #setPlaceholder() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("placeholder", this.cursorX, this.cursorY, this.collision);
	}

	static #setStone() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("stoneBrick", this.cursorX, this.cursorY, this.collision);
	}

	static #setRottenWood() {
		this.structure[this.cursorY][this.cursorX] = new SceneTile("rottedWoodPlanks", this.cursorX, this.cursorY, this.collision);
	}

	static #setVines() {
		
	}

	static #save() {
		SocketCommunicator.send("saveScene", ["lastSaved", [this.structure, this.shaderStructure]]);
		console.log("saving scene");
	}

	static #load(name = "lastSaved") {
		SocketCommunicator.send("loadScene", name);
		this.init();
		this.clear();
		Scene.structure = null;
		Scene.shaderStructure = null;
		this.structure = null;
		this.shaderStructure = null;
		console.log("loading scene");
		return;
	}

	static #updateCoords() {
		for (let i = 0; i < ((this.shaderEditor)? this.shaderStructure.length : this.structure.length); i++) {
			for (let j = 0; j < ((this.shaderEditor)? this.shaderStructure[i].length : this.structure[i].length); j++) {
				let x = j * Scene.tileSize / (this.shaderEditor? 2 : 1);
				let y = i * Scene.tileSize / (this.shaderEditor? 2 : 1);
				let width = Scene.tileSize / (this.shaderEditor? 2 : 1);
				let height = Scene.tileSize / (this.shaderEditor? 2 : 1);
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
		if (Keyboard.isKeyPressed("k")) {
			this.#save();
		}

		//Load
		if (Keyboard.isKeyPressed("l")) {
			this.#load();
		}

		//Erase
		if (Keyboard.isKeyPressed("c")) {
			if (this.shaderEditor) {
				this.shaderStructure = SceneCreator.createShaderStructure(48, 27);
			} else {
				this.structure = SceneCreator.createEmptyScene(48, 27);
			}
		}

		//Toggle mouse controls
		if (Keyboard.isKeyPressed("m")) {
			this.mouseControlsEnabled = !this.mouseControlsEnabled;
			console.log("Mouse control " + ((this.mouseControlsEnabled)? "enabled" : "disabled"));
		}

		//Toggle shader edit mode
		if (Keyboard.isKeyPressed("p")) {
			if (this.shaderStructure == null) {
				console.log("No shader data. Creating new shader data array");
				this.shaderStructure = SceneCreator.createShaderStructure(Scene.structure[0].length, Scene.structure.length);
			}
			this.shaderEditor = !this.shaderEditor;
			console.log("Shader editor " + ((this.shaderEditor)? "enabled" : "disabled"));
			this.cursorX = 0;
			this.cursorY = 0;
		}

		//Print tile components
		if (Keyboard.isKeyPressed("z")) {
			(this.shaderEditor)? console.log(this.shaderStructure[this.cursorY][this.cursorX]) : console.log(this.structure[this.cursorY][this.cursorX]);
		}

		//Bake lighting
		if (Keyboard.isKeyPressed("b")) {
			this.#bakeLighting();
		}

		if (Keyboard.isKeyPressed("f")) {
			this.collision = !this.collision;
			console.log("Collision " + ((this.collision)? "enabled" : "disabled"));
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
			if (this.shaderEditor) {
				this.shaderStructure[this.cursorY][this.cursorX].shaderLevel += 1;
				console.log("New Shader Value: " + this.shaderStructure[this.cursorY][this.cursorX].shaderLevel.toString());
				return;
			}

			let selectedTile = this.structure[this.cursorY][this.cursorX];

			if (selectedTile instanceof LightTile) {
				selectedTile.strength += 1;
				console.log("New Light Strength: " + selectedTile.strength);
				return;
			}
		}
		if (Keyboard.isKeyPressed("down")) {
			if (this.shaderEditor) {
				this.shaderStructure[this.cursorY][this.cursorX].shaderLevel -= 1;
				console.log("New Shader Value: " + this.shaderStructure[this.cursorY][this.cursorX].shaderLevel.toString());
				return;
			}

			let selectedTile = this.structure[this.cursorY][this.cursorX];

			if (selectedTile instanceof LightTile) {
				selectedTile.strength -= 1;
				console.log("New Light Strength: " + selectedTile.strength);
				return;
			}
		}
		if (Keyboard.isKeyPressed("left")) {
			let selectedTile = this.structure[this.cursorY][this.cursorX];

			if (selectedTile instanceof LightTile) {
				selectedTile.radius -= 1;
				console.log("New Light Radius: " + selectedTile.radius);
				return;
			}
		}
		if (Keyboard.isKeyPressed("right")) {
			let selectedTile = this.structure[this.cursorY][this.cursorX];

			if (selectedTile instanceof LightTile) {
				selectedTile.radius += 1;
				console.log("New Light Radius: " + selectedTile.radius);
				return;
			}
		}

		if (this.shaderEditor) {
			return;
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
		if (Keyboard.isKeyDown("=")) {
			this.#setPlaceholder();
		}
	}

	static #drawCursor() {
		Display.draw("placeholder", (this.cursorX * Scene.tileSize + Scene.tileSize/2)  / ((this.shaderEditor)? 2 : 1), (this.cursorY * Scene.tileSize + 20)  / ((this.shaderEditor)? 2 : 1), Scene.tileSize / ((this.shaderEditor)? 2 : 1), Scene.tileSize / ((this.shaderEditor)? 2 : 1));
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

	//*********************************************************************//
	//Public Static Methods

	/** Resets all SceneBuilder variables to defaults */
	static init() {
		[this.structure, this.shaderStructure] = [Scene.structure, Scene.shaderStructure];
		this.shaderEditor = false;
		this.collision = false;
		this.cursorX = 0;
		this.cursorY = 0;
	}

	/** Clears the current scene data */
	static clear() {
		[this.structure, this.shaderStructure] = SceneCreator.createEmptyShadedScene(48, 27);
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
		Scene.initScene(this.structure, this.shaderStructure, 40);
		Scene.updateTiles();
		this.#drawCursor();
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