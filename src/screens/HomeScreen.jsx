import { useState, useEffect } from 'react';
import { Icons } from '../components/Icons.jsx';
import { Chip, PrimaryBtn, IconBtn, SectionLabel } from '../components/UI.jsx';
import { SUGGESTED_CHIPS, parseIngredients, toText } from '../lib/meals.js';

export function HomeScreen({ state, dispatch, goTo }) {
  const { ingredients, pantry } = state;
  const [text, setText] = useState(ingredients.join(', '));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setText(ingredients.join(', '));
  }, [ingredients]);

  const addChip = (name) => {
    const cur = parseIngredients(text);
    if (cur.includes(name.toLowerCase())) return;
    const next = [...cur, name.toLowerCase()];
    setText(toText(next));
    dispatch({ type: 'setIngredients', items: next });
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

  const current = parseIngredients(text);
  const pantryUnused = pantry.filter((p) => !current.includes(p));

  return (
    <div className="fade-in px-5 pt-1 pb-28 overflow-auto h-full no-scrollbar">
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
          <div className="flex gap-1">
            <IconBtn
              icon={<Icons.Cam size={18} />}
              label="Upload photo"
              size={32}
              onClick={() => dispatch({ type: 'toast', text: 'Photo recognition · coming soon' })}
            />
            <IconBtn
              icon={<Icons.Mic size={18} />}
              label="Voice input"
              size={32}
              onClick={() => dispatch({ type: 'toast', text: 'Voice input · coming soon' })}
            />
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
