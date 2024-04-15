//Util Imports
import { Util } from "../util/Util.js";

//UIObject Imports
import { DialogueBox } from "../UIObjects/DialogueBox.js";

export class Dialogue {
	static dialogue = {
		"level1": [
			'"Greetings fellow explorers! \nI am Flame, the archaeologist.\nI am here to investigate the castle ruins and claim the treasure I will find along the way."', //Flame
				'"Call me Ash, the coin collecter\nI am here to improve my skills in combat and\ncollect money for my weapon shop back home."', //Ash
				'"Are we at the castle?"', //Flame
				'"Yes!"', //Ash
				'"Where does it lead to?"', //Flame
				'"Our treasure"', //Ash
				'"Let’s go!"',//Flame
		],
		"level2": [
			'*huffs* “Woah! The slimes almost got me when I jumped away. Can you believe it?', //Flame
			'*catches breath* “This is just the beginning?!? Whew! I wonder how many enemies will be in the next level."', //Ash
			'“We should gear up for upcoming enemies! That way we can defend ourselves."', // Flame
			'"Let’s head over to shop. We can use the coins we collected to buy upgrades."', //Ash
			'"Upgrades?"', //Flame
			'"Yes. By using the coins, we can get upgrades and prevent our health from declining rapidly."' //Ash
		],
		"level3": [
			'"The upgrades have definitely helped!"', //Flame
			'"My health has improved as well! That is so wonderful!"', //Ash
			'"And we are very close to winning!"', //Flame
			'"I cannot wait to claim my treasure!"', //Ash
			'"Your treasure?"', //Flame
			'"I meant ours."' //Ash
		],
		"win": [
			'"We have done it!"', //Flame
			'"Our treasure!"', //Ash
			'"At last, it is ours!"', //Flame
			'"And all it took was a little fighting, leadership, and resource management"', //Ash
			'"But, it got us to our treasure, no?"', //Flame
			'"Indeed. We have finished."' //Ash
		]
	}

	static messageQueue = [];

	static dialogueBox = new DialogueBox(1920/2, 1080 * 3 / 4 + 80, 1920/2, 140);

	static currentSpeaker = "Flame";

	static loadDialogue(level) {
		switch (level) {
			case 1:
				messageQueue = dialogue["level1"];
				break;
			case 2:
				messageQueue = dialogue["level2"];
				break;
			case 3:
				messageQueue = dialogue["level3"];
				break;
			case 4:
				messageQueue = dialogue["level4"];
				break;
		}
		this.dialogueBox.displayText(this.messageQueue[0], 40);
		this.messageQueue = Util.delIndex(this.messageQueue, 0);
		this.currentSpeaker = "Flame";
	}

	static update(level) {
		if (!this.dialogueBox.update() && this.messageQueue.length > 0) {
			this.dialogueBox.displayText(this.messageQueue[0]);
			this.messageQueue = Util.delIndex(this.messageQueue, 0);
			this.currentSpeaker = (this.currentSpeaker == "Flame")? "Ash" : "Flame";
		} else if (!this.dialogueBox.update()) {
			return false;
		}
	}
}