import { Scene } from "./Scene.js";
import { SocketCommunicator } from "../SocketCommunicator.js";
import { Coin } from "../gameEntities/Coin.js";
import { Slime } from "../gameEntities/Slime.js";
import { Skeleton } from "../gameEntities/Skeleton.js";
import { DynamicObject } from "../gameEntities/DynamicObject.js";

export class Level {
	static level = 1;
	static init(level = Level.level) {
		DynamicObject.clearEnemies();
		Scene.structure = null;
		Scene.shaderStructure = null;
		SocketCommunicator.send("loadScene", "level" + level.toString());
	}
	static spawnEntities(level = Level.level) {
		switch (level) {
			case 1:
				new Slime(1259, 575);
				new Skeleton(778, 979);
				break;
			case 2:
				new Slime(1293, 938);
				new Skeleton(947, 547); new Skeleton(947, 547); new Skeleton(947, 547); new Skeleton(295, 433);
				break;
			case 3:
				new Slime(936, 334); new Slime(1298, 339); new Slime(1096, 737); new Slime(1459, 738);
				new Skeleton(298, 514); new Skeleton(497, 998);
				break;
		}
	}
}