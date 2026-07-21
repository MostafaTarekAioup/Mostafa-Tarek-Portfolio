"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: "gold" | "mana" | "ember" | "nature";
  children: React.ReactNode;
  width?: "md" | "lg" | "xl";
}

export function SidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeText,
  badgeColor = "gold",
  children,
  width = "lg",
}: SidePanelProps) {
  const { playSfx } = useGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        playSfx("click");
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, playSfx]);

  const widthStyles = {
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const badgeStyles = {
    gold: "bg-gold/15 text-gold border-gold/40",
    mana: "bg-mana/15 text-mana border-mana/40",
    ember: "bg-ember/15 text-ember border-ember/40",
    nature: "bg-nature/15 text-nature border-nature/40",
  };

  if (typeof window === "undefined" || !document.body) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              playSfx("click");
              onClose();
            }}
            className="absolute inset-0 bg-void/85 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-in Ornate Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${widthStyles[width]} h-full game-panel border-l border-gold/40 flex flex-col z-10 shadow-2xl overflow-hidden`}
          >
            {/* Ornate Corner Accents */}
            <div className="game-corner-tl" />
            <div className="game-corner-bl" />

            {/* Header Strip */}
            <div className="p-5 sm:p-6 border-b border-iron/80 bg-dark-steel/90 flex items-start justify-between gap-4 shrink-0 relative">
              <div>
                {badgeText && (
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border mb-1.5 ${badgeStyles[badgeColor]}`}
                  >
                    {badgeText}
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl font-black font-cinzel text-white tracking-wide flex items-center gap-2">
                  <span>{title}</span>
                </h2>
                {subtitle && (
                  <p className="text-xs sm:text-sm font-rajdhani text-slate-400 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  playSfx("click");
                  onClose();
                }}
                className="w-9 h-9 rounded-lg bg-iron/60 hover:bg-ember/20 hover:border-ember hover:text-ember border border-iron text-slate-300 flex items-center justify-center transition shrink-0 font-mono text-sm shadow-inner"
                title="Close [ESC]"
              >
                ✕
              </button>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 no-scrollbar">
              {children}
            </div>

            {/* Footer Border Accent */}
            <div className="h-1.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
