'use client';

import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; dx: number; dy: number; r: number };

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // 画面サイズに合わせてキャンバスをリサイズ
  const fitToScreen = (canvas: HTMLCanvasElement) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { clientWidth, clientHeight } = canvas.parentElement || canvas;
    canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
    canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
    canvas.style.width = `${clientWidth}px`;
    canvas.style.height = `${clientHeight}px`;
    return dpr;
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let dpr = fitToScreen(canvas);

    // 粒子を初期化
    const init = () => {
      const w = canvas.width, h = canvas.height;
      const count = 60;
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          dx: (Math.random() * 2 - 1) * 0.6 * dpr,
          dy: (Math.random() * 2 - 1) * 0.6 * dpr,
          r: 6 * dpr,
        });
      }
      particlesRef.current = arr;
    };

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      // 透明の背景（フェード）
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.clearRect(0, 0, w, h);

      // 柔らかいグローの丸
      for (const p of particlesRef.current) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2);
        gradient.addColorStop(0, 'rgba(99, 139, 255, 0.75)');
        gradient.addColorStop(1, 'rgba(99, 139, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(99, 139, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 粒子間のライン
      ctx.strokeStyle = 'rgba(99, 139, 255, 0.15)';
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < (140 * dpr) * (140 * dpr)) {
            const alpha = Math.max(0, 1 - Math.sqrt(dist2) / (140 * dpr)) * 0.25;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    init();
    draw();

    // リサイズ対応
    const onResize = () => {
      dpr = fitToScreen(canvas);
      init();
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-hidden="true"
    />
  );
}
