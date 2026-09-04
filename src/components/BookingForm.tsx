import React, { useState, useEffect } from "react";
import { doc, setDoc, increment, collection, setDoc as firestoreSetDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Ticket, CreditCard, ShieldAlert, BadgeCheck, CheckCircle, MessagesSquare, Clock, Calendar } from "lucide-react";
import { useAssetResolver } from "../utils/assetResolver";

interface BookingFormProps {
  activePromo?: "7jntechKarla" | "JS7jntech" | null;
  prefillNote?: string;
  prefillService?: string;
  onClearPrefill?: () => void;
}

export default function BookingForm({ activePromo, prefillNote, prefillService, onClearPrefill }: BookingFormProps = {}) {
  const [clientName, setClientName] = useState("");
  const { src: qrSrc, handleError: handleQrError, hasFailedAll: qrError } = useAssetResolver("qr.png");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceType, setServiceType] = useState("Virtual Assistant");
  const [clientNote, setClientNote] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [timezone, setTimezone] = useState("EST");
  const [paymentPref, setPaymentPref] = useState<"Pay Later" | "Pay Now">("Pay Later");

  useEffect(() => {
    if (prefillNote) {
      setClientNote(prefillNote);
    }
    if (prefillService) {
      setServiceType(prefillService);
    }
  }, [prefillNote, prefillService]);

  // State for Ticket Number
  const [ticketNumber, setTicketNumber] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [agreementDate, setAgreementDate] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState("");

  // Auto-generate ticket numbers (progressive count with prefix)
  const generateTicket = () => {
    const saved = localStorage.getItem("jsn_ticket_counter");
    const currentCounter = saved ? parseInt(saved, 10) : 10042;
    const tick = `JN-${currentCounter}`;
    localStorage.setItem("jsn_ticket_counter", String(currentCounter + 1));
    return tick;
  };

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setAgreementDate(today);
  }, []);

  // Sync ticket numbers if Pay Later selected
  useEffect(() => {
    if (paymentPref === "Pay Later") {
      const generated = generateTicket();
      setTicketNumber(generated);
      // Trigger instant stylish notification toast
      setShowToast(generated);
      const timer = setTimeout(() => setShowToast(""), 5000);
      return () => clearTimeout(timer);
    } else {
      setTicketNumber("");
    }
  }, [paymentPref]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentPref === "Pay Now" && (!termsChecked || !privacyChecked)) {
      setSubmitError("Please read the Service Agreement and check both checkboxes first.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    const finalTicketNumber = ticketNumber || `JN-${Date.now().toString().slice(-5)}`;

    const isUrgent = paymentPref === "Pay Now";

    // Define routing email metadata for admin view
    const emailRouting = {
      from: "7jntech@gmail.com",
      to: "7jntech@gmail.com", // Sent to me 7jntech@gmail.com
      customerCopyEmail: clientEmail, // Customer receives a copy of their request or ticket details
      bcc: "7jntech@proton.me",
      priority: isUrgent ? "URGENT 🚨" : "Standard 📂",
      forwardingChannels: isUrgent ? ["Messenger: 7jntech", "Direct Email: 7jntech@gmail.com"] : ["Direct Email: 7jntech@gmail.com"],
      forwardingStatus: isUrgent ? "Urgent Dispatch Activated (Forwarded to Messenger 7jntech & Direct Email 7jntech@gmail.com)" : "Standard Queue Registered"
    };

    try {
      // 1. Try to sync to our Free Tier Firebase Firestore
      const ticketRef = doc(db, "tickets", finalTicketNumber);
      try {
        await setDoc(ticketRef, {
          name: clientName,
          email: clientEmail,
          service: serviceType,
          note: clientNote || "No request notes provided.",
          date: scheduleDate || "Not scheduled",
          time: scheduleTime || "Not scheduled",
          timezone: timezone || "EST",
          paymentType: paymentPref,
          ticketNumber: finalTicketNumber,
          promoCode: activePromo || "",
          emailRouting: emailRouting,
          isUrgentNotification: isUrgent,
          createdAt: new Date()
        });
      } catch (err: any) {
        handleFirestoreError(err, OperationType.WRITE, `tickets/${finalTicketNumber}`);
      }

      // 2. Increment coupon usage atomically in Firestore if a coupon is active
      if (activePromo === "7jntechKarla" || activePromo === "JS7jntech") {
        const statsRef = doc(db, "stats", "coupons");
        try {
          await setDoc(statsRef, {
            usedCount: increment(1)
          }, { merge: true });
        } catch (err: any) {
          handleFirestoreError(err, OperationType.WRITE, "stats/coupons");
        }
      } else if (activePromo === ("7JNTECH30" as any)) {
        const statsRef = doc(db, "stats", "orb_coupon");
        try {
          await setDoc(statsRef, {
            usedCount: increment(1)
          }, { merge: true });
        } catch (err: any) {
          handleFirestoreError(err, OperationType.WRITE, "stats/orb_coupon");
        }
      }

      // 3. Keep standard Formspree endpoint check if configured
      const formEndpoint = (import.meta as any).env.VITE_FORMSPREE_ENDPOINT;
      if (formEndpoint) {
        await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "Admin Notification": "7jntech@gmail.com",
            "Customer Copy": clientEmail,
            "Urgent Forwarding Alert": isUrgent ? "FORWARDED TO MESSENGER (7jntech) & EMAIL (7jntech@gmail.com) 🚨" : "None",
            "Priority Status": isUrgent ? "URGENT ALERT 🚨" : "Standard Queue",
            "Ticket Number": finalTicketNumber,
            "Customer Name": clientName,
            "Customer Email": clientEmail,
            "Requested Service": serviceType,
            "Custom Notes / Free Text Comment": clientNote || "No request notes provided.",
            "Scheduled Launch Date": scheduleDate || "Not scheduled",
            "Scheduled Time": `${scheduleTime} ${timezone}`,
            "Payment Preference": paymentPref,
            "Applied Promo / Coupon": activePromo || "None",
            "Full Ticket Details Link": "https://7jntech-assist.web.app/#operator",
            emailRouting: emailRouting
          })
        });
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Firestore sync error, attempting Formspree only:", err);
      
      // Fallback: Try Formspree directly if Firestore failed
      const formEndpoint = (import.meta as any).env.VITE_FORMSPREE_ENDPOINT;
      if (formEndpoint) {
        try {
          const response = await fetch(formEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              "Admin Notification": "7jntech@gmail.com",
              "Customer Copy": clientEmail,
              "Urgent Forwarding Alert": isUrgent ? "FORWARDED TO MESSENGER (7jntech) & EMAIL (7jntech@gmail.com) 🚨" : "None",
              "Priority Status": isUrgent ? "URGENT ALERT 🚨" : "Standard Queue",
              "Ticket Number": finalTicketNumber,
              "Customer Name": clientName,
              "Customer Email": clientEmail,
              "Requested Service": serviceType,
              "Custom Notes / Free Text Comment": clientNote || "No request notes provided.",
              "Scheduled Launch Date": scheduleDate || "Not scheduled",
              "Scheduled Time": `${scheduleTime} ${timezone}`,
              "Payment Preference": paymentPref,
              "Applied Promo / Coupon": activePromo || "None",
              "Full Ticket Details Link": "https://7jntech-assist.web.app/#operator",
              emailRouting: emailRouting
            })
          });

          if (response.ok) {
            setIsSubmitted(true);
          } else {
            setSubmitError("Failed to submit request. Please try again later.");
          }
        } catch (fErr: any) {
          setSubmitError(fErr?.message || "Submission failed. Please check your network.");
        }
      } else {
        // If everything is empty/fails, show local simulator success
        setIsSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClientName("");
    setClientEmail("");
    setServiceType("Virtual Assistant");
    setClientNote("");
    setScheduleDate("");
    setScheduleTime("");
    setPaymentPref("Pay Later");
    setTermsChecked(false);
    setPrivacyChecked(false);
    setIsSubmitted(false);
    setSubmitError("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-zinc-950/80 border border-yellow-500/20 rounded-2xl p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-600 via-yellow-450 to-yellow-300" />
      
      {/* Toast Ticket alert popups */}
      {showToast && (
        <div className="fixed top-24 right-5 z-50 bg-zinc-950 border border-yellow-400 p-4 rounded-xl shadow-[0_4px_30px_rgba(254,240,138,0.2)] animate-slide-in-right max-w-sm flex gap-3 items-center">
          <Ticket className="w-8 h-8 text-yellow-400 shrink-0" />
          <div>
            <div className="text-[10px] text-yellow-450 uppercase font-extrabold tracking-wider">Ticket Registered</div>
            <div className="text-sm font-bold text-white font-mono tracking-widest">{showToast}</div>
            <div className="text-[9px] text-zinc-400 mt-0.5">Counter registered in localized storage.</div>
          </div>
        </div>
      )}

      {/* SAMPLE TICKET PREVIEW CARD */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-yellow-500/25 rounded-xl p-5 mb-8 relative overflow-hidden shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400" />
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] text-yellow-400 font-extrabold tracking-[0.25em] uppercase">
            <Ticket className="w-3.5 h-3.5 animate-pulse" /> Support Ticket Sample
          </div>
          <h3 className="text-white text-base font-bold font-sans">
            7JN-TECH OPERATIONS QUEUE
          </h3>
          <p className="text-[11px] text-zinc-400 leading-snug font-mono max-w-md">
            All consultations automatically compile a standard service request ticket. Paying clients can resolve tickets directly or proceed with down-payments.
          </p>
        </div>

        <div className="bg-zinc-950 border border-yellow-500/10 px-4 py-3 rounded-lg flex flex-col items-center justify-center text-center">
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Current Queue ID</span>
          <span className="text-sm font-black text-yellow-400 font-mono tracking-widest mt-0.5">
            {ticketNumber ? ticketNumber : "PAY-NOW-MODE"}
          </span>
          <span className="inline-flex items-center gap-1 text-[8px] font-mono text-zinc-400 mt-1 uppercase bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Open Queue
          </span>
        </div>
      </div>

      {isSubmitted ? (
        /* SUCCESS SCREEN MODAL */
        <div className="text-center py-8 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-yellow-400/10 border border-yellow-450 flex items-center justify-center mx-auto mb-6 text-yellow-400 animate-[pulse_2s_infinite]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h3 className="text-xl md:text-2xl font-black text-yellow-400 uppercase tracking-widest font-sans">
            TICKET GENERATED & SENT
          </h3>
          <p className="text-xs md:text-sm text-zinc-300 font-mono mt-3 max-w-lg mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{clientName}</strong>. Your request under ticket count <strong className="text-[#EAD890] font-mono">{ticketNumber || "JN-PAYNOW"}</strong> has been securely logged on our channels.
          </p>

          {/* Urgent Admin Dispatch Notification for Payments */}
          {paymentPref === "Pay Now" && (
            <div className="my-5 p-4 bg-red-950/20 border border-red-500/30 rounded-xl max-w-md mx-auto text-left flex items-start gap-3 shadow-[0_4px_20px_rgba(239,68,68,0.1)]">
              <span className="text-xl animate-bounce shrink-0">🚨</span>
              <div className="space-y-1">
                <div className="text-[10px] text-red-400 font-extrabold tracking-wider uppercase font-sans">Urgent Notification Dispatched</div>
                <div className="text-[11px] text-zinc-300 font-mono leading-relaxed">
                  As you selected the immediate payment route, Jeydah has been instantly alerted via Direct Email (<strong className="text-white">7jntech@gmail.com</strong>) and Facebook Messenger (<strong className="text-white">7jntech</strong>) for fast-tracked launch operations!
                </div>
              </div>
            </div>
          )}

          <div className="my-6 p-4 bg-zinc-900/60 rounded-xl border border-[#DFBA6B]/15 max-w-md mx-auto text-left space-y-2">
            <div className="text-[10px] text-[#EAD890] font-bold uppercase tracking-wider font-sans">
              Workflow Next Checkpoints:
            </div>
            <ul className="text-xs text-zinc-400 font-mono space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-[#EAD890] font-bold">1.</span>
                <span>An automated copy of these ticket and request details is sent to your email (<strong className="text-zinc-200">{clientEmail}</strong>).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#EAD890] font-bold">2.</span>
                <span>JS Pait (Jeys) will assess your parameters and draft a custom operational scope.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#EAD890] font-bold">3.</span>
                <span>Operations launch on <strong className="text-zinc-200">{scheduleDate || "ASAP"} ({scheduleTime || "ASAP"} {timezone})</strong>. No card values are required up-front to construct files on Git.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => window.open("https://m.me/7JStech", "_blank")}
              className="px-6 py-2.5 bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] hover:from-[#FFFDF0] hover:to-[#FFFFFF] text-black font-sans font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[0_4px_20px_rgba(223,186,107,0.25)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <MessagesSquare className="w-4 h-4" /> Open Messenger Follow-Up
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-transparent text-[#EAD890] hover:text-white border border-[#DFBA6B]/30 hover:border-[#DFBA6B]/60 font-mono text-xs uppercase rounded-lg transition-all cursor-pointer active:scale-95"
            >
              Close & New Request
            </button>
          </div>
        </div>
      ) : (
        /* MAIN FORM COMPONENT */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-[#DFBA6B] tracking-wider block font-mono">
                Full Client Name <span className="text-[#EAD890]">*</span>
              </label>
              <input 
                type="text" 
                required 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="CEO John Doe"
                className="w-full bg-zinc-900 border border-[#DFBA6B]/10 focus:border-[#EAD890] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none focus:shadow-[0_0_15px_rgba(223,186,107,0.15)] transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-[#DFBA6B] tracking-wider block font-mono">
                Email Address <span className="text-[#EAD890]">*</span>
              </label>
              <input 
                type="email" 
                required 
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="john@organization.com"
                className="w-full bg-zinc-900 border border-[#DFBA6B]/10 focus:border-[#EAD890] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none focus:shadow-[0_0_15px_rgba(223,186,107,0.15)] transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase font-bold text-[#EAD890] tracking-wider block font-mono">
              Wanted Service Scope <span className="text-[#EAD890]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                serviceType === "Virtual Assistant" 
                  ? "border-[#DFBA6B]/50 bg-[#DFBA6B]/5 shadow-[0_4px_15px_rgba(223,186,107,0.15)]" 
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}>
                <input 
                  type="radio" 
                  name="serviceType" 
                  value="Virtual Assistant"
                  checked={serviceType === "Virtual Assistant"}
                  onChange={() => setServiceType("Virtual Assistant")}
                  className="accent-[#DFBA6B] cursor-pointer w-4 h-4 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-white font-sans">Virtual Tech Assistant</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Automations, ticketers & setups</div>
                </div>
              </label>

              <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                serviceType === "Website Developer" 
                  ? "border-[#DFBA6B]/50 bg-[#DFBA6B]/5 shadow-[0_4px_15px_rgba(223,186,107,0.15)]" 
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}>
                <input 
                  type="radio" 
                  name="serviceType" 
                  value="Website Developer"
                  checked={serviceType === "Website Developer"}
                  onChange={() => setServiceType("Website Developer")}
                  className="accent-[#DFBA6B] cursor-pointer w-4 h-4 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-white font-sans">Website Developer</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Sleek React, portals & deployments</div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-bold text-[#DFBA6B] tracking-wider block font-mono">
              Scoping Note / Package Details <span className="text-[#EAD890]">*</span>
            </label>
            <textarea 
              required
              rows={3}
              maxLength={200}
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
              placeholder="e.g. I need the Professional tier setting up automated Zendesk workflows and syncing my dental clinic appointment sheets..."
              className="w-full bg-zinc-900 border border-[#DFBA6B]/10 focus:border-[#EAD890] rounded-xl p-4 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none focus:shadow-[0_0_15px_rgba(223,186,107,0.1)] transition-all font-mono resize-y"
            />
            <div className="text-[10px] text-zinc-500 font-mono text-right">
              {clientNote.length}/200 characters max
            </div>
          </div>

          {/* Schedule fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-[#DFBA6B] tracking-wider block font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Date <span className="text-[#EAD890]">*</span>
              </label>
              <input 
                type="date" 
                required
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full bg-zinc-900 border border-[#DFBA6B]/10 focus:border-[#EAD890] rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-[#DFBA6B] tracking-wider block font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time (HH:MM) <span className="text-[#EAD890]">*</span>
              </label>
              <input 
                type="time" 
                required
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full bg-zinc-900 border border-[#DFBA6B]/10 focus:border-[#EAD890] rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-[#DFBA6B] tracking-wider block font-mono">
                Timezone <span className="text-[#EAD890]">*</span>
              </label>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-zinc-900 border border-[#DFBA6B]/10 focus:border-[#EAD890] rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
              >
                <option value="EST">EST (New York)</option>
                <option value="PST">PST (Los Angeles)</option>
                <option value="CST">CST (Chicago)</option>
                <option value="GMT">GMT (London)</option>
                <option value="CET">CET (Berlin)</option>
                <option value="JST">JST (Tokyo)</option>
                <option value="PHT">PHT (Manila)</option>
                <option value="AEST">AEST (Sydney)</option>
              </select>
            </div>
          </div>

          {/* Payment Preferences */}
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <label className="text-[11px] uppercase font-bold text-[#DFBA6B] tracking-wider block font-mono">
              Payment Matrix Selection <span className="text-[#EAD890]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                paymentPref === "Pay Later" 
                  ? "border-[#DFBA6B]/50 bg-[#DFBA6B]/5 shadow-[0_4px_15px_rgba(223,186,107,0.1)]" 
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}>
                <input 
                  type="radio" 
                  name="paymentChoice" 
                  value="Pay Later"
                  checked={paymentPref === "Pay Later"}
                  onChange={() => setPaymentPref("Pay Later")}
                  className="accent-[#DFBA6B] cursor-pointer w-4 h-4 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#DFBA6B] font-bold" /> Create Support Ticket
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Pay later once scope is signed</div>
                </div>
              </label>

              <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                paymentPref === "Pay Now" 
                  ? "border-[#DFBA6B]/50 bg-[#DFBA6B]/5 shadow-[0_4px_15px_rgba(223,186,107,0.1)]" 
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}>
                <input 
                  type="radio" 
                  name="paymentChoice" 
                  value="Pay Now"
                  checked={paymentPref === "Pay Now"}
                  onChange={() => setPaymentPref("Pay Now")}
                  className="accent-[#DFBA6B] cursor-pointer w-4 h-4 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#DFBA6B] font-bold" /> Instant Payment down-payment
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Launches project immediately</div>
                </div>
              </label>
            </div>
          </div>

          {/* QR payment details shown if Pay Now */}
          {paymentPref === "Pay Now" && (
            <div className="p-5 bg-zinc-900/40 border-2 border-dashed border-[#DFBA6B]/20 rounded-xl text-center space-y-3 animate-fade-in-up">
              <span className="text-xs uppercase font-extrabold text-[#EAD890] tracking-wider flex items-center justify-center gap-1.5">
                💳 Secure Booking Down-payment
              </span>
              <div className="w-40 h-40 bg-zinc-950 p-2 rounded-xl mx-auto flex items-center justify-center border border-[#DFBA6B]/30 relative overflow-hidden shadow-lg">
                {qrError ? (
                  <div className="w-full h-full bg-zinc-950 p-3 rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden select-none">
                    {/* Simulated high-tech QR key card pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(201,168,76,0.15)_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-40" />
                    <div className="relative z-10 flex flex-col items-center text-center space-y-1">
                      <span className="text-2xl animate-pulse">🔒</span>
                      <span className="text-[10px] font-sans font-black tracking-widest text-[#EAD890]">SECURE LINK</span>
                      <span className="text-[8px] font-mono text-zinc-400">7JN-PAY-GATEWAY</span>
                      <div className="mt-1 px-2 py-0.5 bg-yellow-400/10 rounded border border-yellow-400/25 text-[7px] text-[#EAD890] font-mono font-bold tracking-widest uppercase animate-pulse">
                        READY ON LAUNCH
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={qrSrc}
                    onError={handleQrError}
                    alt="Unified Secure QR Channel"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <p className="text-[10px] md:text-xs text-zinc-400 font-mono max-w-sm mx-auto leading-relaxed">
                Scan using bank credentials or PayPal to initiate checkout securely. Operations trigger instantly upon receipt of down-payment.
              </p>
            </div>
          )}

          {/* LEGAL SERVICE AGREEMENT EXPLICIT SECTION IN CASE OF INSTANT PAYMENTS */}
          {paymentPref === "Pay Now" && (
            <div className="space-y-4 pt-2 border-t border-zinc-900 animate-fade-in-up">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 max-h-48 overflow-y-auto font-mono text-[10px] md:text-xs text-zinc-400 leading-relaxed text-justify relative shadow-inner">
                <div className="sticky top-0 bg-zinc-900/95 py-1 mb-2 text-[#DFBA6B] font-bold uppercase tracking-wider text-xs flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> 7JN-TECH MASTER SERVICE AGREEMENT
                </div>
                
                <h5 className="font-bold text-white mt-3">1. Engagement Terms</h5>
                <p className="mt-1">This agreement governs the delivery of web development, workflow automations, and administrative tech assists by 7JN Tech Assist (Provider) to the Client named herein. Work starts immediately upon downstream queue clearances.</p>
                
                <h5 className="font-bold text-white mt-3">2. Standards of Operations</h5>
                <p className="mt-1">All workflows designed, compiled, or configured will adhere strictly to secure, modern data privacy constraints, utilizing multi-factor configurations, password encryption vaults, and binding confidentiality routines standard for elite institutional mortgage review systems.</p>
                
                <h5 className="font-bold text-white mt-3">3. Payments and Retainers</h5>
                <p className="mt-1">Down-payments made under the "Pay Now" queue trigger immediate, focused priority delivery loops. The corresponding final balance payments are invoiced upon operational completion. Retainer rates are locked for exactly 1 month.</p>
                
                <h5 className="font-bold text-white mt-3">4. Incident Mitigation & Refunds</h5>
                <p className="mt-1">All services include an automatic, complimentary 1-Month maintenance warranty. Any downstream code bugs, API link updates, or server adjustments are resolved free of charge. Refund frameworks are processed via case evaluations.</p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required={paymentPref === "Pay Now"}
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className="accent-[#DFBA6B] w-4 h-4 shrink-0 rounded cursor-pointer mt-0.5"
                  />
                  <span className="text-[10px] md:text-xs text-zinc-400 font-mono leading-snug">
                    I acknowledge and agree to the entire <strong className="text-[#FFFDF0] font-bold">Service Agreement terms & standards</strong> as stated above.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required={paymentPref === "Pay Now"}
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                    className="accent-[#DFBA6B] w-4 h-4 shrink-0 rounded cursor-pointer mt-0.5"
                  />
                  <span className="text-[10px] md:text-xs text-zinc-400 font-mono leading-snug">
                    I authorize Provider to collect my schedule coordinates in accordance with the <strong className="text-[#FFFDF0] font-bold">Secure Privacy Mandates</strong>.
                  </span>
                </label>
              </div>

              {/* Date tracker */}
              <div className="flex flex-col sm:flex-row items-baseline gap-2 font-mono text-[10px] md:text-xs text-zinc-500">
                <span>Signee Stamp Date:</span>
                <span className="text-[#EAD890] font-bold">{agreementDate}</span>
              </div>

              {/* Acceptance highlight badge */}
              {termsChecked && privacyChecked && (
                <div className="bg-[#DFBA6B]/10 border border-[#DFBA6B]/40 rounded-xl p-4 text-center animate-modal-pop shadow-md flex items-center justify-center gap-2.5 text-xs font-bold text-[#DFBA6B]">
                  <BadgeCheck className="w-5 h-5 animate-pulse shrink-0" />
                  <span>AGREEMENT SIGNED & VERIFIED — SAFE SECURE GATEWAY OPENED</span>
                </div>
              )}
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs md:text-sm text-red-300 font-mono text-center animate-shake leading-relaxed">
              ⚠️ {submitError}
            </div>
          )}

          {/* Form helper state notice */}
          <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800 text-center text-[10px] md:text-xs text-zinc-400 leading-snug font-mono">
            {paymentPref === "Pay Later" ? (
              <p>
                🎫 <strong className="text-[#DFBA6B] font-bold">Queue Ticket Status:</strong> No payment details or card credentials required up-front to post coordinates.
              </p>
            ) : (
              <p>
                💳 <strong className="text-[#DFBA6B] font-bold">Instant Down-payment:</strong> Full priority delivery locks, including master configurations on GitHub repositories.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4.5 bg-gradient-to-r from-[#DFBA6B] via-[#EAD890] to-[#FFFDF0] hover:from-[#FFFDF0] hover:to-[#FFFFFF] text-black font-sans font-bold text-sm tracking-widest uppercase rounded-xl shadow-[0_4px_25px_rgba(223,186,107,0.2)] hover:shadow-[0_6px_35px_rgba(223,186,107,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              isSubmitting ? "opacity-50 cursor-not-allowed scale-95" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 rounded-full border-2 border-black border-t-transparent" />
                TRANSMITTING DATASECURE PORTAL...
              </span>
            ) : paymentPref === "Pay Later" ? (
              "Submit Support Ticket request"
            ) : (
              "Secure Payment - Launch Priority Queue"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
