export class Util {
	//Returns a random integer between range [min, max], if one value is given min is 0 and max is that value
	static randInt(min, max = "none") {
		if (max === "none"){
			max = min;
			min = 0;
		}
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//Creates a deep copy of an object, array1 == array2 without array1 === array2
	static clone(obj) {
		//Get the JSON data from the object and put it together again
		return JSON.parse(JSON.stringify(obj));
	}

	//Rounds a number to specified decimal position (be cautious of bit representation interference)
	static round(num, decimals = 0) {
		console.log(num)
		return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
	}
}