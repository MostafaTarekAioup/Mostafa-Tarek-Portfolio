"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { NavItem, CharacterPose } from "@/types/game";
import { SceneWrapper } from "@/components/three/SceneWrapper";
import { ParticleField } from "@/components/three/ParticleField";
import { GameCharacter } from "@/components/three/GameCharacter";

export function MainMenu() {
  const router = useRouter();
  const { setActivePose, playSfx, triggerPageTransition, activePose } = useGame();

  const menuItems: NavItem[] = [
    {
      id: "portfolio",
      label: "WORLD MAP (PORTFOLIO)",
      href: "/portfolio",
      pose: "portfolio",
      description: "Explore the interactive Elden Ring style realm of 12+ commercial & personal applications.",
    },
    {
      id: "about",
      label: "CHARACTER PROFILE & BIO",
      href: "/about",
      pose: "about",
      description: "Inspect Level 45 attributes, commercial experience matrix, and academic credentials.",
    },
    {
      id: "skills",
      label: "TECHNICAL SKILL TREE",
      href: "/skills",
      pose: "skills",
      description: "Unlock core mastery nodes across React, Next.js, TypeScript, and Three.js 3D engines.",
    },
    {
      id: "findMe",
      label: "FAST TRAVEL STATIONS",
      href: "/find-me",
      pose: "findMe",
      description: "Teleport directly to GitHub code forges, LinkedIn guild halls, and social beacons.",
    },
    {
      id: "contact",
      label: "POST A NEW QUEST (CONTACT)",
      href: "/contact",
      pose: "contact",
      description: "Dispatch courier scrolls for freelance alliances, full-time missions, and consulting.",
    },
  ];

  const handleMenuItemClick = (href: string) => {
    triggerPageTransition(href, (url) => router.push(url));
  };

  const handleMouseEnter = (pose: CharacterPose) => {
    playSfx("hover");
    setActivePose(pose);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-void flex items-center justify-between p-6 sm:p-12 md:p-16">
      {/* 3D Background & Character Layer (Camera zoomed out slightly) */}
      <div className="absolute inset-0 z-0">
        <SceneWrapper cameraPosition={[0.2, 0.5, 4.6]} fov={42}>
          <ParticleField count={180} color="#ff6b35" speed={0.2} size={0.04} />
          <ParticleField count={100} color="#4a9eff" speed={0.15} size={0.035} />
          <GameCharacter position={[1.5, -1.1, 0]} rotation={[0, -0.4, 0]} scale={1.05} />
        </SceneWrapper>
      </div>

      {/* Dark left panel gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-transparent pointer-events-none z-10" />

      {/* Left Content Area: Stacked Character Menu */}
      <div className="relative z-20 max-w-xl w-full flex flex-col justify-between h-full py-6 sm:py-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-iron/60 pb-4">
          <div>
            <span className="text-[10px] font-mono text-gold tracking-widest uppercase block">
              MAIN MENU • QUEST LOG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white tracking-wide">
              SELECT DESTINATION
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-dark-steel border border-iron rounded text-xs font-mono text-slate-300">
            USE MOUSE HOVER
          </span>
        </div>

        {/* Stacked Menu Items List */}
        <div className="space-y-3.5 my-auto py-6">
          {menuItems.map((item, index) => {
            const isHovered = activePose === item.pose;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
                onMouseEnter={() => handleMouseEnter(item.pose)}
                onClick={() => handleMenuItemClick(item.href)}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isHovered
                    ? "game-panel border-gold glow-gold translate-x-3 scale-[1.02]"
                    : "bg-dark-steel/60 border-iron/80 hover:bg-dark-steel/90 hover:border-gold/50"
                }`}
              >
                {/* Left Active Glow Bar */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1.5 transition-all duration-300 ${
                    isHovered ? "bg-gold shadow-sm shadow-gold" : "bg-transparent group-hover:bg-gold/40"
                  }`}
                />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gold/80 font-bold">
                        [0{index + 1}]
                      </span>
                      <h3
                        className={`text-lg sm:text-xl font-bold font-rajdhani tracking-wider uppercase transition-colors ${
                          isHovered ? "text-gold text-glow-gold" : "text-white group-hover:text-gold"
                        }`}
                      >
                        {item.label}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-rajdhani text-slate-300 line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`text-xl transition-transform duration-300 ${
                      isHovered ? "translate-x-1.5 text-gold" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    ➔
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Flavor Bar */}
        <div className="border-t border-iron/60 pt-4 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nature animate-ping" />
            <span>CHARACTER POSE REACTS TO HOVER</span>
          </div>
          <span className="text-gold">CLICK TO ASCEND</span>
        </div>
      </div>
    </div>
  );
}
