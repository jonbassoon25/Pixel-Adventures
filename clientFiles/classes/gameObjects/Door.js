//Util Imports
import { Game } from "../gamestates/Game.js";
import { Player } from "../gameEntities/Player.js";

//Basic Object Imports
import { InteractableObject } from "../basicObjects/InteractableObject.js";

//Door Class
export class Door extends InteractableObject {
    //Constructor
    
    /**
     * @param {number} x - x position of the bottom of the door
     * @param {number} y - y position of the middle of the bottom of the door
     */
    constructor(x, y) {
        super("door", 5, x, y - 10, 40, 60);
		this.levelInc = 1
    }

    //*********************************************************************//
	//Public Methods

	/**
	 * @param {Player} - The player that is interacting with this InteractableObject
	 */
	interactWith(player) {
		Game.level += this.levelInc;
		this.levelInc = 0
		if (Game.level != 4) {
			Player.retainedValues["p1Coins"] = Game.player1.coins;
			Player.retainedValues["p2Coins"] = Game.player2.coins;
			Player.retainedValues["p1Score"] = Game.player1.points;
			Player.retainedValues["p2Score"] = Game.player2.points;
			document.dispatchEvent(new CustomEvent("sceneChange", {"detail": "initCutscene"}));
		} else {
			Player.retainedValues["p1Coins"] = Game.player1.coins;
			Player.retainedValues["p2Coins"] = Game.player2.coins;
			Player.retainedValues["p1Score"] = Game.player1.points;
			Player.retainedValues["p2Score"] = Game.player2.points;
			document.dispatchEvent(new CustomEvent("sceneChange", {"detail": "initWin"}));
		}
	}
}