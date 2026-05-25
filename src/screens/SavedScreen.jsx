import { useState } from 'react';
import { Chip, SmallTag } from '../components/UI.jsx';
import { MealArt } from '../components/MealArt.jsx';

export function SavedScreen({ state, openRecipe }) {
  const { saved } = state;
  const [tab, setTab] = useState('all');

  const filters = {
    all: () => true,
    veg: (m) => m.diet === 'Veg',
    quick: (m) => m.tags.includes('Quick'),
    protein: (m) => m.protein === 'High',
  };
  const list = saved.filter(filters[tab]);

  return (
    <div className="fade-in px-5 pt-1 pb-28 overflow-auto h-full no-scrollbar">
      <div className="pt-1.5 mb-3.5 font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
        your collection
      </div>
      <h1 className="font-serif text-[36px] leading-none tracking-[-0.015em] m-0 mb-1.5 font-normal">
        Saved <span className="italic text-accent-ink">meals</span>
      </h1>
      <p className="text-sm text-ink-2 m-0 mb-5">
        {saved.length} {saved.length === 1 ? 'recipe' : 'recipes'} you've kept.
      </p>

      <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
        {[['all', 'All'], ['veg', 'Veg'], ['quick', 'Quick'], ['protein', 'High protein']].map(([id, label]) => (
          <Chip key={id} size="sm" selected={tab === id} onClick={() => setTab(id)}>
            {label}
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="py-12 px-5 text-center border border-dashed border-line rounded-[var(--r-lg)] bg-paper">
          <div className="font-serif text-2xl mb-2 text-ink-2">Nothing here yet</div>
          <p className="text-[13.5px] text-muted m-0 leading-[1.4]">
            Tap the heart on any meal to keep it for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {list.map((m) => (
            <button
              key={m.name}
              onClick={() => openRecipe(m)}
              className="tap border border-line-2 rounded-[var(--r-lg)] p-3 bg-paper cursor-pointer flex flex-col gap-2.5 items-start text-left"
            >
              <MealArt meal={m} full radius={12} />
              <div className="w-full">
                <div className="font-serif text-[17.5px] font-normal leading-[1.1] mb-1">{m.name}</div>
                <div className="text-[11.5px] text-muted font-mono tracking-[0.02em]">
                  {m.cook} · {m.cuisine}
                </div>
                <div className="flex gap-1 flex-wrap mt-2">
                  <SmallTag>{m.diet}</SmallTag>
                  {m.protein === 'High' && <SmallTag tone="leaf">Protein</SmallTag>}
                  {m.tags.includes('Quick') && <SmallTag tone="accent">Quick</SmallTag>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
