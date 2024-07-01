import { Display } from "./Display.js";
import { Util } from "./Util.js";

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
	   
    constructor(image, initialPosition, finalPosition, initialDimensions, finalDimensions, initialRotation, finalRotation, initialOpacity, finalOpacity, startFrame, endFrame, xTransitionType, yTransitionType, widthTransitionType, heightTransitionType, rotationTransitionType, opacityTransitionType) {
        this.image = image;
        this.initialPosition = initialPosition;
        this.finalPosition = finalPosition;
        this.initialDimensions = initialDimensions;
        this.finalDimensions = finalDimensions;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.initialRotation = initialRotation;
        this.finalRotation = finalRotation;
		this.initialOpacity = initialOpacity;
		this.finalOpacity = finalOpacity;

		this.xTransitionType = xTransitionType;
		this.yTransitionType = yTransitionType;
		this.widthTransitionType = widthTransitionType;
		this.heightTransitionType = heightTransitionType;
		this.rotationTransitionType = rotationTransitionType;
		this.opacityTransitionType = opacityTransitionType;
    }

    //*********************************************************************//
	//Private Methods

	//Graph: https://www.desmos.com/calculator/hpr9gv3tdn
	#getUniversalValue(parent, frame, startVal, endVal) {
		return (this.endFrame - this.startFrame == 0)? endVal : ((endVal - startVal) * (parent((frame - this.startFrame)/(this.endFrame - this.startFrame))) + startVal);
	}
    
	//Parent functions start at 0, 0 and go to 1, 1
    static #linearParent = (frame) => {
        return frame;
    }
    static #sinusoidalParent = (frame) => {
		return -Math.cos(Math.PI * frame)/2 + 0.5;
	}
    static #sinusoidalParent_1_2 = (frame) => {
		return -Math.cos((Math.PI / 2) * frame) + 1;
	}
    static #sinusoidalParent_2_2 = (frame) => {
		return -Math.cos((Math.PI / 2) * (frame + 1))
	}
    static #tangentialParent = (frame) => {
		return Math.tan(2 * Math.atan(2) * (frame - 0.5))/4 + 0.5;
	}
    static #parabolicParent = (frame) => {
		return 4 * Math.pow(frame - 0.5, 3) + 0.5
	}
    static #growthParent = (frame) => {
		let C = 1 / (16 - 1/16);
		return C * Math.pow(2, 8 * frame - 4) - 1/255;
	}
    static #logParent = (frame) => {
		return Math.log(255 * frame + 1) / (8 * Math.log(2));
	}
    static #bounceParent = (frame) => {
        let C = Math.sin(4 * Math.PI * (-0.15))/4
        return Math.sin(4 * Math.PI * (frame - 0.15))/4 + frame - C;
    }
    static #sharpBounceParent = (frame) => {
        return (frame >= 0.8)? Math.pow(5 * (frame - 1),2) : (Math.sin(1.25 * Math.PI * (frame + - 0.8)/2) + 1);
    }
    static #projectileArcParent = (frame) => {
        return -1 * Math.pow(2 * (frame - 0.5), 2) + 1
    }
    static #coinTossParent = (frame) => {
        return -1 * Math.pow(2 * (frame - 0.5), 16) + 1
    }
    static #temp = (frame) => {
        return frame;
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
    getValue(frame, startVal, endVal, transitionType) {
    	switch (transitionType) {
            case "linear":
                return this.#getUniversalValue(Keyframe.#linearParent, frame, startVal, endVal);
            case "parabolic":
                return this.#getUniversalValue(Keyframe.#parabolicParent, frame, startVal, endVal);
            case "sinusoidal":
                return this.#getUniversalValue(Keyframe.#sinusoidalParent, frame, startVal, endVal);
			case "sinusoidal 1/2":
				return this.#getUniversalValue(Keyframe.#sinusoidalParent_1_2, frame, startVal, endVal);
			case "sinusoidal 2/2":
				return this.#getUniversalValue(Keyframe.#sinusoidalParent_2_2, frame, startVal, endVal);
            case "growth":
                return this.#getUniversalValue(Keyframe.#growthParent, frame, startVal, endVal);
            case "log":
                return this.#getUniversalValue(Keyframe.#logParent, frame, startVal, endVal);
			case "tangential": 
				return this.#getUniversalValue(Keyframe.#tangentialParent, frame, startVal, endVal);
            case "bounce": 
                return this.#getUniversalValue(Keyframe.#bounceParent, frame, startVal, endVal);
            case "sharpBounce": 
                return this.#getUniversalValue(Keyframe.#sharpBounceParent, frame, startVal, endVal);
            case "projectileArc":
                return this.#getUniversalValue(Keyframe.#projectileArcParent, frame, startVal, endVal);
            case "coinToss":
                return this.#getUniversalValue(Keyframe.#coinTossParent, frame, startVal, endVal);
            case "temp": 
                return this.#getUniversalValue(Keyframe.#temp, frame, startVal, endVal);
			default:
				throw new SyntaxError("Unknown transition type: " + this.transitionType);
        }
    }

    static getRawValue(frame, transitionType) {
        switch(transitionType) {
            case "linear":
                return Keyframe.#linearParent(frame);
            case "parabolic":
                return Keyframe.#parabolicParent(frame);
            case "sinusoidal":
                return Keyframe.#sinusoidalParent(frame);
            case "sinusoidalDerivative":
                return Math.PI/2 * Math.sin(Math.PI * frame);
            case "sinusoidal 1/2":
                return Keyframe.#sinusoidalParent_2_2(frame);
            case "sinusoidal 2/2":
                return Keyframe.#sinusoidalParent_2_2(frame);
            case "growth":
                return Keyframe.#growthParent(frame);
            case "log":
                return Keyframe.#logParent(frame);
            case "tangential": 
                return Keyframe.#tangentialParent(frame);
            case "bounce": 
                return Keyframe.#bounceParent(frame);
            case "sharpBounce": 
                return Keyframe.#sharpBounceParent(frame);
            case "projectileArc":
                return Keyframe.#projectileArcParent(frame);
            case "coinToss":
                return Keyframe.#coinTossParent(frame);
            case "temp": 
                return Keyframe.#temp(frame);
            default:
                throw new SyntaxError("Unknown transition type: " + this.transitionType);
        }
    }

    /** Draws this Keyframe to the Display */
    draw(frame, xOffset = 0, yOffset = 0, flipped = false, hasParent = false) {
        let x = this.getValue(frame, this.initialPosition[0] * ((flipped && hasParent)? -1 : 1), this.finalPosition[0] * ((flipped && hasParent)? -1 : 1), this.xTransitionType) + xOffset;
        let y = this.getValue(frame, this.initialPosition[1], this.finalPosition[1], this.yTransitionType) + yOffset;
        let width = this.getValue(frame, this.initialDimensions[0], this.finalDimensions[0], this.widthTransitionType);
        let height = this.getValue(frame, this.initialDimensions[1], this.finalDimensions[1], this.heightTransitionType);
        let rotation = this.getValue(frame, this.initialRotation, this.finalRotation, this.rotationTransitionType);
		let opacity = this.getValue(frame, this.initialOpacity, this.finalOpacity, this.opacityTransitionType);
		Display.draw(this.image, x, y, width, height, true, flipped, rotation, opacity);
    }
}