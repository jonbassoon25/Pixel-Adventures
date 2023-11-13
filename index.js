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



//------------------------------------------------------------------------------------//
//Variables


//------------------------------------------------------------------------------------//
//Functions

//deletes a array element at specified index
function del(array, index){
	return array.splice(index, 1);
};

//returns a random integer between min and max (inclusive), if max is not defined then it is 0 - min
function randint(min, max = "none"){
	if (max === "none"){
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Saves JSON data to selected file
function save(data, file){
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


//------------------------------------------------------------------------------------//
//App Commands

//Mark clientFiles folder as static so it can be accessed by the client
app.use(express.static(path.join(__dirname, 'clientFiles')));

//Send user index.html when they load the url
app.get('/', function(req, res){
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
