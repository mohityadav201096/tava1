// Meal art = soft warm color block + glyph or initials.
// Never tries to draw real food — keeps the design honest.

import { hashCode } from '../lib/meals.js';

export const MealArt = ({ meal, size = 64, radius = 14, full = false }) => {
  const hue = Math.abs(hashCode(meal.name)) % 360;
  const lightness = 0.78 + ((Math.abs(hashCode(meal.name)) % 12) / 100);
  const bg = `oklch(${lightness} 0.07 ${hue})`;
  const fg = `oklch(0.32 0.08 ${hue})`;
  const glyph = meal.glyph || meal.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const dimension = full ? '100%' : size;
  const fontSize = full ? '2.4rem' : size * 0.42;

  return (
    <div
      style={{
        width: dimension,
        height: full ? undefined : size,
        aspectRatio: full ? '4 / 3' : undefined,
        borderRadius: radius,
        background: bg,
        color: fg,
        fontSize,
        backgroundImage: 'radial-gradient(circle at 30% 25%, oklch(1 0 0 / 0.4) 0%, transparent 55%)',
      }}
      className="flex items-center justify-center font-serif shrink-0 tracking-[-0.01em]"
    >
      {glyph}
    </div>
  );
};
