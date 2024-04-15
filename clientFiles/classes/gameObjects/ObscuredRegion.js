import { Display } from "../util/Display.js";
import { Scene } from "../util/Scene.js";
import { VisualObject } from "../util/VisualObject.js";

export class ObscuredRegion extends VisualObject {
	//x and y values measured in tile coordinates
	constructor(topLeftX, topLeftY, bottomRightX, bottomRightY) {
		super("shader_20", topLeftX * Scene.tileSize + ((bottomRightX - topLeftX + 1) * Scene.tileSize)/2, topLeftY * Scene.tileSize + ((bottomRightY - topLeftY + 1) * Scene.tileSize)/2, (bottomRightX - topLeftX + 1) * Scene.tileSize, (bottomRightY - topLeftY + 1) * Scene.tileSize);
		this.isTriggered = false;
	}
	update() {
		if (this.image == "shader_00") return;
		if (this.isTriggered) {
			if (Display.frames % 3 == 0) this.image = "shader_" + ((parseInt(this.image.substring(7)) <= 10)? "0" : "") + (parseInt((this.image.substring(7))) - 1).toString();
		}
		super.update();
	}
}