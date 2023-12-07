//Mouse Class
export class Mouse {
	//Static Variables
	
	//x and y position of the mouse
	static x = 0;
	static y = 0;
	//Is the left mouse button down
	static button1Down = false;
	//Is the right mouse button down
	static button2Down = false;
	//Single frame vars, reset every frame. Shows initial presses only
	static button1Pressed = false;
	static button1Released = false;
	static button2Pressed = false;
	static button2Released = false;

	//*********************************************************************//
	//Public Static Methods
	
	/** 
	Resets all single frame Mouse variables
	*/
	static resetVars() {
		this.button1Pressed = false;
		this.button1Released = false;
		this.button2Pressed = false;
		this.button2Released = false;
	}
}