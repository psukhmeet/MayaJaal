import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMind } from '../context/MindContext';

const FILTERS = [
  { id: 'all', label: 'ALL MEMORIES', icon: '◈' },
  { id: 'dreams', label: 'SHOW DREAMS', icon: '◎' },
  { id: 'joyful', label: 'JOYFUL ONLY', icon: '◉' },
  { id: 'scary', label: 'SCARY ONLY', icon: '⚠' },
  { id: 'core', label: 'CORE NODES', icon: '◆' },
];

const EMOTIONS = [
  { id: 'calm',  label: 'CALM',  color: '#00FF41', icon: '🌿' },
  { id: 'joy',   label: 'JOY',   color: '#FFD700', icon: '☀' },
  { id: 'fear',  label: 'FEAR',  color: '#8B00FF', icon: '👁' },
  { id: 'angry', label: 'ANGRY', color: '#FF2020', icon: '⚡' },
];

export default function OperatorPanel() {
  const {
    theme, emotion, setEmotion,
    filter, setFilter,
    gravityOff, setGravityOff,
    muted, setMuted,
    panelCollapsed, setPanelCollapsed,
  } = useMind();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
       setPanelCollapsed(true);
    }
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
         setPanelCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setPanelCollapsed]);

  return (
    <>
      {/* Collapse toggle */}
      <button
        onClick={() => setPanelCollapsed(c => !c)}
        style={{
          position: 'fixed', top: 20, left: panelCollapsed ? 16 : (isMobile ? 16 : 276),
          zIndex: 60, fontFamily: '"Share Tech Mono", monospace',
          fontSize: 11, color: theme.primary,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.primary}44`, borderRadius: 6,
          padding: '4px 10px', cursor: 'pointer',
          boxShadow: `0 0 10px ${theme.primary}33`,
          transition: 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1)',
        }}
      >
        {panelCollapsed ? '▶ PANEL' : (isMobile ? '▼ CLOSE' : '◀ HIDE')}
      </button>

      <AnimatePresence>
        {!panelCollapsed && (
          <motion.div
            initial={{ x: isMobile ? 0 : -300, y: isMobile ? 300 : 0, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ x: isMobile ? 0 : -300, y: isMobile ? 300 : 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            style={{
              position: 'fixed', 
              top: isMobile ? 'auto' : 0, 
              bottom: 0, 
              left: 0, 
              right: isMobile ? 0 : 'auto',
              width: isMobile ? '100%' : 270, 
              height: isMobile ? '80vh' : 'auto',
              zIndex: 50,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRight: isMobile ? 'none' : `1px solid ${theme.primary}22`,
              borderTop: isMobile ? `1px solid ${theme.primary}55` : 'none',
              boxShadow: isMobile ? `0 -4px 40px ${theme.primary}22` : `4px 0 40px ${theme.primary}11`,
              display: 'flex', flexDirection: 'column',
              padding: isMobile ? '30px 14px 16px' : '16px 14px',
              gap: 12,
              overflowY: 'auto',
              borderTopLeftRadius: isMobile ? 24 : 0,
              borderTopRightRadius: isMobile ? 24 : 0,
            }}
          >
            {/* Header */}
            <div style={{
              border: `1px solid ${theme.primary}33`, borderRadius: 8,
              padding: '12px 14px',
              background: `${theme.primary}08`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: theme.primary,
                  boxShadow: `0 0 8px ${theme.primary}`,
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: theme.primary, fontWeight: 700 }}>
                  TVA OPERATOR PANEL
                </span>
              </div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: '#444' }}>
                YGGDRASIL INTERFACE v2.0
              </div>
            </div>

            {/* Emotion selector */}
            <div style={{ border: `1px solid ${theme.primary}22`, borderRadius: 8, padding: '12px 14px', background: 'rgba(0,255,65,0.02)' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: theme.primary, marginBottom: 10, opacity: 0.7 }}>
                ◈ EMOTIONAL STATE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {EMOTIONS.map(em => (
                  <button
                    key={em.id}
                    onClick={() => setEmotion(em.id)}
                    style={{
                      fontFamily: '"Share Tech Mono", monospace', fontSize: 10,
                      color: emotion === em.id ? '#000' : em.color,
                      background: emotion === em.id ? em.color : `${em.color}15`,
                      border: `1px solid ${em.color}${emotion === em.id ? 'ff' : '44'}`,
                      borderRadius: 6, padding: '6px 8px',
                      cursor: 'pointer', transition: 'all 0.25s ease',
                      boxShadow: emotion === em.id ? `0 0 12px ${em.color}88` : 'none',
                      fontWeight: 700,
                    }}
                  >
                    {em.icon} {em.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Memory Filter */}
            <div style={{ border: `1px solid ${theme.primary}22`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: theme.primary, marginBottom: 10, opacity: 0.7 }}>
                ◈ MEMORY FILTER
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    style={{
                      fontFamily: '"Share Tech Mono", monospace', fontSize: 10,
                      color: filter === f.id ? '#000' : theme.primary,
                      background: filter === f.id ? theme.primary : `${theme.primary}10`,
                      border: `1px solid ${theme.primary}${filter === f.id ? 'ff' : '33'}`,
                      borderRadius: 5, padding: '7px 12px',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      textAlign: 'left', fontWeight: filter === f.id ? 700 : 400,
                      boxShadow: filter === f.id ? `0 0 10px ${theme.primary}66` : 'none',
                    }}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gravity Toggle */}
            <div style={{ border: `1px solid ${theme.primary}22`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: theme.primary, marginBottom: 10, opacity: 0.7 }}>
                ◈ PHYSICS ENGINE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: '#fff' }}>
                    GRAVITY {gravityOff ? 'OFF' : 'ON'}
                  </div>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, color: '#555', marginTop: 2 }}>
                    {gravityOff ? 'nodes drifting upward' : 'standard drift mode'}
                  </div>
                </div>
                <button
                  onClick={() => setGravityOff(g => !g)}
                  style={{
                    width: 48, height: 24, borderRadius: 12,
                    background: gravityOff ? theme.primary : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${theme.primary}66`,
                    cursor: 'pointer', position: 'relative',
                    boxShadow: gravityOff ? `0 0 15px ${theme.primary}77` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <motion.div
                    animate={{ x: gravityOff ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                      position: 'absolute', top: 2,
                      width: 18, height: 18, borderRadius: '50%',
                      background: gravityOff ? '#000' : '#fff',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Audio */}
            <div style={{ border: `1px solid ${theme.primary}22`, borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: theme.primary, marginBottom: 10, opacity: 0.7 }}>
                ◈ SOUNDSCAPE
              </div>
              <button
                onClick={() => setMuted(m => !m)}
                style={{
                  width: '100%', fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 11, fontWeight: 700,
                  color: muted ? '#555' : '#000',
                  background: muted ? 'rgba(255,255,255,0.04)' : theme.primary,
                  border: `1px solid ${muted ? '#333' : theme.primary}`,
                  borderRadius: 6, padding: '8px',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: muted ? 'none' : `0 0 20px ${theme.primary}55`,
                }}
              >
                {muted ? '🔇 MUTED — CLICK TO ENGAGE' : '🔊 ACTIVE — CLICK TO SILENCE'}
              </button>
            </div>

            {/* Legend */}
            <div style={{ border: `1px solid ${theme.primary}22`, borderRadius: 8, padding: '12px 14px', flex: 1 }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: theme.primary, marginBottom: 10, opacity: 0.7 }}>
                ◈ NODE LEGEND
              </div>
              {[
                { label: 'Core Memory', color: '#00FF41', dash: 'solid' },
                { label: 'Dream Branch', color: '#4a90d9', dash: 'dashed' },
                { label: 'Joyful Memory', color: '#FFD700', dash: 'solid' },
                { label: 'Scary / Fear', color: '#8B00FF', dash: 'dotted' },
                { label: 'Angry Node', color: '#FF2020', dash: 'solid' },
              ].map(({ label, color, dash }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 22, height: 2, background: color, borderRadius: 1, border: dash === 'dashed' ? `1px dashed ${color}` : dash === 'dotted' ? `1px dotted ${color}` : 'none', flexShrink: 0 }} />
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, color: '#666' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, color: '#333', textAlign: 'center', paddingTop: 4 }}>
              INSIDE THE MIND v2.0 · TVA CLEARANCE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
