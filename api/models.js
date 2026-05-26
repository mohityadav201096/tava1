// Debug endpoint — GET /api/models
// Lists all Gemini models available to your API key
export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(200).json({ error: 'No API key set' });

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data = await r.json();

  // Return just model names for readability
  const names = (data.models || []).map(m => m.name);
  return res.status(200).json({ models: names, raw: data.models?.slice(0,3) });
}
