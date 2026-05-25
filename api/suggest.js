// Vercel serverless function — POST /api/suggest
//
// Body: { ingredients: string[], filters: { diet, goals, cuisine } }
// Response: { meals: [ { meal_name, cook_time, protein, cuisine, missing_ingredients, reason, ... } ] }
//
// Configure: set GEMINI_API_KEY in your Vercel project's environment variables.
// (Optional) GEMINI_MODEL — defaults to gemini-1.5-flash.
//
// This file uses fetch directly (no SDK) to keep dependencies zero. When
// GEMINI_API_KEY is not set, it returns a graceful 200 with a stub array so
// the client falls back to local scoring.

const FALLBACK = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { ingredients = [], filters = {} } = body || {};

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    // No key configured — let the client fall back to local scoring.
    return res.status(200).json({
      meals: FALLBACK,
      note: 'GEMINI_API_KEY not set — using client-side fallback.',
    });
  }

  const prompt = buildPrompt(ingredients, filters);

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
      return res.status(502).json({ error: 'Gemini error', detail: err.slice(0, 500) });
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    let meals;
    try { meals = JSON.parse(text); } catch { meals = []; }
    if (!Array.isArray(meals)) meals = [];
    return res.status(200).json({ meals });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: String(err).slice(0, 300) });
  }
}

function buildPrompt(ingredients, filters) {
  const { diet = [], goals = [], cuisine = 'Any' } = filters || {};
  return [
    'You are a warm, encouraging cooking assistant for Indian households.',
    'Suggest exactly 5 meal ideas based on the available ingredients and filters.',
    '',
    `Available ingredients: ${ingredients.join(', ') || '(none)'}`,
    `Diet preference: ${diet.join(', ') || 'any'}`,
    `Goals: ${goals.join(', ') || 'any'}`,
    `Cuisine: ${cuisine}`,
    '',
    'Return STRICT JSON: an array of 5 objects with these keys exactly:',
    '  meal_name (string)',
    '  cook_time (string, e.g. "20 min")',
    '  protein ("High" | "Med" | "Low")',
    '  cuisine (string)',
    '  diet ("Veg" | "Non-Veg" | "Egg" | "Vegan")',
    '  tags (string[]) — may include "Quick", "High Protein"',
    '  matches (string[]) — ingredients the user already has',
    '  missing_ingredients (string[]) — short names of things to buy',
    '  reason (string) — one warm sentence explaining the suggestion',
    '  steps (string[]) — 3-5 short cooking steps',
    '  ingredients (string[]) — full ingredient list with quantities',
    '',
    'Tone: warm, concise, encouraging. Prefer simple Indian home-cooking. No emoji.',
  ].join('\n');
}
