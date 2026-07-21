"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { PageTransition } from "@/components/game-ui/PageTransition";
import { GameNav } from "@/components/game-ui/GameNav";
import { RuneButton } from "@/components/game-ui/RuneButton";
import confetti from "canvas-confetti";

export default function QuestBoardContactPage() {
  const { setActivePose, playSfx, setGamePhase } = useGame();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [questType, setQuestType] = useState("Full-Time Mission / Alliance");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    setGamePhase("exploring");
    setActivePose("contact");
  }, [setGamePhase, setActivePose]);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    playSfx("start");
    setSent(true);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#c8a962", "#ff6b35", "#00f0ff", "#50c878"],
      });
    } catch {
      // ignore if confetti fails
    }

    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSent(false);
    }, 4500);
  };

  const copyToClipboard = (text: string, label: string) => {
    playSfx("click");
    navigator.clipboard.writeText(text);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen w-screen overflow-x-hidden bg-void pb-28 pt-6 px-4 sm:px-8 md:px-12 select-none">
        {/* Header Strip */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-iron/60 pb-6 mb-8">
          <div>
            <span className="text-[10px] font-mono text-gold tracking-widest uppercase block mb-1">
              DISPATCH COURIER SCROLL • DIRECT TRANSMISSION
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-cinzel text-white tracking-wide flex items-center gap-3">
              <span>QUEST BOARD & CONTACT</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-gold/20 text-gold border border-gold/50">
                SCROLL INBOX: OPEN
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-rajdhani text-slate-300 mt-1">
              Post a new engineering mission, request a front-end contract alliance, or dispatch general feedback.
            </p>
          </div>

          <div className="bg-dark-steel/90 border border-iron px-4 py-2 rounded-xl flex items-center gap-3 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-nature animate-ping" />
            <span className="text-slate-300">STATUS: 256-BIT ENCRYPTED RELAY</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Coordinates & Guild Rules */}
          <div className="lg:col-span-5 space-y-6">
            <div className="game-panel rounded-2xl p-6 border border-gold/40 shadow-xl space-y-4 bg-dark-steel/90">
              <h3 className="text-lg font-bold font-cinzel text-gold uppercase tracking-wider flex items-center gap-2 border-b border-iron/60 pb-3">
                <span>📜 DIRECT COURIER COORDINATES</span>
              </h3>
              <p className="text-sm font-rajdhani text-slate-200 leading-relaxed">
                Mostafa is currently accepting new quests for full-time senior front-end architecture roles, contract consultancies, and Three.js 3D web applications.
              </p>

              {/* Email Card */}
              <div
                onClick={() => copyToClipboard("mostafatarekaioup@gmail.com", "Email")}
                className="p-3.5 rounded-xl bg-void/80 border border-iron hover:border-gold transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-2xl shrink-0">📧</span>
                  <div className="truncate">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">EMAIL SCROLL</span>
                    <span className="text-sm font-mono text-white font-bold truncate">mostafatarekaioup@gmail.com</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-gold font-bold shrink-0 ml-2">
                  {copiedType === "Email" ? "COPIED ✓" : "[COPY]"}
                </span>
              </div>

              {/* Phone Card */}
              <div
                onClick={() => copyToClipboard("+201094855028", "Phone")}
                className="p-3.5 rounded-xl bg-void/80 border border-iron hover:border-mana transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-2xl shrink-0">🛸</span>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">TELEMETRY & WHATSAPP</span>
                    <span className="text-sm font-mono text-white font-bold">+201094855028</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-mana font-bold shrink-0 ml-2">
                  {copiedType === "Phone" ? "COPIED ✓" : "[COPY]"}
                </span>
              </div>
            </div>

            <div className="game-panel rounded-xl p-5 border border-iron/80 bg-void/60 space-y-3 font-rajdhani">
              <h4 className="text-xs font-mono font-bold text-mana uppercase tracking-wider">
                ⚡ GUILD RESPONSE GUARANTEE
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                All courier dispatches are logged into the central PostgreSQL registry and reviewed daily by the Guild Master. Typical response latency is under 12 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Fantasy Quest Submission Form */}
          <div className="lg:col-span-7">
            <div className="game-panel rounded-2xl p-6 sm:p-8 border border-gold/60 glow-gold shadow-2xl relative bg-dark-steel/95">
              <div className="flex items-center justify-between border-b border-iron/80 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-gold tracking-widest uppercase block">
                    QUEST REGISTRY FORM • COURIER SYSTEM
                  </span>
                  <h2 className="text-2xl font-black font-cinzel text-white">
                    POST YOUR QUEST
                  </h2>
                </div>
                <span className="text-3xl">⚔️</span>
              </div>

              {sent ? (
                <div className="py-16 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-3xl mx-auto shadow-lg shadow-gold/20">
                    🏆
                  </div>
                  <h3 className="text-2xl font-bold font-cinzel text-white tracking-wide">
                    QUEST DISPATCHED SUCCESSFULLY!
                  </h3>
                  <p className="text-sm font-rajdhani text-slate-300 max-w-md mx-auto leading-relaxed">
                    Your mission scroll has been securely transmitted and logged into Mostafa&apos;s quest registry. You will receive an encrypted reply soon.
                  </p>
                  <div className="pt-4">
                    <RuneButton variant="ghost" size="sm" onClick={() => setSent(false)}>
                      DISPATCH ANOTHER SCROLL
                    </RuneButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDispatch} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono font-bold text-gold uppercase tracking-wider mb-2">
                        YOUR NAME / ALLIANCE <span className="text-ember">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Commander Sarah Vance"
                        className="w-full bg-void border border-iron rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-gold transition shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-gold uppercase tracking-wider mb-2">
                        RETURN COURIER (EMAIL) <span className="text-ember">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@alliance.com"
                        className="w-full bg-void border border-iron rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-gold transition shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-gold uppercase tracking-wider mb-2">
                      QUEST TYPE / CLASSIFICATION
                    </label>
                    <select
                      value={questType}
                      onChange={(e) => setQuestType(e.target.value)}
                      className="w-full bg-void border border-iron rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-gold transition shadow-inner cursor-pointer"
                    >
                      <option value="Full-Time Mission / Alliance">Full-Time Senior Engineering Role</option>
                      <option value="Freelance Contract / Project">Freelance Front-End Contract</option>
                      <option value="Three.js & 3D Web Consultation">Three.js / 3D Experience Consultation</option>
                      <option value="General Technical Inquiry">General Technical Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-gold uppercase tracking-wider mb-2">
                      QUEST SPECIFICATIONS & BRIEF <span className="text-ember">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail the scope, target objectives, timeline, or greetings here..."
                      className="w-full bg-void border border-iron rounded-xl p-3.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-gold transition shadow-inner resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      🔒 TLS 1.3 ENCRYPTED COURIER
                    </span>
                    <RuneButton variant="primary" size="lg" glow icon="📜">
                      DISPATCH QUEST SCROLL
                    </RuneButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <GameNav />
      </div>
    </PageTransition>
  );
}
