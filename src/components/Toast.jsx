export function Toast({ text }) {
  if (!text) return null;
  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-1/2 z-[300]"
      style={{
        transform: 'translateX(-50%)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        className="px-4 py-2.5 rounded-full text-sm font-medium text-white whitespace-nowrap"
        style={{
          backgroundColor: 'oklch(0.18 0.02 30)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        {text}
      </div>
    </div>
  );
}
