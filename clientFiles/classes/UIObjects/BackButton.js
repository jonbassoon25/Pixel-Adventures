//UIObject Imports
import { Button } from "./Button.js";

//BackButton Class
export class BackButton extends Button {
	//Constructor
	constructor(x, y, destination = "initMenu") {
		super("back", x, y, 200, 100);
		this.destination = destination;
	}
}