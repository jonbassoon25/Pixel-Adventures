//Util Imports
import { Display } from "./Display.js";

//Keyframe Class
export class Keyframe {
    //Constructor

    /**
     * @param {string} image - Image of this Keyframe
     * @param {number[]} initialPosition - Initial position of this Keyframe
     * @param {number[]} finalPosition - Final position of this Keyframe
     * @param {number[]} initialDimensions - Initial dimensions of this Keyframe
     * @param {number[]} finalDimensions - Final dimensions of this Keyframe
     * @param {number} startFrame - Start frame for this Keyframe, inclusive
     * @param {number} endFrame - End frame for this Keyframe, inclusive
     * @param {string} transitionType - Type of transition between start and end position (linear, parabolic, sinusoidal, growth, log)
     */
    constructor(image, initialPosition, finalPosition, initialDimensions, finalDimensions, startFrame, endFrame, transitionType = "linear") {
        this.image = image;
        this.initialPosition = initialPosition;
        this.finalPosition = finalPosition;
        this.initialDimensions = initialDimensions;
        this.finalDimensions = finalDimensions;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.transitionType = transitionType;
        if (this.transitionType != "linear" && this.transitionType != "parabolic" && this.transitionType != "sinusoidal" && this.transitionType != "growth" && this.transitionType != "log" && this.transitionType != "tangential") {
            this.transitionType = "linear";
            console.warn("Unknown Transition Type: " + transitionType + ". Defaulting to linear");
        }
    }

    //*********************************************************************//
	//Private Methods

	//Graph: https://www.desmos.com/calculator/hpr9gv3tdn
	#getUniversalValue(parent, frame, startVal, endVal) {
		return (endVal - startVal) * (parent((frame - this.startFrame)/(this.endFrame - this.startFrame))) + startVal;
	}

	//Parent functions start at 0, 0 and go to 1, 1
	#linearParent = (frame) => {
		return frame;
	}
	#sinusoidalParent = (frame) => {
		return -Math.cos(Math.PI * frame)/2 + 0.5;
	}
	#tangentialParent = (frame) => {
		return Math.tan(2 * Math.atan(2) * (frame - 0.5))/4 + 0.5;
	}
	#parabolicParent = (frame) => {
		return 4 * Math.pow(frame - 0.5, 3) + 0.5
	}
	#growthParent = (frame) => {
		let C = 1 / (16 - 1/16);
		return C * Math.pow(2, 8 * frame - 4) - 1/255;
	}
	#logParent = (frame) => {
		return Math.log(255 * frame + 1) / (8 * Math.log(2));
	}

    //*********************************************************************//
	//Public Methods

    /**
     * 
     * @param {number} frame - What frame of the animation is it
     * @param {number} startVal - The value at the start of this Keyframe
     * @param {number} endVal - The value at the end of this Keyframe
     * @returns {number} - The value at the specified frame in the Keyframe
     */
    getValue(frame, startVal, endVal) {
    	switch (this.transitionType) {
            case "linear":
                return this.#getUniversalValue(this.#linearParent, frame, startVal, endVal);
            case "parabolic":
                return this.#getUniversalValue(this.#parabolicParent, frame, startVal, endVal);
            case "sinusoidal":
                return this.#getUniversalValue(this.#sinusoidalParent, frame, startVal, endVal);
            case "growth":
                return this.#getUniversalValue(this.#growthParent, frame, startVal, endVal);
            case "log":
                return this.#getUniversalValue(this.#logParent, frame, startVal, endVal);
			case "tangential": 
				return this.#getUniversalValue(this.#tangentialParent, frame, startVal, endVal);
        }
    }

    /** Draws this Keyframe to the Display */
    draw(frame) {
        let x = this.getValue(frame, this.initialPosition[0], this.finalPosition[0]);
        let y = this.getValue(frame, this.initialPosition[1], this.finalPosition[1]);
        let width = this.getValue(frame, this.initialDimensions[0], this.finalDimensions[0]);
        let height = this.getValue(frame, this.initialDimensions[1], this.finalDimensions[1]);
		//console.log("Drawing at " + [x, y] + " with dimensions of " + [width, height]);
        Display.draw(this.image, x, y, width, height);
    }
}