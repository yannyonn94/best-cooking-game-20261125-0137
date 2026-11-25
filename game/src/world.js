// Keeper's Soup — the kitchen's state and rules.
// One object holds the whole game: the pot, the orders on the board, the tide
// timers, the score, the combo and the day. Rendering never mutates it; input
// and the tick only call the small functions below.

import {
  INGREDIENTS, RECIPES, SAILORS, COOK_SECONDS, START_HEARTS,
  DAY_ORDERS, COMBO_STEP, MAX_COMBO, STORM_EVERY, STORM_PATIENCE,
  patienceFor, servePoints,
} from './config.js';
import { playPlop, playBoil, playServe, playWrong, playLost, playStorm, playBell } from './audio.js';

export function newGame(seed) {
  return {
    phase: 'title', // title | play | dayover
    seed: seed || 1,
    rngState: (seed || 1) >>> 0,
    time: 0,
    score: 0,
    coins: 0,
    hearts: START_HEARTS,
    combo: 1,
    streak: 0,
    served: 0,
    lost: 0,
    orderNumber: 0,
    orders: [], // {id, recipe, sailor, patience, left, storm}
    pot: [], // ingredient ids currently in the pot
    potCooking: 0, // seconds left cooking; 0 = not cooking
    potReady: null, // recipe id once cooked
    plate: null, // recipe id waiting on the serving plate
    message: '',
    messageAt: 0,
    storm: false,
    dayDoneAt: 0,
  };
}

// Small deterministic RNG so a staged screenshot replays the same kitchen.
export function nextRandom(state) {
  state.rngState = (state.rngState * 1664525 + 1013904223) >>> 0;
  return state.rngState / 4294967296;
}

function pick(state, list) {
  return list[Math.floor(nextRandom(state) * list.length)];
}

function recipeById(id) {
  return RECIPES.find((r) => r.id === id);
}

export function ingredientById(id) {
  return INGREDIENTS.find((i) => i.id === id);
}

// Open a new bottle order on the board. Every 5th order is a storm rush:
// two bottles at once with a shorter fuse.
export function spawnOrder(state) {
  state.orderNumber += 1;
  const isStorm = state.orderNumber % STORM_EVERY === 0;
  const patience = isStorm ? STORM_PATIENCE : patienceFor(state.orderNumber);
  const order = {
    id: state.orderNumber,
    recipe: pick(state, RECIPES),
    sailor: pick(state, SAILORS),
    patience,
    left: patience,
    storm: isStorm,
  };
  state.orders.push(order);
  if (isStorm) {
    state.storm = true;
    const second = {
      id: state.orderNumber + 0.5,
      recipe: pick(state, RECIPES),
      sailor: pick(state, SAILORS),
      patience: STORM_PATIENCE,
      left: STORM_PATIENCE,
      storm: true,
    };
    state.orders.push(second);
    playStorm();
    flash(state, 'STORM RUSH — two bottles at once!');
  }
  return order;
}

export function startDay(state) {
  state.phase = 'play';
  state.time = 0;
  state.score = 0;
  state.coins = 0;
  state.hearts = START_HEARTS;
  state.combo = 1;
  state.streak = 0;
  state.served = 0;
  state.lost = 0;
  state.orderNumber = 0;
  state.orders = [];
  state.pot = [];
  state.potCooking = 0;
  state.potReady = null;
  state.plate = null;
  state.storm = false;
  spawnOrder(state);
  flash(state, 'Day begins — the first bottle is in!');
}

export function flash(state, text) {
  state.message = text;
  state.messageAt = state.time;
}

// Drop an ingredient into the pot. Returns true when it landed.
export function addIngredient(state, id) {
  if (state.phase !== 'play') return false;
  if (state.potCooking > 0 || state.potReady) return false;
  if (state.pot.length >= 3) return false;
  if (state.pot.includes(id)) {
    playWrong();
    flash(state, 'Already in the pot — one of each!');
    return false;
  }
  state.pot.push(id);
  playPlop();
  if (state.pot.length === 3) {
    const match = RECIPES.find((r) => r.needs.every((n) => state.pot.includes(n)));
    if (match) {
      state.potCooking = COOK_SECONDS;
      playBoil();
      flash(state, match.name + ' is on the boil — ' + COOK_SECONDS + 's!');
    } else {
      state.potCooking = COOK_SECONDS;
      state.potSpoiled = true;
      playBoil();
      flash(state, 'That mix matches no soup… it will spoil.');
    }
  }
  return true;
}

// Empty the pot into the sink. A spoiled pot costs nothing but time.
export function dumpPot(state) {
  if (state.phase !== 'play') return;
  if (state.pot.length === 0 && !state.potReady) return;
  state.pot = [];
  state.potCooking = 0;
  state.potReady = null;
  state.potSpoiled = false;
  flash(state, 'Pot dumped. Fresh water, fresh start.');
}

// Move a finished soup from the pot to the serving plate.
export function ladleToPlate(state) {
  if (state.phase !== 'play') return false;
  if (!state.potReady || state.plate) return false;
  state.plate = state.potReady;
  state.potReady = null;
  state.pot = [];
  state.potSpoiled = false;
  return true;
}

// Serve the plated soup to the order that asked for it.
export function serveOrder(state, orderId) {
  if (state.phase !== 'play') return false;
  if (!state.plate) {
    flash(state, 'Ladle a finished soup onto the plate first!');
    return false;
  }
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return false;
  if (order.recipe.id !== state.plate) {
    playWrong();
    flash(state, order.sailor.name + ' ordered ' + order.recipe.name + ' — not this one!');
    return false;
  }
  const pts = servePoints(order.recipe, order.left, order.patience, state.combo);
  state.score += pts;
  state.coins += order.recipe.serve;
  state.served += 1;
  state.streak += 1;
  state.combo = Math.min(MAX_COMBO, 1 + Math.floor(state.streak / COMBO_STEP));
  state.plate = null;
  state.orders = state.orders.filter((o) => o.id !== orderId);
  playServe();
  flash(state, 'Served! +' + pts + ' pts — ' + order.sailor.name + ' is rescued.');
  if (state.served + state.lost >= DAY_ORDERS) endDay(state);
  else if (state.orders.length === 0) spawnOrder(state);
  return true;
}

// One tick of the kitchen clock (dt in seconds).
export function tick(state, dt) {
  if (state.phase !== 'play') return;
  state.time += dt;
  if (state.potCooking > 0) {
    state.potCooking -= dt;
    if (state.potCooking <= 0) {
      state.potCooking = 0;
      if (state.potSpoiled) {
        state.pot = [];
        state.potSpoiled = false;
        playWrong();
        flash(state, 'Spoiled! That mix was no soup at all.');
      } else {
        const match = RECIPES.find((r) => r.needs.every((n) => state.pot.includes(n)));
        state.potReady = match ? match.id : null;
        if (match) flash(state, match.name + ' is ready — ladle it out!');
      }
    }
  }
  for (const order of [...state.orders]) {
    order.left -= dt;
    if (order.left <= 0) {
      state.orders = state.orders.filter((o) => o.id !== order.id);
      state.lost += 1;
      state.hearts -= 1;
      state.streak = 0;
      state.combo = 1;
      playLost();
      flash(state, order.sailor.name + "'s bottle sank — the tide took them.");
      if (state.hearts <= 0) { endDay(state); return; }
      if (state.served + state.lost >= DAY_ORDERS) { endDay(state); return; }
      if (state.orders.length === 0) spawnOrder(state);
    }
  }
  if (state.orders.length === 0 && state.served + state.lost < DAY_ORDERS) spawnOrder(state);
  if (state.orders.length > 0) state.storm = state.orders.some((o) => o.storm);
}

function endDay(state) {
  state.phase = 'dayover';
  state.dayDoneAt = state.time;
  playBell();
}
