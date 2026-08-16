const items = [
  'Lahore',
  'Islamabad',
  'Karachi',
  'Mirza & Farooq Studio',
  'Studio Nishat',
  'Anwer Kazmi Associates',
];

export function TrustStrip() {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-line bg-paper py-6">
      <div className="flex w-max animate-marquee gap-16">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-16 font-mono text-xs uppercase tracking-widest2 text-stone"
          >
            {item}
            <span className="text-line">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
