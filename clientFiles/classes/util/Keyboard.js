//Keyboard Class
export class Keyboard {
	//Static Variables
	
	//Keyboard vars
	static keysDown = [];
	static shiftDown = false;
	static backspaceDown = false;
	static escapeDown = false;
	//Single frame vars
	static keysPressed = [];
	static keysReleased = [];
	static shiftPressed = false;
	static backspacePressed = false;
	static escapePressed = false;

	//*********************************************************************//
	//Public Static Methods 
	
	/** 
 	 * @param {string} key - The key to check
 	 * @returns {boolean} - True if the specified key is down (held)
  	 */
	static isKeyDown(key) {
		return Keyboard.keysDown.includes(key);
	}

	/** 
 	 * @param {string} key - The key to check
  	 * @returns {boolean} - True if the specified key is pressed (single frame)
  	 */
	static isKeyPressed(key) {
		return Keyboard.keysPressed.includes(key);
	}

	/** 
 	 * @param {string} key - The key to check
  	 * @returns {boolean} - True if the specified key is released (single frame)
  	 */
	static isKeyReleased(key) {
		return Keyboard.keysReleased.includes(key);
	}
	
	/** 
 	 * "Presses" a keyboard key
  	 * @param {string} key - The key to press
 	 */
	static keyDown(key) {
		this.keysPressed.push(key);
		this.keysDown = Array.from(new Set([...this.keysDown, key]));
	}

	/**
 	 * "Releases" a keyboard key
  	 * @param {string} key - The key to release
  	 */
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

	/** 
	 * Resets all single frame Keyboard variables
  	 */
	static resetVars() {
		this.keysPressed = [];
		this.keysReleased = [];
		this.shiftPressed = false;
		this.backspacePressed = false;
		this.escapePressed = false;
	}
}