export class AudioPlayer {
	static muted = false;
	static volume = 0.5;

	static audioClips = {
		"ambience": new Audio("/audio/ambience.mp3"),
		"die": new Audio("/audio/die.mp3"),
		"door": new Audio("/audio/door.mp3"),
		"lose": new Audio("/audio/lose.mp3"),
		"slime": new Audio("/audio/slime.mp3"),
		"step": new Audio("/audio/step.mp3"),
		"swordSwing": new Audio("/audio/swordSwing.mp3"),
		"upgrade": new Audio("/audio/upgrade.mp3"),
		"win": new Audio("/audio/win.mp3")
	};
	

	static pauseAll() {
		for (let i = 0; i < Object.keys(this.audioClips).length; i++) {
			let name = Object.keys(this.audioClips)[i];
			try {
				this.audioClips[name].pause();
				//console.log("paused: " + name);
			} catch {
				console.warn("undefined audio clip: " + name);
			}
		}
	}

	static updateVolume(volume = this.volume) {
		if (volume > 1) {
			volume = 1;
		}
		if (volume < 0) {
			volume = 0;
		}
		this.volume = volume;
		//console.log("changing volume");
		for (let i = 0; i < Object.keys(this.audioClips).length; i++) {
			let name = Object.keys(this.audioClips)[i];
			this.audioClips[name].volume = volume;
		}
	}

	/**
	 * @param {string} name
	 * @param {boolean} loops - does the audio loop (default: false)
	 */
	static play(name, loops = false) {
		if (this.muted) return;
		try {
			this.audioClips[name].play();
			this.audioClips[name].loop = loops;
			this.audioClips[name].currentTime = 0;
			//console.log("played audio: " + name);
		} catch {
			console.warn("undefined audio clip: " + name);
		}
	}
}