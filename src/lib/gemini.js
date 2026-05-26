// Gemini integration — calls /api/suggest with full kitchen context.
// Falls back to local scoring when API is unavailable or unconfigured.

import { pickMealsLocal, MEAL_LIBRARY } from './meals.js';

/**
 * Ask Gemini (via serverless function) for 5 meal suggestions.
 *
 * @param {Object} ctx
 * @param {string[]} ctx.ingredients  — what the user has right now
 * @param {string[]} ctx.pantry       — persistent pantry staples
 * @param {Object}  ctx.filters       — { diet[], goals[], cuisine }
 * @param {Object}  ctx.prefs         — { diet, cuisine, household, avoidRepeats }
 * @param {Object}  ctx.feedback      — { [mealName]: 'up' | 'down' }
 * @param {string[]} ctx.recentMeals  — meal names suggested recently (for avoid-repeats)
 */
export async function suggestMeals({ ingredients, pantry, filters, prefs, feedback, recentMeals }) {
  try {
    const res = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, pantry, filters, prefs, feedback, recentMeals }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data?.meals) && data.meals.length > 0) {
      return hydrateMeals(data.meals);
    }
    throw new Error('Empty meals — falling back to local');
  } catch (err) {
    if (typeof console !== 'undefined') {
      console.info('[tava] local fallback:', err?.message || err);
    }
    return pickMealsLocal(ingredients, filters, feedback, recentMeals);
  }
}

/**
 * Merge Gemini response with the local library where names match,
 * so steps/ingredients are always present.
 */
function hydrateMeals(remote) {
  return remote.map((m) => {
    const name = m.meal_name || m.name || 'Suggestion';
    const fromLib = MEAL_LIBRARY.find(
      (x) => x.name.toLowerCase() === name.toLowerCase()
    );

    // Build a YouTube search URL from the yt_search field
    const ytQuery = m.yt_search || m.yt || name;
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}`;

    const base = fromLib || {
      name,
      cook: m.cook_time || '—',
      protein: m.protein || 'Med',
      cuisine: m.cuisine || 'Mixed',
      diet: m.diet || 'Veg',
      tags: m.tags || [],
      matches: m.matches || [],
      missing: m.missing_ingredients || [],
      glyph: '◐',
      reason: m.reason || '',
      steps: m.steps || ['Recipe details coming soon.'],
      ingredients: m.ingredients || [],
      yt: ytQuery,
      ytUrl,
    };

    return {
      ...base,
      name,
      cook: m.cook_time || base.cook,
      missing: m.missing_ingredients || base.missing,
      reason: m.reason || base.reason,
      steps: m.steps?.length ? m.steps : base.steps,
      ingredients: m.ingredients?.length ? m.ingredients : base.ingredients,
      matches: m.matches?.length ? m.matches : base.matches,
      yt: ytQuery,
      ytUrl,
    };
  });
}
