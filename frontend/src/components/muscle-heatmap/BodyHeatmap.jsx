import { useState, useCallback } from 'react';
import MaleBodyFront from './MaleBodyFront';
import MaleBodyBack from './MaleBodyBack';
import FemaleBodyFront from './FemaleBodyFront';
import FemaleBodyBack from './FemaleBodyBack';
import { getMuscleColor } from './muscleColor';

/**
 * BodyHeatmap — Interactive muscle activation heatmap wrapper.
 *
 * @param {Object}   props
 * @param {string}   [props.view='front']     - 'front' | 'back'
 * @param {string}   [props.gender='male']    - 'male' | 'female'
 * @param {Object}   [props.muscleData={}]    - muscle_id → intensity (0-3)
 * @param {Function} [props.onMuscleClick]    - Callback(muscleName)
 * @param {string}   [props.className]        - Extra CSS class
 */
export default function BodyHeatmap({
  view: initialView = 'front',
  gender: initialGender = 'male',
  muscleData = {},
  onMuscleClick,
  className = '',
}) {
  const [view, setView] = useState(initialView);
  const [gender, setGender] = useState(initialGender);

  const handleMuscleClick = useCallback(
    (name) => { if (onMuscleClick) onMuscleClick(name); },
    [onMuscleClick]
  );

  const BodyComponent =
    gender === 'male'
      ? view === 'front' ? MaleBodyFront : MaleBodyBack
      : view === 'front' ? FemaleBodyFront : FemaleBodyBack;

  const legendItems = [
    { label: 'Inactive', intensity: 0 },
    { label: 'Low', intensity: 1 },
    { label: 'Medium', intensity: 2 },
    { label: 'High', intensity: 3 },
  ];

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* SVG Body */}
      <div
        className="w-full flex items-center justify-center"
        style={{ maxWidth: '280px' }}
      >
        <BodyComponent
          muscleData={muscleData}
          onMuscleClick={handleMuscleClick}
        />
      </div>

      {/* Color Legend */}
      <div className="flex items-center gap-4 mt-3 mb-3">
        {legendItems.map((item) => (
          <div key={item.intensity} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: getMuscleColor(item.intensity) }}
            />
            <span className="text-[11px] text-text-secondary font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Toggle Controls */}
      <div className="flex items-center justify-center gap-10 w-full">
        {/* View toggle */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] text-text-secondary font-medium tracking-wide">
            Side ({view === 'front' ? 'Front' : 'Back'})
          </span>
          <button
            onClick={() => setView(view === 'front' ? 'back' : 'front')}
            className="relative w-11 h-[22px] rounded-full transition-colors duration-300"
            style={{
              backgroundColor: view === 'back' ? '#22c55e' : '#52525b',
            }}
            aria-label="Toggle body view"
          >
            <span
              className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-transform duration-300"
              style={{
                transform: view === 'back' ? 'translateX(22px)' : 'translateX(0)',
              }}
            />
          </button>
        </div>

        {/* Gender toggle */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] text-text-secondary font-medium tracking-wide">
            Gender ({gender === 'male' ? 'Male' : 'Female'})
          </span>
          <button
            onClick={() => setGender(gender === 'male' ? 'female' : 'male')}
            className="relative w-11 h-[22px] rounded-full transition-colors duration-300"
            style={{
              backgroundColor: gender === 'male' ? '#22c55e' : '#52525b',
            }}
            aria-label="Toggle gender"
          >
            <span
              className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-transform duration-300"
              style={{
                transform: gender === 'male' ? 'translateX(22px)' : 'translateX(0)',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
