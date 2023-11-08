//Util Imports
import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";

//UIObject Imports
import { UI } from "./UI.js";
import { UIObject } from "./UIObject.js";



//Slider Class
export class Slider extends UIObject {
	constructor(x, y, width, height, minValue, maxValue, snapValue) {
		//Call super constructor to assign absolute and relative values of: x, y, width, height
		super(x, y, width, height);
		//Initalize sliderX to the starting relative x value of the slider object
		this.sliderX = this.x;
		//Assign the min and max values of the slider
		this.minValue = minValue;
		this.maxValue = maxValue;
		//Assign the snap incriment of the slider
		this.snapValue = snapValue;
		//Set the output of the slider to its minimum value
		this.output = minValue;
	}

	//Returns a boolean of if the slider is being selected by the user (mouse over slider area and down)
	#isSelected() {
		return Mouse.x > this.x && Mouse.x < this.x + this.width && Mouse.y > this.y && Mouse.y < this.y + this.height && Mouse.button1Down;
	}

	//Returns the calculated output of the slider based on its position
	#calcSliderOutput() {
		return ((Mouse.x - this.x) / this.width) * (this.maxValue - this.minValue) + this.minValue;
	}

	//Returns the calcualated X position of the slider value indicator based on the given slider output
	#calcSliderXPosition() {
		this.sliderX = this.x + ((this.output - this.minValue) / (this.maxValue - this.minValue)) * this.width;
	}

	//Returns the value of the slider output when snapped to the closest snap value
	snapOutput() {
		//Find the output of the slider when moved to the closest snap value
		let snappedOutput = Math.round(this.output / this.snapValue) * this.snapValue;
		//If the snapped output is lower than the minimum slider value, set the output to the min value
		if (snappedOutput < this.minValue) {
				snappedOutput = this.minValue;
		}
		//If the snapped output is higher than the max slider value, set the output to the max value
		if (snappedOutput > this.maxValue) {
			snappedOutput = this.maxValue;
		}
		//Return the snapped output rounded to the 100,000th decimal place to remove floating point errors
		return Math.round(snappedOutput * 100000) / 100000;
	}

	//Draws the slider and updates it with new values
	update() {
		//Update relative position values with respect to current screen size
		super.updatePosition();
		//If the slider is selected, calculate the slider output and the slider x position
		if (this.#isSelected()) {
			this.output = this.#calcSliderOutput();
			this.#calcSliderXPosition();
		//Else the slider has been released, so snap the output value to and calculate the final X position
		} else {
			this.output = this.snapOutput();
			this.#calcSliderXPosition();
		}
		//Draw the slider body
		UI.draw("placeholder", this.x, this.y, this.width, this.height - 10);
		//Draw the slider value indicator
		UI.draw("placeholder", this.sliderX - (25 * Display.sizeMult) / 2, this.y - 5, 25 * Display.sizeMult, this.height);
	}
}