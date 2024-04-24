//Util Imports
import { Keyframe } from "./Keyframe.js";

//Animation Class
export class Animation {
    //Static Variables

	static compiled = false;

    //Templates formatted as {"name": keyframe properties dictionary}
    static templates = {
		"pano": [ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
			{
				"image": "mainMenuPanoTinted",
			 	"initialPosition": [1920/2, 7980/2],
			 	"initialDimensions": [1920, 7980],
			 	"frames": 120,
			 	"transitionType": "linear"
			},
			{
				"finalPosition": [1920/2, 30],
				"frames": 1050,
				"transitionType": "sinusoidal"
			},
		],
		"menuFadeIn": [
			{
				"image": "shader_20", "initialPosition": [1920/2, 1080/2], "initialDimensions": [1920, 1080], "frames": 90
			},
			{"image": "shader_19", "frames": 4}, {"image": "shader_18"}, {"image": "shader_17"}, {"image": "shader_16"},
			{"image": "shader_15"}, {"image": "shader_14"}, {"image": "shader_13"}, {"image": "shader_12"},
			{"image": "shader_11"}, {"image": "shader_10"}, {"image": "shader_09"}, {"image": "shader_08"},
			{"image": "shader_07"}, {"image": "shader_06"}, {"image": "shader_05"}, {"image": "shader_04"},
			{"image": "shader_03"}, {"image": "shader_02"}, {"image": "shader_01"}, {"image": "shader_00"}
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
		"level1Shard": [
			{
				"image": "educationShard", 
				"initialPosition": [1920/2, 1080/2], 
				"initialDimensions": [0, 0], 
				"frames": 0
			},
			{"finalDimensions": [540, 480], "frames": 30}  //Initial position needs to be changed in order to center the shard
		],
		"educationShard": [
			{
				"image": "educationShard", 
				"initialPosition": [1920/2 - 120 + 15, 1080/2 - 30], 
				"initialDimensions": [0, 0], "frames": 0, 
				"transitionType": "sinusoidal"
			},
			{"finalDimensions": [363, 462], "frames": 30},
			{"finalDimensions": [330, 420], "frames": 15},
			{"frames": 60}
		],
		"progressShard": [
			{
				"image": "progressShard", 
				"initialPosition": [1920/2, 1080/2 + 180 - 45], 
				"initialDimensions": [0, 0], 
				"frames": 0,
				"transitionType": "sinusoidal"
			},
			{"frames": 30},
			{"finalDimensions": [528, 231], "frames": 30},
			{"finalDimensions": [480, 210], "frames": 15},
			{"frames": 30}
		],
		"serviceShard": [
			{
				"image": "serviceShard", 
				"initialPosition": [1920/2 + 120 + 15, 1080/2 - 30], 
				"initialDimensions": [0, 0], 
				"frames": 0,
				"transitionType": "sinusoidal"
			},
			{"frames": 60},
			{"finalDimensions": [297, 462], "frames": 30},
			{"finalDimensions": [270, 420], "frames": 15}
		],
		"redHelp": [
			{
				"image": "redPlayer", 
				"initialPosition": [1920/2 - 450, 1080/2],
				"finalPosition": [1920/2, 1080/2],
				"initialDimensions": [600, 600],
				"frames": 60,
				"transitionType": "sinusoidal"
			}
		],
		"blueHelp": [
			{
				"image": "bluePlayerFlipped", 
				"initialPosition": [1920/2 + 450, 1080/2],
				"finalPosition": [1920/2, 1080/2],
				"initialDimensions": [600, 600],
				"frames": 60,
				"transitionType": "sinusoidal"
			}
		],
		"redHelpReturn": [
			{
				"image": "redPlayer",
				"initialPosition": [1920/2, 1080/2],
				"finalPosition": [1920/2 - 450, 1080/2],
				"initialDimensions": [600, 600],
				"frames": 60,
				"transitionType": "sinusoidal"
			}
		],
		"blueHelpReturn": [
			{
				"image": "bluePlayerFlipped", 
				"initialPosition": [1920/2, 1080/2],
				"finalPosition": [1920/2 + 450, 1080/2],
				"initialDimensions": [600, 600],
				"frames": 60,
				"transitionType": "sinusoidal"
			}
		]
    };

	static compileTemplates() {
		for (let i = 0; i < Object.keys(this.templates).length; i++) {
			let currentTemplate = this.templates[Object.keys(this.templates)[i]];
			for (let j = 0; j < currentTemplate.length; j++) {
				let currentKeyframe = currentTemplate[j];
				let previousKeyframe;
				if (j == 0) {
					//Needed elements in animation template
					if (currentKeyframe["image"] == undefined) {
						throw new SyntaxError("\nNo Initial Image in Animation Template: " + Object.keys(this.templates)[i]);
					}
					if (currentKeyframe["initialPosition"] == undefined) {
						throw new SyntaxError("\nNo Initial Position in Animation Template: " + Object.keys(this.templates)[i]);
					}
					if (currentKeyframe["initialDimensions"] == undefined) {
						throw new SyntaxError("\nNo Initial Dimensions in Animation Template: " + Object.keys(this.templates)[i]);
					}

					//Implicitly defined elements
					if (currentKeyframe["finalPosition"] == undefined) {
						currentKeyframe["finalPosition"] = currentKeyframe["initialPosition"];
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
					throw new SyntaxError("\nNo Frames in Animation Template: " + Object.keys(this.templates)[i]);
				} else if (currentKeyframe["endFrame"] == undefined) {
					currentKeyframe["endFrame"] = currentKeyframe["startFrame"] + currentKeyframe["frames"];
				}
				
				this.templates[Object.keys(this.templates)[i]][j] = new Keyframe(currentKeyframe["image"], currentKeyframe["initialPosition"], currentKeyframe["finalPosition"], currentKeyframe["initialDimensions"], currentKeyframe["finalDimensions"], currentKeyframe["startFrame"], currentKeyframe["endFrame"], currentKeyframe["transitionType"]);
			}
		}
		//Templates have compiled successfully
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
		//No frame was drawn, draw final frame
		let finalKeyframe = this.keyframes[this.keyframes.length - 1];
		finalKeyframe.draw(finalKeyframe.endFrame);
        //No frame was drawn, return false unless this animation loops, in which case reset frames and call update() again
        //Don't let frames be equal to zero because that can cause stack overflow errors
        if (this.loops && this.frames != 0) {
            this.frames = 0;
            return this.update();
        }
        return false;
    }
}