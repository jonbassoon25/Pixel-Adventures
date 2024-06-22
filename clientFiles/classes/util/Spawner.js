//Util Imports
import { Display } from "./Display.js";
import { FileManager } from "./FileManager.js";
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
import { Scene } from "./Scene.js";
import { Util } from "./Util.js";

//Game Object Imports
import { Chest } from "../gameObjects/Chest.js";
import { Door } from "../gameObjects/Door.js";

//Game Entity Imports
import { Player } from "../gameEntities/Player.js";
import { Slime } from "../gameEntities/Slime.js";
import { Skeleton } from "../gameEntities/Skeleton.js";

import { Gamestate } from "../gamestates/Gamestate.js";

//Basic Objects
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { VisualObject } from "../basicObjects/VisualObject.js";

//Spawner Class
export class Spawner extends Gamestate {
	//Static Variables

	static snapToGrid = true;

	static currentEntities = [];
	static currentObjects = [];
	static currentDecorations = Scene.decorations;

	static grabbedObject = null;

	static objectOffset = [0, 0];

	static selectedObject = null;

	static menuIndex = 0;
	static entityIndex = 0;
	static objectIndex = 0;
	static decorationIndex = 0;
	
	static menuKeys = ["none", "entities", "objects", "decorations"];
	static menus = {
		"none": ["none"],
		"entities": [
			"bluePlayer",
			"redPlayer",
			"slime",
			"skeleton"
		],
		"objects": [
				"chest",
				"door"
		],
		"decorations": [
			"sunset",
			"bannerWhiteFBLA",
			"plainVineSet1 1/3",
			"plainVineSet2 1/3",
			"flowerVineSet1 1/3",
			"flowerVineSet2 1/3",
			"fruitVineSet1 1/3",
			"fruitVineSet2 1/3",
			"plainVineSet1 2/3",
			"plainVineSet2 2/3",
			"flowerVineSet1 2/3",
			"flowerVineSet2 2/3",
			"fruitVineSet1 2/3",
			"fruitVineSet2 2/3",
			"plainVineSet1 3/3",
			"plainVineSet2 3/3",
			"flowerVineSet1 3/3",
			"flowerVineSet2 3/3",
			"fruitVineSet1 3/3",
			"fruitVineSet2 3/3",
			"woodenTable",
			"chairRight",
			"chairLeft",
			"bookshelf",
			"skull"
		]
	}
	
	static instructions = 
	"Controls:\n" +
	"	Click Object with no Object in hand to select\n" +
	"	Click and Drag Object with no Object in hand to move Object\n" +
	"	Click with Object in hand to spawn Object\n" +
	"	'ctrl + click' to cycle through selected object menu\n" + 
	"	'ctrl + right click' to cycle through different object menus" + 
	"	Press 's' to toggle snap to grid"

	//*********************************************************************//
	//Private Static Methods

	static #drawOverlay() {
		
	}

	static #displaySelection() {
		
	}

	static #calculateObjectOffset() {
		this.objectOffset = [this.grabbedObject.x - this.cursorX, this.grabbedObject.y - this.cursorY];
	}

	static #grabObject() {
		//Determine what Object was clicked on
		for (let i = 0; i < this.currentEntities.length; i++) {
			if (this.currentEntities[i].isEnclosing(this.cursorPosition)) {
				this.grabbedObject = this.currentEntities[i];
				this.#calculateObjectOffset();
				return;
			}
		}
		for (let i = 0; i < this.currentObjects.length; i++) {
			if (this.currentObjects[i].isEnclosing(this.cursorPosition)) {
				this.grabbedObject = this.currentObjects[i];
				this.#calculateObjectOffset();
				return;
			}
		}
		for (let i = 0; i < this.currentDecorations.length; i++) {
			if (this.currentDecorations[i].isEnclosing(this.cursorPosition)) {
				this.grabbedObject = this.currentDecorations[i];
				this.#calculateObjectOffset();
				return;
			}
		}

		//No Object was clicked
		this.grabbedObject = null;
		this.objectOffset = [0, 0];
	}

	static #generateSelectedObject() {
		let newObject = null;
		if (this.menuIndex == 1) {
			switch (this.menus["entities"][this.entityIndex]) {
				case "bluePlayer":
					newObject = new Player(...this.cursorPosition, "blue", ["up", "left", "right", "/", "down"]);
					break;
				case "redPlayer":
					newObject = new Player(...this.cursorPosition, "red", "wadfs");
					break;
				case "slime":
					newObject = new Slime(...this.cursorPosition);
					break;
				case "skeleton":
					newObject = new Skeleton(...this.cursorPosition);
					break;
				default:
					console.error("Unknown Entitiy: " + this.menus["entities"][this.entityIndex]);
			}
		} else if (this.menuIndex == 2) {
			switch (this.menus["objects"][this.objectIndex]) {
				case "chest":
					newObject = new Chest(...this.cursorPosition);
					break;
				case "door":
					newObject = new Door(...this.cursorPosition);
					break;
				default:
					console.error("Unknown Object: " + this.menus["objects"][this.objectIndex]);
			}
		} else if (this.menuIndex == 3) {
			switch (this.menus["decorations"][this.decorationIndex]) {
				case "sunset":
					newObject = new VisualObject("sunset", ...this.cursorPosition, 330, 230);
					break;
				case "bannerWhiteFBLA":
					newObject = new VisualObject("bannerWhiteFBLA", ...this.cursorPosition, 114, 180);
					break;
				case "plainVineSet1 1/3":
				case "plainVineSet2 1/3":
				case "flowerVineSet1 1/3":
				case "flowerVineSet2 1/3":
				case "fruitVineSet1 1/3":
				case "fruitVineSet2 1/3":
				case "plainVineSet1 2/3":
				case "plainVineSet2 2/3":
				case "flowerVineSet1 2/3":
				case "flowerVineSet2 2/3":
				case "fruitVineSet1 2/3":
				case "fruitVineSet2 2/3":
				case "plainVineSet1 3/3":
				case "plainVineSet2 3/3":
				case "flowerVineSet1 3/3":
				case "flowerVineSet2 3/3":
				case "fruitVineSet1 3/3":
				case "fruitVineSet2 3/3":
					newObject = new VisualObject(this.menus["decorations"][this.decorationIndex], this.cursorX, this.cursorY + (576/8) + 4, 64, 576/3);
					break;
				case "woodenTable":
					newObject = new VisualObject("woodenTable", ...this.cursorPosition, 24*3, 14*3);
					break;
				case "chairLeft":
				case "chairRight":
					newObject = new VisualObject(this.menus["decorations"][this.decorationIndex], ...this.cursorPosition, 12*3, 14*3);
					break;
				case "bookshelf":
					newObject = new VisualObject("bookshelf", ...this.cursorPosition, 120, 144);
					break;
				case "skull":
					newObject = new VisualObject("skull", ...this.cursorPosition, 105, 105);
					break;
				default:
					console.error("Unknown Decoration: " + this.menus["decorations"][this.decorationIndex]);
			}
		} else if (this.menuIndex != 0) {
			console.error("Invalid Menu Index: " + this.menuIndex + ". Resetting to 0");
			this.menuIndex = 0;
		}
		return newObject;
	}
	
	static #takeInput() {
		if (Keyboard.isKeyPressed("s")) {
			this.snapToGrid = !this.snapToGrid;
		}

		if (Mouse.button1Pressed && !Keyboard.controlDown) {
			if (this.menuIndex == 0) { //No object in hand
				this.#grabObject();
			} else { //Object in hand
				if (this.menuIndex == 1) {
					this.currentEntities.push(this.#generateSelectedObject());
				} else if (this.menuIndex == 2) {
					this.currentObjects.push(this.#generateSelectedObject());
				} else if (this.menuIndex == 3) {
					this.currentDecorations.push(this.#generateSelectedObject());
					//Scene.flash();
				}
			}
		}


		if (Mouse.button1Down && !Keyboard.controlDown) {
			//Drag if an object is selected
			if (this.grabbedObject != null) {
				this.grabbedObject.x = this.cursorX - this.objectOffset[0];
				this.grabbedObject.y = this.cursorY - this.objectOffset[1];
			}
		}

		if (Mouse.button1Released) {
			this.grabbedObject = null;
		}

		if (Keyboard.controlDown && Mouse.button1Pressed) {
			if (this.menuIndex == 1) {
				if (++this.entityIndex == this.menus["entities"].length) this.entityIndex = 0;
			} else if (this.menuIndex == 2) {
				if (++this.objectIndex == this.menus["objects"].length) this.objectIndex = 0;
			} else if (this.menuIndex == 3) {
				if (++this.decorationIndex == this.menus["decorations"].length) this.decorationIndex = 0;
			}
			if (this.selectedObject != null && this.selectedObject.delete != null) this.selectedObject.delete();
			this.selectedObject = this.#generateSelectedObject();
		}

		if (Keyboard.controlDown && Mouse.button2Pressed) {
			if (++this.menuIndex == this.menuKeys.length) this.menuIndex = 0;
			if (this.selectedObject != null && this.selectedObject.delete != null) this.selectedObject.delete();
			this.selectedObject = this.#generateSelectedObject();
		}
	}

	//*********************************************************************//
	//Public Static Methods

	/** Resets spawner values to defaults */
	static init() {
		this.placementIndex = 0;
		this.entityIndex = 0;
		this.objectIndex = 0;
		this.decorationIndex = 0;
	}

	/** Completely initalizes the Spawner and clears all Objects. Flashes the Scene to clear decorations*/
	static clear() {
		this.init();

		for (let i = 0; i < this.currentEntities.length; i++) {
			this.currentEntities[i].delete();
		}
		for (let i = 0; i < this.currentObjects.length; i++) {
			this.currentObjects[i].delete();
		}
		this.currentEntities = [];
		this.currentObjects = [];
		this.currentDecorations = [];

		Scene.flash();
	}

	/** Updates the Spawner */
	static update() {
		//console.log(this.selectedObject);
		if (Scene.structure == null) {
			return;
		}
		//Handles saving and loading of files
		FileManager.takeInput();
		
		if (Scene.structure == null) {
			return;
		}

		this.#takeInput();

		if (Keyboard.shiftPressed) {
			this.setScene("game");
		}

		if (this.selectedObject != null) [this.selectedObject.x, this.selectedObject.y] = this.cursorPosition;

		for (let i = 0; i < this.currentEntities.length; i++) {
			if (this.currentEntities[i].healthbar != null) this.currentEntities[i].healthbar.update();
		}

		if (this.selectedObject != null && this.selectedObject.healthbar != undefined) {
			this.selectedObject.healthbar.update();
		}
		

		Scene.drawBackground();
		Scene.drawShadedObjects();

		if (this.selectedObject != null && !(this.selectedObject instanceof ShadedObject)) {
			this.selectedObject.draw();
		}

		this.#drawOverlay();

		if (Keyboard.isKeyPressed("g")) {
			console.log(this.currentDecorations);
			console.log(Scene.decorations);
		}
	}

	static get cursorPosition() {
		if (this.snapToGrid) {
			return Scene.inverseCalcBlockCoordinates(...Scene.calcBlockCoordinates(...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)));
		}
		return [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)];
	}

	static get cursorX() {
		return this.cursorPosition[0];
	}
	static get cursorY() {
		return this.cursorPosition[1];
	}
}