//Client Imports
import { sendRequest } from "../client.js";

//SocketCommunicator Class
export class SocketCommunicator {
	/* sends data to server through the client.js sendRequest method */
	static send(name, data) {
		sendRequest(name, data);
	}
}