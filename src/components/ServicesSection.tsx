import React, { useState } from "react";
import { SERVICES_DATA } from "../data";
import { ServiceItem } from "../types";
import { ChevronDown, ChevronUp, Terminal, Wrench } from "lucide-react";

export default function ServicesSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-extrabold text-yellow-500 tracking-[0.25em] font-sans">
          Flexible Solutions
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1 font-sans">
          COLLAPSIBLE SERVICE DIRECTORY
        </h2>
        <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-xl mx-auto font-mono">
          Click any link or tab to expand technical details, workflows, and tools on demand.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {SERVICES_DATA.map((service: ServiceItem) => {
          const isOpen = expandedId === service.id;
          return (
            <div 
              key={service.id}
              className={`border transition-all duration-300 rounded-xl overflow-hidden ${
                isOpen 
                  ? "bg-zinc-950/90 border-yellow-500/40 shadow-[0_4px_25px_rgba(254,240,138,0.1)]" 
                  : "bg-zinc-950/40 border-yellow-500/10 hover:border-yellow-500/30 hover:bg-zinc-950/60"
              }`}
            >
              {/* Accordion Trigger/Label Link */}
              <button
                onClick={() => toggleExpand(service.id)}
                className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl p-1 bg-yellow-400/10 rounded-lg text-yellow-400 border border-yellow-500/10">
                    {service.icon}
                  </span>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white tracking-wide font-sans group-hover:text-yellow-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-zinc-500 font-mono mt-0.5 line-clamp-1">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex text-[10px] font-mono text-yellow-400 font-medium px-2 py-0.5 bg-yellow-500/10 uppercase tracking-wide rounded-md border border-yellow-500/10">
                    {service.tools[0]}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-yellow-400 animate-pulse" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  isOpen ? "max-h-[500px] border-t border-yellow-500/10" : "max-h-0"
                } overflow-hidden`}
              >
                <div className="p-5 md:p-6 bg-zinc-950/50">
                  <p className="text-xs md:text-sm text-zinc-300 font-mono leading-relaxed mb-4">
                    {service.longDesc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* List of Details */}
                    <div>
                      <h4 className="text-[11px] uppercase font-bold text-yellow-500 tracking-wider mb-2 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" /> Core Scopes & Workflows
                      </h4>
                      <ul className="space-y-1.5">
                        {service.details.map((detail, idx) => (
                           <li key={idx} className="text-xs text-zinc-400 font-mono flex items-start gap-1.5 leading-snug">
                             <span className="text-yellow-400 font-medium select-none">›</span>
                             <span>{detail}</span>
                           </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools and Integrations */}
                    <div className="bg-zinc-900/40 p-3.5 rounded-lg border border-yellow-500/5">
                      <h4 className="text-[11px] uppercase font-bold text-yellow-500 tracking-wider mb-2 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-yellow-400" /> Supported Technical Tool Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {service.tools.map((tool, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] font-mono font-medium tracking-wide text-zinc-300 px-2 py-1 bg-zinc-900 rounded border border-zinc-800"
                          >
                            🛠️ {tool}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 text-[10px] text-zinc-500 font-mono py-1 border-t border-zinc-800/50">
                        * I configure fully automated connectors for these stacks out of the box.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
