//Util Imports
import { Util } from "./Util.js";

//Vector Class
export class Vector {
	/*
	Notes:
		- Standard Vector formatted as [magnitude, degrees]
		- Componatized vector formatted as [x, y]
	*/
	
	//*********************************************************************//
	//Static Variables

	static ZERO = new Vector([0, 0]);

	static GRAVITY = new Vector("Gravity", [0, 0.4]);

	//*********************************************************************//
	//Public Static Methods
	
	/** 
	Calculates a Standard Vector [magnitude, direction (clockwise from right)] based on a componatized vector
	@param {number[]} componatizedVector - The componatized vector to convert
	@returns {number[]} The calculated Standard Vector
	*/
	static * calcStandardVector(componatizedVector) {
		//If the componatized vector represents 0 movement
		if (componatizedVector[0] == 0 && componatizedVector[1] == 0) {
			yield 0;
			yield 0;
			return;
		}
		
		//Yield Magnitude
		yield Util.round(Math.sqrt(Math.pow(componatizedVector[0], 2) + Math.pow(componatizedVector[1], 2)), 3);
		
		//If the componatized vector's x is in the + region
		if (componatizedVector[0] >= 0) {
			yield Util.round(Math.atan(componatizedVector[1]/componatizedVector[0]) * 180/Math.PI, 3);
		//The componatized vector's x is in the - region
		} else {
			yield Util.round(180 + Math.atan(componatizedVector[1]/componatizedVector[0]) * 180/Math.PI, 3);
		}
	}

	/**
	Calculates a Componatized Vector [xComponent, yComponent] based on a standard vector
	@param {number[]} standardVector - The standard vector to convert
	@returns {number[]} The calculated componatized vector
	*/
	static * componatizeVector(standardVector) {
		yield Util.round(standardVector[0] * Math.cos(standardVector[1]), 3);
		yield Util.round(standardVector[0] * Math.sin(standardVector[1]), 3);
	}

	/**
	 * Multiplies a vector by a scalar value
	 * @param {Vector} vector - vector to multiply
	 * @param {number} scalar - scalar value to mulitply by
	 * @return {Vector} - new vector with multiplied components. Not lined to passed in vector
	 */
	static multiply(vector, scalar) {
		return new Vector(vector.name, [vector.x * scalar, vector.y * scalar]);
	}

	//Returns a string of all of the vectors contained in this object
	static toString() {
		let output = "All Vectors: ";
		for (let i = 0; i < this.allVectors.length; i++) {
			output += "\n\t" + this.allVectors[i].toString(2);
		}
		return output;
	}

	//*********************************************************************//
	//Constructor

	//Can be called as Vector(name, [xComponent, yComponent]) or Vector(name, magnitude, degrees from 0 (up)). Name trait is optional
	/** 
	Vector (Overloaded Constructor)
	<br>
	<br>
	Vector(name? : string, [xComponent : number, yComponent : number])
	<br>
	@param {string} name - The name of the vector (optional)
	@param {number[]} _ Componatized vector
	<br>
	<br>
	Vector(name? : string, magnitude : number, degrees : number)
	<br>
	@param {string} name - The name of the vector (optional)
	@param {number} magnitude - The magnitude of the vector
	@param {number} degrees - The degrees from 0 (up) of the vector
	*/
	constructor() {
		let add = 0;
		if (arguments.length > 0 && typeof arguments[0] == "string") {
			this.name = arguments[0];
			add++;
		} else {
			this.name = "Unnamed Vector";
		}
		if (arguments.length == 1 + add) {
			this.x = arguments[add][0];
			this.y = arguments[add][1];
		} else if (arguments.length == 2 + add) {
			[this.x, this.y] = Vector.componatizeVector([arguments[add], arguments[add + 1]]);
		} else {
			console.warn("\nInvalid number of arguments in constructor for Vector:\n\t" + this.name + ": " + arguments.length + ".\nCreating Default Vector");
			this.x = 0;
			this.y = 0;
		}
	}

	//*********************************************************************//
	//Public Methods
	
	/** 
	Adds another vector to this vector and updates this vector's values
	@param {Vector} otherVector - The vector to add to this vector
	@param {number} multiplier - The multiplier to multiply the otherVector by before adding
	*/
	add(otherVector, multiplier = 1) {
		this.x += otherVector.x * multiplier;
		this.y += otherVector.y * multiplier;
	}

	/** 
	Checks to see if this vector is equal to another vector
	@param {Vector} otherVector - The vector to check if this vector is equal to
	@returns {boolean} True if this vector is equal to the other vector
	*/
	equals(otherVector) {
		return (this.x == otherVector.x && this.y == otherVector.y);
	}

	/** 
	Limits the max and min values of this vector using componatezed values
	@param {number} maxX - The maximum value of this vector in the x direction
	@param {number} maxY - The maximum value of this vector in the y direction
	*/
	limitComponatizedValues(maxX, maxY) {
		//Assign x and y, account for sign of x and y
		if (this.x < 0) {
			this.x = -Util.absMin(this.x, maxX);
		} else {
			this.x = Util.absMin(this.x, maxX);
		}
		if (this.y < 0) {
			this.y = -Util.absMin(this.y, maxY);
		} else {
			this.y = Util.absMin(this.y, maxY);
		}
	}

	/** 
	Limits the max and min values of this vector using normal values
	@param {number} maxMagnitude - The maximum magnitude of this vector
	*/
	limitNormalValues(maxMagnitude) {
		magnitude = Util.absMin(this.magnitude, maxMagnitude);
		[this.x, this.y] = Vector.componatizeVector([magnitude, this.direction]);
	}

	/** 
	Multiplies this vector's values by a scalar quantity
	@param {number} scalar - The scalar quantity to multiply this vector by
	*/
	multiply(scalarValue) {
		this.x *= scalarValue;
		this.y *= scalarValue;
	}

	/** Normailized this vector: sets magnitude to 1 */
	normalize() {
		this.x = this.x / this.magnitude;
		this.y = this.y / this.magnitude;
	}

	/** 
	Rounds all of this vector's values to the specified number of decimal places
	@param {number} decimalPlaces - The number of decimal places to round to (optional)
	*/
	round(decimalPlaces = 0) {
		this.x = Util.round(this.x, decimalPlaces);
		this.y = Util.round(this.y, decimalPlaces);
	}

	/** 
	Scales the magnitude of the vector to the given quanitiy
	@param {number} scale - Number to scale the magnitude of the vector to
	*/
	scaleTo(scale) {
		this.normalize();
		this.x *= scale;
		this.y *= scale;
	}

	/** 
	@param {number} indentationLevel - Additional tabs to add to the output (optional)
	@returns {string} A string of this vector's values
	*/
	toString(indentationLevel = 0) {
		let tab = "\t".repeat(indentationLevel + 1);
		let output = this.name + ":\n" + tab + "Magnitude: " + this.magnitude + "\n" + tab + "Direction: " + this.direction + "\u00B0\n" + tab + "X Component: " + this.x + "\n" + tab + "Y Component: " + this.y;
		return output + "\n";
	}

	//*********************************************************************//
	//Getters

	/** @returns {number} The magnitude of this vector */
	get magnitude() {
		return this.standardVector[0];
	}

	/** @returns {number} The direction of this vector */
	get direction() {
		return this.standardVector[1];
	}

	/** @returns {number[]} The Standard Vector of this object */
	get standardVector() {
		return [...Vector.calcStandardVector([this.x, this.y])];
	}

	/** @returns {number[]} The componatized vector of this object */
	get componatizedVector() {
		return [this.x, this.y];
	}

	//*********************************************************************//
	//Setters 
	
	/** 
	Sets the values of this object to those of a given Standard Vector
	@param {number[]} standardVector - The Standard Vector to set this object to
	*/
	set standardVector(standardVector) {
		[this.x, this.y] = Vector.componatizeVector(standardVector);
	}

	/** 
	Sets the values of this object to those of a given componatized vector
	@param {number[]} componatizedVector - The componatized vector to set this object to
	*/
	set componatizedVector(componatizedVector) {
		this.x = componatizedVector[0];
		this.y = componatizedVector[1];
	}
}