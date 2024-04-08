//Util Imports
import { Display } from "../util/Display.js";

//Game Object Imports
import { SceneTile } from "./SceneTile.js";
import { Scene } from "../util/Scene.js";
import { Util } from "../util/Util.js";

//Door Class
export class Door extends SceneTile {
	static doors = [];
	
	
    //Constructor
    
    /**
     * @param {string} background 
     * @param {number} col 
     * @param {number} row
     * @param {lambda} action
     * @param {boolean} hasVines 
     */
    constructor(background, col, row, hasVines = false) {
        super(background, col, row, false, hasVines);
		this.visualHeight = 80;
		this.type = "door";
    }

    //*********************************************************************//
	//Public Methods

    /** Draws and Updates this Door */
    update() {
        super.update();
        Display.draw("door", this.x, this.y - (this.width * 3/2 - this.height)/2, this.width, this.width * 3/2);
    }
}