import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";

import { UI } from "./UI.js";
import { UIObject } from "./UIObject.js";

export class Slider extends UIObject {
	constructor(x, y, width, height, minValue, maxValue, snapValue) {
		super(x, y, width, height);
		this.sliderX = x;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.snapValue = snapValue;
		this.output = minValue;
	}
	
	#isSelected() {
		return Mouse.x > this.x && Mouse.x < this.x + this.width && Mouse.y > this.y && Mouse.y < this.y + this.height && Mouse.button1Down;
	}
	
	#calcSliderOutput() {
		return ((Mouse.x - this.x) / this.width) * (this.maxValue - this.minValue) + this.minValue;
	}

	#calcSliderXPosition() {
		this.sliderX = this.x + ((this.output - this.minValue) / (this.maxValue - this.minValue)) * this.width;
	}

	snapOutput() {
		let snappedOutput = Math.round(this.output / this.snapValue) * this.snapValue;
		if (snappedOutput < this.minValue) {
				snappedOutput = this.minValue;
		}
		if (snappedOutput > this.maxValue) {
			snappedOutput = this.maxValue;
		}
		return Math.round(snappedOutput * 1000000) / 1000000;
	}

	update() {
		super.updatePosition();
		if (this.#isSelected()) {
			this.output = this.#calcSliderOutput();
			this.#calcSliderXPosition();
		} else {
			this.output = this.snapOutput();
			this.#calcSliderXPosition();
		}
		UI.draw("placeholder", this.x, this.y, this.width, this.height - 10);
		UI.draw("placeholder", this.sliderX - (25 * Display.sizeMult) / 2, this.y - 5, 25 * Display.sizeMult, this.height);
	}
}