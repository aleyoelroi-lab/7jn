import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import HologramCanvas from "./components/HologramCanvas";
import ServicesSection from "./components/ServicesSection";
import ResumeSection from "./components/ResumeSection";
import BookingForm from "./components/BookingForm";
import OperatorConsole from "./components/OperatorConsole";
import DashboardMenu from "./components/DashboardMenu";
import GoldCircleLogo from "./components/GoldCircleLogo";
import MagneticGroundingEffect from "./components/MagneticGroundingEffect";
import FirefliesBackground from "./components/FirefliesBackground";
import TravellingOrb from "./components/TravellingOrb";
import { useAssetResolver } from "./utils/assetResolver";
import { PACKAGES_DATA, BLOG_DATA, MOBILE_PACKAGES_DATA, FAQ_DATA } from "./data";
import { 
  Building2, Briefcase, Award, GraduationCap, ShieldCheck, Cpu, 
  Sparkles, Terminal, Layers, Star, Info, Menu, X, ArrowUpRight, 
  ChevronDown, ChevronUp,
  Github, Send, MessagesSquare, Instagram, ShieldAlert, BadgeCheck,
  Sun, Moon, Calendar, Clock, Tag, Percent, CheckSquare, Square
} from "lucide-react";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [showFullCV, setShowFullCV] = useState(false);
  const { src: profileSrc, handleError: handleProfileError, hasFailedAll: profileImgError } = useAssetResolver("profile.png");

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light";
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Listen for system theme changes when no manual override exists
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (!stored) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const [currency, setCurrency] = useState<"USD" | "PHP">("USD");
  const [promoInput, setPromoInput] = useState("");
  const [activePromo, setActivePromo] = useState<"7jntechKarla" | "JS7jntech" | "7JNTECH30" | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [packageTab, setPackageTab] = useState<"web" | "mobile">("web");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("elite-command");
  const [couponUsedCount, setCouponUsedCount] = useState<number>(0);
  const [orbCouponUsedCount, setOrbCouponUsedCount] = useState<number>(0);
  const [showPromoPills, setShowPromoPills] = useState<boolean>(false);
  const [prefillNote, setPrefillNote] = useState<string>("");
  const [prefillService, setPrefillService] = useState<string>("");

  useEffect(() => {
    // Listen to coupon statistics in real-time from Firestore
    const path = "stats/coupons";
    const unsubscribe = onSnapshot(doc(db, "stats", "coupons"), (docSnap) => {
      if (docSnap.exists()) {
        setCouponUsedCount(docSnap.data().usedCount || 0);
      } else {
        // Initialize stats if not present
        setDoc(doc(db, "stats", "coupons"), { usedCount: 0 }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, path);
        });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Listen to orb coupon statistics in real-time from Firestore
    const path = "stats/orb_coupon";
    const unsubscribe = onSnapshot(doc(db, "stats", "orb_coupon"), (docSnap) => {
      if (docSnap.exists()) {
        setOrbCouponUsedCount(docSnap.data().usedCount || 0);
      } else {
        // Initialize stats if not present
        setDoc(doc(db, "stats", "orb_coupon"), { usedCount: 0 }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, path);
        });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    });
    return () => unsubscribe();
  }, []);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply !== undefined ? codeToApply : promoInput).trim();
    
    // Check orb coupon
    if (
      code.toLowerCase() === "7jntech30" ||
      code.toLowerCase() === "7jntech coupon" ||
      code.toLowerCase() === "7jntech coupon! less 30%" ||
      code.toLowerCase() === "limited 7jntech coupon! less 30%"
    ) {
      if (orbCouponUsedCount >= 3) {
        setPromoError("This special hidden orb coupon code has reached its maximum usage limit of 3 times this month.");
        setPromoSuccess("");
        setActivePromo(null);
        return;
      }
      setActivePromo("7JNTECH30");
      setPromoError("");
      setPromoSuccess("Success! Hidden Orb Coupon '7JNTECH30' applied. 30% discount activated.");
      return;
    }

    if (couponUsedCount >= 7 && (code.toLowerCase() === "7jntechkarla" || code.toLowerCase() === "js7jntech")) {
      setPromoError("This coupon code is no longer available (usage limit reached).");
      setPromoSuccess("");
      setActivePromo(null);
      return;
    }

    if (code.toLowerCase() === "7jntechkarla") {
      setActivePromo("7jntechKarla");
      setPromoError("");
      setPromoSuccess("Success! Code '7jntechKarla' applied. 20% discount activated.");
    } else if (code.toLowerCase() === "js7jntech") {
      setActivePromo("JS7jntech");
      setPromoError("");
      setPromoSuccess("Success! VIP Code 'JS7jntech' applied. 30% discount activated.");
    } else if (code === "") {
      setActivePromo(null);
      setPromoError("");
      setPromoSuccess("");
    } else {
      setPromoError("Invalid promo code. Please try again!");
      setPromoSuccess("");
    }
  };

  const getDisplayPrice = (basePriceUSD: number) => {
    let discountFactor = 1;
    if (activePromo === "7jntechKarla") discountFactor = 0.8;
    else if (activePromo === "JS7jntech") discountFactor = 0.7;
    else if (activePromo === "7JNTECH30") discountFactor = 0.7;

    const discountedUSD = basePriceUSD * discountFactor;

    if (currency === "PHP") {
      const pricePHP = Math.round(basePriceUSD * 58 * 0.95);
      const discountedPHP = Math.round(discountedUSD * 58 * 0.95);
      return {
        original: `₱${pricePHP.toLocaleString()}`,
        current: `₱${discountedPHP.toLocaleString()}`,
        hasDiscount: discountFactor < 1,
        rawCurrent: discountedPHP
      };
    } else {
      return {
        original: `$${basePriceUSD.toLocaleString()}`,
        current: `$${Math.round(discountedUSD).toLocaleString()}`,
        hasDiscount: discountFactor < 1,
        rawCurrent: Math.round(discountedUSD)
      };
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  useEffect(() => {
    if (packageTab === "web") {
      setSelectedPackageId("elite-command");
    } else {
      setSelectedPackageId("native-app");
    }
  }, [packageTab]);

  // Compile other settings, profiles, and QR codes into the raw downloaded portable static HTML file
  const handleDownloadHtml = async (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/portable_website.html");
      if (!response.ok) throw new Error("Could not load local portable_website.html static package file.");
      let htmlText = await response.text();

      // Create downloadable blob
      const blob = new Blob([htmlText], { type: "text/html;charset=utf-8" });
      const dlUrl = URL.createObjectURL(blob);
      const downloadElement = document.createElement("a");
      downloadElement.href = dlUrl;
      downloadElement.download = "7JN_Tech_Assist_Portable.html";
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      URL.revokeObjectURL(dlUrl);

      alert("🎉 PORTABLE PORTFOLIO COMPLETED!\n\nThe single-file static HTML website has been downloaded successfully. Place logo.png, profile.png, and qr.png in the same directory to load custom graphics.");
    } catch (err: any) {
      console.error("HTML packaging construction error details:", err);
      // Fallback redirect 
      const link = document.createElement("a");
      link.href = "/portable_website.html";
      link.download = "portable_website.html";
      link.click();
    }
  };

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const scrollToSection = (id: string) => {
    if (id === "#resume") {
      setShowSnapshot(true);
      setShowFullCV(true);
    }
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#141414] text-[#E8E4DC]" : "bg-[#FAF7F2] text-[#0A0B0E]"} font-sans selection:bg-[#B88A44] selection:text-white relative overflow-x-hidden transition-colors duration-500`}>
      
      {/* Slow Travelling Fireflies Background */}
      <FirefliesBackground theme={theme} />

      {/* Interactive Magnetic Bio-Grounding Electrical Sparks Overlay */}
      <MagneticGroundingEffect />

      {/* Dynamic Sci-Fi Overlay Elements */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-transparent" />
      
      {/* Classic Horizontal Scanlines */}
      <div className={`fixed inset-0 pointer-events-none z-[11] ${theme === "dark" ? "opacity-[0.015]" : "opacity-[0.008]"} bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fbbf24_2px,#fbbf24_4px)]`} />

      {/* Floating CTA Messenger Button */}
      <a 
        href="https://m.me/7JStech" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full shadow-[0_4px_30px_rgba(59,130,246,0.4)] hover:scale-110 active:scale-95 transition-transform duration-300 flex items-center justify-center cursor-pointer group print:hidden"
        title="Chat instantly on FB Messenger"
      >
        <MessagesSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
      </a>

      {/* Premium responsive Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020408]/85 backdrop-blur-md border-b border-yellow-500/10 px-6 py-4 flex items-center justify-between transition-all duration-300 print:hidden">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("#home")}>
          <GoldCircleLogo size="sm" />
          <span className="text-sm font-black tracking-[0.2em] font-display text-white">
            7JN <span className="text-yellow-400">TECH</span> ASSIST
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest font-bold text-zinc-400 uppercase">
          <li>
            <button onClick={() => scrollToSection("#home")} className="hover:text-yellow-400 cursor-pointer transition-colors">
              Home
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("#hologram")} className="hover:text-yellow-400 cursor-pointer transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Hologram API
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("#services")} className="hover:text-yellow-400 cursor-pointer transition-colors">
              Services
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("#resume")} className="hover:text-yellow-400 cursor-pointer transition-colors">
              Credentials
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("#packages")} className="hover:text-yellow-400 cursor-pointer transition-colors">
              Rates
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("#schedule")} className="hover:text-yellow-400 cursor-pointer transition-colors text-yellow-400 hover:text-white">
              Schedule
            </button>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle (visible on all screens) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#DFBA6B]/30 hover:border-[#DFBA6B] text-[#DFBA6B] hover:text-[#FFF] transition-all bg-[#DFBA6B]/5 active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
            title={theme === "dark" ? "Switch to Cream White & Dark Blue Mode" : "Switch to Deep Space Mode"}
            aria-label="Theme Toggle"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0E1F3D]" />}
          </button>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => scrollToSection("#schedule")}
              className="text-[10px] uppercase font-bold text-black bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] hover:from-[#FFFDF0] hover:to-[#FFFFFF] font-sans tracking-widest px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(254,240,138,0.2)] hover:shadow-[0_0_20px_rgba(254,240,138,0.45)] transition-all active:scale-95 cursor-pointer"
            >
              Create Ticket
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-yellow-500 hover:text-yellow-400 transition-colors focus:outline-none p-1 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#020408] border-b border-yellow-500/20 p-6 flex flex-col gap-4 animate-[slideDown_0.2s_ease-out_forwards] shadow-2xl z-50">
            <button 
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }} 
              className="text-left text-xs uppercase text-yellow-400 hover:text-yellow-300 tracking-wider flex items-center gap-2 pb-2 border-b border-yellow-500/10"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0E1F3D]" />}
              <span>{theme === "dark" ? "Switch to Cream White" : "Switch to Deep Space"}</span>
            </button>
            <button onClick={() => scrollToSection("#home")} className="text-left text-xs uppercase text-zinc-200 hover:text-yellow-400 tracking-wider">Home</button>
            <button onClick={() => scrollToSection("#hologram")} className="text-left text-xs uppercase text-yellow-400 hover:text-yellow-300 tracking-wider flex items-center gap-1">★ Interactive Constellation</button>
            <button onClick={() => scrollToSection("#services")} className="text-left text-xs uppercase text-zinc-200 hover:text-yellow-400 tracking-wider">Core Services</button>
            <button onClick={() => scrollToSection("#resume")} className="text-left text-xs uppercase text-zinc-200 hover:text-yellow-400 tracking-wider">Jeddah's HTML Resume</button>
            <button onClick={() => scrollToSection("#packages")} className="text-left text-xs uppercase text-zinc-200 hover:text-yellow-400 tracking-wider">Service packages</button>
            <button onClick={() => scrollToSection("#schedule")} className="text-left text-xs uppercase text-zinc-200 hover:text-yellow-400 tracking-wider">Scheduler Form</button>
            <button onClick={async () => {
              // Scroll to schedule section (equivalent to original placeholder navigation)
              scrollToSection("#schedule");
            }} className="text-left text-xs uppercase text-zinc-200 hover:text-yellow-400 tracking-wider">Create ticket</button>
          </div>
        )}
      </nav>

      {/* Hero section */}
      <header id="home" className="relative pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-12 gap-12 items-center min-h-[90vh]">
        
        {/* Subtitle credentials column */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-mono font-medium tracking-widest text-yellow-400 uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" /> Active Operations & Freelance Intake
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-display tracking-normal text-white leading-tight">
            JS Pait (Jeys) <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF0] via-[#EAD890] to-[#DFBA6B] font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl block mt-1">
              Website Developer &amp; Virtual Tech Assistant
            </span>
          </h1>

          {/* Scripture Addition: James 1:9-10 */}
          <div className="border-l-2 border-[#DFBA6B]/30 pl-4 py-1.5 text-left my-4 max-w-xl">
            <p className="text-[11px] italic text-[#E8D5A3]/90 font-sans leading-relaxed">
              "Believers in humble circumstances ought to take pride in their high position. But the rich should take pride in their humiliation—since they will pass away like a wild flower."
            </p>
            <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-zinc-500 block mt-1">James 1:9-10 -</span>
          </div>

          <p className="text-xs md:text-sm lg:text-base text-zinc-400 font-mono leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Fix business bottlenecks and optimize workflow loops with professional logical design. 
            I bridge mortgage model diagnostics with customized automation solutions—perfecting 
            corporate security, SEO performance, systems queues, and beautiful code frameworks.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => scrollToSection("#schedule")}
              className="px-6 py-3 bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] hover:from-[#FFFDF0] hover:to-[#FFFFFF] text-black font-sans font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-[0_4px_25px_rgba(254,240,138,0.3)] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              Book a Consultation →
            </button>
            <button 
              onClick={() => scrollToSection("#services")}
              className="px-6 py-3 bg-zinc-950 border border-yellow-500/20 hover:border-yellow-400 text-yellow-400 hover:text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              Collapsible Services
            </button>
          </div>

          {/* Core Commitments List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-900 text-left">
            <div>
              <div className="text-xs font-bold text-white font-sans flex items-center gap-1">🛡️ Security First</div>
              <div className="text-[10px] text-zinc-500 mt-1">MFA & Vault standards</div>
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans flex items-center gap-1">📂 PDF Resume</div>
              <div className="text-[10px] text-zinc-500 mt-1">Ready to print below</div>
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans flex items-center gap-1">🔧 1-Mo Warranty</div>
              <div className="text-[10px] text-zinc-500 mt-1">Included in work</div>
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans flex items-center gap-1">⚙️ Automation</div>
              <div className="text-[10px] text-zinc-500 mt-1">Alteryx & Zapier pipeline</div>
            </div>
          </div>
        </div>

        {/* Jeddah's Portrait Photo Container */}
        <div className="lg:col-span-5 w-full max-w-sm mx-auto">
          <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/20 to-zinc-950 shadow-[0_20px_50px_rgba(201,168,76,0.15)] group">
            
            {/* Background glowing accents */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#C9A84C] to-transparent opacity-10 group-hover:opacity-30 blur-2xl transition duration-500" />
            
            <div className="bg-[#050505] rounded-2xl overflow-hidden p-4 relative space-y-4">
              {/* Picture view */}
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950 relative select-none transition-all duration-300">
                
                {/* Advanced Face Enhancement / Scanner animation */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-200 to-transparent shadow-[0_0_12px_#C9A84C] animate-[scan_4s_ease-in-out_infinite] z-20 pointer-events-none" />

                {/* Target Corner brackets/markers for high-tech classy diagnostic enhancement */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C9A84C]/60 z-20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C9A84C]/60 z-20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C9A84C]/60 z-20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C9A84C]/60 z-20 pointer-events-none" />

                {/* Face recognition targeting square */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-dashed border-[#C9A84C]/25 rounded-lg pointer-events-none z-10 animate-pulse flex items-center justify-center">
                  <span className="text-[8px] font-mono font-bold text-[#E8D5A3] uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded">
                    ENHANCED VOICE & DATA PORT
                  </span>
                </div>

                {/* Embedded Jeddah's profile image */}
                {profileImgError ? (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-[#1C1917] to-zinc-950 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-3xl filter drop-shadow-[0_2px_10px_rgba(201,168,76,0.3)]">👑</span>
                    <span className="text-xs font-sans font-black tracking-widest text-[#E8D5A3] mt-2">JS PAIT (JEYS)</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase mt-1">Founder / Technical Lead</span>
                  </div>
                ) : (
                  <img 
                    src={profileSrc} 
                    onError={handleProfileError} 
                    alt="JS Pait (Jeys)"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Discreet ABOUT trigger right below photo as requested */}
              <div className="text-left py-1.5 border-t border-zinc-900/60">
                <span className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-[0.25em] font-mono block mb-1">
                  ABOUT
                </span>
                <button
                  onClick={() => {
                    setShowSnapshot(true);
                    setTimeout(() => {
                      document.getElementById("snapshot-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }}
                  className="text-[11px] text-[#9A958D] hover:text-[#E8D5A3] transition-colors duration-300 font-sans tracking-wide text-left cursor-pointer hover:underline flex items-center justify-between w-full"
                >
                  <span>Founder's credentials available upon request →</span>
                </button>
                {/* Scripture Addition: James 1:12 */}
                <div className="mt-2 pt-2 border-t border-zinc-900/40 text-[10px] leading-relaxed text-zinc-500 italic">
                  "Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life that the Lord has promised to those who love him."
                  <span className="block text-[9px] uppercase tracking-widest font-mono text-[#C9A84C] mt-1 not-italic">James 1:12</span>
                </div>
              </div>

              {/* Subtitles inside hero section card */}
              <div className="space-y-1 text-center pt-1 border-t border-zinc-900/60">
                <div className="text-sm font-black text-white font-sans tracking-wider uppercase">
                  JS PAIT (JEYS)
                </div>
                <div className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-wider font-mono">
                  Full Stack Data Analyst & Technical Founder
                </div>
                <div className="pt-2 flex justify-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-900 font-medium">
                    🏆 VP Mortgage Award
                  </span>
                  <span className="text-[9px] font-mono bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-900 font-medium">
                    🛠️ Alteryx Green Belt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* HOLOGRAM INTERACTIVE SECTION */}
      <section id="hologram" className="py-16 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-display text-white tracking-tight uppercase">
            CONSTELATION HOLOGRAM BACKGROUND
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 font-mono mt-3 leading-relaxed">
            Drag the background below in 3D/4D workspace. Hover star coordinates to access links, 
            or click on coordinates to connect custom cords (wires) and trigger sparkly golden explosion effects.
          </p>
        </div>

        <HologramCanvas theme={theme} />
      </section>

      {/* COLLAPSIBLE SERVICES ACCORDION DIRECTORY */}
      <section id="services" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 scroll-mt-20">
        <ServicesSection />
      </section>

      {/* CLIENT TESTIMONIAL STORIES */}
      <section id="testimonials" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-extrabold text-yellow-400 tracking-[0.25em] font-sans">
            Client Stories
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">
            WHAT CLIENTS SAY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Testimonial Elena */}
          <div className="bg-zinc-950/70 border border-yellow-500/10 hover:border-yellow-400/20 p-6 rounded-2xl shadow-xl space-y-4 group transition-all duration-300">
            <div className="flex gap-1 text-yellow-400">
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs md:text-sm font-mono text-zinc-300 leading-relaxed italic">
              "The 1-month free maintenance gave us peace of mind to try the service risk-free. Two months later, we upgraded to Enterprise. Jeydah of 7jntech is now an extension of our team."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-zinc-900">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DFBA6B] to-[#FFFDF0] text-black flex items-center justify-center font-bold text-xs font-sans">
                EW
              </div>
              <div>
                <div className="text-xs font-bold text-white font-sans">Elena W.</div>
                <div className="text-[10px] text-zinc-500 font-mono">COO, ScaleUp Ventures</div>
              </div>
            </div>
          </div>

          {/* Testimonial Karla */}
          <div className="bg-zinc-950/70 border border-yellow-500/10 hover:border-yellow-400/20 p-6 rounded-2xl shadow-xl space-y-4 group transition-all duration-300">
            <div className="flex gap-1 text-yellow-400">
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
              <Star className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs md:text-sm font-mono text-zinc-300 leading-relaxed italic">
              "Jeydah of 7jntech optimized our website with a complete overhaul and included 1 month of free maintenance. Our appointment bookings increased by 40% within the first two weeks. The attention to detail and ongoing support made all the difference for our dental practice."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-zinc-900">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DFBA6B] to-[#FFFDF0] text-black flex items-center justify-center font-bold text-xs font-sans">
                KU
              </div>
              <div>
                <div className="text-xs font-bold text-white font-sans">Dr. Karla U.</div>
                <div className="text-[10px] text-zinc-500 font-mono">Mint Dental Group | Pasig</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTMENT PACKAGE CARDS */}
      <section id="packages" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-extrabold text-yellow-400 tracking-[0.25em] font-sans">
            Rates & Standards
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">
            SERVICE INVESTMENT PACKAGES
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 font-mono mt-2 max-w-xl mx-auto">
            {packageTab === "web" 
              ? "Clear up-front pricing. Every package standardly includes complimentary SEO setup and exactly 1-month of operational tracking."
              : "Full-scale mobile design, native APIs integration, and deployment to official app marketplaces or optimized PWA conversions."
            }
          </p>
        </div>

        {/* Package Tab Selector */}
        <div className="flex justify-center mb-10">
          <div className="bg-zinc-950 border border-zinc-900 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => setPackageTab("web")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer ${
                packageTab === "web"
                  ? "bg-gradient-to-r from-[#DFBA6B] to-[#FFFDF0] text-black shadow font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              Web Development Packages
            </button>
            <button
              type="button"
              onClick={() => setPackageTab("mobile")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer ${
                packageTab === "mobile"
                  ? "bg-gradient-to-r from-[#DFBA6B] to-[#FFFDF0] text-black shadow font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Mobile Development Packages
            </button>
          </div>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="max-w-4xl mx-auto mb-12 bg-zinc-950/80 border border-yellow-500/15 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Currency Switcher */}
          <div className="flex flex-col items-center md:items-start gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-extrabold text-zinc-400 uppercase tracking-widest">
              Active Currency Rate
            </span>
            <div className="bg-zinc-905 border border-zinc-900 p-1 rounded-xl flex items-center gap-1">
              <button 
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-all uppercase cursor-pointer ${
                  currency === "USD" 
                    ? "bg-gradient-to-r from-[#DFBA6B] to-[#FFFDF0] text-black shadow font-black" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button 
                type="button"
                onClick={() => setCurrency("PHP")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-all uppercase cursor-pointer ${
                  currency === "PHP" 
                    ? "bg-gradient-to-r from-[#DFBA6B] to-[#FFFDF0] text-black shadow font-black" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                PHP (₱)
              </button>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 text-center md:text-left">
              * Localized conversion: 1 USD = 58 PHP (discreet 5% regional discount applied)
            </span>
          </div>

          {/* Promocode Controller */}
          <div className="flex-1 w-full max-w-md flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-extrabold text-zinc-400 uppercase tracking-widest text-center md:text-left">
              Activate Promo Discount Code
            </span>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder={couponUsedCount >= 7 ? "Coupons limit reached" : "Enter code (e.g. 7jntechKarla)"}
                  disabled={couponUsedCount >= 7}
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    if (e.target.value === "") {
                      setActivePromo(null);
                      setPromoSuccess("");
                      setPromoError("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyPromo();
                    }
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-400 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all font-mono disabled:opacity-50"
                />
              </div>
              <button 
                type="button"
                onClick={() => handleApplyPromo()}
                disabled={couponUsedCount >= 7}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 hover:text-yellow-300 border border-zinc-850 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>

            {/* Quick Promo Pills */}
            {couponUsedCount < 7 && (
              <div className="mt-2 text-center md:text-left">
                {!showPromoPills ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoPills(true)}
                    className="text-[10px] font-mono text-zinc-500 hover:text-yellow-400 transition-colors cursor-pointer"
                  >
                    ⚙ Reveal Event-specific Promo Codes
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start animate-fade-in">
                    <span className="text-[9px] font-mono text-zinc-500 mr-1">Event coupons:</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setPromoInput("7jntechKarla");
                        handleApplyPromo("7jntechKarla");
                      }}
                      className="text-[9px] font-mono text-yellow-400/80 bg-yellow-400/5 px-2 py-0.5 rounded border border-yellow-400/10 hover:border-yellow-400/30 transition-all cursor-pointer"
                    >
                      7jntechKarla (-20%)
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setPromoInput("JS7jntech");
                        handleApplyPromo("JS7jntech");
                      }}
                      className="text-[9px] font-mono text-yellow-400/80 bg-yellow-400/5 px-2 py-0.5 rounded border border-yellow-400/10 hover:border-yellow-400/30 transition-all cursor-pointer"
                    >
                      JS7jntech (-30%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPromoPills(false)}
                      className="text-[9px] font-mono text-red-400/80 hover:text-red-300 ml-1 cursor-pointer"
                    >
                      [Hide]
                    </button>
                  </div>
                )}
              </div>
            )}
            {couponUsedCount >= 7 && (
              <span className="text-[9px] font-mono text-yellow-500/80 italic mt-1 text-center md:text-left">
                ✦ Karla and 7jntech promo coupons are no longer active (7 usages limit reached).
              </span>
            )}

            {promoError && (
              <span className="text-[10px] font-mono text-red-400 font-medium mt-1">
                ⚠ {promoError}
              </span>
            )}
            {promoSuccess && (
              <span className="text-[10px] font-mono text-emerald-400 font-medium flex items-center gap-1 mt-1">
                ✓ {promoSuccess}
              </span>
            )}
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(packageTab === "web" ? PACKAGES_DATA : MOBILE_PACKAGES_DATA).map((p) => {
            const priceInfo = getDisplayPrice(Number(p.price));
            const isSelected = selectedPackageId === p.id;
            return (
              <div 
                key={p.id}
                onClick={() => setSelectedPackageId(p.id)}
                className={`bg-zinc-950/70 rounded-2xl p-6 md:p-8 flex flex-col justify-between border relative group overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-yellow-400 shadow-[0_4px_30px_rgba(254,240,138,0.15)] bg-gradient-to-b from-yellow-400/10 to-zinc-950/80"
                    : p.featured 
                      ? "border-yellow-400/60 shadow-[0_4px_30px_rgba(254,240,138,0.1)] bg-gradient-to-b from-yellow-400/5 to-zinc-950/70 animate-[pulse_6s_infinite]" 
                      : "border-yellow-500/10 hover:border-yellow-400/30"
                }`}
              >
                {p.featured && (
                  <div className="absolute top-0 right-0 left-0 text-center py-1 bg-gradient-to-r from-[#DFBA6B] to-[#FFFDF0] text-[10px] font-sans font-bold text-black uppercase tracking-wider">
                    Highly Requested Tier
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-mono font-bold uppercase tracking-[0.15em] text-yellow-400">
                      {p.name}
                    </div>
                    {priceInfo.hasDiscount && (
                      <span className="text-[9px] font-mono font-bold text-black bg-gradient-to-r from-[#DFBA6B] to-[#EAD890] px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <Percent className="w-2.5 h-2.5" /> Promo Applied
                      </span>
                    )}
                  </div>

                  {/* Project Timeline Badge */}
                  {p.timeline && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
                      <span>Timeline: <strong className="text-white">{p.timeline}</strong></span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1.5 text-white flex-wrap">
                      {priceInfo.hasDiscount && (
                        <span className="text-sm line-through text-zinc-500 font-mono">
                          {priceInfo.original}
                        </span>
                      )}
                      <span className="text-3xl font-black font-display text-white">
                        {priceInfo.current}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono italic ml-1">{p.priceNote}</span>
                    </div>
                  </div>

                  {/* Scope of Deliverable */}
                  {p.scope && (
                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-900/80 leading-relaxed space-y-1">
                      <span className="text-[9px] uppercase font-bold text-yellow-400 tracking-wider block font-sans">Scope of Deliverable</span>
                      <p className="text-zinc-300">{p.scope}</p>
                    </div>
                  )}

                  <div className="text-[11px] text-zinc-500 font-mono leading-relaxed py-2 border-y border-zinc-900">
                    {p.note}
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="text-xs font-mono text-zinc-300 flex items-start gap-1.5 leading-snug">
                        <span className="text-yellow-400 font-bold select-none text-[11px]">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Deployment Strategy */}
                  {p.deployment && (
                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900/50 leading-relaxed space-y-1">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block font-sans">Deployment strategy</span>
                      <p className="text-zinc-300">{p.deployment}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackageId(p.id);
                      // Trigger DOM prefiller
                      setTimeout(() => {
                        const textarea = document.querySelector('textarea[placeholder*="Zendesk"]') as HTMLTextAreaElement;
                        if (textarea) {
                          textarea.value = `I am interested in configuring the ${p.name} package. Please include the following: ${p.name} core services, active currency: ${currency}, promo code: ${activePromo || "None"}. ${selectedAddons.length > 0 ? "Add-on Services: " + selectedAddons.map(id => {
                            const add = [
                              { id: "retainer", name: "Maintenance & Support Retainer (monthly)" },
                              { id: "copywriting", name: "Content Creation & Copywriting" },
                              { id: "social", name: "Social Media Integration" },
                              { id: "email", name: "Email Marketing Setup" }
                            ].find(a => a.id === id);
                            return add ? add.name : id;
                          }).join(", ") : ""}`;
                          const event = new Event('input', { bubbles: true });
                          textarea.dispatchEvent(event);
                        }
                        
                        const radio = document.querySelector('input[type="radio"][value="Website Developer"]') as HTMLInputElement;
                        if (radio) {
                          radio.click();
                        }
                      }, 100);

                      scrollToSection("#schedule");
                    }}
                    className={`w-full py-2.5 font-sans font-bold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer active:scale-95 ${
                      isSelected 
                        ? "bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] text-black shadow-md font-black" 
                        : p.featured 
                          ? "bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] text-black hover:from-[#FFFDF0] hover:to-[#FFFFFF] shadow-md" 
                          : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-yellow-400/30"
                    }`}
                  >
                    Select & Configure
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ADD-ON SERVICES SECTION */}
        <div className="mt-16 border-t border-zinc-900 pt-12">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-extrabold text-yellow-400 tracking-[0.25em] font-sans">
              Separate Customizations
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-display text-white mt-1">
              ADD-ON SERVICES
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Can be dynamically added to any select package above for peak operational coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { id: "retainer", name: "Maintenance & Support Retainer (monthly)", priceUSD: 149, note: "Keep systems optimized with monthly code audits & bug fixes." },
              { id: "copywriting", name: "Content Creation & Copywriting", priceUSD: 299, note: "Professional copy matching your brand voice for pages/articles." },
              { id: "social", name: "Social Media Integration", priceUSD: 199, note: "Dynamic feeds, automated posting setups, and analytics triggers." },
              { id: "email", name: "Email Marketing Setup", priceUSD: 249, note: "Autoresponder pipelines, template design, and subscriber forms." }
            ].map((add) => {
              const isSelected = selectedAddons.includes(add.id);
              const priceDetails = getDisplayPrice(add.priceUSD);
              return (
                <div 
                  key={add.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedAddons(selectedAddons.filter((id) => id !== add.id));
                    } else {
                      setSelectedAddons([...selectedAddons, add.id]);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                    isSelected 
                      ? "border-yellow-400 bg-yellow-400/5 shadow-[0_2px_15px_rgba(254,240,138,0.05)]" 
                      : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800"
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white font-sans">{add.name}</span>
                      <span className="text-xs font-mono font-extrabold text-yellow-400 shrink-0">
                        +{priceDetails.current}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">{add.note}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE CONFIGURATION BRIEFING CARD */}
          {(() => {
            const activeSelectedPackage = [...PACKAGES_DATA, ...MOBILE_PACKAGES_DATA].find(pk => pk.id === selectedPackageId) || PACKAGES_DATA[1];
            const basePrice = Number(activeSelectedPackage.price);
            const totalUSD = (basePrice + selectedAddons.reduce((sum, id) => {
              const adds = [
                { id: "retainer", priceUSD: 149 },
                { id: "copywriting", priceUSD: 299 },
                { id: "social", priceUSD: 199 },
                { id: "email", priceUSD: 249 }
              ];
              const found = adds.find(a => a.id === id);
              return sum + (found ? found.priceUSD : 0);
            }, 0)) * (activePromo === "7jntechKarla" ? 0.8 : activePromo === "JS7jntech" ? 0.7 : 1);

            return (
              <div className="max-w-xl mx-auto mt-8 bg-zinc-950/90 border border-yellow-400/20 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
                <h4 className="text-[11px] font-mono font-extrabold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                  <Terminal className="w-3.5 h-3.5 animate-pulse" /> Live Scoping Configuration
                </h4>

                <div className="space-y-2 text-xs font-mono text-zinc-300">
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span>Selected Package:</span>
                    <span className="text-[#DFBA6B] font-bold uppercase">{activeSelectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span>Select Currency:</span>
                    <span className="text-white font-bold">{currency}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span>Active Discount:</span>
                    <span className={`${activePromo ? "text-emerald-400 font-bold" : "text-zinc-500"}`}>
                      {activePromo ? `${activePromo === "7jntechKarla" ? "20%" : "30%"} Off` : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span>Selected Add-ons:</span>
                    <span className="text-white text-right font-semibold">
                      {selectedAddons.length > 0 
                        ? `${selectedAddons.length} Selected` 
                        : "None"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between flex-wrap gap-4">
                  <div className="text-xs font-mono">
                    <span className="text-zinc-400">Project Estimate Subtotal:</span>
                    <div className="text-xl font-bold text-white font-sans mt-0.5">
                      {currency === "PHP" ? "₱" : "$"}
                      {Math.round(totalUSD * (currency === "PHP" ? (58 * 0.95) : 1)).toLocaleString()}
                    </div>
                    <span className="text-[9px] text-zinc-500">*Based on selected {activeSelectedPackage.name} package</span>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      setTimeout(() => {
                        const textarea = document.querySelector('textarea[placeholder*="Zendesk"]') as HTMLTextAreaElement;
                        if (textarea) {
                          textarea.value = `I am interested in configuring the ${activeSelectedPackage.name} package. Please include the following: ${activeSelectedPackage.name} core services, active currency: ${currency}, promo code applied: ${activePromo || "None"}. ${selectedAddons.length > 0 ? "Add-on Services: " + selectedAddons.map(id => {
                            const add = [
                              { id: "retainer", name: "Maintenance & Support Retainer (monthly)" },
                              { id: "copywriting", name: "Content Creation & Copywriting" },
                              { id: "social", name: "Social Media Integration" },
                              { id: "email", name: "Email Marketing Setup" }
                            ].find(a => a.id === id);
                            return add ? add.name : id;
                          }).join(", ") : ""}`;
                          const event = new Event('input', { bubbles: true });
                          textarea.dispatchEvent(event);
                        }
                        
                        const radio = document.querySelector('input[type="radio"][value="Website Developer"]') as HTMLInputElement;
                        if (radio) {
                          radio.click();
                        }
                      }, 100);

                      scrollToSection("#schedule");
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] hover:from-[#FFFDF0] hover:to-[#FFFFFF] text-black font-sans font-bold text-xs uppercase tracking-widest rounded-lg transition-all active:scale-95 cursor-pointer hover:shadow-lg"
                  >
                    Auto-Fill & Book
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Important Terms & Legal Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12 bg-zinc-950/40 border border-yellow-500/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
            <div className="p-2 bg-yellow-400/10 rounded-xl text-yellow-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-sans text-white uppercase tracking-wider">
                Important Terms & Legal Disclaimer
              </h4>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Please review before selecting mobile development deliverables</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono leading-relaxed text-zinc-400">
            <div className="space-y-2 bg-zinc-950/80 p-4 rounded-xl border border-zinc-900">
              <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1.5 font-sans">
                <span className="w-4 h-4 rounded bg-yellow-400/10 text-yellow-400 font-bold flex items-center justify-center text-[10px]">1</span>
                Operational & Regulatory Compliance
              </span>
              <p className="text-[11px] leading-relaxed text-zinc-300">
                The client assumes 100% sole responsibility for securing and maintaining all legal permits, licenses, government clearances, and regulatory approvals necessary to operate the application. If the application functions within regulated industries (such as ride-hailing, logistics, courier services, or food delivery), the client is entirely responsible for compliance with relevant governing bodies (e.g., LTFRB, DTI, or local municipal permits). The development team provides software construction only and will not act as a legal or regulatory representative.
              </p>
            </div>

            <div className="space-y-2 bg-zinc-950/80 p-4 rounded-xl border border-zinc-900">
              <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1.5 font-sans">
                <span className="w-4 h-4 rounded bg-yellow-400/10 text-yellow-400 font-bold flex items-center justify-center text-[10px]">2</span>
                Third-Party Costs
              </span>
              <p className="text-[11px] leading-relaxed text-zinc-300">
                The packages listed above cover development labor and initial setup. They do not include ongoing third-party overhead expenses. The client is responsible for paying their own App Store developer accounts ($99/year for Apple, $25 one-time registration), specialized API keys (such as Maps API), and cloud infrastructure/database hosting scaling costs once the agreed-upon deployment buffer concludes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BESPOKE BUSINESS & HR DASHBOARD BUILDER SECTION */}
      <section id="dashboards" className="py-16 px-6 md:px-12 bg-zinc-950/20 border-t border-zinc-900 scroll-mt-20">
        <DashboardMenu 
          currency={currency} 
          onSelectSpec={(specText) => {
            setPrefillService("Website Developer");
            setPrefillNote(specText);
            
            // Scroll to form smoothly
            const element = document.getElementById("schedule");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      </section>

      {/* TECH INSIGHTS BLOG SECTION */}
      <section id="blog" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 scroll-mt-20">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-extrabold text-yellow-400 tracking-[0.25em] font-sans">
            Insights
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">
            TECH INSIGHTS BLOG
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOG_DATA.map((b) => (
            <div 
              key={b.id} 
              className="bg-zinc-950 border border-yellow-500/10 hover:border-yellow-400/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-full h-32 relative border-b border-zinc-900 overflow-hidden">
                {b.imageUrl ? (
                  <img 
                    src={b.imageUrl} 
                    alt={b.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110 opacity-70"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full" style={{ background: b.bgGradient }} />
                )}
                {/* Overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                
                <span className="category-badge absolute bottom-3 left-3 text-[10px] font-sans font-bold uppercase tracking-wider text-black bg-[#FDE047] px-2 py-0.5 rounded-md border border-white/20 z-10">
                  {b.category}
                </span>
              </div>
              
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                    {b.date}
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-white leading-snug group-hover:text-yellow-300 font-sans">
                    {b.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-zinc-400 font-mono leading-relaxed line-clamp-3">
                    {b.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900/40 text-[10px] text-yellow-400 hover:text-white font-mono font-medium tracking-wider flex items-center justify-between mt-4">
                  <span>READ INSIGHT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED RESUME TIMELINE SHOWCASE */}
      <section id="resume" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 scroll-mt-20">
        <div className="flex flex-col items-center justify-center">
          
          {/* Low-key discreet trigger button */}
          {!showSnapshot ? (
            <button
              onClick={() => {
                setShowSnapshot(true);
                setTimeout(() => {
                  document.getElementById("snapshot-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 100);
              }}
              className="group py-3.5 px-8 rounded-xl border border-gold-border bg-[#050505] text-[#9A958D] hover:text-[#E8D5A3] hover:border-gold/50 hover:shadow-[0_0_20px_rgba(201,168,76,0.1)] transition-all duration-500 font-mono text-xs font-bold tracking-widest uppercase cursor-pointer flex items-center gap-2.5 animate-pulse"
            >
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-ping" />
              Founder's credentials available upon request →
            </button>
          ) : (
            <div 
              id="snapshot-panel"
              className="w-full max-w-3xl bg-[rgba(5,5,5,0.92)] border border-[rgba(201,168,76,0.18)] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden animate-fade-in-up"
            >
              {/* Absolute Close indicator */}
              <button 
                onClick={() => {
                  setShowSnapshot(false);
                  setShowFullCV(false);
                }}
                className="absolute top-4 right-4 text-[#9A958D] hover:text-[#E8D5A3] text-xs font-mono tracking-wider transition-colors cursor-pointer capitalize"
              >
                [ hide credentials ]
              </button>

              {/* Gold light reflection lines */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent" />

              {/* Head / Photo + Name + Title */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[rgba(201,168,76,0.12)] pb-6 mb-6">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#C9A84C]/30 bg-[#050505] shrink-0 shadow-lg">
                  {profileImgError ? (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-[#1C1917] to-zinc-950 flex items-center justify-center text-center">
                      <span className="text-[#E8D5A3] font-sans font-black text-lg">JP</span>
                    </div>
                  ) : (
                    <img 
                      src={profileSrc}
                      onError={handleProfileError}
                      alt="JEDDAH SAN T. PAIT" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Subtle active target scope */}
                  <div className="absolute inset-0 border border-dashed border-[#C9A84C]/20 pointer-events-none" />
                </div>
                
                <div className="text-center md:text-left space-y-1">
                  <span className="text-[10px] font-mono text-[#C9A84C] tracking-[0.25em] uppercase font-bold block">
                    FOUNDER SNAPSHOT
                  </span>
                  <h3 className="text-2xl font-black font-sans tracking-wide text-[#E8E4DC] uppercase">
                    JEDDAH SAN T. PAIT
                  </h3>
                  <p className="text-sm font-semibold font-display text-[#E8D5A3] italic tracking-wide">
                    Full Stack Data Analyst & Technical Founder
                  </p>
                </div>
              </div>

              {/* Core snapshot data matrices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                
                {/* Left col: Expertise & Industry Tenure */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-[11px] font-mono text-[#C9A84C] tracking-widest uppercase font-bold border-b border-[rgba(201,168,76,0.15)] pb-1.5 mb-2.5">
                      // EXPERTISE
                    </h4>
                    <ul className="space-y-1.5 text-[#E8E4DC]">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C9A84C]/60 rounded-full" />
                        <span>Data Automation & Alteryx</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C9A84C]/60 rounded-full" />
                        <span>Full-Stack Web Development</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C9A84C]/60 rounded-full" />
                        <span>IT Infrastructure & Cloud</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C9A84C]/60 rounded-full" />
                        <span>Financial Systems (J.P. Morgan) — previously worked</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-mono text-[#C9A84C] tracking-widest uppercase font-bold border-b border-[rgba(201,168,76,0.15)] pb-1.5 mb-2.5">
                      // INDUSTRY TENURE
                    </h4>
                    <ul className="space-y-2 text-[#E8E4DC]">
                      <li className="leading-relaxed bg-[#050505]/40 p-2.5 rounded border border-[rgba(201,168,76,0.08)]">
                        <div>
                          <strong className="text-white text-sm font-bold">6+ years</strong> at <span className="text-[#E8D5A3] font-medium font-mono">J.P. Morgan Chase</span>
                        </div>
                        <div className="text-[10px] text-[#9A958D] mt-0.5">
                          Enterprise infrastructure monitoring & technical operations
                        </div>
                      </li>
                      <li className="leading-relaxed bg-[#050505]/40 p-2.5 rounded border border-[rgba(201,168,76,0.08)]">
                        <div>
                          <strong className="text-white text-sm font-bold">13+ years</strong> total in tech & ops
                        </div>
                        <div className="text-[#C9A84C] text-[10px] font-mono mt-0.5 font-semibold">
                          Active Professional Span (2013 – Present)
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right col: Education & Certifications */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-[11px] font-mono text-[#C9A84C] tracking-widest uppercase font-bold border-b border-[rgba(201,168,76,0.15)] pb-1.5 mb-2.5">
                      // EDUCATION
                    </h4>
                    <ul className="space-y-3 text-[#E8E4DC]">
                      <li className="leading-relaxed bg-[#050505]/40 p-2.5 rounded border border-[rgba(201,168,76,0.08)]">
                        <div className="text-[#E8D5A3] font-bold">ACLC Guadalupe (AMA)</div>
                        <div className="text-[11px] text-[#9A958D]">BS in Information Technology (Software Development)</div>
                      </li>
                      <li className="leading-relaxed bg-[#050505]/40 p-2.5 rounded border border-[rgba(201,168,76,0.08)]">
                        <div className="text-[#E8D5A3] font-bold">ABE International Business College (AMA)</div>
                        <div className="text-[11px] text-[#9A958D]">BS in Information Systems</div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-mono text-[#C9A84C] tracking-widest uppercase font-bold border-b border-[rgba(201,168,76,0.15)] pb-1.5 mb-2.5">
                      // CERTIFICATIONS
                    </h4>
                    <ul className="space-y-1.5 text-[#E8E4DC]">
                      <li className="leading-snug">
                        <span className="text-[#C9A84C] font-semibold">Digital Accelerator: Green Belt (Alteryx)</span>
                        <span className="text-[#9A958D] text-[11px] block">— J.P. Morgan Chase Certification</span>
                      </li>
                      <li className="leading-snug">
                        <span className="text-[#C9A84C] font-semibold">Product Owner Foundations</span>
                        <span className="text-[#9A958D] text-[11px] block">— Agile Methodology Foundations</span>
                      </li>
                      <li className="leading-snug">
                        <span className="text-[#C9A84C] font-semibold">Harvard ManageMentor</span>
                        <span className="text-[#9A958D] text-[11px] block">— Making a Decision</span>
                      </li>
                      <li className="leading-snug">
                        <span className="text-[#C9A84C] font-semibold">Harvard ManageMentor</span>
                        <span className="text-[#9A958D] text-[11px] block">— Sharpening Your Business Acumen</span>
                      </li>
                    </ul>
                  </div>

                </div>

              </div>

              {/* Bottom interactive button to render full printable CV */}
              <div className="mt-8 pt-6 border-t border-[rgba(201,168,76,0.12)] text-center no-print">
                {!showFullCV ? (
                  <button 
                    onClick={() => {
                      setShowFullCV(true);
                      setTimeout(() => {
                        document.getElementById("full-cv-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 120);
                    }}
                    className="text-xs uppercase font-mono font-bold tracking-widest text-[#E8D5A3] hover:text-[#FFF] bg-[#C9A84C]/10 border border-[#C9A84C]/30 hover:border-[#C9A84C] px-5 py-2.5 rounded-lg transition-all hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
                  >
                    📂 click to see and print full CV ↓
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowFullCV(false)}
                    className="text-xs uppercase font-mono tracking-widest text-[#9A958D] hover:text-white bg-zinc-950 px-4 py-2 rounded-lg border border-zinc-900 cursor-pointer"
                  >
                    [ hide full CV overview ]
                  </button>
                )}
              </div>

            </div>
          )}

          {/* Full CV Reveal */}
          {showSnapshot && showFullCV && (
            <div id="full-cv-showcase" className="w-full mt-10 animate-fade-in-up">
              <ResumeSection />
            </div>
          )}

        </div>
      </section>

      {/* BOOKING SCHEDULER TICKET FORM */}
      <section id="schedule" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 scroll-mt-20 print:hidden">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold text-yellow-400 tracking-[0.25em] font-sans">
            Secure Booking
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-display text-white mt-1 uppercase">
            SCHEDULE A SESSION
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 font-mono mt-3 leading-relaxed">
            Configure support tickets or launch priority queues. Fill out the booking checkpoints below 
            to secure operations directly.
          </p>
        </div>

        <BookingForm 
          activePromo={activePromo} 
          prefillNote={prefillNote}
          prefillService={prefillService}
        />
        <OperatorConsole />
      </section>

      {/* TRUST SECURITY AND PRIVACY MANDATES */}
      <section id="privacy" className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900 print:hidden">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-extrabold text-yellow-400 tracking-[0.25em] font-sans">
            Governance
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">
            PRIVACY & SECURITY COMMITMENTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Box 1 */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-yellow-500/10 hover:border-yellow-400/20 transition-all duration-300 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              🔐 Data Privacy
            </h4>
            <ul className="text-[10px] font-mono text-zinc-400 space-y-1.5 leading-relaxed">
              <li>• Full metadata isolation on all servers</li>
              <li>• Encrypted transmission tunnels standard</li>
              <li>• Strict multi-factor authentication loops</li>
              <li>• Immediate database retention checks</li>
            </ul>
          </div>

          {/* Box 2 */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-yellow-500/10 hover:border-yellow-400/20 transition-all duration-300 space-y-3">
            <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-1">
              ⚠️ Risks Mitigated
            </h4>
            <ul className="text-[10px] font-mono text-zinc-400 space-y-1.5 leading-relaxed">
              <li>• Prevents unauthorized remote credentials access</li>
              <li>• Monitors uncritical API connection vulnerabilities</li>
              <li>• Mitigates weak password parameters via Vaults</li>
              <li>• Prevents backup sync pipeline failures</li>
            </ul>
          </div>

          {/* Box 3 */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-yellow-500/10 hover:border-yellow-400/20 transition-all duration-300 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              🛠️ Operational Security
            </h4>
            <ul className="text-[10px] font-mono text-zinc-400 space-y-1.5 leading-relaxed">
              <li>• Routine self-certification security audits</li>
              <li>• Sandbox development tests before hot builds</li>
              <li>• Explicit credential vault isolations per client</li>
              <li>• Bound by strict elite banking NDA standards</li>
            </ul>
          </div>

          {/* Box 4 */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-yellow-500/10 hover:border-yellow-400/20 transition-all duration-300 space-y-3">
            <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-1">
              📋 Compliance Standards
            </h4>
            <ul className="text-[10px] font-mono text-zinc-400 space-y-1.5 leading-relaxed">
              <li>• HIPAA healthcare awareness audits</li>
              <li>• SOC 2 Type II systems security audits</li>
              <li>• ISO 27001 operational standards</li>
              <li>• PCI DSS secure transactional clearances</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive FAQ & SEO Resource Guide */}
      <section id="faq" className="py-16 px-6 md:px-12 max-w-4xl mx-auto border-t border-zinc-900/60 font-sans relative z-20">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono text-[#C9A84C] block">
            Operational Knowledge Base
          </span>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Clear, transparent answers about developer scoping, payment schedules, and support models.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`transition-all duration-300 rounded-xl border ${
                  isOpen
                    ? "bg-zinc-950/80 border-[#C9A84C]/40 shadow-[0_0_15px_rgba(201,168,76,0.05)]"
                    : theme === "dark"
                    ? "bg-zinc-950/40 border-zinc-900 hover:border-zinc-850"
                    : "bg-[#F4EFE6] border-[#0E1F3D]/20 hover:border-[#B88A44]/60"
                } overflow-hidden`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 md:p-5 flex justify-between items-center gap-4 cursor-pointer"
                >
                  <span className={`text-xs md:text-sm font-medium tracking-wide ${
                    isOpen ? "text-[#E8D5A3]" : "text-zinc-200"
                  }`}>
                    {faq.question}
                  </span>
                  <span className="text-[#C9A84C] shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-zinc-900/40" : "max-h-0"
                  } overflow-hidden`}
                >
                  <div className="p-4 md:p-5 text-xs text-zinc-400 leading-relaxed font-mono">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scripture: James 1:17 before footer */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-zinc-900/60 font-sans">
        <div className="bg-zinc-950/40 border border-yellow-500/5 rounded-2xl p-6 md:p-8 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#DFBA6B]/30 to-transparent" />
          <p className="text-xs md:text-sm italic text-[#E8D5A3]/90 leading-relaxed">
            "Every good and perfect gift is from above, coming down from the Father of the heavenly lights, who does not change like shifting shadows."
          </p>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C9A84C] block">James 1:17</span>
        </div>
      </section>

      {/* Premium responsive Footer */}
      <footer className="bg-zinc-950/90 border-t border-zinc-900 py-12 px-6 px-12 print:hidden relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <GoldCircleLogo size="sm" />
              <span className="text-xs uppercase font-extrabold text-white tracking-widest font-display">
                7JN <span className="text-yellow-400">TECH</span> ASSIST
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono leading-relaxed">
              Fix and refine operational bottlenecks. Bringing enterprise-grade support, advanced Alteryx processes, and fully automated web logic to businesses worldwide.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider font-sans">
              Services Summary
            </h4>
            <ul className="text-[11px] font-mono text-zinc-500 space-y-1.5 leading-snug">
              <li><button onClick={() => scrollToSection("#services")} className="hover:text-yellow-400 transition-colors">Ticketing & Workflows</button></li>
              <li><button onClick={() => scrollToSection("#services")} className="hover:text-yellow-400 transition-colors">Asana / Project Spaces</button></li>
              <li><button onClick={() => scrollToSection("#services")} className="hover:text-yellow-400 transition-colors">Remote System Diagnostics</button></li>
              <li><button onClick={() => scrollToSection("#services")} className="hover:text-yellow-400 transition-colors">Workflow automation</button></li>
              <li><button onClick={() => scrollToSection("#services")} className="hover:text-yellow-400 transition-colors">BI & Excel Visualization</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider font-sans">
              Navigation
            </h4>
            <ul className="text-[11px] font-mono text-zinc-500 space-y-1.5 leading-snug">
              <li><button onClick={() => scrollToSection("#home")} className="hover:text-yellow-400 transition-colors">Home Landing</button></li>
              <li><button onClick={() => scrollToSection("#hologram")} className="hover:text-yellow-400 transition-colors">Hologram API</button></li>
              <li><button onClick={() => scrollToSection("#resume")} className="hover:text-yellow-400 transition-colors">Jeddah's Resume</button></li>
              <li><button onClick={() => scrollToSection("#packages")} className="hover:text-yellow-400 transition-colors">Service rates</button></li>
              <li><button onClick={() => scrollToSection("#schedule")} className="hover:text-yellow-400 transition-colors">Secure Booking</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-bold text-white tracking-wider font-sans">
              Direct Channels
            </h4>
            <div className="space-y-3 font-mono text-[11px] text-zinc-500 leading-relaxed">
              <div>
                <span>Email inquiries:</span><br />
                <a href="mailto:7jntech@gmail.com" className="text-yellow-450 underline hover:text-white transition-colors">7jntech@gmail.com</a>
              </div>
              <div className="border-t border-zinc-900 pt-2 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 font-sans block">WhatsApp & Viber:</span>
                <span className="text-yellow-450 font-bold block text-sm">09153267244</span>
                <div className="flex flex-col gap-1 text-[10px] pt-1">
                  <a href="https://wa.me/639153267244" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
                    <span className="text-[#DFBA6B]">✓</span> Direct Chat on WhatsApp
                  </a>
                  <a href="viber://chat?number=%2B639153267244" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
                    <span className="text-[#DFBA6B]">✓</span> Launch Viber Channel
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 pt-1">
              <a href="https://m.me/7JStech" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 hover:bg-[#FDE047] rounded-lg text-yellow-500 hover:text-black border border-zinc-800 hover:border-yellow-400 transition-all cursor-pointer" title="Direct Messenger Link">
                <MessagesSquare className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/Aye_Jeydah" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 hover:bg-[#FDE047] rounded-lg text-yellow-500 hover:text-black border border-zinc-800 hover:border-yellow-400 transition-all cursor-pointer" title="Instagram Link">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900/40 text-center text-xs text-zinc-600 font-mono">
          &copy; {new Date().getFullYear()} 7JN Tech Assist. All rights reserved. | Code styled securely in separate folders for clean Git imports.
        </div>
      </footer>

      {/* Discreet flying orb matching logo with copyable 30% coupon */}
      <TravellingOrb onApplyPromo={handleApplyPromo} orbCouponUsedCount={orbCouponUsedCount} />

    </div>
  );
}
