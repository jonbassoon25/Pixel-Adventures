//Util Imports
import { Display } from "../util/Display.js";
import { Difficulty } from "../util/Difficulty.js";
import { AudioPlayer } from "../util/AudioPlayer.js";

//UI Object Imports
import { Button } from "../UIObjects/Button.js";

//Gamestate Imports
import { Gamestate } from "./Gamestate.js";
import { Game } from "./Game.js";

//Game Object Imports

//Game Entity Imports
import { Player } from "../gameEntities/Player.js";

//Template Class
export class Shop extends Gamestate {
	//Static Variables

	//Player 1 Upgrades
	static player1UpgradeWeapon = new Button("upgradeWeapon", 1920/4 - 30, 1080/2 - 300 + 40, 408, 96);
	static player1UpgradeHealth = new Button("upgradeMaxHealth", 1920/4 - 30, 1080/2 - 150 + 40, 408, 96);
	static player1UpgradeRegen = new Button("upgradeRegen", 1920/4 - 30, 1080/2 + 0 + 40, 408, 96);
	static player1UpgradeSpeed = new Button("upgradeSpeed", 1920/4 - 30, 1080/2 + 150 + 40, 408, 96);
	static player1UpgradeJump = new Button("upgradeJump", 1920/4 - 30, 1080/2 + 300 + 40, 408, 96);

	//Player 2 Upgrades
	static player2UpgradeWeapon = new Button("upgradeWeapon", 1920/4 * 3 + 30, 1080/2 - 300 + 40, 408, 96);
	static player2UpgradeHealth = new Button("upgradeMaxHealth", 1920/4 * 3 + 30, 1080/2 - 150 + 40, 408, 96);
	static player2UpgradeRegen = new Button("upgradeRegen", 1920/4 * 3 + 30, 1080/2 + 0 + 40, 408, 96);
	static player2UpgradeSpeed = new Button("upgradeSpeed", 1920/4 * 3 + 30, 1080/2 + 150 + 40, 408, 96);
	static player2UpgradeJump = new Button("upgradeJump", 1920/4 * 3 + 30, 1080/2 + 300 + 40, 408, 96);

	//Continue Button
	
	static continue = new Button("continue", 1920/2, 1080/2, 456 * 3/4, 64 * 3/4);

	//*********************************************************************//
	//Public Static Methods - Must Have JSDocs
	
	static init() {
		super.init();
		this.setScene("shop");
	}

	static update() {
		//Display Shop Background, player icons, and plaques
		Display.draw("stoneBrickBackground", 1920/2, 1080/2, 1920, 1080);
		Display.draw("upgradePlaque", 420, 1080/2, 702, 1026);
		Display.draw("upgradePlaque", 1920-420, 1080/2, 702, 1026);
		Display.draw("redPlayer", 1920/2 - 800, 1080/2, 240, 240);
		Display.draw("bluePlayerFlipped", 1920/2 + 800, 1080/2, 240, 240);

		let p1WCost = Math.round((6 + Player.upgradesBought["playerOneWeapon"] * 4) * Difficulty.priceMult);
		let p2WCost = Math.round((6 + Player.upgradesBought["playerTwoWeapon"] * 4) * Difficulty.priceMult);
		let p1HCost = Math.round((6 + Player.upgradesBought["playerOneHealth"] * 4) * Difficulty.priceMult);
		let p2HCost = Math.round((6 + Player.upgradesBought["playerTwoHealth"] * 4) * Difficulty.priceMult);
		let p1RCost = Math.round((6 + Player.upgradesBought["playerOneRegen"] * 4) * Difficulty.priceMult);
		let p2RCost = Math.round((6 + Player.upgradesBought["playerTwoRegen"] * 4) * Difficulty.priceMult);
		let p1SCost = Math.round((6 + Player.upgradesBought["playerOneSpeed"] * 4) * Difficulty.priceMult);
		let p2SCost = Math.round((6 + Player.upgradesBought["playerTwoSpeed"] * 4) * Difficulty.priceMult);
		let p1JCost = Math.round((6 + Player.upgradesBought["playerOneJump"] * 4) * Difficulty.priceMult);
		let p2JCost = Math.round((6 + Player.upgradesBought["playerTwoJump"] * 4) * Difficulty.priceMult);

		//Update Shop Buttons and price displays for Player 1
		this.player1UpgradeWeapon.update();
		Display.drawText(p1WCost.toString() + "￠", 1920/4 - 45 + 260, 1080/2 - 300 + 70, 40, true, "white");
		this.player1UpgradeHealth.update();
		Display.drawText(p1HCost.toString() + "￠", 1920/4 - 45 + 260, 1080/2 - 150 + 70, 40, true, "white");
		this.player1UpgradeRegen.update();
		Display.drawText(p1RCost.toString() + "￠", 1920/4 - 45 + 260, 1080/2 + 0 + 70, 40, true, "white");
		this.player1UpgradeSpeed.update();
		Display.drawText(p1SCost.toString() + "￠", 1920/4 - 45 + 260, 1080/2 + 150 + 70, 40, true, "white");
		this.player1UpgradeJump.update();
		Display.drawText(p1JCost.toString() + "￠", 1920/4 - 45 + 260, 1080/2 + 300 + 70, 40, true, "white");

		//Update Shop Buttons and price displays for Player 2
		this.player2UpgradeWeapon.update();
		Display.drawText(p2WCost + "￠", 1920/4 * 3 + 30 - 260 - p2WCost.toString().length * 40 * 0.55, 1080/2 - 300 + 70, 40, true, "white");
		this.player2UpgradeHealth.update();
		Display.drawText(p2HCost + "￠", 1920/4 * 3 + 30 - 260 - p2HCost.toString().length * 40 * 0.55, 1080/2 - 150 + 70, 40, true, "white");
		this.player2UpgradeRegen.update();
		Display.drawText(p2RCost + "￠", 1920/4 * 3 + 30 - 260 - p2RCost.toString().length * 40 * 0.55, 1080/2 + 0 + 70, 40, true, "white");
		this.player2UpgradeSpeed.update();
		Display.drawText(p2SCost + "￠", 1920/4 * 3 + 30 - 260 - p2SCost.toString().length * 40 * 0.55, 1080/2 + 150 + 70, 40, true, "white");
		this.player2UpgradeJump.update();
		Display.drawText(p2JCost + "￠", 1920/4 * 3 + 30 - 260 - p2JCost.toString().length * 40 * 0.55, 1080/2 + 300 + 70, 40, true, "white");

		this.continue.update();
		//Detect upgrade button presses and upgrade selected
		//Player 1
		if (this.player1UpgradeWeapon.isReleased() && Game.player1.coins >= p1WCost) { Game.player1.upgradeWeapon(); Game.player1.coins -= p1WCost; Player.upgradesBought["playerOneWeapon"]++; AudioPlayer.play("upgrade");}
		if (this.player1UpgradeHealth.isReleased() && Game.player1.coins >= p1HCost) { Game.player1.upgradeHealth(); Game.player1.coins -= p1HCost; Player.upgradesBought["playerOneHealth"]++; AudioPlayer.play("upgrade");}
		if (this.player1UpgradeRegen.isReleased() && Game.player1.coins >= p1RCost) { Game.player1.upgradeRegen(); Game.player1.coins -= p1RCost; Player.upgradesBought["playerOneRegen"]++; AudioPlayer.play("upgrade");}
		if (this.player1UpgradeSpeed.isReleased() && Game.player1.coins >= p1SCost) { Game.player1.upgradeSpeed(); Game.player1.coins -= p1SCost; Player.upgradesBought["playerOneSpeed"]++; AudioPlayer.play("upgrade");}
		if (this.player1UpgradeJump.isReleased() && Game.player1.coins >= p1JCost) { Game.player1.upgradeJump(); Game.player1.coins -= p1JCost;Player.upgradesBought["playerOneJump"]++; AudioPlayer.play("upgrade");}

		//Player 2
		if (this.player2UpgradeWeapon.isReleased() && Game.player2.coins >= p2WCost) { Game.player2.upgradeWeapon();  Game.player2.coins -= p2WCost; Player.upgradesBought["playerTwoWeapon"]++; AudioPlayer.play("upgrade");}
		if (this.player2UpgradeHealth.isReleased() && Game.player2.coins >= p2HCost) { Game.player2.upgradeHealth();  Game.player2.coins -= p2HCost; Player.upgradesBought["playerTwoHealth"]++; AudioPlayer.play("upgrade");}
		if (this.player2UpgradeRegen.isReleased() && Game.player2.coins >= p2RCost) { Game.player2.upgradeRegen();  Game.player2.coins -= p2RCost;Player.upgradesBought["playerTwoRegen"]++; AudioPlayer.play("upgrade");}
		if (this.player2UpgradeSpeed.isReleased() && Game.player2.coins >= p2SCost) { Game.player2.upgradeSpeed();  Game.player2.coins -= p2SCost; Player.upgradesBought["playerTwoSpeed"]++; AudioPlayer.play("upgrade");}
		if (this.player2UpgradeJump.isReleased() && Game.player2.coins >= p2JCost) { Game.player2.upgradeJump();  Game.player2.coins -= p2JCost; Player.upgradesBought["playerTwoJump"]++; AudioPlayer.play("upgrade");}

		if (this.continue.isReleased()) this.setScene("initGame");

		//Display Player Balances
		Display.drawText("Player 1 Coins: " + Game.player1.coins.toString(), 240, 220, 40, true, "white");
		Display.drawText("Player 2 Coins: " + Game.player2.coins.toString(), 1920 - ("Player 2 Coins: " + Game.player2.coins.toString()).length * 40 * 0.55 - 240, 220, 40, true, "white");
	}
}