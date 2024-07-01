//Util Imports
import { Keyframe } from "../util/Keyframe.js";

//Basic Object Imports
import { ShadedObject } from "../basicObjects/ShadedObject.js";

//AnimatedObject Class
export class AnimatedObject extends ShadedObject {
	//Static Variables

	//Animations formatted as { objName: { animationName: keyframes [ keyframe properties ] } }
	//All Animated Object animations are positioned relative to the object
	//initialPosition is the offset from the object's x and y
	static globalAnimations = {
		"slime": {
			"idle": [
				{
					"image": "slime",
					"initialPosition": [0, 0],
					"initialDimensions": [30, 30],
					"frames": 0
				}
			],
			"jump": [
				{
					"image": "slime",
					"initialPosition": [0, 0],
					"initialDimensions": [30, 30],
					"finalDimensions": [25, 38],
					"frames": 8,
					"transitionType": "sinusoidal"
				},
				{
					"finalDimensions": [30, 30]
				},
				{
					"frames": -1
				}
			],
			"land": [
				{
					"image": "slime",
					"initialPosition": [0, 0],
					"finalPosition": [0, 3],
					"initialDimensions": [30, 30],
					"finalDimensions": [35, 24],
					"frames": 8,
					"transitionType": "sinusoidal"
				},
				{
					"finalPosition": [0, 0],
					"finalDimensions": [30, 30]
				}
			]
		},
		"redPlayer": {
			"idle": [
				{
					"image": "redPlayer",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 0
				}
			],
			"jump": [
				{
					"image": "redPlayerJump",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 0
				}
			],
			"walk": [
				{
					"image": "redPlayerWalk",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 10
				}, 
				{"image": "redPlayer"}
			],
			"ghost": [
				{
					"image": "redGhost",
					"initialPosition": [0, 0],
					"finalPosition": [0, -4],
					"initialDimensions": [60, 60],
					"transitionType": "sinusoidal",
					"frames": 30
				}, {
					"image": "redGhostAlt",
					"finalPosition": [0, 0],
					"frames": 30
				}, {
					"frames": 0
				}
			],
			"maceCharge": [
				{
					"image": "redPlayerCharge1",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 30
				},
				{
					"image": "redPlayerCharge2",
					"frames": 20
				},
				{
					"image": "redPlayerCharge3",
					"frames": 20
				},
				{
					"frames": -1
				}
			],
			"maceCancelCharge": [
				{
					"image": "redPlayerCharge3",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 20
				},
				{
					"image": "redPlayerCharge2",
					"frames": 20
				},
				{
					"image": "redPlayerCharge1",
					"frames": 30
				}
			],
			"maceAttack": [
				{
					"image": "redPlayerAttack1",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 4
				},
				{
					"image": "redPlayerAttack2",
					"frames": 5
				},
				{
					"image": "redPlayerAttack3",
					"frames": 4
				},
				{
					"image": "redPlayerAttack4",
					"frames": 24
				},
				{
					"image": "redPlayerReturn1",
					"frames": 16
				},
				{
					"image": "redPlayerReturn2",
					"frames": 12
				},
				{
					"image": "redPlayerReturn3",
					"frames": 12
				}
			]
		},
		"bluePlayer": {
			"idle": [
				{
					"image": "bluePlayer",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 0
				}
			],
			"jump": [
				{
					"image": "bluePlayerJump",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 0
				}
			],
			"walk": [
				{
					"image": "bluePlayerWalk",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 10
				}, 
				{"image": "bluePlayer"}
			],
			"ghost": [
				{
					"image": "blueGhost",
					"initialPosition": [0, 0],
					"finalPosition": [0, -2],
					"initialDimensions": [60, 60],
					"transitionType": "sinusoidal 1/2",
					"frames": 15
				},
				{
					"image": "blueGhostAlt",
					"finalPosition": [0, -4],
					"transitionType": "sinusoidal 2/2"
				},
				{
					"image": "blueGhost",
					"finalPosition": [0, -2],
					"transitionType": "sinusoidal 1/2"
				},
				{
					"image": "blueGhostAlt",
					"finalPosition": [0, 0],
					"transitionType": "sinusoidal 2/2"
				}, {
					"frames": 0
				}
			],
			"maceCharge": [
				{
					"image": "bluePlayerCharge1",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 30
				},
				{
					"image": "bluePlayerCharge2",
					"frames": 20
				},
				{
					"image": "bluePlayerCharge3",
					"frames": 20
				},
				{
					"frames": -1
				}
			],
			"maceCancelCharge": [
				{
					"image": "bluePlayerCharge3",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 20
				},
				{
					"image": "bluePlayerCharge2",
					"frames": 20
				},
				{
					"image": "bluePlayerCharge1",
					"frames": 30
				}
			],
			"maceAttack": [
				{
					"image": "bluePlayerAttack1",
					"initialPosition": [0, 0],
					"initialDimensions": [60, 60],
					"frames": 4
				},
				{
					"image": "bluePlayerAttack2",
					"frames": 5
				},
				{
					"image": "bluePlayerAttack3",
					"frames": 4
				},
				{
					"image": "bluePlayerAttack4",
					"frames": 24
				},
				{
					"image": "bluePlayerReturn1",
					"frames": 16
				},
				{
					"image": "bluePlayerReturn2",
					"frames": 12
				},
				{
					"image": "bluePlayerReturn3",
					"frames": 12
				}
			]
		},
		"skeleton": {
			"idle": [
				{
					"image": "skeleton",
					"initialPosition": [0, 0],
					"initialDimensions": [34, 52],
					"frames": 0
				}
			],
			"jump": [
				{
					"image": "skeletonJump",
					"initialPosition": [0, 0],
					"initialDimensions": [34, 52],
					"frames": 0
				}
			],
			"walk": [
				{
					"image": "skeleton",
					"initialPosition": [0, 0],
					"initialDimensions": [34, 52],
					"frames": 10
				}, 
				{"image": "skeletonWalk"}
			]
		},
		"effigy": {
			"idle": [
				{
					"image": "effigy",
					"initialPosition": [0, 0],
					"initialDimensions": [32, 56],
					"frames": 0
				}
			],
			"statue": [
				{
					"image": "effigyDormant",
					"initialPosition": [0, 0],
					"initialDimensions": [32, 56],
					"frames": 0
				}
			],
			"jump": [
				{
					"image": "skeletonJump",
					"initialPosition": [0, 0],
					"initialDimensions": [32, 56],
					"frames": 0
				}
			],
			"walk": [
				{
					"image": "effigy",
					"initialPosition": [0, 0],
					"initialDimensions": [32, 56],
					"frames": 10
				}, 
				{"image": "effigyWalk"}
			],
			"maceCharge": [
				{
					"image": "effigyDormant",
					"initialPosition": [0, 0],
					"initialDimensions": [32, 56],
					"initialOpacity": 100,
					"finalOpacity": 0,
					"frames": 120
				},
				{
					"image": "effigyCharge1",
					"initialOpacity": 100,
					"frames": 15
				},
				{
					"image": "effigyCharge2",
					"frames": 10
				},
				{
					"image": "effigyCharge3",
					"frames": 10
				},
				{
					"frames": -1
				}
			],
			"maceCancelCharge": [
				{
					"image": "effigyCharge3",
					"initialPosition": [0, 0],
					"initialDimensions": [32, 56],
					"frames": 10
				},
				{
					"image": "effigyCharge2",
					"frames": 10
				},
				{
					"image": "effigyCharge1",
					"frames": 15
				}
			],
			"maceAttack": [
				{
					"image": "effigyAttack1",
					"initialPosition": [0, 0],
					"initialDimensions": [32, 56],
					"frames": 4
				},
				{
					"image": "effigyAttack2",
					"frames": 5
				},
				{
					"image": "effigyAttack3",
					"frames": 4
				},
				{
					"image": "effigyAttack4",
					"frames": 24
				}
			]
		},
		"sword": {
			"idle": [
				{ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
					"image": "sword", 
					"initialPosition": [0, 0],
					"initialDimensions": [80, 80],
					"frames": 0,
				}
			],
			"attack": [
				{
					"image": "sword",
					"initialPosition": [0, 0],
					"initialDimensions": [80, 80],
					"frames": 8,
					"finalRotation": 90,
					"transitionType": "sinusoidal"
				},
				{
					"finalRotation": 0,
					"transitionType": "sinusoidal"
				}
			],
			"jump": [
				{
					"image": "sword",
					"initialPosition": [0, 0],
					"initialDimensions": [80, 80],
					"initialRotation": -90,
					"frames": 0
				}
			]
		},
		"playerSword": {
			"idle": [
				{ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
					"image": "sword", 
					"initialPosition": [10, 2],
					"initialDimensions": [80, 80],
					"frames": 0
				}
			],
			"attack": [
				{
					"image": "sword",
					"initialPosition": [10, 2],
					"initialDimensions": [80, 80],
					"frames": 8,
					"finalRotation": 90,
					"transitionType": "sinusoidal"
				},
				{
					"finalRotation": 0,
					"transitionType": "sinusoidal"
				} 
			],
			"jump": [
				{
					"image": "sword",
					"initialPosition": [17, -9],
					"initialDimensions": [80, 80],
					"frames": 0,
					"initialRotation": -90
				}
			]
		},
		"skeletonSword": {
			"idle": [
				{ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
					"image": "sword", 
					"initialPosition": [13, 3],
					"initialDimensions": [80, 80],
					"frames": 0
				}
			],
			"attack": [
				{
					"image": "sword",
					"initialPosition": [13, 3],
					"initialDimensions": [80, 80],
					"frames": 8,
					"finalRotation": 90,
					"transitionType": "sinusoidal"
				}, 
				{
					"finalRotation": 0,
					"transitionType": "sinusoidal"
				}
			],
			"jump": [
				{
					"image": "sword",
					"initialPosition": [9, -8],
					"initialDimensions": [80, 80],
					"frames": 0,
					"initialRotation": -90
				}
			]
		},
		"playerMace": {
			"idle": [
				{ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
					"image": "mace", 
					"initialPosition": [8, 2],
					"initialDimensions": [80, 80],
					"initialRotation": 200,
					"frames": 0
				}
			],
			"charge": [
				{
					"image": "mace",
					"initialPosition": [8, 2],
					"finalPosition": [0, 2],
					"initialDimensions": [80, 80],
					"initialRotation": 200,
					"finalRotation": 210,
					"frames": 20
				},
				{
					"finalPosition": [10, 2],
					"finalRotation": 250,
					"frames": 20
				},
				{
					"finalRotation": 270,
					"frames": 30,
					"transitionType": "sinusoidal"
				},
				{
					"frames": -1
				}
			],
			"cancelCharge": [
				{
					"image": "mace",
					"initialPosition": [10, 2],
					"initialDimensions": [80, 80],
					"initialRotation": 270,
					"finalRotation": 250,
					"frames": 30,
					"transitionType": "sinusoidal"
				},
				{
					"transitionType": "linear",
					"finalPosition": [0, 2],
					"finalRotation": 210,
					"frames": 20
				},
				{
					"finalPosition": [8, 2],
					"finalRotation": 200,
					"frames": 20
				}
			],
			"attack": [
				{
					"image": "mace",
					"initialPosition": [10, 2],
					"initialDimensions": [80, 80],
					"frames": 15,
					"initialRotation": -90,
					"finalRotation": 70,
					"transitionType": "sinusoidal"
				}, {"frames": 15},
				{
					"finalPosition": [10, -4],
					"finalRotation": 135,
					"frames": 30,
					"transitionType": "sinusoidal 1/2"
				},
				{
					"finalPosition": [8, 2],
					"finalRotation": 200,
					"frames": 30,
					"transitionType": "sinusoidal 2/2"
				}
			],
			"jump": [
				{
					"image": "mace",
					"initialPosition": [17, -9],
					"initialDimensions": [80, 80],
					"initialRotation": -90,
					"frames": 0
				}
			]
		},
		"effigyMace": {
			"dormant": [
				{ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
					"image": "mace", 
					"initialPosition": [5, 2],
					"initialDimensions": [80, 80],
					"initialRotation": 195,
					"frames": 0
				}
			],
			"idle": [
				{ //initial keyframe requires "image", "initialPosition", "initialDimensions", "frames"
					"image": "mace", 
					"initialPosition": [7, 2],
					"initialDimensions": [80, 80],
					"initialRotation": -90,
					"frames": 0
				}
			],
			"charge": [
				{
					"image": "mace",
					"initialPosition": [5, 2],
					"initialDimensions": [80, 80],
					"initialRotation": 195,
					"frames": 120
				},
				{
					"finalPosition": [0, 2],
					"finalRotation": 210,
					"frames": 50
				},
				{
					"finalPosition": [7, 2],
					"finalRotation": 250,
					"frames": 50
				},
				{
					"finalRotation": 270,
					"frames": 30,
					"transitionType": "sinusoidal"
				},
			],
			"attack": [
				{
					"image": "mace",
					"initialPosition": [7, 2],
					"initialDimensions": [80, 80],
					"frames": 15,
					"initialRotation": -90,
					"finalRotation": 70,
					"transitionType": "sinusoidal"
				}, { "frames": 60 },
				{
					"frames": 35,
					"finalRotation": -90,
					"transitionType": "sinusoidal"
				}
			],
			"jump": [
				{
					"image": "mace",
					"initialPosition": [17, -9],
					"initialDimensions": [80, 80],
					"initialRotation": -90,
					"frames": 0
				}
			]
		},
		"spark": {
			"idle": [
				{
					"image": "sparkYellow",
					"initialPosition": [0, 0],
					"initialDimensions": [6, 6],
					"finalOpacity": 70,
					"finalRotation": 120,
					"frames": 5,
					"transitionType": "sinusoidal"
				}, 
				{
					"image": "sparkOrange",
					"finalRotation": 240,
					"finalOpacity": 40
				}, 
				{
					"image": "sparkRed",
					"finalRotation": 360,
					"finalOpacity": 0
				}
			]
		},
		"sparkSlow": {
			"idle": [
				{
					"image": "sparkYellow",
					"initialPosition": [0, 0],
					"initialDimensions": [6, 6],
					"finalOpacity": 70,
					"finalRotation": 120,
					"frames": 15,
					"transitionType": "sinusoidal"
				}, 
				{
					"image": "sparkOrange",
					"finalRotation": 240,
					"finalOpacity": 40
				}, 
				{
					"image": "sparkRed",
					"finalRotation": 360,
					"finalOpacity": 0
				}
			]
		},
		"death": {
			"idle": [
				{
					"image": "death",
					"initialPosition": [0, 0],
					"initialDimensions": [6, 6],
					"finalDimensions": [18, 18],
					"finalOpacity": 0,
					"finalRotation": 120,
					"frames": 45,
					"transitionType": "sinusoidal"
				}
			]
		},
		"slimeDeath": {
			"idle": [
				{
					"image": "slime",
					"initialPosition": [0, 0],
					"initialDimensions": [10, 10],
					"finalDimensions": [2, 2],
					"finalOpacity": 0,
					"finalRotation": 360,
					"frames": 100,
					"transitionType": "growth"
				}
			]
		},
		"glass": {
			"idle": [
				{
					"image": "glass",
					"initialPosition": [0, 0],
					"initialDimensions": [20, 20],
					"finalOpacity": 0,
					"finalRotation": 360,
					"frames": 120,
					"transitionType": "sinusoidal"
				}
			]
		},
		"shopMace": {
			"standing": [
				{
					"image": "mace-45",
					"initialPosition": [0, 0],
					"initialDimensions": [560, 560],
					"frames": 0
				}
			],
			"falling": [
				{
					"image": "mace-45",
					"initialPosition": [0, 0],
					"initialRotation": 0,
					"finalRotation": 180,
					"initialDimensions": [560, 560],
					"initialOpacity": 100,
					"frames": 50,
					"transitionType": "sinusoidal 1/2"
				}, 
				{
					"finalRotation": 240,
					"frames": 20,
					"transitionType": "sinusoidal 2/2"
				},
				{
					"finalRotation": 180,
					"frames": 20,
					"transitionType": "sinusoidal 1/2"
				},
				{
					"finalRotation": 160,
					"frames": 15,
					"transitionType": "sinusoidal 2/2"
				},
				{
					"finalRotation": 180,
					"frames": 15,
					"transitionType": "sinusoidal 1/2"
				},
				{
					"finalRotation": 190,
					"frames": 15,
					"transitionType": "sinusoidal 2/2"
				},
				{
					"finalRotation": 180,
					"frames": 15,
					"transitionType": "sinusoidal"
				}
			],
			"idle": [
				{
					"image": "mace-45",
					"initialPosition": [0, 0],
					"initialRotation": 180,
					"initialDimensions": [560, 560],
					"frames": 0
				}
			],
			"bought": [
				{
					"image": "none",
					"initialPosition": [0, 0],
					"initialDimensions": [0, 0],
					"frames": 0
				}
			]
		}
	}

	//*********************************************************************//
	//Public Static Methods

	/** Compiles AnimatedObject Animations */
	static compileAnimations() {
		//For every animation type
		for (let i = 0; i < Object.keys(this.globalAnimations).length; i++) {
			let objKey = Object.keys(this.globalAnimations)[i];

			//For every animation of that type
			for (let j = 0; j < Object.keys(this.globalAnimations[objKey]).length; j++) {
				let key = Object.keys(this.globalAnimations[objKey])[j];

				//For every animation keyframe
				for (let k = 0; k < Object.keys(this.globalAnimations[objKey][key]).length; k++) {
					let currentKeyframe = this.globalAnimations[objKey][key][k];
					let previousKeyframe;

					//If this is the first keyframe in the animation
					if (k == 0) {
						//Check for needed values
						if (currentKeyframe["image"] == undefined) {
							throw new SyntaxError("\nNo Initial Image in Weapon Animation: " + objKey + "_" + key);
						}
						if (currentKeyframe["initialPosition"] == undefined) {
							throw new SyntaxError("\nNo Initial Position in Weapon Animation: " + objKey + "_" + key);
						}
						if (currentKeyframe["initialDimensions"] == undefined) {
							throw new SyntaxError("\nNo Initial Dimensions in Weapon Animation: " + objKey + "_" + key);
						}

						//Implicitly defined elements
						if (currentKeyframe["finalPosition"] == undefined) {
							currentKeyframe["finalPosition"] = currentKeyframe["initialPosition"];
						}
						if (currentKeyframe["finalDimensions"] == undefined) {
							currentKeyframe["finalDimensions"] = currentKeyframe["initialDimensions"];
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
						
						//Animation always starts at frame 0
						currentKeyframe["startFrame"] = 0;
						

					//If this isn't the first keyframe in the animation
					} else {
						//Assign previous keyframe
						previousKeyframe = this.globalAnimations[objKey][key][k - 1];

						//Implicitly defined elements
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

					//Assign frames
					if (currentKeyframe["endFrame"] == undefined && currentKeyframe["frames"] == undefined) {
						throw new SyntaxError("\nNo Frames in Weapon Animation: " + objKey + "_" + key);
					} else if (currentKeyframe["endFrame"] == undefined) {
						currentKeyframe["endFrame"] = currentKeyframe["startFrame"] + currentKeyframe["frames"];
					}

					//Construct keyframe
					this.globalAnimations[objKey][key][k] = new Keyframe(currentKeyframe["image"], currentKeyframe["initialPosition"], currentKeyframe["finalPosition"], currentKeyframe["initialDimensions"], currentKeyframe["finalDimensions"], currentKeyframe["initialRotation"], currentKeyframe["finalRotation"], currentKeyframe["initialOpacity"], currentKeyframe["finalOpacity"], currentKeyframe["startFrame"], currentKeyframe["endFrame"], currentKeyframe["xTransitionType"], currentKeyframe["yTransitionType"], currentKeyframe["widthTransitionType"], currentKeyframe["heightTransitionType"], currentKeyframe["rotationTransitionType"], currentKeyframe["opacityTransitionType"]);
				}
			}
		}
		console.log(this.globalAnimations);
	}

	//*********************************************************************//
	//Constructor

	constructor(type, orderNum, x, y, width, height, shade = true) {
		super("none", orderNum, x, y, width, height, shade);
		this.type = type;
		this.currentAnimation = "idle";
		this.currentKeyframe = Object.values(AnimatedObject.globalAnimations[this.type]["idle"])[0];
		this.currentFrame = 0;
		this.flipped = false;
	}
	
	//*********************************************************************//
	//Public Methods

	

	/** Draws this AnimatedObject */
	draw() {
		//console.log(this.type + " drawn");
		if (this.type == "playerSword") console.log(this.currentFrame);
		this.currentKeyframe.draw(this.currentFrame, this.x, this.y, this.flipped);
	}

	/**
	 * Sets the animation of this object to the provided animation 
	 * @param {string} animation - animation to set to
	 */
	setAnimation(animation) {
		if (AnimatedObject.globalAnimations[this.type][animation] == undefined) {
			throw new SyntaxError("Animation Name not Recognized: " + animation);
		}
		
		this.currentAnimation = animation;
		this.currentFrame = 0;
		this.currentKeyframe = AnimatedObject.globalAnimations[this.type][animation][0];
	}

	/** Resets the animation to idle */
	resetAnimation() {
		this.setAnimation("idle");
		this.currentFrame = 0;
	}

	/** Updates this AnimatedObject */
	update(advanceFrame = true) {
		//Increment the current frame
		if (advanceFrame) this.currentFrame++;

		if (AnimatedObject.globalAnimations == undefined) {
			throw new Error("AnimatedObject Global Animations was wiped");
		}
		if (AnimatedObject.globalAnimations[this.type] == undefined) {
			throw new SyntaxError("Animation Type not Recognized: " + this.type);
		}
		if (AnimatedObject.globalAnimations[this.type][this.currentAnimation] == undefined) {
			throw new SyntaxError("Animation Name not Recognized: " + this.currentAnimation);
		}
		
		//If the current keyframe isn't correct
		if (this.currentFrame > this.currentKeyframe.endFrame || !advanceFrame) {
			let possibleKeyframes = Object.values(AnimatedObject.globalAnimations[this.type][this.currentAnimation]);
			for (let i = 0; i < possibleKeyframes.length; i++) {
				if (this.currentFrame >= possibleKeyframes[i].startFrame && this.currentFrame < possibleKeyframes[i].endFrame) {
					this.currentKeyframe = possibleKeyframes[i];
					return;
				}
			}
			//No keyframe was found, loop if the last keyframe is of frame length 0
			let checkedFrame = possibleKeyframes[possibleKeyframes.length - 1];
			if (checkedFrame.endFrame - checkedFrame.startFrame == 0) {
				this.currentFrame = 0;
				this.currentKeyframe = possibleKeyframes[0];
				return;
			}
			//No keyframe was found, loop last frame if the last keyframe is of frame length -1
			checkedFrame = possibleKeyframes[possibleKeyframes.length - 1];
			if (checkedFrame.endFrame - checkedFrame.startFrame == -1) {
				//Stay on the last frame
				if (advanceFrame) this.currentFrame--;
				//Current keyframe is the last keyframe in the animation
				this.currentKeyframe = possibleKeyframes[possibleKeyframes.length - 1];
				return;
			}
			//No keyframe was found and the keyframe doesn't loop
			this.resetAnimation();
		}
	}
}