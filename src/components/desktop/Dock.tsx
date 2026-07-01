"use client";

import React from "react";
import { useOS, WindowId } from "@/context/OSContext";
import {
  UserCircle,
  Code2,
  LayoutGrid,
  GraduationCap,
  Mail,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Compass,
} from "lucide-react";

interface DockItem {
  id: WindowId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  glowClass: string;
}

const dockItems: DockItem[] = [
  {
    id: "about",
    label: "Personal Profile",
    icon: UserCircle,
    colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    glowClass: "shadow-cyan-500/30",
  },
  {
    id: "skills",
    label: "Skills Matrix",
    icon: Code2,
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    glowClass: "shadow-emerald-500/30",
  },
  {
    id: "projects",
    label: "Project Gallery",
    icon: LayoutGrid,
    colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    glowClass: "shadow-purple-500/30",
  },
  {
    id: "education",
    label: "Education & Certs",
    icon: GraduationCap,
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    glowClass: "shadow-amber-500/30",
  },
  {
    id: "contact",
    label: "Contact & Socials",
    icon: Mail,
    colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    glowClass: "shadow-rose-500/30",
  },
  {
    id: "findme",
    label: "Location Tracker",
    icon: Compass,
    colorClass: "text-cyan-300 bg-cyan-500/10 border-cyan-400/40",
    glowClass: "shadow-cyan-400/30",
  },
  {
    id: "terminal",
    label: "Aether Terminal",
    icon: Terminal,
    colorClass: "text-slate-300 bg-slate-800 border-slate-600",
    glowClass: "shadow-slate-500/30",
  },
];

export function Dock() {
  const { openWindows, activeWindow, minimizedWindows, openWindow, minimizeWindow, isAdminMode } = useOS();

  const handleDockClick = (id: WindowId) => {
    if (openWindows.includes(id)) {
      if (activeWindow === id && !minimizedWindows.includes(id)) {
        minimizeWindow(id);
      } else {
        openWindow(id);
      }
    } else {
      openWindow(id);
    }
  };

  return (
    <div className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-50 select-none max-w-[98vw] overflow-x-auto md:overflow-visible no-scrollbar">
      <div className="glass-dock px-2 py-1.5 sm:px-3 sm:py-2 rounded-2xl flex items-center space-x-1 sm:space-x-2 border border-slate-700/60 shadow-2xl bg-slate-900/85 backdrop-blur-2xl shrink-0">
        {dockItems.map((item) => {
          const isOpen = openWindows.includes(item.id);
          const isActive = activeWindow === item.id && !minimizedWindows.includes(item.id);
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group flex flex-col items-center shrink-0">
              {/* Tooltip */}
              <div className="absolute -top-10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 pointer-events-none bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap hidden sm:block">
                {item.label}
              </div>

              {/* Icon Button */}
              <button
                onClick={() => handleDockClick(item.id)}
                className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center border transition-all duration-200 transform sm:group-hover:-translate-y-2 sm:group-hover:scale-110 shadow-lg ${
                  item.colorClass
                } ${isActive ? `ring-2 ring-cyan-400 ${item.glowClass}` : ""}`}
              >
                <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              {/* Indicator Dot */}
              <div className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full mt-0.5 sm:mt-1 transition-all duration-200">
                {isActive ? (
                  <div className="w-2 sm:w-2.5 h-1 sm:h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                ) : isOpen ? (
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-400" />
                ) : (
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-transparent" />
                )}
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="h-7 sm:h-9 w-px bg-slate-700/80 mx-0.5 sm:mx-1 shrink-0" />

        {/* Admin Dashboard Dock Button */}
        <div className="relative group flex flex-col items-center shrink-0">
          <div className="absolute -top-10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 pointer-events-none bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap hidden sm:block">
            {isAdminMode ? "Admin Dashboard (Unlocked)" : "Admin Dashboard (Protected)"}
          </div>

          <button
            onClick={() => handleDockClick("admin")}
            className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center border transition-all duration-200 transform sm:group-hover:-translate-y-2 sm:group-hover:scale-110 shadow-lg ${
              isAdminMode
                ? "text-cyan-300 bg-cyan-500/20 border-cyan-400/60 shadow-cyan-500/40 ring-2 ring-cyan-400 animate-pulse"
                : "text-amber-400 bg-amber-500/10 border-amber-500/30"
            }`}
          >
            {isAdminMode ? (
              <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-300" />
            ) : (
              <ShieldAlert className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400" />
            )}
          </button>

          {/* Indicator Dot */}
          <div className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full mt-0.5 sm:mt-1 transition-all duration-200">
            {activeWindow === "admin" && !minimizedWindows.includes("admin") ? (
              <div className="w-2 sm:w-2.5 h-1 sm:h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            ) : openWindows.includes("admin") ? (
              <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-400" />
            ) : (
              <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-transparent" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
