function loadAssets() {
	let foldersToLoad = {};
	let textures = {};
	//Assign folders to load
	foldersToLoad["util"] = ["placeholder"];
	foldersToLoad["buttons"] = ["buttonHovered", "buttonPressed"];

	//Load folders
	for (let currentFolderIndex = 0; currentFolderIndex < Object.keys(foldersToLoad).length; currentFolderIndex++) {
		let currentFolder = Object.keys(foldersToLoad)[currentFolderIndex];
		for (let currentItemIndex = 0; currentItemIndex < foldersToLoad[currentFolder].length; currentItemIndex++) {
			let currentItem = foldersToLoad[currentFolder][currentItemIndex];
			console.log("/textures/" + currentFolder + "/" + currentItem + ".png");

			textures[currentItem] = new Image();
			textures[currentItem].src = "/textures/" + currentFolder + "/" + currentItem + ".png";
		}
	}
	return textures;
}

let textures = loadAssets();

export { textures };