// ============================================================
// FitPlatform — Exercise Library (Grid + Search + Customize)
// Adapted from AI Physiotherapy ExercisesTab.jsx
// ============================================================
import React, { useState } from 'react';
import {
  Dumbbell, Activity, ArrowUp, PersonStanding, Move, Footprints,
  Search, Radio, SlidersHorizontal,
} from 'lucide-react';
import { EXERCISES } from './constants.js';

const ICON_MAP = { Dumbbell, Activity, ArrowUp, PersonStanding, Move, Footprints };

export default function ExerciseLibrary({ state, dispatch }) {
  const { selectedExercise, customReps, customSets } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);

  const startExercise = (exercise) => {
    dispatch({ type: 'SELECT_EXERCISE', payload: exercise });
    dispatch({ type: 'START_SESSION' });
  };

  const filteredExercises = EXERCISES.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 2.5rem 5rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <section style={{ marginBottom: '2rem' }}>
        <h1 className="wk-font-headline" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gb-text)', marginBottom: '0.5rem' }}>
          Exercise Library
        </h1>
        <p style={{ color: 'var(--gb-text-dim)', fontSize: '1rem' }}>
          Select an exercise to start your AI-guided tracking session.
        </p>
      </section>

      {/* Search & Customize */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
          <Search size={18} color="var(--gb-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            id="exercise-search"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem',
              borderRadius: '0.75rem', background: 'var(--gb-surface-container)', border: '1px solid var(--gb-outline-dim)',
              color: 'var(--gb-text)', fontSize: '0.875rem', outline: 'none',
            }}
          />
        </div>
        <button
          id="customize-toggle"
          onClick={() => setShowCustomize(!showCustomize)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem', border: showCustomize ? '1px solid rgba(78, 222, 163, 0.5)' : '1px solid var(--gb-outline-dim)',
            background: showCustomize ? 'rgba(78, 222, 163, 0.1)' : 'transparent',
            color: showCustomize ? '#4edea3' : 'var(--gb-text-dim)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={16} /> Customize
        </button>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4edea3', padding: '0.75rem 1rem',
          borderRadius: '0.75rem', background: 'rgba(78, 222, 163, 0.05)',
        }}>
          <Radio size={14} /> Live Tracking
        </span>
      </div>

      {/* Customization Panel */}
      {showCustomize && (
        <div className="wk-glass-card wk-animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gb-text-dim)', marginBottom: '1.25rem' }}>
            Session Configuration
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--gb-text)' }}>Repetitions</label>
                <span style={{ color: '#4edea3', fontWeight: 700, fontSize: '1.125rem' }}>{customReps}</span>
              </div>
              <input type="range" min="3" max="30" value={customReps} onChange={(e) => dispatch({ type: 'CUSTOMIZE_SETS_REPS', payload: { reps: parseInt(e.target.value) } })} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--gb-text)' }}>Sets</label>
                <span style={{ color: '#4edea3', fontWeight: 700, fontSize: '1.125rem' }}>{customSets}</span>
              </div>
              <input type="range" min="1" max="10" value={customSets} onChange={(e) => dispatch({ type: 'CUSTOMIZE_SETS_REPS', payload: { sets: parseInt(e.target.value) } })} />
            </div>
          </div>
        </div>
      )}

      {/* Exercise Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredExercises.map((ex) => {
          const IconComp = ICON_MAP[ex.icon] || Activity;
          const isSelected = selectedExercise?.id === ex.id;
          return (
            <div
              key={ex.id}
              id={`exercise-card-${ex.id}`}
              className={`wk-exercise-card ${isSelected ? 'selected' : ''}`}
              onClick={() => startExercise(ex)}
            >
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? 'rgba(78, 222, 163, 0.15)' : 'var(--gb-surface-highest)',
                }}>
                  <IconComp size={28} color={isSelected ? '#4edea3' : 'var(--gb-text-dim)'} />
                </div>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4edea3', animation: 'wk-pulse-glow 2s infinite' }} />}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--gb-text)', marginBottom: '0.5rem' }}>{ex.name}</h3>
              <p style={{ color: 'var(--gb-text-dim)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>{ex.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ background: 'var(--gb-surface-highest)', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gb-text)', border: '1px solid var(--gb-outline-dim)' }}>
                    {customReps} reps
                  </span>
                  <span style={{ background: 'var(--gb-surface-highest)', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gb-text)', border: '1px solid var(--gb-outline-dim)' }}>
                    {customSets} sets
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); startExercise(ex); }}
                  className="wk-btn-start"
                >
                  Start →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Search size={40} color="var(--gb-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--gb-text-dim)', fontSize: '1.125rem', fontWeight: 600 }}>No exercises found</p>
          <p style={{ color: 'var(--gb-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
