//Util Imports
import { Display } from "../util/Display.js";
import { Mouse } from "../util/Mouse.js";
import { Util } from "../util/Util.js"

//UIObject Imports
import { Button } from "./Button.js";
import { UI } from "./UI.js";
import { UIObject } from "./UIObject.js";

//Slider Class
export class Slider extends UIObject {
	//*********************************************************************//
	//Constructor

	/** 
  	@param {number} x - The x position of the slider
	@param {number} y - The y position of the slider
  	@param {number} width - The width of the slider
	@param {number} height - The height of the slider
  	@param {number} minValue - The minimum value of the slider
	@param {number} maxValue - The maximum value of the slider
  	@param {number} snapValue - The incriments that the slider value will snap to (optional)
 	*/
	constructor(x, y, width, height, minValue, maxValue, snapValue = 1) {
		//Call super constructor to assign absolute and relative values of: x, y, width, height
		super(x, y, width, height);
		//Initalize this slider's button
		this.button = new Button("placeholder", x, y, width, height);
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

	//*********************************************************************//
	//Private Methods
	
	/** 
  	@returns {boolean} True if slider is being selected by the user (mouse down over slider area)
	*/
	#isSelected() {
		return this.button.isPressed();
	}

	/** 
  	@returns {number} The output of the slider
 	*/
	#calcSliderOutput() {
		return ((Mouse.x - this.x) / this.width) * (this.maxValue - this.minValue) + this.minValue;
	}

	/** 
  	@returns {number} The X position of the slider value indicator
 	*/
	#calcSliderXPosition() {
		this.sliderX = this.x + ((this.output - this.minValue) / (this.maxValue - this.minValue)) * this.width;
	}

	/** 
  	@returns {number} The snapped output of the slider
 	*/
	#calcSnapOutput() {
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
		//Return the snapped output rounded to the 5th decimal place to remove floating point errors
		return Util.round(snappedOutput, 5);
	}

	//*********************************************************************//
	//Public Methods

	/** 
  	Draws the slider and updates it's values
  	*/
	update() {
		//If the slider is selected, calculate the slider output and the slider x position
		if (this.#isSelected()) {
			this.output = this.#calcSliderOutput();
			this.#calcSliderXPosition();
		//Else the slider has been released, so snap the output value to and calculate the final X position
		} else {
			this.output = this.#calcSnapOutput();
			this.#calcSliderXPosition();
		}
		//Draw the slider body
		UI.draw("placeholder", this.x, this.y, this.width, this.height - 10);
		//Draw the slider value indicator
		UI.draw("placeholder", this.sliderX - 25 / 2, this.y - 5, 25, this.height);
	}
}