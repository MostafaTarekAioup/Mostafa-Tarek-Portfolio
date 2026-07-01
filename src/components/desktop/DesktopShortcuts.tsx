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
  FileText,
  Globe,
} from "lucide-react";

interface ShortcutItem {
  id?: WindowId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  externalUrl?: string;
}

export function DesktopShortcuts() {
  const { openWindow, isAdminMode } = useOS();

  const shortcuts: ShortcutItem[] = [
    {
      id: "about",
      label: "Personal Profile",
      icon: UserCircle,
      colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "skills",
      label: "Skills Matrix",
      icon: Code2,
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "projects",
      label: "Project Gallery",
      icon: LayoutGrid,
      colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
    {
      id: "education",
      label: "Education & Certs",
      icon: GraduationCap,
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "contact",
      label: "Contact Me",
      icon: Mail,
      colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      id: "terminal",
      label: "OS Terminal",
      icon: Terminal,
      colorClass: "text-slate-300 bg-slate-800 border-slate-600",
    },
    {
      id: "admin",
      label: isAdminMode ? "Admin Panel" : "Admin Mode",
      icon: isAdminMode ? ShieldCheck : ShieldAlert,
      colorClass: isAdminMode
        ? "text-cyan-300 bg-cyan-500/20 border-cyan-400 animate-pulse"
        : "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      label: "Download CV.pdf",
      icon: FileText,
      colorClass: "text-red-400 bg-red-500/10 border-red-500/30",
      externalUrl: "/images/Mostafa Tarek_Aioup_CV.pdf",
    },
    {
      label: "GitHub Profile",
      icon: Globe,
      colorClass: "text-white bg-slate-800 border-slate-600",
      externalUrl: "https://github.com/MostafaTarekAioup",
    },
  ];

  return (
    <div className="absolute top-4 left-2 sm:top-8 sm:left-4 z-10 flex flex-col flex-wrap max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8rem)] gap-2 sm:gap-4 select-none max-w-[calc(100vw-1rem)] overflow-hidden pointer-events-auto">
      {shortcuts.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={() => {
              if (item.externalUrl) {
                window.open(item.externalUrl, "_blank");
              } else if (item.id) {
                openWindow(item.id);
              }
            }}
            onDoubleClick={() => {
              if (item.id) openWindow(item.id);
            }}
            className="group flex flex-col items-center w-16 sm:w-20 p-1.5 sm:p-2 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all text-center focus:outline-none focus:bg-cyan-500/20 focus:border-cyan-500/40"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-1 ${item.colorClass}`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="mt-1 text-[10px] sm:text-[11px] font-medium leading-tight text-slate-300 group-hover:text-white drop-shadow-md line-clamp-2">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
