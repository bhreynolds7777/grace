const ZONES = [
  { id: 'upper',  label: 'Upper Lake',     hint: 'Chestatee and upper Chattahoochee arms — shallower, more inflow influence, warms first in spring.' },
  { id: 'mid',    label: 'Mid Lake',       hint: 'Browns Bridge to Lanier Bridge area — classic main-lake structure, points, and humps.' },
  { id: 'deep',   label: 'Southern Deep',  hint: 'Buford Dam area — deepest water, coldest in summer, holds the year-round striper population.' },
];

export default function ZoneSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ZONES.map(z => {
        const selected = value === z.id;
        return (
          <button
            key={z.id}
            onClick={() => onChange(z.id)}
            title={z.hint}
            aria-pressed={selected}
            className={[
              'px-3 py-1.5 rounded-md text-sm font-medium border transition',
              selected
                ? 'bg-accent text-bg border-accent shadow-[0_0_18px_rgba(14,210,210,0.35)]'
                : 'bg-surface text-body border-edge hover:border-accent/60',
            ].join(' ')}
          >
            {z.label}
          </button>
        );
      })}
    </div>
  );
}
