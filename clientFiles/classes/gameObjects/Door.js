//Util Imports
import { Display } from "../util/Display.js";

//Game Object Imports
import { SceneTile } from "./SceneTile.js";

//Door Class
export class Door extends SceneTile {
    //Constructor
    
    /**
     * @param {string} background 
     * @param {number} col 
     * @param {number} row 
     * @param {boolean} hasVines 
     */
    constructor(background, col, row, action, hasVines = false) {
        super(background, col, row, false, hasVines);
		this.action = action;
    }

    //*********************************************************************//
	//Public Methods

    /** Draws and Updates this Door */
    update() {
        super.update();
        Display.draw("placeholder", this.x, this.y, this.width/1.3, this.height/1.1);
    }
}