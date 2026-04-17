import { useEffect, useRef } from 'react';

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01234567890101ゼロイチニサン';

export default function MatrixIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const opacities = Array(cols).fill(0).map(() => 0.4 + Math.random() * 0.6);

    let fadeOut = false;
    let globalAlpha = 1;

    function draw() {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      // Start fading out after 3.5s
      if (elapsed > 3.5) {
        fadeOut = true;
        globalAlpha = Math.max(0, 1 - (elapsed - 3.5) / 1.2);
        if (globalAlpha <= 0) {
          cancelAnimationFrame(animRef.current);
          onComplete();
          return;
        }
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols; i++) {
        // Head character — bright green
        const headAlpha = opacities[i] * globalAlpha;
        ctx.globalAlpha = headAlpha;
        ctx.fillStyle = '#00FF41';
        ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Glow effect
        ctx.shadowColor = '#00FF41';
        ctx.shadowBlur = 8;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        ctx.shadowBlur = 0;

        // Tail — dimmer
        if (drops[i] > 3) {
          ctx.globalAlpha = headAlpha * 0.35;
          ctx.fillStyle = '#00cc33';
          const tail = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          ctx.fillText(tail, i * fontSize, (drops[i] - 3) * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.6 + Math.random() * 0.3;
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        background: '#000',
        zIndex: 100,
      }}
    />
  );
}
