import React, { useState } from "react";
import { 
  BarChart3, CalendarRange, Calculator, FileText, CheckCircle2, 
  Printer, Coins, Layers, ArrowUpRight, HelpCircle, FileCheck
} from "lucide-react";

interface DashboardMenuProps {
  currency: "USD" | "PHP";
  onSelectSpec?: (specText: string) => void;
}

type DashboardType = "payroll" | "bi" | "operational";

interface DashboardConfig {
  id: DashboardType;
  title: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
}

export default function DashboardMenu({ currency, onSelectSpec }: DashboardMenuProps) {
  const [activeType, setActiveType] = useState<DashboardType>("payroll");
  const [withAttendance, setWithAttendance] = useState(false);
  const [withCompliance, setWithCompliance] = useState(false);
  const [customFeatures, setCustomFeatures] = useState<string[]>([
    "Commission calculation",
    "Tier-based earnings (10% → 25% → 30%)",
    "Attendance correlation with pay",
    "Print-ready graphs",
    "Leave tracker",
    "Score cards customize",
    "7-year data retention (compliance)"
  ]);

  const dashboards: DashboardConfig[] = [
    {
      id: "payroll",
      title: "Payroll / HR Analytics Dashboard",
      shortDesc: "Attendance tracking & earnings breakdown matrix",
      longDesc: "Highly specialized interface engineered for human resource officers and accountants to correlate shift records, calculate complex pay structures, and preview automated payouts.",
      features: [
        "Attendance correlation with pay",
        "Commission calculation module",
        "Tier-based earnings (10% → 25% → 30%)",
        "Leave tracker & shift scheduling",
        "Customizable score cards for HR performance metrics"
      ]
    },
    {
      id: "bi",
      title: "Business Intelligence (BI) Dashboard",
      shortDesc: "Focused financial & HR metric forecasting",
      longDesc: "Executive-level monitoring system tracking enterprise-wide margins, cost centers, employee productivity, and multi-year trajectory forecasts in high-resolution visual graphs.",
      features: [
        "Financial trend visualization and profit/loss graphs",
        "Print-ready graphs & white-glove executive reporting PDFs",
        "Customizable KPI score cards with drag-and-drop metrics",
        "Historical HR metrics analytics & cross-department filters",
        "Strategic multi-variable ROI calculation tools"
      ]
    },
    {
      id: "operational",
      title: "Operational Dashboard",
      shortDesc: "Real-time day-to-day operations data sync",
      longDesc: "Ground-level management panel built for rapid dispatch, daily queue monitoring, active support ticket telemetry, and current workforce presence states.",
      features: [
        "Day-to-day operations status visual grid",
        "Real-time ticket logging & live queue sync",
        "Workforce online/offline presence tracking",
        "Automated operational leave & scheduling alerts",
        "Historical log archiving & quick export modules"
      ]
    }
  ];

  // Pricing ranges in USD
  const getUSDPriceRange = (): [number, number] => {
    if (withCompliance) {
      return [2777, 5577]; // With compliance/retention (7-year compliance)
    }
    if (withAttendance) {
      return [1577, 4577]; // With attendance integration
    }
    return [1277, 2577]; // Custom single purpose payroll/BI/operational
  };

  // Convert USD ranges to PHP with the automatic 5% regional discount
  const getPHPPriceRange = (usdMin: number, usdMax: number): [number, number] => {
    const rate = 58;
    const discount = 0.95; // 5% discount
    const minPHP = Math.round(usdMin * rate * discount);
    const maxPHP = Math.round(usdMax * rate * discount);
    return [minPHP, maxPHP];
  };

  const usdRange = getUSDPriceRange();
  const phpRange = getPHPPriceRange(usdRange[0], usdRange[1]);

  const activeDashboard = dashboards.find(d => d.id === activeType) || dashboards[0];

  const handleBookDashboard = () => {
    let selectedPackageDesc = `[${activeDashboard.title}]
- Short Desc: ${activeDashboard.shortDesc}
- Setup Type: ${withCompliance ? "With 7-Year Compliance & Data Retention" : withAttendance ? "With Attendance Integration" : "Single Purpose (Standard Setup)"}
- Included Features: ${activeDashboard.features.join(", ")}
- Est Range: ${currency === "PHP" ? `₱${phpRange[0].toLocaleString()} – ₱${phpRange[1].toLocaleString()}` : `$${usdRange[0].toLocaleString()} – $${usdRange[1].toLocaleString()}`} (Currency: ${currency})`;

    if (onSelectSpec) {
      onSelectSpec(selectedPackageDesc);
    }
  };

  // Simple print handler for "Print-ready graphs" spec
  const handlePrintSpec = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>7JN-TECH — Dashboard Architecture Blueprint</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; background-color: #ffffff; color: #000000; padding: 40px; margin: 0; line-height: 1.5; }
            .header { border-bottom: 2px dashed #000; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 22px; font-weight: bold; text-transform: uppercase; margin: 0; }
            .subtitle { font-size: 12px; color: #555; margin-top: 5px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 12px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .item { font-size: 12px; }
            .item strong { text-transform: uppercase; }
            .price-box { border: 2px solid #000; padding: 15px; text-align: center; font-size: 16px; font-weight: bold; margin-top: 20px; }
            .features-list { padding-left: 18px; margin: 8px 0; font-size: 12px; }
            .compliance-footer { border-top: 2px dashed #000; padding-top: 20px; margin-top: 40px; font-size: 10px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">7JN-TECH INDUSTRIAL BLUEPRINT SPECIFICATION</div>
            <div class="subtitle">AUTOMATED TECHNICAL CONFIGURATION REPORT • GENERATED: ${new Date().toLocaleDateString()}</div>
          </div>

          <div class="section">
            <div class="section-title">1. CORE SYSTEM LAYOUT</div>
            <div class="grid">
              <div class="item">
                <div><strong>Dashboard Type:</strong></div>
                <div>${activeDashboard.title}</div>
              </div>
              <div class="item">
                <div><strong>Target Use-Case:</strong></div>
                <div>${activeDashboard.shortDesc}</div>
              </div>
            </div>
            <div class="item" style="margin-top: 10px;">
              <strong>System Architecture:</strong><br/>
              ${activeDashboard.longDesc}
            </div>
          </div>

          <div class="section">
            <div class="section-title">2. FEATURE INCLUSION MATRIX</div>
            <ul class="features-list">
              ${activeDashboard.features.map(f => `<li>${f}</li>`).join("")}
              ${withAttendance ? `<li><strong>INTEGRATION:</strong> Live Attendance & Timekeeping Correlation Module</li>` : ""}
              ${withCompliance ? `<li><strong>COMPLIANCE:</strong> 7-Year High-Density Immutable Data Retention Safeguard</li>` : ""}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">3. OPERATIONAL SCALABILITY SUMMARY</div>
            <div class="item" style="margin-bottom: 10px;">
              • Commission Calculation Modules: <span style="font-weight:bold;">ENABLED</span> (Tier-Based: 10% → 25% → 30%)<br/>
              • Attendance Correlation Matrix: <span style="font-weight:bold;">${withAttendance || activeType === "payroll" ? "ACTIVE INTEGRATION" : "STANDALONE"}</span><br/>
              • Regulatory Compliance Lifespan: <span style="font-weight:bold;">${withCompliance ? "7 YEARS IMMUTABLE (COMPLIANCE CERTIFIED)" : "STANDARD LOCAL CACHE"}</span><br/>
              • Graph Render Engine: <span style="font-weight:bold;">PRINT-READY VECTOR SVGS (GAUGE / ATTENDANCE HEATMAPS)</span>
            </div>
          </div>

          <div class="price-box">
            ESTIMATED PROJECT BUDGET RANGE: <br/>
            ${currency === "PHP" ? `₱${phpRange[0].toLocaleString()} – ₱${phpRange[1].toLocaleString()} PHP` : `$${usdRange[0].toLocaleString()} – $${usdRange[1].toLocaleString()} USD`}
            <div style="font-size:10px; font-weight:normal; margin-top:5px;">
              ${currency === "PHP" ? "* Includes Philippine 5% Discreet regional adjustment applied automatically." : "* Standard rate in United States Dollars"}
            </div>
          </div>

          <div class="compliance-footer">
            SECURE ROUTING CERTIFICATE: 7JN-CO-SPEC-REF-${Date.now().toString().slice(-6)} <br/>
            7JN-TECH OPERATIONS DESK — CONFIDENTIAL ARCHITECTURE DRAFT FOR CLIENT ACQUISITION
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 bg-zinc-950/40 border border-yellow-500/10 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
      {/* Absolute abstract glowing line */}
      <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />

      {/* Title */}
      <div className="text-center md:text-left space-y-1.5 border-b border-zinc-900 pb-5">
        <span className="text-[10px] uppercase font-mono font-extrabold text-yellow-400 bg-yellow-400/5 border border-yellow-400/10 px-2.5 py-0.5 rounded tracking-widest">
          ✦ Live Dashboard Architect
        </span>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans mt-2">
          BESPOKE BUSINESS & HR DASHBOARD MENU
        </h3>
        <p className="text-xs text-zinc-400 font-mono">
          Configure specialized telemetry interfaces, correlation loops, and compliance parameters in real-time.
        </p>
      </div>

      {/* Main Grid splitting choices & configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Types selector (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
            Select Dashboard Type:
          </span>

          <div className="flex flex-col gap-2.5">
            {dashboards.map((dbItem) => {
              const isSelected = activeType === dbItem.id;
              return (
                <button
                  key={dbItem.id}
                  onClick={() => setActiveType(dbItem.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 border-yellow-400 shadow-[0_2px_15px_rgba(254,240,138,0.05)]"
                      : "bg-zinc-950/20 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-lg p-1.5 rounded-lg border ${
                      isSelected 
                        ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" 
                        : "bg-zinc-900 text-zinc-500 border-zinc-800 group-hover:text-zinc-300"
                    }`}>
                      {dbItem.id === "payroll" ? "📊" : dbItem.id === "bi" ? "📈" : "⚙️"}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-extrabold font-sans transition-colors ${
                        isSelected ? "text-yellow-400" : "text-zinc-300 group-hover:text-white"
                      }`}>
                        {dbItem.title}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-500 leading-snug line-clamp-1">
                        {dbItem.shortDesc}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <ArrowUpRight className="w-4 h-4 text-yellow-400 animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Core Feature Matrix */}
          <div className="bg-zinc-900/20 rounded-xl border border-zinc-900 p-4 space-y-2.5">
            <h5 className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-yellow-400" /> Pre-Configured Core Features
            </h5>
            <ul className="grid grid-cols-1 gap-2">
              <li className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                Commission calculation (10% → 25% → 30%)
              </li>
              <li className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                Attendance correlation with pay
              </li>
              <li className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                Print-ready graphs & white-label PDFs
              </li>
              <li className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                Leave tracker & balance manager
              </li>
              <li className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                Score cards customize dashboard views
              </li>
              <li className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                7-year data retention compliance standard
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: Active detail breakdown & price calculation (7 cols) */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-zinc-900/30 rounded-xl border border-zinc-900 p-5 space-y-3">
              <span className="text-[10px] font-mono uppercase text-yellow-400 block tracking-wider font-extrabold">
                Active Architecture Spec
              </span>
              <h4 className="text-sm font-bold text-white font-sans">{activeDashboard.title}</h4>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {activeDashboard.longDesc}
              </p>
            </div>

            {/* Scale Integrations Controls */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
                Scale System Integrations:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Attendance Integration Selector */}
                <button
                  type="button"
                  onClick={() => {
                    setWithAttendance(!withAttendance);
                    if (withCompliance) setWithCompliance(false); // Compliance has attendance included or higher pricing tier
                  }}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    withAttendance && !withCompliance
                      ? "border-yellow-400 bg-yellow-400/5 shadow-md"
                      : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-850"
                  }`}
                >
                  <div className="p-1 bg-zinc-900 rounded-lg text-yellow-400 border border-zinc-800 mt-0.5 shrink-0">
                    <CalendarRange className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-white">Attendance Integration</h5>
                    <p className="text-[9px] font-mono text-zinc-500 leading-snug">
                      Correlate shift logs directly to wage multipliers.
                    </p>
                  </div>
                </button>

                {/* Compliance & 7-Year Retention Selector */}
                <button
                  type="button"
                  onClick={() => {
                    setWithCompliance(!withCompliance);
                    if (!withCompliance) {
                      setWithAttendance(false); // Compliance overrides/subsumes attendance
                    }
                  }}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    withCompliance
                      ? "border-yellow-400 bg-yellow-400/5 shadow-md"
                      : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-850"
                  }`}
                >
                  <div className="p-1 bg-zinc-900 rounded-lg text-yellow-400 border border-zinc-800 mt-0.5 shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-white">7-Year Compliance Vault</h5>
                    <p className="text-[9px] font-mono text-zinc-500 leading-snug">
                      High-security audit log backups & long-term safety retention.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Display Calculated Price Range */}
          <div className="bg-zinc-950/80 border border-yellow-400/20 rounded-xl p-5 relative overflow-hidden space-y-4">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
            
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500">
                  Project Estimate Range ({currency}):
                </span>
                <div className="text-2xl font-black font-display text-[#DFBA6B] tracking-tight">
                  {currency === "PHP" ? (
                    <>₱{phpRange[0].toLocaleString()} – ₱{phpRange[1].toLocaleString()}</>
                  ) : (
                    <>${usdRange[0].toLocaleString()} – $${usdRange[1].toLocaleString()}</>
                  )}
                </div>
                <p className="text-[9px] font-mono text-zinc-500">
                  {currency === "PHP" 
                    ? "* Philippines localized rate: 1 USD = 58 PHP (5% regional discount automatically applied)" 
                    : "* Dynamic estimation based on target capabilities selected."}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {/* Print specs button */}
                <button
                  type="button"
                  onClick={handlePrintSpec}
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-850 text-yellow-400 hover:text-yellow-300 border border-zinc-800 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  title="Print Design Spec Grid"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider hidden sm:inline">Print Spec</span>
                </button>

                {/* Apply button */}
                <button
                  type="button"
                  onClick={handleBookDashboard}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#DFBA6B] to-[#FFFDF0] hover:brightness-110 text-black font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-lg"
                >
                  <span>Inject & Book</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
