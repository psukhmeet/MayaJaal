import { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMind } from './context/MindContext';
import MatrixIntro from './components/MatrixIntro';
import SacredTimeline from './components/SacredTimeline';
import OperatorPanel from './components/OperatorPanel';
import SoundEngine from './components/SoundEngine';
import MemoryDetails from './components/MemoryDetails';
import { memories } from './data/thoughts';
import { Routes, Route, useLocation } from 'react-router-dom';

// Floating ambient particles
function Particles({ gravityOff, theme, emotion }) {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: 1.5 + Math.random() * 3,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      dur: 12 + Math.random() * 15,
    })), []);

  // Determine glitchiness based on emotion
  const isAngry = emotion === 'angry';

  return (
    <div className={`particles-container ${gravityOff ? 'gravity-off' : ''} ${isAngry ? 'glitch-active' : ''}`}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size, height: p.size,
            left: `${p.left}%`,
            background: theme.primary,
            boxShadow: `0 0 ${p.size * 3}px ${theme.primary}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            '--dur': p.dur,
          }}
        />
      ))}
    </div>
  );
}

// HUD overlay — top right
function HUD({ theme, emotion, memoryCount }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 40,
      display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
      pointerEvents: 'none'
    }}>
      {[
        { label: 'STATUS', value: 'ONLINE' },
        { label: 'NEXUS', value: emotion.toUpperCase() },
        { label: 'NODES', value: `${memoryCount} ACTIVE` },
        { label: 'TIME', value: time.toLocaleTimeString('en-US', { hour12: false }) },
      ].map(({ label, value }) => (
        <div key={label} style={{
          fontFamily: '"Share Tech Mono", monospace', fontSize: 10,
          color: theme.primary,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.primary}33`,
          borderRadius: 4, padding: '3px 10px',
          display: 'flex', gap: 10,
          boxShadow: `0 0 8px ${theme.primary}22`,
        }}>
          <span style={{ opacity: 0.5 }}>{label}</span>
          <span style={{ color: '#fff' }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// Bottom title / branding
function TitleBar({ theme }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '8px 24px',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      borderTop: `1px solid ${theme.primary}22`,
      pointerEvents: 'none'
    }}>
      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: theme.primary, opacity: 0.5, letterSpacing: 3 }}>
        INSIDE THE MIND — DIGITAL CONSCIOUSNESS UI — SACRED TIMELINE
      </div>
    </div>
  );
}

function MainLayout({ children }) {
  const { phase, gravityOff, theme, emotion, filter } = useMind();
  
  // Filter memories for HUD count
  const filteredMemories = useMemo(() => {
    if (filter === 'all') return memories;
    return memories.filter(m => m.type === filter || m.type === 'core');
  }, [filter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{ position: 'fixed', inset: 0 }}
    >
      {/* Ambient particles */}
      <Particles gravityOff={gravityOff} theme={theme} emotion={emotion} />

      {/* Operator Panel */}
      <OperatorPanel />

      {/* HUD */}
      <HUD theme={theme} emotion={emotion} memoryCount={filteredMemories.length} />

      {/* Title bar */}
      <TitleBar theme={theme} />

      {/* MAIN CONTENT AREA */}
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingLeft: 280, // offset for panel
        paddingBottom: 32,
      }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function App() {
  const { phase, setPhase, filter, gravityOff, emotion } = useMind();
  const location = useLocation();

  const handleIntroComplete = useCallback(() => {
    setPhase('main');
  }, [setPhase]);

  const isAngry = emotion === 'angry';

  return (
    <div style={{ position: 'fixed', inset: 0, background: isAngry ? '#1a0000' : '#000', overflow: 'hidden', transition: 'background 0.5s ease' }}>
      {/* Scanlines */}
      <div className={`scanlines ${isAngry ? 'glitch-active' : ''}`} />
      <div className="vignette" />

      {/* Sound */}
      <SoundEngine />

      {/* Matrix Intro */}
      <AnimatePresence mode="wait">
        {phase === 'matrix' && (
          <MatrixIntro key="matrix-intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main Mind Interface (Routes) */}
      <AnimatePresence mode="wait">
        {phase === 'main' && (
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <MainLayout>
                 <div className="tree-aura" />
                 <SacredTimeline
                   memories={memories}
                   gravityOff={gravityOff}
                   filter={filter}
                 />
              </MainLayout>
            } />
            <Route path="/memory/:id" element={
               <MainLayout>
                  <MemoryDetails />
               </MainLayout>
            } />
          </Routes>
        )}
      </AnimatePresence>
    </div>
  );
}
