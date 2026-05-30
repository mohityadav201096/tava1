import { useState } from 'react';
import { MealCard } from '../components/MealCard.jsx';
import { RecipeSheet } from './RecipeSheet.jsx';

export function SavedScreen({ state, dispatch }) {
  const { saved } = state;
  const [openMeal, setOpenMeal] = useState(null);

  const remove = (name) => dispatch({ type: 'toggleSave', meal: { name } });

  return (
    <div className="min-h-screen pb-24 md:pb-12" style={{ backgroundColor: 'var(--background)' }}>
      <main className="max-w-3xl mx-auto px-5 pt-8 md:pt-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
          Saved meals
        </h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          Your favourite ideas, always one tap away.
        </p>

        {saved.length === 0 ? (
          <div className="mt-12 text-center py-16 border border-dashed rounded-3xl"
            style={{ borderColor: 'var(--border)' }}>
            <div className="text-5xl mb-3">❤️</div>
            <p style={{ color: 'var(--muted-foreground)' }}>No saved meals yet.</p>
            <p className="text-sm mt-1" style={{ color: 'oklch(0.5 0.02 40 / 0.7)' }}>
              Tap ♥ on any suggestion to keep it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {saved.map((m, i) => (
              <div key={m.name} className="relative">
                <MealCard
                  meal={m}
                  index={i}
                  onOpen={setOpenMeal}
                  saved={true}
                  onSave={() => remove(m.name)}
                />
                <button
                  onClick={() => remove(m.name)}
                  className="absolute top-3 z-10 text-xs font-semibold text-white px-2 py-1 rounded-full"
                  style={{
                    right: '52px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {openMeal && (
        <RecipeSheet
          meal={openMeal}
          onClose={() => setOpenMeal(null)}
          saved={!!saved.find((s) => s.name === openMeal.name)}
          onSave={(m) => dispatch({ type: 'toggleSave', meal: m })}
        />
      )}
    </div>
  );
}
