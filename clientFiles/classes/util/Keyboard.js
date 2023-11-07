export class Keyboard {
	static keysDown = [];
	static shiftDown = false;
	static backspaceDown = false;
	//Single frame vars
	static keysPressed = [];
	static keysReleased = [];
	static shiftPressed = false;
	static backspacePressed = false;

	static keyDown(key) {
		this.keysPressed.push(key);
		this.keysDown = Array.from(new Set([...this.keysDown, key]));
	}

	static keyUp(key) {
		this.keysReleased.push(key);
		for (let keyIndex = 0; keyIndex < this.keysDown.length; keyIndex++) {
			//if the values are the same delete the index from keysPressed
			if (this.keysDown[keyIndex] === key){
				this.keysDown.splice(keyIndex, 1);
				keyIndex--;
			}
		}
	}

	static resetVars() {
		this.keysPressed = [];
		this.keysReleased = [];
		this.shiftPressed = false;
		this.backspacePressed = false;
	}
}