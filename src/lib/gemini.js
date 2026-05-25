// Gemini integration helper (client-side).
//
// In production this calls the serverless function at /api/suggest, which
// holds the GEMINI_API_KEY server-side and returns a structured JSON list of
// meals. If the API is unavailable or unconfigured, we fall back to local
// scoring so the app remains functional in dev / offline.

import { pickMealsLocal, MEAL_LIBRARY } from './meals.js';

/**
 * Ask the backend for 5 meal suggestions.
 *
 * @param {Object} input
 * @param {string[]} input.ingredients
 * @param {Object} input.filters
 * @returns {Promise<Array>} — array of meal objects
 */
export async function suggestMeals({ ingredients, filters }) {
  // Try the serverless function first.
  try {
    const res = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, filters }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data?.meals) && data.meals.length > 0) {
      return hydrateMeals(data.meals);
    }
    throw new Error('Empty meals array');
  } catch (err) {
    // Fallback to local — keeps dev/offline working.
    if (typeof console !== 'undefined') {
      console.info('[tava] using local fallback:', err?.message || err);
    }
    return pickMealsLocal(ingredients, filters);
  }
}

/**
 * Backend may return minimal meal objects (name, cook_time, missing, reason).
 * Merge with library entries where the name matches so steps/ingredients
 * still render — otherwise use the response as-is with sensible defaults.
 */
function hydrateMeals(remote) {
  return remote.map((m) => {
    const fromLib = MEAL_LIBRARY.find((x) => x.name.toLowerCase() === String(m.name || m.meal_name || '').toLowerCase());
    const base = fromLib || {
      name: m.meal_name || m.name || 'Suggestion',
      cook: m.cook_time || m.cook || '—',
      protein: m.protein || 'Med',
      cuisine: m.cuisine || 'Mixed',
      diet: m.diet || 'Veg',
      tags: m.tags || [],
      matches: m.matches || [],
      missing: m.missing_ingredients || m.missing || [],
      glyph: m.glyph || '◐',
      reason: m.reason || '',
      steps: m.steps || ['Recipe details coming soon.'],
      ingredients: m.ingredients || [],
      yt: m.yt || m.meal_name || m.name,
    };
    return {
      ...base,
      missing: m.missing_ingredients || m.missing || base.missing,
      reason: m.reason || base.reason,
      cook: m.cook_time || m.cook || base.cook,
    };
  });
}
