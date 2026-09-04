import React, { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
  angle: number;
  waveSpeed: number;
}

export default function FirefliesBackground({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Fireflies count scaled by screen size
    const count = Math.min(25, Math.floor((width * height) / 40000) || 12);
    const fireflies: Firefly[] = [];

    // Initialize fireflies
    for (let i = 0; i < count; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.8,
        color: theme === "dark" ? "201, 168, 76" : "184, 138, 68", // #C9A84C gold or #B88A44 glittery brown gold
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.005 + 0.002,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update fireflies
      fireflies.forEach((p) => {
        // Slow floating wave wave motion
        p.angle += p.waveSpeed;
        p.x += p.speedX + Math.sin(p.angle) * 0.1;
        p.y += p.speedY + Math.cos(p.angle) * 0.1;

        // Bounce/Wrap boundaries gently
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulse opacity slowly
        const currentOpacity = p.opacity * (0.6 + Math.sin(p.angle * 2) * 0.4);

        // Draw particle
        ctx.beginPath();
        const glowRad = p.radius * 4;
        const radialGrad = ctx.createRadialGradient(p.x, p.y, p.radius / 2, p.x, p.y, glowRad);
        radialGrad.addColorStop(0, `rgba(${p.color}, ${currentOpacity})`);
        radialGrad.addColorStop(0.3, `rgba(${p.color}, ${currentOpacity * 0.4})`);
        radialGrad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = radialGrad;
        ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pinpoint center particle
        ctx.beginPath();
        ctx.fillStyle = theme === "dark" ? `rgba(232, 213, 163, ${currentOpacity * 0.8})` : `rgba(140, 101, 39, ${currentOpacity * 0.9})`;
        ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 print:hidden"
      style={{ mixBlendMode: theme === "dark" ? "screen" : "normal", opacity: theme === "dark" ? 0.95 : 0.85 }}
    />
  );
}
