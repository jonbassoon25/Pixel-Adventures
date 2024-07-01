//Util Imports
import { Util } from "../util/Util.js";
import { Keyframe } from "../util/Keyframe.js";

//UI Object Imports

//Gamestate Imports

//Game Object Imports

//Game Entity Imports

//Basic Object Imports
import { ShadedObject } from "../basicObjects/ShadedObject.js";
import { Display } from "../util/Display.js";

export class MovingTileSet extends ShadedObject {

    /*
    Notes:
        - stuff
    */

    //*********************************************************************//
    //Static Variables
    static movingTileSets = [];

    //*********************************************************************//
    //Private Static Methods - No required JSDocs


    //*********************************************************************//
    //Public Static Methods - Must Have JSDocs

    //*********************************************************************//
    //Constructor - Must have JSDocs
    //Movement types: await, reverse, autoRepeat, awaitRepeat
    constructor(image, x, y, width, height, length, direction, time = 120, movementType = "await") {
        //Outwards doesn't work yet. Also, CHANGING VWIDTH AND VHEIGHT WILL NOT ADJUST SHADING BOX. VIEW SCENE 125-136.
        //Collision starts bugging out with about a 1/20 ratio between length and time (average velocity of 1/20 tiles/frame).
        switch (direction) {
            case "up":
                y += (length - 1) * height;
                break;
            case "down":
                y -= (length - 1) * height;
                break;
            case "left":
                x += (length - 1) * height;
                break;
            case "right":
                x -= (length - 1) * height;
                break;
        }
        super(image, 4, x, y, width, height, true);
        this.time = time;
        this.triggered = false;
        this.currentFrame = (movementType == "reverse" || movementType == "toggle")? time : 0;
        this.direction = direction;
        this.maxLength = length;
        this.minLength = 0;
        this.movementType = movementType;
        this.frameIncrement = 1;
        //if (length/time >= 1/20) console.warn("Moving tile set too fast. Collision will no longer work.");
        if (this.movementType == "awaitRepeat") this.frameIncrement = 0;
        MovingTileSet.movingTileSets.push(this);
        switch (direction) {
            case "up":
            case "down":
                this.visualHeight *= length;
                break;
            case "left":
            case "right":
                this.visualWidth *= length;
                break;
        }
    }

    //*********************************************************************//
    //Public Static Methods - Must have JSDocs
    
    static clear() {
        for (let i = 0; i < this.movingTileSets.length; i++) {
            this.movingTileSets[i].delete();
        }
        this.movingTileSets = [];
    }
    
    static update() {
        for (let i = 0; i < this.movingTileSets.length; i++) {
            this.movingTileSets[i].update();
        }
    }
    
    //*********************************************************************//
    //Public Methods - Must have JSDocs
    draw() {
        switch (this.direction) {
            case "up":
                Display.drawSet(this.image, this.x, this.y - (Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal") * this.height * this.maxLength), this.width, this.height, this.length, this.direction);
                break;
            case "down":
                Display.drawSet(this.image, this.x, this.y + (Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal") * this.height * this.maxLength), this.width, this.height, this.length, this.direction);
                break;
            case "left":
                Display.drawSet(this.image, this.x - (Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal") * this.width * this.maxLength), this.y, this.width, this.height, this.length, this.direction);
                break;
             case "right":
                Display.drawSet(this.image, this.x + (Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal") * this.width * this.maxLength), this.y, this.width, this.height, this.length, this.direction);
                break;
        }
    }

    delete() {
        MovingTileSet.movingTileSets = Util.delValue(MovingTileSet.movingTileSets, this);
        super.delete();
    }

    trigger() {
        this.triggered = true;
    }
    
    update() {
        switch (this.movementType) {
            case "await":
                if (this.triggered) {
                    this.currentFrame += this.frameIncrement;
                }
                if (this.currentFrame >= this.time) this.delete();
                break;
            case "reverse":
                if (this.triggered && this.currentFrame >= 0) this.currentFrame -= this.frameIncrement;
                break;
            case "autoRepeat":
                this.currentFrame += this.frameIncrement;
                if (this.currentFrame >= this.time) {
                    this.frameIncrement = -1;
                } 
                if (this.currentFrame <= 0) this.frameIncrement = 1;
                break;
            case "awaitRepeat":
                console.log("awaitRepeat not finished");
                this.currentFrame += this.frameIncrement;
                if (this.currentFrame >= this.time) this.frameIncrement = -1;
                if (this.currentFrame <= 0) this.frameIncrement = 1;
                break;
            case "toggle":
                if (this.triggered && this.currentFrame > 0) this.currentFrame -= this.frameIncrement;
                if (this.triggered && this.currentFrame == 0) {
                    this.triggered = false;
                    this.movementType = "await";
                }
                break;
        }
        
    }

    //*********************************************************************//
    //Getters - No required JSDocs
    /*get center() {
        //Not tested since not used
        let value = (this.direction == "left" || this.direction == "up")? 1 - Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal") : Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal");
        let correction = (value * ((this.direction == "left" || this.direction == "right")? this.width : this.height) * this.maxLength)/2;
        let translated = [this.x + ((this.direction == "right")? correction : 0) - ((this.direction == "left")? correction : 0), this.y + ((this.direction == "down")? correction : 0) - ((this.direction == "up")? correction : 0)];
        console.log("Center: " + [(this.upperLeft[0] + this.upperRight[0])/2, (this.upperLeft[1] + this.bottomLeft[1])/2]);
        return translated;
    }*/

    get upperLeft() {
        let correction = ((this.direction == "left")? this.width : this.height) * (this.maxLength - 1);
        let translated = [this.x - this.width/2 - ((this.direction == "left")? correction : 0), this.y - this.height/2 - ((this.direction == "up")? correction : 0)];
        if (this.direction == "right" || this.direction == "down") {
            let value = 1 - Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal");
            //Perform a weighted average in order to calculate the real coordinates as the tileSet moves
            return [(this.direction == "right")? (translated[0] * value) + (this.upperRight[0] * (1 - value)) : translated[0], (this.direction == "down")? (translated[1] * value) + (this.bottomLeft[1] * (1 - value)) : translated[1]];
        }
        return translated;
    }

    get upperRight() {
        let correction = ((this.direction == "right")? this.width : this.height) * (this.maxLength - 1);
        let translated = [this.x + this.width/2 + ((this.direction == "right")? correction : 0), this.y - this.height/2 - ((this.direction == "up")? correction : 0)];
        if (this.direction == "left" || this.direction == "down") {
            let value = 1 - Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal");
            //Perform a weighted average in order to calculate the real coordinates as the tileSet moves
            return [(this.direction == "left")? (translated[0] * value) + (this.upperLeft[0] * (1 - value)) : translated[0], (this.direction == "down")? (translated[1] * value) + (this.bottomRight[1] * (1 - value)) : translated[1]];
        }
        return translated;
    }

    get bottomLeft() {
        let correction = ((this.direction == "left")? this.width : this.height) * (this.maxLength - 1);
        let translated = [this.x - this.width/2 - ((this.direction == "left")? correction : 0), this.y + this.height/2 + ((this.direction == "down")? correction : 0)];
        if (this.direction == "right" || this.direction == "up") {
            let value = 1 - Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal");
            //Perform a weighted average in order to calculate the real coordinates as the tileSet moves
            return [(this.direction == "right")? (translated[0] * value) + (this.bottomRight[0] * (1 - value)) : translated[0], (this.direction == "up")? (translated[1] * value) + (this.upperLeft[1] * (1 - value)) : translated[1]];
        }
        return translated;
    }

    get bottomRight() {
        let correction = ((this.direction == "right")? this.width : this.height) * (this.maxLength - 1);
        let translated = [this.x + this.width/2 + ((this.direction == "right")? correction : 0), this.y + this.height/2 + ((this.direction == "down")? correction : 0)];
        if (this.direction == "left" || this.direction == "up") {
            let value = 1 - Keyframe.getRawValue(this.currentFrame / this.time, "sinusoidal");
            //Perform a weighted average in order to calculate the real coordinates as the tileSet moves
            return [(this.direction == "left")? (translated[0] * value) + (this.bottomLeft[0] * (1 - value)) : translated[0], (this.direction == "up")? (translated[1] * value) + (this.upperRight[1] * (1 - value)) : translated[1]];
        }
        return translated;
    }

    get realX() {
        //console.log("real x: " + ((this.bottomLeft[0] + this.bottomRight[0])/2));
        return (this.bottomLeft[0] + this.bottomRight[0])/2;
    }

    get realY() {
        //console.log("real y: " + ((this.upperLeft[1] + this.bottomLeft[1])/2));
        return (this.upperLeft[1] + this.bottomLeft[1])/2;
    }

    get realWidth() {
        //console.log("real width: " + (this.bottomRight[0] - this.bottomLeft[0]));
        return (this.bottomRight[0] - this.bottomLeft[0]);
    }

    get realHeight() {
        //console.log("real height: " + (this.bottomLeft[1] - this.upperLeft[1]));
        return (this.bottomLeft[1] - this.upperLeft[1]);
    }

    get length() {
        return this.maxLength * Keyframe.getRawValue((this.time - this.currentFrame) / this.time, "sinusoidal");
    }

    get currentVelocity() {
        if (this.currentFrame == 0 || this.currentFrame == this.time) return [0, 0];
        if (this.direction == "left") {
            return [-this.frameIncrement * this.maxLength * this.width * Keyframe.getRawValue((this.time - this.currentFrame) / this.time, "sinusoidalDerivative")/(this.time), 0];
            //return [-this.frameIncrement * Math.PI * this.maxLength * this.width * Math.sin(Math.PI * (this.time - this.currentFrame) / this.time)/(2 * this.time), 0];
        }
        if (this.direction == "right") {
            return [this.frameIncrement * this.maxLength * this.width * Keyframe.getRawValue((this.time - this.currentFrame) / this.time, "sinusoidalDerivative")/(this.time), 0];
            //return [this.frameIncrement * Math.PI * this.maxLength * this.width * Math.sin(Math.PI * (this.time - this.currentFrame) / this.time)/(2 * this.time), 0];
        }
        if (this.direction == "up") {
            return [0, -this.frameIncrement * this.maxLength * this.width * Keyframe.getRawValue((this.time - this.currentFrame) / this.time, "sinusoidalDerivative")/(this.time)];
            //return [0, -this.frameIncrement * this.frameIncrement * Math.PI * this.maxLength * this.width * Math.sin(Math.PI * (this.time - this.currentFrame) / this.time)/(2 * this.time)];
        }
        if (this.direction == "down") {
            return [0, this.frameIncrement * this.maxLength * this.width * Keyframe.getRawValue((this.time - this.currentFrame) / this.time, "sinusoidalDerivative")/(this.time)];
            //return [0, this.frameIncrement * this.frameIncrement * Math.PI * this.maxLength * this.width * Math.sin(Math.PI * (this.time - this.currentFrame) / this.time)/(2 * this.time)];
        }
    }
    //*********************************************************************//
    //Setters - Must have JSDocs
}