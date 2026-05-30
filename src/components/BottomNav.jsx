const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     icon: '🏠' },
  { id: 'saved',    label: 'Saved',    icon: '❤️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav({ active, onChange }) {
  return (
    <>
      {/* ── Desktop top nav ─────────────────────────────────────────────── */}
      <header className="hidden md:block border-b sticky top-0 z-30"
        style={{
          backgroundColor: 'oklch(1 0 0 / 0.9)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(12px)',
        }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onChange('home')}
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
            style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="w-8 h-8 rounded-xl grid place-items-center text-lg text-white"
              style={{ background: 'var(--gradient-hero)' }}>
              🍳
            </span>
            <span>Tava<span style={{ color: 'var(--primary)' }}>.</span></span>
          </button>
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => onChange(item.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active === item.id ? 'var(--primary)' : 'transparent',
                  color:           active === item.id ? 'white' : 'var(--muted-foreground)',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Mobile floating bottom nav ──────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-3 z-30 rounded-2xl grid grid-cols-3"
        style={{
          left: '12px',
          right: '12px',
          backgroundColor: 'oklch(1 0 0 / 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 30px -12px rgba(0,0,0,0.2)',
          border: '1px solid var(--border)',
        }}>
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => onChange(item.id)}
            className="py-3 flex flex-col items-center gap-0.5"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active === item.id ? 'var(--primary)' : 'var(--muted-foreground)',
              fontSize: '11px',
              fontWeight: 600,
            }}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
