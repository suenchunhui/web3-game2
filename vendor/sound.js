//const ctx = new (window.AudioContext || window.webkitAudioContext)();
//const ctx = new AudioContext();

const createOscillator = (ctx, freq) => {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.detune.value = 0;
  osc.start(ctx.currentTime);
  return osc;
};

const createGainNode = (ctx) => {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(ctx.destination);
  return gainNode;
};

function Sound(ctx, freq) {
console.log("d1", ctx, freq)

    this.oscillatorNode = createOscillator(ctx, freq);
    this.gainNode = createGainNode(ctx);
    this.oscillatorNode.connect(this.gainNode);
}

Sound.prototype = {
  start() {
    // can't explain 0.3, it is a reasonable value
    this.gainNode.gain.value = 0.3;
  },

  stop() {
    this.gainNode.gain.value = 0;
  }
};

module.exports = Sound;
