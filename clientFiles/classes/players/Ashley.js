import { Player } from "../gameEntities/Player.js";

export class Ashley extends Player {
	constructor() {
		super(1920/2, 1080/2);
		//Additional Stats
		this.abilities = {};
		//Buffs and debuffs to damage delt and taken
		this.strengths = {};
		this.weaknesses = {};
	}
}