//Util Imports
import { Keyframe } from "./Keyframe.js";

//Animation Class
export class Animation {
    //Static Variables

	static compiled = false;

    //Templates formatted as {"name": keyframes[ keyframe properties ] }
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
			}
		],
		"flasher": [ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
			{
				"image": "flasher1",
				"initialPosition": [1920/2, 1080/2 + 240 + 60],
				"initialDimensions": [408, 144],
				"initialRotation": -1,
				"finalRotation": 1,
				"frames": 25,
				"transitionType": "sinusoidal"
			},
			{
				"image": "flasher2",
				"finalRotation": -1
			}
		],
		"menuFadeIn": [
			{
				"image": "blackTile", "initialPosition": [1920/2, 1080/2], "initialDimensions": [1920, 1080], "frames": 90
			},
			{
				"finalOpacity": 0,
				"frames": 60
			}
		],
		"fadeIn": [
			{
				"image": "blackTile", "initialPosition": [1920/2, 1080/2], "initialDimensions": [1920, 1080], "finalOpacity": 0, "frames": 60
			}
		],
		"fadeOut": [
			{
				"image": "blackTile", "initialPosition": [1920/2, 1080/2], "initialDimensions": [1920, 1080], "initialOpacity": 0, "finalOpacity": 100, "frames": 60
			}
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
		],
		"doorOpen": [
			{
				"image": "door", 
				"initialPosition": [1920/2, 1080 - 288/2],
				"finalPosition": [1920/2 - 192/2, 1080 - 288/2],
				"initialDimensions": [192, 288],
				"finalDimensions": [0, 288],
				"frames": 60,
				"transitionType": "sinusoidal 1/2"
			}
		],
		"coinTossFromRed": [
			{
				"image": "coin",
				"initialPosition": [200, 1080/2],
				"finalPosition": [1920 - 200, 1080/2 - 250],
				"initialDimensions": [0, 0],
				"finalDimensions": [81, 81],
				"frames": 50,
				"transitionType": "linear",
				"yTransitionType": "projectileArc",
				"widthTransitionType": "coinToss",
				"heightTransitionType": "coinToss"
			}
		],
		"coinTossFromBlue": [
			{
				"image": "coin",
				"initialPosition": [1920 - 200, 1080/2],
				"finalPosition": [200, 1080/2 - 250],
				"initialDimensions": [0, 0],
				"finalDimensions": [81, 81],
				"frames": 50,
				"transitionType": "linear",
				"yTransitionType": "projectileArc",
				"widthTransitionType": "coinToss",
				"heightTransitionType": "coinToss"
			}
		],
		"priceTagFalls": [
			{
				"image": "priceTag",
				"initialPosition": [1920/2 + 90, 220 + 190],
				"finalPosition": [1920/2  + 180, 1400],
				"initialDimensions": [100, 44],
				"initialRotation": 45,
				"finalRotation": 120,
				"frames": 80,
				"transitionType": "linear",
				"yTransitionType": "sinusoidal 1/2",
				"xTransitionType": "bounce",
				"rotationTransitionType": "bounce"
			}
		],
		"redJump": [
			{
				"image": "redPlayerJump",
				"initialPosition": [1920/2 - 800, 1080/2],
				"initialDimensions": [240, 240],
				"finalPosition": [1920/2 - 800, 1080/2 - 130],
				"transitionType": "projectileArc",
				"frames": 30,
			},
			{
				"image": "redPlayer",
				"initialPosition": [1920/2 - 800, 1080/2],
				"frames": 30,
			}
		],
		"blueJump": [
			{
				"image": "bluePlayerFlipped",
				"initialPosition": [1920/2 + 800, 1080/2],
				"initialDimensions": [240, 240],
				"frames": 30,
			},
			{
				"image": "bluePlayerJumpFlipped",
				"initialPosition": [1920/2 + 800, 1080/2],
				"finalPosition": [1920/2 + 800, 1080/2 - 130],
				"transitionType": "projectileArc",
				"frames": 30,
			}
		],
		"maceWarning": [
			{
				"image": "maceWarning",
				"initialPosition": [1920/2, 1000],
				"finalPosition": [1920/2, 1080/2 + 110],
				"initialDimensions": [0, 0],
				"finalDimensions": [1185, 40],
				"finalOpacity": 0,
				"frames": 80,
				"transitionType": "log",
				"opacityTransitionType": "growth"
			}
		],
		"educationShardWin": [
			{
				"image": "educationShard",
				"initialPosition": [-250, 1080/2 - 30],
				"finalPosition": [1920/2 - 120 + 15, 1080/2 - 30], 
				"initialDimensions": [330, 420],
				"initialRotation": -40,
				"finalRotation": 0,
				"frames": 150, 
				"transitionType": "linear",
				"xTransitionType": "log",
				"rotationTransitionType": "growth"
			}
		],
		"progressShardWin": [
			{
				"image": "progressShard",
				"initialPosition": [1920/2, 1080 + 250],
				"initialDimensions": [480, 210],
				"initialRotation": -40,
				"frames": 50,
				"transitionType": "linear",
			},
			{
				"finalPosition": [1920/2, 1080/2 + 180 - 45], 
				"finalRotation": 0,
				"frames": 100,
				"xTransitionType": "log",
				"rotationTransitionType": "growth"
			}
		],
		"serviceShardWin": [
			{
				"image": "serviceShard", 
				"initialPosition": [1920 + 250, 1080/2 - 30],
				"initialDimensions": [270, 420],
				"initialRotation": -40,
				"frames": 100,
				"transitionType": "linear"
			},
			{
				"finalPosition": [1920/2 + 120 + 15, 1080/2 - 30], 
				"finalRotation": 0,
				"frames": 50,
				"xTransitionType": "log",
				"rotationTransitionType": "growth"
			}
		],
		"congratulations": [
			{
				"image": "congratulations", 
				"initialPosition": [1920/2, 1080 + 150],
				"finalPosition": [1920/2, 1080 - 200],
				"initialDimensions": [1150, 80],
				"initialOpacity": 0,
				"finalOpacity": 100,
				"frames": 100,
				"transitionType": "sinusoidal"
			},
			{
				"finalOpacity": 0,
				"frames": 50
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
					if (currentKeyframe["startFrame"] == undefined) {
						currentKeyframe["startFrame"] = 0;
					}
					if (currentKeyframe["initialRotation"] == undefined) {
						currentKeyframe["initialRotation"] = 0;
					}
					if (currentKeyframe["finalRotation"] == undefined) {
						currentKeyframe["finalRotation"] = currentKeyframe["initialRotation"];
					}
					if (currentKeyframe["initialOpacity"] == undefined) {
						currentKeyframe["initialOpacity"] = 100;
					}
					if (currentKeyframe["finalOpacity"] == undefined) {
						currentKeyframe["finalOpacity"] = currentKeyframe["initialOpacity"];
					}
					//Transition type
					if (currentKeyframe["transitionType"] == undefined) {
						currentKeyframe["transitionType"] = "linear";
					}

					//Substitue in Transition type for any undefined elements
					if (currentKeyframe["xTransitionType"] == undefined) {
						currentKeyframe["xTransitionType"] = currentKeyframe["transitionType"];
					}
					if (currentKeyframe["yTransitionType"] == undefined) {
						currentKeyframe["yTransitionType"] = currentKeyframe["transitionType"];
					}
					if (currentKeyframe["widthTransitionType"] == undefined) {
						currentKeyframe["widthTransitionType"] = currentKeyframe["transitionType"];
					}
					if (currentKeyframe["heightTransitionType"] == undefined) {
						currentKeyframe["heightTransitionType"] = currentKeyframe["transitionType"];
					}
					if (currentKeyframe["rotationTransitionType"] == undefined) {
						currentKeyframe["rotationTransitionType"] = currentKeyframe["transitionType"];
					}
					if (currentKeyframe["opacityTransitionType"] == undefined) {
						currentKeyframe["opacityTransitionType"] = currentKeyframe["transitionType"];
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
						currentKeyframe["finalPosition"] = currentKeyframe["initialPosition"];
					}
					if (currentKeyframe["initialDimensions"] == undefined) {
						currentKeyframe["initialDimensions"] = previousKeyframe.finalDimensions;
					}
					if (currentKeyframe["finalDimensions"] == undefined) {
						currentKeyframe["finalDimensions"] = currentKeyframe["initialDimensions"];
					}
					if (currentKeyframe["frames"] == undefined) {
						currentKeyframe["frames"] = previousKeyframe.endFrame - previousKeyframe.startFrame;
					}
					if (currentKeyframe["startFrame"] == undefined) {
						currentKeyframe["startFrame"] = previousKeyframe.endFrame;
					}
					if (currentKeyframe["initialRotation"] == undefined) {
						currentKeyframe["initialRotation"] = previousKeyframe.finalRotation;
					}
					if (currentKeyframe["finalRotation"] == undefined) {
						currentKeyframe["finalRotation"] = currentKeyframe["initialRotation"];
					}
					if (currentKeyframe["initialOpacity"] == undefined) {
						currentKeyframe["initialOpacity"] = previousKeyframe.finalOpacity;
					}
					if (currentKeyframe["finalOpacity"] == undefined) {
						currentKeyframe["finalOpacity"] = currentKeyframe["initialOpacity"];
					}
					
					//Transition types
					if (currentKeyframe["xTransitionType"] == undefined) {
						currentKeyframe["xTransitionType"] = previousKeyframe.xTransitionType;
					}
					if (currentKeyframe["yTransitionType"] == undefined) {
						currentKeyframe["yTransitionType"] = previousKeyframe.yTransitionType;
					}
					if (currentKeyframe["widthTransitionType"] == undefined) {
						currentKeyframe["widthTransitionType"] = previousKeyframe.widthTransitionType;
					}
					if (currentKeyframe["heightTransitionType"] == undefined) {
						currentKeyframe["heightTransitionType"] = previousKeyframe.heightTransitionType;
					}
					if (currentKeyframe["rotationTransitionType"] == undefined) {
						currentKeyframe["rotationTransitionType"] = previousKeyframe.rotationTransitionType;
					}
					if (currentKeyframe["opacityTransitionType"] == undefined) {
						currentKeyframe["opacityTransitionType"] = previousKeyframe.opacityTransitionType;
					}
					//Override all if a given transition type exists
					if (currentKeyframe["transitionType"] != undefined) {
						currentKeyframe["xTransitionType"] = currentKeyframe["transitionType"];
						currentKeyframe["yTransitionType"] = currentKeyframe["transitionType"];
						currentKeyframe["widthTransitionType"] = currentKeyframe["transitionType"];
						currentKeyframe["heightTransitionType"] = currentKeyframe["transitionType"];
						currentKeyframe["rotationTransitionType"] = currentKeyframe["transitionType"];
						currentKeyframe["opacityTransitionType"] = currentKeyframe["transitionType"];
					}
				}

				if (currentKeyframe["endFrame"] == undefined && currentKeyframe["frames"] == undefined) {
					throw new SyntaxError("\nNo Frames in Animation Template: " + Object.keys(this.templates)[i]);
				} else if (currentKeyframe["endFrame"] == undefined) {
					currentKeyframe["endFrame"] = currentKeyframe["startFrame"] + currentKeyframe["frames"];
				}
				
				this.templates[Object.keys(this.templates)[i]][j] = new Keyframe(currentKeyframe["image"], currentKeyframe["initialPosition"], currentKeyframe["finalPosition"], currentKeyframe["initialDimensions"], currentKeyframe["finalDimensions"], currentKeyframe["initialRotation"], currentKeyframe["finalRotation"], currentKeyframe["initialOpacity"], currentKeyframe["finalOpacity"], currentKeyframe["startFrame"], currentKeyframe["endFrame"], currentKeyframe["xTransitionType"], currentKeyframe["yTransitionType"], currentKeyframe["widthTransitionType"], currentKeyframe["heightTransitionType"], currentKeyframe["rotationTransitionType"], currentKeyframe["opacityTransitionType"]);
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