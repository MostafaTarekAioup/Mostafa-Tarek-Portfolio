"use client";

import React, { createContext, useContext, useState } from "react";

export type WindowId =
  | "about"
  | "skills"
  | "projects"
  | "education"
  | "contact"
  | "admin"
  | "terminal";

interface OSContextType {
  openWindows: WindowId[];
  activeWindow: WindowId | null;
  minimizedWindows: WindowId[];
  maximizedWindows: WindowId[];
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  windowOrder: WindowId[];
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [openWindows, setOpenWindows] = useState<WindowId[]>(["about"]);
  const [minimizedWindows, setMinimizedWindows] = useState<WindowId[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<WindowId[]>([]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>("about");
  const [windowOrder, setWindowOrder] = useState<WindowId[]>(["about"]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const focusWindow = (id: WindowId) => {
    setActiveWindow(id);
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    setWindowOrder((prev) => {
      const filtered = prev.filter((w) => w !== id);
      return [...filtered, id];
    });
  };

  const openWindow = (id: WindowId) => {
    if (!openWindows.includes(id)) {
      setOpenWindows((prev) => [...prev, id]);
    }
    focusWindow(id);
  };

  const closeWindow = (id: WindowId) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id));
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    setMaximizedWindows((prev) => prev.filter((w) => w !== id));
    setWindowOrder((prev) => {
      const filtered = prev.filter((w) => w !== id);
      if (activeWindow === id) {
        const nextActive = filtered[filtered.length - 1] || null;
        setActiveWindow(nextActive);
      }
      return filtered;
    });
  };

  const minimizeWindow = (id: WindowId) => {
    if (!minimizedWindows.includes(id)) {
      setMinimizedWindows((prev) => [...prev, id]);
    }
    if (activeWindow === id) {
      const remaining = windowOrder.filter((w) => w !== id && !minimizedWindows.includes(w));
      setActiveWindow(remaining[remaining.length - 1] || null);
    }
  };

  const maximizeWindow = (id: WindowId) => {
    setMaximizedWindows((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
    focusWindow(id);
  };

  return (
    <OSContext.Provider
      value={{
        openWindows,
        activeWindow,
        minimizedWindows,
        maximizedWindows,
        isAdminMode,
        setIsAdminMode,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        windowOrder,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error("useOS must be used within an OSProvider");
  }
  return context;
}
