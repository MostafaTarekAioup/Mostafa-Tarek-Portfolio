"use client";

import React, { useState } from "react";
import { Mail, Phone, Globe, Share2, Send, MessageSquare, CheckCircle2, Copy, Check } from "lucide-react";
import confetti from "canvas-confetti";

export function ContactWindow() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSent(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSent(false);
    }, 4000);
  };

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full overflow-y-auto select-none pr-1">
      {/* Left Column: Direct Contact & Social Cards */}
      <div className="w-full md:w-80 flex flex-col space-y-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" />
            <span>Direct Communications</span>
          </h3>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            I am currently available for full-time frontend roles, freelance projects, and consultations. Feel free to reach out via email or phone!
          </p>

          {/* Email Info */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-3 flex items-center justify-between group hover:border-cyan-500/40 transition">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] font-mono text-slate-400">EMAIL ADDRESS</div>
                <div className="text-xs font-semibold text-white truncate">mostafammt9@gmail.com</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard("mostafammt9@gmail.com", "email")}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition shrink-0"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Phone Info */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between group hover:border-emerald-500/40 transition">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">PHONE / WHATSAPP</div>
                <div className="text-xs font-semibold text-white">+201094855028</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard("+201094855028", "phone")}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition shrink-0"
              title="Copy Phone Number"
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://github.com/MostafaTarekAioup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3 transition text-white text-xs font-medium"
          >
            <Globe className="w-4 h-4 text-slate-300" />
            <span>GitHub Profile</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3 transition text-white text-xs font-medium"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Right Column: Terminal Styled Contact Form */}
      <div className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs text-slate-400 ml-2">send_message.sh</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
              AETHER-MAIL-CLIENT
            </span>
          </div>

          {sent ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Transmission Successful!</h4>
              <p className="text-xs text-slate-300 max-w-sm">
                Your message has been dispatched to Mostafa's inbox. He will review and respond as quickly as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    YOUR NAME <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1">
                  MESSAGE CONTENT <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message, project inquiry, or greeting here..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800/60 mt-6 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>STATUS: SECURE 256-BIT TLS</span>
          <span>SERVER: CAIRO-NODE-01</span>
        </div>
      </div>
    </div>
  );
}
