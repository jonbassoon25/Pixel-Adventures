//Util Imports
import { Scene } from "./Scene.js";

//Game Objects
import { TriggerRegion } from "../gameObjects/TriggerRegion.js";
import { ObscuredRegion } from "../gameObjects/ObscuredRegion.js";
import { Chest } from "../gameObjects/Chest.js";
import { Door } from "../gameObjects/Door.js";
import { Grave } from "../gameObjects/Grave.js";

//Game Entities
import { Coin } from "../gameEntities/Coin.js";
import { Enemy } from "../gameEntities/Enemy.js";
import { Slime } from "../gameEntities/Slime.js";
import { Skeleton } from "../gameEntities/Skeleton.js";
import { Effigy } from "../gameEntities/Effigy.js";

//Basic Objects
import { VisualObject } from "../basicObjects/VisualObject.js";
import { InteractableObject } from "../basicObjects/InteractableObject.js";

export class Level {
	static level = 1;
	
	static init(level = Level.level) {
		Enemy.clear();
		InteractableObject.clear();
		TriggerRegion.clear();
		Scene.structure = null;
		Scene.shaderStructure = null;
		Scene.decorations = [];
		this.loadDecorations();
		document.dispatchEvent(new CustomEvent("emit", {"detail": {"name": "loadScene", "data": "level" + level.toString()}}));
	}
	
	static loadDecorations(level = Level.level) {
		switch (level) {
			case 1:
				Scene.decorations = [new VisualObject("sunset", 1182, 498, 330, 230), new VisualObject("bannerWhiteFBLA", 1456, 920, 114, 180), new VisualObject("woodenTable", 9*48, 3*48 - 4, 24*3, 14*3), new VisualObject("chairRight", 9*48 - 50, 3*48 - 5, 12*3, 14*3), new VisualObject("chairLeft", 9*48 + 50, 3*48 - 5, 12*3, 14*3)];
				return;
			case 2:
				Scene.decorations = [new VisualObject("bookshelf", Scene.snapCoordinates(1425, 985)[0], Scene.snapCoordinates(1425, 985)[1] - 12, 120, 144), new VisualObject("skull", Scene.snapCoordinates(958, 256)[0] + 20, Scene.snapCoordinates(958, 256)[1], 105, 105)];
				return;
			case 3:
				return;
		}
	}
	
	static spawnEntities(level = Level.level) {
		InteractableObject.clear();
		Enemy.clear();
		switch (level) {
			case 1:
				new Slime(1259, 575);
				new Skeleton(778, 979);
				//new Effigy(1152, 88);
				new TriggerRegion(1777, 257, 200, 100, [new ObscuredRegion(0, 5, 14, 26), new ObscuredRegion(15, 6, 18, 26), new ObscuredRegion(19, 7, 19, 26), new ObscuredRegion(20, 8, 47, 26)]);
				new Chest(...Scene.snapCoordinates(1576, 144));
				new Chest(...Scene.snapCoordinates(456, 1018));
				new Chest(...Scene.snapCoordinates(540, 1018));
				new Chest(...Scene.snapCoordinates(612, 1018));
				new Door(...Scene.snapCoordinates(1656, 1017));
				break;
			case 2:
				new Slime(1293, 938);
				new Skeleton(947, 547);
				new Skeleton(295, 433);
				new Chest(...Scene.snapCoordinates(178, 457));
				new Chest(...Scene.snapCoordinates(257, 457));
				new Chest(...Scene.snapCoordinates(339, 457));
				new Chest(...Scene.snapCoordinates(97, 577));
				new Chest(...Scene.snapCoordinates(176, 577));
				new Chest(...Scene.snapCoordinates(256, 577));
				new Door(...Scene.inverseCalcBlockCoordinates(...Scene.calcBlockCoordinates(177, 1017)));
				break;
			case 3:
				new Slime(936, 334); new Slime(1298, 339); new Slime(1096, 737); new Slime(1459, 738);
				new Skeleton(298, 514); new Skeleton(497, 998);
				new Door(...Scene.inverseCalcBlockCoordinates(41, 25));
				break;
		}
	}
}