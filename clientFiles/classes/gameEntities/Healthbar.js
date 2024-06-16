//Util Imports

//UI Object Imports

//Gamestate Imports

//Game Object Imports

//Game Entity Imports

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { Display } from "../util/Display.js";

export class Healthbar extends DynamicObject {

    /*
    Notes:
        - stuff
    */

    //*********************************************************************//
    //Static Variables


    //*********************************************************************//
    //Private Static Methods - No required JSDocs


    //*********************************************************************//
    //Public Static Methods - Must Have JSDocs

    //*********************************************************************//
    //Constructor - Must have JSDocs
    constructor(parent, clearance = 7) {
        super("healthbar", 0, parent.x, parent.y - clearance, parent.width * 2, 10, false, true);
        this.parent = parent;
        this.x = this.parent.x;
        this.y = this.parent.y - this.parent.height/2 - 7;
        this.visualHeight *= 1.2;
        this.visualWidth *= 1.1;
        this.clearance = clearance;
        this.max = (parent.maxHealth == null)? parent.health: parent.maxHealth;
    }

    //*********************************************************************//
    //Private Methods - No required JSDocs


    //*********************************************************************//
    //Public Methods - Must have JSDocs
    draw() {
        if (this.parent.health >= 0) {
            if (this.parent.isDead != null) if (this.parent.isDead) return;
            let redWidth = this.width * (this.parent.health / this.max);
            Display.draw("shader_05", this.x, this.y, this.width, this.height);
            Display.draw("redTile", this.x - (this.width - redWidth)/2, this.y, redWidth, 10);
        }
    }
    update() {
        this.x = this.parent.x;
        this.y = this.parent.y - this.parent.height/2 - this.clearance;
    }

    //*********************************************************************//
    //Getters - No required JSDocs


    //*********************************************************************//
    //Setters - Must have JSDocs
}