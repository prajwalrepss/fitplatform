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
function preprocessMuscleData(data = {}) {
  const getVal = (list) => {
    let max = 0;
    list.forEach(m => {
      if (data[m] > max) max = data[m];
    });
    return max;
  };

  const processed = { ...data };

  processed.chest_left = getVal(['chest_upper', 'chest_mid', 'chest_lower', 'serratus_anterior']) || data.chest_left || 0;
  processed.chest_right = processed.chest_left || data.chest_right || 0;

  processed.shoulders_left = getVal(['delts_front', 'delts_side', 'delts_rear', 'rotator_cuff']) || data.shoulders_left || 0;
  processed.shoulders_right = processed.shoulders_left || data.shoulders_right || 0;

  processed.biceps_left = getVal(['biceps_long', 'biceps_short', 'brachialis', 'brachioradialis']) || data.biceps_left || 0;
  processed.biceps_right = processed.biceps_left || data.biceps_right || 0;

  processed.triceps_left = getVal(['triceps_long', 'triceps_lateral', 'triceps_medial']) || data.triceps_left || 0;
  processed.triceps_right = processed.triceps_left || data.triceps_right || 0;

  processed.forearms_left = getVal(['forearm_flexors', 'forearm_extensors']) || data.forearms_left || 0;
  processed.forearms_right = processed.forearms_left || data.forearms_right || 0;

  processed.abs_upper = getVal(['abs', 'transverse_abs']) || data.abs_upper || 0;
  processed.abs_lower = processed.abs_upper || data.abs_lower || 0;

  processed.obliques_left = getVal(['obliques_internal', 'obliques_external']) || data.obliques_left || 0;
  processed.obliques_right = processed.obliques_left || data.obliques_right || 0;

  processed.quads_left = getVal(['quad_rectus', 'quad_vastus_lateral', 'quad_vastus_medial', 'quad_vastus_inter']) || data.quads_left || 0;
  processed.quads_right = processed.quads_left || data.quads_right || 0;

  processed.hamstrings_left = getVal(['ham_biceps', 'ham_semitendinosus', 'ham_semimembranosus']) || data.hamstrings_left || 0;
  processed.hamstrings_right = processed.hamstrings_left || data.hamstrings_right || 0;

  processed.glutes_left = getVal(['glute_max', 'glute_med', 'glute_min']) || data.glutes_left || 0;
  processed.glutes_right = processed.glutes_left || data.glutes_right || 0;

  processed.calves_left = getVal(['calf_gastro', 'calf_soleus']) || data.calves_left || 0;
  processed.calves_right = processed.calves_left || data.calves_right || 0;

  processed.traps = getVal(['traps_upper', 'traps_middle', 'traps_lower']) || data.traps || 0;
  processed.rear_delts_left = getVal(['delts_rear']) || data.rear_delts_left || 0;
  processed.rear_delts_right = processed.rear_delts_left || data.rear_delts_right || 0;

  processed.lower_back = getVal(['erector_spinae']) || data.lower_back || 0;

  return processed;
}

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

  const processedMuscleData = preprocessMuscleData(muscleData);

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* SVG Body */}
      <div
        className="w-full flex items-center justify-center"
        style={{ maxWidth: '280px' }}
      >
        <BodyComponent
          muscleData={processedMuscleData}
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
