import { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from '../components/Icons.jsx';
import { Chip, PrimaryBtn, IconBtn, SectionLabel } from '../components/UI.jsx';
import { SUGGESTED_CHIPS, parseIngredients, toText } from '../lib/meals.js';

// ─── Voice Recognition hook ───────────────────────────────────────────────────
function useVoiceInput({ onResult, onError }) {
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      onError('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    const recog = new SR();
    recog.lang = 'en-IN';
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed') onError('Microphone access denied. Allow mic in browser settings.');
      else if (e.error === 'no-speech') onError('No speech detected. Try again.');
      else onError('Voice error: ' + e.error);
    };
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      // Parse spoken ingredients: split on "and", comma, "also", etc.
      const raw = transcript
        .toLowerCase()
        .replace(/\b(and|also|plus|with|some|a|an|the)\b/g, ',')
        .split(/[,،،]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1);
      onResult(raw);
    };

    recogRef.current = recog;
    recog.start();
  }, [onResult, onError]);

  const stop = useCallback(() => {
    recogRef.current?.stop();
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop(); else start();
  }, [listening, start, stop]);

  return { listening, toggle };
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function HomeScreen({ state, dispatch, goTo }) {
  const { ingredients, pantry } = state;
  const [text, setText] = useState(ingredients.join(', '));
  const [focused, setFocused] = useState(false);
  const [identifying, setIdentifying] = useState(false); // camera loading state
  const fileInputRef = useRef(null);

  useEffect(() => {
    setText(ingredients.join(', '));
  }, [ingredients]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const addIngredients = useCallback((newItems) => {
    const cur = new Set(parseIngredients(text));
    newItems.forEach((i) => cur.add(i.toLowerCase().trim()));
    const merged = [...cur].filter(Boolean);
    setText(toText(merged));
    dispatch({ type: 'setIngredients', items: merged });
  }, [text, dispatch]);

  const addChip = (name) => {
    const cur = parseIngredients(text);
    if (cur.includes(name.toLowerCase())) return;
    addIngredients([name]);
  };

  const removeChip = (name) => {
    const cur = parseIngredients(text).filter((x) => x !== name.toLowerCase());
    setText(toText(cur));
    dispatch({ type: 'setIngredients', items: cur });
  };

  const commit = () => {
    const items = parseIngredients(text);
    dispatch({ type: 'setIngredients', items });
    return items;
  };

  const onSuggest = () => {
    const items = commit();
    if (items.length === 0) return;
    dispatch({ type: 'addToPantry', items });
    goTo('suggestions', { trigger: 'generate' });
  };

  // ── Camera / Photo Recognition ─────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      dispatch({ type: 'toast', text: 'Please select an image file.' });
      return;
    }

    setIdentifying(true);
    dispatch({ type: 'toast', text: 'Scanning your kitchen…' });

    try {
      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data.ingredients)) {
        throw new Error(data.error || 'Could not read image');
      }

      if (data.ingredients.length === 0) {
        dispatch({ type: 'toast', text: 'No ingredients found — try a clearer photo.' });
      } else {
        addIngredients(data.ingredients);
        dispatch({
          type: 'toast',
          text: `Found ${data.ingredients.length} ingredient${data.ingredients.length === 1 ? '' : 's'} ✓`,
        });
      }
    } catch (err) {
      console.error('[tava] identify error:', err);
      dispatch({ type: 'toast', text: 'Could not read photo. Try again.' });
    } finally {
      setIdentifying(false);
    }
  };

  const onCameraClick = () => {
    fileInputRef.current?.click();
  };

  // ── Voice Input ────────────────────────────────────────────────────────────
  const { listening, toggle: toggleVoice } = useVoiceInput({
    onResult: (items) => {
      if (items.length === 0) {
        dispatch({ type: 'toast', text: 'Could not catch that — try again.' });
        return;
      }
      addIngredients(items);
      dispatch({ type: 'toast', text: `Added: ${items.join(', ')}` });
    },
    onError: (msg) => dispatch({ type: 'toast', text: msg }),
  });

  const current = parseIngredients(text);
  const pantryUnused = pantry.filter((p) => !current.includes(p));

  return (
    <div className="fade-in px-5 pt-1 pb-28 overflow-auto h-full no-scrollbar">
      {/* Hidden file input for camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Top brand row */}
      <div className="flex justify-between items-center pt-1.5 mb-5">
        <div className="flex items-center gap-2">
          <div
            className="w-[30px] h-[30px] rounded-full grid place-items-center text-white font-serif text-[19px] italic"
            style={{
              background: 'var(--accent)',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 1.5px 2px rgba(255,255,255,0.5)',
            }}
          >
            t
          </div>
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
            tava · tue evening
          </div>
        </div>
        <button
          onClick={() => goTo('settings')}
          className="tap w-[34px] h-[34px] rounded-full bg-paper border border-line grid place-items-center font-serif text-base text-ink cursor-pointer"
        >
          A
        </button>
      </div>

      {/* Hero */}
      <h1 className="font-serif text-[40px] leading-[1.0] tracking-[-0.015em] m-0 mt-2 mb-2.5 text-ink font-normal">
        Let's figure out<br />
        <span className="italic text-accent-ink">dinner</span> together.
      </h1>
      <p className="text-[15px] text-ink-2 m-0 mb-5 leading-[1.45] max-w-[320px]">
        Tell me what's in your kitchen and I'll suggest five things you could cook tonight.
      </p>

      {/* Input card */}
      <div
        className="bg-paper rounded-[var(--r-lg)] p-3.5 pb-2.5 mb-4 transition-[border-color,box-shadow] duration-150"
        style={{
          border: `1px solid ${focused ? 'var(--ink)' : 'var(--line)'}`,
          boxShadow: focused
            ? '0 0 0 4px oklch(0.22 0.012 60 / 0.06)'
            : '0 1px 2px rgba(30,20,10,0.04)',
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); commit(); }}
          placeholder="Paneer, onion, tomato, spinach…"
          rows={3}
          className="w-full border-0 outline-none resize-none bg-transparent text-base text-ink leading-[1.5] p-0 font-sans"
        />
        <div className="flex justify-between items-center pt-1.5">
          <div className="flex gap-1.5 items-center">
            {/* Camera button */}
            <button
              onClick={onCameraClick}
              disabled={identifying}
              title="Scan kitchen photo"
              className={`tap w-8 h-8 rounded-full border border-line grid place-items-center cursor-pointer transition-colors ${
                identifying
                  ? 'bg-accent border-accent text-white animate-pulse'
                  : 'bg-paper text-ink-2 hover:text-ink'
              }`}
            >
              {identifying
                ? <Icons.Clock size={16} />
                : <Icons.Cam size={17} />
              }
            </button>

            {/* Mic button */}
            <button
              onClick={toggleVoice}
              title={listening ? 'Tap to stop' : 'Speak your ingredients'}
              className={`tap w-8 h-8 rounded-full border grid place-items-center cursor-pointer transition-colors ${
                listening
                  ? 'bg-accent border-accent text-white'
                  : 'bg-paper border-line text-ink-2 hover:text-ink'
              }`}
            >
              <Icons.Mic size={17} />
            </button>

            {/* Status labels */}
            {identifying && (
              <span className="text-[11px] text-muted font-mono animate-pulse">scanning…</span>
            )}
            {listening && (
              <span className="text-[11px] text-accent font-mono animate-pulse">listening…</span>
            )}
          </div>

          <div className="font-mono text-[11px] text-muted">
            {current.length} {current.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      </div>

      {/* Current ingredient chips */}
      {current.length > 0 && (
        <div className="fade-up mb-4">
          <SectionLabel>In your kitchen</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {current.map((item) => (
              <button
                key={item}
                onClick={() => removeChip(item)}
                className="tap inline-flex items-center gap-1 px-3 pr-2 py-[7px] text-[13.5px] font-medium rounded-full border border-line bg-[oklch(0.94_0.02_60)] text-ink cursor-pointer leading-none capitalize"
              >
                {item}
                <Icons.X size={13} sw={2} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick add */}
      <div className="mb-5">
        <SectionLabel>Add quickly</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_CHIPS.filter((c) => !current.includes(c.toLowerCase())).slice(0, 8).map((c) => (
            <Chip key={c} size="sm" onClick={() => addChip(c)} icon={<Icons.Plus size={13} sw={2.2} />}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {/* Pantry */}
      {pantryUnused.length > 0 && (
        <div className="mb-5">
          <SectionLabel>From your pantry</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {pantryUnused.slice(0, 10).map((c) => (
              <Chip key={c} size="sm" onClick={() => addChip(c)}>
                <span className="capitalize">{c}</span>
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6">
        <PrimaryBtn
          full
          size="lg"
          disabled={current.length === 0}
          onClick={onSuggest}
          icon={<Icons.ArrowR size={18} sw={2} />}
        >
          Suggest meals
        </PrimaryBtn>
        <div className="text-center text-xs text-muted mt-2.5 font-mono tracking-[0.04em]">
          5 ideas · tuned to {current.length || '—'} ingredients
        </div>
      </div>
    </div>
  );
}
