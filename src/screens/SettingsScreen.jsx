import { Icons } from '../components/Icons.jsx';
import { Chip, SectionLabel } from '../components/UI.jsx';

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="tap w-[42px] h-[25px] rounded-full border-0 cursor-pointer p-0.5 flex items-center transition-colors duration-200"
    style={{ background: value ? 'var(--accent)' : 'oklch(0.85 0.01 70)' }}
  >
    <span
      className="w-[21px] h-[21px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200"
      style={{ transform: value ? 'translateX(17px)' : 'translateX(0)' }}
    />
  </button>
);

const SettingsGroup = ({ label, children }) => (
  <div className="mb-5">
    <SectionLabel>{label}</SectionLabel>
    <div className="bg-paper border border-line-2 rounded-[var(--r-lg)] overflow-hidden">
      {children}
    </div>
  </div>
);

const SettingRow = ({ title, desc, value, onChange, last }) => (
  <div
    className={`px-4 py-3.5 flex items-center gap-3.5 ${last ? '' : 'border-b border-line-2'}`}
  >
    <div className="flex-1">
      <div className="text-[14.5px] font-medium text-ink">{title}</div>
      {desc && <div className="text-[12.5px] text-muted mt-0.5">{desc}</div>}
    </div>
    <Toggle value={value} onChange={onChange} />
  </div>
);

export function SettingsScreen({ state, dispatch }) {
  const s = state.prefs;
  const setPref = (k, v) => dispatch({ type: 'setPref', key: k, value: v });

  return (
    <div className="fade-in px-5 pt-1 pb-28 overflow-auto h-full no-scrollbar">
      <div className="pt-1.5 mb-3.5 font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
        preferences
      </div>
      <h1 className="font-serif text-[36px] leading-none tracking-[-0.015em] m-0 mb-1.5 font-normal">
        Your <span className="italic text-accent-ink">kitchen</span>
      </h1>
      <p className="text-sm text-ink-2 m-0 mb-5">We use this to tune suggestions.</p>

      <SettingsGroup label="Dietary default">
        <div className="flex gap-1.5 flex-wrap p-3 pb-2">
          {['Veg', 'Non-Veg', 'Egg', 'Vegan'].map((d) => (
            <Chip key={d} size="sm" selected={s.diet === d} onClick={() => setPref('diet', d)}>
              {d}
            </Chip>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup label="Favorite cuisine">
        <div className="flex gap-1.5 flex-wrap p-3 pb-2">
          {['North Indian', 'South Indian', 'Chinese', 'Italian', 'Mixed'].map((c) => (
            <Chip key={c} size="sm" selected={s.cuisine === c} onClick={() => setPref('cuisine', c)}>
              {c}
            </Chip>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup label="Household size">
        <div className="flex gap-1.5 p-3 pb-2">
          {[1, 2, 3, 4, '5+'].map((n) => (
            <Chip key={n} size="sm" selected={s.household === n} onClick={() => setPref('household', n)}>
              {n}
            </Chip>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup label="Smart behavior">
        <SettingRow
          title="Pantry memory"
          desc="Remember ingredients across sessions"
          value={s.pantryMemory}
          onChange={(v) => setPref('pantryMemory', v)}
        />
        <SettingRow
          title="Avoid repeats"
          desc="Don't suggest meals from the last 3 days"
          value={s.avoidRepeats}
          onChange={(v) => setPref('avoidRepeats', v)}
        />
        <SettingRow
          title="Quick by default"
          desc="Prefer meals under 30 minutes"
          value={s.quickDefault}
          onChange={(v) => setPref('quickDefault', v)}
          last
        />
      </SettingsGroup>

      <SettingsGroup label="Pantry">
        <div className="px-3.5 pt-3 pb-2 flex flex-wrap gap-1.5">
          {state.pantry.length === 0 ? (
            <span className="text-muted text-[13px]">Your pantry is empty.</span>
          ) : (
            state.pantry.map((p) => (
              <button
                key={p}
                onClick={() => dispatch({ type: 'removePantry', item: p })}
                className="tap px-2.5 pr-1.5 py-1 text-[13px] font-medium rounded-full border border-line bg-[oklch(0.96_0.012_70)] text-ink cursor-pointer inline-flex items-center gap-1 leading-none capitalize"
              >
                {p}
                <Icons.X size={12} sw={2} />
              </button>
            ))
          )}
        </div>
      </SettingsGroup>

      <p className="text-[11.5px] text-muted text-center mt-7 font-mono tracking-[0.06em] uppercase">
        tava · v0.1 · made warm
      </p>
    </div>
  );
}
