//Util Imports
import { Util } from "./Util.js";

//Audio Player class
export class AudioPlayer {
	static muted = false;
	static volume = 0.5;

	static audioPaths = {
		"ambience": "/audio/ambience.mp3",
		"die": "/audio/die.mp3",
		"door": "/audio/door.mp3",
		"lose": "/audio/lose.mp3",
		"slime": "/audio/slime.mp3",
		"step": "/audio/step.mp3",
		"swordSwing": "/audio/swordSwing.mp3",
		"upgrade": "/audio/upgrade.mp3",
		"win": "/audio/win.mp3",
		"effigyWake": "/audio/effigyWake.mp3",
		"glassShatter": "/audio/glassShatter.mp3",
		"maceHit": "/audio/maceHit.mp3",
		"maceEquip": "/audio/maceEquip.mp3"
	};

	static relativeVolume = {
		"ambience": 1,
		"die": 0.6,
		"door": 0.4,
		"lose": 0.6,
		"slime": 0.7,
		"step": 0.4,
		"swordSwing": 0.1,
		"upgrade": 0.2,
		"win": 0.7,
		"effigyWake": 1,
		"glassShatter": 1,
		"maceHit": 1,
		"maceEquip": 1
	}

	static currentAudio = [];
	

	static pauseAll() {
		//Delete finished audio
		for (let i = this.currentAudio.length - 1; i >= 0; i--) {
			this.currentAudio[i].pause();
			this.currentAudio[i].srcObj = null
			Util.delIndex(this.currentAudio, i);
		}
		this.currentAudio = [];
	}

	static mute() {
		this.muted = true;
		for (let i = 0; i < this.currentAudio.length; i++) {
			this.currentAudio[i].volume = 0;
		}
	}

	static unMute() {
		this.muted = false;
		for (let i = 0; i < this.currentAudio.length; i++) {
			this.currentAudio[i].volume = this.volume * this.relativeVolume[this.currentAudio[i].name];
		}
	}

	static toggleMute() {
		this.muted = !this.muted;
		if (this.muted) {
			this.mute();
		} else {
			this.unMute();
		}
	}

	static updateVolume(volume = this.volume) {
		if (volume > 1) {
			volume = 1;
		}
		if (this.volume < 0) {
			volume = 0;
		}
		this.volume = volume;
		//console.log("changing volume");
		for (let i = 0; i < this.currentAudio.length; i++) {
			this.currentAudio[i].volume = this.volume * this.relativeVolume[this.currentAudio[i].name];
		}
	}

	/**
	 * @param {string} name
	 * @param {boolean} loops - does the audio loop (default: false)
	 */
	static play(name, loops = false) {
		if (this.audioPaths[name] == undefined) {
			console.warn("Unrecognized Audio: " + name);
			return;
		}
		this.currentAudio.push(new Audio(this.audioPaths[name]));
		let newAudio = this.currentAudio[this.currentAudio.length - 1];
		newAudio.name = name;
		newAudio.loop = loops;
		newAudio.volume = this.volume * this.relativeVolume[name];
		if (this.muted) newAudio.volume = 0;
		newAudio.play();
	}

	static update() {
		  
		//Delete finished audio
		for (let i = this.currentAudio.length - 1; i >= 0; i--) {
			if (this.currentAudio[i].ended) {
				this.currentAudio[i].srcObj = null
				Util.delIndex(this.currentAudio, i);
			}
		}
	}
}