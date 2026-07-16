let currentUtterance = null;

class SpeechService {

    constructor() {
        this.enabled = true;
        this.rate = 1;
        this.pitch = 1;
        this.volume = 1;
    }

    speak(text) {

        if (!this.enabled || !text) {
            return;
        }

        // Stop previous speech
        window.speechSynthesis.cancel();

        currentUtterance = new SpeechSynthesisUtterance(text);

        currentUtterance.rate = this.rate;
        currentUtterance.pitch = this.pitch;
        currentUtterance.volume = this.volume;

        window.speechSynthesis.speak(currentUtterance);
    }

    stop() {
        window.speechSynthesis.cancel();
    }

    setEnabled(enabled) {
        this.enabled = enabled;

        if (!enabled) {
            this.stop();
        }
    }

    setRate(rate) {
        this.rate = rate;
    }

    setVolume(volume) {
        this.volume = volume;
    }

    setPitch(pitch) {
        this.pitch = pitch;
    }

    toggleMute() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stop();
        }
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }
    }

export default new SpeechService();