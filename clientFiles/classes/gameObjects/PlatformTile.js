//Util Imports

//Game Object Imports
import { SceneTile } from "./SceneTile.js";

class PlatformTile extends SceneTile {
	constructor(x, y, width, height) {
		super("placeholder", x, y, SceneTile.squareHitbox);
	}
}