//Loads All Image Assets
function loadAssets() {
	let foldersToLoad = {};
	let textures = {};
	//Assign folders to load
	foldersToLoad["shaders"] = ["shader_black"];
	
	foldersToLoad["tiles"] = ["stoneBrick", "rottedWoodPlanks", "vines", "blueTile", "redTile", "blackTile", "insetLantern", "chest", "chestOpened", "wood", "door"];
	foldersToLoad["menu"] = ["mainMenuPanoTinted", "plaque", "banner", "stoneBrickBackground", "woodenPlaque", "leaderboardPlaque", "upgradePlaque", "selectionBox"];
	foldersToLoad["buttons"] = ["buttonHovered", "buttonPressed", "playButton", "back", "cog", "leaderboard", "upgradeJump", "upgradeMaxHealth", "upgradeRegen", "upgradeSpeed", "upgradeWeapon", "continue", "easy", "medium", "hard", "custom", "sliderFrame", "sliderHandle", "saveScore", "textBox", "escape", "musicEnabled", "musicDisabled", "plus", "minus", "help"];
	foldersToLoad["util"] = ["placeholder", "crosshair", "visualDimensions"];
	foldersToLoad["player"] = ["bluePlayer", "bluePlayerJump", "bluePlayerWalk", "blueGhost", "blueGhostAlt", "redPlayer", "redPlayerJump", "redPlayerWalk", "redGhost", "redGhostAlt", "redGrave", "blueGrave"];
	foldersToLoad["player/flipped"] = ["blueGhostAltFlipped", "blueGhostFlipped", "bluePlayerFlipped", "bluePlayerJumpFlipped", "bluePlayerWalkFlipped", "redGhostAltFlipped", "redGhostFlipped", "redPlayerFlipped", "redPlayerJumpFlipped", "redPlayerWalkFlipped"];
	foldersToLoad["items"] = ["coin", "educationShard", "progressShard", "serviceShard", "fbla", "shard1", "shard2", "shard3"];
	foldersToLoad["weapons/sword"] = ["sword+0", "sword+15", "sword+30", "sword+45", "sword+60", "sword+75", "sword+90", "sword-90", "sword+0Flipped", "sword+15Flipped", "sword+30Flipped", "sword+45Flipped", "sword+60Flipped", "sword+75Flipped", "sword+90Flipped", "sword-90Flipped"];
	foldersToLoad["monsters"] = ["slime", "skeleton", "skeletonFlipped", "skeletonWalk", "skeletonWalkFlipped", "skeletonJump", "skeletonJumpFlipped"];
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
