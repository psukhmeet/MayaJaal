import { createContext, useContext, useState, useEffect } from 'react';

const MindContext = createContext(null);

export function MindProvider({ children }) {
  const [phase, setPhase] = useState('matrix'); // 'matrix' | 'main'
  const [emotion, setEmotion] = useState('calm'); // calm | joy | fear | angry
  const [gravityOff, setGravityOff] = useState(false);
  const [filter, setFilter] = useState('all'); // all | dreams | joyful | scary | core
  const [muted, setMuted] = useState(true);
  const [hoveredMemory, setHoveredMemory] = useState(null);

  // Derive theme colors from emotion
  const themes = {
    calm:  { primary: '#00FF41', glow: '#00FF41', bg: '#000000', accent: '#00cc33' },
    joy:   { primary: '#FFD700', glow: '#FFA500', bg: '#000000', accent: '#ff8c00' },
    fear:  { primary: '#8B00FF', glow: '#6600cc', bg: '#000000', accent: '#4b0082' },
    angry: { primary: '#FF0000', glow: '#ff3300', bg: '#000000', accent: '#cc0000' },
  };
  const theme = themes[emotion];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--c-primary', theme.primary);
    root.style.setProperty('--c-glow', theme.glow);
    root.style.setProperty('--c-accent', theme.accent);
  }, [emotion, theme]);

  return (
    <MindContext.Provider value={{
      phase, setPhase,
      emotion, setEmotion,
      theme,
      gravityOff, setGravityOff,
      filter, setFilter,
      muted, setMuted,
      hoveredMemory, setHoveredMemory,
    }}>
      {children}
    </MindContext.Provider>
  );
}

export const useMind = () => useContext(MindContext);
