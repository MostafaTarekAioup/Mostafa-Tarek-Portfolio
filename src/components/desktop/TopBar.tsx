"use client";

import React, { useState, useEffect } from "react";
import { useOS, WindowId } from "@/context/OSContext";
import {
  Wifi,
  BatteryCharging,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Terminal,
  Cpu,
  RotateCcw,
  Code,
  Check,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

const windowTitles: Record<WindowId, string> = {
  about: "Personal Profile & Bio",
  skills: "Skills & Tech Stack Matrix",
  projects: "Project Gallery & Portfolio",
  education: "Education & Certifications",
  contact: "Contact Me & Socials",
  admin: "OS Admin Dashboard",
  terminal: "Aether OS Terminal",
};

export function TopBar() {
  const { activeWindow, isAdminMode, setIsAdminMode, openWindow, closeWindow } = useOS();
  const [timeStr, setTimeStr] = useState<string>("");
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      setTimeStr(now.toLocaleDateString("en-US", options));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "1234";
    if (pinInput === correctPin) {
      setIsAdminMode(true);
      setShowPinModal(false);
      setPinInput("");
      setPinError(false);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.1 },
      });
      openWindow("admin");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleToggleAdmin = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      closeWindow("admin");
    } else {
      setShowPinModal(true);
    }
  };

  const resetDesktop = () => {
    ["skills", "projects", "education", "contact", "admin", "terminal"].forEach((w) =>
      closeWindow(w as WindowId)
    );
    openWindow("about");
    setShowMenu(false);
  };

  return (
    <>
      <header className="h-9 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-3 z-50 text-xs text-slate-300 select-none">
        {/* Left Section: OS Logo & Active Window */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-slate-800/80 transition text-cyan-400 font-medium"
            >
              <Cpu className="w-4 h-4 animate-spin-slow text-cyan-400" />
              <span className="font-semibold tracking-wide">AETHER OS</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute left-0 mt-1 w-52 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                  Mostafa Tarek Portfolio v2.0
                </div>
                <button
                  onClick={() => {
                    openWindow("about");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 transition flex items-center space-x-2"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>About Aether OS</span>
                </button>
                <button
                  onClick={() => {
                    openWindow("terminal");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 transition flex items-center space-x-2"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open Terminal</span>
                </button>
                <button
                  onClick={resetDesktop}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 transition flex items-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Windows</span>
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    handleToggleAdmin();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-cyan-500/20 hover:text-cyan-300 transition flex items-center space-x-2"
                >
                  {isAdminMode ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-400">Lock Admin Mode</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400">Unlock Admin Mode</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="h-3.5 w-px bg-slate-700/60" />

          {/* Active Window Title */}
          <div className="flex items-center space-x-1 sm:space-x-2 font-medium text-slate-200 truncate max-w-[110px] sm:max-w-none">
            <span className="text-cyan-400/80">▸</span>
            <span className="truncate">{activeWindow ? windowTitles[activeWindow] : "Desktop"}</span>
          </div>
        </div>

        {/* Right Section: Status Icons, Admin Badge, Clock */}
        <div className="flex items-center space-x-4">
          {/* Admin Mode Toggle Button */}
          <button
            onClick={handleToggleAdmin}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all shadow-sm ${
              isAdminMode
                ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-cyan-500/20 animate-pulse-slow"
                : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600"
            }`}
            title={isAdminMode ? "Admin Mode Enabled (Click to lock)" : "Click to unlock Admin Mode"}
          >
            {isAdminMode ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold tracking-wide text-[11px] text-cyan-300">
                  ADMIN MODE
                </span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Guest Mode</span>
              </>
            )}
          </button>

          {/* System Icons */}
          <div className="flex items-center space-x-2.5 text-slate-400">
            <Wifi className="w-3.5 h-3.5 hover:text-slate-200 transition" />
            <BatteryCharging className="w-3.5 h-3.5 hover:text-slate-200 transition text-emerald-400" />
          </div>

          <div className="h-3.5 w-px bg-slate-700/60" />

          {/* Clock */}
          <div className="font-mono text-slate-300 hover:text-white transition tracking-tight">
            {timeStr || "Loading clock..."}
          </div>
        </div>
      </header>

      {/* PIN Prompt Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-80 bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl relative text-center">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Admin Mode Authentication</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter PIN code to unlock Portfolio Dashboard (Default: <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">1234</code>)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                maxLength={8}
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-center tracking-widest text-lg font-mono text-white focus:outline-none focus:border-cyan-500 transition"
              />
              {pinError && (
                <div className="text-[11px] text-rose-400 font-medium">
                  Incorrect PIN code. Try 1234.
                </div>
              )}
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-semibold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
