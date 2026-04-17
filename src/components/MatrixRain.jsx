import { useEffect, useRef } from 'react';
import { useMind } from '../context/MindContext';

export default function MatrixRain({ thoughts, onHoverThought, hoveredThought }) {
  const canvasRef = useRef(null);
  const { theme, emotion } = useMind();
  const animRef = useRef(null);
  const dropsRef = useRef([]);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const chars = 'アイウエオカキクケコ01ゼロイチニサンシゴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    let cols, drops, clusterMap;

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);

      // Create cluster assignments for each column
      const numClusters = Math.min(thoughts.length, 12);
      clusterMap = [];
      drops = [];
      for (let i = 0; i < cols; i++) {
        clusterMap[i] = Math.floor((i / cols) * numClusters);
        drops[i] = Math.random() * -100;
      }
      dropsRef.current = drops;
    }

    function getEmotionColor(base, alpha) {
      const c = themeRef.current.rainColor;
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function draw() {
      const speed = themeRef.current.rainSpeed;
      // Fade trail
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols; i++) {
        const clusterId = clusterMap[i];
        const isHovered = hoveredThought === clusterId;
        const thought = thoughts[clusterId];

        if (isHovered) {
          // Pause rain for hovered cluster, draw glow instead
          ctx.fillStyle = getEmotionColor('', 0.1);
          ctx.fillRect(i * fontSize, 0, fontSize, canvas.height);
          continue;
        }

        // Head char — bright
        ctx.fillStyle = isHovered ? '#ffffff' : getEmotionColor('', 0.95);
        ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Tail chars — dim
        ctx.fillStyle = getEmotionColor('', 0.3);
        if (drops[i] > 2) {
          const tailChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(tailChar, i * fontSize, (drops[i] - 2) * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += speed;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    init();
    draw();

    const handleResize = () => { init(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [thoughts, hoveredThought]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}
