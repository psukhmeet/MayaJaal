import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMind } from '../context/MindContext';
import { memories } from '../data/thoughts';

const EMOTION_COLORS = {
  calm:  { node: '#00FF41', glow: '#00FF41', text: '#00FF41' },
  joy:   { node: '#FFD700', glow: '#FFA500', text: '#FFD700' },
  fear:  { node: '#8B00FF', glow: '#6600cc', text: '#BF7FFF' },
  angry: { node: '#FF2020', glow: '#FF0000', text: '#FF6060' },
};

export default function MemoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useMind();

  const memory = useMemo(() => memories.find(m => m.id === id), [id]);

  if (!memory) {
    return (
      <div style={{ color: theme.primary, fontFamily: '"Share Tech Mono", monospace' }}>
        <h2>MEMORY FRAGMENT CORRUPTED OR NOT FOUND</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
             marginTop: 20,
             padding: '8px 16px',
             background: 'transparent',
             color: theme.primary,
             border: `1px solid ${theme.primary}66`,
             cursor: 'pointer',
             fontFamily: '"Share Tech Mono", monospace',
          }}
        >
          [RETURN TO TIMELINE]
        </button>
      </div>
    );
  }

  const colors = EMOTION_COLORS[memory.emotion] || EMOTION_COLORS.calm;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, y: -20 }}
      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
      style={{
        width: '100%',
        maxWidth: '700px',
        padding: '40px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(30px)',
        border: `1px solid ${colors.node}55`,
        borderRadius: '16px',
        boxShadow: `0 0 50px ${colors.glow}33, inset 0 0 20px ${colors.glow}11`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: `2px solid ${colors.node}`, borderLeft: `2px solid ${colors.node}`, borderRadius: '16px 0 0 0' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: `2px solid ${colors.node}`, borderRight: `2px solid ${colors.node}`, borderRadius: '0 16px 0 0' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: `2px solid ${colors.node}`, borderLeft: `2px solid ${colors.node}`, borderRadius: '0 0 0 16px' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: `2px solid ${colors.node}`, borderRight: `2px solid ${colors.node}`, borderRadius: '0 0 16px 0' }} />

      <button
        onClick={() => navigate('/')}
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '12px',
          color: colors.text,
          background: 'transparent',
          border: `1px solid ${colors.node}44`,
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>◀</span> RETURN TO TIMELINE
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ 
            fontFamily: '"Outfit", sans-serif', 
            fontSize: '48px', 
            fontWeight: 900, 
            color: '#fff', 
            margin: 0,
            textShadow: `0 0 20px ${colors.glow}88`
          }}>
            {memory.label}
          </h1>
          <div style={{ 
            fontFamily: '"Share Tech Mono", monospace', 
            fontSize: '16px', 
            color: colors.text,
            marginTop: '8px',
            opacity: 0.8
          }}>
            TIMESTAMP: {memory.year} // NODE TYPE: {memory.type.toUpperCase()}
          </div>
        </div>
        
        {/* Animated structural identifier */}
        <div style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'flex-end',
           gap: '4px'
        }}>
           <div style={{
              width: '40px', height: '40px',
              borderRadius: '50%',
              border: `2px solid ${colors.node}88`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
           }}>
              <div style={{
                 width: '16px', height: '16px',
                 borderRadius: '50%',
                 background: colors.node,
                 boxShadow: `0 0 15px ${colors.glow}`
              }} />
           </div>
           <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#666' }}>
             {memory.emotion.toUpperCase()} STATE
           </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '1px', background: `linear-gradient(to right, ${colors.node}aa, transparent)`, marginBottom: '30px' }} />

      <div style={{
        fontFamily: '"Outfit", sans-serif',
        fontSize: '20px',
        lineHeight: 1.6,
        color: '#ddd',
        fontStyle: 'italic',
        borderLeft: `4px solid ${colors.node}`,
        paddingLeft: '24px',
        paddingTop: '8px',
        paddingBottom: '8px',
        background: `linear-gradient(to right, ${colors.node}11, transparent)`,
      }}>
        "{memory.secret}"
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '40px' }}>
         <div style={{ width: '8px', height: '8px', background: colors.node, boxShadow: `0 0 10px ${colors.glow}` }} />
         <div style={{ width: '8px', height: '8px', background: colors.node, opacity: 0.5 }} />
         <div style={{ width: '8px', height: '8px', background: colors.node, opacity: 0.2 }} />
      </div>
    </motion.div>
  );
}
