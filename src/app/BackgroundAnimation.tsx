"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

export function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sketchInstance: p5;

    // p5.jsを動的にインポート
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (p: p5) => {
        const particles: { x: number; y: number; dx: number; dy: number }[] = [];

        p.setup = () => {
          if (containerRef.current) {
            p.createCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight).parent(containerRef.current);
          }
          for (let i = 0; i < 50; i++) {
            particles.push({
              x: p.random(p.width),
              y: p.random(p.height),
              dx: p.random(-2, 2),
              dy: p.random(-2, 2),
            });
          }
        };

        p.draw = () => {
          p.clear();
          for (let particle of particles) {
            p.fill(100, 150, 255, 150);
            p.noStroke();
            p.circle(particle.x, particle.y, 20);
            particle.x += particle.dx;
            particle.y += particle.dy;
            if (particle.x < 0 || particle.x > p.width) particle.dx *= -1;
            if (particle.y < 0 || particle.y > p.height) particle.dy *= -1;
          }
        };

        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
          }
        };
      };

      sketchInstance = new p5(sketch);
    });

    return () => {
      if (sketchInstance) {
        sketchInstance.remove();
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1 }} />;
}