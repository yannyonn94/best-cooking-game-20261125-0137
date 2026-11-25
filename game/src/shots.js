// Keeper's Soup — staged screenshots. ?shot=play|storm|end puts the kitchen
// into one fixed, busy, mid-action moment so the maker's screenshots are real
// renders of the game's own code, frozen in time: the clock does not tick
// while a shot is staged (see main.js), so the frame the browser captures is
// exactly the frame described here.

import { RECIPES, SAILORS } from './config.js';
import { startDay } from './world.js';

function bottle(id, recipeId, sailorIdx, patience, left, storm) {
  return {
    id,
    recipe: RECIPES.find((r) => r.id === recipeId),
    sailor: SAILORS[sailorIdx],
    patience,
    left,
    storm: !!storm,
  };
}

// The cover: mid-action, most colourful, busiest. A chowder on the boil with
// all three ingredients in the pot, a kelp broth already plated and ready to
// serve, two bottles waiting, combo x3, score climbing.
export function stagePlay(state) {
  startDay(state);
  state.time = 132;
  state.score = 86;
  state.coins = 42;
  state.combo = 3;
  state.streak = 11;
  state.served = 6;
  state.lost = 1;
  state.hearts = 2;
  state.orderNumber = 7;
  state.orders = [
    bottle(7, 'chowder', 0, 65, 41, false),
    bottle(8, 'storm', 3, 65, 52, false),
  ];
  state.pot = ['fish', 'potato', 'onion'];
  state.potCooking = 3.2;
  state.potReady = null;
  state.plate = 'kelp';
  state.message = 'Kelp & Clam Broth is ready — click a bottle to serve!';
  state.messageAt = 131;
}

// The storm rush: two storm bottles at once, short fuses, a fire pot boiling.
export function stageStorm(state) {
  startDay(state);
  state.time = 301;
  state.score = 148;
  state.coins = 76;
  state.combo = 2;
  state.streak = 6;
  state.served = 9;
  state.lost = 1;
  state.hearts = 2;
  state.orderNumber = 10;
  state.storm = true;
  state.orders = [
    bottle(10, 'firepot', 5, 42, 18, true),
    bottle(10.5, 'lantern', 1, 42, 27, true),
  ];
  state.pot = ['fish', 'chili', 'tomato'];
  state.potCooking = 1.8;
  state.potReady = null;
  state.plate = null;
  state.message = 'STORM RUSH — two bottles at once!';
  state.messageAt = 300;
}

// The day is done: the summary screen over a finished kitchen.
export function stageEnd(state) {
  startDay(state);
  state.time = 512;
  state.score = 214;
  state.coins = 148;
  state.combo = 2;
  state.streak = 0;
  state.served = 10;
  state.lost = 2;
  state.hearts = 1;
  state.orderNumber = 12;
  state.orders = [];
  state.pot = [];
  state.phase = 'dayover';
  state.dayDoneAt = 512;
}

// The title screen over a kitchen that already has its first bottle waiting.
export function stageStart(state) {
  startDay(state);
  state.time = 0;
  state.phase = 'title';
  state.message = '';
}

export function stageShot(state, shot) {
  if (shot === 'play') stagePlay(state);
  else if (shot === 'storm') stageStorm(state);
  else if (shot === 'end') stageEnd(state);
  else if (shot === 'start') stageStart(state);
  else stagePlay(state);
}
