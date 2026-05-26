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
          temperature: 0.75,
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

    // Strip markdown code fences if model wraps output anyway
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let meals;
    try {
      meals = JSON.parse(text);
    } catch {
      // Try to extract JSON array from partial response
      const match = text.match(/\[[\s\S]*\]/);
      meals = match ? JSON.parse(match[0]) : [];
    }

    if (!Array.isArray(meals)) meals = [];

    // Normalise field names (Gemini sometimes uses snake_case variations)
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

  // Collect disliked meal names from feedback
  const disliked = Object.entries(feedback || {})
    .filter(([, v]) => v === 'down')
    .map(([name]) => name);

  // Meals to skip (recently seen + disliked)
  const skipList = [...new Set([...(recentMeals || []), ...disliked])].slice(0, 20);

  // Resolve effective diet and cuisine
  const effectiveDiet = filterDiet.length ? filterDiet.join(', ') : prefDiet || 'any';
  const effectiveCuisine =
    filterCuisine !== 'Any' ? filterCuisine :
    prefCuisine !== 'Any' ? prefCuisine : 'any Indian';

  const pantryLine = pantry.length
    ? `Pantry staples always on hand: ${pantry.join(', ')}`
    : 'Assume standard Indian pantry: salt, oil, ghee, turmeric, cumin, coriander powder, garam masala, ginger, garlic, green chilli';

  const goalsLine = goals.length ? goals.join(', ') : 'none specified';

  const skipLine = skipList.length
    ? `\nAVOID suggesting these meals (already seen or disliked by user): ${skipList.join(', ')}`
    : '';

  return `You are a warm, knowledgeable Indian cooking assistant helping a home cook decide what to make right now.

## KITCHEN STATE
Ingredients available right now: ${ingredients.length ? ingredients.join(', ') : '(none listed — suggest versatile pantry meals)'}
${pantryLine}
Household size: ${household} ${household === 1 ? 'person' : 'people'}
Diet: ${effectiveDiet}
Cuisine preference: ${effectiveCuisine}
Cooking goals: ${goalsLine}${skipLine}

## YOUR TASK
Suggest exactly 5 meal ideas that this person can realistically cook tonight. Maximise use of their available ingredients. Be creative within the constraints — don't just default to the most obvious meals.

## STRICT RULES
1. Prioritise meals that use the most listed ingredients. Mention them specifically in "matches".
2. "missing_ingredients" must be realistic, easy-to-buy items — maximum 3 per meal.
3. Cook time must be accurate. Do NOT say "20 min" for a dish that takes 45.
4. Vary the suggestions: mix meal types (sabzi, dal, rice dish, bread-based, snack) and cuisines when possible.
5. "reason" must be warm, specific, and name the actual ingredients ("Uses your paneer and wilting spinach" not "A great choice").
6. "steps" must be 3–5 clear, actionable cooking instructions — not vague summaries.
7. "yt_search" must be a specific, well-chosen YouTube search query that will surface a great home-cooking video for this recipe. Include "recipe" and a style hint (e.g. "quick", "authentic", "street style").
8. Never include meals from the AVOID list above.
9. Respect the diet preference strictly — if diet is "Veg", return only Veg meals.

## JSON SCHEMA
Return ONLY a JSON array of exactly 5 objects. No markdown, no explanation, no wrapper keys.

[
  {
    "meal_name": "string — proper name of the dish",
    "cook_time": "string — e.g. '22 min' or '1 hr'",
    "protein": "High" | "Med" | "Low",
    "cuisine": "North Indian" | "South Indian" | "Street Food" | "Chinese-Indian" | "Breakfast" | "Continental" | "Mixed",
    "diet": "Veg" | "Non-Veg" | "Egg" | "Vegan",
    "tags": ["Quick", "High Protein", "Comfort", "One-pot", "Light"],
    "matches": ["ingredient1", "ingredient2"],
    "missing_ingredients": ["item1", "item2"],
    "reason": "One warm, specific sentence mentioning their actual ingredients.",
    "steps": ["Step 1 — full instruction.", "Step 2.", "Step 3.", "Step 4.", "Step 5."],
    "ingredients": ["200g paneer", "1 large onion, finely chopped", "..."],
    "yt_search": "specific YouTube search query string"
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
