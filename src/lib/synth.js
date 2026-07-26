/**
 * Tiny Web Audio melody player used as a graceful fallback when the mp3 files
 * in /public are missing (so the jukebox never silently does nothing).
 * No external libraries, no CDN, no audio files.
 */
export function createMelodyPlayer(notes, tempo = 0.42) {
  let ctx = null;
  let timer = null;
  let stopped = true;

  const start = (onEnded) => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ctx = ctx || new Ctx();
    stopped = false;
    let i = 0;

    const step = () => {
      if (stopped || !ctx) return;
      if (i >= notes.length) {
        stopped = true;
        if (onEnded) onEnded();
        return;
      }
      const freq = notes[i++];
      if (freq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + tempo);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + tempo + 0.05);
      }
      timer = window.setTimeout(step, tempo * 1000);
    };

    step();
  };

  const stop = () => {
    stopped = true;
    if (timer) window.clearTimeout(timer);
    timer = null;
  };

  return { start, stop };
}

// Two gentle romantic phrases (Hz), used per track.
export const MELODY_A = [523, 587, 659, 784, 659, 587, 523, 0, 440, 494, 523, 659, 587, 0];
export const MELODY_B = [392, 440, 494, 523, 587, 523, 494, 0, 440, 392, 349, 392, 440, 0];
