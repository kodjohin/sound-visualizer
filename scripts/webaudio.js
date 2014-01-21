var WebAudio = (new function () {

// Start off by initializing a new context.
    var contextClass = (window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext);
    if (contextClass) {
// Web Audio API is available.
        this.ctx = new contextClass();
    }

    this.analyser = this.ctx.createAnalyser();
    this.source     = this.ctx.createBufferSource();
    this.startTime  = this.ctx.currentTime;
    this.analyser.connect(this.ctx.destination);

    this.isPlaying = false;
    this.isFinished = false;
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
    this.times = new Uint8Array(this.analyser.frequencyBinCount);


    // Connect graph
    this.source.connect(this.analyser);

    Object.defineProperties(this, {
        SMOOTHING: {
            set: function (smoothing) {
                this.analyser.smoothingTimeConstant = smoothing || 0.8;
            }
        },
        FFT_SIZE: {
            set: function (fft_size) {
                this.analyser.fftSize = fft_size || 2048;
            }
        },
        MIN_DECIBELS: {
            set: function (minDecibels) {
                this.analyser.minDecibels = minDecibels || -140;
            }
        },
        MAX_DECIBELS: {
            set: function (maxDecibels) {
                this.analyser.maxDecibels = maxDecibels || 0;
            }
        },
        // Get the frequency and time data from the currently playing music
        timeData: {
            get: function () {
                return this.analyser.getByteTimeDomainData(this.times);
            }
        },
        frequencyData: {
            get: function () {
                return this.analyser.getByteFrequencyData(this.freqs);
            }
        },
        frequencyBinCount: {
            get: function () {
                return this.analyser.frequencyBinCount;
            }
        }
    })
});