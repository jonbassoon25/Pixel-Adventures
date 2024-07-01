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
import { NPC } from "../gameEntities/NPC.js";

//Gamestate Imports
import { Gamestate } from "../gamestates/Gamestate.js";
import { Game } from "../gamestates/Game.js";

//Basic Objects
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { VisualObject } from "../basicObjects/VisualObject.js";
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { InteractableObject } from "../basicObjects/InteractableObject.js";

//Spawner Class
export class Spawner extends Gamestate {
	//Static Variables

	static snapToGrid = true;
	static shadersEnabled = true;

	static currentEntities = [];
	//static currentObjects = [];

	static grabbedObject = null;

	static dragOffset = [0, 0];

	static selectedObject = null;

	static menuIndex = 0;
	static entityIndex = 0;
	static objectIndex = 0;
	static decorationIndex = 0;
	
	static menuKeys = ["none", "entities", "objects", "decorations"];
	static menus = {
		"none": ["none"],
		"entities": [
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
			"vine",
			/*"plainVineSet1 1/3",
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
			"fruitVineSet2 3/3",*/
			"woodenTable",
			"chairRight",
			"chairLeft",
			"bookshelf",
			"skull",
			"fountain"
		]
	}
	static vines = [
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
		"fruitVineSet2 3/3"
	]
	
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

	static #calculateDragOffset() {
		this.dragOffset = [this.grabbedObject.x - this.cursorX, this.grabbedObject.y - this.cursorY];
	}

	static #fetchObjects() {
		this.currentEntities = [];
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			if (DynamicObject.dynamicObjects[i] instanceof NPC) {
				this.currentEntities.push(DynamicObject.dynamicObjects[i]);
			}
		}
	}
	
	static #grabObject() {
		//Determine what Object was clicked on
		for (let i = 0; i < this.currentEntities.length; i++) {
			if (this.currentEntities[i].isEnclosing(this.cursorPosition)) {
				this.grabbedObject = this.currentEntities[i];
				this.#calculateDragOffset();
				return;
			}
		}
		for (let i = 0; i < InteractableObject.interactableObjects.length; i++) {
			if (InteractableObject.interactableObjects[i].isEnclosing(this.cursorPosition)) {
				this.grabbedObject = InteractableObject.interactableObjects[i];
				this.#calculateDragOffset();
				return;
			}
		}
		for (let i = 0; i < Scene.decorations.length; i++) {
			if (Scene.decorations[i].isEnclosing(this.cursorPosition)) {
				this.grabbedObject = Scene.decorations[i];
				this.#calculateDragOffset();
				return;
			}
		}

		//No Object was clicked
		this.grabbedObject = null;
		this.dragOffset = [0, 0];
	}

	static #deleteObject() {
		//Determine what Object is being hovered upon
		for (let i = 0; i < this.currentEntities.length; i++) {
			if (this.currentEntities[i].isEnclosing(this.cursorPosition)) {
				this.currentEntities[i].delete();
				this.currentEntities = Util.delIndex(this.currentEntities, i);
				return;
			}
		}
		for (let i = 0; i < InteractableObject.interactableObjects.length; i++) {
			if (InteractableObject.interactableObjects[i].isEnclosing(this.cursorPosition)) {
				InteractableObject.interactableObjects[i].delete();
				Util.delIndex(InteractableObject.interactableObjects, i);
				return;
			}
		}
		for (let i = 0; i < Scene.decorations.length; i++) {
			if (Scene.decorations[i].isEnclosing(this.cursorPosition)) {
				Util.delIndex(Scene.decorations, i);
				Scene.flash();
				return;
			}
		}
		console.log("nothing deleted");
	}
	
	static #getSelectionOffset() {
		if (this.menuIndex == 1) {
			switch (this.menus["entities"][this.entityIndex]) {
				case "slime":
					return [0, 0];
				case "skeleton":
					return [0, -10];
				default:
					return [0, 0];
			}
		} else if (this.menuIndex == 2) {
			switch (this.menus["objects"][this.objectIndex]) {
				case "chest":
					return [0, 0];
				case "door":
					return [0, 0];
				default:
					return [0, 0];
			}
		} else if (this.menuIndex == 3) {
			switch (this.menus["decorations"][this.decorationIndex]) {
				case "sunset":
					return [0, 0];
				case "bannerWhiteFBLA":
					return [0, 0];
				case "vine":
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
					return [0, (576/8) + 4];
				case "woodenTable":
					return [0, 0];
				case "chairLeft":
					return [10, 0];
				case "chairRight":
					return [-10, 0];
				case "bookshelf":
					return [0, -12];
				case "skull":
					return [0, 0];
				case "fountain":
					return [0, 6];
				default:
					return [0, 0];
			}
		} else if (this.menuIndex != 0) {
			console.error("Invalid Menu Index: " + this.menuIndex + ". Resetting to 0");
			this.menuIndex = 0;
		}
	}

	static #getRandomVine() {
		return this.vines[Util.randInt(this.vines.length - 1)];
	}
	
	static #generateSelectedObject(random = false) {
		let newObject = null;
		if (this.menuIndex == 1) {
			switch (this.menus["entities"][this.entityIndex]) {
				case "bluePlayer":
					newObject = new Player(...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), "blue", ["up", "left", "right", "/", "down"]);
					break;
				case "redPlayer":
					newObject = new Player(...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), "red", "wadfs");
					break;
				case "slime":
					newObject = new Slime(...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()));
					break;
				case "skeleton":
					newObject = new Skeleton(...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()));
					break;
				default:
					console.error("Unknown Entitiy: " + this.menus["entities"][this.entityIndex]);
			}
		} else if (this.menuIndex == 2) {
			switch (this.menus["objects"][this.objectIndex]) {
				case "chest":
					newObject = new Chest(...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()));
					break;
				case "door":
					newObject = new Door(...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()));
					break;
				default:
					console.error("Unknown Object: " + this.menus["objects"][this.objectIndex]);
			}
		} else if (this.menuIndex == 3) {
			switch (this.menus["decorations"][this.decorationIndex]) {
				case "sunset":
					newObject = new VisualObject("sunset", ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 330, 230);
					break;
				case "bannerWhiteFBLA":
					newObject = new VisualObject("bannerWhiteFBLA", ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 114, 180);
					break;
				case "vine":
					newObject = new VisualObject(random? this.#getRandomVine() : "plainVineSet1 1/3", ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 64, 576/3);
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
					newObject = new VisualObject(this.menus["decorations"][this.decorationIndex], ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 64, 576/3);
					break;
				case "woodenTable":
					newObject = new VisualObject("woodenTable", ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 24*3, 14*3);
					break;
				case "chairLeft":
				case "chairRight":
					newObject = new VisualObject(this.menus["decorations"][this.decorationIndex], ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 12*3, 14*3);
					break;
				case "bookshelf":
					newObject = new VisualObject("bookshelf", ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 120, 144);
					break;
				case "skull":
					newObject = new VisualObject("skull", ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 105, 105);
					break;
				case "fountain":
					newObject = new VisualObject("fountain", ...Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset()), 912/4, 756/4);
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

		if (Keyboard.backspacePressed) {
			this.#deleteObject();
		}

		if (Keyboard.isKeyPressed("p")) {
			this.shadersEnabled = !this.shadersEnabled;
		}

		if (Mouse.button1Pressed && !Keyboard.controlDown) {
			if (this.menuIndex == 0) { //No object in hand
				this.#grabObject();
			} else { //Object in hand
				//Place the object
				if (this.menuIndex == 1) {
					this.currentEntities.push(this.#generateSelectedObject(true));
				} else if (this.menuIndex == 2) {
					this.#generateSelectedObject(true);
				} else if (this.menuIndex == 3) {
					Scene.decorations.push(this.#generateSelectedObject(true));
					Scene.flash();
				}
			}
		}


		if (Mouse.button1Down && !Keyboard.controlDown) {
			//Drag if an object is selected
			if (this.grabbedObject != null) {
				[this.grabbedObject.x, this.grabbedObject.y] = Util.add2DArrays(this.cursorPosition, this.dragOffset);
			}
		}

		if (Mouse.button1Released) {
			if (!(this.grabbedObject == null || this.grabbedObject instanceof ShadedObject)) {
				Scene.flash();
			}
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
		this.currentEntities = [];
		this.#fetchObjects();
	}

	/** Completely initalizes the Spawner and clears all Objects. Flashes scene to get rid of decorations.*/
	static clear() {
		this.placementIndex = 0;
		this.entityIndex = 0;
		this.objectIndex = 0;
		this.decorationIndex = 0;

		for (let i = 0; i < this.currentEntities.length; i++) {
			this.currentEntities[i].delete();
		}
		this.currentEntities = [];
		
		for (let i = 0; i < InteractableObject.interactableObjects.length; i++) {
			InteractableObject.interactableObjects[i].delete();
		}
		InteractableObject.interactableObjects = [];
		Scene.decorations = [];
		
		Scene.flash();
	}

	/** Updates the Spawner */
	static update() {
		//console.log(InteractableObject.interactableObjects);
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
			if (this.selectedObject != null && this.selectedObject.delete != undefined) this.selectedObject.delete();

			this.selectedObject = null;
			this.grabbedObject = null;
			
			Game.spawnPlayers();
			this.setScene("game");
		}

		if (this.selectedObject != null) [this.selectedObject.x, this.selectedObject.y] = Util.add2DArrays(this.cursorPosition, this.#getSelectionOffset());

		for (let i = 0; i < this.currentEntities.length; i++) {
			if (this.currentEntities[i].healthbar != null) this.currentEntities[i].healthbar.update();
		}

		if (this.selectedObject != null && this.selectedObject.healthbar != undefined) {
			this.selectedObject.healthbar.update();
		}

		if (this.shadersEnabled) {
			Scene.drawBackground();
			Scene.drawShadedObjects();
		} else {
			Scene.displayAllTiles();
			
			//Draw Shaded Objects
			for (let i = Object.keys(ShadedObject.shadedObjects).length - 1; i >= 0; i--) {
				for (let j = 0; j < Object.values(ShadedObject.shadedObjects)[i].length; j++) {
					//Draw current object
					Object.values(ShadedObject.shadedObjects)[i][j].draw();
				}

			}
		}

		

		if (this.selectedObject != null && !(this.selectedObject instanceof ShadedObject)) {
			this.selectedObject.draw();
		}

		//Anything not a shadedobject is a visualobject/decoration
		if (this.grabbedObject != null && !(this.grabbedObject instanceof ShadedObject)) {
			this.grabbedObject.draw();
		}

		if (Keyboard.controlDown) {
			Display.drawText(this.menuKeys[this.menuIndex], this.cursorX - Display.getTextWidth("test", 30)/2, this.cursorY - 25, 30, true, "white");
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