//Util Class
export class Util {
	//Public Methods
	
	/**
	@param {number} min - The minimum range value
	@param {number} max - The maximum range value (If not given: min = 0 and max = min)
	@returns {number} A random integer in the range [min, max]
	*/
	static randInt(min, max = "none") {
		if (max === "none"){
			max = min;
			min = 0;
		}
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//Creates a deep copy of an object, array1 == array2 without array1 === array2
	/** 
	Creates a deep copy of a simple object, output is stored at a different location than input
	<br>
	<br>
	Does not copy class methods
	<br>
	@param {any} input - The object to be copied
	@returns {any} The copied object
	*/
	static clone(obj) {
		//Get the JSON data from the object and put it together again
		return JSON.parse(JSON.stringify(obj));
	}

	/** 
	Deletes a specified index from an array
	@param {Array} array - The array to be deleted from
	@param {number} index - The index to be deleted
	@returns {Array} The array with the specified index deleted
	*/
	static delIndex(array, index) {
		array.splice(index, 1);
		return array;
	}

	/** 
	Deletes a specified value from an array
	@param {Array} array - The array to be deleted from
	@param {any} value - The value to be deleted
	@returns {Array} The array with the specified value deleted
	*/
	static delValue(array, value) {
		array = this.delIndex(array, array.indexOf(value));
		return array;
	}

	/** 
	Rounds a number to a specified decimal position (be cauitious of bit calculation errors)
	@param {number} num - The number to be rounded
	@param {number} decimals - The number of decimal places to round to
	@returns {number} The rounded number
	*/
	static round(num, decimals = 0) {
		return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
	}

	/** 
	@param {number} num1 - The first number
	@param {number} num2 - The second number
	@returns {number} The absolute value of the number that is closer to 0
	*/
	static absMin(num1, num2) {
		num1 = Math.abs(num1);
		num2 = Math.abs(num2);
		if (num1 < num2) return num1;
		return num2;
	}

	/**
	@param {number} num1 - The first number
	@param {number} num2 - The second number
	@returns {number} The absolute value of the number that is further from 0
	*/
	static absMax(num1, num2) {
		num1 = Math.abs(num1);
		num2 = Math.abs(num2);
		if (num1 > num2) return num1;
		return num2;
	}

	/** 
	@param {Array} array1 - The first array to combine
	@param {Array} array2 - The second array to combine
	@returns {Array} The combined first and second arrays without duplicates
	*/
	static combine(array1, array2) {
		let endArray = [];
		for (let i = 0; i < array1.length; i++) {
			if (!endArray.includes(array1[i])) {
				endArray.push(array1[i]);
			}
		}
		for (let i = 0; i < array2.length; i++) {
			if (!endArray.includes(array2[i])) {
				endArray.push(array2[i]);
			}
		}
		return endArray;
	}

	/**
	@param {number[]} - The array to find the element in
	@returns {number} The lowest element in the array
	*/
	static findLowestElement(array) {
		if (array.length == 0) {
			return null;
		}
		let lowestElement = number.MAX_VALUE;
		for (let i = 0; i < array.length; i++) {
			if (typeof array[i] != "number") {
				continue;
			}
			if (array[i] < lowestElement) {
				lowestElement = array[i];
			}
		}
		return lowestElement;
	}
	
	/**
	@param {number[]} - The array to find the element in
	@returns {number} The highest element in the array
	*/
	static findHighestElement(array) {
		if (array.length == 0) {
			return null;
		}
		let highestElement = number.MIN_VALUE;
		for (let i = 0; i < array.length; i++) {
			if (typeof array[i] != "number") {
				continue;
			}
			if (array[i] > lowestElement) {
				highestElement = array[i];
			}
		}
		return highestElement;
	}
}