import { Icons } from './Icons.jsx';
import { Card } from './UI.jsx';
import { MealArt } from './MealArt.jsx';

const ProteinBadge = ({ level }) => {
  if (!level || level === 'Low') return null;
  const colors = {
    High: 'bg-[oklch(0.93_0.05_145)] text-[oklch(0.40_0.10_145)]',
    Med:  'bg-[oklch(0.94_0.04_80)] text-[oklch(0.42_0.10_80)]',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[11px] font-semibold tracking-[0.01em] ${colors[level] || colors.Med}`}>
      <Icons.Flame size={11} sw={2} />
      {level === 'High' ? 'High protein' : 'Protein'}
    </span>
  );
};

export function MealCard({ meal, onOpen, feedback, saved, onSave, onFeedback }) {
  return (
    <Card padded={false}>
      <div className="p-3.5 flex gap-3.5 items-start">
        <MealArt meal={meal} size={72} radius={16} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-serif text-[22px] m-0 font-normal leading-[1.1] tracking-[-0.01em]">
              {meal.name}
            </h3>
            <button
              onClick={onSave}
              aria-label="Save"
              className={`tap p-0.5 shrink-0 bg-transparent border-0 cursor-pointer ${saved ? 'text-accent' : 'text-muted'}`}
            >
              {saved ? <Icons.HeartF size={20} /> : <Icons.Heart size={20} />}
            </button>
          </div>
          <div className="flex gap-2.5 mt-1.5 items-center flex-wrap">
            <span className="inline-flex items-center gap-1 text-[12.5px] text-ink-2 font-mono">
              <Icons.Clock size={12} sw={1.8} />
              {meal.cook}
            </span>
            <ProteinBadge level={meal.protein} />
            <span className="text-[12.5px] text-muted">{meal.cuisine}</span>
          </div>
          <p className="text-[13.5px] text-ink-2 m-0 mt-2.5 leading-[1.4]">{meal.reason}</p>
        </div>
      </div>

      {meal.missing && meal.missing.length > 0 && (
        <div className="px-3.5 py-2 border-t border-line-2 bg-[oklch(0.96_0.018_80)] flex items-center gap-2 text-xs text-ink-2">
          <span className="font-mono uppercase text-[10px] tracking-[0.1em] text-muted">You'll need</span>
          <span>{meal.missing.join(' · ')}</span>
        </div>
      )}

      <div className="flex px-2 py-2.5 pl-3.5 border-t border-line-2 items-center justify-between">
        <button
          onClick={onOpen}
          className="tap inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer text-ink text-sm font-medium px-1 py-1.5"
        >
          <span className="w-[22px] h-[22px] rounded-full bg-ink grid place-items-center text-white">
            <Icons.Play size={11} />
          </span>
          Open recipe
        </button>
        <div className="flex gap-0.5">
          <button
            onClick={() => onFeedback(feedback === 'up' ? null : 'up')}
            aria-label="Like"
            className={`tap w-8 h-8 rounded-full bg-transparent border-0 grid place-items-center cursor-pointer ${feedback === 'up' ? 'text-[var(--leaf)]' : 'text-muted'}`}
          >
            <Icons.ThumbU size={16} />
          </button>
          <button
            onClick={() => onFeedback(feedback === 'down' ? null : 'down')}
            aria-label="Dislike"
            className={`tap w-8 h-8 rounded-full bg-transparent border-0 grid place-items-center cursor-pointer ${feedback === 'down' ? 'text-accent' : 'text-muted'}`}
          >
            <Icons.ThumbD size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
