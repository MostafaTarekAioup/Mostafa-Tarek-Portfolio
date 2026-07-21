"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { GamePhase, CharacterPose } from "@/types/game";

interface GameContextType {
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;
  activePose: CharacterPose;
  setActivePose: (pose: CharacterPose) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSfx: (sfxName: "click" | "hover" | "portal" | "levelUp" | "start") => void;
  loadingProgress: number;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  isTransitioning: boolean;
  triggerPageTransition: (targetHref: string, routerPush: (url: string) => void) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gamePhase, setGamePhase] = useState<GamePhase>("loading");
  const [activePose, setActivePose] = useState<CharacterPose>("idle");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Web Audio API Synthesizer for high-tech / medieval SFX without external audio files
  const playSfx = useCallback(
    (sfxName: "click" | "hover" | "portal" | "levelUp" | "start") => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (sfxName === "hover") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } else if (sfxName === "click") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        } else if (sfxName === "start") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } else if (sfxName === "portal" || sfxName === "levelUp") {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sine";
          osc2.type = "triangle";
          osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
          osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
          osc1.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
          osc2.frequency.setValueAtTime(261.63, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 0.45);
          osc2.stop(ctx.currentTime + 0.45);
        }
      } catch (e) {
        console.warn("Audio sfx error:", e);
      }
    },
    [soundEnabled]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const triggerPageTransition = useCallback(
    (targetHref: string, routerPush: (url: string) => void) => {
      if (isTransitioning) return;
      playSfx("portal");
      setIsTransitioning(true);
      setTimeout(() => {
        routerPush(targetHref);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }, 350);
    },
    [isTransitioning, playSfx]
  );

  return (
    <GameContext.Provider
      value={{
        gamePhase,
        setGamePhase,
        activePose,
        setActivePose,
        soundEnabled,
        toggleSound,
        playSfx,
        loadingProgress,
        setLoadingProgress,
        isTransitioning,
        triggerPageTransition,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
