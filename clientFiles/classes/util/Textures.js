//Loads All Image Assets
function loadAssets() {
	let foldersToLoad = {};
	let textures = {};
	//Assign folders to load
	foldersToLoad["tiles"] = ["stoneBrick", "rottedWoodPlanks", "vines", "blueTile", "redTile", "blackTile"];
	foldersToLoad["util"] = ["placeholder", "crosshair"];
	foldersToLoad["buttons"] = ["buttonHovered", "buttonPressed"];
	foldersToLoad["shaders"] = ["shader_00", "shader_01", "shader_02", "shader_03", "shader_04", "shader_05", "shader_06", "shader_07", "shader_08", "shader_09", "shader_10", "shader_11", "shader_12", "shader_13", "shader_14", "shader_15", "shader_16", "shader_17", "shader_18", "shader_19", "shader_20"];

	console.log("Loading Textures:");
	//For every folder to load
	for (let currentFolderIndex = 0; currentFolderIndex < Object.keys(foldersToLoad).length; currentFolderIndex++) {
		//Assign the current folder name
		let currentFolder = Object.keys(foldersToLoad)[currentFolderIndex];
		//For every item in the current folder
		for (let currentItemIndex = 0; currentItemIndex < foldersToLoad[currentFolder].length; currentItemIndex++) {
			//Assign the current item
			let currentItem = foldersToLoad[currentFolder][currentItemIndex];
			console.log("\t/textures/" + currentFolder + "/" + currentItem + ".png");
			//Load the current item into textures as an image
			textures[currentItem] = new Image();
			textures[currentItem].src = "/textures/" + currentFolder + "/" + currentItem + ".png";
		}
	}
	return textures;
}

/** Dictionary of all game textures. Formatted as: {"name": img} */
let textures = loadAssets();

//Export textures
export { textures };