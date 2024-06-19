//Util Imports
import { Animation } from "./Animation.js";
import { Util } from "./Util.js";

//AnimationPlayer Class
export class AnimationPlayer {
    //Static Variables

    //Animation packs, played together
    static animationPacks = {
        "death": ["skull", "youDied", "grave1", "grave2", "clickToReturn"],
        "doorOpen": ["doorOpen", "doorEdge"]
    };
    
    //Currently playing animations
    static currentAnimations = [];

    //*********************************************************************//
	//Public Static Methods

    /** Removes all animations from the AnimationPlayer */
    static clear() {
        this.currentAnimations = [];
    }

    /**
     * Loads a new animation into the AnimationPlayer
     * @param {string} animationName - The name of the animation template to use
     * @param {boolean} loops - Should the animation loop? Default: false
     */
    static load(animationName, loops = false, underlay = false) {
        this.currentAnimations.push(new Animation(animationName, loops, underlay));
    }

    /**
     * Loads a new animation pack into the AnimationPlayer
     * @param {string} packName - The name of the animation template to use
     * @param {boolean} loops - Should the animation loop? Default: false
     */
    static loadPack(packName, loops = false, underlay = false) {
        for (let i = 0; i < this.animationPacks[packName].length; i++) {
            this.currentAnimations.push(new Animation(this.animationPacks[packName][i], loops, underlay));
        }
    }

    /** Removes all instances of an animation type in the AnimationPlayer */
    static remove(animationName) {
        for (let i = this.currentAnimations.length - 1; i >= 0; i--) {
            if (this.currentAnimations[i].name == animationName) {
                this.currentAnimations = Util.delIndex(this.currentAnimations, i)
            }
        }
    }

	/** Updates and Draws all loaded underlay animations in the AnimationPlayer */
	static playUnderlayAnimations() {
		for (let i = 0; i < this.currentAnimations.length; i++) {
			if (!this.currentAnimations[i].underlay) {
				continue;
			}
			if (!this.currentAnimations[i].update()) {
				this.currentAnimations = Util.delIndex(this.currentAnimations, i);
				i--;
			}
		}
	}

    /** Updates and Draws all loaded overlay animations in the AnimationPlayer */
    static playOverlayAnimations() {
        for (let i = 0; i < this.currentAnimations.length; i++) {
			if (this.currentAnimations[i].underlay) {
				continue;
			}
            if (!this.currentAnimations[i].update()) {
                this.currentAnimations = Util.delIndex(this.currentAnimations, i);
                i--;
            }
        }
    }

	/** Checks if an animation is playing */
	static isPlaying(animationName) {
		for (let i = 0; i < this.currentAnimations.length; i++) {
			if (this.currentAnimations[i]["name"] == animationName) return true;
		}
		return false;
	}

    /** Fetches the first instance of a currently playing animation */
    static getAnimation(animationName) {
        for (let i = 0; i < this.currentAnimations.length; i++) {
            if (this.currentAnimations[i]["name"] == animationName) return this.currentAnimations[i];
        }
        return null;
    }
}