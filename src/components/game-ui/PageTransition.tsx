"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { createPortal } from "react-dom";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = useGame();

  return (
    <>
      {/* Portal Teleport Transition Overlay */}
      {typeof window !== "undefined" &&
        document.body &&
        createPortal(
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100000] flex items-center justify-center bg-void/90 backdrop-blur-xl pointer-events-auto"
              >
                <motion.div
                  initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 1.5, rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold animate-spin" />
                    <div className="absolute inset-2 rounded-full border border-mana animate-ping" />
                    <span className="text-3xl font-cinzel text-gold font-bold">⚡</span>
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest text-gold uppercase animate-pulse">
                    FAST TRAVELING...
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Main Page Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full min-h-screen pb-20"
      >
        {children}
      </motion.div>
    </>
  );
}
