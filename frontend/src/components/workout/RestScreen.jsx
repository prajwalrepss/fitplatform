// ============================================================
// FitPlatform — Rest Timer Screen (Between Sets)
// Adapted from AI Physiotherapy RestScreen.jsx
// ============================================================
import React, { useEffect } from 'react';
import { Heart, Wind, Zap } from 'lucide-react';
import { getScoreColor } from './utils.js';

export default function RestScreen({ state, dispatch }) {
  const { restTime, currentSet, customSets, setHistory } = state;
  const lastSet = setHistory[setHistory.length - 1];
  const totalRestDuration = state.settings?.restDuration || 30;

  // Countdown timer
  useEffect(() => {
    if (restTime <= 0) {
      dispatch({ type: 'END_REST' });
      return;
    }
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_REST' });
    }, 1000);
    return () => clearInterval(interval);
  }, [restTime, dispatch]);

  const minutes = Math.floor(restTime / 60);
  const seconds = restTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const progress = ((totalRestDuration - restTime) / totalRestDuration) * 100;
  const circumference = 2 * Math.PI * 140;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="wk-timer-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', opacity: 0.6 }} />
      </div>

      <section style={{ maxWidth: '896px', width: '100%', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Heading */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="wk-font-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--gb-text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Rest Period
          </h1>
          <p style={{ color: '#4edea3', fontWeight: 600, fontSize: '1.125rem' }}>Set {currentSet} of {customSets} completed!</p>
        </div>

        {/* Timer Circle */}
        <div style={{ position: 'relative', width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
          <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="50%" cy="50%" r="120" fill="transparent"
              stroke="rgba(40, 56, 49, 0.3)" strokeWidth="8"
            />
            <circle
              cx="50%" cy="50%" r="120" fill="transparent"
              stroke="url(#wk-rest-grad)" strokeWidth="12"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={(2 * Math.PI * 120) - (progress / 100) * (2 * Math.PI * 120)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <defs>
              <linearGradient id="wk-rest-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#4edea3" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="wk-font-headline" style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--gb-text)', lineHeight: 1 }}>
              {timeStr}
            </span>
            <span style={{ color: 'var(--gb-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.75rem', marginTop: '0.5rem' }}>Remaining</span>
          </div>
        </div>

        {/* Scorecard */}
        {lastSet && (
          <div className="wk-glass-card" style={{ width: '100%', maxWidth: '672px', padding: '2rem', borderRadius: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gb-text-muted)' }}>Last Set Scorecard</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#4edea3', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                <Zap size={14} /> AI ANALYZED
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.75rem' }}>
              {lastSet.repScores.map((score, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(3, 17, 11, 0.3)', borderRadius: '1rem' }}>
                  <span style={{ fontSize: '0.625rem', color: 'var(--gb-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Rep {i + 1}</span>
                  <div
                    className={score >= 85 ? 'wk-score-bg-good wk-score-good' : score >= 70 ? 'wk-score-bg-ok wk-score-ok' : 'wk-score-bg-bad wk-score-bad'}
                    style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: '0.875rem' }}
                  >
                    {score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gb-text)' }}>
            {lastSet && lastSet.avgScore >= 85
              ? 'Great form! Keep up the intensity 💪'
              : lastSet && lastSet.avgScore >= 70
              ? 'Good effort! Focus on technique 👍'
              : 'Keep pushing! You\'ve got this 🔥'}
          </div>
          <p style={{ color: 'var(--gb-text-muted)', maxWidth: '384px', margin: '0 auto', fontSize: '0.875rem' }}>
            Take deep breaths and focus on muscle recovery.
          </p>
        </div>

        {/* Skip Rest */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <button
            id="skip-rest-btn"
            onClick={() => dispatch({ type: 'END_REST' })}
            style={{ padding: '1rem 3rem', background: 'transparent', border: '2px solid rgba(78, 222, 163, 0.4)', borderRadius: '1rem', color: '#4edea3', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
          >
            Skip Rest
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--gb-text-muted)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={16} color="#4edea3" />
              <span>Recovery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind size={16} color="#4edea3" />
              <span>Breathe</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
