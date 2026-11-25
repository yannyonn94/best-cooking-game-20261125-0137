// Keeper's Soup — entry point. Owns the canvas, the clock and the wiring:
// one requestAnimationFrame loop, one tick of the kitchen per frame, one draw
// of the scene. Also honours ?shot= for staged screenshots (see shots.js),
// so the maker's screenshots are real renders of this same code.

import { VIEW_W, VIEW_H } from './config.js';
import { newGame, tick } from './world.js';
import { drawScene } from './render.js';
import { handleClick, handleKey } from './input.js';
import { ensureAudio } from './audio.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed') || '1') || 1;
const state = newGame(seed);
const mutedState = { muted: false };

const canvas = document.getElementById('game');
canvas.width = VIEW_W;
canvas.height = VIEW_H;
const ctx = canvas.getContext('2d');

canvas.addEventListener('click', (ev) => {
  ensureAudio();
  handleClick(state, canvas, ev, mutedState);
});
window.addEventListener('keydown', (ev) => {
  ensureAudio();
  handleKey(state, ev, mutedState);
});

// A staged screenshot (?shot=start|play|end) sets the kitchen to a fixed,
// busy, mid-action moment before the first frame is drawn. ?shot=start shows
// the title screen over a kitchen that already has its first bottle.
const shot = params.get('shot');
if (shot) stageShot(state, shot);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  // Staged shots freeze the clock: the screenshot is one held moment.
  if (!shot) tick(state, dt);
  drawScene(ctx, state, mutedState.muted);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
