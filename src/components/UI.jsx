// Shared UI primitives: Chip, PrimaryBtn, GhostBtn, IconBtn, Card, SectionLabel, SmallTag.
// Tailwind for layout/typography + CSS variables for the warm palette.

export const Chip = ({ children, selected, onClick, icon, size = 'md', tone = 'default' }) => {
  const pad = size === 'sm' ? 'px-3 py-[7px]' : 'px-3.5 py-[9px]';
  const fs = size === 'sm' ? 'text-[13px]' : 'text-sm';

  let cls = `inline-flex items-center gap-1.5 rounded-full border font-medium leading-none whitespace-nowrap cursor-pointer tap`;
  if (tone === 'accent') {
    cls += selected
      ? ' bg-[var(--accent)] text-white border-[var(--accent)]'
      : ' bg-paper text-ink border-line';
  } else {
    cls += selected
      ? ' bg-ink text-white border-ink'
      : ' bg-paper text-ink border-line';
  }

  return (
    <button onClick={onClick} className={`${cls} ${pad} ${fs}`}>
      {icon}
      {children}
    </button>
  );
};

export const PrimaryBtn = ({ children, onClick, icon, disabled, full, size = 'md' }) => {
  const pad = size === 'lg' ? 'px-5 py-4' : 'px-4 py-3';
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`tap inline-flex items-center justify-center gap-2.5 rounded-[var(--r-lg)] font-medium text-base text-white ${pad} ${full ? 'w-full' : ''} ${disabled ? 'bg-[oklch(0.85_0.02_60)] cursor-not-allowed' : 'bg-ink cursor-pointer shadow-[0_6px_18px_-8px_rgba(40,30,20,0.6),0_1px_2px_rgba(0,0,0,0.06)]'}`}
    >
      {children}
      {icon}
    </button>
  );
};

export const GhostBtn = ({ children, onClick, icon, full }) => (
  <button
    onClick={onClick}
    className={`tap inline-flex items-center justify-center gap-2 rounded-[var(--r-lg)] border border-line bg-paper text-ink text-[15px] font-medium px-4 py-3 cursor-pointer ${full ? 'w-full' : ''}`}
  >
    {icon}
    {children}
  </button>
);

export const IconBtn = ({ icon, onClick, label, tone = 'default', size = 36 }) => {
  const solid = tone === 'solid';
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`tap inline-flex items-center justify-center rounded-full p-0 shrink-0 cursor-pointer ${solid ? 'bg-ink text-white border-0' : 'bg-paper text-ink border border-line'}`}
    >
      {icon}
    </button>
  );
};

export const Card = ({ children, className = '', onClick, padded = true }) => (
  <div
    onClick={onClick}
    className={`bg-paper border border-line-2 rounded-[var(--r-lg)] ${padded ? 'p-4' : ''} shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(30,20,10,0.04)] ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

export const SectionLabel = ({ children, action }) => (
  <div className="flex items-baseline justify-between mb-2.5">
    <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted">
      {children}
    </div>
    {action}
  </div>
);

export const SmallTag = ({ children, tone = 'default' }) => {
  const tones = {
    default: 'bg-[oklch(0.95_0.01_60)] text-ink-2',
    leaf:    'bg-[oklch(0.93_0.05_145)] text-[oklch(0.36_0.09_145)]',
    accent:  'bg-[oklch(0.94_0.05_40)] text-accent-ink',
  };
  return (
    <span className={`text-[10.5px] px-1.5 py-0.5 rounded-full font-semibold tracking-[0.01em] ${tones[tone]}`}>
      {children}
    </span>
  );
};
