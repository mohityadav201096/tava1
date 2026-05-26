import { useState } from 'react';
import { Chip, PrimaryBtn, SectionLabel } from '../components/UI.jsx';
import { Icons } from '../components/Icons.jsx';

export function FiltersSheet({ filters, onChange, onClose, onApply }) {
  const [local, setLocal] = useState(filters);

  const toggle = (key, value) => {
    setLocal((prev) => {
      if (key === 'cuisine') return { ...prev, cuisine: value };
      const cur = new Set(prev[key]);
      if (cur.has(value)) cur.delete(value); else cur.add(value);
      return { ...prev, [key]: [...cur] };
    });
  };

  return (
    <div className="absolute inset-0 z-[100]">
      <div onClick={onClose} className="fade-in absolute inset-0 bg-[rgba(20,15,10,0.35)]" />
      <div
        className="sheet-up absolute left-0 right-0 bottom-0 bg-bg pt-3.5 px-5 pb-8 max-h-[85%] overflow-auto"
        style={{
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
        }}
      >
        <div className="w-10 h-1 rounded-sm bg-line mx-auto mt-1 mb-4" />

        <div className="flex justify-between items-baseline mb-1">
          <h2 className="font-serif text-[28px] m-0 font-normal">Tune the search</h2>
          <button onClick={onClose} className="bg-transparent border-0 text-muted text-sm cursor-pointer">
            Cancel
          </button>
        </div>
        <p className="text-ink-2 text-sm m-0 mb-5">Optional — leave blank and I'll guess.</p>

        <SectionLabel>Diet</SectionLabel>
        <div className="flex gap-1.5 flex-wrap mb-5">
          {['Veg', 'Non-Veg', 'Egg', 'Vegan'].map((d) => (
            <Chip key={d} selected={local.diet.includes(d)} onClick={() => toggle('diet', d)}>
              {d}
            </Chip>
          ))}
        </div>

        <SectionLabel>Goals</SectionLabel>
        <div className="flex gap-1.5 flex-wrap mb-5">
          {[
            { label: 'High Protein', icon: <Icons.Flame size={14} /> },
            { label: 'Quick (<30 min)', icon: <Icons.Bolt size={14} /> },
            { label: 'Light', icon: <Icons.Leaf size={14} /> },
            { label: 'Comfort', icon: null },
          ].map((g) => (
            <Chip
              key={g.label}
              icon={g.icon}
              selected={local.goals.includes(g.label)}
              onClick={() => toggle('goals', g.label)}
            >
              {g.label}
            </Chip>
          ))}
        </div>

        <SectionLabel>Cuisine</SectionLabel>
        <div className="flex gap-1.5 flex-wrap mb-7">
          {['Any', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mixed'].map((c) => (
            <Chip
              key={c}
              selected={local.cuisine === c}
              onClick={() => toggle('cuisine', c)}
              tone="accent"
            >
              {c}
            </Chip>
          ))}
        </div>

        <PrimaryBtn
          full
          size="lg"
          onClick={() => { onChange(local); onApply(); }}
          icon={<Icons.Check size={18} sw={2.2} />}
        >
          Apply & regenerate
        </PrimaryBtn>
      </div>
    </div>
  );
}
