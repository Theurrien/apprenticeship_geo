import './TimeSlider.css';

interface TimeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function TimeSlider({ value, onChange, min = 10, max = 60 }: TimeSliderProps) {
  return (
    <div className="time-slider">
      <label className="time-label">
        Temps de trajet maximum: <strong>{value} min</strong>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
      <div className="slider-labels">
        <span>{min} min</span>
        <span>{max} min</span>
      </div>
    </div>
  );
}
