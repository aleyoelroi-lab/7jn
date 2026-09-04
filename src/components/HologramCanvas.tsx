import React, { useEffect, useRef, useState } from "react";
import { HologramNode } from "../types";

// The 9 primary interactive labeled nodes
const KEY_INTERACTIVE_NODES = [
  { id: "home", x: -90, y: -70, z: 80, size: 8, label: "JS Pait's Welcome", sectionLink: "#home", color: "#C9A84C", info: "Start here: 7JN Tech Assist Core Solutions & Technical Overview" },
  { id: "services", x: 90, y: -90, z: -50, size: 8, label: "Core Services", sectionLink: "#services", color: "#DFBA6B", info: "Zendesk, Asana workflows, remote system backups, workflow pipelines" },
  { id: "resume", x: 120, y: 70, z: 120, size: 9, label: "HTML Resume (Live)", sectionLink: "#resume", color: "#C9A84C", info: "Data Analyst & Technical Founder. Click to view certifications and credentials" },
  { id: "packages", x: -140, y: 60, z: -60, size: 8, label: "Service Investment", sectionLink: "#packages", color: "#DFBA6B", info: "Starter, Pro & Enterprise rates with 1-month included maintenance" },
  { id: "schedule", x: -30, y: 130, z: 40, size: 9, label: "Booking Scheduler", sectionLink: "#schedule", color: "#C9A84C", info: "Instantly declare custom tickers, sign NDA agreements, & secure consultation" },
  { id: "contact", x: -130, y: -120, z: 90, size: 7, label: "Connect Channels", sectionLink: "#contact", color: "#C9A84C", info: "Direct Messenger, social handles & FAQs" },
  { id: "blog", x: -10, y: -140, z: -110, size: 7, label: "Tech Blog", sectionLink: "#blog", color: "#DFBA6B", info: "Expert workflow optimization tips & industry insights" },
  { id: "privacy", x: 140, y: -130, z: 70, size: 7, label: "Privacy Standards", sectionLink: "#privacy", color: "#C9A84C", info: "Data isolation, NDAs & corporate auditing standard protocols" },
  { id: "alteryx", x: 160, y: 110, z: -20, size: 7, label: "Alteryx Project", sectionLink: "#resume", color: "#DFBA6B", info: "Strategic automation scripts, dropping secure files into distributed networks" }
];

interface BackgroundStar {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  speed: number;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

interface ToastNotification {
  id: number;
  message: string;
  sub: string;
}

interface ExplosionParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: "circle" | "spark" | "glitch";
}

export default function HologramCanvas({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Responsive state for absolute lightweight phone rendering
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.25);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Keep high-frequency physics variables in Refs to prevent 60fps re-render thrashing
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0.1, y: -0.2 });
  const zoomRef = useRef<number>(1.25);

  // 3D Nodes representation to avoid Component stale dependencies
  const nodesRef = useRef<(HologramNode & { hoverProgress: number; targetHover: number })[]>([]);
  // 600 Background Stars Ref
  const bgStarsRef = useRef<BackgroundStar[]>([]);
  // Click shockwave ripples
  const ripplesRef = useRef<ClickRipple[]>([]);
  // Cached active 3D connection lines for frame optimization (updated every 2nd frame)
  const connectionCacheRef = useRef<[number, number, number][]>([]); // [fromIdx, toIdx, 3dDistance]
  // Cached positions of labels to avoid font computations (updated every 3rd frame)
  const labelRenderCacheRef = useRef<{ label: string; x: number; y: number; visible: boolean; isHovered: boolean }[]>([]);

  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMouseDownRef = useRef<boolean>(false);
  const [dims, setDims] = useState({ width: 800, height: 620 });

  // Elastic pulling and mild earthquake physics variables
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const elasticTranslationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elasticVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const shakeRef = useRef<number>(0);
  const explosionParticlesRef = useRef<ExplosionParticle[]>([]);
  const isWhippingRef = useRef<boolean>(false);
  const pullDistanceRef = useRef<number>(0);

  // Mobile check on mount
  useEffect(() => {
    const checkMobileWidth = () => {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileUA || isSmallScreen);
    };
    checkMobileWidth();
    window.addEventListener("resize", checkMobileWidth);
    
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    const isMob = isMobileUA || isSmallScreen;

    // Build background stars (600 on desktop, 150 on mobile for flawless phone frame rates)
    const starCount = isMob ? 150 : 600;
    const stars: BackgroundStar[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 1000,
        z: (Math.random() - 0.5) * 1000,
        size: 0.3 + Math.random() * 1.6,
        alpha: 0.15 + Math.random() * 0.5,
        speed: 0.05 + Math.random() * 0.12
      });
    }
    bgStarsRef.current = stars;

    // Build the constellation nodes (optimized list on phone screens to prevent lag)
    // 9 Key interactive nodes + custom gold organic decorative nodes
    const combinedNodes: (HologramNode & { hoverProgress: number; targetHover: number })[] = [];

    // Add key labeled nodes
    KEY_INTERACTIVE_NODES.forEach((n) => {
      combinedNodes.push({
        ...n,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        vz: (Math.random() - 0.5) * 0.12,
        ox: n.x,
        oy: n.y,
        oz: n.z,
        hoverProgress: 0,
        targetHover: 0
      });
    });

    // Add random gold decorative nodes (81 on desktop, 25 on mobile to accelerate math checks)
    const decorCount = isMob ? 25 : 81;
    for (let i = 0; i < decorCount; i++) {
      // Golden spiral allocation for pleasant spatial density distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 90 + Math.random() * 135;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      combinedNodes.push({
        id: `decor_${i}`,
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        vz: (Math.random() - 0.5) * 0.15,
        ox: x,
        oy: y,
        oz: z,
        size: 1.8 + Math.random() * 2.2,
        label: "",
        sectionLink: "",
        color: "#C9A84C",
        info: "",
        hoverProgress: 0,
        targetHover: 0
      });
    }

    nodesRef.current = combinedNodes;

    return () => window.removeEventListener("resize", checkMobileWidth);
  }, []);

  // Track Dimensions and debounce layout coordinates to block subpixel infinite render cycles
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const newWidth = Math.floor(containerRef.current.clientWidth);
        const newHeight = Math.floor(containerRef.current.clientHeight || 600);
        
        setDims(prev => {
          if (Math.abs(prev.width - newWidth) < 2 && Math.abs(prev.height - newHeight) < 2) {
            return prev;
          }
          return { width: newWidth, height: newHeight };
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(() => updateSize());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const triggerToast = (message: string, sub: string) => {
    setToast({
      id: Date.now(),
      message,
      sub
    });
  };

  // Close toast automatically after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Coordinate projection math
  const projectPoint = (x: number, y: number, z: number) => {
    const cx = dims.width / 2;
    const cy = dims.height / 2;
    const rPitch = rotationRef.current.x;
    const rYaw = rotationRef.current.y;

    // Apply Yaw (Y-axis rotation)
    const cosY = Math.cos(rYaw);
    const sinY = Math.sin(rYaw);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Apply Pitch (X-axis rotation)
    const cosX = Math.cos(rPitch);
    const sinX = Math.sin(rPitch);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // Depth FOV calculation
    const fov = 380;
    const divisor = fov + z2;
    if (divisor <= 10) {
      return {
        x: cx,
        y: cy,
        z: z2,
        scale: 0,
        behind: true
      };
    }
    const scale = (fov / divisor) * zoomRef.current;

    return {
      x: cx + x1 * scale + elasticTranslationRef.current.x,
      y: cy + y2 * scale + elasticTranslationRef.current.y,
      z: z2,
      scale,
      behind: false
    };
  };

  const handleZoomIn = () => {
    const nextZoom = Math.min(zoomRef.current + 0.15, 2.5);
    zoomRef.current = nextZoom;
    setZoom(nextZoom);
  };

  const handleZoomOut = () => {
    const nextZoom = Math.max(zoomRef.current - 0.15, 0.5);
    zoomRef.current = nextZoom;
    setZoom(nextZoom);
  };

  // Click Handler - Shockwave Spawn and Navigation
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. Spawn Ripple ring shockwave
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 280,
      speed: 6.5,
      alpha: 1.0
    });

    // 2. Collision checking with labeled nodes or cached label tags
    let clickedNodeId: string | null = null;
    let clickedNodeLabel = "";
    let clickedNodeLink = "";

    // Test proximity to any of the 9 named nodes
    nodesRef.current.forEach((node) => {
      if (!node.label) return; // ignore decorative
      const proj = projectPoint(node.x, node.y, node.z);
      if (proj.behind) return;
      const dist = Math.hypot(x - proj.x, y - proj.y);
      
      // Proximity limit to node core or labeled text underneath
      if (dist < node.size * proj.scale * 3.5 || (Math.abs(x - proj.x) < 70 && y > proj.y && y < proj.y + 40)) {
        clickedNodeId = node.id;
        clickedNodeLabel = node.label;
        clickedNodeLink = node.sectionLink;
      }
    });

    if (clickedNodeId && clickedNodeLink) {
      triggerToast(
        `🛰️ TRANSMITTING POSITION VECTOR`,
        `Navigating to: ${clickedNodeLabel.toUpperCase()}`
      );
      
      // Smooth Scroll
      if (clickedNodeLink === "#resume") {
        // Trigger CV states on window if available globally
        (window as any)._showFullSnapshot?.();
      }
      
      const element = document.querySelector(clickedNodeLink);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  };

  const spawnExplosions = (centerX: number, centerY: number, intensity: number) => {
    const colors = theme === "dark"
      ? ["#FFD700", "#C9A84C", "#DFBA6B", "#FFFFFF", "#FF6B6B", "#4D96FF"]
      : ["#0E1F3D", "#B88A44", "#8C6527", "#0A0B0E", "#D4A85B", "#18335F"];
      
    const particlesCount = Math.floor(35 + intensity * 1.5);
    const newParticles: ExplosionParticle[] = [];

    // 1. Primary main point explosion burst (where pointer was released)
    for (let i = 0; i < particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * (4.5 + intensity * 0.1);
      const size = 1.5 + Math.random() * 3.5;
      const maxLife = 40 + Math.floor(Math.random() * 35);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const type = Math.random() < 0.35 ? "circle" : (Math.random() < 0.75 ? "spark" : "glitch");

      newParticles.push({
        id: Math.random(),
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        alpha: 1.0,
        life: maxLife,
        maxLife,
        type
      });
    }

    // 2. Chained micro mini explosions on nearby nodes
    const candidateNodes = nodesRef.current
      .filter(n => n.label !== "")
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    candidateNodes.forEach(node => {
      const proj = projectPoint(node.x, node.y, node.z);
      if (!proj.behind) {
        const miniCount = 12 + Math.floor(Math.random() * 10);
        for (let i = 0; i < miniCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.8 + Math.random() * 2.8;
          const size = 1.0 + Math.random() * 2.2;
          const maxLife = 30 + Math.floor(Math.random() * 20);
          const color = colors[Math.floor(Math.random() * colors.length)];
          const type = Math.random() < 0.5 ? "circle" : "spark";

          newParticles.push({
            id: Math.random(),
            x: proj.x,
            y: proj.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size,
            color,
            alpha: 1.0,
            life: maxLife,
            maxLife,
            type
          });
        }
      }
    });

    explosionParticlesRef.current = [...explosionParticlesRef.current, ...newParticles];
  };

  // Drag-to-rotate & hover coordinate tracing with smooth multi-platform pointer bindings
  const handleMouseDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isMouseDownRef.current = true;
    dragStartPosRef.current = { x, y };
    lastMousePosRef.current = { x, y };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleMouseMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current = { x, y };

    if (isMouseDownRef.current) {
      if (dragStartPosRef.current) {
        const px = x - dragStartPosRef.current.x;
        const py = y - dragStartPosRef.current.y;
        
        // Elastic rubber band pull displacement with resistance
        const resistance = 0.55;
        elasticTranslationRef.current.x = px * resistance;
        elasticTranslationRef.current.y = py * resistance;
      }

      const dx = x - lastMousePosRef.current.x;
      const dy = y - lastMousePosRef.current.y;
      rotationRef.current.x += dy * 0.002;
      rotationRef.current.y += dx * 0.002;
      lastMousePosRef.current = { x, y };
    }
  };

  const handleMouseUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isMouseDownRef.current && dragStartPosRef.current) {
      const px = elasticTranslationRef.current.x;
      const py = elasticTranslationRef.current.y;
      const pullDist = Math.hypot(px, py);

      if (pullDist > 15) {
        // Trigger high-speed whip snap back state
        isWhippingRef.current = true;
        pullDistanceRef.current = pullDist;

        // Fun reactive HUD seismic alerts
        triggerToast(
          "💫 ELASTIC COUPLING LET-GO",
          "Whipping constellation back to core at hypersonic speed!"
        );
      }
    }

    isMouseDownRef.current = false;
    dragStartPosRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Primary animation framework (Runs unconditionally for unified premium background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const renderLoop = () => {
      frameCount++;
      const w = dims.width;
      const h = dims.height;

      // Dark classy deep space starry canvas backdrop
      if (theme === "dark") {
        ctx.fillStyle = "#030303";
        ctx.fillRect(0, 0, w, h);
      } else {
        // Base: Cream white #FAF7F2
        ctx.fillStyle = "#FAF7F2";
        ctx.fillRect(0, 0, w, h);

        // Radial undertone gradient blending from warm cream into soft dark blue
        const radGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) * 0.9);
        radGrad.addColorStop(0, "rgba(250, 247, 242, 0.95)"); // Cream white core
        radGrad.addColorStop(0.5, "rgba(14, 31, 61, 0.08)"); // Soft royal dark blue undertone
        radGrad.addColorStop(1, "rgba(14, 31, 61, 0.16)"); // Subtle dark blue edge
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, w, h);

        // Glittery brown gold accents (#B88A44) woven throughout as ambient radiant flares
        const goldGrad = ctx.createRadialGradient(w * 0.3, h * 0.4, 5, w * 0.3, h * 0.4, 180);
        goldGrad.addColorStop(0, "rgba(184, 138, 68, 0.22)"); // Glittery brown gold flare
        goldGrad.addColorStop(1, "rgba(250, 247, 242, 0)");
        ctx.fillStyle = goldGrad;
        ctx.fillRect(0, 0, w, h);

        const goldGrad2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 10, w * 0.7, h * 0.6, 250);
        goldGrad2.addColorStop(0, "rgba(184, 138, 68, 0.16)");
        goldGrad2.addColorStop(1, "rgba(250, 247, 242, 0)");
        ctx.fillStyle = goldGrad2;
        ctx.fillRect(0, 0, w, h);

        // Subtle glitter texture (Glittery brown gold + dark blue + obsidian specks)
        ctx.save();
        const grainCount = isMobile ? 250 : 3500;
        for (let i = 0; i < grainCount; i++) {
          const rx = Math.random() * w;
          const ry = Math.random() * h;
          const coin = Math.random();
          if (coin < 0.5) {
            ctx.fillStyle = "rgba(184, 138, 68, 0.15)"; // glittery brown gold speck
          } else if (coin < 0.8) {
            ctx.fillStyle = "rgba(14, 31, 61, 0.10)"; // dark blue speck
          } else {
            ctx.fillStyle = "rgba(10, 11, 14, 0.12)"; // shiny black speck
          }
          ctx.fillRect(rx, ry, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
        }
        ctx.restore();
      }

      // --- ELASTIC SNAP BACK SPRING PHYSICS WITH WHIP COLLISION COLLAPSING ---
      if (isWhippingRef.current) {
        // Tension pulls it back to (0,0) with high rubber band stiffness
        const k = 0.58; // very high stiffness for ultra-fast snap back
        const ax = -k * elasticTranslationRef.current.x;
        const ay = -k * elasticTranslationRef.current.y;

        // Low damping to maintain maximum velocity until impact
        const damping = 0.72; 
        elasticVelocityRef.current.x = (elasticVelocityRef.current.x + ax) * damping;
        elasticVelocityRef.current.y = (elasticVelocityRef.current.y + ay) * damping;

        const oldX = elasticTranslationRef.current.x;
        const oldY = elasticTranslationRef.current.y;

        elasticTranslationRef.current.x += elasticVelocityRef.current.x;
        elasticTranslationRef.current.y += elasticVelocityRef.current.y;

        const dist = Math.hypot(elasticTranslationRef.current.x, elasticTranslationRef.current.y);
        const prevDist = Math.hypot(oldX, oldY);

        // Moment of collision is when it crosses the central origin point or reaches closest proximity
        if (dist < 4.5 || (dist > prevDist && prevDist < 25)) {
          isWhippingRef.current = false;
          
          // Instantly lock and anchor the constellation
          elasticTranslationRef.current = { x: 0, y: 0 };
          elasticVelocityRef.current = { x: 0, y: 0 };

          // Massive explosion on the core constellation center / celestial colliding planets!
          const centerX = w / 2;
          const centerY = h / 2;
          const pullDist = pullDistanceRef.current;
          
          // Trigger severe earth quick shake amplitude!
          shakeRef.current = Math.min(32, pullDist * 0.22 + 10);

          spawnExplosions(centerX, centerY, pullDist);

          // Fun reactive HUD seismic warnings
          triggerToast(
            "💥 CORE COLLISION BLAST!",
            `Whip-snap collision created a Magnitude ${Math.floor(shakeRef.current / 3.5)} Stellar Shockwave!`
          );
        }
      } else if (!isMouseDownRef.current) {
        // Tension pulls it back to (0,0)
        // Spring acceleration: F = -k * x
        const k = 0.16; // spring constant stiffness
        const ax = -k * elasticTranslationRef.current.x;
        const ay = -k * elasticTranslationRef.current.y;
        
        // Friction / damping decay
        const damping = 0.81;
        elasticVelocityRef.current.x = (elasticVelocityRef.current.x + ax) * damping;
        elasticVelocityRef.current.y = (elasticVelocityRef.current.y + ay) * damping;
        
        elasticTranslationRef.current.x += elasticVelocityRef.current.x;
        elasticTranslationRef.current.y += elasticVelocityRef.current.y;
      }

      // --- EARTHQUAKE (SCREEN SHAKE) ---
      ctx.save();
      if (shakeRef.current > 0.05) {
        const sx = (Math.random() - 0.5) * shakeRef.current;
        const sy = (Math.random() - 0.5) * shakeRef.current;
        ctx.translate(sx, sy);
        shakeRef.current *= 0.91; // decay earthquake
      }

      // --- 1. SLOW BACKGROUND STARS DRIFT (Parallax Depth Projection) ---
      bgStarsRef.current.forEach((star) => {
        // Slow z drift to simulate continuous forward travel
        star.z -= star.speed;
        if (star.z < -450) star.z = 450; // Wrap behind camera

        // Project background star coordinates
        const proj = projectPoint(star.x, star.y, star.z);
        if (!proj.behind && proj.x >= 0 && proj.x <= w && proj.y >= 0 && proj.y <= h) {
          const depthAlpha = Math.max(0.05, Math.min(star.alpha, 1 - proj.z / 900));
          ctx.fillStyle = theme === "dark" 
            ? `rgba(232, 221, 195, ${depthAlpha * 0.8})` 
            : `rgba(212, 175, 55, ${depthAlpha * 1.0})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.1, star.size * proj.scale * 0.45), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- 2. GENTLE IDLE AUTO-ROTATION ORBIT ---
      if (!isMouseDownRef.current) {
        rotationRef.current.y += 0.00095; // Continuous orbit rate
        rotationRef.current.x += Math.sin(Date.now() * 0.00015) * 0.0003;
      }

      // --- 3. NODE PHYSICS AND TRACING (90 Consolidation Nodes) ---
      // We process drifting velocity and boundaries
      nodesRef.current.forEach((n) => {
        // Star breathing float mechanics
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        // Soft elastic limits pulling drift back to origin
        const dFromOrigin = Math.hypot(n.x - n.ox, n.y - n.oy, n.z - n.oz);
        if (dFromOrigin > 22) {
          n.vx -= (n.x - n.ox) * 0.0025;
          n.vy -= (n.y - n.oy) * 0.0025;
          n.vz -= (n.z - n.oz) * 0.0025;
        }

        // Project node to screen coordinates
        const proj = projectPoint(n.x, n.y, n.z);
        if (proj.behind) {
          n.targetHover = 0.0;
          n.hoverProgress += (0.0 - n.hoverProgress) * 0.16;
          return;
        }
        const distToCursor = Math.hypot(mousePosRef.current.x - proj.x, mousePosRef.current.y - proj.y);

        // Hover tracking
        // Named nodes are easy to trigger; others require precision
        const hoverThreshold = n.label ? 40 : 15;
        n.targetHover = distToCursor < hoverThreshold ? 1.0 : 0.0;
        // Smooth transition lerp
        n.hoverProgress += (n.targetHover - n.hoverProgress) * 0.16;
      });

      // --- 4. CONSTELLATION CONNECTION LINES (Neural Net) ---
      // OPTIMIZATION: Recalculate 3D proximity list every 2nd frame (every 4th frame on mobile) safely
      const recalculateFreq = isMobile ? 4 : 2;
      if (frameCount % recalculateFreq === 0) {
        const tempConnections: [number, number, number][] = [];
        const limit3d = 92; // connect nodes if under this 3D distance threshold
        const total = nodesRef.current.length;

        for (let i = 0; i < total; i++) {
          const nA = nodesRef.current[i];
          for (let j = i + 1; j < total; j++) {
            const nB = nodesRef.current[j];
            const dist3d = Math.hypot(nA.x - nB.x, nA.y - nB.y, nA.z - nB.z);
            if (dist3d < limit3d) {
              tempConnections.push([i, j, dist3d]);
            }
          }
        }
        connectionCacheRef.current = tempConnections;
      }

      // Render the luminescent neural connection lines from cache
      ctx.lineWidth = 0.85;
      connectionCacheRef.current.forEach(([i, j, dist3d]) => {
        const nA = nodesRef.current[i];
        const nB = nodesRef.current[j];

        const pA = projectPoint(nA.x, nA.y, nA.z);
        const pB = projectPoint(nB.x, nB.y, nB.z);
        if (pA.behind || pB.behind) return;

        // Linear proximity fade-out
        const distFraction = 1 - dist3d / 92;
        let baseAlpha = distFraction * 0.32;

        // Scale opacity according to depth
        const avgZ = (pA.z + pB.z) / 2;
        const depthFade = Math.max(0.12, Math.min(1.0, 1 - avgZ / 500));
        baseAlpha *= depthFade;

        // "Connected lines brighten when hovered!"
        const hoverBonus = Math.max(nA.hoverProgress, nB.hoverProgress);
        
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);

        if (hoverBonus > 0.02) {
          // Glow and brighten
          ctx.strokeStyle = theme === "dark"
            ? `rgba(251, 191, 36, ${baseAlpha + hoverBonus * 0.5})`
            : `rgba(212, 175, 55, ${baseAlpha + hoverBonus * 0.75})`;
          ctx.lineWidth = 0.75 + hoverBonus * 1.5;
        } else {
          ctx.strokeStyle = theme === "dark"
            ? `rgba(201, 168, 76, ${baseAlpha})`
            : `rgba(10, 22, 40, ${baseAlpha * 1.8})`;
          ctx.lineWidth = 0.65;
        }
        ctx.stroke();
      });

      // --- 5. CONDENSATION OF ASTROLOGICAL CIRCLES ---
      // Faint background gold degree orbit markings
      ctx.shadowBlur = 0;
      ctx.strokeStyle = theme === "dark" ? "rgba(201, 168, 76, 0.05)" : "rgba(10, 22, 40, 0.15)";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 165 * zoomRef.current, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 280 * zoomRef.current, 0, Math.PI * 2);
      ctx.stroke();

      // --- 6. SHOCKWAVE GOLD RIPPLES ---
      let activeRipples = ripplesRef.current;
      activeRipples.forEach((rip) => {
        rip.radius += rip.speed;
        rip.alpha = Math.max(0, 1 - rip.radius / rip.maxRadius);

        // Dual golden concentric ripple ring for tech flare
        ctx.shadowBlur = 10;
        ctx.shadowColor = theme === "dark" ? "rgba(223, 186, 107, 0.3)" : "rgba(212, 175, 55, 0.4)";
        ctx.strokeStyle = theme === "dark"
          ? `rgba(201, 168, 76, ${rip.alpha * 0.4})`
          : `rgba(212, 175, 55, ${rip.alpha * 0.75})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = theme === "dark"
          ? `rgba(232, 221, 195, ${rip.alpha * 0.22})`
          : `rgba(10, 22, 40, ${rip.alpha * 0.3})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(0, rip.radius - 20), 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
      // Garbage collect faded rings
      ripplesRef.current = activeRipples.filter((r) => r.alpha > 0.01);

      // --- 7. SORT AND PAINT THE 3D GLOWING CONSTELLATION STAR CORES ---
      const sortedProjected = nodesRef.current
        .map((node, index) => {
          const proj = projectPoint(node.x, node.y, node.z);
          return { original: node, proj, originalIdx: index };
        })
        .filter((item) => !item.proj.behind && item.proj.scale > 0)
        .sort((a, b) => b.proj.z - a.proj.z); // Render back to front for clean coordinate stack sorting

      sortedProjected.forEach(({ original, proj }) => {
        // Skip rendering if behind camera clipping pane
        if (proj.z < -380 || proj.behind) return;

        // Size factor increases 4x on hover flare
        const hProg = original.hoverProgress;
        const finalRadius = Math.max(0.1, original.size * proj.scale * (1.0 + hProg * 3.0));

        // Render soft gold fuzzy atmospheric halos (glow sprite feel - failsafe scale proportion)
        const densityGlow = ctx.createRadialGradient(
          proj.x,
          proj.y,
          finalRadius * 0.1,
          proj.x,
          proj.y,
          finalRadius * (2.8 + hProg * 2.5) // halo swells bigger!
        );

        // Core colors blending to pure white-hot
        const coreAlpha = Math.max(0.2, Math.min(1.0, 1 - proj.z / 420));
        
        if (hProg > 0.02) {
          // Flare white hot
          densityGlow.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
          densityGlow.addColorStop(0.2, theme === "dark" ? `rgba(251, 191, 36, ${coreAlpha})` : `rgba(212, 175, 55, ${coreAlpha})`);
          densityGlow.addColorStop(0.65, theme === "dark" ? `rgba(201, 168, 76, ${coreAlpha * 0.28})` : `rgba(10, 22, 40, ${coreAlpha * 0.45})`);
          densityGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
        } else {
          // Normal warm gold glow halo sprite
          densityGlow.addColorStop(0, `rgba(255, 254, 245, ${coreAlpha * 0.95})`);
          densityGlow.addColorStop(0.28, theme === "dark" ? `rgba(201, 168, 76, ${coreAlpha * 0.72})` : `rgba(212, 175, 55, ${coreAlpha * 0.9})`);
          densityGlow.addColorStop(0.7, theme === "dark" ? `rgba(201, 168, 76, ${coreAlpha * 0.18})` : `rgba(10, 22, 40, ${coreAlpha * 0.35})`);
          densityGlow.addColorStop(1.0, "rgba(0, 0, 0, 0)");
        }

        ctx.fillStyle = densityGlow;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, finalRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // White hot crisp central coordinate star needle point
        ctx.fillStyle = hProg > 0.3 
          ? (theme === "dark" ? "#ffffff" : "#D4AF37") 
          : (theme === "dark" ? `rgba(255, 253, 230, ${coreAlpha})` : `rgba(212, 175, 55, ${coreAlpha})`);
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(1.2, (original.size * 0.45) * proj.scale), 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 8. FLOATING TEXT LABELS OVERLAY (9 Labeled Key-nodes) ---
      // OPTIMIZATION: We recalculate font typography bounds every 3rd frame
      if (frameCount % 3 === 0) {
        const labelCache: any[] = [];
        nodesRef.current.forEach((node) => {
          if (!node.label) return;
          const proj = projectPoint(node.x, node.y, node.z);

          // Render label text only if inside coordinate bounds and in front of camera
          const isNearFront = !proj.behind && proj.z < 300;
          labelCache.push({
            label: node.label.toUpperCase(),
            x: proj.x,
            y: proj.y + (node.size * proj.scale) + 18,
            visible: isNearFront,
            isHovered: node.hoverProgress > 0.45
          });
        });
        labelRenderCacheRef.current = labelCache;
      }

      // Draw optimized labels layout
      labelRenderCacheRef.current.forEach(({ label, x, y, visible, isHovered }) => {
        if (!visible) return;

        // Crisp HUD digital typographic specifications
        ctx.shadowBlur = 0;
        if (isHovered) {
          ctx.fillStyle = theme === "dark" ? "#ffffff" : "#0A1628";
          ctx.font = "bold 11px 'Space Grotesk', system-ui, sans-serif";
          ctx.shadowBlur = theme === "dark" ? 8 : 4;
          ctx.shadowColor = theme === "dark" ? "#C9A84C" : "#D4AF37";
        } else {
          ctx.fillStyle = theme === "dark" ? "rgba(180, 175, 165, 0.75)" : "rgba(10, 22, 40, 0.85)";
          ctx.font = "9.5px 'JetBrains Mono', monospace";
        }
        ctx.textAlign = "center";
        ctx.fillText(label, x, y);
        ctx.shadowBlur = 0;
      });

      // --- DRAW GLOWING RUBBER BAND STRANDS ---
      if (isMouseDownRef.current && dragStartPosRef.current) {
        const startX = dragStartPosRef.current.x;
        const startY = dragStartPosRef.current.y;
        const endX = mousePosRef.current.x;
        const endY = mousePosRef.current.y;

        ctx.save();
        
        // Let's draw layers of rubber bands for a volumetric sci-fi look!
        const pullDist = Math.hypot(endX - startX, endY - startY);
        const tensionRatio = Math.min(1.0, pullDist / 250);
        
        // Outer glow aura
        ctx.strokeStyle = theme === "dark" 
          ? `rgba(251, 191, 36, ${0.15 + tensionRatio * 0.25})` 
          : `rgba(212, 175, 55, ${0.15 + tensionRatio * 0.25})`;
        ctx.lineWidth = 10 + tensionRatio * 6;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Mid tension band
        ctx.strokeStyle = theme === "dark" 
          ? `rgba(201, 168, 76, ${0.4 + tensionRatio * 0.4})` 
          : `rgba(10, 22, 40, ${0.4 + tensionRatio * 0.4})`;
        ctx.lineWidth = 4 + tensionRatio * 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Hot white/golden core chord
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw anchorage nodes at the anchor and pull tips
        ctx.fillStyle = theme === "dark" ? "#C9A84C" : "#D4AF37";
        ctx.beginPath();
        ctx.arc(startX, startY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(endX, endY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Tension ring indicators (concentric ripple sparks along the chord)
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(midX, midY, 4 + Math.sin(Date.now() * 0.02) * 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // --- 9. RENDER EXPLOSION PARTICLES (FIREWORK DIGITAL SPARKS) ---
      let activeExplosions = explosionParticlesRef.current;
      activeExplosions.forEach((p) => {
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        
        // Mild downward gravity-like pulling
        p.vy += 0.05; 
        
        // Frictional deceleration
        p.vx *= 0.96;
        p.vy *= 0.96;
        
        // Fade life
        p.life -= 1;
        p.alpha = Math.max(0, p.life / p.maxLife);
        
        // Sparkle fluctuation
        const finalAlpha = p.type === "spark" 
          ? p.alpha * (0.5 + Math.random() * 0.5) 
          : p.alpha;
          
        ctx.save();
        ctx.shadowBlur = p.type === "circle" ? 8 : 2;
        ctx.shadowColor = p.color;
        
        if (p.type === "circle") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * finalAlpha, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "spark") {
          // Draw velocity-aligned streak line
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * finalAlpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8);
          ctx.stroke();
        } else {
          // Digital glitch pixel
          ctx.fillStyle = p.color;
          const sz = p.size * (0.5 + Math.random() * 0.8) * finalAlpha;
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
        ctx.restore();
      });
      // Garbage collect dead particles
      explosionParticlesRef.current = activeExplosions.filter((p) => p.life > 0);

      // Restore earthquake save context
      ctx.restore();

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animId);
  }, [dims, isMobile, theme]);

  // Clean layout helper: trigger navigation directly from portable list
  const handleMobileNodeTap = (link: string, label: string) => {
    triggerToast(
      `🛰️ MOB-TRANSMITTING VECTOR`,
      `Navigating to: ${label.toUpperCase()}`
    );

    if (link === "#resume") {
      (window as any)._showFullSnapshot?.();
    }

    const docTarget = document.querySelector(link);
    if (docTarget) {
      setTimeout(() => {
        docTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] md:h-[650px] ${theme === "dark" ? "bg-[#030303] border-[#C9A84C]/10 text-[#E8E4DC]" : "bg-[#FAF7F2] border-[#0E1F3D]/20 text-[#0A0B0E]"} border rounded-2xl overflow-hidden shadow-[inset_0_0_80px_rgba(201,168,76,0.03)] group`}
    >
      {/* Astro sci-fi backdrop labeling */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-[#C9A84C]" : "bg-[#B88A44]"} animate-pulse`} />
          <h3 className={`text-[11px] font-black uppercase tracking-[0.35em] ${theme === "dark" ? "text-[#E8D5A3]" : "text-[#0A0B0E]"} font-mono`}>
            Neural Core Constellation v2.0
          </h3>
        </div>
        <p className={`text-[9px] font-mono ${theme === "dark" ? "text-zinc-500" : "text-[#0E1F3D]/70"} mt-1 uppercase tracking-wider`}>
          {isMobile ? "Mobile Mode — Light Orbit Array" : "Desktop 3D Star Map — Rotates on touch + cursor warp"}
        </p>
      </div>

      {/* Futuristic slide-in HUD toast alert */}
      {toast && (
        <div className={`absolute top-5 right-5 z-40 ${theme === "dark" ? "bg-zinc-950/95 border-[#C9A84C]/80" : "bg-[#F4EFE6]/95 border-[#0E1F3D]/50"} border-2 p-3.5 rounded-xl shadow-[0_8px_30px_rgba(184,138,68,0.25)] flex items-start gap-3 backdrop-blur-md animate-slide-in max-w-[280px]`}>
          <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 animate-ping grow-0 shrink-0" />
          <div className="text-left font-sans">
            <h4 className={`text-[10px] uppercase tracking-widest ${theme === "dark" ? "text-[#C9A84C]" : "text-[#8C6527]"} font-black font-mono`}>
              {toast.message}
            </h4>
            <p className={`text-xs mt-1 font-semibold leading-tight font-sans ${theme === "dark" ? "text-white" : "text-[#0A0B0E]"}`}>
              {toast.sub}
            </p>
          </div>
        </div>
      )}

      {/* 3D CANVAS COMPONENT - RUNNING ALWAYS IN BACKGROUND OR COMPONENT FOREGROUND */}
      <canvas
        ref={canvasRef}
        width={dims.width}
        height={dims.height}
        onClick={handleCanvasClick}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing block z-0 touch-none"
      />

      {/* DESKTOP EXCLUSIVE HUD CONTROLS (Only visible on larger screens) */}
      {!isMobile ? (
        <>
          {/* Zoom controls */}
          <div className={`absolute bottom-5 right-5 z-30 flex items-center gap-2 ${theme === "dark" ? "bg-zinc-950/90 border-[#C9A84C]/20" : "bg-[#F4EFE6]/90 border-[#0E1F3D]/25"} border px-3 py-1.5 rounded-lg backdrop-blur-md select-none`}>
            <button
              onClick={handleZoomOut}
              className={`text-[10px] font-mono font-bold ${theme === "dark" ? "text-[#C9A84C] hover:text-white" : "text-[#0E1F3D] hover:text-[#B88A44]"} px-2 py-0.5 rounded transition-colors cursor-pointer`}
              title="Zoom Constellation Out"
            >
              OUT
            </button>
            <span className={`text-[9.5px] font-mono ${theme === "dark" ? "border-r border-l border-zinc-900 text-zinc-400" : "border-r border-l border-[#0E1F3D]/20 text-[#0A0B0E]"} px-3`}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className={`text-[10px] font-mono font-bold ${theme === "dark" ? "text-[#C9A84C] hover:text-white" : "text-[#0E1F3D] hover:text-[#B88A44]"} px-2 py-0.5 rounded transition-colors cursor-pointer`}
              title="Zoom Constellation In"
            >
              IN
            </button>
          </div>

          <div className={`absolute bottom-5 left-5 z-10 pointer-events-none ${theme === "dark" ? "bg-zinc-950/80 border-zinc-900/60" : "bg-[#F4EFE6]/85 border-[#0E1F3D]/20"} px-3 py-1 border rounded-md`}>
            <p className={`text-[9.5px] ${theme === "dark" ? "text-zinc-400" : "text-[#0A0B0E]"} font-mono tracking-wide uppercase`}>
              • <strong className={`${theme === "dark" ? "text-[#C9A84C]" : "text-[#0E1F3D]"} font-bold`}>Drag</strong> to pan • <strong className={`${theme === "dark" ? "text-[#C9A84C]" : "text-[#0E1F3D]"} font-bold`}>Hover</strong> node to flare • <strong className={`${theme === "dark" ? "text-[#C9A84C]" : "text-[#0E1F3D]"} font-bold`}>Click</strong> to warp
            </p>
          </div>
        </>
      ) : (
        /* MOBILE HUD CONTROLLERS - OVERLAYING ACTIVE STARS GRADIENT PORT */
        <div className="absolute inset-x-0 bottom-4 z-30 px-4 pointer-events-none">
          <div className={`${theme === "dark" ? "bg-zinc-950/90 border-[#C9A84C]/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-[#F4EFE6]/95 border-[#0E1F3D]/30 shadow-[0_4px_30px_rgba(14,31,61,0.08)]"} border p-3 rounded-xl backdrop-blur-md max-w-md mx-auto pointer-events-auto`}>
            <p className={`text-[9px] ${theme === "dark" ? "text-[#C9A84C]" : "text-[#0E1F3D]"} font-mono uppercase tracking-[0.2em] text-center mb-2 leading-relaxed font-bold`}>
              🛰️ Orbit Array — Drag Starfield / Tap to Warp
            </p>
            <div className="grid grid-cols-2 gap-1.5 w-full">
              {KEY_INTERACTIVE_NODES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleMobileNodeTap(n.sectionLink, n.label)}
                  className={`${theme === "dark" ? "bg-zinc-900/80 hover:bg-zinc-950 border-[#C9A84C]/15 active:border-[#C9A84C]/60" : "bg-[#FAF7F2] hover:bg-[#F4EFE6] border-[#0E1F3D]/20 active:border-[#B88A44]/60"} border p-2.5 rounded-lg text-left transition-all duration-200 flex flex-col pointer-events-auto cursor-pointer`}
                >
                  <span className={`text-[10px] uppercase font-bold ${theme === "dark" ? "text-[#E8D5A3]" : "text-[#0A0B0E]"} tracking-wider mb-0.5 font-mono line-clamp-1`}>
                    {n.label}
                  </span>
                  <span className={`text-[8px] ${theme === "dark" ? "text-zinc-400" : "text-[#0E1F3D]/70"} font-mono line-clamp-1`}>
                    {n.info}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
