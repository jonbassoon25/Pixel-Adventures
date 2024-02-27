//Util imports
import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";

//Class ShaderTile
export class ShaderTile {
	//Constructor

	constructor(col, row) {
		this.col = col;
		this.row = row;
		this.level = 0;
	}

	//*********************************************************************//
	//Public Methods

	update() {
		let shaderString = "shader_" + ((this.shaderLevel < 10)? "0" + this.shaderLevel.toString() : this.shaderLevel.toString());
		Display.draw(shaderString, this.x, this.y, this.width + 0, this.height + 0);
	}

	//*********************************************************************//
	//Getters

	get x() {
		return this.col * Scene.tileSize/2 + this.width/2;
	}
	get y() {
		return this.row * Scene.tileSize/2 + this.height/2;
	}
	get width() {
		return Scene.tileSize/2;
	}
	get height() {
		return Scene.tileSize/2;
	}
	get shaderLevel() {
		return this.level;
	}

	//*********************************************************************//
	//Setters

	/** Sets the shader level 
	@param level {number} - shader level to set (0 - 20)
	 */
	set shaderLevel(level) {
		if (level > 20) {
			this.level = 20;
		} else if (level < 0) {
			this.level = 0;
		} else {
			this.level = Math.round(level);
		}
	}
}