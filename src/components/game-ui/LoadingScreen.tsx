"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { RuneButton } from "@/components/game-ui/RuneButton";
import { SceneWrapper } from "@/components/three/SceneWrapper";
import { ParticleField } from "@/components/three/ParticleField";
import { GameCharacter } from "@/components/three/GameCharacter";

export function LoadingScreen() {
  const { setGamePhase, playSfx, loadingProgress, setLoadingProgress } = useGame();

  // Simulate asset initialization and loading progress
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 8;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setLoadingProgress(current);
    }, 180);

    return () => clearInterval(interval);
  }, [setLoadingProgress]);

  const handleStartGame = () => {
    playSfx("start");
    // Camera and character transition from loading to menu
    setGamePhase("menu");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-void flex items-center justify-between p-6 sm:p-12 md:p-16">
      {/* 3D Background & Character Layer */}
      <div className="absolute inset-0 z-0">
        <SceneWrapper cameraPosition={[0.5, 0.4, 4.2]} fov={40}>
          <ParticleField count={220} color="#ff6b35" speed={0.25} size={0.045} />
          <ParticleField count={120} color="#c8a962" speed={0.15} size={0.03} />
          <GameCharacter position={[1.4, -1.05, 0]} rotation={[0, -0.35, 0]} scale={1.05} />
        </SceneWrapper>
      </div>

      {/* Radial Vignette & Dark Forest Fog Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-radial from-transparent via-void/50 to-void pointer-events-none z-10" />

      {/* Left Content Area: Title & Start Menu */}
      <div className="relative z-20 max-w-xl flex flex-col justify-between h-full py-8 sm:py-12">
        {/* Top Header Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <span className="px-3 py-1 rounded border border-gold/50 bg-gold/10 text-gold font-mono text-xs tracking-widest uppercase font-bold shadow-sm">
            🛡️ LEVEL 45 • REACT MASTER
          </span>
          <span className="text-xs font-mono text-slate-400 tracking-wider">
            [AETHER ENGINE V2.0 ACTIVE]
          </span>
        </motion.div>

        {/* Center Title & Flavor Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-6 my-auto"
        >
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-mono tracking-[0.3em] text-ember uppercase font-extrabold block">
              INTERACTIVE QUEST LOG
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-cinzel text-white tracking-tight leading-none text-glow-gold">
              MOSTAFA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-200 to-gold">
                TAREK
              </span>
            </h1>
            <p className="text-base sm:text-lg font-rajdhani text-slate-300 tracking-wide font-medium max-w-md pt-2 leading-relaxed">
              Ascend through 5+ years of high-performance front-end architecture, interactive 3D web experiences, and scalable modern engineering.
            </p>
          </div>

          {/* Ornate Divider */}
          <div className="w-48 h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent" />

          {/* Loading Progress Bar vs Start Button */}
          <div className="pt-4">
            {loadingProgress < 100 ? (
              <div className="space-y-2 max-w-sm">
                <div className="flex items-center justify-between text-xs font-mono text-gold">
                  <span>INITIALIZING SCENE ASSETS...</span>
                  <span>{loadingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-dark-steel rounded-full overflow-hidden border border-iron p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-ember via-gold to-nature rounded-full transition-all duration-200 shadow-sm"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <RuneButton
                  variant="primary"
                  size="lg"
                  glow
                  onClick={handleStartGame}
                  icon={<span className="text-xl">⚔️</span>}
                  className="animate-pulse-slow font-black text-lg sm:text-xl px-10 py-4"
                >
                  START QUEST
                </RuneButton>
                <p className="text-[11px] font-mono text-slate-400 mt-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nature animate-ping" />
                  <span>Press START to enter character selection & world map</span>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom System Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xs font-mono text-slate-500 flex items-center justify-between max-w-md border-t border-iron/50 pt-4"
        >
          <span>© {new Date().getFullYear()} MOSTAFA TAREK</span>
          <span>THREE.JS • NEXT.JS 16</span>
        </motion.div>
      </div>
    </div>
  );
}
