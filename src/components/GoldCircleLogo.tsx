import React from "react";
import { useAssetResolver } from "../utils/assetResolver";

interface GoldCircleLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTextOutside?: boolean;
}

export default function GoldCircleLogo({ 
  size = "md", 
  className = "", 
  showTextOutside = size !== "sm" 
}: GoldCircleLogoProps) {
  const { src: logoSrc, handleError: handleLogoError, hasFailedAll: imgError } = useAssetResolver("logo.png");
  
  // Custom diameter bounds
  const orbSizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-36 h-36"
  };

  const textSizes = {
    sm: "text-[10px] tracking-[0.15em] mt-1",
    md: "text-[11px] tracking-[0.22em] mt-1.5",
    lg: "text-[16px] tracking-[0.25em] mt-2.5",
    xl: "text-[24px] tracking-[0.3em] mt-3.5"
  };

  const selectedOrb = orbSizes[size];
  const selectedText = textSizes[size];

  return (
    <div className={`flex flex-col items-center justify-center shrink-0 ${className} group`}>
      {/* Outer ambient glow container */}
      <div className={`relative ${selectedOrb} rounded-full transition-all duration-500 hover:scale-105`}>
        
        {/* Soft, warm luxury ambient background glow */}
        <div className="absolute inset-[-6px] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.12)_0%,transparent_75%)] blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 3D Gold Metallic Outer Rim Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8B734B] via-[#C9A84C] to-[#E8D5A3] p-[1.5px] shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          
          {/* Inner Glossy Core displaying logo.png with auto rotating animation */}
          <div className="w-full h-full rounded-full bg-[#050608] relative overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <img 
                src={logoSrc} 
                alt="7JN" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover animate-[spin_15s_linear_infinite]"
                onError={handleLogoError}
              />
            ) : (
              /* Fallback glass gradient core if logo.png is missing */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#111318] to-[#010102] text-[#C9A84C] font-sans font-black text-[10px] uppercase tracking-wider">
                👑
              </div>
            )}

            {/* Deep inside dark shadow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

            {/* Realistic Glass Specular Highlight */}
            <div className="absolute top-[8%] left-[10%] w-[35%] h-[18%] rounded-full bg-gradient-to-b from-white/20 to-transparent blur-[1px] transform -rotate-[22deg] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Elegant 7JN Text centered outside below the sphere */}
      {showTextOutside && (
        <span 
          className={`${selectedText} font-sans font-black tracking-[0.25em] bg-gradient-to-r from-white via-[#E8D5A3] to-[#C9A84C] text-transparent bg-clip-text filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] select-none uppercase`}
        >
          7JN
        </span>
      )}
    </div>
  );
}
