import { useState } from 'react';
import { Icons } from '../components/Icons.jsx';
import { Chip, IconBtn, SectionLabel } from '../components/UI.jsx';
import { MealArt } from '../components/MealArt.jsx';
import { MEAL_LIBRARY, hashCode } from '../lib/meals.js';

export function RecipeSheet({ meal, onClose, saved, onSave }) {
  if (!meal) return null;
  const [tab, setTab] = useState('ingredients');

  const hue = Math.abs(hashCode(meal.name)) % 360;
  const heroBg = `linear-gradient(180deg, oklch(${0.78 + (Math.abs(hashCode(meal.name)) % 8) / 100} 0.07 ${hue}) 0%, oklch(${0.92 + (Math.abs(hashCode(meal.name)) % 4) / 100} 0.03 ${hue}) 100%)`;
  const videoBg = `linear-gradient(135deg, oklch(0.30 0.04 ${hue}) 0%, oklch(0.18 0.03 ${hue}) 100%)`;

  return (
    <div className="absolute inset-0 z-[200] bg-bg">
      <div className="h-full overflow-auto pb-16 no-scrollbar">
        {/* Hero */}
        <div className="relative pt-14 pb-6 px-5" style={{ background: heroBg }}>
          <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
            <IconBtn icon={<Icons.ArrowL size={18} sw={2} />} label="Close" onClick={onClose} />
            <IconBtn
              icon={saved ? <Icons.HeartF size={17} /> : <Icons.Heart size={17} />}
              label="Save"
              onClick={() => onSave(meal)}
              tone={saved ? 'solid' : 'default'}
            />
          </div>

          <div className="pt-7 flex flex-col items-start gap-3.5">
            <MealArt meal={meal} size={88} radius={20} />
            <div>
              <h2 className="font-serif text-[36px] m-0 mt-1.5 mb-1 leading-none tracking-[-0.02em] font-normal text-ink">
                {meal.name}
              </h2>
              <div className="flex gap-2 items-center mt-1.5 text-ink-2">
                <span className="inline-flex gap-1 items-center text-[13.5px]">
                  <Icons.Clock size={13} />
                  {meal.cook}
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-current opacity-40" />
                <span className="text-[13.5px]">{meal.cuisine}</span>
                {meal.protein === 'High' && (
                  <>
                    <span className="w-[3px] h-[3px] rounded-full bg-current opacity-40" />
                    <span className="text-[13.5px]">High protein</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* YouTube — opens YouTube search in new tab */}
        <div className="px-5 pt-4 pb-1.5">
          {(() => {
            const ytQuery = meal.yt_search || meal.yt || (meal.name + ' Indian recipe');
            const ytUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ytQuery);
            const openYT = () => { window.open(ytUrl, '_blank', 'noopener,noreferrer'); };
            return (
              <div
                role="button"
                tabIndex={0}
                onClick={openYT}
                onKeyDown={(e) => e.key === 'Enter' && openYT()}
                className="tap relative rounded-[var(--r-lg)] overflow-hidden border border-line cursor-pointer"
                style={{ background: '#1a1a1a', aspectRatio: '16/9' }}
                aria-label={'Watch ' + meal.name + ' recipe on YouTube'}
              >
                <div className="absolute inset-0 grid place-items-center" style={{ background: videoBg }}>
                  <div
                    className="w-14 h-14 rounded-full grid place-items-center text-white"
                    style={{ background: 'rgba(220,40,40,0.95)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  >
                    <Icons.Play size={22} />
                  </div>
                </div>
                <div
                  className="absolute left-3 bottom-2.5 right-3 text-white text-[13.5px] font-medium flex items-center gap-1.5"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                >
                  <Icons.Yt size={20} />
                  <span className="flex-1 truncate">{ytQuery}</span>
                  <span className="text-[11px] opacity-70 font-mono shrink-0">Watch ↗</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3.5 flex gap-1 border-b border-line">
          {[['ingredients', 'Ingredients'], ['steps', 'Steps'], ['why', 'Why this']].map(([id, l]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`tap bg-transparent border-0 cursor-pointer px-1 py-2.5 mr-3.5 text-sm font-medium ${tab === id ? 'text-ink border-b-2 border-ink' : 'text-muted border-b-2 border-transparent'}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="px-5 py-5 pb-7">
          {tab === 'ingredients' && (
            <ul className="list-none p-0 m-0 flex flex-col gap-1">
              {meal.ingredients.map((ing, i) => {
                const isMissing = meal.missing && meal.missing.some((m) => ing.toLowerCase().includes(m.toLowerCase()));
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 py-2.5 border-b border-line-2 text-[14.5px] text-ink"
                  >
                    <span
                      className="w-[18px] h-[18px] rounded-md border-[1.5px] border-line grid place-items-center shrink-0 bg-paper"
                    />
                    <span className="flex-1">{ing}</span>
                    {isMissing && (
                      <span className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-[oklch(0.94_0.04_40)] text-accent-ink font-mono uppercase tracking-[0.05em]">
                        missing
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {tab === 'steps' && (
            <ol className="p-0 m-0 list-none">
              {meal.steps.map((s, i) => (
                <li key={i} className="flex gap-3.5 py-3.5 border-b border-line-2">
                  <span className="w-7 h-7 rounded-full bg-ink text-white shrink-0 grid place-items-center font-serif text-sm">
                    {i + 1}
                  </span>
                  <p className="m-0 text-[14.5px] leading-[1.5] text-ink pt-1">{s}</p>
                </li>
              ))}
            </ol>
          )}
          {tab === 'why' && (
            <div>
              <p className="font-serif text-[22px] leading-[1.3] italic text-ink m-0 mt-1 mb-4">
                "{meal.reason}"
              </p>
              <SectionLabel>You already have</SectionLabel>
              <div className="flex gap-1.5 flex-wrap mb-4">
                {meal.matches.map((m) => (
                  <Chip key={m} size="sm" selected>{m}</Chip>
                ))}
              </div>
              {meal.missing.length > 0 && (
                <>
                  <SectionLabel>You'll need to grab</SectionLabel>
                  <div className="flex gap-1.5 flex-wrap">
                    {meal.missing.map((m) => (
                      <Chip key={m} size="sm">{m}</Chip>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Alternates */}
        <div className="px-5 pt-1.5 pb-16">
          <SectionLabel>Other ideas</SectionLabel>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {MEAL_LIBRARY.filter((m) => m.name !== meal.name).slice(0, 5).map((m) => (
              <div
                key={m.name}
                className="shrink-0 w-[120px] p-2.5 border border-line rounded-[var(--r-md)] bg-paper"
              >
                <MealArt meal={m} size={52} radius={10} />
                <div className="text-[12.5px] font-medium mt-2 leading-[1.2]">{m.name}</div>
                <div className="text-[11px] text-muted mt-0.5">{m.cook}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
