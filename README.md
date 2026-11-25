[![Keeper's Soup](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/yannyonn94/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/yannyonn94/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

# Keeper's Soup — Lighthouse Kitchen

A lighthouse keeper cooks **5 soups from 9 ingredients** for shipwrecked sailors whose orders arrive as **messages in bottles** — 12 orders a day, a tide timer on every bottle, a storm rush every 5th order, and a rescue combo up to x4. Serve the right soup before the tide takes the sailor, or the bottle sinks.

## How to play

- **Click an ingredient** on the counter (or press **1–9**) to drop it in the copper pot. Three ingredients make a soup — but only the five recipes in the recipe book are real soups; a wrong mix boils, spoils, and must be dumped.
- Wait for the **6-second boil**, then click the pot (or press **Space**) to ladle the soup onto the serving plate.
- **Click the bottle** on the order board to serve the plated soup to the sailor who ordered it. Serve fast: the speed bonus shrinks as the patience bar drains.
- Every **5th order is a storm rush**: two bottles at once, 42 seconds each. Serve 5 in a row to raise the combo multiplier (up to x4). Lose 3 sailors and the day ends.

## The five soups

| Soup | Ingredients | Serve |
| --- | --- | --- |
| Harbor Chowder | Fish, Potato, Onion | 14 |
| Storm Tomato Soup | Tomato, Onion, Chili | 16 |
| Kelp & Clam Broth | Clam, Seaweed, Onion | 15 |
| Lantern Mushroom Stew | Mushroom, Potato, Carrot | 15 |
| Sailor's Fire Pot | Fish, Chili, Tomato | 18 |

## Files

- `game/index.html` — the page; loads `style.css` and `src/main.js`, nothing else
- `game/style.css` — the page shell (flat deep teal, warm cream text)
- `game/src/config.js` — the 9 ingredients, 5 recipes, 8 sailors, timers, scoring
- `game/src/world.js` — the kitchen's state: orders, pot, timers, combo, day
- `game/src/render.js` — all art, drawn with canvas shapes; no image files
- `game/src/input.js` — mouse + keyboard (1–9, Space, D, M, Enter)
- `game/src/audio.js` — sound effects synthesised with WebAudio, no audio files
- `game/src/shots.js` — staged screenshot scenes (`?shot=play|storm|end|start`)
- `game/src/main.js` — the loop: one tick, one draw, 60 fps
- `main.ts` — the hand-in program (Node 22, standard library only)
- `serve.ts` — local dev server: `node serve.ts`, then http://localhost:8080
- `screenshots/` — 3 real renders of the game's own code (cover first)
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged

## Play it

```sh
node serve.ts
# open http://localhost:8080 — no network request, no build step
```

## License

MIT — see `LICENSE`.
