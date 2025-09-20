/*
Created by Jonathan Hanson and Zac Young

index.js

Server-side javascript hosting engine

Created: 11.4.23
*/

//------------------------------------------------------------------------------------//
//NPM Imports

const express = require('express');

const app = express();

const fs = require('fs');

const http = require('http').Server(app);

const io = require('socket.io')(http);

const path = require('path');

//------------------------------------------------------------------------------------//
//Local Imports

let leaderboard = require("./serverFiles/leaderboard.json");

let scenes = {
	"lastSaved": require("./serverFiles/lastSaved.json"),
	"Save_1": require("./serverFiles/Save_1.json"),
	"Save_2": require("./serverFiles/Save_2.json"),
	"Save_3": require("./serverFiles/Save_3.json"),
	"Save_4": require("./serverFiles/Save_4.json"),
	"Save_5": require("./serverFiles/Save_5.json"),
	"Save_6": require("./serverFiles/Save_6.json"),
	"Save_7": require("./serverFiles/Save_7.json"),
	"Save_8": require("./serverFiles/Save_8.json"),
	"Save_9": require("./serverFiles/Save_9.json"),
	"level1": require("./serverFiles/level1.json"),
	"level2": require("./serverFiles/level2.json"),
	"level3": require("./serverFiles/level3.json")
};

//------------------------------------------------------------------------------------//
//Variables


//------------------------------------------------------------------------------------//
//Functions

//deletes a array element at specified index
function del(array, index) {
	return array.splice(index, 1);
};

//returns a random integer between min and max (inclusive), if max is not defined then it is 0 - min
function randint(min, max = "none") {
	if (max === "none") {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Saves JSON data to selected file
function save(file, data) {
	let saveData = JSON.stringify(data);
	fs.writeFile("./serverFiles/" + file + ".json", saveData, (err) => {
		if (err) {
			console.log(err)
		}
	});
};

//Send a update to EVERYONE in the room, (socket io is stupid and doesn't send it to the client making the request)
function roomEmit(roomName, socket, event, data) {
	socket.to(roomName).emit(event, data);
	socket.emit(event, data);
};

//Sorts a number dictionary using a selection sort, element "order" is the sort order
function sort(dict) {
	if (dict["order"] != undefined) {
		delete dict["order"];
	}
	let sortedDict = {"order":[]};
	while (Object.keys(dict).length > 0) {
		let smallest = Object.keys(dict)[0];
		//console.log("smallest: " + smallest);
		for (let j = 0; j < Object.keys(dict).splice(1).length; j++) {
			let key = Object.keys(dict).splice(1)[j];
			//console.log(key);
			if (dict[key] < dict[smallest]) {
				smallest = key;
				//console.log("changed smallest to " + key);
			}
		}
		//console.log("pushing " + smallest + " to order");
		sortedDict["order"].push(smallest);
		sortedDict[smallest] = dict[smallest];
		delete dict[smallest];
	}
	sortedDict["order"].reverse();
	return sortedDict;
}

//------------------------------------------------------------------------------------//
//App Commands

//Mark clientFiles folder as static so it can be accessed by the client
app.use(express.static(path.join(__dirname, 'clientFiles')));

//Send user index.html when they load the url
app.get('/', function(req, res) {
	//__dirname is the name of the current directory
	res.sendFile(__dirname + '/clientFiles/index.html');
});

//------------------------------------------------------------------------------------//
//User event listener

//On a client connection
io.on('connection', (socket) => {
	//Print current connections
	connections = io.engine.clientsCount;
	console.log("\nConnected Users: " + connections.toString());

	socket.on("saveScene", (data) => {
		scenes[data[0]] = data[1];
		save(data[0], data[1]);
		save("lastSaved", data[1]);
		socket.emit("log", "Scene saved");
	});
	
	socket.on("loadScene", (name) => {
		socket.emit("scene", scenes[name]);
	});

	socket.on("getLeaderboard", () => {
		socket.emit("leaderboardUpdate", leaderboard);
	});

	socket.on("updateLeaderboard", (data) => {
		//Data formatted as name, score
		if (leaderboard[data[0]] == undefined || leaderboard[data[0]] < data[1]) {
			leaderboard[data[0]] = data[1];
			leaderboard = sort(leaderboard);
			save("leaderboard", leaderboard);
			io.emit("leaderboardUpdate", leaderboard);
		}
	});

	//When a user has disconnected
	socket.on('disconnect', () => {
		connections = io.engine.clientsCount;
		console.log("\nConnected Users: " + connections.toString());
	});
});

//------------------------------------------------------------------------------------//
//Host server on port 8000

http.listen(8000, () => {
	console.log('Server Started');
});

//Wait 5 seconds to tell the clients that the server died (allow for them to reconnect to the server)

setTimeout(() => {
	io.emit("error", "serverDied");
}, 5000);


//Every 10 seconds, diplay the current user count
setInterval(() => {
	connections = io.engine.clientsCount;
	console.log("\nConnected Users: " + connections.toString());
}, 10000);
