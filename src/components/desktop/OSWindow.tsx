"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOS, WindowId } from "@/context/OSContext";
import { X, Minus, Square, Maximize2, Minimize2 } from "lucide-react";

interface OSWindowProps {
  id: WindowId;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultWidth?: number | string;
  defaultHeight?: number | string;
  minWidth?: number;
  minHeight?: number;
  defaultX?: number;
  defaultY?: number;
}

export function OSWindow({
  id,
  title,
  icon: Icon,
  children,
  defaultWidth = 850,
  defaultHeight = 580,
  minWidth = 400,
  minHeight = 300,
  defaultX = 120,
  defaultY = 60,
}: OSWindowProps) {
  const {
    openWindows,
    activeWindow,
    minimizedWindows,
    maximizedWindows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    windowOrder,
  } = useOS();

  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  const isOpen = openWindows.includes(id);
  const isMinimized = minimizedWindows.includes(id);
  const isMaximized = maximizedWindows.includes(id);
  const isActive = activeWindow === id;

  const zIndex = 10 + Math.max(0, windowOrder.indexOf(id));

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    focusWindow(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x)),
          y: Math.max(36, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      onClick={() => focusWindow(id)}
      style={{
        zIndex,
        ...(isMaximized
          ? {
              top: "36px",
              left: 0,
              width: "100vw",
              height: "calc(100vh - 90px)",
            }
          : {
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: typeof size.width === "number" ? `${size.width}px` : size.width,
              height: typeof size.height === "number" ? `${size.height}px` : size.height,
            }),
      }}
      className={`fixed flex flex-col glass-panel rounded-xl border transition-shadow duration-200 overflow-hidden ${
        isMinimized ? "hidden" : ""
      } ${
        isActive
          ? "border-cyan-500/50 shadow-2xl shadow-cyan-500/10 ring-1 ring-cyan-500/20"
          : "border-slate-800/80 shadow-xl opacity-90 hover:opacity-100"
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeWindow(id)}
        className={`h-10 px-3 flex items-center justify-between select-none cursor-move border-b transition-colors ${
          isActive
            ? "bg-slate-800/80 border-slate-700/80 text-white"
            : "bg-slate-900/80 border-slate-800/80 text-slate-400"
        }`}
      >
        {/* Left: Window Controls (Close, Minimize, Maximize) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center group transition"
            title="Close"
          >
            <X className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center group transition"
            title="Minimize"
          >
            <Minus className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center group transition"
            title="Maximize / Restore"
          >
            {isMaximized ? (
              <Minimize2 className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition" />
            ) : (
              <Maximize2 className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition" />
            )}
          </button>
        </div>

        {/* Center: Title & Icon */}
        <div className="flex items-center space-x-2 font-medium text-xs tracking-wide">
          {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
          <span>{title}</span>
        </div>

        {/* Right: Spacer for balance */}
        <div className="w-12 text-right text-[10px] font-mono text-slate-500">
          {isMaximized ? "MAX" : "WIN"}
        </div>
      </div>

      {/* Window Content Body */}
      <div className="flex-1 overflow-y-auto bg-slate-950/80 p-6 text-slate-200 relative">
        {children}
      </div>
    </div>
  );
}
