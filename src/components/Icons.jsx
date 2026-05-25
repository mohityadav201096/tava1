// Line icons — 1.6 stroke, 24x24 viewBox by default.

const Svg = ({ size = 20, sw = 1.6, vb = '0 0 24 24', children }) => (
  <svg
    width={size}
    height={size}
    viewBox={vb}
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const Icons = {
  Home:   (p) => <Svg {...p}><path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M10 20v-5h4v5"/></Svg>,
  Spark:  (p) => <Svg {...p}><path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16l-1.7-4.6L5.7 9.8l4.6-1.7L12 3.5z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7L19 15z"/></Svg>,
  Heart:  (p) => <Svg {...p}><path d="M12 20s-7-4.3-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.7-7 10-7 10z"/></Svg>,
  HeartF: (p) => (
    <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 20.5s-7.2-4.4-7.2-10.3A4.2 4.2 0 0112 7a4.2 4.2 0 017.2 3.2c0 5.9-7.2 10.3-7.2 10.3z"/>
    </svg>
  ),
  Gear:   (p) => <Svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 14.5a1.7 1.7 0 00.4 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.4 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.9.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.4-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.4-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.4H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.4l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.4 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1z"/></Svg>,
  Plus:   (p) => <Svg {...p}><path d="M12 5v14M5 12h14"/></Svg>,
  X:      (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18"/></Svg>,
  Cam:    (p) => <Svg {...p}><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></Svg>,
  Mic:    (p) => <Svg {...p}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></Svg>,
  ArrowL: (p) => <Svg {...p}><path d="M15 5l-7 7 7 7"/></Svg>,
  ArrowR: (p) => <Svg {...p}><path d="M9 5l7 7-7 7"/></Svg>,
  Clock:  (p) => <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Svg>,
  Leaf:   (p) => <Svg {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19c4-4 7-7 11-11"/></Svg>,
  Flame:  (p) => <Svg {...p}><path d="M12 3s4 4 4 8a4 4 0 11-8 0c0-1 .5-2 1.5-3-.5 2 .5 3 1 3 .5-1 0-3 1.5-8z"/></Svg>,
  Bolt:   (p) => <Svg {...p}><path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"/></Svg>,
  Play:   (p) => (
    <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4l13 8-13 8z"/>
    </svg>
  ),
  Yt:     (p) => (
    <svg width={p.size || 20} height={(p.size || 20) * 0.6} viewBox="0 0 24 14" fill="currentColor" aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="13" rx="3"/>
      <path d="M9.5 3v8l7-4-7-4z" fill="#fff"/>
    </svg>
  ),
  ThumbU: (p) => <Svg {...p}><path d="M7 11v8H4v-8h3zM7 11l4-7c1.5 0 2.5 1 2.5 2.5V10h5a2 2 0 012 2.3l-1.2 6A2 2 0 0117.3 20H7"/></Svg>,
  ThumbD: (p) => <Svg {...p}><path d="M7 13V5H4v8h3zM7 13l4 7c1.5 0 2.5-1 2.5-2.5V14h5a2 2 0 002-2.3l-1.2-6A2 2 0 0017.3 4H7"/></Svg>,
  Check:  (p) => <Svg {...p}><path d="M5 12l4.5 4.5L19 7"/></Svg>,
  Refresh:(p) => <Svg {...p}><path d="M20 8a8 8 0 10-1 9"/><path d="M20 3v5h-5"/></Svg>,
  Sliders:(p) => <Svg {...p}><path d="M3 6h18M6 12h12M10 18h4"/></Svg>,
};
