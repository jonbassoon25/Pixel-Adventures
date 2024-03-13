//Util Imports
import { Display } from "../util/Display.js";
import { Util } from "../util/Util.js";

//Game Object Imports
import { SceneTile } from "./SceneTile.js";

//ChestTile Class
export class ChestTile extends SceneTile {
	static allChests = [];
	
	//Constructor
	constructor(background, col, row, hasVines, coinRange = [0, 10]) {
		super(background, col, row, false, hasVines);

		this.coins = Util.randInt(coinRange[0], coinRange[1]);

		this.isOpen = false

		ChestTile.allChests.push(this);
	}

	//*********************************************************************//
	//Public Methods

	delete() {
		Util.delValue(ChestTile.allChests, this);
	}
	
	update() {
		super.update();
		Display.draw(((this.isOpen)? "placeholder" : "placeholder"), this.x, this.y, this.width/1.2, this.height/1.2)
	}
	
}