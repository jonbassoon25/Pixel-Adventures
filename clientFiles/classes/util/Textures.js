//Loads All Image Assets
function loadAssets() {
	let foldersToLoad = {};
	let textures = {};
	//Assign folders to load
	foldersToLoad["shaders"] = ["shader_black"];
	foldersToLoad["decorations"] = ["bannerWhite", "bannerWhiteFBLA", "chairLeft", "chairRight", "plant1", "plant2", "woodenTable", "bookshelf", "sunset", "skull"];
	foldersToLoad["tiles"] = ["stoneBrick", "rottedWoodPlanks", "blueTile", "redTile", "blackTile", "insetLantern", "wood", "dirt"];
	foldersToLoad["menu"] = ["mainMenuPanoTinted", "plaque", "banner", "stoneBrickBackground", "woodenPlaque", "leaderboardPlaque", "upgradePlaque", "selectionBox", "settings", "flasher1", "flasher2", "buttonPlaque", "transferCoins", "glassPane", "priceTag", "maceWarning", "congratulations", "youDied"];
	foldersToLoad["buttons"] = ["buttonHovered", "buttonPressed", "playButton", "back", "cog", "leaderboard", "upgradeJump", "upgradeMaxHealth", "upgradeRegen", "upgradeSpeed", "upgradeWeapon", "upgradeSword", "upgradeMace", "continue", "easy", "medium", "hard", "custom", "sliderFrame", "sliderHandle", "saveScore", "textBox", "escape", "musicEnabled", "musicDisabled", "plus", "minus", "help", "redToBlue", "blueToRed", "clickToReturn"];
	foldersToLoad["util"] = ["placeholder", "crosshair", "visualDimensions", "painting"];
	foldersToLoad["player"] = ["bluePlayer", "bluePlayerJump", "bluePlayerWalk", "blueGhost", "blueGhostAlt", "redPlayer", "redPlayerJump", "redPlayerWalk", "redGhost", "redGhostAlt", "redGrave", "blueGrave"];
	foldersToLoad["player/maceAttack"] = ["bluePlayerAttack1", "bluePlayerAttack2", "bluePlayerAttack3", "bluePlayerAttack4", "redPlayerAttack1", "redPlayerAttack2", "redPlayerAttack3", "redPlayerAttack4"];
	foldersToLoad["player/maceCharge"] = ["bluePlayerCharge1", "bluePlayerCharge2", "bluePlayerCharge3", "redPlayerCharge1", "redPlayerCharge2", "redPlayerCharge3"];
	foldersToLoad["player/maceReturn"] = ["bluePlayerReturn1", "bluePlayerReturn2", "bluePlayerReturn3", "redPlayerReturn1", "redPlayerReturn2", "redPlayerReturn3"];
	foldersToLoad["items"] = ["coin", "educationShard", "progressShard", "serviceShard", "fbla", "shard1", "shard2", "shard3"];
	foldersToLoad["weapons/melee"] = ["sword", "mace"];
	foldersToLoad["monsters"] = ["slime", "skeleton", "skeletonWalk", "skeletonJump"];
	foldersToLoad["particles"] = ["sparkYellow", "sparkOrange", "sparkRed", "death", "glass"];
	foldersToLoad["specialCharacters"] = ["centCharacter"];
	foldersToLoad["gameObjects"] = ["chest", "chestOpened", "door", "chestAlt", "chestOpenedAlt", "doorAlt", "doorEdge"];
	foldersToLoad["decorations/vineSets"] = ["plainVineSet1", "plainVineSet2", "flowerVineSet1", "flowerVineSet2", "fruitVineSet1", "fruitVineSet2"];
	console.log("Loading Textures...");
	//For every folder to load
	for (let currentFolderIndex = 0; currentFolderIndex < Object.keys(foldersToLoad).length; currentFolderIndex++) {
		//Assign the current folder name
		let currentFolder = Object.keys(foldersToLoad)[currentFolderIndex];
		//For every item in the current folder
		for (let currentItemIndex = 0; currentItemIndex < foldersToLoad[currentFolder].length; currentItemIndex++) {
			//Assign the current item
			let currentItem = foldersToLoad[currentFolder][currentItemIndex];
			//console.log("\t/textures/" + currentFolder + "/" + currentItem + ".png");
			//Load the current item into textures as an image
			textures[currentItem] = new Image();
			textures[currentItem].src = "/textures/" + currentFolder + "/" + currentItem + ".png";
		}
		//if the current folder is for shader, assign all 100 shader images
		/*
		if (currentFolder == "shaders") {
			for (let i = 0; i <= 100; i++) {
				let name = "shader_";
				if (i < 10) {
					name += "00" + i.toString();
				} else if (i == 100) {
					name += i.toString();
				} else {
					name += "0" + i.toString();
				}

				console.log("creating " + name);
				textures[name] = new Image();
				textures[name].src = "/textures/shaders/shader_black.png";
				textures[name].style.opacity = (i / 100).toString();
				console.log(textures[name]);
				
			}
		}
		*/
	}
	console.log("done");
	return textures;
}
/** Dictionary of all game textures. Formatted as: {"name": img} */
let textures;

document.addEventListener("readystatechange", () => {
	textures = loadAssets();;
	document.dispatchEvent(new Event("texturesLoaded"));
});

//Export textures
export { textures };
