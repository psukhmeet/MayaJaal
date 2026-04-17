import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMind } from '../context/MindContext';

const TYPE_COLORS = {
  core: '#c9a84c',
  visual: '#1affe4',
  fear: '#7b2fbe',
  joy: '#f5a623',
  dream: '#4a90d9',
};

export default function TemporalTree({ memories }) {
  const { theme, emotion } = useMind();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const containerRef = useRef(null);

  const svgWidth = 380;
  const nodeSpacing = 160;
  const svgHeight = memories.length * nodeSpacing + 100;
  const centerX = svgWidth / 2;

  // Position nodes bottom (oldest) to top (newest)
  const positionedMemories = memories.map((m, i) => {
    const reversed = memories.length - 1 - i;
    const y = svgHeight - 60 - reversed * nodeSpacing;
    let x = centerX;
    if (m.branch === 'left') x = centerX - 100;
    if (m.branch === 'right') x = centerX + 100;
    // Blur & opacity for older memories
    const age = i / (memories.length - 1); // 0=oldest, 1=newest
    const blur = (1 - age) * 4;
    const opacity = 0.3 + age * 0.7;
    return { ...m, x, y, blur, opacity, age };
  });

  function getTrunkPath() {
    const points = positionedMemories
      .filter(m => !m.branch)
      .map(m => `${m.x},${m.y}`)
      .join(' L ');
    return `M ${points}`;
  }

  function getBranchPath(mem) {
    const parent = positionedMemories.find(
      (m, i) => !m.branch && positionedMemories[i + 1]?.id === mem.id || 
      positionedMemories.indexOf(mem) > 0 && 
      positionedMemories[positionedMemories.indexOf(mem) - 1]?.branch !== mem.branch
    ) || positionedMemories.find(m => !m.branch && Math.abs(m.y - mem.y) < nodeSpacing * 1.5);

    if (!parent) return '';
    const cp1x = parent.x;
    const cp1y = mem.y + (parent.y - mem.y) * 0.4;
    return `M ${parent.x},${parent.y} C ${cp1x},${cp1y} ${mem.x},${cp1y} ${mem.x},${mem.y}`;
  }

  const trunkNodes = positionedMemories.filter(m => !m.branch);
  const branchNodes = positionedMemories.filter(m => m.branch);

  const isJagged = emotion === 'angry' || emotion === 'fear';
  const treeAnim = emotion === 'angry' ? 'tree-shake' : emotion === 'calm' ? 'tree-sway' : '';

  return (
    <div className="relative h-full flex flex-col">
      <div className="glass-panel rounded-xl p-4 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.primary }} />
        <span className="font-mono text-xs" style={{ color: theme.primary }}>TEMPORAL STREAM</span>
        <span className="font-mono text-xs text-gray-500 ml-auto">↕ SCROLL TO TRAVERSE</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div style={{ height: svgHeight + 40, position: 'relative' }}>
          <svg
            width={svgWidth}
            height={svgHeight}
            className={treeAnim}
            style={{ display: 'block', margin: '0 auto' }}
          >
            <defs>
              <filter id="tree-glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="node-glow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.treeColor} stopOpacity="1" />
                <stop offset="100%" stopColor={theme.treeColor} stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Trunk line */}
            {trunkNodes.length > 1 && (
              <>
                <path
                  d={`M ${trunkNodes.map(m => `${m.x},${m.y}`).join(' L ')}`}
                  fill="none"
                  stroke="url(#trunkGrad)"
                  strokeWidth={isJagged ? 3 : 2}
                  strokeDasharray={isJagged ? '8,4' : 'none'}
                  opacity={0.6}
                  filter="url(#tree-glow)"
                />
                <path
                  d={`M ${trunkNodes.map(m => `${m.x},${m.y}`).join(' L ')}`}
                  fill="none"
                  stroke={theme.treeGlow}
                  strokeWidth={1}
                  opacity={0.3}
                  filter="url(#tree-glow)"
                />
              </>
            )}

            {/* Branch paths */}
            {branchNodes.map(mem => (
              <path
                key={`branch-${mem.id}`}
                d={getBranchPath(mem)}
                fill="none"
                stroke={theme.treeColor}
                strokeWidth={isJagged ? 2 : 1.5}
                strokeDasharray={isJagged ? '6,3' : '4,3'}
                opacity={mem.opacity * 0.6}
                filter="url(#tree-glow)"
              />
            ))}

            {/* Memory nodes */}
            {positionedMemories.map(mem => (
              <g
                key={mem.id}
                onClick={() => setSelectedMemory(selectedMemory?.id === mem.id ? null : mem)}
                style={{ cursor: 'pointer', filter: `blur(${mem.blur}px)`, opacity: mem.opacity }}
              >
                {/* Outer glow ring */}
                <circle
                  cx={mem.x}
                  cy={mem.y}
                  r={selectedMemory?.id === mem.id ? 22 : 18}
                  fill="none"
                  stroke={TYPE_COLORS[mem.type] || theme.treeColor}
                  strokeWidth={1}
                  opacity={0.4}
                  filter="url(#node-glow)"
                >
                  <animate attributeName="r" values="16;20;16" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Main node */}
                <circle
                  cx={mem.x}
                  cy={mem.y}
                  r={mem.type === 'core' ? 12 : 8}
                  fill={`${TYPE_COLORS[mem.type] || theme.treeColor}44`}
                  stroke={TYPE_COLORS[mem.type] || theme.treeColor}
                  strokeWidth={2}
                  filter="url(#node-glow)"
                />

                {/* Year label */}
                <text
                  x={mem.branch === 'left' ? mem.x - 20 : mem.x + 20}
                  y={mem.y - 16}
                  fill={TYPE_COLORS[mem.type] || theme.treeColor}
                  fontSize="10"
                  fontFamily='"Share Tech Mono", monospace'
                  textAnchor={mem.branch === 'left' ? 'end' : 'start'}
                  opacity={mem.opacity}
                >
                  {mem.year}
                </text>

                {/* Label */}
                <text
                  x={mem.branch === 'left' ? mem.x - 20 : mem.x + 20}
                  y={mem.y + 2}
                  fill="white"
                  fontSize="11"
                  fontFamily='"Outfit", sans-serif'
                  fontWeight="600"
                  textAnchor={mem.branch === 'left' ? 'end' : 'start'}
                  opacity={mem.opacity}
                >
                  {mem.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Memory popup */}
          <AnimatePresence>
            {selectedMemory && (
              <motion.div
                key={selectedMemory.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute left-1/2 glass-panel rounded-xl p-4 w-64 -translate-x-1/2"
                style={{
                  top: positionedMemories.find(m => m.id === selectedMemory.id)?.y - 120,
                  borderColor: TYPE_COLORS[selectedMemory.type],
                  boxShadow: `0 0 30px ${TYPE_COLORS[selectedMemory.type]}44`,
                  zIndex: 20,
                }}
              >
                <div className="font-mono text-xs mb-1" style={{ color: TYPE_COLORS[selectedMemory.type] }}>
                  {selectedMemory.type.toUpperCase()} — {selectedMemory.year}
                </div>
                <div className="font-sans text-sm font-bold text-white mb-2">{selectedMemory.label}</div>
                <div className="font-sans text-xs text-gray-400 italic">"{selectedMemory.description}"</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
