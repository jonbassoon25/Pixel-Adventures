//Loads All Image Assets
function loadAssets() {
	let foldersToLoad = {};
	let textures = {};
	//Assign folders to load
	foldersToLoad["util"] = ["placeholder"];
	foldersToLoad["buttons"] = ["buttonHovered", "buttonPressed"];

	//For every folder to load
	for (let currentFolderIndex = 0; currentFolderIndex < Object.keys(foldersToLoad).length; currentFolderIndex++) {
		//Assign the current folder name
		let currentFolder = Object.keys(foldersToLoad)[currentFolderIndex];
		//For every item in the current folder
		for (let currentItemIndex = 0; currentItemIndex < foldersToLoad[currentFolder].length; currentItemIndex++) {
			//Assign the current item
			let currentItem = foldersToLoad[currentFolder][currentItemIndex];
			console.log("/textures/" + currentFolder + "/" + currentItem + ".png");
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