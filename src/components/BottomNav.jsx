import { Icons } from './Icons.jsx';

export function BottomNav({ active, onChange }) {
  const items = [
    { id: 'home', label: 'Kitchen', icon: Icons.Home },
    { id: 'suggestions', label: 'Ideas', icon: Icons.Spark },
    { id: 'saved', label: 'Saved', icon: Icons.Heart },
    { id: 'settings', label: 'You', icon: Icons.Gear },
  ];
  return (
    <div
      className="absolute left-0 right-0 bottom-0 px-3 pt-2 pb-7 flex justify-around items-center z-40 border-t border-line"
      style={{
        background: 'oklch(0.97 0.012 76 / 0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {items.map((it) => {
        const isActive = active === it.id;
        const I = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`tap bg-transparent border-0 px-3 py-1.5 flex flex-col items-center gap-0.5 cursor-pointer ${isActive ? 'text-accent' : 'text-muted'}`}
          >
            <I size={22} sw={isActive ? 2 : 1.6} />
            <span
              className={`text-[10.5px] tracking-[0.02em] ${isActive ? 'font-semibold' : 'font-medium'}`}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
