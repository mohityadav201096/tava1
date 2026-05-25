// Sample meal library + suggestion scoring.
// Replace pickMeals() with a real Gemini call via /api/suggest in production.

export const MEAL_LIBRARY = [
  {
    name: 'Paneer Bhurji', cook: '18 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Quick', 'High Protein'],
    matches: ['paneer', 'onion', 'tomato'], missing: ['Coriander'], glyph: '◐',
    reason: 'Uses your paneer, onion and tomato — ready in under 20.',
    steps: [
      'Crumble paneer, set aside.',
      'Sauté onion till translucent, add tomato + spices.',
      'Fold in paneer, finish with coriander.',
    ],
    ingredients: ['200g paneer', '1 onion, chopped', '2 tomatoes', '1 green chilli', 'Turmeric, garam masala', 'Coriander to finish'],
    yt: 'Paneer Bhurji in 15 min',
  },
  {
    name: 'Tomato Rasam', cook: '25 min', protein: 'Low', cuisine: 'South Indian',
    diet: 'Veg', tags: ['Quick'],
    matches: ['tomato'], missing: ['Tamarind', 'Rasam powder'], glyph: '◉',
    reason: 'A warming companion for your rice — uses just tomato + pantry spices.',
    steps: [
      'Pulp tomatoes with tamarind water.',
      'Temper mustard, cumin, curry leaves.',
      'Simmer 8 min, finish with coriander.',
    ],
    ingredients: ['3 ripe tomatoes', 'Tamarind, lemon-size', 'Rasam powder', 'Mustard, cumin, curry leaves', 'Coriander'],
    yt: 'Authentic Tomato Rasam',
  },
  {
    name: 'Aloo Gobi', cook: '30 min', protein: 'Low', cuisine: 'North Indian',
    diet: 'Veg', tags: [],
    matches: ['potato'], missing: ['Cauliflower'], glyph: '✺',
    reason: 'A dry sabzi using your potato — pairs with roti.',
    steps: [
      'Cube potato + cauliflower.',
      'Sauté with ginger-garlic and spices.',
      'Cover and cook 18 min.',
    ],
    ingredients: ['2 potatoes, cubed', '1 small cauliflower', 'Ginger-garlic paste', 'Turmeric, coriander powder', 'Kasuri methi'],
    yt: 'Dhaba style Aloo Gobi',
  },
  {
    name: 'Veg Pulao', cook: '28 min', protein: 'Med', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Quick'],
    matches: ['rice', 'onion'], missing: ['Carrot', 'Peas'], glyph: '❋',
    reason: 'One-pot — uses your rice and onion.',
    steps: [
      'Soak rice 15 min.',
      'Sauté whole spices + onion + veg.',
      'Add rice, water, cook 12 min on low.',
    ],
    ingredients: ['1 cup basmati', 'Mixed veg', 'Whole garam masala', '1 onion, sliced', 'Mint'],
    yt: 'Restaurant style Veg Pulao',
  },
  {
    name: 'Palak Khichdi', cook: '22 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['Quick', 'High Protein'],
    matches: ['rice', 'spinach'], missing: ['Moong dal'], glyph: '◑',
    reason: 'A wholesome one-pot using spinach and rice.',
    steps: [
      'Pressure cook rice + dal + spinach with turmeric.',
      'Temper ghee, cumin, hing.',
      'Pour over and serve.',
    ],
    ingredients: ['½ cup rice', '½ cup moong dal', '2 cups spinach', 'Ghee, cumin, hing', 'Ginger'],
    yt: 'Palak Khichdi 22 min',
  },
  {
    name: 'Chana Masala', cook: '35 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Veg', tags: ['High Protein'],
    matches: ['tomato', 'onion'], missing: ['Chickpeas'], glyph: '◎',
    reason: 'A protein-rich classic using your onion + tomato base.',
    steps: [
      'Pressure cook chickpeas.',
      'Sauté onion-tomato masala with spices.',
      'Simmer chickpeas in masala 10 min.',
    ],
    ingredients: ['1.5 cups chickpeas', '2 onions', '2 tomatoes', 'Chana masala, amchur'],
    yt: 'Punjabi Chana Masala',
  },
  {
    name: 'Egg Bhurji', cook: '12 min', protein: 'High', cuisine: 'North Indian',
    diet: 'Non-Veg', tags: ['Quick', 'High Protein'],
    matches: ['onion', 'tomato'], missing: ['Eggs'], glyph: '◐',
    reason: 'Fastest protein hit using your onion-tomato — under 15.',
    steps: [
      'Sauté onion till golden, add tomato, spices.',
      'Beat eggs in, scramble gently.',
      'Finish with coriander.',
    ],
    ingredients: ['4 eggs', '1 onion', '1 tomato', 'Green chilli, turmeric', 'Coriander'],
    yt: 'Mumbai style Egg Bhurji',
  },
  {
    name: 'Methi Thepla', cook: '25 min', protein: 'Med', cuisine: 'North Indian',
    diet: 'Veg', tags: [],
    matches: ['atta'], missing: ['Methi leaves'], glyph: '◓',
    reason: 'Uses your atta — travel-friendly and freezer-friendly.',
    steps: [
      'Knead atta with methi, yogurt, spices.',
      'Roll thin, cook on tava with oil.',
      'Stack and rest.',
    ],
    ingredients: ['2 cups atta', '1 cup methi leaves', '¼ cup yogurt', 'Turmeric, ajwain'],
    yt: 'Soft Methi Thepla',
  },
  {
    name: 'Masala Dosa', cook: '40 min', protein: 'Med', cuisine: 'South Indian',
    diet: 'Veg', tags: [],
    matches: ['potato'], missing: ['Dosa batter'], glyph: '◌',
    reason: 'Pairs with your potato — make aloo masala filling.',
    steps: [
      'Sauté onion + curry leaves + boiled potato + turmeric.',
      'Spread batter thin on hot tava.',
      'Fill and fold.',
    ],
    ingredients: ['Dosa batter', '3 boiled potatoes', 'Onion, curry leaves', 'Mustard, urad dal'],
    yt: 'Crispy Masala Dosa',
  },
];

export const SAMPLE_SAVED = [
  MEAL_LIBRARY[0], MEAL_LIBRARY[4], MEAL_LIBRARY[6], MEAL_LIBRARY[1],
];

export const SUGGESTED_CHIPS = [
  'Onion', 'Tomato', 'Potato', 'Paneer', 'Rice', 'Atta', 'Spinach', 'Ginger', 'Garlic',
];

export function parseIngredients(text) {
  return text
    .split(/[,\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function toText(arr) {
  return arr.join(', ');
}

// Local-only scorer — fast fallback when Gemini isn't configured.
export function pickMealsLocal(ingredients, filters) {
  const items = (ingredients || []).map((s) => s.toLowerCase());
  let pool = MEAL_LIBRARY.slice();
  const { diet = [], goals = [], cuisine = 'Any' } = filters || {};
  if (diet.length) pool = pool.filter((m) => diet.includes(m.diet));
  if (cuisine && cuisine !== 'Any') pool = pool.filter((m) => m.cuisine === cuisine);
  if (goals.includes('High Protein')) pool = pool.filter((m) => m.protein === 'High');
  if (goals.includes('Quick (<30 min)')) pool = pool.filter((m) => m.tags.includes('Quick'));

  pool = pool
    .map((m) => {
      const matchCount = m.matches.filter((mm) =>
        items.some((it) => it.includes(mm) || mm.includes(it))
      ).length;
      return { ...m, _score: matchCount + Math.random() * 0.4 };
    })
    .sort((a, b) => b._score - a._score);

  let result = pool.slice(0, 5);
  if (result.length < 5) {
    const fill = MEAL_LIBRARY
      .filter((m) => !result.find((r) => r.name === m.name))
      .slice(0, 5 - result.length);
    result = [...result, ...fill];
  }
  return result;
}

// Deterministic warm hue from a name — used by MealArt.
export function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
