import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  Terminal, ShieldCheck, ShieldAlert, KeyRound, Eye, EyeOff, Trash2, 
  RefreshCw, Search, Mail, Calendar, Clock, Tag, ExternalLink, Filter
} from "lucide-react";

interface TicketData {
  id: string;
  name: string;
  email: string;
  service: string;
  note: string;
  date: string;
  time: string;
  timezone: string;
  paymentType: string;
  ticketNumber: string;
  promoCode: string;
  createdAt: any;
  isUrgentNotification?: boolean;
  emailRouting?: {
    from: string;
    to: string;
    customerCopyEmail?: string;
    bcc: string;
    priority?: string;
    forwardingChannels?: string[];
    forwardingStatus?: string;
  };
}

export default function OperatorConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Quick auth check - using local storage persistence for session
  useEffect(() => {
    const isAuth = localStorage.getItem("jsn_operator_authorized") === "true";
    if (isAuth) {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;

    setLoading(true);
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: TicketData[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as TicketData);
      });
      setTickets(list);
      setLoading(false);
    }, (err) => {
      setLoading(false);
      handleFirestoreError(err, OperationType.LIST, "tickets");
    });

    return () => unsubscribe();
  }, [unlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Passcodes accepted: 7jntech#721721 (Primary), 7jntech, 7njtech, 7jntech@gmail.com, or admin77
    const rawPasscode = passcode.trim();
    const normalized = rawPasscode.toLowerCase();
    if (
      rawPasscode === "7jntech#721721" ||
      normalized === "7jntech#721721" ||
      normalized === "7jntech" || 
      normalized === "7njtech" || 
      normalized === "7jntech@gmail.com" || 
      normalized === "admin77"
    ) {
      setUnlocked(true);
      setError("");
      localStorage.setItem("jsn_operator_authorized", "true");
    } else {
      setError("ACCESS DENIED: Invalid Operator Privilege Key.");
    }
  };

  const handleLock = () => {
    setUnlocked(false);
    setPasscode("");
    localStorage.removeItem("jsn_operator_authorized");
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete / archive ticket ${id}?`)) {
      try {
        await deleteDoc(doc(db, "tickets", id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `tickets/${id}`);
      }
    }
  };

  // Filter & Search logic
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.note.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = filterService === "all" || ticket.service === filterService;
    
    return matchesSearch && matchesFilter;
  });

  const getUniqueServices = () => {
    const services = new Set(tickets.map(t => t.service));
    return Array.from(services);
  };

  return (
    <div id="operator-console" className="w-full max-w-5xl mx-auto bg-zinc-950/90 border border-yellow-500/10 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-lg relative overflow-hidden mt-12">
      {/* Top light bar line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-450/40 to-transparent" />
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="text-sm font-bold font-mono tracking-widest text-white uppercase flex items-center gap-2">
              7JN-TECH OPERATIONAL QUEUE DESK
              {unlocked && (
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-extrabold uppercase animate-pulse">
                  ● SYNC ONLINE
                </span>
              )}
            </h3>
            <p className="text-[10px] font-mono text-zinc-500">
              Synchronized client support requests console (Free-Tier Firebase Firestore)
            </p>
          </div>
        </div>

        {unlocked && (
          <button
            onClick={handleLock}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-yellow-500 hover:text-yellow-400 border border-zinc-800 text-[10px] font-mono uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer"
          >
            [ LOCK CONSOLE ]
          </button>
        )}
      </div>

      {!unlocked ? (
        /* LOCK GATE FORM */
        <form onSubmit={handleUnlock} className="max-w-md mx-auto py-8 text-center space-y-5">
          <div className="mx-auto w-12 h-12 rounded-full bg-yellow-500/5 border border-yellow-500/15 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-zinc-300 font-mono tracking-widest uppercase">
              OPERATOR VALIDATION REQUIRED
            </h4>
            <p className="text-[10px] text-zinc-500 font-mono leading-relaxed max-w-xs mx-auto">
              Please authenticate with your Operator Key to view, read, and search client requests in real-time.
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Enter Operator Privilege Key..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-yellow-500 rounded-xl px-4 py-2.5 text-xs text-white text-center font-mono placeholder-zinc-650 focus:outline-none transition-all"
            />
            
            {error && (
              <p className="text-[10px] font-mono text-red-400 font-medium flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#DFBA6B] to-[#FFFDF0] hover:brightness-110 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-yellow-500/5"
            >
              Verify & Authorize
            </button>
          </div>
        </form>
      ) : (
        /* LIVE QUEUE VIEWER */
        <div className="space-y-6">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ticket #, client name, email or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-500/40 transition-all font-mono"
              />
            </div>

            {/* Filter Selector */}
            <div className="relative min-w-[160px]">
              <Filter className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-yellow-500/40 transition-all font-mono appearance-none cursor-pointer"
              >
                <option value="all">All Services</option>
                {getUniqueServices().map(svc => (
                  <option key={svc} value={svc}>{svc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE / TICKETS LIST */}
          {loading ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-yellow-400" />
              Fetching incoming tickets from Firestore...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 font-mono text-xs border border-dashed border-zinc-900 rounded-xl">
              No tickets matched the current filters or query.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Showing {filteredTickets.length} support requests</span>
                <span>Sorted by newest first</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredTickets.map((ticket) => {
                  const isExpanded = showDetails === ticket.id;
                  return (
                    <div 
                      key={ticket.id} 
                      className={`bg-zinc-900/40 hover:bg-zinc-900/60 border ${
                        isExpanded ? 'border-yellow-500/20 bg-zinc-900/70' : 'border-zinc-850'
                      } rounded-xl p-5 transition-all duration-300 relative overflow-hidden`}
                    >
                      {/* Ticket Sidebar Accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/30" />

                      {/* Header Summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold font-mono text-white tracking-wider bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded shadow">
                              {ticket.ticketNumber}
                            </span>
                            <span className="text-[10px] font-mono bg-yellow-400/5 text-yellow-400/90 border border-yellow-400/10 px-2 py-0.5 rounded font-bold uppercase">
                              {ticket.service}
                            </span>
                            {ticket.paymentType === "Pay Now" && (
                              <span className="text-[9px] font-mono bg-red-500/15 text-red-450 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse font-bold uppercase">
                                🚨 Urgent Alert
                              </span>
                            )}
                            {ticket.promoCode && (
                              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                Promo: {ticket.promoCode}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs font-bold text-[#E8E4DC]">
                            {ticket.name} <span className="text-zinc-500 font-mono font-normal">({ticket.email})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-zinc-500">
                            {ticket.createdAt?.toDate ? ticket.createdAt.toDate().toLocaleString() : "Recently"}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setShowDetails(isExpanded ? null : ticket.id)}
                              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-mono transition-all cursor-pointer"
                              title="Toggle Detail View"
                            >
                              {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="p-1.5 bg-zinc-900 hover:bg-red-950/20 border border-zinc-800 hover:border-red-500/20 text-zinc-500 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                              title="Delete Ticket"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details section */}
                      {isExpanded && (
                        <div className="mt-5 pt-4 border-t border-zinc-850/60 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans animate-fade-in">
                          {/* Left: Metadata & Scheduling */}
                          <div className="space-y-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-900">
                            <h5 className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-extrabold border-b border-zinc-900 pb-1 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> Details Matrix
                            </h5>
                            <div className="space-y-1.5 text-zinc-400 font-mono text-[11px]">
                              <div>• Type: <span className="text-white">{ticket.paymentType}</span></div>
                              <div>• Date: <span className="text-white">{ticket.date}</span></div>
                              <div>• Time: <span className="text-white">{ticket.time} ({ticket.timezone})</span></div>
                              <div>• UUID: <span className="text-zinc-500 text-[9px]">{ticket.id}</span></div>
                            </div>
                          </div>

                          {/* Middle: Real-Time Email Routing Metadata (Requested by user) */}
                          <div className="space-y-3 bg-zinc-950/40 p-3 rounded-lg border border-zinc-900">
                            <h5 className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-extrabold border-b border-zinc-900 pb-1 flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> Client Mail Routing
                            </h5>
                            <div className="space-y-1.5 text-zinc-400 font-mono text-[10px] leading-snug">
                              <div>• <strong className="text-zinc-500">To Admin:</strong> <span className="text-emerald-400">{ticket.emailRouting?.to || "7jntech@gmail.com"}</span></div>
                              <div>• <strong className="text-zinc-500">Customer Copy:</strong> <span className="text-yellow-400">{ticket.emailRouting?.customerCopyEmail || ticket.email}</span></div>
                              <div>• <strong className="text-zinc-500">BCC:</strong> <span className="text-teal-400">{ticket.emailRouting?.bcc || "7jntech@proton.me"}</span></div>
                              <div>• <strong className="text-zinc-500">Priority:</strong> <span className={ticket.paymentType === "Pay Now" ? "text-red-400 font-bold" : "text-zinc-400"}>{ticket.paymentType === "Pay Now" ? "URGENT 🚨" : "Standard 📂"}</span></div>
                              {ticket.paymentType === "Pay Now" && (
                                <div className="text-[8.5px] text-red-300 font-bold border-t border-red-950/40 pt-1 mt-1 leading-normal">
                                  ⚡ Forwarded to Messenger (7jntech) & Direct Email (7jntech@gmail.com)
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Client Notes Request */}
                          <div className="space-y-2 md:col-span-1">
                            <h5 className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-extrabold pb-0.5 flex items-center gap-1 border-b border-zinc-900">
                              <Terminal className="w-3.5 h-3.5" /> Support Case Notes
                            </h5>
                            <p className="text-zinc-300 font-mono text-xs leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-900 min-h-[70px] whitespace-pre-wrap">
                              {ticket.note || "No custom note provided."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
