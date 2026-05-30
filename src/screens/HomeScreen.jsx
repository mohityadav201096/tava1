import { useState, useEffect, useRef, useCallback } from 'react';
import { MealCard } from '../components/MealCard.jsx';
import { parseIngredients, toText, SUGGESTED_CHIPS } from '../lib/meals.js';

const QUICK_CHIPS = [
  { name: 'Onion',   emoji: '🧅' },
  { name: 'Tomato',  emoji: '🍅' },
  { name: 'Potato',  emoji: '🥔' },
  { name: 'Paneer',  emoji: '🧀' },
  { name: 'Rice',    emoji: '🍚' },
  { name: 'Atta',    emoji: '🌾' },
  { name: 'Spinach', emoji: '🥬' },
  { name: 'Dal',     emoji: '🫘' },
  { name: 'Curd',    emoji: '🥛' },
  { name: 'Ginger',  emoji: '🫚' },
  { name: 'Garlic',  emoji: '🧄' },
  { name: 'Egg',     emoji: '🥚' },
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Chili',   emoji: '🌶️' },
];

const CUISINES = ['Mixed', 'North Indian', 'South Indian', 'Chinese', 'Italian'];

// ─── Voice Recognition hook ───────────────────────────────────────────────────
function useVoiceInput({ onResult, onError }) {
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { onError('Voice input not supported. Try Chrome.'); return; }
    const recog = new SR();
    recog.lang = 'en-IN';
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart  = () => setListening(true);
    recog.onend    = () => setListening(false);
    recog.onerror  = (e) => {
      setListening(false);
      if (e.error === 'not-allowed') onError('Microphone access denied.');
      else if (e.error === 'no-speech') onError('No speech detected. Try again.');
      else onError('Voice error: ' + e.error);
    };
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      const raw = transcript
        .toLowerCase()
        .replace(/\b(and|also|plus|with|some|a|an|the)\b/g, ',')
        .split(/[,،]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1);
      onResult(raw);
    };
    recogRef.current = recog;
    recog.start();
  }, [onResult, onError]);

  const stop   = useCallback(() => { recogRef.current?.stop(); setListening(false); }, []);
  const toggle = useCallback(() => { if (listening) stop(); else start(); }, [listening, start, stop]);

  return { listening, toggle };
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function HomeScreen({ state, dispatch, goTo, openRecipe }) {
  const { ingredients, pantry, meals, generating, filters } = state;
  const [text, setText] = useState(ingredients.join(', '));
  const [identifying, setIdentifying] = useState(false);
  const fileInputRef = useRef(null);
  const resultsRef   = useRef(null);

  useEffect(() => { setText(ingredients.join(', ')); }, [ingredients]);

  // Scroll to results when they arrive
  useEffect(() => {
    if (meals.length > 0 && resultsRef.current) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [meals.length]);

  // ── Ingredient helpers ────────────────────────────────────────────────────
  const addIngredients = useCallback((newItems) => {
    const cur = new Set(parseIngredients(text));
    newItems.forEach((i) => cur.add(i.toLowerCase().trim()));
    const merged = [...cur].filter(Boolean);
    setText(toText(merged));
    dispatch({ type: 'setIngredients', items: merged });
  }, [text, dispatch]);

  const commit = () => {
    const items = parseIngredients(text);
    dispatch({ type: 'setIngredients', items });
    return items;
  };

  const toggleChip = (name) => {
    const cur = parseIngredients(text);
    if (cur.includes(name.toLowerCase())) {
      const next = cur.filter((x) => x !== name.toLowerCase());
      setText(toText(next));
      dispatch({ type: 'setIngredients', items: next });
    } else {
      addIngredients([name]);
    }
  };

  const removeIngredient = (name) => {
    const next = parseIngredients(text).filter((x) => x !== name.toLowerCase());
    setText(toText(next));
    dispatch({ type: 'setIngredients', items: next });
  };

  const onSuggest = () => {
    const items = commit();
    if (items.length === 0) return;
    dispatch({ type: 'addToPantry', items });
    dispatch({ type: 'generate' });
  };

  // ── Camera ────────────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (!file.type.startsWith('image/')) { dispatch({ type: 'toast', text: 'Please select an image.' }); return; }
    setIdentifying(true);
    dispatch({ type: 'toast', text: 'Scanning your kitchen…' });
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res  = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.ingredients)) throw new Error(data.error || 'Could not read image');
      if (data.ingredients.length === 0) {
        dispatch({ type: 'toast', text: 'No ingredients found — try a clearer photo.' });
      } else {
        addIngredients(data.ingredients);
        dispatch({ type: 'toast', text: `Found ${data.ingredients.length} ingredient${data.ingredients.length === 1 ? '' : 's'} ✓` });
      }
    } catch (err) {
      dispatch({ type: 'toast', text: 'Could not read photo. Try again.' });
    } finally {
      setIdentifying(false);
    }
  };

  // ── Voice ─────────────────────────────────────────────────────────────────
  const { listening, toggle: toggleVoice } = useVoiceInput({
    onResult: (items) => {
      if (items.length === 0) { dispatch({ type: 'toast', text: 'Could not catch that — try again.' }); return; }
      addIngredients(items);
      dispatch({ type: 'toast', text: `Added: ${items.join(', ')}` });
    },
    onError: (msg) => dispatch({ type: 'toast', text: msg }),
  });

  const current = parseIngredients(text);
  const loading = generating;

  const setFilter = (key, val) => dispatch({ type: 'setFilter', key, value: val });

  return (
    <div className="min-h-screen pb-28 md:pb-12" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFileChange} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" style={{ filter: 'blur(48px)' }} />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-black/10" style={{ filter: 'blur(48px)' }} />
        <div className="relative max-w-3xl mx-auto px-5 pt-10 pb-24 md:pt-16 md:pb-32">
          <p className="text-sm font-medium" style={{ opacity: 0.9 }}>📍 Your kitchen</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight" style={{ lineHeight: 1.1 }}>
            Hungry? Let's see what<br className="hidden md:block" /> you can cook tonight.
          </h1>
          <p className="mt-3 text-sm md:text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Add what's in your kitchen — we'll plate up 5 meal ideas in seconds.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['⚡ Quick bites', '🍲 Comfort meal', '🥗 Healthy', '🎲 Surprise me'].map((m) => (
              <span key={m} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-5" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>

        {/* Search card */}
        <section className="rounded-3xl p-5 md:p-7 border"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-pop)' }}>

          {/* Textarea + camera/mic */}
          <div className="flex items-start gap-3">
            <div className="hidden md:grid place-items-center w-12 h-12 rounded-2xl text-2xl shrink-0"
              style={{ background: 'var(--gradient-card-2)' }}>
              🔎
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={commit}
              placeholder="Type ingredients: paneer, onion, tomato, spinach…"
              rows={2}
              className="flex-1 resize-none bg-transparent text-base md:text-lg focus:outline-none"
              style={{ color: 'var(--foreground)' }}
            />
          </div>

          {/* Camera + Mic buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={identifying}
              title="Scan kitchen photo"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors"
              style={{
                borderColor: identifying ? 'var(--primary)' : 'var(--border)',
                backgroundColor: identifying ? 'oklch(0.64 0.22 28 / 0.1)' : 'var(--secondary)',
                color: identifying ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              📷 {identifying ? 'Scanning…' : 'Camera'}
            </button>
            <button
              onClick={toggleVoice}
              title={listening ? 'Tap to stop' : 'Speak ingredients'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors"
              style={{
                borderColor: listening ? 'var(--primary)' : 'var(--border)',
                backgroundColor: listening ? 'oklch(0.64 0.22 28 / 0.1)' : 'var(--secondary)',
                color: listening ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              🎙️ {listening ? 'Listening…' : 'Voice'}
            </button>
          </div>

          {/* Quick chips */}
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Tap to add
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
              {QUICK_CHIPS.map((chip) => {
                const active = current.includes(chip.name.toLowerCase());
                return (
                  <button key={chip.name} onClick={() => toggleChip(chip.name)}
                    className="shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border transition-all"
                    style={{
                      backgroundColor: active ? 'oklch(0.64 0.22 28 / 0.1)' : 'var(--secondary)',
                      borderColor:     active ? 'var(--primary)' : 'transparent',
                      color:           active ? 'var(--primary)' : 'var(--foreground)',
                      transform:       active ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <span className="text-2xl leading-none">{chip.emoji}</span>
                    <span className="text-xs font-semibold">{chip.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected ingredients */}
          {current.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--muted-foreground)' }}>
                In your basket ({current.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {current.map((i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                    <span className="capitalize">{i}</span>
                    <button onClick={() => removeIngredient(i)} className="ml-0.5 hover:text-red-500 transition-colors">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters + CTA */}
          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['any', 'veg', 'non-veg']).map((d) => (
                <button key={d} onClick={() => setFilter('diet', d)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                  style={{
                    backgroundColor: filters?.diet === d ? 'var(--foreground)' : 'transparent',
                    color:           filters?.diet === d ? 'var(--card)' : 'var(--muted-foreground)',
                    borderColor:     filters?.diet === d ? 'var(--foreground)' : 'var(--border)',
                  }}>
                  {d === 'any' ? 'Any' : d === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                </button>
              ))}
              <button onClick={() => setFilter('highProtein', !filters?.highProtein)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                style={{
                  backgroundColor: filters?.highProtein ? 'var(--foreground)' : 'transparent',
                  color:           filters?.highProtein ? 'var(--card)' : 'var(--muted-foreground)',
                  borderColor:     filters?.highProtein ? 'var(--foreground)' : 'var(--border)',
                }}>
                💪 High Protein
              </button>
              <button onClick={() => setFilter('quick', !filters?.quick)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                style={{
                  backgroundColor: filters?.quick ? 'var(--foreground)' : 'transparent',
                  color:           filters?.quick ? 'var(--card)' : 'var(--muted-foreground)',
                  borderColor:     filters?.quick ? 'var(--foreground)' : 'var(--border)',
                }}>
                ⚡ Under 30 min
              </button>
              <select value={filters?.cuisine || 'Mixed'}
                onChange={(e) => setFilter('cuisine', e.target.value)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
                {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button onClick={onSuggest}
              disabled={loading || current.length === 0}
              className="w-full md:w-auto font-bold px-7 py-3.5 rounded-full transition-all"
              style={{
                background: (loading || current.length === 0) ? 'var(--muted)' : 'var(--gradient-hero)',
                color: 'white',
                opacity: (loading || current.length === 0) ? 0.5 : 1,
                cursor: (loading || current.length === 0) ? 'not-allowed' : 'pointer',
                boxShadow: (loading || current.length === 0) ? 'none' : '0 4px 20px oklch(0.6 0.24 25 / 0.35)',
              }}>
              {loading ? '🍳 Cooking ideas…' : meals.length > 0 ? '🔄 Get new ideas' : '🍽️ Suggest meals'}
            </button>
          </div>
        </section>

        {/* ── Results ──────────────────────────────────────────────────── */}
        <section ref={resultsRef} className="mt-10">
          {/* Skeletons while loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden border animate-pulse"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="h-40" style={{ backgroundColor: 'var(--muted)' }} />
                  <div className="p-4 space-y-2">
                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--muted)' }} />
                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--muted)' }} />
                    <div className="h-3 rounded w-full" style={{ backgroundColor: 'var(--muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results grid */}
          {!loading && meals.length > 0 && (
            <>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
                    Tonight's picks 🔥
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Hand-picked for what's in your kitchen
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                  {meals.length} ideas
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map((m, i) => (
                  <MealCard key={m.name} meal={m} index={i}
                    onOpen={openRecipe}
                    saved={!!state.saved.find((s) => s.name === m.name)}
                    onSave={(meal) => dispatch({ type: 'toggleSave', meal })}
                    onThumbDown={(meal) => dispatch({ type: 'thumbDown', meal })}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {!loading && meals.length === 0 && (
            <div className="mt-10 text-center py-12 px-5 border border-dashed rounded-3xl"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="text-5xl mb-3">🍳</div>
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Your kitchen is waiting</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Add a few ingredients above and we'll do the thinking.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
