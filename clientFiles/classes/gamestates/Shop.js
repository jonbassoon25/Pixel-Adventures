//Util Imports
import { Display } from "../util/Display.js";
import { Difficulty } from "../util/Difficulty.js";
import { AudioPlayer } from "../util/AudioPlayer.js";
import { AnimationPlayer } from "../util/AnimationPlayer.js";
import { Keyboard } from "../util/Keyboard.js";
import { Util } from "../util/Util.js";
import { Vector } from "../util/Vector.js";
import { Keyframe } from "../util/Keyframe.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";
import { Game } from "./Game.js";

//Game Object Imports
import { Sword } from "../gameObjects/Sword.js";
import { Mace } from "../gameObjects/Mace.js";

//Game Entity Imports
import { Player } from "../gameEntities/Player.js";
import { Particle } from "../gameEntities/Particle.js";

//Basic Object Imports
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { AnimatedObject } from "../basicObjects/AnimatedObject.js";
import { Mouse } from "../util/Mouse.js";

//Shop Class
export class Shop extends Gamestate {
	//Static Variables

	//Player 1 Upgrades
	static player1UpgradeSword = new Button("upgradeSword", 1920/4 - 70, 1080/2 - 300 + 40, 408, 96);
	static player1UpgradeMace = new Button("upgradeMace", 1920/4 - 70, 1080/2 - 300 + 40, 408, 128);
	static player1UpgradeHealth = new Button("upgradeMaxHealth", 1920/4 - 70, 1080/2 - 150 + 40, 408, 96);
	static player1UpgradeRegen = new Button("upgradeRegen", 1920/4 - 70, 1080/2 + 0 + 40, 408, 96);
	static player1UpgradeSpeed = new Button("upgradeSpeed", 1920/4 - 70, 1080/2 + 150 + 40, 408, 96);
	static player1UpgradeJump = new Button("upgradeJump", 1920/4 - 70, 1080/2 + 300 + 40, 408, 96);

	//Player 2 Upgrades
	static player2UpgradeSword = new Button("upgradeSword", 1920/4 * 3 + 70, 1080/2 - 300 + 40, 408, 96);
	static player2UpgradeMace = new Button("upgradeMace", 1920/4 * 3 + 70, 1080/2 - 300 + 40, 408, 128);
	static player2UpgradeHealth = new Button("upgradeMaxHealth", 1920/4 * 3 + 70, 1080/2 - 150 + 40, 408, 96);
	static player2UpgradeRegen = new Button("upgradeRegen", 1920/4 * 3 + 70, 1080/2 + 0 + 40, 408, 96);
	static player2UpgradeSpeed = new Button("upgradeSpeed", 1920/4 * 3 + 70, 1080/2 + 150 + 40, 408, 96);
	static player2UpgradeJump = new Button("upgradeJump", 1920/4 * 3 + 70, 1080/2 + 300 + 40, 408, 96);

	//Continue Button
	static continue = new Button("door", 1920/2, 1080 - 288/2, 192, 288);
	
	//Coin Transfer Buttons
	static blueToRed = new Button("blueToRed", 1920/2 + 100, 1080/2 + 60, 120, 110);
	static redToBlue = new Button("redToBlue", 1920/2 - 100, 1080/2 + 60, 120, 110);

	//Shop Mace
	static mace = new AnimatedObject("shopMace", 0, 1920/2, 300, 560, 560, false);
	
	//Mace visual booleans
	static maceBought = false;
	static glassBroken = false;
	
	
	//*********************************************************************//
	//Private Static Methods
	
	static #getCostOf(upgrade) {
		return Math.round((6 + Player.upgradesBought[upgrade] * 4) * Difficulty.priceMult);
	}
	
	static #updateParticles() {
		for (let i = Object.keys(ShadedObject.shadedObjects).length - 1; i >= 0; i--) {
			for (let j = 0; j < Object.values(ShadedObject.shadedObjects)[i].length; j++) {
				if (ShadedObject.shadedObjects[i][j] instanceof Particle) {
					//Update and draw the particle
					Object.values(ShadedObject.shadedObjects)[i][j].draw();
					Object.values(ShadedObject.shadedObjects)[i][j].update();
				}
			}
		}
	}
	
	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs
	
	static init() {
		super.init();
		if (!this.maceBought) {
			this.mace = new AnimatedObject("shopMace", 0, 1920/2, 300, 560, 560, false);
			this.mace.currentAnimation = "standing";
		}
		this.setScene("shop");
	}
	
	static update() {
		//Display Shop Background, player icons, and plaques
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		Display.draw("upgradePlaque", 420, 1080/2, 702, 1026);
		Display.draw("upgradePlaque", 1920-420, 1080/2, 702, 1026);
		
		//Mace display
		if (!this.maceBought) {
			//Display.draw("mace-45", 1920/2, 300, 560, 560);
			if (this.mace.currentAnimation == "standing") {
				this.mace.update();
				this.mace.draw();
			}
			if (!this.glassBroken) {
				Display.draw("glassPane", 1920/2, 220, 200, 400);
				Display.draw("priceTag", 1920/2 + 90, 220 + 190, 100, 44, true, false, 45);
				if (Button.simpleButton(1920/2, 220, 200, 400)) {
					//If the players can afford the mace
					if (Game.player1.coins + Game.player2.coins >= 30) {
						this.mace.currentAnimation = "falling";
						//Spawn glass shatter particles
						for (let j = 0; j < 2; j++) {
							for (let i = 0; i < 171; i++) {
								let x = 1920/2 + ((i%9 - 4) * 20);
								let y = 220 + ((Math.floor(i/9) - 9) * 20);
								let xVel = Math.random() * 15 - 15/2;
								let yVel = Math.random() * 6 - 2;
								new Particle("glass", x, y, 20, 20, new Vector([xVel, yVel]), 2, 0.95, true, false, false);
							}
						}
						//Load animations
						AnimationPlayer.load("priceTagFalls");
						//AnimationPlayer.load("redJump", true);
						//AnimationPlayer.load("blueJump", true);
						//Draw from both player's balances to purchase the mace
						let cost = 30;
						if (Game.player1.coins >= Game.player2.coins) {
							if ((Game.player1.coins - Game.player2.coins) >= 30) {
								Game.player1.coins -= 30;
								cost = 0;
							} else {
								cost -= (Game.player1.coins - Game.player2.coins);
								Game.player1.coins -= (Game.player1.coins - Game.player2.coins);
								if (cost % 2 == 0) {
									Game.player1.coins -= cost/2;
									Game.player2.coins -= cost/2;
									cost = 0;
								} else {
									Game.player1.coins -= Math.floor(cost/2) + 1;
									Game.player2.coins -= Math.floor(cost/2);
									cost = 0;
								}
							}
						} else {
							if ((Game.player2.coins - Game.player1.coins) >= 30) {
								Game.player2.coins -= 30;
								cost = 0;
							} else {
								cost -= (Game.player2.coins - Game.player1.coins);
								Game.player2.coins -= (Game.player2.coins - Game.player1.coins);
								if (cost % 2 == 0) {
									Game.player1.coins -= cost/2;
									Game.player2.coins -= cost/2;
									cost = 0;
								} else {
									Game.player1.coins -= Math.floor(cost/2) + 1;
									Game.player2.coins -= Math.floor(cost/2);
									cost = 0;
								}
							}
						}
						this.glassBroken = true;
					}
				}
			} else {
				if (Button.simpleButton(1920/2 - 800, 1080/2, 180, 240)) {
					Player.upgradesBought["playerOneWeapon"] = 0; 
					Player.retainedValues["p1Weapon"] = Mace;
					this.maceBought = true;
					this.mace.currentAnimation = "bought";
					AnimationPlayer.clear();
				}
				if (Button.simpleButton(1920/2 + 800, 1080/2, 180, 240)) {
					Player.upgradesBought["playerTwoWeapon"] = 0;
					Player.retainedValues["p2Weapon"] = Mace;
					this.maceBought = true;
					this.mace.currentAnimation = "bought";
					AnimationPlayer.clear();
				}
			}
		}
		//Update the mace's position as it is dragged
		if (this.mace.currentAnimation == "falling") {
			//Smoothly move the mace to the mouse cursor
			let x; let y;
			[x, y] = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)];
			this.mace.x = 1920/2 + (x - 1920/2) * Keyframe.getRawValue(this.mace.currentFrame/150, "log");
			this.mace.y = 300 + (y - 300) * Keyframe.getRawValue(this.mace.currentFrame/150, "sinusoidal");
		} else if (this.mace.currentAnimation == "idle") {
			//Maintain the mace's position at the mouse cursor
			let x; let y;
			[x, y] = [...Display.inverseCalcElementDimensions(Mouse.x, Mouse.y, -1, -1)];
			this.mace.x = x;
			this.mace.y = y;
		}
		//Draw the players
		Display.draw("redPlayer", 1920/2 - 800, 1080/2, 240, 240);
		Display.draw("bluePlayerFlipped", 1920/2 + 800, 1080/2, 240, 240);
		/* Jumping animations (unused)
		if (!this.glassBroken || this.maceBought) {
			Display.draw("redPlayer", 1920/2 - 800, 1080/2, 240, 240);
			Display.draw("bluePlayerFlipped", 1920/2 + 800, 1080/2, 240, 240);
		} else {
			if (AnimationPlayer.isPlaying("redJump")) {
				if (AnimationPlayer.getAnimation("redJump").frames <= 30) {
					Display.drawText("Click me!", 1920/2 - 800 - 85, 1080/2 - 130 - (130 * (Keyframe.getRawValue(AnimationPlayer.getAnimation("redJump").frames/30, "projectileArc"))), 40, true, "white");
				} else {
					Display.drawText("No, me!", 1920/2 + 800 - 90, 1080/2 - 130 - (130 * (Keyframe.getRawValue((AnimationPlayer.getAnimation("redJump").frames - 30)/30, "projectileArc"))), 40, true, "white");
				}
			}
		}*/

		//Display coin transfer text
		Display.draw("transferCoins", 1920/2, 1080/2 - 95 + 60, 248, 64);

		let p1WCost = this.#getCostOf("playerOneWeapon");
		let p2WCost = this.#getCostOf("playerTwoWeapon");
		let p1HCost = this.#getCostOf("playerOneHealth");
		let p2HCost = this.#getCostOf("playerTwoHealth");
		let p1RCost = this.#getCostOf("playerOneRegen");
		let p2RCost = this.#getCostOf("playerTwoRegen");
		let p1SCost = this.#getCostOf("playerOneSpeed");
		let p2SCost = this.#getCostOf("playerTwoSpeed");
		let p1JCost = this.#getCostOf("playerOneJump");
		let p2JCost = this.#getCostOf("playerTwoJump");

		//Update price displays for Player 1
		for (let i = 0; i < 5; i++) Display.draw("coin", 1920/4 - 45 + 220 + 44, 1080/2 - 300 + 85 + 150 * i - 54 * 3/4 - 3, 54, 54);
		Display.drawText(p1WCost.toString(), 1920/4 - 45 + 200 + 30 - Display.getTextWidth(p1WCost.toString(), 60), 1080/2 - 300 + 85, 60, true, "white");
		Display.drawText(p1HCost.toString(), 1920/4 - 45 + 200 + 30 - Display.getTextWidth(p1HCost.toString(), 60), 1080/2 - 150 + 85, 60, true, "white");
		Display.drawText(p1RCost.toString(), 1920/4 - 45 + 200 + 30 - Display.getTextWidth(p1RCost.toString(), 60), 1080/2 + 0 + 85, 60, true, "white");
		Display.drawText(p1SCost.toString(), 1920/4 - 45 + 200 + 30 - Display.getTextWidth(p1SCost.toString(), 60), 1080/2 + 150 + 85, 60, true, "white");
		Display.drawText(p1JCost.toString(), 1920/4 - 45 + 200 + 30 - Display.getTextWidth(p1JCost.toString(), 60), 1080/2 + 300 + 85, 60, true, "white");

		//Update price displays for Player 2
		for (let i = 0; i < 5; i++) Display.draw("coin", 1920/4 * 3 - 180 - 54 + 74, 1080/2 - 300 + 85 + 150 * i - 54 * 3/4 - 3, 54, 54);
		Display.drawText(p2WCost.toString(), 1920/4 * 3 + 30 - 180 - 54 - Display.getTextWidth(p2WCost.toString(), 40), 1080/2 - 300 + 85, 60, true, "white");
		Display.drawText(p2HCost.toString(), 1920/4 * 3 + 30 - 180 - 54 - Display.getTextWidth(p2HCost.toString(), 40), 1080/2 - 150 + 85, 60, true, "white");
		Display.drawText(p2RCost.toString(), 1920/4 * 3 + 30 - 180 - 54 - Display.getTextWidth(p2RCost.toString(), 40), 1080/2 + 0 + 85, 60, true, "white");
		Display.drawText(p2SCost.toString(), 1920/4 * 3 + 30 - 180 - 54 - Display.getTextWidth(p2SCost.toString(), 40), 1080/2 + 150 + 85, 60, true, "white");
		Display.drawText(p2JCost.toString(), 1920/4 * 3 + 30 - 180 - 54 - Display.getTextWidth(p2JCost.toString(), 40), 1080/2 + 300 + 85, 60, true, "white");
		
		//Detect upgrade button presses and upgrade selected
		//Player 1
		switch (Player.retainedValues["p1Weapon"]) {
			case Sword:
				if (this.player1UpgradeSword.subsistAsButton() && Game.player1.coins >= p1WCost) { Game.player1.upgradeWeapon(); Game.player1.coins -= p1WCost; Player.upgradesBought["playerOneWeapon"]++; AudioPlayer.play("upgrade");}
				break;
			case Mace:
				if (this.player1UpgradeMace.subsistAsButton() && Game.player1.coins >= p1WCost) { Game.player1.upgradeWeapon(); Game.player1.coins -= p1WCost; Player.upgradesBought["playerOneWeapon"]++; AudioPlayer.play("upgrade");}
				break;
			default:
				console.log("Weapon not recognized.");
		}
		if (this.player1UpgradeHealth.subsistAsButton() && Game.player1.coins >= p1HCost) { Game.player1.upgradeHealth(); Game.player1.coins -= p1HCost; Player.upgradesBought["playerOneHealth"]++; AudioPlayer.play("upgrade");}
		if (this.player1UpgradeRegen.subsistAsButton() && Game.player1.coins >= p1RCost) { Game.player1.upgradeRegen(); Game.player1.coins -= p1RCost; Player.upgradesBought["playerOneRegen"]++; AudioPlayer.play("upgrade");}
		if (this.player1UpgradeSpeed.subsistAsButton() && Game.player1.coins >= p1SCost) { Game.player1.upgradeSpeed(); Game.player1.coins -= p1SCost; Player.upgradesBought["playerOneSpeed"]++; AudioPlayer.play("upgrade");}
		if (this.player1UpgradeJump.subsistAsButton() && Game.player1.coins >= p1JCost) { Game.player1.upgradeJump(); Game.player1.coins -= p1JCost;Player.upgradesBought["playerOneJump"]++; AudioPlayer.play("upgrade");}

		//Player 2
		switch (Player.retainedValues["p2Weapon"]) {
			case Sword:
				if (this.player2UpgradeSword.subsistAsButton() && Game.player2.coins >= p2WCost) { Game.player2.upgradeWeapon();  Game.player2.coins -= p2WCost; Player.upgradesBought["playerTwoWeapon"]++; AudioPlayer.play("upgrade");}
				break;
			case Mace:
				if (this.player2UpgradeMace.subsistAsButton() && Game.player2.coins >= p2WCost) { Game.player2.upgradeWeapon();  Game.player2.coins -= p2WCost; Player.upgradesBought["playerTwoWeapon"]++; AudioPlayer.play("upgrade");}
				break;
			default:
				console.log("Weapon not recognized.");
		}
		if (this.player2UpgradeHealth.subsistAsButton() && Game.player2.coins >= p2HCost) { Game.player2.upgradeHealth();  Game.player2.coins -= p2HCost; Player.upgradesBought["playerTwoHealth"]++; AudioPlayer.play("upgrade");}
		if (this.player2UpgradeRegen.subsistAsButton() && Game.player2.coins >= p2RCost) { Game.player2.upgradeRegen();  Game.player2.coins -= p2RCost; Player.upgradesBought["playerTwoRegen"]++; AudioPlayer.play("upgrade");}
		if (this.player2UpgradeSpeed.subsistAsButton() && Game.player2.coins >= p2SCost) { Game.player2.upgradeSpeed();  Game.player2.coins -= p2SCost; Player.upgradesBought["playerTwoSpeed"]++; AudioPlayer.play("upgrade");}
		if (this.player2UpgradeJump.subsistAsButton() && Game.player2.coins >= p2JCost) { Game.player2.upgradeJump();  Game.player2.coins -= p2JCost; Player.upgradesBought["playerTwoJump"]++; AudioPlayer.play("upgrade");}

		//Display continue text
		Display.draw("continue", 1920/2, 1080/2 + 200, 456 * 5/8, 64 * 5/8);
		//Continue Button
		
		if (this.continue.subsistAsButton() && !AnimationPlayer.isPlaying("doorOpen")) {
			if (!this.glassBroken || this.maceBought) {
				AnimationPlayer.loadPack("doorOpen");
				AnimationPlayer.load("fadeOut");
				Player.retainedValues["p1Coins"] = Game.player1.coins;
				Player.retainedValues["p2Coins"] = Game.player2.coins;
				Player.retainedValues["p1Score"] = Game.player1.points;
				Player.retainedValues["p2Score"] = Game.player2.points;
			} else {
				AnimationPlayer.load("maceWarning");
			}
		} else if (AnimationPlayer.isPlaying("doorOpen")) {
			if (AnimationPlayer.getAnimation("doorOpen").frames < 60) {
				Display.draw("blackTile", 1920/2, 1080 - 288/2, 192, 288);
			} else {
				this.setScene("initGame");
			}	
		}

		//Coin transfer buttons
		if (this.redToBlue.subsistAsButton()) {
			if (Keyboard.shiftDown && Game.player1.coins >= 5) {
				AnimationPlayer.load("coinTossFromRed");
				Game.player1.coins -= 5;
				Game.player2.coins += 5;
			} else if (!Keyboard.shiftDown && Game.player1.coins > 0) {
				AnimationPlayer.load("coinTossFromRed");
				Game.player1.coins--;
				Game.player2.coins++;
			}
		}
		if (this.blueToRed.subsistAsButton()) {
			if (Keyboard.shiftDown && Game.player2.coins >= 5) {
				AnimationPlayer.load("coinTossFromBlue");
				Game.player2.coins -= 5;
				Game.player1.coins += 5;
			} else if (!Keyboard.shiftDown && Game.player2.coins > 0) {
				AnimationPlayer.load("coinTossFromBlue");
				Game.player2.coins--;
				Game.player1.coins++;
			}
		}
		//Display player identification text
		Display.drawText("Player 1", 420 - Display.getTextWidth("Player 1", 60)/2, 200, 60, true, "white");
		Display.drawText("Player 2", 1920 - (420 + Display.getTextWidth("Player 2", 60)/2), 200, 60, true, "white");
		
		//Display Player Balances
		Display.drawText(Game.player1.coins.toString(), 170 - Display.getTextWidth(Game.player1.coins.toString(), 60), 1080/2 - 105, 60);
		Display.draw("coin", 202, 1080/2 - 105 - 54 * 3/4 - 3, 54, 54);
		Display.drawText(Game.player2.coins.toString(), 1920 - 170 - Display.getTextWidth(Game.player2.coins.toString(), 60), 1080/2 - 105, 60);
		Display.draw("coin", 1920 - 138, 1080/2 - 105 - 54 * 3/4 - 3, 54, 54);
		//Draw the mace above the rest of the images
		if (!(this.mace.currentAnimation == "standing")) {
			this.mace.update();
			this.mace.draw();
		}
		Shop.#updateParticles();
	}
}