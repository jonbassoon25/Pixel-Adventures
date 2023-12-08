//Util Imports
import { Util } from "./Util.js";

//Vector Class
export class Vector {
	/*
	Notes:
		- Normal vector formatted as [magnitude, degrees]
		- Componatized vector formatted as [x, y]
	*/
	
	//*********************************************************************//
	//Static Variables

	static ZERO = new Vector(0, 0);
	
	/** Array of all known Vectors */
	static allVectors = [];

	//*********************************************************************//
	//Public Static Methods
	
	/** 
	Calculates a normal vector based on a resolved vector 
	@param {number[]} componatizedVector - The componatized vector to convert
	@returns {number[]} The calculated normal vector
	*/
	static * calcNormalVector(componatizedVector) {
		if (componatizedVector[0] == 0 && componatizedVector[1] == 0) {
			yield 0;
			yield 0;
			return;
		}
		yield Util.round(Math.sqrt(componatizedVector[0] ** 2 + componatizedVector[1] ** 2), 5);
		yield Util.round(Math.atan(componatizedVector[1] / componatizedVector[0]) * 180 / Math.PI, 5);
	}

	//Splits a given simple vector into component form. simple vector formatted as [maginitude, degrees from 0 (right)]]
	static * componatizeVector(normalVector) {
		if (normalVector[0] == 0 && normalVector[1] == 0) {
			yield 0;
			yield 0;
			return;
		}
		yield Util.round(Math.cos(normalVector[1] * Math.PI / 180) * normalVector[0], 5);
		yield Util.round(Math.sin(normalVector[1] * Math.PI / 180) * normalVector[0], 5);
	}

	//Returns a string of all of the vectors contained in this object
	static toString() {
		let output = "All Vectors: ";
		for (let i = 0; i < this.allVectors.length; i++) {
			output += "\n\t" + this.allVectors[i].toString(2);
		}
		return output;
	}

	//Updates all known Vectors
	static updateAll() {
		for (let i = 0; i < this.allVectors.length; i++) {
			this.allVectors[i].update();
		}
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
			[this.magnitude, this.direction] = Vector.calcNormalVector([this.x, this.y]);
		} else if (arguments.length == 2 + add) {
			this.magnitude = arguments[add];
			this.direction = arguments[add + 1];
			[this.x, this.y] = Vector.componatizeVector([this.magnitude, this.direction]);
		} else {
			console.warn("\nInvalid number of arguments in constructor for Vector:\n\t" + this.name + ": " + arguments.length + ".\nCreating Default Vector");
			this.x = 0;
			this.y = 0;
			this.magnitude = 0;
			this.direction = 0;
		}
		//Force Vectors that need to be added to this Vector every time it is updated. All in units/sec not units/frame
		this.forces = [];
		//Add this Vector to a list of all vectors
		if (typeof Vector.allVectors == "undefined") {
			Vector.allVectors = [this];
		} else {
			Vector.allVectors.push(this);
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
		[this.magnitude, this.direction] = Vector.calcNormalVector([this.x, this.y]);
	}

	/** 
	Deletes all refrences to this vector
	*/
	delete() {
		Vector.allVectors = Util.delValue(Vector.allVectors, this);
	}

	/** 
	Checks to see if this vector is equal to another vector
	@param {Vector} otherVector - The vector to check if this vector is equal to
	@returns {boolean} True if this vector is equal to the other vector
	*/
	equals(otherVector) {
		return (this.x == otherVector.x && this.y == otherVector.y) || (this.magnitude == otherVector.magnitude && this.direction == otherVector.direction);
	}

	//Limits the max and min values of the vector using componatized values
	/** 
	Limits the max and min values of this vector using componatezed values
	@param {number} maxX - The maximum value of this vector in the x direction
	@param {number} maxY - The maximum value of this vector in the y direction
	*/
	limitComponatizedValues(maxX, maxY) {
		//Assign x and y, account for sign of x and y
		if (this.x < 1) {
			this.x = -Util.absMin(this.x, maxX);
		} else {
			this.x = Util.absMin(this.x, maxX);
		}

		if (this.y < 1) {
			this.y = -Util.absMin(this.y, maxY);
		} else {
			this.y = Util.absMin(this.y, maxY);
		}
		//Assign other values
		[this.magnitude, this.direction] = Vector.calcNormalVector([this.x, this.y]);
	}

	/** 
	Limits the max and min values of this vector using normal values
	@param {number} maxMagnitude - The maximum magnitude of this vector
	*/
	limitNormalValues(maxMagnitude) {
		this.magnitude = Util.absMin(this.magnitude, maxMagnitude);
		[this.x, this.y] = Vector.componatizeVector([this.magnitude, this.direction]);
	}

	//Multiplies this vector by a scalar
	/** 
	Multiplies this vector's values by a scalar quantity
	@param {number} scalar - The scalar quantity to multiply this vector by
	*/
	multiply(scalarValue) {
		this.x *= scalarValue;
		this.y *= scalarValue;
		[this.magnitude, this.direction] = Vector.calcNormalVector([this.x, this.y]);
	}

	//Rounds the vector values to specified decimal places
	/** 
	Rounds all of this vector's values to the specified number of decimal places
	@param {number} decimalPlaces - The number of decimal places to round to (optional)
	*/
	round(decimalPlaces = 0) {
		this.x = Util.round(this.x, decimalPlaces);
		this.y = Util.round(this.y, decimalPlaces);
		this.magnitude = Util.round(this.magnitude, decimalPlaces);
		this.direction = Util.round(this.direction, decimalPlaces);
	}

	//Returns a string of this vector's values
	/** 
	@param {number} indentationLevel - Additional tabs to add to the output (optional)
	@returns {string} A string of this vector's values
	*/
	toString(indentationLevel = 0) {
		let tab = "\t".repeat(indentationLevel + 1);
		let output = this.name + ":\n" + tab + "Magnitude: " + this.magnitude + "\n" + tab + "Direction: " + this.direction + "\u00B0\n" + tab + "X Component: " + this.x + "\n" + tab + "Y Component: " + this.y + "\n" + tab + "Forces:";
		for (let i = 0; i < this.forces.length; i++) {
			output += "\n" + tab + "\t" + this.forces[i].toString(indentationLevel + 2);
		}
		if (this.forces.length == 0) {
			output += "\n" + tab + "\t" + "None";
		}
		return output + "\n";
	}

	/** Updates the vector, adding all the forces exerted on it */
	update() {
		for (let i = 0; i < this.forces.length; i++) {
			this.add(this.forces[i], 1/60);
		}
		this.forces = [];
	}

	//*********************************************************************//
	//Getters

	/** @returns {number[]} The normal vector of this object */
	get normalVector() {
		return [this.magnitude, this.direction];
	}

	/** @returns {number[]} The componatized vector of this object */
	get componatizedVector() {
		return [this.x, this.y];
	}

	//*********************************************************************//
	//Setters 
	
	/** 
	Sets the values of this object to those of a given normal vector
	@param {number[]} normalVector - The normal vector to set this object to
	*/
	set normalVector(normalVector) {
		this.magnitude = normalVector[0];
		this.direction = normalVector[1];
		[this.x, this.y] = Vector.componatizeVector(normalVector);
	}

	/** 
	Sets the values of this object to those of a given componatized vector
	@param {number[]} componatizedVector - The componatized vector to set this object to
	*/
	set componatizedVector(componatizedVector) {
		this.x = componatizedVector[0];
		this.y = componatizedVector[1];
		[this.magnitude, this.direction] = Vector.calcNormalVector(componatizedVector);
	}
}