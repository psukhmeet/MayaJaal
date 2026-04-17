import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMind } from '../context/MindContext';

const EMOTION_COLORS = {
  calm:  { node: '#00FF41', glow: '#00FF41', text: '#00FF41' },
  joy:   { node: '#FFD700', glow: '#FFA500', text: '#FFD700' },
  fear:  { node: '#8B00FF', glow: '#6600cc', text: '#BF7FFF' },
  angry: { node: '#FF2020', glow: '#FF0000', text: '#FF6060' },
};

const HOVER_OVERRIDES = {
  scary: { node: '#FF2020', glow: '#FF0000', text: '#FF6060' },
  angry: { node: '#FF4500', glow: '#FF2020', text: '#FF8060' },
};

function TimelineNode({ memory, cx, cy, gravityOff }) {
  const [hovered, setHovered] = useState(false);
  const { setHoveredMemory } = useMind();
  const navigate = useNavigate();

  const baseColors = EMOTION_COLORS[memory.emotion] || EMOTION_COLORS.calm;
  const hoverOverride = hovered && HOVER_OVERRIDES[memory.type];
  const colors = hoverOverride || baseColors;

  const driftId = `drift-${memory.id}`;
  const driftDuration = 4 + (memory.id.charCodeAt(1) % 4);
  const driftY = gravityOff ? -25 : (6 + (memory.id.charCodeAt(2) % 8));

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => { setHovered(true); setHoveredMemory(memory); }}
      onMouseLeave={() => { setHovered(false); setHoveredMemory(null); }}
      onClick={() => navigate(`/memory/${memory.id}`)}
    >
      <animateTransform
        attributeName="transform"
        type="translate"
        additive="sum"
        values={`0,0; 0,${-driftY * 0.5}; 0,${driftY * 0.4}; 0,0`}
        keyTimes="0;0.33;0.66;1"
        dur={`${driftDuration}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
      />

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

      {/* Outer glow ring — pulsing when hovered */}
      {hovered && (
        <circle r={22} fill="none" stroke={colors.glow} strokeWidth={0.8} opacity={0.3}>
          <animate attributeName="r" values="20;26;20" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Label and Year */}
      <text
        y={hovered ? -26 : -20}
        textAnchor="middle"
        fontFamily='"Share Tech Mono", monospace'
        fontSize={hovered ? "12" : "10"}
        fill={colors.text}
        style={{ filter: `drop-shadow(0 0 4px ${colors.glow})`, transition: 'all 0.3s ease' }}
      >
        {memory.label}
      </text>
      <text
        y={hovered ? 26 : 20}
        textAnchor="middle"
        fontFamily='"Share Tech Mono", monospace'
        fontSize="10"
        fill={colors.text}
        opacity={0.7}
      >
        {memory.year}
      </text>
    </g>
  );
}

export default function SacredTimeline({ memories, gravityOff, filter }) {
  const { theme } = useMind();

  // Filter memories
  const filteredMemories = useMemo(() => {
    let result = memories;
    if (filter !== 'all') {
      result = memories.filter(m => m.type === filter || m.type === 'core');
    }
    // Sort chronologically (assuming year is string or number)
    return [...result].sort((a, b) => {
      if (a.year === 'THE BEGINNING') return -1;
      if (b.year === 'THE BEGINNING') return 1;
      if (a.year === 'PRESENT') return 1;
      if (b.year === 'PRESENT') return -1;
      return parseInt(a.year) - parseInt(b.year);
    });
  }, [memories, filter]);

  // Layout calculations
  const nodeSpacing = 160;
  const svgW = Math.max(window.innerWidth, filteredMemories.length * nodeSpacing + 400);
  const svgH = 600;
  const startX = 200;

  // Generate sine wave path for the Sacred Timeline
  const timelinePath = useMemo(() => {
    let d = `M 0,${svgH / 2}`;
    for (let x = 0; x <= svgW; x += 10) {
      const y = svgH / 2 + Math.sin(x / 100) * 40;
      d += ` L ${x},${y}`;
    }
    return d;
  }, [svgW, svgH]);

  const positioned = filteredMemories.map((m, i) => {
    const cx = startX + i * nodeSpacing;
    const cyConfig = svgH / 2 + Math.sin(cx / 100) * 40;
    
    // Add some random y offset for branches/variations
    const wobble = (i % 2 === 0 ? 1 : -1) * (20 + (i * 7) % 30);
    const cy = m.type === 'core' ? cyConfig : cyConfig + wobble; 

    return { ...m, cx, cy, origCy: cyConfig };
  });

  return (
    <div style={{ 
      width: '100vw', 
      height: '100%', 
      overflowX: 'auto', 
      overflowY: 'hidden',
      display: 'flex', 
      alignItems: 'center' 
    }}
    className="scrollbar-thin"
    >
      <svg
        width={svgW}
        height={svgH}
        style={{ flexShrink: 0 }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The Timeline String / Trunk */}
        <g style={{ transformOrigin: 'left center' }}>
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1 1; 1 1.05; 1 1"
            keyTimes="0; 0.5; 1"
            dur="8s"
            repeatCount="indefinite"
          />
          <path
            d={timelinePath}
            fill="none"
            stroke="url(#timeline-grad)"
            strokeWidth={4}
            opacity={0.3}
            filter="url(#glow)"
          />
          <path
            d={timelinePath}
            fill="none"
            stroke={theme.primary}
            strokeWidth={1.5}
            opacity={0.8}
            filter="url(#glow)"
          />
          {/* Animated pulse traveling along the timeline */}
          <path
            d={timelinePath}
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            opacity={0.6}
            strokeDasharray="20 1000"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Branches to non-core nodes */}
        {positioned.map(m => {
          if (m.type === 'core') return null;
          return (
            <path
              key={`branch-${m.id}`}
              d={`M ${m.cx},${m.origCy} Q ${m.cx + 20},${(m.origCy + m.cy) / 2} ${m.cx},${m.cy}`}
              fill="none"
              stroke={theme.primary}
              strokeWidth={1}
              strokeDasharray={'4,4'}
              opacity={0.4}
              filter="url(#glow)"
            />
          )
        })}

        {/* Nodes */}
        {positioned.map(mem => (
          <TimelineNode
            key={mem.id}
            memory={mem}
            cx={mem.cx}
            cy={mem.cy}
            gravityOff={gravityOff}
          />
        ))}

        <defs>
          <linearGradient id="timeline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#000" stopOpacity="0" />
             <stop offset="10%" stopColor={theme.primary} stopOpacity="1" />
             <stop offset="90%" stopColor={theme.primary} stopOpacity="1" />
             <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
