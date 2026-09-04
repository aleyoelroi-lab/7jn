import React, { useState } from "react";
import { RESUME_DATA } from "../data";
import { Printer, MapPin, Globe, Mail, Phone, Building2, Briefcase, Award, GraduationCap, Compass, FileSpreadsheet } from "lucide-react";
import { useAssetResolver } from "../utils/assetResolver";

export default function ResumeSection() {
  const [activeTab, setActiveTab] = useState<"experience" | "skills" | "certs">("experience");
  const { src: profileSrc, handleError: handleProfileError, hasFailedAll: imgError } = useAssetResolver("profile.png");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="resume-container" className="w-full bg-[#020408]/90 border border-[#DFBA6B]/20 rounded-2xl p-6 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.85)] border-t-[#DFBA6B]/40 border-l-[#DFBA6B]/30 border-r-[#DFBA6B]/30 backdrop-blur-xl transition-all duration-300 relative print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
      
      {/* Decorative Gold Seal */}
      <div className="absolute top-6 right-6 z-10 opacity-10 print:hidden select-none pointer-events-none w-24 h-24">
        <Compass className="w-full h-full text-[#DFBA6B] animate-[spin_80s_linear_infinite]" />
      </div>

      {/* Print Trigger Button */}
      <div className="absolute bottom-6 right-6 md:top-10 md:right-10 z-20 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] text-black hover:from-[#FFFDF0] hover:to-[#FFFFFF] font-sans font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(223,186,107,0.25)] hover:shadow-[0_6px_25px_rgba(223,186,107,0.45)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          title="Print or Save Resume as PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / Save PDF
        </button>
      </div>

      {/* Resume Header Area */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b-2 border-[#DFBA6B]/30 pb-8 mb-8 print:border-zinc-300 print:pb-6 print:mb-6">
        
        {/* Profile Picture Frame */}
        <div className="relative group shrink-0 print:block">
          {/* Circular frame background */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#DFBA6B] to-[#FFFDF0] opacity-65 blur-md transition duration-300 print:hidden" />
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#DFBA6B] bg-zinc-900 shadow-xl print:border-zinc-300">
            {/* Jeddah's headshot placeholder */}
            {imgError ? (
              <div className="w-full h-full bg-gradient-to-br from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] flex items-center justify-center text-black font-sans font-black text-2xl">
                JP
              </div>
            ) : (
              <img 
                src={profileSrc} 
                onError={handleProfileError}
                alt="JS Pait (Jeys)"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>

        {/* Name and Professional Summary Column */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-3xl font-black uppercase text-white tracking-widest font-sans print:text-zinc-950">
            {RESUME_DATA.name}
          </h2>
          <div className="text-xs md:text-xs font-bold text-[#EAD890] tracking-[0.25em] uppercase font-sans mt-1.5 print:text-zinc-800">
            {RESUME_DATA.title}
          </div>

          {/* Contact coordinates */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-[11px] text-zinc-400 font-mono mt-4 print:text-zinc-700">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#DFBA6B] shrink-0 print:text-zinc-800" />
              {RESUME_DATA.contact.location}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#DFBA6B] shrink-0 print:text-zinc-800" />
              <a href="https://www.7jntech.com" className="hover:text-[#FFFDF0] underline print:no-underline">
                {RESUME_DATA.contact.website}
              </a>
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#DFBA6B] shrink-0 print:text-zinc-800" />
              <a href={`mailto:${RESUME_DATA.contact.email2}`} className="hover:text-[#FFFDF0] underline print:no-underline">
                {RESUME_DATA.contact.email2}
              </a>
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#DFBA6B] shrink-0 print:text-zinc-800" />
              {RESUME_DATA.contact.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Professional Summary Quote - Executive Synopsis */}
      <div className="mb-8 print:mb-6">
        <h2 className="text-[11px] uppercase font-extrabold text-[#DFBA6B] tracking-[0.25em] font-sans mb-2.5 print:text-zinc-900">
          Executive Synopsis
        </h2>
        <p className="text-xs md:text-xs text-zinc-300 font-mono leading-relaxed text-justify print:text-zinc-800">
          {RESUME_DATA.summary}
        </p>
      </div>

      {/* ELITE PRIMARY HIGHLIGHT: 3-column Technical Credentials, Specialized Systems & Certifications Bento */}
      <div className="mb-8 pb-8 border-b border-[#DFBA6B]/20 print:pb-6 print:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Technical Matrices */}
          <div className="bg-zinc-950/40 p-4 rounded-xl border border-[#DFBA6B]/10 hover:border-[#DFBA6B]/30 transition-all shadow-md group">
            <h3 className="text-xs uppercase font-extrabold text-[#DFBA6B] tracking-[0.2em] font-sans mb-3 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <Award className="w-4 h-4 text-[#EAD890] shrink-0" /> Technical Matrices
            </h3>
            <div className="space-y-4">
              {RESUME_DATA.skills.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-[10px] font-sans font-bold text-[#EAD890] uppercase tracking-wide">
                    {cat.category}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((item, id) => (
                      <span 
                        key={id} 
                        className="text-[9px] font-mono text-zinc-300 px-2 py-0.5 bg-zinc-950/80 border border-zinc-900 hover:border-[#DFBA6B]/25 rounded-md transition-all shrink-0 print:border-zinc-300 print:text-zinc-800"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Specialized Systems */}
          <div className="bg-zinc-950/40 p-4 rounded-xl border border-[#DFBA6B]/10 hover:border-[#DFBA6B]/30 transition-all shadow-md group">
            <h3 className="text-xs uppercase font-extrabold text-[#DFBA6B] tracking-[0.2em] font-sans mb-3 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <FileSpreadsheet className="w-4 h-4 text-[#EAD890] shrink-0" /> Specialized Systems
            </h3>
            <div className="space-y-3 font-mono">
              {RESUME_DATA.projects.map((proj, idx) => (
                <div key={idx} className="p-2.5 bg-zinc-900/10 rounded-lg border border-zinc-900 hover:border-[#DFBA6B]/15 transition-all">
                  <h4 className="text-[10px] font-sans font-bold text-[#FFFDF0] tracking-wide mb-1 leading-snug">
                    {proj.title}
                  </h4>
                  <p className="text-[9.5px] text-zinc-400 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Accreditations List */}
          <div className="bg-zinc-950/40 p-4 rounded-xl border border-[#DFBA6B]/10 hover:border-[#DFBA6B]/30 transition-all shadow-md group">
            <h3 className="text-xs uppercase font-extrabold text-[#DFBA6B] tracking-[0.2em] font-sans mb-3 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
              <GraduationCap className="w-4 h-4 text-[#EAD890] shrink-0" /> Accreditations List
            </h3>
            <div className="space-y-2.5 font-mono">
              {RESUME_DATA.certifications.map((cert, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-900 text-[10px] text-zinc-350 hover:border-[#DFBA6B]/20 leading-relaxed transition-all flex items-start gap-1.5 print:bg-white print:border-none print:p-0 print:text-zinc-800"
                >
                  <span className="text-[#EAD890] shrink-0">🎖️</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Grid of details: Experience (Work History) & Academic background */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 print:grid-cols-1 print:gap-4">
        
        {/* Main Work History (8 columns wide on desktop) */}
        <div className="md:col-span-8 print:w-full">
          <h2 className="text-xs uppercase font-extrabold text-[#DFBA6B] tracking-[0.25em] font-sans mb-4 flex items-center gap-2 print:text-zinc-950 print:border-b-2 print:pb-1 pb-1">
            <Briefcase className="w-4 h-4" /> Tenured Work History & Chronology
          </h2>

          <div className="space-y-6 print:space-y-4">
            {RESUME_DATA.experience.map((job, index) => (
              <div 
                key={index}
                className={`border-l-2 p-4 rounded-r-xl transition-all duration-300 ${
                  job.highlight 
                    ? "bg-[#DFBA6B]/5 border-[#DFBA6B]/70 shadow-[0_4px_20px_rgba(223,186,107,0.03)]" 
                    : "bg-zinc-950/10 border-zinc-800/80 hover:border-[#DFBA6B]/30"
                } print:border-zinc-300 print:bg-white print:p-0 print:shadow-none`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5 print:flex-row">
                  <span className="font-extrabold text-white text-xs md:text-sm tracking-wide flex items-center gap-1.5 print:text-zinc-950">
                    <Building2 className="w-3.5 h-3.5 text-[#EAD890] shrink-0 print:text-zinc-900" />
                    {job.company}
                  </span>
                  <span className="text-[10px] md:text-[10px] font-mono text-[#EAD890]/80 font-semibold print:text-zinc-700">
                    {job.dates}
                  </span>
                </div>
                <div className="text-[11px] md:text-xs font-bold text-[#EAD890] font-sans print:text-zinc-900 uppercase tracking-wide">
                  {job.role}
                </div>

                <ul className="list-none space-y-1.5 mt-3">
                  {job.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-[11px] text-zinc-400 font-mono leading-relaxed pl-4 relative print:text-zinc-800">
                      <span className="absolute left-0 top-0.5 text-[#DFBA6B] font-bold select-none">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info: Academic & Strategic Awards (4 columns wide on desktop) */}
        <div className="md:col-span-4 space-y-8 print:w-full print:space-y-4">
          
          {/* Academic Credentials */}
          <div className="bg-zinc-950/20 p-4 rounded-xl border border-zinc-900/60 print:border-none print:p-0">
            <h2 className="text-xs uppercase font-extrabold text-[#DFBA6B] tracking-[0.25em] font-sans mb-4 flex items-center gap-2 print:text-zinc-950">
              <GraduationCap className="w-4 h-4" /> Academic
            </h2>
            <div className="space-y-3 font-mono text-[11px] text-zinc-400 print:text-zinc-800">
              {RESUME_DATA.education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl print:bg-white print:border-none print:p-0">
                  <div className="font-bold text-white print:text-zinc-950 leading-snug">{edu.school}</div>
                  <div className="text-zinc-500 text-[10px] print:text-zinc-700 mt-1">{edu.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Awards / Honors Section as Sidebar Widget */}
          <div className="bg-[#DFBA6B]/5 p-4 rounded-xl border border-[#DFBA6B]/20 print:bg-white print:border-none print:p-0">
            <h2 className="text-xs uppercase font-extrabold text-[#DFBA6B] tracking-[0.25em] font-sans mb-3.5 flex items-center gap-2 print:text-zinc-950">
              <Award className="w-4 h-4 text-[#DFBA6B]" /> Strategic Awards
            </h2>
            {RESUME_DATA.honors.map((honor, idx) => (
              <p 
                key={idx} 
                className="text-[11px] text-zinc-300 font-mono leading-relaxed print:text-zinc-800"
              >
                🏆 {honor}
              </p>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
