// Keeper's Soup — sound. Every cue is synthesised with WebAudio at run time:
// no audio files, no network, nothing to download. Sounds are short and quiet
// by design; the game must stay playable with them off.

let ctx = null;
let muted = false;

export function ensureAudio() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() { return muted; }

function tone(freq, dur, type, vol, when = 0, slideTo = null) {
  if (muted) return;
  const ac = ensureAudio();
  if (!ac) return;
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// A soft plop when an ingredient lands in the pot.
export function playPlop() { tone(320, 0.12, 'sine', 0.16, 0, 140); }

// The pot starts to boil: two rising notes.
export function playBoil() {
  tone(392, 0.14, 'triangle', 0.12, 0, 523);
  tone(523, 0.18, 'triangle', 0.12, 0.12, 659);
}

// A served dish: a small warm arpeggio.
export function playServe() {
  tone(523, 0.12, 'triangle', 0.14);
  tone(659, 0.12, 'triangle', 0.14, 0.09);
  tone(784, 0.22, 'triangle', 0.16, 0.18);
}

// A wrong ingredient: a low dull thud.
export function playWrong() { tone(160, 0.2, 'square', 0.07, 0, 110); }

// An order lost to the tide: a falling note.
export function playLost() { tone(330, 0.5, 'sine', 0.12, 0, 165); }

// The storm rush arrives: a short rumble.
export function playStorm() {
  tone(98, 0.5, 'sawtooth', 0.05, 0, 65);
  tone(147, 0.4, 'sawtooth', 0.04, 0.15, 98);
}

// The day ends: a gentle lighthouse bell, three strikes.
export function playBell() {
  tone(880, 0.5, 'sine', 0.12);
  tone(880, 0.5, 'sine', 0.10, 0.55);
  tone(880, 0.8, 'sine', 0.12, 1.1);
}
