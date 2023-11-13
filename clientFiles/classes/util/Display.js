//Define the canvas
const canvas = document.getElementById("gameScreen");

export class Display {
	//Define intial variables
	static sizeMult = 1;
	static horizontalOffset = 0;
	static verticalOffset = 0;

	//Updates screen variables to reflect whatever the user has for their screen
	static calcScreenSize() {
		//Make sure that the canvas covers the whole screen
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		//setup for 16:9 aspect ratio at 1920px * 1080px base
		if (canvas.width / 16 > canvas.height / 9) {
			this.sizeMult = canvas.height/1080;
			this.horizontalOffset = (canvas.width / 16 - canvas.height / 9) * 16 / 2;
			this.verticalOffset = 0;
		} else {
			this.sizeMult = canvas.width/1920;
			this.verticalOffset = (canvas.height / 9 - canvas.width / 16) * 9 / 2;
			this.horizontalOffset = 0;
		}
	}

	//Returns the actual size of an element for a given absolute size with respect to player screen dimensions. (0, 0) now represents left corner instead of middle. Returns 4 elements, should be called as [...screen.calcElementDimensions(x, y, w, h)]
	static * calcElementDimenstions(x, y, width, height) {
		yield (x - width/2) * this.sizeMult + this.horizontalOffset;
		yield (y - height/2) * this.sizeMult + this.verticalOffset;
		yield width * this.sizeMult;
		yield height * this.sizeMult;
	}
}