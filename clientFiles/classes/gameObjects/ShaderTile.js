//Util imports
import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";
import { VisualObject } from "../util/VisualObject.js";

//ShaderTile Class
export class ShaderTile extends VisualObject {
	//Constructor

	/**
	 * @param {number} col - Column of this ShaderTile
	 * @param {number} row - Row of this ShaderTile
	 */
	constructor(col, row) {
		super("none", 0, 0, Scene.tileSize/Scene.lightQuality, Scene.tileSize/Scene.lightQuality);
		this.col = col;
		this.row = row;
		this.level = 0;
	}

	//*********************************************************************//
	//Public Methods

	/** Updates and Draws this ShaderTile */
	update(qualityDecrease = false) {
		if (!qualityDecrease) {
			Display.drawShader(this.shaderLevel, this.x, this.y, this.width, this.height);
		} else {
			if (this.col % 2 == 0 & this.row % 2 == 0) {
				Display.drawShader(this.shaderLevel, this.x + this.width/2, this.y + this.height/2, this.width * 2, this.height * 2);
			}
		}
	}

	//*********************************************************************//
	//Getters

	get x() {
		return this.col * Scene.tileSize/Scene.lightQuality + this.width/2;
	}
	get y() {
		return this.row * Scene.tileSize/Scene.lightQuality + this.height/2;
	}
	get shaderLevel() {
		return this.level;
	}

	//*********************************************************************//
	//Setters

	/** Sets the shader level 
	@param level {number} - shader level to set (0 - 1)
	 */
	set shaderLevel(level) {
		if (level > 1) {
			this.level = 1;
		} else if (level < 0) {
			this.level = 0;
		} else {
			this.level = Math.round(level*100)/100;
		}
	}

	set x(x){}
	set y(y){}
}