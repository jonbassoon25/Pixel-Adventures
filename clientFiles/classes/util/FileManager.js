//Util Imports
import { Keyboard } from "./Keyboard.js";
import { Scene } from "./Scene.js";
import { SceneBuilder } from "./SceneBuilder.js";
import { Spawner } from "./Spawner.js";
import { Util } from "./Util.js";

//Basic Object Imports
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { InteractableObject } from "../basicObjects/InteractableObject.js";

export class FileManager {
	static takeInput() {
		//Save
		if (Keyboard.backquoteDown && Keyboard.isKeyPressed("k")) {
			this.save();
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("1")) {
			this.save("Save_1");
			Keyboard.keyUp("1");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("2")) {
			this.save("Save_2");
			Keyboard.keyUp("2");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("3")) {
			this.save("Save_3");
			Keyboard.keyUp("3");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("4")) {
			this.save("Save_4");
			Keyboard.keyUp("4");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("5")) {
			this.save("Save_5");
			Keyboard.keyUp("5");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("6")) {
			this.save("Save_6");
			Keyboard.keyUp("6");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("7")) {
			this.save("Save_7");
			Keyboard.keyUp("7");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("8")) {
			this.save("Save_8");
			Keyboard.keyUp("8");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.altDown && Keyboard.isKeyPressed("9")) {
			this.save("Save_9");
			Keyboard.keyUp("9");
			return;
		}

		//Load
		if (Keyboard.backquoteDown && Keyboard.isKeyPressed("l")) {
			this.load();
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("1")) {
			this.load("Save_1");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("2")) {
			this.load("Save_2");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("3")) {
			this.load("Save_3");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("4")) {
			this.load("Save_4");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("5")) {
			this.load("Save_5");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("6")) {
			this.load("Save_6");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("7")) {
			this.load("Save_7");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("8")) {
			this.load("Save_8");
			return;
		} else if (Keyboard.backquoteDown && Keyboard.isKeyPressed("9")) {
			this.load("Save_9");
			return;
		}
	}

	static save(fileName = "lastSaved") {
		//Prepare structure for saving
		let structure = Util.clone(Scene.structure);
		for (let i = 0; i < structure.length; i++) {
			for (let j = 0; j < structure[i].length; j++) {
				let curTile = structure[i][j];
				delete curTile["xOffset"];
				delete curTile["yOffset"];
				delete curTile["visualWidth"];
				delete curTile["visualHeight"];
			}
		}
		console.log("done loop");
		//Save all needed values
		let data = {"structure": structure, "entities": [], "objects": InteractableObject.interactableObjects, "decorations": Scene.decorations};

		for (let i = 0; i < Spawner.currentEntities.length; i++) {
			let curEntity = Spawner.currentEntities[i];
			data["entities"].push({"type": curEntity.type, "x": curEntity.x, "y": curEntity.y})
		}
		
		document.dispatchEvent(new CustomEvent("emit", {"detail": {"name": "saveScene", "data": [fileName, data]}}));
		console.log("Saving to " + fileName);
	}

	static load(fileName = "lastSaved") {
		document.dispatchEvent(new CustomEvent("emit", {"detail": {"name": "loadScene", "data": fileName}}));
		SceneBuilder.init();
		SceneBuilder.clear();
		Scene.structure = null;
		Scene.shaderStructure = null;
		SceneBuilder.structure = null;
		Spawner.clear();
		ShadedObject.clear();
		console.log("loading...");
		return;
	}
}