import SpeciesCard from './SpeciesCard.jsx';
import HourlyChart from './HourlyChart.jsx';

const ORDER = [
  { key: 'striper', label: 'Striped Bass' },
  { key: 'spot',    label: 'Spotted Bass' },
  { key: 'crappie', label: 'Crappie' },
];

export default function BiteScoreDashboard({ scores, hourly, currentHour, onExplain }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {ORDER.map((s, idx) => (
          <SpeciesCard
            key={s.key}
            species={s.key}
            scoreData={scores?.[s.key]}
            onExplain={() => onExplain(s.key)}
            delay={idx * 80}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {ORDER.map(s => (
          <HourlyChart
            key={s.key}
            species={s.label}
            scores={hourly?.[s.key] || []}
            currentHour={currentHour}
          />
        ))}
      </div>
    </div>
  );
}
