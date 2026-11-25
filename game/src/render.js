// Keeper's Soup — rendering. All art is drawn with canvas shapes in code: no
// image files, no fonts to download, nothing over the network. The palette is
// a stormy teal sea against warm wood and lantern amber — no violet, no
// gradient text, no glass. Every label is dark-on-light or cream-on-dark at
// 4.5:1 or better.

import { VIEW_W, VIEW_H, INGREDIENTS, RECIPES } from './config.js';
import { ingredientById } from './world.js';

export const LAYOUT = {
  topBar: { x: 0, y: 0, w: VIEW_W, h: 64 },
  board: { x: 24, y: 84, w: 296, h: 452 },
  pot: { x: 470, y: 300, w: 260, h: 190 },
  plate: { x: 800, y: 330, w: 220, h: 150 },
  counter: { x: 24, y: 556, w: 1232, h: 140 },
  dump: { x: 1060, y: 330, w: 120, h: 44 },
  startBtn: { x: 490, y: 520, w: 300, h: 64 },
  againBtn: { x: 490, y: 420, w: 300, h: 64 },
  muteBtn: { x: 1212, y: 12, w: 52, h: 40 },
};

// Ingredient crate rectangles, computed from the counter row.
export function ingredientRects() {
  const rects = [];
  const { x, y, w, h } = LAYOUT.counter;
  const gap = 10;
  const cw = (w - gap * (INGREDIENTS.length - 1)) / INGREDIENTS.length;
  INGREDIENTS.forEach((ing, i) => {
    rects.push({ id: ing.id, x: x + i * (cw + gap), y: y + 8, w: cw, h: h - 16 });
  });
  return rects;
}

// Order card rectangles on the board, top to bottom.
export function orderRects(state) {
  const rects = [];
  const { x, y, w } = LAYOUT.board;
  state.orders.forEach((order, i) => {
    rects.push({ id: order.id, x: x + 12, y: y + 44 + i * 108, w: w - 24, h: 96 });
  });
  return rects;
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, weight = '600', align = 'left', font = 'system-ui, sans-serif') {
  ctx.fillStyle = color;
  ctx.font = weight + ' ' + size + 'px ' + font;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}

// Shorten a line with an ellipsis so it never collides with a neighbour.
function truncate(ctx, s, maxWidth, size, weight = '600', font = 'system-ui, sans-serif') {
  ctx.font = weight + ' ' + size + 'px ' + font;
  if (ctx.measureText(s).width <= maxWidth) return s;
  let out = s;
  while (out.length > 1 && ctx.measureText(out + '…').width > maxWidth) out = out.slice(0, -1);
  return out + '…';
}

// ---- ingredient icons, drawn from shapes ----

export function drawIngredientIcon(ctx, id, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  const u = s / 2;
  if (id === 'potato') {
    ctx.fillStyle = '#C9A25E';
    ctx.beginPath(); ctx.ellipse(0, 0, u * 0.9, u * 0.7, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8A6D2B';
    ctx.beginPath(); ctx.arc(-u * 0.3, -u * 0.1, u * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(u * 0.25, u * 0.2, u * 0.09, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'carrot') {
    ctx.fillStyle = '#3E7A4E';
    ctx.beginPath(); ctx.moveTo(-u * 0.25, -u * 0.7); ctx.lineTo(0, -u * 1.15); ctx.lineTo(u * 0.25, -u * 0.7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#E8722A';
    ctx.beginPath(); ctx.moveTo(-u * 0.55, -u * 0.65); ctx.lineTo(u * 0.55, -u * 0.65); ctx.lineTo(0, u * 0.95); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#8A3E10'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-u * 0.3, -u * 0.2); ctx.lineTo(u * 0.3, -u * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-u * 0.18, u * 0.2); ctx.lineTo(u * 0.18, u * 0.2); ctx.stroke();
  } else if (id === 'onion') {
    ctx.fillStyle = '#F2E8D5';
    ctx.beginPath(); ctx.arc(0, u * 0.1, u * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#9A8A6A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, u * 0.1, u * 0.55, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, u * 0.1, u * 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#3E7A4E';
    ctx.beginPath(); ctx.moveTo(0, -u * 0.7); ctx.lineTo(-u * 0.2, -u * 1.05); ctx.lineTo(u * 0.2, -u * 1.05); ctx.closePath(); ctx.fill();
  } else if (id === 'fish') {
    ctx.fillStyle = '#7FB3C8';
    ctx.beginPath(); ctx.ellipse(0, 0, u * 0.95, u * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-u * 0.8, 0); ctx.lineTo(-u * 1.3, -u * 0.45); ctx.lineTo(-u * 1.3, u * 0.45); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#12303C';
    ctx.beginPath(); ctx.arc(u * 0.55, -u * 0.08, u * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2E5A6E'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(u * 0.1, -u * 0.45); ctx.lineTo(u * 0.1, u * 0.45); ctx.stroke();
  } else if (id === 'clam') {
    ctx.fillStyle = '#C9A8C9';
    ctx.beginPath(); ctx.arc(0, u * 0.1, u * 0.85, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#8A6A8A';
    ctx.beginPath(); ctx.ellipse(0, u * 0.1, u * 0.85, u * 0.22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#6E4A6E'; ctx.lineWidth = 2;
    for (let k = -1; k <= 1; k++) {
      ctx.beginPath(); ctx.moveTo(k * u * 0.35, -u * 0.65); ctx.lineTo(k * u * 0.2, u * 0.05); ctx.stroke();
    }
  } else if (id === 'seaweed') {
    ctx.strokeStyle = '#3E7A4E'; ctx.lineWidth = u * 0.22; ctx.lineCap = 'round';
    for (let k = -1; k <= 1; k++) {
      ctx.beginPath();
      ctx.moveTo(k * u * 0.5, u * 0.9);
      ctx.quadraticCurveTo(k * u * 0.9, 0, k * u * 0.4, -u * 0.9);
      ctx.stroke();
    }
    ctx.fillStyle = '#7FB069';
    ctx.beginPath(); ctx.arc(-u * 0.5, -u * 0.85, u * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(u * 0.5, -u * 0.95, u * 0.14, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'tomato') {
    ctx.fillStyle = '#D43D2A';
    ctx.beginPath(); ctx.arc(0, u * 0.1, u * 0.85, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3E7A4E';
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(0, -u * 0.7);
      ctx.lineTo(Math.cos(a) * u * 0.35, -u * 0.7 + Math.sin(a) * u * 0.35);
      ctx.lineTo(Math.cos(a + 0.6) * u * 0.2, -u * 0.7 + Math.sin(a + 0.6) * u * 0.2);
      ctx.closePath(); ctx.fill();
    }
  } else if (id === 'mushroom') {
    ctx.fillStyle = '#D8CFC0';
    ctx.fillRect(-u * 0.22, -u * 0.1, u * 0.44, u * 0.9);
    ctx.fillStyle = '#B0563A';
    ctx.beginPath(); ctx.arc(0, -u * 0.1, u * 0.85, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#FFF3D6';
    ctx.beginPath(); ctx.arc(-u * 0.4, -u * 0.45, u * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(u * 0.3, -u * 0.6, u * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'chili') {
    ctx.strokeStyle = '#C22E1E'; ctx.lineWidth = u * 0.42; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-u * 0.7, -u * 0.6); ctx.quadraticCurveTo(-u * 0.9, u * 0.6, u * 0.6, u * 0.7); ctx.stroke();
    ctx.strokeStyle = '#3E7A4E'; ctx.lineWidth = u * 0.2;
    ctx.beginPath(); ctx.moveTo(-u * 0.7, -u * 0.6); ctx.quadraticCurveTo(-u * 0.5, -u * 1.0, -u * 0.15, -u * 0.95); ctx.stroke();
  }
  ctx.restore();
}

// ---- the kitchen scene ----

function drawTopBar(ctx, state, muted) {
  const b = LAYOUT.topBar;
  ctx.fillStyle = '#12303C';
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.fillStyle = '#E8A33D';
  ctx.fillRect(b.x, b.y + b.h - 4, b.w, 4);
  text(ctx, "KEEPER'S SOUP", 24, 42, 28, '#FFF3D6', '800', 'left', "Georgia, 'Times New Roman', serif");
  text(ctx, 'Lighthouse Kitchen', 250, 42, 15, '#BFD9DE', '600');
  text(ctx, 'Score  ' + state.score, 560, 42, 20, '#FFF3D6', '700');
  text(ctx, 'Coins  ' + state.coins, 700, 42, 20, '#E8C87A', '700');
  // Hearts, drawn as small filled shapes (no emoji).
  for (let i = 0; i < 3; i++) {
    const cx = 830 + i * 34, cy = 34;
    ctx.fillStyle = i < state.hearts ? '#D43D2A' : '#3A5A66';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 9);
    ctx.bezierCurveTo(cx - 13, cy - 4, cx - 7, cy - 14, cx, cy - 6);
    ctx.bezierCurveTo(cx + 7, cy - 14, cx + 13, cy - 4, cx, cy + 9);
    ctx.fill();
  }
  const comboLabel = state.combo > 1 ? 'COMBO x' + state.combo : 'COMBO x1';
  ctx.fillStyle = state.combo > 1 ? '#E8A33D' : '#7A9AA3';
  rr(ctx, 940, 14, 118, 36, 8); ctx.fill();
  text(ctx, comboLabel, 999, 38, 18, '#12303C', '800', 'center');
  text(ctx, 'Day ' + Math.min(12, state.served + state.lost + (state.phase === 'play' ? 1 : 0)) + ' / 12 orders', 1080, 30, 14, '#BFD9DE', '600', 'left');
  text(ctx, 'Served ' + state.served + '  Lost ' + state.lost, 1080, 50, 14, '#BFD9DE', '600', 'left');
  // Mute button: a small speaker drawn from shapes.
  const m = LAYOUT.muteBtn;
  ctx.fillStyle = '#1E4A58';
  rr(ctx, m.x, m.y, m.w, m.h, 8); ctx.fill();
  ctx.fillStyle = '#FFF3D6';
  ctx.fillRect(m.x + 12, m.y + 16, 8, 9);
  ctx.beginPath(); ctx.moveTo(m.x + 20, m.y + 11); ctx.lineTo(m.x + 30, m.y + 6); ctx.lineTo(m.x + 30, m.y + 34); ctx.lineTo(m.x + 20, m.y + 29); ctx.closePath(); ctx.fill();
  if (muted) {
    ctx.strokeStyle = '#D43D2A'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(m.x + 34, m.y + 10); ctx.lineTo(m.x + 46, m.y + 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(m.x + 46, m.y + 10); ctx.lineTo(m.x + 34, m.y + 30); ctx.stroke();
  }
}

function drawBoard(ctx, state) {
  const b = LAYOUT.board;
  ctx.fillStyle = '#6B4423';
  rr(ctx, b.x, b.y, b.w, b.h, 12); ctx.fill();
  ctx.fillStyle = '#8A5A33';
  rr(ctx, b.x + 6, b.y + 6, b.w - 12, b.h - 12, 8); ctx.fill();
  text(ctx, 'ORDER BOARD — bottles from the sea', b.x + 16, b.y + 30, 15, '#FFF3D6', '800');
  if (state.orders.length === 0 && state.phase === 'play') {
    text(ctx, 'No bottles… the tide is thinking.', b.x + 16, b.y + 80, 15, '#E8D9B0', '600');
  }
  orderRects(state).forEach((r, i) => {
    const order = state.orders[i];
    const frac = Math.max(0, order.left / order.patience);
    ctx.fillStyle = '#FFF3D6';
    rr(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
    ctx.fillStyle = order.storm ? '#8A1E12' : '#12303C';
    rr(ctx, r.x, r.y, r.w, 26, 10); ctx.fill();
    ctx.fillRect(r.x, r.y + 16, r.w, 10);
    text(ctx, (order.storm ? 'STORM ORDER  ' : 'BOTTLE #' + order.id + '  ') + order.sailor.name, r.x + 10, r.y + 19, 13, '#FFF3D6', '800');
    text(ctx, order.recipe.name, r.x + 10, r.y + 48, 19, '#12303C', '800');
    const blurb = truncate(ctx, 'from ' + order.sailor.ship + ' — ' + order.recipe.blurb, r.w - 78, 12, '600');
    text(ctx, blurb, r.x + 10, r.y + 68, 12, '#3A5A66', '600');
    // Patience bar: the tide timer you can feel.
    ctx.fillStyle = '#D8CFC0';
    rr(ctx, r.x + 10, r.y + 78, r.w - 20, 10, 5); ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#3E7A4E' : frac > 0.25 ? '#E8A33D' : '#D43D2A';
    rr(ctx, r.x + 10, r.y + 78, Math.max(12, (r.w - 20) * frac), 10, 5); ctx.fill();
    text(ctx, Math.ceil(order.left) + 's left', r.x + r.w - 10, r.y + 68, 12, frac > 0.25 ? '#3A5A66' : '#D43D2A', '800', 'right');
  });
  text(ctx, 'Click a bottle to serve the plated soup.', b.x + 16, b.y + b.h - 12, 12, '#E8D9B0', '600');
}

function drawKitchen(ctx, state) {
  // Window on the storm sea, top right of the kitchen wall.
  ctx.fillStyle = '#0E2A33';
  ctx.fillRect(340, 84, 916, 200);
  ctx.fillStyle = '#123B45';
  ctx.fillRect(352, 96, 892, 176);
  // Rain streaks.
  ctx.strokeStyle = 'rgba(191, 217, 222, 0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const rx = 380 + ((i * 67) % 840);
    const ry = 110 + ((i * 37) % 130);
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 8, ry + 22); ctx.stroke();
  }
  // The lighthouse beam sweeping the water.
  const beam = (state.time * 0.6) % (Math.PI * 2);
  ctx.save();
  ctx.translate(1200, 130);
  ctx.rotate(Math.sin(beam) * 0.5);
  ctx.fillStyle = 'rgba(232, 163, 61, 0.20)';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-260, -46); ctx.lineTo(-260, 46); ctx.closePath(); ctx.fill();
  ctx.restore();
  // Lighthouse silhouette on the rocks.
  ctx.fillStyle = '#0A1E26';
  ctx.fillRect(1120, 150, 60, 122);
  ctx.fillStyle = '#E8A33D';
  ctx.beginPath(); ctx.arc(1150, 148, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0A1E26';
  ctx.beginPath(); ctx.moveTo(1100, 272); ctx.lineTo(1200, 272); ctx.lineTo(1244, 200); ctx.lineTo(1060, 200); ctx.closePath(); ctx.fill();
  text(ctx, 'THE STORM SEA — 40 years of lost sailors', 372, 140, 13, '#BFD9DE', '700');
  text(ctx, 'Every bottle is a sailor asking for one hot soup.', 372, 266, 13, '#BFD9DE', '600');

  // The stove and the copper pot, centre stage.
  const p = LAYOUT.pot;
  ctx.fillStyle = '#2A2018';
  rr(ctx, p.x - 20, p.y + 130, p.w + 40, 26, 8); ctx.fill();
  ctx.fillStyle = '#8A6D2B';
  ctx.fillRect(p.x - 20, p.y + 130, p.w + 40, 6);
  // Pot body.
  ctx.fillStyle = '#B0703A';
  ctx.beginPath(); ctx.ellipse(p.x + p.w / 2, p.y + 78, p.w / 2, 62, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8A4E22';
  ctx.beginPath(); ctx.ellipse(p.x + p.w / 2, p.y + 78, p.w / 2 - 14, 50, 0, 0, Math.PI * 2); ctx.fill();
  // Soup surface: colour follows what is in the pot.
  const soupColor = state.potReady
    ? '#E8A33D'
    : state.pot.length === 0 ? '#5A3A1E' : '#7A5A2E';
  ctx.fillStyle = soupColor;
  ctx.beginPath(); ctx.ellipse(p.x + p.w / 2, p.y + 52, p.w / 2 - 26, 26, 0, 0, Math.PI * 2); ctx.fill();
  // Steam curls when cooking or ready.
  if (state.potCooking > 0 || state.potReady) {
    ctx.strokeStyle = 'rgba(255, 243, 214, 0.75)';
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) {
      const sx = p.x + 70 + k * 60;
      const sway = Math.sin(state.time * 2 + k * 2) * 10;
      ctx.beginPath();
      ctx.moveTo(sx, p.y + 20);
      ctx.quadraticCurveTo(sx + sway, p.y - 20, sx - sway, p.y - 52);
      ctx.stroke();
    }
  }
  // Ingredients bobbing in the pot.
  state.pot.forEach((id, i) => {
    drawIngredientIcon(ctx, id, p.x + 60 + i * 70, p.y + 52, 44);
  });
  // Cook progress ring around the pot.
  if (state.potCooking > 0) {
    const frac = 1 - state.potCooking / 6;
    ctx.strokeStyle = '#E8A33D'; ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + 78, p.w / 2 + 16, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
    text(ctx, Math.ceil(state.potCooking) + 's', p.x + p.w / 2, p.y + 170, 20, '#FFF3D6', '800', 'center');
  }
  if (state.potReady) {
    const recipe = RECIPES.find((r) => r.id === state.potReady);
    text(ctx, recipe.name + ' — READY! Click the pot to ladle.', p.x + p.w / 2, p.y + 170, 17, '#E8A33D', '800', 'center');
  } else if (state.pot.length > 0 && state.potCooking <= 0) {
    text(ctx, state.pot.length + ' / 3 in the pot — add more!', p.x + p.w / 2, p.y + 170, 15, '#FFF3D6', '700', 'center');
  } else if (state.pot.length === 0) {
    text(ctx, 'Empty pot — click 3 ingredients below.', p.x + p.w / 2, p.y + 170, 15, '#BFD9DE', '600', 'center');
  }

  // The serving plate.
  const pl = LAYOUT.plate;
  ctx.fillStyle = '#8A5A33';
  rr(ctx, pl.x - 8, pl.y - 8, pl.w + 16, pl.h + 16, 12); ctx.fill();
  ctx.fillStyle = '#FFF3D6';
  ctx.beginPath(); ctx.ellipse(pl.x + pl.w / 2, pl.y + pl.h / 2 + 10, pl.w / 2 - 8, 52, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#C9A25E'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(pl.x + pl.w / 2, pl.y + pl.h / 2 + 10, pl.w / 2 - 22, 40, 0, 0, Math.PI * 2); ctx.stroke();
  if (state.plate) {
    const recipe = RECIPES.find((r) => r.id === state.plate);
    recipe.needs.forEach((id, i) => {
      drawIngredientIcon(ctx, id, pl.x + 55 + i * 55, pl.y + 62, 40);
    });
    text(ctx, recipe.name, pl.x + pl.w / 2, pl.y + 132, 16, '#12303C', '800', 'center');
    text(ctx, 'READY TO SERVE — click a bottle!', pl.x + pl.w / 2, pl.y - 14, 14, '#E8A33D', '800', 'center');
  } else {
    text(ctx, 'SERVING PLATE', pl.x + pl.w / 2, pl.y + 60, 16, '#7A6A52', '800', 'center');
    text(ctx, 'empty', pl.x + pl.w / 2, pl.y + 86, 14, '#7A6A52', '600', 'center');
  }

  // Dump button.
  const d = LAYOUT.dump;
  ctx.fillStyle = '#5A3A1E';
  rr(ctx, d.x, d.y, d.w, d.h, 8); ctx.fill();
  text(ctx, 'DUMP POT', d.x + d.w / 2, d.y + 28, 15, '#FFF3D6', '800', 'center');

  // Storm banner.
  if (state.storm) {
    ctx.fillStyle = '#8A1E12';
    rr(ctx, 340, 296, 300, 36, 8); ctx.fill();
    text(ctx, 'STORM RUSH — patience is short!', 490, 320, 16, '#FFF3D6', '800', 'center');
  }

  // Recipe book pinned on the wall: the 5 soups, always visible.
  ctx.fillStyle = '#FFF3D6';
  rr(ctx, 1060, 392, 196, 148, 10); ctx.fill();
  text(ctx, 'RECIPE BOOK', 1158, 416, 14, '#12303C', '800', 'center');
  RECIPES.forEach((r, i) => {
    const y = 438 + i * 20;
    text(ctx, truncate(ctx, r.name, 132, 12, '700'), 1072, y, 12, '#12303C', '700');
    r.needs.forEach((id, k) => {
      const ing = ingredientById(id);
      ctx.fillStyle = ing.color;
      ctx.beginPath(); ctx.arc(1214 + k * 16, y - 4, 6, 0, Math.PI * 2); ctx.fill();
    });
  });
}

function drawCounter(ctx, state) {
  const c = LAYOUT.counter;
  ctx.fillStyle = '#5A3A1E';
  rr(ctx, c.x, c.y, c.w, c.h, 12); ctx.fill();
  ctx.fillStyle = '#8A5A33';
  rr(ctx, c.x + 6, c.y + 6, c.w - 12, c.h - 12, 8); ctx.fill();
  text(ctx, 'INGREDIENTS — click, or press 1–9', c.x + 16, c.y + 20, 14, '#FFF3D6', '800');
  ingredientRects().forEach((r) => {
    const ing = ingredientById(r.id);
    const inPot = state.pot.includes(r.id);
    ctx.fillStyle = inPot ? '#3E7A4E' : '#FFF3D6';
    rr(ctx, r.x, r.y + 24, r.w, r.h - 30, 10); ctx.fill();
    drawIngredientIcon(ctx, r.id, r.x + r.w / 2, r.y + 62, 50);
    text(ctx, ing.name, r.x + r.w / 2, r.y + 98, 14, inPot ? '#FFF3D6' : '#12303C', '800', 'center');
    text(ctx, '[' + ing.key + ']', r.x + r.w / 2, r.y + 114, 12, inPot ? '#D8E8D0' : '#3A5A66', '700', 'center');
    if (inPot) text(ctx, 'IN POT', r.x + r.w / 2, r.y + 40, 11, '#FFF3D6', '800', 'center');
  });
}

function drawMessage(ctx, state) {
  if (!state.message) return;
  const age = state.time - state.messageAt;
  if (age > 4) return;
  ctx.fillStyle = 'rgba(18, 48, 60, 0.92)';
  ctx.font = '700 17px system-ui, sans-serif';
  const w = Math.min(700, ctx.measureText(state.message).width + 120);
  rr(ctx, (VIEW_W - w) / 2, 76, w, 40, 10); ctx.fill();
  text(ctx, state.message, VIEW_W / 2, 102, 17, '#FFF3D6', '700', 'center');
}

// ---- screens ----

function drawTitle(ctx, state) {
  ctx.fillStyle = 'rgba(10, 30, 38, 0.82)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#FFF3D6';
  rr(ctx, 290, 80, 700, 520, 16); ctx.fill();
  text(ctx, "KEEPER'S SOUP", 640, 160, 56, '#12303C', '800', 'center', "Georgia, 'Times New Roman', serif");
  text(ctx, 'A lighthouse kitchen, a storm sea, and 40 years of lost sailors.', 640, 195, 18, '#3A5A66', '600', 'center');
  const lines = [
    'Bottles wash up with soup orders from shipwrecked sailors.',
    'Click 3 ingredients into the copper pot, let it boil, ladle it out,',
    'and click the bottle to serve before the tide takes them.',
    '',
    '5 soups · 9 ingredients · 12 orders a day · storm rush every 5th order',
    'Serve fast to build a combo up to x4. Lose 3 sailors and the day ends.',
    '',
    'Mouse: click ingredients, pot, plate and bottles. Keys: 1–9 ingredients,',
    'Space ladles the pot, D dumps it, M mutes the sound.',
  ];
  lines.forEach((line, i) => {
    text(ctx, line, 640, 235 + i * 26, 16, '#12303C', line === '' ? '400' : '600', 'center');
  });
  const b = LAYOUT.startBtn;
  ctx.fillStyle = '#E8A33D';
  rr(ctx, b.x, b.y, b.w, b.h, 12); ctx.fill();
  text(ctx, 'LIGHT THE STOVE — START DAY', b.x + b.w / 2, b.y + 41, 22, '#12303C', '800', 'center');
  text(ctx, 'Click, or press Enter', 640, 588, 14, '#3A5A66', '600', 'center');
}

function drawDayOver(ctx, state) {
  ctx.fillStyle = 'rgba(10, 30, 38, 0.82)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#FFF3D6';
  rr(ctx, 340, 100, 600, 470, 16); ctx.fill();
  const won = state.hearts > 0;
  text(ctx, won ? 'THE LIGHT STAYS LIT' : 'THE TIDE WON TODAY', 640, 175, 34, '#12303C', '800', 'center', "Georgia, 'Times New Roman', serif");
  if (won) {
    text(ctx, 'Every sailor who could be fed, was fed.', 640, 208, 16, '#3A5A66', '600', 'center');
    text(ctx, 'The bottles will come again tomorrow.', 640, 232, 16, '#3A5A66', '600', 'center');
  } else {
    text(ctx, 'Three sailors were lost to the tide.', 640, 208, 16, '#3A5A66', '600', 'center');
    text(ctx, 'The keeper lights the stove again at dawn.', 640, 232, 16, '#3A5A66', '600', 'center');
  }
  text(ctx, 'SCORE  ' + state.score, 640, 300, 30, '#12303C', '800', 'center');
  text(ctx, 'Served ' + state.served + '  ·  Lost ' + state.lost + '  ·  Coins ' + state.coins + '  ·  Best combo x' + state.combo, 640, 340, 18, '#3A5A66', '700', 'center');
  const b = LAYOUT.againBtn;
  ctx.fillStyle = '#E8A33D';
  rr(ctx, b.x, b.y, b.w, b.h, 12); ctx.fill();
  text(ctx, 'COOK ANOTHER DAY', b.x + b.w / 2, b.y + 41, 22, '#12303C', '800', 'center');
  text(ctx, 'Click, or press Enter', 640, b.y + b.h + 24, 14, '#3A5A66', '600', 'center');
}

export function drawScene(ctx, state, muted) {
  ctx.fillStyle = '#12303C';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  drawTopBar(ctx, state, muted);
  drawBoard(ctx, state);
  drawKitchen(ctx, state);
  drawCounter(ctx, state);
  drawMessage(ctx, state);
  if (state.phase === 'title') drawTitle(ctx, state);
  if (state.phase === 'dayover') drawDayOver(ctx, state);
}

