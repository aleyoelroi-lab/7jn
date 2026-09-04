import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useAssetResolver } from "../utils/assetResolver";
import { X, Copy, Check, Sparkles, Percent } from "lucide-react";

interface TravellingOrbProps {
  onApplyPromo: (code: string) => void;
  orbCouponUsedCount: number;
}

export default function TravellingOrb({ onApplyPromo, orbCouponUsedCount }: TravellingOrbProps) {
  const { src: logoSrc, handleError: handleLogoError } = useAssetResolver("logo.png");
  const [position, setPosition] = useState({ x: 15, y: 20 });
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Smooth floating movement across the viewport
  useEffect(() => {
    const getRandomCoordinate = () => {
      // Keep boundaries safe so the orb remains on screen (between 10% and 85%)
      const x = 10 + Math.random() * 75;
      const y = 10 + Math.random() * 75;
      setPosition({ x, y });
    };

    getRandomCoordinate();
    const interval = setInterval(getRandomCoordinate, 7000); // changes direction smoothly every 7 seconds
    return () => clearInterval(interval);
  }, []);

  const handleOrbClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Trigger burst confetti from the click coordinates
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x, y },
      colors: ["#DFBA6B", "#FFFDF0", "#E8D5A3", "#8B734B"],
    });

    setShowModal(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("7JNTECH30");
    setCopied(true);
    onApplyPromo("7JNTECH30");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Travelling Orb */}
      <div
        style={{
          left: `${position.x}vw`,
          top: `${position.y}vh`,
          transition: "left 7s ease-in-out, top 7s ease-in-out",
        }}
        onClick={handleOrbClick}
        className="fixed z-50 cursor-pointer select-none pointer-events-auto opacity-35 hover:opacity-100 transition-opacity duration-300 group"
        title="Catch the secret orb!"
      >
        {/* Exact Logo Miniature (10px, 50% smaller, smaller than dancing lights in hologram) */}
        <div className="relative w-2.5 h-2.5 rounded-full">
          {/* Proportional subtle gold ambient glow */}
          <div className="absolute inset-[-2px] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.17)_0%,transparent_75%)] blur-[2px] animate-pulse" />

          {/* 3D Gold Metallic Outer Rim Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8B734B] via-[#C9A84C] to-[#E8D5A3] p-[0.5px] shadow-lg">
            {/* Inner Core */}
            <div className="w-full h-full rounded-full bg-[#050608] relative overflow-hidden flex items-center justify-center">
              <img
                src={logoSrc}
                onError={handleLogoError}
                alt="Mini Logo"
                className="w-full h-full object-cover animate-[spin_10s_linear_infinite]"
                referrerPolicy="no-referrer"
              />
              {/* Deep inner shadow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
              {/* Glass Specular Highlight */}
              <div className="absolute top-[8%] left-[10%] w-[35%] h-[18%] rounded-full bg-gradient-to-b from-white/25 to-transparent blur-[0.5px] transform -rotate-[22deg] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Styled Congrats & Discount Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-1.5 rounded-2xl bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/20 to-zinc-950 shadow-[0_20px_50px_rgba(201,168,76,0.3)] animate-scale-up">
            
            <div className="bg-[#050505] rounded-2xl p-6 relative space-y-5 text-center">
              
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-[#E8D5A3] transition-colors p-1 rounded-lg border border-zinc-900 hover:border-[#DFBA6B]/20 bg-zinc-950 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Icon */}
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#8B734B] to-[#FFFDF0] p-[1.5px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#050608] flex items-center justify-center text-yellow-400">
                  <Percent className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Header Text */}
              <div className="space-y-1">
                <h3 className="text-xl font-black font-display text-white tracking-widest flex items-center justify-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  CONGRATULATIONS!
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  You caught the secret flying orb of 7JN Tech Assist!
                </p>
              </div>

              {/* Coupon Box */}
              <div className="p-4 rounded-xl bg-yellow-500/5 border border-[#DFBA6B]/20 space-y-2">
                <span className="text-[10px] font-mono font-extrabold text-[#DFBA6B] uppercase tracking-[0.2em] block">
                  SECRET CODE UNLOCKED
                </span>
                
                <div className="flex items-center justify-between gap-3 bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 select-all font-mono font-black text-white text-lg tracking-wider">
                  <span>7JNTECH30</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded bg-[#DFBA6B] hover:bg-[#FFFDF0] text-black hover:scale-105 transition-all flex items-center justify-center cursor-pointer font-sans text-xs font-bold gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Applied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy & Apply
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[14px] text-yellow-400 font-sans font-black tracking-wide mt-2">
                  "limited 7jntech coupon! less 30%"
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] hover:from-[#FFFDF0] hover:to-[#FFFFFF] text-black font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
              >
                Awesome, thank you!
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
