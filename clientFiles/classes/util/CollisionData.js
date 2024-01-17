//CollisionData Class
export class CollisionData {
	//Constructor
	constructor(initX, initY, initVel, hardness, isHorizontal) {
		this.initX = initX;
		this.initY = initY;
		this.initVel = initVel;
		this.hardness = hardness;
		this.isHorizontal = isHorizontal;
		this.entrenceTime = 0;
		this.exitTime = 0;
	}

	//Returns the obejct velocity based on frame
	calcVelocity(frame) {
		
	}

	//Returns the object position based on the frame
	calcPosition(frame) {
		if(this.isHorizontal) {
			if (frame <= this.velocityZero) {
				return [initX + ]
			}
		}
		
	}

	//Returns the frame value of the positive zero of the velocity equation (found with quadratic formula)
	get velocityZero() {
		return (b + Math.sqrt((b * b) - (4 * (this.harness/2) * this.initVel))) / this.hardness;
	}
}