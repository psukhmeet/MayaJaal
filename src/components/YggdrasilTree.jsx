import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMind } from '../context/MindContext';

// Emotion color map for nodes
const EMOTION_COLORS = {
  calm:  { node: '#00FF41', glow: '#00FF41', text: '#00FF41', card: 'rgba(0,255,65,0.08)' },
  joy:   { node: '#FFD700', glow: '#FFA500', text: '#FFD700', card: 'rgba(255,215,0,0.08)' },
  fear:  { node: '#8B00FF', glow: '#6600cc', text: '#BF7FFF', card: 'rgba(139,0,255,0.08)' },
  angry: { node: '#FF2020', glow: '#FF0000', text: '#FF6060', card: 'rgba(255,0,0,0.08)' },
};

// Hover emotion override — sad/scary memories shift to red on hover
const HOVER_OVERRIDES = {
  scary: { node: '#FF2020', glow: '#FF0000', text: '#FF6060', card: 'rgba(255,0,0,0.12)' },
  angry: { node: '#FF4500', glow: '#FF2020', text: '#FF8060', card: 'rgba(255,80,0,0.12)' },
};

function MemoryCard({ memory, onClose }) {
  const colors = EMOTION_COLORS[memory.emotion] || EMOTION_COLORS.calm;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotateX: -15 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{
        position: 'absolute',
        bottom: '110%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '220px',
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.node}66`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: `0 0 30px ${colors.glow}44, 0 0 60px ${colors.glow}22, inset 0 0 20px ${colors.glow}08`,
        zIndex: 50,
        pointerEvents: 'auto',
      }}
    >
      {/* Corner decoration */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 12, borderTop: `2px solid ${colors.node}`, borderLeft: `2px solid ${colors.node}`, borderRadius: '2px 0 0 0' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderTop: `2px solid ${colors.node}`, borderRight: `2px solid ${colors.node}`, borderRadius: '0 2px 0 0' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 12, height: 12, borderBottom: `2px solid ${colors.node}`, borderLeft: `2px solid ${colors.node}`, borderRadius: '0 0 0 2px' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderBottom: `2px solid ${colors.node}`, borderRight: `2px solid ${colors.node}`, borderRadius: '0 0 2px 0' }} />

      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: colors.text, marginBottom: 4, opacity: 0.7 }}>
        {memory.type.toUpperCase()} · {memory.year}
      </div>
      <div style={{ fontFamily: '"Outfit", sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
        {memory.label}
      </div>
      <div style={{
        fontFamily: '"Outfit", sans-serif', fontSize: '12px', color: '#aaa',
        fontStyle: 'italic', lineHeight: 1.5,
        borderLeft: `2px solid ${colors.node}55`, paddingLeft: 8,
      }}>
        "{memory.secret}"
      </div>
      <button
        onClick={onClose}
        style={{
          marginTop: 12, fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px', color: colors.node, background: 'transparent',
          border: `1px solid ${colors.node}44`, borderRadius: 4,
          padding: '3px 8px', cursor: 'pointer', width: '100%',
        }}
      >
        [× CLOSE]
      </button>
    </motion.div>
  );
}

function MemoryNode({ memory, x, y, gravityOff, isFiltered }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { setHoveredMemory } = useMind();

  if (isFiltered) return null;

  const baseColors = EMOTION_COLORS[memory.emotion] || EMOTION_COLORS.calm;
  const hoverOverride = (hovered || expanded) && (HOVER_OVERRIDES[memory.type]);
  const colors = hoverOverride || baseColors;

  // Unique drift animation per node
  const driftId = `drift-${memory.id}`;
  const driftDuration = 4 + (memory.id.charCodeAt(1) % 4);
  const driftX = 8 + (memory.id.charCodeAt(0) % 10);
  const driftY = gravityOff ? -25 : (6 + (memory.id.charCodeAt(2) % 8));

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => { setHovered(true); setHoveredMemory(memory); }}
      onMouseLeave={() => { setHovered(false); setHoveredMemory(null); }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* CSS drift animation wrapper via foreignObject + div trick — use animateTransform instead */}
      <animateTransform
        attributeName="transform"
        type="translate"
        additive="sum"
        values={`0,0; ${driftX * 0.5},${-driftY * 0.5}; ${-driftX * 0.3},${driftY * 0.4}; 0,0`}
        keyTimes="0;0.33;0.66;1"
        dur={`${driftDuration}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
      />

      {/* Outer glow ring — pulsing */}
      <circle r={hovered ? 22 : 16} fill="none" stroke={colors.glow} strokeWidth={0.8} opacity={0.3}>
        <animate attributeName="r" values={`${hovered ? 20 : 14};${hovered ? 26 : 18};${hovered ? 20 : 14}`} dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle r={hovered ? 16 : 10} fill="none" stroke={colors.glow} strokeWidth={0.5} opacity={0.2} />

      {/* Main node */}
      <circle
        r={hovered ? 14 : 8}
        fill={`${colors.node}33`}
        stroke={colors.node}
        strokeWidth={hovered ? 2 : 1.5}
        style={{ filter: `drop-shadow(0 0 ${hovered ? 12 : 6}px ${colors.glow})`, transition: 'all 0.3s ease' }}
      />

      {/* Inner core */}
      <circle r={hovered ? 5 : 3} fill={colors.node} opacity={0.9}>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Label on hover */}
      {hovered && (
        <text
          y={-22}
          textAnchor="middle"
          fontFamily='"Share Tech Mono", monospace'
          fontSize="10"
          fill={colors.text}
          style={{ filter: `drop-shadow(0 0 4px ${colors.glow})` }}
        >
          {memory.label}
        </text>
      )}

      {/* Expanded card — use foreignObject */}
      {expanded && (
        <foreignObject x={-110} y={-280} width={220} height={260} style={{ overflow: 'visible' }}>
          <div xmlns="http://www.w3.org/1999/xhtml">
            <AnimatePresence>
              <MemoryCard key={memory.id} memory={memory} onClose={() => setExpanded(false)} />
            </AnimatePresence>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

// Compute tree layout positions
function getNodePosition(branch, svgW, svgH) {
  const cx = svgW / 2;
  const { side, level } = branch;
  const yFrac = 1 - (level / 5.5); // 0 = top, 1 = bottom
  const y = 60 + yFrac * (svgH - 100);

  if (side === 'center') return { x: cx, y };

  // Spread branches outward based on level
  const spread = 80 + level * 30;
  const wobble = (level % 2 === 0 ? 20 : -10);
  if (side === 'left') return { x: cx - spread + wobble, y };
  return { x: cx + spread + wobble, y };
}

export default function YggdrasilTree({ memories, gravityOff, filter }) {
  const svgW = 900;
  const svgH = 820;
  const cx = svgW / 2;

  // Position all nodes
  const positioned = memories.map(m => ({
    ...m,
    ...getNodePosition(m.branch, svgW, svgH),
  }));

  // Build trunk — center nodes sorted by y
  const trunk = positioned
    .filter(m => m.branch.side === 'center')
    .sort((a, b) => b.y - a.y);

  // Build branch paths from trunk to side nodes
  const branches = positioned.filter(m => m.branch.side !== 'center');

  function getTrunkConnector(sideNode) {
    // Find nearest trunk node
    const nearest = trunk.reduce((best, t) => {
      return Math.abs(t.y - sideNode.y) < Math.abs(best.y - sideNode.y) ? t : best;
    }, trunk[0]);
    return nearest;
  }

  function isFiltered(memory) {
    if (filter === 'all') return false;
    return memory.type !== filter;
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: '100%', height: '100%', maxWidth: '100vw', maxHeight: '100vh' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="tree-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="branch-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="trunk-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#003300" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#00FF41" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00FF41" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="node-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FF41" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background aura behind tree */}
        <ellipse cx={cx} cy={svgH / 2} rx={300} ry={svgH * 0.45}
          fill="url(#node-aura)" opacity={0.15} />

        {/* Sway group for the whole tree */}
        <g style={{ transformOrigin: `${cx}px ${svgH}px` }}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0;0.8;0;-0.8;0"
            keyTimes="0;0.25;0.5;0.75;1"
            dur="8s"
            repeatCount="indefinite"
            additive="sum"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />

          {/* TRUNK */}
          {trunk.length > 1 && (() => {
            const pts = trunk.map(t => `${t.x},${t.y}`).join(' L ');
            return (
              <>
                {/* Trunk glow */}
                <path d={`M ${pts}`} fill="none" stroke="#00FF41" strokeWidth={6} opacity={0.08} filter="url(#tree-glow)" />
                {/* Main trunk */}
                <path d={`M ${pts}`} fill="none" stroke="url(#trunk-grad)" strokeWidth={2.5} filter="url(#branch-glow)" />
                {/* Thin center line */}
                <path d={`M ${pts}`} fill="none" stroke="#00FF41" strokeWidth={0.8} opacity={0.9} />
              </>
            );
          })()}

          {/* BRANCHES from trunk to side nodes */}
          {branches.map(node => {
            const parent = getTrunkConnector(node);
            const midX = (parent.x + node.x) / 2;
            const midY = parent.y + (node.y - parent.y) * 0.1;
            const nodeColors = EMOTION_COLORS[node.emotion] || EMOTION_COLORS.calm;
            const path = `M ${parent.x},${parent.y} C ${midX},${midY} ${midX},${node.y} ${node.x},${node.y}`;

            return (
              <g key={`branch-${node.id}`}>
                {/* Branch glow */}
                <path d={path} fill="none" stroke={nodeColors.glow} strokeWidth={4} opacity={0.06} filter="url(#tree-glow)" />
                {/* Main branch */}
                <path d={path} fill="none" stroke={nodeColors.node} strokeWidth={1.2}
                  strokeDasharray={node.type === 'dreams' ? '6,4' : node.type === 'scary' ? '3,3' : 'none'}
                  opacity={isFiltered(node) ? 0.1 : 0.6} filter="url(#branch-glow)" />
              </g>
            );
          })}

          {/* MEMORY NODES */}
          {positioned.map(mem => (
            <MemoryNode
              key={mem.id}
              memory={mem}
              x={mem.x}
              y={mem.y}
              gravityOff={gravityOff}
              isFiltered={isFiltered(mem)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
