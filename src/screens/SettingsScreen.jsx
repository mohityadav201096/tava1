function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className="relative rounded-full transition-colors shrink-0"
      style={{
        width: '44px',
        height: '24px',
        backgroundColor: value ? 'var(--primary)' : 'var(--muted)',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <span
        className="absolute rounded-full transition-transform"
        style={{
          top: '2px',
          left: '2px',
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transform: value ? 'translateX(20px)' : 'translateX(0)',
        }}
      />
    </button>
  );
}

const CUISINES = ['Mixed', 'North Indian', 'South Indian', 'Chinese', 'Italian'];

export function SettingsScreen({ state, dispatch }) {
  const { prefs, pantry } = state;
  const set = (key, val) => dispatch({ type: 'setPref', key, value: val });

  return (
    <div className="min-h-screen pb-24 md:pb-12" style={{ backgroundColor: 'var(--background)' }}>
      <main className="max-w-2xl mx-auto px-5 pt-8 md:pt-14 space-y-6">
        <header>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Settings
          </h1>
          <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Tune Tava to your kitchen.
          </p>
        </header>

        {/* Diet + cuisine */}
        <section className="rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>

          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Dietary preference
            </label>
            <div className="flex gap-2 mt-2">
              {(['any', 'veg', 'non-veg']).map((d) => (
                <button key={d} onClick={() => set('diet', d)}
                  className="px-4 py-2 rounded-full text-sm border transition-colors"
                  style={{
                    backgroundColor: prefs.diet === d ? 'var(--foreground)' : 'transparent',
                    color:           prefs.diet === d ? 'var(--card)' : 'var(--muted-foreground)',
                    borderColor:     prefs.diet === d ? 'var(--foreground)' : 'var(--border)',
                    cursor: 'pointer',
                  }}>
                  {d === 'any' ? 'Any' : d === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Cuisine preference
            </label>
            <select value={prefs.cuisine || 'Mixed'}
              onChange={(e) => set('cuisine', e.target.value)}
              className="mt-2 block w-full px-3 py-2 rounded-xl border"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}>
              {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </section>

        {/* Toggles */}
        <section className="rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Avoid repeating meals</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Skip recent suggestions when possible.
              </p>
            </div>
            <Toggle value={!!prefs.avoidRepeats} onChange={(v) => set('avoidRepeats', v)} />
          </div>

          <div className="flex items-center justify-between" style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Pantry memory</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Remember ingredients between sessions.
              </p>
            </div>
            <Toggle value={!!prefs.pantryMemory} onChange={(v) => set('pantryMemory', v)} />
          </div>
        </section>

        {/* Stored pantry */}
        {pantry.length > 0 && (
          <section className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Stored pantry ({pantry.length})
              </p>
              <button onClick={() => dispatch({ type: 'clearPantry' })}
                className="text-xs hover:underline"
                style={{ color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pantry.map((p) => (
                <span key={p} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                  {p}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
