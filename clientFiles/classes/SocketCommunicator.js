import { sendRequest } from "../client.js";

//Class SocketCommunicator
export class SocketCommunicator {
	/* sends data to server through the client.js sendRequest method */
	static send(name, data) {
		sendRequest(name, data);
	}
}