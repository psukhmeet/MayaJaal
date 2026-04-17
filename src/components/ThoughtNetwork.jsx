import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import MatrixRain from './MatrixRain';
import ThoughtCard from './ThoughtCard';
import { useMind } from '../context/MindContext';

export default function ThoughtNetwork({ thoughts }) {
  const [hoveredCluster, setHoveredCluster] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const { theme, emotion } = useMind();

  // Distribute thoughts in 3D space
  const positionedThoughts = useMemo(() => {
    return thoughts.map((t, i) => {
      const angle = (i / thoughts.length) * Math.PI * 2;
      const radius = 20 + Math.random() * 30;
      const xPct = 50 + Math.cos(angle) * radius;
      const yPct = 50 + Math.sin(angle) * (radius * 0.5);
      const z = (t.depth - 0.5) * 600; // -300 to +300
      const scale = 0.6 + t.depth * 0.8;
      return { ...t, xPct, yPct, z, scale, clusterId: i };
    });
  }, [thoughts]);

  const handleHoverZone = useCallback((clusterId) => {
    setHoveredCluster(clusterId);
  }, []);

  function getCardPosition(thought) {
    let left = `${thought.xPct}%`;
    let top = `${thought.yPct}%`;
    if (thought.xPct > 65) left = `${thought.xPct - 25}%`;
    if (thought.yPct > 70) top = `${thought.yPct - 30}%`;
    return { left, top };
  }

  return (
    <div className="relative w-full h-full" style={{ perspective: '1200px' }}>
      {/* Matrix Rain Canvas */}
      <MatrixRain
        thoughts={positionedThoughts}
        onHoverThought={setHoveredCluster}
        hoveredThought={hoveredCluster}
      />

      {/* Hover zones — invisible overlays on canvas clusters */}
      <div className="fixed inset-0 z-10" style={{ perspective: '1200px' }}>
        {positionedThoughts.map((thought, idx) => {
          const isHovered = hoveredCluster === idx;
          return (
            <div
              key={thought.id}
              className="absolute cursor-pointer"
              style={{
                left: `${thought.xPct}%`,
                top: `${thought.yPct}%`,
                transform: `translateZ(${thought.z * 0.3}px) scale(${thought.scale}) translate(-50%, -50%)`,
                width: '80px',
                height: '140px',
              }}
              onMouseEnter={() => handleHoverZone(idx)}
              onMouseLeave={() => setHoveredCluster(null)}
              onClick={() => setActiveCard(activeCard?.id === thought.id ? null : thought)}
            >
              {/* Hover glow indicator */}
              {isHovered && (
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `radial-gradient(ellipse, ${thought.color}33 0%, transparent 70%)`,
                    border: `1px solid ${thought.color}55`,
                    boxShadow: `0 0 30px ${thought.color}33`,
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 text-center pb-1 font-mono"
                    style={{ fontSize: '10px', color: thought.color }}
                  >
                    {thought.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Thought Card */}
      <div className="fixed inset-0 z-20 pointer-events-none" style={{ perspective: '1200px' }}>
        <AnimatePresence>
          {activeCard && (
            <div
              className="pointer-events-auto absolute"
              style={{
                ...getCardPosition(activeCard),
                transform: 'translateZ(200px)',
                maxWidth: '300px',
                minWidth: '260px',
              }}
            >
              <ThoughtCard
                thought={activeCard}
                style={{
                  position: 'relative',
                  background: 'rgba(5, 10, 20, 0.85)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${activeCard.color}66`,
                  borderRadius: '16px',
                  padding: '20px',
                }}
                onClose={() => setActiveCard(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* HUD — top center info bar */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-30 glass-panel rounded-full px-6 py-2 flex items-center gap-4"
        style={{ borderColor: `${theme.primary}44` }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.primary }} />
          <span className="font-mono text-xs" style={{ color: theme.primary }}>THOUGHT NETWORK</span>
        </div>
        <div className="w-px h-4 bg-white opacity-10" />
        <span className="font-mono text-xs text-gray-500">
          {thoughts.length} ACTIVE NODES
        </span>
        <div className="w-px h-4 bg-white opacity-10" />
        <span className="font-mono text-xs" style={{ color: theme.secondary }}>
          STATE: {emotion.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
