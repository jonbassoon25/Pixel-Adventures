//Game Entity Imports
import { Player } from "../gameEntities/Player.js";

//Game Object Imports
import { ObscuredRegion } from "./ObscuredRegion.js";

//Basic Object Imports
import { DynamicObject } from "../basicObjects/DynamicObject.js";
import { VisualObject } from "../basicObjects/VisualObject.js";


export class TriggerRegion extends VisualObject {
	static triggerRegions = [];
	constructor(x, y, width, height, action, actionRequiresUpdates = true) {
		super("none", x, y, width, height);
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
		//Detect players and trigger the action
		for (let i = 0; i < DynamicObject.dynamicObjects.length; i++) {
			if (DynamicObject.dynamicObjects[i] instanceof Player) {
				if (this.isColliding(DynamicObject.dynamicObjects[i])) {
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
			}
		}
		
	}
}