import React, { useState, useEffect, useCallback, useRef } from "react";

interface Firefly {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  glowColor: string;
  wobbleSpeed: number;
  wobbleAmount: number;
  phase: number;
}

export default function MagneticGroundingEffect() {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const requestRef = useRef<number | null>(null);
  const firefliesRef = useRef<Firefly[]>([]);

  // Update fireflies state in a high-performance animation loop
  const updatePhysics = useCallback(() => {
    let active = firefliesRef.current;
    if (active.length === 0) {
      if (fireflies.length > 0) {
        setFireflies([]);
      }
      requestRef.current = requestAnimationFrame(updatePhysics);
      return;
    }

    const updated = active.map((f) => {
      // Apply a light physical friction/drag, slowing them down
      const nextVx = f.vx * 0.94;
      const nextVy = f.vy * 0.94;

      // Add a magnetic/organic wave drift (like floaty fireflies)
      const driftX = Math.cos(f.phase) * f.wobbleAmount;
      const driftY = Math.sin(f.phase) * f.wobbleAmount - 0.45; // slight upward draft

      return {
        ...f,
        x: f.x + nextVx + driftX,
        y: f.y + nextVy + driftY,
        vx: nextVx,
        vy: nextVy,
        alpha: f.alpha - f.decay,
        phase: f.phase + f.wobbleSpeed,
      };
    }).filter((f) => f.alpha > 0.01);

    firefliesRef.current = updated;
    setFireflies(updated);
    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [fireflies.length]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [updatePhysics]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    // Avoid interrupting standard interactive input component focus
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" || 
      target.tagName === "TEXTAREA" || 
      target.tagName === "SELECT" ||
      target.closest("select") ||
      target.closest("input") ||
      target.closest("textarea")
    ) {
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;

    // Glowing particle color palette: deep gold, warm amber, soft platinum
    const glowColors = [
      "#DFBA6B", // Imperial Brass
      "#EAD890", // Soft Gold
      "#FFFDF0", // Platinum Warmth
      "#F59E0B"  // Radiant Amber
    ];

    // Spawn 15-22 sparkling firefly lights on click
    const count = 15 + Math.floor(Math.random() * 8);
    const newParticles: Firefly[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8; // Random burst initial speed
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 1.5 + Math.random() * 3.5; // Random firefly diameters

      newParticles.push({
        id: Date.now() + Math.random() + i,
        x: startX,
        y: startY,
        vx,
        vy,
        size,
        alpha: 1.0,
        decay: 0.01 + Math.random() * 0.02, // Dissolve time factor
        glowColor: glowColors[Math.floor(Math.random() * glowColors.length)],
        wobbleSpeed: 0.04 + Math.random() * 0.08,
        wobbleAmount: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    firefliesRef.current = [...firefliesRef.current, ...newParticles];
  }, []);

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handlePointerDown]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden select-none">
      <svg className="absolute inset-0 w-full h-full">
        {/* Realtime high-performance Gaussian blur filter */}
        <defs>
          <filter id="firefly-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {fireflies.map((f) => (
          <g key={f.id} style={{ opacity: f.alpha }}>
            {/* Outer halo gradient bloom */}
            <circle
              cx={f.x}
              cy={f.y}
              r={f.size * 3.5}
              fill={f.glowColor}
              opacity={f.alpha * 0.25}
              filter="url(#firefly-glow)"
            />

            {/* Radiant core light */}
            <circle
              cx={f.x}
              cy={f.y}
              r={f.size}
              fill="#FFFDF0"
              stroke={f.glowColor}
              strokeWidth="0.8"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
