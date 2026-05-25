export function Toast({ text }) {
  return (
    <div className="fade-up absolute left-1/2 -translate-x-1/2 bottom-24 bg-ink text-white px-4 py-2.5 rounded-full text-[13px] font-medium z-[80] shadow-[0_8px_24px_rgba(0,0,0,0.2)] whitespace-nowrap">
      {text}
    </div>
  );
}
