import { useState } from 'react';

const GRADIENTS = [
  'var(--gradient-card-1)',
  'var(--gradient-card-2)',
  'var(--gradient-card-3)',
  'var(--gradient-card-4)',
  'var(--gradient-card-5)',
];

function emojiFor(name = '', cuisine = '') {
  const s = (name + ' ' + cuisine).toLowerCase();
  if (/biryani|pulao|rice|fried rice/.test(s))     return '🍚';
  if (/paneer|curry|masala|gravy|tikka/.test(s))    return '🍛';
  if (/dosa|idli|uttapam|south/.test(s))            return '🥞';
  if (/roti|paratha|naan|chapati|atta/.test(s))     return '🫓';
  if (/dal|sambar|rasam|soup/.test(s))              return '🍲';
  if (/noodle|hakka|chow|chinese/.test(s))          return '🍜';
  if (/pasta|italian|pizza/.test(s))                return '🍝';
  if (/egg|omelet|bhurji/.test(s))                  return '🍳';
  if (/chicken|mutton|fish|kebab|non.?veg/.test(s)) return '🍗';
  if (/salad|raita|chutney/.test(s))                return '🥗';
  if (/sandwich|toast|bread/.test(s))               return '🥪';
  if (/sweet|kheer|halwa|laddu|dessert/.test(s))    return '🍮';
  return '🍽️';
}

function fakeRating(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return (4 + ((h % 90) / 100)).toFixed(1);
}

export function MealCard({ meal, index = 0, onOpen, saved: savedProp = false, onSave, onThumbDown }) {
  const [saved, setSaved] = useState(savedProp);

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved((v) => !v);
    onSave?.(meal);
  };

  const gradient = GRADIENTS[index % GRADIENTS.length];
  const emoji    = emojiFor(meal.name, meal.cuisine);
  const rating   = fakeRating(meal.name);

  // Normalise field names — Tava uses .name/.cook/.missing; new UI uses .meal_name/.cook_time/.missing_ingredients
  const mealName  = meal.name  || meal.meal_name  || '';
  const cookTime  = meal.cook  || meal.cook_time  || '';
  const missing   = meal.missing || meal.missing_ingredients || [];
  const haveAll   = missing.length === 0;
  const reason    = meal.reason || '';
  const cuisine   = meal.cuisine || '';
  const protein   = meal.protein || '';

  const ytQuery = meal.yt_search || meal.yt || (mealName + ' Indian recipe');
  const ytUrl   = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ytQuery);

  return (
    <article
      className="group rounded-3xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--card)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Gradient image area */}
      <div className="relative h-40 flex items-center justify-center text-6xl"
        style={{ background: gradient }}>

        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{emoji}</span>

        {/* Save / heart button */}
        <button onClick={handleSave} aria-label="Save meal"
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: saved ? 'var(--primary)' : 'rgba(255,255,255,0.85)',
            color: saved ? 'white' : 'var(--foreground)',
            backdropFilter: 'blur(4px)',
          }}>
          {saved ? '♥' : '♡'}
        </button>

        {/* Ready to cook badge */}
        {haveAll && (
          <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--brand-green)', backdropFilter: 'blur(4px)' }}>
            Ready to cook
          </span>
        )}

        {/* Cook time */}
        {cookTime && (
          <span className="absolute bottom-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            ⏱ {cookTime}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold leading-snug line-clamp-2" style={{ color: 'var(--card-foreground)' }}>
            {mealName}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-0.5 text-xs font-bold text-white px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'var(--brand-green)' }}>
            ★ {rating}
          </span>
        </div>

        {(cuisine || protein) && (
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {cuisine}{cuisine && protein ? ' · ' : ''}
            {protein === 'High' ? 'High protein' : protein === 'Medium' ? 'Balanced' : protein === 'Low' ? 'Light' : ''}
          </p>
        )}

        {reason && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
            {reason}
          </p>
        )}

        {missing.length > 0 && (
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Need:</span>{' '}
            {missing.join(', ')}
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-auto pt-3 flex gap-2">
          <button onClick={() => onOpen?.(meal)}
            className="flex-1 text-xs font-semibold px-3 py-2.5 rounded-full transition-colors"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
            Recipe
          </button>
          <a href={ytUrl} target="_blank" rel="noreferrer"
            className="flex-1 text-center text-xs font-semibold px-3 py-2.5 rounded-full transition-opacity"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            ▶ Watch
          </a>
        </div>

        {/* Thumbs down */}
        {onThumbDown && (
          <button onClick={() => onThumbDown?.(meal)}
            className="text-center text-xs transition-colors mt-1"
            style={{ color: 'var(--muted-foreground)' }}>
            👎 Not this
          </button>
        )}
      </div>
    </article>
  );
}
