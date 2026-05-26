// Vercel serverless function — POST /api/suggest
//
// Body: { ingredients, pantry, filters, prefs, feedback, recentMeals }
// Response: { meals: [...] }
//
// Set GEMINI_API_KEY in your Vercel project → Environment Variables.
// Optional: GEMINI_MODEL (default: gemini-2.0-flash)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const {
    ingredients = [],
    pantry = [],
    filters = {},
    prefs = {},
    feedback = {},
    recentMeals = [],
  } = body || {};

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    return res.status(200).json({
      meals: [],
      note: 'GEMINI_API_KEY not set — client will use local fallback.',
    });
  }

  const prompt = buildPrompt({ ingredients, pantry, filters, prefs, feedback, recentMeals });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('[tava/api] Gemini error:', err.slice(0, 400));
      return res.status(502).json({ error: 'Gemini error', detail: err.slice(0, 400) });
    }

    const data = await r.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let meals;
    try {
      meals = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      meals = match ? JSON.parse(match[0]) : [];
    }

    if (!Array.isArray(meals)) meals = [];
    meals = meals.map(normaliseMeal).filter(Boolean);

    return res.status(200).json({ meals });
  } catch (err) {
    console.error('[tava/api] Server error:', err);
    return res.status(500).json({ error: 'Server error', detail: String(err).slice(0, 300) });
  }
}

// ─── Prompt ────────────────────────────────────────────────────────────────

function buildPrompt({ ingredients, pantry, filters, prefs, feedback, recentMeals }) {
  const { diet: filterDiet = [], goals = [], cuisine: filterCuisine = 'Any' } = filters;
  const { diet: prefDiet = 'Veg', cuisine: prefCuisine = 'Any', household = 2 } = prefs;

  const disliked = Object.entries(feedback || {})
    .filter(([, v]) => v === 'down')
    .map(([name]) => name);

  const skipList = [...new Set([...(recentMeals || []), ...disliked])].slice(0, 20);

  const effectiveDiet = filterDiet.length ? filterDiet.join(', ') : prefDiet || 'any';
  const effectiveCuisine =
    filterCuisine !== 'Any' ? filterCuisine :
    prefCuisine !== 'Any' ? prefCuisine : 'any Indian';

  const pantryLine = pantry.length
    ? `Standard pantry always available: ${pantry.join(', ')}, plus common spices (salt, oil, turmeric, cumin, coriander powder, garam masala, chilli powder, mustard seeds)`
    : 'Assume standard Indian pantry: salt, oil, turmeric, cumin, coriander powder, garam masala, chilli powder';

  const skipLine = skipList.length
    ? `\nDo NOT suggest any of these (already seen or disliked): ${skipList.join(', ')}`
    : '';

  const ingredientList = ingredients.length
    ? ingredients.join(', ')
    : '(none — suggest versatile pantry meals using the staples above)';

  return `You are an expert Indian cooking assistant helping a home cook decide what to make RIGHT NOW with what they have.

## WHAT THEY HAVE
Primary ingredients available: ${ingredientList}
${pantryLine}
Diet: ${effectiveDiet}
Cuisine preference: ${effectiveCuisine}
Household size: ${household} ${household === 1 ? 'person' : 'people'}
Cooking goals: ${goals.length ? goals.join(', ') : 'none'}${skipLine}

## ⚠️ THE MOST IMPORTANT RULE — READ CAREFULLY
The available PRIMARY INGREDIENTS must be the STAR of each suggested meal.
A meal is only valid if the user's listed ingredients form the core, essential base of that dish.

CORRECT examples when user has [paneer, onion, tomato]:
✓ Paneer Bhurji — paneer is the main ingredient
✓ Paneer Tikka — paneer is the main ingredient  
✓ Matar Paneer — paneer + tomato are core (peas can be "missing")
✓ Onion Tomato Sabzi — onion + tomato are the whole dish

WRONG examples for the same input:
✗ Chicken Curry — chicken is the core ingredient but NOT in their list
✗ Dal Tadka — dal is the core but NOT in their list
✗ Rajma — rajma is the core but NOT in their list
✗ Biryani — needs many missing core ingredients

## MISSING INGREDIENTS RULE
"missing_ingredients" must ONLY contain minor supporting items such as:
- A garnish (coriander leaves, kasuri methi, cream)
- A specific spice they might not have (rasam powder, chana masala)
- A small add-on (peas, one vegetable to bulk out a dish)

missing_ingredients must NEVER contain:
- The main protein (chicken, paneer, eggs, fish)
- The main carb base (rice, dal, flour, bread)
- A large vegetable that IS the dish (eggplant in baingan bharta, etc.)

Maximum 2 missing ingredients per meal. If a dish needs more than 2 things not in their list, do NOT suggest it.

## ADDITIONAL RULES
1. Vary the suggestions — mix meal types and avoid repetition.
2. Cook time must be accurate and realistic.
3. "reason" must name their actual ingredients warmly ("Uses your wilting spinach and paneer").
4. Steps must be 3–5 clear, actionable instructions.
5. Respect the diet filter strictly.
6. Write a specific YouTube search query that will find a great home-cooking video.

## JSON OUTPUT
Return ONLY a JSON array of exactly 5 objects. No markdown, no explanation.

[
  {
    "meal_name": "string",
    "cook_time": "string (e.g. '20 min')",
    "protein": "High" | "Med" | "Low",
    "cuisine": "North Indian" | "South Indian" | "Street Food" | "Chinese-Indian" | "Breakfast" | "Continental" | "Mixed",
    "diet": "Veg" | "Non-Veg" | "Egg" | "Vegan",
    "tags": ["Quick", "High Protein", "Comfort", "One-pot", "Light"],
    "matches": ["ingredient from their list used in this dish"],
    "missing_ingredients": ["minor item 1", "minor item 2"],
    "reason": "Warm, specific sentence naming their actual ingredients.",
    "steps": ["Step 1.", "Step 2.", "Step 3.", "Step 4."],
    "ingredients": ["quantity + ingredient name", "..."],
    "yt_search": "specific YouTube search query for this exact recipe"
  }
]`;
}

// ─── Normalise ──────────────────────────────────────────────────────────────

function normaliseMeal(m) {
  if (!m || typeof m !== 'object') return null;
  return {
    meal_name: m.meal_name || m.name || 'Suggestion',
    cook_time: m.cook_time || m.cook || '—',
    protein: m.protein || 'Med',
    cuisine: m.cuisine || 'Mixed',
    diet: m.diet || 'Veg',
    tags: Array.isArray(m.tags) ? m.tags : [],
    matches: Array.isArray(m.matches) ? m.matches : [],
    missing_ingredients: Array.isArray(m.missing_ingredients)
      ? m.missing_ingredients
      : Array.isArray(m.missing) ? m.missing : [],
    reason: m.reason || '',
    steps: Array.isArray(m.steps) ? m.steps : ['Prepare as usual.'],
    ingredients: Array.isArray(m.ingredients) ? m.ingredients : [],
    yt_search: m.yt_search || m.yt || m.meal_name || m.name || '',
  };
}
