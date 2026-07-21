"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";

export function GameNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { gamePhase, soundEnabled, toggleSound, triggerPageTransition, playSfx } = useGame();

  // Hide nav during full screen loading screen on home
  if (pathname === "/" && gamePhase === "loading") {
    return null;
  }

  // Also hide on admin or terminal
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "HOME", href: "/", icon: "🗡️" },
    { label: "WORLD MAP", href: "/portfolio", icon: "🗺️" },
    { label: "CHARACTER", href: "/about", icon: "🛡️" },
    { label: "SKILL TREE", href: "/skills", icon: "⚡" },
    { label: "FAST TRAVEL", href: "/find-me", icon: "🛸" },
    { label: "QUEST BOARD", href: "/contact", icon: "📜" },
  ];

  const handleNavClick = (href: string) => {
    if (pathname === href) {
      playSfx("click");
      return;
    }
    triggerPageTransition(href, (url) => router.push(url));
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-3 pointer-events-none">
      <div className="game-panel rounded-2xl border border-gold/40 px-3 py-2 flex items-center justify-between gap-1 sm:gap-2 shadow-2xl pointer-events-auto backdrop-blur-xl bg-dark-steel/95">
        {/* Left Ornate Accent */}
        <div className="hidden md:flex items-center gap-1.5 px-2 border-r border-iron text-[11px] font-mono text-gold shrink-0">
          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
          <span className="font-bold">QUEST LOG V2</span>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.button
                key={item.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(item.href)}
                onMouseEnter={() => playSfx("hover")}
                className={`relative px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-rajdhani tracking-wider transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-gold/20 text-gold border border-gold/60 shadow-lg shadow-gold/10 font-extrabold"
                    : "text-slate-300 hover:text-white hover:bg-iron/50 border border-transparent"
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden xs:inline sm:inline">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-gold rounded-full shadow-sm shadow-gold"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right Audio / Settings Controls */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-iron shrink-0">
          <button
            onClick={() => {
              toggleSound();
              if (!soundEnabled) playSfx("click");
            }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono border transition ${
              soundEnabled
                ? "bg-gold/15 text-gold border-gold/40 hover:bg-gold/25"
                : "bg-iron/40 text-slate-500 border-iron hover:text-slate-300"
            }`}
            title={soundEnabled ? "Mute Game SFX" : "Enable Game SFX"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>
      </div>
    </div>
  );
}
