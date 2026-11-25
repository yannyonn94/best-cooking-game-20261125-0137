// Keeper's Soup — game configuration.
// Every named thing in the kitchen lives here: the 9 ingredients, the 5 soups,
// the tide timers, the storm rush and the scoring. No other file hard-codes a
// recipe, a price or a colour that belongs to the kitchen's identity.

export const VIEW_W = 1280;
export const VIEW_H = 720;

// The nine ingredients on the counter, in the order their keys 1-9 add them.
export const INGREDIENTS = [
  { id: 'potato',   name: 'Potato',   key: '1', color: '#E8C87A', dark: '#8A6D2B', price: 2 },
  { id: 'carrot',   name: 'Carrot',   key: '2', color: '#E8722A', dark: '#8A3E10', price: 2 },
  { id: 'onion',    name: 'Onion',    key: '3', color: '#F2E8D5', dark: '#9A8A6A', price: 2 },
  { id: 'fish',     name: 'Fish',     key: '4', color: '#7FB3C8', dark: '#2E5A6E', price: 4 },
  { id: 'clam',     name: 'Clam',     key: '5', color: '#C9A8C9', dark: '#6E4A6E', price: 4 },
  { id: 'seaweed',  name: 'Seaweed',  key: '6', color: '#3E7A4E', dark: '#1E4A2A', price: 3 },
  { id: 'tomato',   name: 'Tomato',   key: '7', color: '#D43D2A', dark: '#7A1E12', price: 3 },
  { id: 'mushroom', name: 'Mushroom', key: '8', color: '#D8CFC0', dark: '#7A6A52', price: 3 },
  { id: 'chili',    name: 'Chili',    key: '9', color: '#C22E1E', dark: '#6E1408', price: 3 },
];

// The five soups. Each needs exactly three ingredients, in any order.
export const RECIPES = [
  {
    id: 'chowder', name: 'Harbor Chowder', needs: ['fish', 'potato', 'onion'],
    blurb: 'The one every sailor asks for first.', serve: 14,
  },
  {
    id: 'storm', name: 'Storm Tomato Soup', needs: ['tomato', 'onion', 'chili'],
    blurb: 'Hot enough to argue with the wind.', serve: 16,
  },
  {
    id: 'kelp', name: 'Kelp & Clam Broth', needs: ['clam', 'seaweed', 'onion'],
    blurb: 'Tastes like the tide at low water.', serve: 15,
  },
  {
    id: 'lantern', name: 'Lantern Mushroom Stew', needs: ['mushroom', 'potato', 'carrot'],
    blurb: 'Glows faintly. Nobody asks why.', serve: 15,
  },
  {
    id: 'firepot', name: "Sailor's Fire Pot", needs: ['fish', 'chili', 'tomato'],
    blurb: 'Three bites and your ears ring.', serve: 18,
  },
];

// The sailors who send bottle orders. A name + a ship makes each order a person.
export const SAILORS = [
  { name: 'Captain Mara', ship: 'the Gullwing' },
  { name: 'Old Tomas', ship: 'the Salt Wife' },
  { name: 'First Mate Ivo', ship: 'the Pale Lantern' },
  { name: 'Cook Bess', ship: 'the Hungry Tide' },
  { name: 'Cabin Boy Pip', ship: 'the Small Mercy' },
  { name: 'Navigator Ash', ship: 'the Long Night' },
  { name: 'Bosun Rhea', ship: 'the Iron Kettle' },
  { name: 'Sailor Fen', ship: 'the Driftwood' },
];

// How long a sailor waits before the bottle sinks (seconds). Shrinks as the
// day goes on, so pressure grows without adding chores.
export function patienceFor(orderNumber) {
  if (orderNumber <= 2) return 75;
  if (orderNumber <= 5) return 65;
  if (orderNumber <= 8) return 55;
  return 48;
}

// Cooking time once the pot holds the right three ingredients (seconds).
export const COOK_SECONDS = 6;

// A storm rush starts every 5th order: two bottles at once, shorter patience.
export const STORM_EVERY = 5;
export const STORM_PATIENCE = 42;

export const START_HEARTS = 3;
export const DAY_ORDERS = 12; // a full day is 12 served-or-lost orders
export const COMBO_STEP = 5; // every 5 on-time serves raises the multiplier
export const MAX_COMBO = 4;

// Points: base serve value, plus a speed bonus for serving early.
export function servePoints(recipe, secondsLeft, patience, combo) {
  const speed = Math.round((secondsLeft / patience) * 8);
  return (recipe.serve + speed) * combo;
}
