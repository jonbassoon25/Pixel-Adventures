//Util Imports
import { Keyframe } from "./Keyframe.js";
import { textures } from "./Textures.js";

//Animation Class
export class Animation {
    //Static Variables

	static compiled = false;

    //Templates formatted as {"name": keyframe properties dictionary}
    static templates = {
		"dictTest": [ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
			{
				"image": "redPlayer",
			 	"initialPosition": [50, 50],
			 	"finalPosition": [100, 500],
			 	"initialDimensions": [0,0],
			 	"finalDimensions": [500, 500],
			 	"frames": 120,
			 	"transitionType": "sinusoidal"
			},
			{
				"finalPosition": [50, 50], 
				"finalDimensions": [0, 0]
			}
		],
		"pano": [ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
			{
				"image": "mainMenuPanoTinted",
			 	"initialPosition": [1920/2, textures["mainMenuPanoTinted"].height/2],
			 	"initialDimensions": [textures["mainMenuPanoTinted"].width, textures["mainMenuPanoTinted"].height],
			 	"frames": 120,
			 	"transitionType": "linear"
			},
			{
				"finalPosition": [1920/2, 30],
				"frames": 2100,
				"transitionType": "sinusoidal"
			},
		],
		"fadeOut": [
			{
				"image": "shader_00", "initialPosition": [1920/2, 1080/2], "initialDimensions": [1920, 1080], "frames": 4
			},
			{"image": "shader_01"}, {"image": "shader_02"}, {"image": "shader_03"}, {"image": "shader_04"},
			{"image": "shader_05"}, {"image": "shader_06"}, {"image": "shader_07"}, {"image": "shader_08"},
			{"image": "shader_09"}, {"image": "shader_10"}, {"image": "shader_11"}, {"image": "shader_12"},
			{"image": "shader_13"}, {"image": "shader_14"}, {"image": "shader_15"}, {"image": "shader_16"},
			{"image": "shader_17"}, {"image": "shader_18"}, {"image": "shader_19"}, {"image": "shader_20"}
		], 
		"fadeIn": [
			{
				"image": "shader_20", "initialPosition": [1920/2, 1080/2], "initialDimensions": [1920, 1080], "frames": 4
			},
			{"image": "shader_19"}, {"image": "shader_18"}, {"image": "shader_17"}, {"image": "shader_16"},
			{"image": "shader_15"}, {"image": "shader_14"}, {"image": "shader_13"}, {"image": "shader_12"},
			{"image": "shader_11"}, {"image": "shader_10"}, {"image": "shader_09"}, {"image": "shader_08"},
			{"image": "shader_07"}, {"image": "shader_06"}, {"image": "shader_05"}, {"image": "shader_04"},
			{"image": "shader_03"}, {"image": "shader_02"}, {"image": "shader_01"}, {"image": "shader_00"}
		]
    };

	static compileTemplates() {
		for (let i = 0; i < Object.keys(this.templates).length; i++) {
			let currentTemplate = this.templates[Object.keys(this.templates)[i]];
			for (let j = 0; j < currentTemplate.length; j++) {
				let currentKeyframe = currentTemplate[j];
				let previousKeyframe;
				if (j == 0) {
					if (currentKeyframe["image"] == undefined) {
						console.error("No Initial Image in Animation Template.\n\t" + Object.keys(this.templates)[i]);
						continue;
					}
					if (currentKeyframe["finalPosition"] == undefined) {
						currentKeyframe["finalPosition"] = currentKeyframe["initialPosition"];
					}
					if (currentKeyframe["initialPosition"] == undefined) {
						console.error("No Initial Position in Animation Template.\n\t" + Object.keys(this.templates)[i]);
						continue;
					}
					if (currentKeyframe["initialDimensions"] == undefined) {
						console.error("No Initial Dimensions in Animation Template.\n\t" + Object.keys(this.templates)[i]);
						continue;
					}
					if (currentKeyframe["finalDimensions"] == undefined) {
						currentKeyframe["finalDimensions"] = currentKeyframe["initialDimensions"];
					}
					if (currentKeyframe["transitionType"] == undefined) {
						currentKeyframe["transitionType"] = "linear";	
					}
					if (currentKeyframe["startFrame"] == undefined) {
						currentKeyframe["startFrame"] = 0;
					}
				} else {
					previousKeyframe = currentTemplate[j - 1];
					if (currentKeyframe["image"] == undefined) {
						currentKeyframe["image"] = previousKeyframe.image;
					}
					if (currentKeyframe["initialPosition"] == undefined) {
						currentKeyframe["initialPosition"] = previousKeyframe.finalPosition;
					}
					if (currentKeyframe["finalPosition"] == undefined) {
						currentKeyframe["finalPosition"] = currentKeyframe.initialPosition;
					}
					if (currentKeyframe["initialDimensions"] == undefined) {
						currentKeyframe["initialDimensions"] = previousKeyframe.finalDimensions;
					}
					if (currentKeyframe["finalDimensions"] == undefined) {
						currentKeyframe["finalDimensions"] = currentKeyframe.initialDimensions;
					}
					if (currentKeyframe["transitionType"] == undefined) {
						currentKeyframe["transitionType"] = previousKeyframe.transitionType;	
					}
					if (currentKeyframe["frames"] == undefined) {
						currentKeyframe["frames"] = previousKeyframe.endFrame - previousKeyframe.startFrame;
					}
					if (currentKeyframe["startFrame"] == undefined) {
						currentKeyframe["startFrame"] = previousKeyframe.endFrame;
					}
				}

				if (currentKeyframe["endFrame"] == undefined && currentKeyframe["frames"] == undefined) {
					console.error("No Frames in Animation Template.\n\t" + Object.keys(this.templates)[i]);
					continue;
				} else if (currentKeyframe["endFrame"] == undefined) {
					currentKeyframe["endFrame"] = currentKeyframe["startFrame"] + currentKeyframe["frames"];
				}
				
				this.templates[Object.keys(this.templates)[i]][j] = new Keyframe(currentKeyframe["image"], currentKeyframe["initialPosition"], currentKeyframe["finalPosition"], currentKeyframe["initialDimensions"], currentKeyframe["finalDimensions"], currentKeyframe["startFrame"], currentKeyframe["endFrame"], currentKeyframe["transitionType"]);
			}
		}
		this.compiled = true;
	}

    //*********************************************************************//
    //Constructor

    /**
     * @param {string} animationName - Name of the animation template to use
     * @param {boolean} loops - Should this animation loop indefinitly? Default: false
     */
    constructor(animationName, loops = false, underlay = false) {
        if (Animation.templates[animationName] == undefined) {
            console.error("Animation Template Not Found: " + animationName);
            animationName = "none";
        }
        this.name = animationName;
        this.keyframes = Animation.templates[animationName];
        this.frames = 0;
        this.loops = loops;
		this.underlay = underlay;
    }

    //*********************************************************************//
	//Public Methods

    /** 
     * Updates and Draws this Animation 
     * @returns {boolean} Did the frame update successfully
    */
    update() {
        for (let i = 0; i < this.keyframes.length; i++) {
            let keyframe = this.keyframes[i];
            if (keyframe.startFrame <= this.frames && keyframe.endFrame >= this.frames) {
                keyframe.draw(this.frames);
                this.frames++;
                return true;
            }
        }
        //No frame was drawn, return false unless this animation loops, in which case reset frames and call update() again
        //Don't let frames be equal to zero because that can cause stack overflow errors
        if (this.loops && this.frames != 0) {
            this.frames = 0;
            return this.update();
        }
        return false;
    }
}