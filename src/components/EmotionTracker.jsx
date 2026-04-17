import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMind } from '../context/MindContext';

const EMOTIONS = [
  {
    id: 'calm',
    label: 'Calm',
    color: '#4a90d9',
    glow: '#1affe4',
    blobPath: 'M 50,10 C 80,5 95,25 90,50 C 95,75 80,95 50,90 C 20,95 5,75 10,50 C 5,25 20,5 50,10',
    blobPath2: 'M 50,8 C 82,10 92,30 88,50 C 92,70 78,92 50,88 C 22,92 8,70 12,50 C 8,30 18,10 50,8',
    icon: '🌊',
    waveAmplitude: 8,
    waveFreq: 0.04,
  },
  {
    id: 'joy',
    label: 'Joy',
    color: '#f5a623',
    glow: '#f687b3',
    blobPath: 'M 50,5 C 85,0 100,20 95,50 C 100,80 85,100 50,95 C 15,100 0,80 5,50 C 0,20 15,0 50,5',
    blobPath2: 'M 50,12 C 78,5 98,22 92,50 C 98,78 82,95 50,88 C 18,95 2,78 8,50 C 2,22 22,5 50,12',
    icon: '☀️',
    waveAmplitude: 15,
    waveFreq: 0.08,
  },
  {
    id: 'fear',
    label: 'Fear',
    color: '#7b2fbe',
    glow: '#4a5568',
    blobPath: 'M 50,12 C 75,8 90,30 85,50 C 90,72 72,88 50,88 C 28,90 10,72 15,50 C 10,28 25,8 50,12',
    blobPath2: 'M 50,8 C 70,12 88,28 82,50 C 88,68 70,90 50,82 C 30,88 12,70 18,50 C 12,30 30,10 50,8',
    icon: '👁️',
    waveAmplitude: 5,
    waveFreq: 0.02,
  },
  {
    id: 'angry',
    label: 'Angry',
    color: '#e53e3e',
    glow: '#ed8936',
    blobPath: 'M 50,5 C 90,-5 105,28 95,50 C 105,72 88,105 50,95 C 12,102 -5,72 5,50 C -5,28 10,-5 50,5',
    blobPath2: 'M 50,10 C 88,5 100,32 92,50 C 100,68 85,97 50,90 C 15,95 0,70 8,50 C 0,30 12,5 50,10',
    icon: '⚡',
    waveAmplitude: 20,
    waveFreq: 0.12,
  },
];

function WaveGraph({ color, amplitude, freq, emotion }) {
  const width = 200;
  const height = 50;
  const points = [];
  const speed = emotion === 'angry' ? 1.5 : emotion === 'calm' ? 0.3 : 0.8;

  for (let x = 0; x <= width; x += 3) {
    const y = height / 2 + amplitude * Math.sin(x * freq * 2 * Math.PI);
    points.push(`${x},${y}`);
  }

  return (
    <svg width={width} height={height} className="opacity-70">
      <defs>
        <filter id={`wave-glow-${emotion}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter={`url(#wave-glow-${emotion})`}
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to={`${-width / 2} 0`}
          dur={`${3 / speed}s`}
          repeatCount="indefinite"
        />
      </polyline>
      <polyline
        points={points.map(p => {
          const [x, y] = p.split(',');
          return `${parseFloat(x) + width / 2},${y}`;
        }).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter={`url(#wave-glow-${emotion})`}
        opacity={0.5}
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to={`${-width / 2} 0`}
          dur={`${3 / speed}s`}
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
  );
}

export default function EmotionTracker() {
  const { emotion, setEmotion, theme } = useMind();

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="glass-panel rounded-xl p-4 flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.primary }} />
        <span className="font-mono text-xs" style={{ color: theme.primary }}>EMOTIONAL STATE MATRIX</span>
      </div>

      {EMOTIONS.map(em => {
        const isActive = emotion === em.id;
        return (
          <motion.div
            key={em.id}
            onClick={() => setEmotion(em.id)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.97 }}
            className="glass-panel rounded-xl p-4 cursor-pointer transition-all duration-300"
            style={{
              borderColor: isActive ? em.color : 'rgba(255,255,255,0.08)',
              boxShadow: isActive ? `0 0 25px ${em.color}44, inset 0 0 15px ${em.color}11` : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              {/* Blob SVG */}
              <div className="relative flex-shrink-0">
                <svg width="60" height="60" viewBox="0 0 100 100">
                  <defs>
                    <filter id={`blob-glow-${em.id}`}>
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Outer halo */}
                  <path
                    d={em.blobPath}
                    fill={`${em.color}11`}
                    stroke={em.glow}
                    strokeWidth="0.5"
                    opacity={isActive ? 0.6 : 0.2}
                    filter={`url(#blob-glow-${em.id})`}
                  >
                    <animate
                      attributeName="d"
                      values={`${em.blobPath};${em.blobPath2};${em.blobPath}`}
                      dur={isActive ? `${3 / (em.waveFreq * 15)}s` : '6s'}
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Main blob */}
                  <path
                    d={em.blobPath}
                    fill={`${em.color}${isActive ? '55' : '22'}`}
                    stroke={em.color}
                    strokeWidth={isActive ? 2 : 1}
                    filter={`url(#blob-glow-${em.id})`}
                  >
                    <animate
                      attributeName="d"
                      values={`${em.blobPath2};${em.blobPath};${em.blobPath2}`}
                      dur={isActive ? `${2 / (em.waveFreq * 15)}s` : '4s'}
                      repeatCount="indefinite"
                    />
                  </path>
                  <text x="50" y="55" textAnchor="middle" fontSize="22">
                    {em.icon}
                  </text>
                </svg>
                {isActive && (
                  <div className="absolute -inset-2 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${em.color}33 0%, transparent 70%)`,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans font-bold text-white text-sm">{em.label}</span>
                  {isActive && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{ color: em.color, background: `${em.color}22` }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="overflow-hidden" style={{ clipPath: 'inset(0)' }}>
                  <WaveGraph
                    color={isActive ? em.color : '#444'}
                    amplitude={isActive ? em.waveAmplitude : 4}
                    freq={em.waveFreq}
                    emotion={em.id}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
