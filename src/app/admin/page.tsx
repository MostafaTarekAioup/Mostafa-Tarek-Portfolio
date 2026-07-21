"use client";

import React, { useEffect } from "react";
import { AdminWindow } from "@/components/windows/AdminWindow";
import { GameNav } from "@/components/game-ui/GameNav";
import { PageTransition } from "@/components/game-ui/PageTransition";
import { useGame } from "@/context/GameContext";

export default function AdminPage() {
  const { setActivePose, setGamePhase } = useGame();

  useEffect(() => {
    setGamePhase("exploring");
    setActivePose("admin");
  }, [setGamePhase, setActivePose]);

  return (
    <PageTransition>
      <div className="relative min-h-screen w-screen overflow-y-auto bg-void pb-28 pt-6 px-4 sm:px-8 md:px-12 select-none">
        {/* Header Strip */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-iron/60 pb-6 mb-8">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase block mb-1">
              AETHER OS // CMS COMMAND TERMINAL
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-cinzel text-white tracking-wide flex items-center gap-3">
              <span>ADMIN COMMAND CENTER</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/50">
                ROOT PRIVILEGED
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-rajdhani text-slate-300 mt-1">
              Live PostgreSQL ORM synchronization. Modify portfolio projects, technical competency matrices, and security passkeys.
            </p>
          </div>

          <div className="bg-dark-steel/90 border border-iron px-4 py-2 rounded-xl flex items-center gap-3 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">DB: PRISMA / POSTGRES ONLINE</span>
          </div>
        </div>

        {/* CMS Container */}
        <div className="max-w-6xl mx-auto game-panel p-4 sm:p-6 rounded-2xl border border-cyan-500/40 shadow-2xl bg-dark-steel/95 min-h-[600px] flex flex-col">
          <AdminWindow />
        </div>

        <GameNav />
      </div>
    </PageTransition>
  );
}
