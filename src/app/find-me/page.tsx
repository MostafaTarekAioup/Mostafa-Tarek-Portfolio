"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { PageTransition } from "@/components/game-ui/PageTransition";
import { GameNav } from "@/components/game-ui/GameNav";
import { RuneButton } from "@/components/game-ui/RuneButton";
import { SceneWrapper } from "@/components/three/SceneWrapper";
import { ParticleField } from "@/components/three/ParticleField";
import { motion } from "framer-motion";

interface FastTravelNode {
  id: string;
  title: string;
  code: string;
  url: string;
  type: "external" | "copy";
  copyText?: string;
  icon: string;
  tier: "gold" | "mana" | "ember" | "nature";
  status: "ONLINE" | "STANDBY" | "ENCRYPTED";
  signal: number;
  description: string;
}

export default function FastTravelFindMePage() {
  const { setActivePose, playSfx, setGamePhase } = useGame();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [teleportingId, setTeleportingId] = useState<string | null>(null);

  useEffect(() => {
    setGamePhase("exploring");
    setActivePose("findMe");
  }, [setGamePhase, setActivePose]);

  const stations: FastTravelNode[] = [
    {
      id: "github",
      title: "GitHub Code Forge",
      code: "STATION_ALPHA_GH",
      url: "https://github.com/MostafaTarekAioup",
      type: "external",
      icon: "🌌",
      tier: "gold",
      status: "ONLINE",
      signal: 99.8,
      description: "Primary repository forge containing front-end frameworks, Three.js experiments, and open-source contributions.",
    },
    {
      id: "linkedin",
      title: "LinkedIn Guild Hall",
      code: "STATION_BETA_LI",
      url: "https://www.linkedin.com/in/mostafa-tarek-050936193",
      type: "external",
      icon: "⚡",
      tier: "mana",
      status: "ONLINE",
      signal: 98.4,
      description: "Professional networking hub for engineering alliances, commercial referrals, and career recommendations.",
    },
    {
      id: "email",
      title: "Encrypted Mail Courier",
      code: "STATION_GAMMA_ML",
      url: "mailto:mostafatarekaioup@gmail.com",
      type: "copy",
      copyText: "mostafatarekaioup@gmail.com",
      icon: "📜",
      tier: "ember",
      status: "ONLINE",
      signal: 99.9,
      description: "Direct priority dispatch for contract terms, freelance proposals, and technical architecture reviews.",
    },
    {
      id: "phone",
      title: "Priority Telemetry Line",
      code: "STATION_DELTA_PH",
      url: "tel:+201094855028",
      type: "copy",
      copyText: "+201094855028",
      icon: "🛸",
      tier: "nature",
      status: "STANDBY",
      signal: 94.2,
      description: "Direct WhatsApp and vocal transmission relay located in Cairo, Egypt (UTC+3 Sector).",
    },
  ];

  const handleAction = (station: FastTravelNode) => {
    playSfx("click");
    if (station.type === "copy" && station.copyText) {
      navigator.clipboard.writeText(station.copyText);
      setCopiedId(station.id);
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      setTeleportingId(station.id);
      setTimeout(() => {
        setTeleportingId(null);
        window.open(station.url, "_blank", "noopener,noreferrer");
      }, 600);
    }
  };

  const tierBorderStyles: Record<string, string> = {
    gold: "border-gold/60 hover:border-gold glow-gold bg-dark-steel/80",
    mana: "border-mana/60 hover:border-mana glow-mana bg-dark-steel/80",
    ember: "border-ember/60 hover:border-ember glow-ember bg-dark-steel/80",
    nature: "border-nature/60 hover:border-nature bg-dark-steel/80",
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen w-screen overflow-x-hidden bg-void pb-28 pt-6 px-4 sm:px-8 md:px-12 select-none">
        {/* Background 3D Portal Effect */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          <SceneWrapper cameraPosition={[0, 0, 5]} fov={50} interactive={false}>
            <ParticleField count={140} color="#00f0ff" speed={0.3} size={0.045} spread={[16, 14, 10]} />
            <ParticleField count={80} color="#c8a962" speed={0.15} size={0.03} spread={[14, 12, 8]} />
          </SceneWrapper>
        </div>

        {/* Header */}
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-iron/60 pb-6 mb-8">
          <div>
            <span className="text-[10px] font-mono text-gold tracking-widest uppercase block mb-1">
              PORTAL NETWORK • SOCIAL BEACONS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-cinzel text-white tracking-wide flex items-center gap-3">
              <span>FAST TRAVEL STATIONS</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-mana/20 text-mana border border-mana/50">
                4 WARP GATES
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-rajdhani text-slate-300 mt-1">
              Select any teleport obelisk below to establish a direct secure link or copy transmission coordinates.
            </p>
          </div>

          <div className="bg-dark-steel/90 border border-iron px-4 py-2 rounded-xl flex items-center gap-3 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-nature animate-ping" />
            <span className="text-slate-300">SECTOR: CAIRO CENTRAL (UTC+3)</span>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {stations.map((station, index) => {
            const isCopied = copiedId === station.id;
            const isWarping = teleportingId === station.id;

            return (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
                onClick={() => handleAction(station)}
                onMouseEnter={() => playSfx("hover")}
                className={`group relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl overflow-hidden min-h-[260px] ${tierBorderStyles[station.tier]}`}
              >
                {/* Teleport Animation Overlay when clicked */}
                {isWarping && (
                  <div className="absolute inset-0 bg-void/90 backdrop-blur-md z-20 flex flex-col items-center justify-center space-y-2 animate-fadeIn">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gold animate-spin" />
                    <span className="text-xs font-mono font-bold text-gold uppercase animate-pulse">
                      OPENING WARP GATE TO {station.title}...
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between border-b border-iron/60 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{station.icon}</span>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                          {station.code}
                        </span>
                        <h3 className="text-xl font-bold font-rajdhani text-white group-hover:text-gold transition">
                          {station.title}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-void border border-iron text-slate-300">
                      ● {station.status}
                    </span>
                  </div>

                  <p className="text-sm font-rajdhani text-slate-200 leading-relaxed">
                    {station.description}
                  </p>

                  {station.type === "copy" && station.copyText && (
                    <div className="mt-4 p-2.5 bg-void/80 rounded-lg border border-iron/80 flex items-center justify-between font-mono text-xs text-slate-300">
                      <span className="truncate">{station.copyText}</span>
                      <span className="text-gold font-bold shrink-0 ml-2">
                        {isCopied ? "✓ COPIED TO CLIPBOARD!" : "[CLICK TO COPY]"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-iron/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>SIGNAL INTEGRITY:</span>
                    <span className="text-nature font-bold">{station.signal}%</span>
                  </div>

                  <RuneButton
                    variant={station.tier === "gold" ? "primary" : "secondary"}
                    size="sm"
                    glow
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(station);
                    }}
                  >
                    {station.type === "copy"
                      ? isCopied
                        ? "COPIED TO SCROLL ✓"
                        : "COPY TRANSMISSION CODE ➔"
                      : "TELEPORT NOW ➔"}
                  </RuneButton>
                </div>
              </motion.div>
            );
          })}
        </div>

        <GameNav />
      </div>
    </PageTransition>
  );
}
