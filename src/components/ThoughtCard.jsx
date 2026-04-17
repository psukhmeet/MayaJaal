import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMind } from '../context/MindContext';

export default function ThoughtCard({ thought, style, onClose }) {
  const [revealed, setRevealed] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const { theme } = useMind();

  function handleReveal() {
    setGlitching(true);
    setTimeout(() => {
      setGlitching(false);
      setRevealed(true);
    }, 500);
  }

  const tagColors = {
    joy: '#f5a623', fear: '#7b2fbe', anger: '#e53e3e', calm: '#4a90d9',
    memory: '#4a90d9', dream: '#c9a84c', visual: '#1affe4',
    ambition: '#c9a84c', childhood: '#f5a623', purpose: '#c9a84c',
    hope: '#48bb78', darkness: '#6b21a8', peace: '#48bb78',
    anxiety: '#7b2fbe', noise: '#e53e3e', grief: '#6b21a8',
    time: '#7b2fbe', loop: '#1affe4', love: '#f687b3',
    void: '#2d3748', matrix: '#00ff41', creation: '#f5a623',
    power: '#c9a84c', anger: '#e53e3e', identity: '#9b2335',
    fantasy: '#1affe4', night: '#4a5568', failure: '#c53030',
    future: '#f6ad55',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotateX: -20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        ...style,
        borderColor: thought.color,
        boxShadow: `0 0 30px ${thought.color}44, 0 0 60px ${thought.color}22, inset 0 0 20px ${thought.color}11`,
      }}
      className={`thought-card ${glitching ? 'glitch-active' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ background: thought.color, boxShadow: `0 0 10px ${thought.color}` }}
          />
          <span className="font-mono text-sm" style={{ color: thought.color }}>
            THOUGHT.{thought.id.toString().padStart(3, '0')}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white text-xs font-mono transition-colors"
        >
          [×CLOSE]
        </button>
      </div>

      {/* Title */}
      <h3 className={`font-sans text-xl font-bold text-white mb-2 ${glitching ? 'glitch-text' : ''}`}>
        {thought.label}
      </h3>

      {/* Type badge */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="px-2 py-0.5 rounded text-xs font-mono border"
          style={{ borderColor: thought.color, color: thought.color }}>
          {thought.type.toUpperCase()}
        </span>
        {thought.tags.slice(0, 3).map(tag => (
          <span key={tag}
            className="px-2 py-0.5 rounded text-xs font-mono"
            style={{ color: tagColors[tag] || '#888', background: `${tagColors[tag] || '#888'}22` }}>
            #{tag}
          </span>
        ))}
      </div>

      {/* Year */}
      <div className="font-mono text-xs text-gray-500 mb-4">
        TIMESTAMP: {thought.year} — DEPTH: {Math.round(thought.depth * 100)}%
      </div>

      {/* Secret reveal */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.button
            key="reveal-btn"
            onClick={handleReveal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 rounded font-mono text-sm text-black font-bold transition-all"
            style={{ background: thought.color, boxShadow: `0 0 20px ${thought.color}66` }}
          >
            ▶ DEEP DIVE — REVEAL SECRET
          </motion.button>
        ) : (
          <motion.div
            key="secret"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded border-l-2 font-sans text-sm text-gray-200 leading-relaxed italic"
            style={{ borderColor: thought.color, background: `${thought.color}18` }}
          >
            "{thought.secret}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl" style={{ borderColor: thought.color }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr" style={{ borderColor: thought.color }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl" style={{ borderColor: thought.color }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br" style={{ borderColor: thought.color }} />
    </motion.div>
  );
}
