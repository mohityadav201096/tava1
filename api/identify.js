// Vercel serverless function — POST /api/identify
//
// Body: { imageBase64: string, mimeType: string }
// Response: { ingredients: string[] }
//
// Uses Gemini Vision to identify food ingredients from a kitchen/fridge photo.
// Requires the same GEMINI_API_KEY env var as /api/suggest.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { imageBase64, mimeType = 'image/jpeg' } = body || {};

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      ingredients: [],
      note: 'GEMINI_API_KEY not set',
    });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const prompt = [
    'Look at this image of a kitchen, fridge, or ingredients.',
    'Identify every food ingredient you can see.',
    '',
    'Return ONLY a JSON array of ingredient names.',
    'Rules:',
    '- Use simple, common names in lowercase (e.g. "paneer", "onion", "spinach", "eggs")',
    '- One word or short phrase per ingredient',
    '- Include vegetables, fruits, dairy, meat, eggs, grains, pulses, condiments — everything edible',
    '- Do NOT include brand names, packaging, utensils, or non-food items',
    '- If nothing edible is visible, return []',
    '',
    'Return ONLY the JSON array with no markdown, no explanation.',
    'Example: ["onion", "tomato", "paneer", "spinach", "eggs", "milk", "butter"]',
  ].join('\n');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
          ],
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('[tava/identify] Gemini error:', err.slice(0, 300));
      return res.status(502).json({ error: 'Gemini error', detail: err.slice(0, 300) });
    }

    const data = await r.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let ingredients;
    try {
      ingredients = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      ingredients = match ? JSON.parse(match[0]) : [];
    }

    if (!Array.isArray(ingredients)) ingredients = [];

    // Sanitise: lowercase strings only
    ingredients = ingredients
      .filter((x) => typeof x === 'string' && x.trim())
      .map((x) => x.trim().toLowerCase());

    return res.status(200).json({ ingredients });
  } catch (err) {
    console.error('[tava/identify] Server error:', err);
    return res.status(500).json({ error: 'Server error', detail: String(err).slice(0, 200) });
  }
}
