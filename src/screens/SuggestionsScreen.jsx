import { useEffect, useState } from 'react';
import { Icons } from '../components/Icons.jsx';
import { Chip, IconBtn, GhostBtn } from '../components/UI.jsx';
import { MealCard } from '../components/MealCard.jsx';
import { FiltersSheet } from './FiltersSheet.jsx';

const ThinkingStrip = () => (
  <div className="fade-in">
    <div className="bg-paper border border-line-2 rounded-[var(--r-lg)] py-5 px-4 mb-3 flex items-center gap-3.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full inline-block pulse-dot"
            style={{ background: 'var(--accent)', animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
      <div className="text-sm text-ink-2">Cross-checking your pantry…</div>
    </div>
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="shimmer rounded-[var(--r-lg)] mb-2.5"
        style={{ height: i === 0 ? 124 : 100, opacity: 1 - i * 0.15 }}
      />
    ))}
  </div>
);

export function SuggestionsScreen({ state, dispatch, goTo, openRecipe }) {
  const { ingredients, filters, meals, generating, feedback, saved } = state;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (state.pendingGenerate) {
      dispatch({ type: 'generate' });
    }
  }, [state.pendingGenerate]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterSummary = [
    ...filters.diet,
    ...filters.goals,
    filters.cuisine !== 'Any' ? filters.cuisine : null,
  ].filter(Boolean);

  return (
    <div className="px-5 pt-1 pb-28 overflow-auto h-full no-scrollbar">
      {/* Top */}
      <div className="flex justify-between items-center pt-1.5 mb-3.5">
        <IconBtn icon={<Icons.ArrowL size={18} sw={2} />} label="Back" onClick={() => goTo('home')} />
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
          five ideas
        </div>
        <IconBtn
          icon={<Icons.Refresh size={17} sw={1.8} />}
          label="Regenerate"
          onClick={() => dispatch({ type: 'generate' })}
        />
      </div>

      {/* Header */}
      <h1 className="font-serif text-[32px] leading-[1.05] tracking-[-0.015em] m-0 mt-2 mb-1.5 font-normal">
        {generating ? (
          <>
            Thinking of meals<span className="dots-anim" />
          </>
        ) : (
          <>
            For your <span className="italic text-accent-ink">kitchen</span>
          </>
        )}
      </h1>
      <p className="text-sm text-ink-2 m-0 mb-4">
        {generating
          ? 'Reading your ingredients, balancing protein and time…'
          : `Based on ${ingredients.length} ingredient${ingredients.length === 1 ? '' : 's'} you have.`}
      </p>

      {/* Filter bar */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-0.5 no-scrollbar">
        <Chip
          size="sm"
          onClick={() => setShowFilters(true)}
          icon={<Icons.Sliders size={13} sw={2} />}
        >
          Filters {filterSummary.length > 0 && <span className="text-accent">· {filterSummary.length}</span>}
        </Chip>
        {filterSummary.map((f) => (
          <Chip key={f} size="sm" selected>
            {f}
          </Chip>
        ))}
      </div>

      {/* Cards */}
      {generating ? (
        <ThinkingStrip />
      ) : (
        <div className="flex flex-col gap-3">
          {meals.map((m, i) => (
            <div key={m.name} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <MealCard
                meal={m}
                onOpen={() => openRecipe(m)}
                feedback={feedback[m.name]}
                saved={!!saved.find((s) => s.name === m.name)}
                onSave={() => dispatch({ type: 'toggleSave', meal: m })}
                onFeedback={(v) => dispatch({ type: 'setFeedback', meal: m, value: v })}
              />
            </div>
          ))}
          <div className="mt-3.5 flex justify-center">
            <GhostBtn
              onClick={() => dispatch({ type: 'generate' })}
              icon={<Icons.Refresh size={16} />}
            >
              Regenerate suggestions
            </GhostBtn>
          </div>
        </div>
      )}

      {showFilters && (
        <FiltersSheet
          filters={filters}
          onClose={() => setShowFilters(false)}
          onChange={(f) => dispatch({ type: 'setFilters', filters: f })}
          onApply={() => { setShowFilters(false); dispatch({ type: 'generate' }); }}
        />
      )}
    </div>
  );
}
