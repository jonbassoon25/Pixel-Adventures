//Diffiuclty Class
export class Difficulty {
	//Static Variables
	static currentDifficulty = "null";
	static enemyHealthMult = 1;
	static enemyDamageMult = 1;
	static enemySpeedMult = 1;
	static priceMult = 1;
	static pointMultiplier = 1;
	static customValues = {"enemyHealthMult": 1, "enemyDamageMult": 1, "enemySpeedMult": 1, "priceMult": 1};

	//*********************************************************************//
	//Public Static Methods

	static setEasy() {
		this.enemyHealthMult = 0.5;
		this.enemyDamageMult = 0.5;
		this.enemySpeedMult = 0.9;
		this.priceMult = 0.75;
		this.pointMultiplier = 0.25;
		this.currentDifficulty = "easy";
	}

	static setMedium() {
		this.enemyHealthMult = 1;
		this.enemyDamageMult = 1;
		this.enemySpeedMult = 1;
		this.priceMult = 1;
		this.pointMultiplier = 1;
		this.currentDifficulty = "medium";
	}

	static setHard() {
		this.enemyHealthMult = 2;
		this.enemyDamageMult = 1.5;
		this.enemySpeedMult = 1.25;
		this.priceMult = 1.5;
		this.pointMultiplier = 2;
		this.currentDifficulty = "hard";
	}
	
	static setCustom(customValues = this.customValues) {
		this.enemyHealthMult = customValues["enemyHealthMult"];
		this.enemyDamageMult = customValues["enemyDamageMult"];
		this.enemySpeedMult = customValues["enemySpeedMult"];
		this.priceMult = customValues["priceMult"];
		this.pointMultiplier = 1;
		this.currentDifficulty = "custom";
	}
}