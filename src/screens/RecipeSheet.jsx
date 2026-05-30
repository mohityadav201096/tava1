import { useEffect } from 'react';

export function RecipeSheet({ meal, onClose, saved, onSave }) {
  if (!meal) return null;

  const mealName = meal.name || meal.meal_name || '';
  const cookTime = meal.cook || meal.cook_time || '';
  const missing  = meal.missing || meal.missing_ingredients || [];
  const cuisine  = meal.cuisine || '';
  const protein  = meal.protein || '';
  const reason   = meal.reason || '';
  const ytQuery  = meal.yt_search || meal.yt || (mealName + ' Indian recipe');
  const ytUrl    = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ytQuery);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl overflow-y-auto"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--card-foreground)' }}>
                {mealName}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                {[cuisine, cookTime, protein ? protein + ' protein' : ''].filter(Boolean).join(' · ')}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Save button */}
              <button
                onClick={() => onSave?.(meal)}
                className="w-9 h-9 rounded-full border flex items-center justify-center transition-all"
                style={{
                  backgroundColor: saved ? 'var(--primary)' : 'transparent',
                  borderColor: saved ? 'var(--primary)' : 'var(--border)',
                  color: saved ? 'white' : 'var(--foreground)',
                }}
                aria-label="Save meal"
              >
                {saved ? '♥' : '♡'}
              </button>
              {/* Close button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full border flex items-center justify-center"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* YouTube search card */}
          <a
            href={ytUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl p-4 mb-5 transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #FF0000 0%, #c4302b 100%)',
              textDecoration: 'none',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <span style={{ fontSize: '1.5rem', color: 'white' }}>▶</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">Watch on YouTube</p>
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {ytQuery}
              </p>
            </div>
            <span className="ml-auto text-white text-xl">↗</span>
          </a>

          {/* Why this */}
          {reason && (
            <section className="mb-5">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Why this</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{reason}</p>
            </section>
          )}

          {/* Ingredients you have */}
          {meal.matches && meal.matches.length > 0 && (
            <section className="mb-5">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>You already have</h3>
              <div className="flex flex-wrap gap-1.5">
                {meal.matches.map((m) => (
                  <span key={m} className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: 'oklch(0.62 0.16 145 / 0.15)', color: 'var(--brand-green)' }}>
                    ✓ {m}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Ingredients list */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <section className="mb-5">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Ingredients</h3>
              <ul className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                {meal.ingredients.map((ing, i) => {
                  const isMissing = missing.some((m) => ing.toLowerCase().includes(m.toLowerCase()));
                  return (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: isMissing ? 'var(--destructive)' : 'var(--brand-green)' }} />
                      <span className={isMissing ? 'text-muted-foreground' : ''}>{ing}</span>
                      {isMissing && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: 'oklch(0.58 0.24 25 / 0.1)', color: 'var(--destructive)' }}>
                          missing
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* You'll also need */}
          {missing.length > 0 && !meal.ingredients && (
            <section className="mb-5">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>You'll also need</h3>
              <ul className="text-sm list-disc pl-5 space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                {missing.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </section>
          )}

          {/* Steps */}
          {meal.steps && meal.steps.length > 0 && (
            <section className="mb-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Steps</h3>
              <ol className="space-y-3">
                {meal.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full shrink-0 grid place-items-center text-sm font-semibold text-white"
                      style={{ backgroundColor: 'var(--foreground)' }}>
                      {i + 1}
                    </span>
                    <p className="text-sm pt-1 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{s}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Watch on YouTube CTA */}
          <a href={ytUrl} target="_blank" rel="noreferrer"
            className="block text-center w-full rounded-full py-3 font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            Watch full recipe on YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}
