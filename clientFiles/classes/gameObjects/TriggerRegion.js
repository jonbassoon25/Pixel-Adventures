//Util Imports
import { Display } from "../util/Display.js";
import { Util } from "../util/Util.js";

//Game Entity Imports
import { Player } from "../gameEntities/Player.js";

//Game Object Imports
import { ObscuredRegion } from "./ObscuredRegion.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { VisualObject } from "../basicObjects/VisualObject.js";


export class TriggerRegion extends VisualObject {
	static triggerRegions = [];
	constructor(x, y, width, height, action, actionRequiresUpdates = false, requiresBothPlayers = false) {
		super("none", x, y, width, height);
		this.requiresBothPlayers = requiresBothPlayers;
		TriggerRegion.triggerRegions.push(this);
		this.action = action;
		this.actionRequiresUpdates = actionRequiresUpdates;
	}
	static clear() {
		TriggerRegion.triggerRegions = [];
	}
	static update() {
		for (let i = 0; i < TriggerRegion.triggerRegions.length; i++) {
			TriggerRegion.triggerRegions[i].update();
		}
	}
	delete() {
		TriggerRegion.triggerRegions = Util.delValue(TriggerRegion.triggerRegions, this);
	}

	trigger() {
		//If this trigger region's action has a trigger function, run the trigger function
		if (typeof this.action.trigger === "function") {
			if (!this.action.isTriggered) this.action.trigger();
		//If this trigger region's action has an isTriggered property, set the isTriggered property to true
		} else if (typeof this.action.isTriggered === "boolean") {
			if (!this.action.isTriggered) this.action.isTriggered = true;
		//If this trigger region's action is a set of objects with trigger functions, trigger all the objects
		} else if (Array.isArray(this.action) && typeof this.action[0].trigger === "function") {
			for (let i = 0; i < this.action.length; i++) {
				if (!this.action[i].isTriggered) this.action[i].trigger();
			}
		//If this trigger region's action is a set of objects with isTriggered property, enable isTriggered for all of them
		} else if (Array.isArray(this.action) && typeof this.action[0].isTriggered === "boolean") {
			for (let i = 0; i < this.action.length; i++) {
				if (!this.action[i].isTriggered) this.action[i].isTriggered = true;
			}
		//Else the action is a lambda
		} else {
			this.action();
		}
	}
	
	update() {
		super.update();
		//If this trigger region's action needs to be updated
		if (!Array.isArray(this.action) && this.actionRequiresUpdates) {
			this.action.update();
		}
		//If this trigger region's action is an array of objects that need to be updated
		if (Array.isArray(this.action) && this.actionRequiresUpdates) {
			for (let i = 0; i < this.action.length; i++) {
				if (typeof this.action[i].update === "function") this.action[i].update();
			}
		}
		//(Debugging) Draw this trigger region
		//Display.draw("blackTile", this.x, this.y, this.width, this.height, true, false, 0, 50);
		//Detect players and trigger the action
		let numPlayers = 0;
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			if (DynamicObject.dynamicObjects[i] instanceof Player) {
				if (this.requiresBothPlayers && DynamicObject.dynamicObjects[i].isDead) {
					numPlayers++;
				}
				if (!DynamicObject.dynamicObjects[i].isDead && this.isColliding(DynamicObject.dynamicObjects[i])) {
					numPlayers++;
				}
				//console.log(numPlayers);
				if ((!this.requiresBothPlayers && numPlayers == 1) || (this.requiresBothPlayers && numPlayers >= 2)) {
					this.trigger();
					this.delete();
				}
			}
		}
	}
}