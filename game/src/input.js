// Keeper's Soup — input. Mouse clicks on the counter, the pot, the plate and
// the bottle orders; keyboard 1-9 for ingredients, Space to ladle, D to dump,
// M to mute, Enter to start. Every click is resolved against the same layout
// the renderer draws, so what you see is what you can touch.

import { INGREDIENTS } from './config.js';
import { ingredientRects, orderRects, LAYOUT } from './render.js';
import {
  addIngredient, dumpPot, ladleToPlate, serveOrder, startDay,
} from './world.js';
import { toggleMute } from './audio.js';

function inside(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

// Translate a DOM mouse event into the game's 1280x720 coordinates.
export function toGameCoords(canvas, ev) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((ev.clientX - rect.left) / rect.width) * 1280,
    y: ((ev.clientY - rect.top) / rect.height) * 720,
  };
}

export function handleClick(state, canvas, ev, mutedState) {
  const { x, y } = toGameCoords(canvas, ev);
  if (inside(x, y, LAYOUT.muteBtn)) {
    mutedState.muted = toggleMute();
    return;
  }
  if (state.phase === 'title') {
    if (inside(x, y, LAYOUT.startBtn)) startDay(state);
    return;
  }
  if (state.phase === 'dayover') {
    if (inside(x, y, LAYOUT.againBtn)) startDay(state);
    return;
  }
  // The pot or the plate: click either to ladle a finished soup onto the plate.
  if (inside(x, y, LAYOUT.pot) || inside(x, y, LAYOUT.plate)) {
    if (state.potReady) ladleToPlate(state);
    return;
  }
  // The dump button.
  if (inside(x, y, LAYOUT.dump)) { dumpPot(state); return; }
  // A bottle order: serve the plated soup to it.
  for (const r of orderRects(state)) {
    if (inside(x, y, r)) { serveOrder(state, r.id); return; }
  }
  // An ingredient crate on the counter.
  for (const r of ingredientRects()) {
    if (inside(x, y, r)) { addIngredient(state, r.id); return; }
  }
}

export function handleKey(state, ev, mutedState) {
  const k = ev.key.toLowerCase();
  if (k === 'm') { mutedState.muted = toggleMute(); return; }
  if (state.phase === 'title' && (k === 'enter' || k === ' ')) { startDay(state); return; }
  if (state.phase === 'dayover' && (k === 'enter' || k === ' ')) { startDay(state); return; }
  if (state.phase !== 'play') return;
  const ing = INGREDIENTS.find((i) => i.key === k);
  if (ing) { addIngredient(state, ing.id); return; }
  if (k === ' ') { ev.preventDefault(); ladleToPlate(state); return; }
  if (k === 'd') { dumpPot(state); return; }
  // Number keys on the orders are not bound: serving is a click on a bottle,
  // so the player looks at the board instead of memorising order numbers.
}
