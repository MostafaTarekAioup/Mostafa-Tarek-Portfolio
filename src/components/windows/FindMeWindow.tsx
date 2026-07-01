"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Radar,
  History,
  Wifi,
  BatteryMedium,
  Clock,
  Plus,
  Minus,
  Navigation,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Activity,
  Radio,
  Layers,
  RefreshCw,
} from "lucide-react";

interface NodeLocation {
  id: string;
  name: string;
  code: string;
  status: "active" | "standby" | "offline";
  coords: string;
  lat: number;
  lng: number;
  signal: number;
  lastPing: string;
  description: string;
  top: string;
  left: string;
}

const NODES: NodeLocation[] = [
  {
    id: "cairo",
    name: "Cairo Central (HQ)",
    code: "NODE_ALPHA_01",
    status: "active",
    coords: "30.0444° N, 31.2357° E",
    lat: 30.0444,
    lng: 31.2357,
    signal: 98.6,
    lastPing: "0.2s ago",
    description: "Primary Development & Architecture Uplink. Operational 24/7.",
    top: "52%",
    left: "48%",
  },
  {
    id: "zagazig",
    name: "Zagazig Relay",
    code: "NODE_BETA_02",
    status: "standby",
    coords: "30.5877° N, 31.5020° E",
    lat: 30.5877,
    lng: 31.5020,
    signal: 84.2,
    lastPing: "1.4s ago",
    description: "Secondary Workspace & Backup Server Node.",
    top: "35%",
    left: "58%",
  },
  {
    id: "alex",
    name: "Alexandria Coastal Hub",
    code: "NODE_GAMMA_03",
    status: "offline",
    coords: "31.2001° N, 29.9187° E",
    lat: 31.2001,
    lng: 29.9187,
    signal: 0,
    lastPing: "3h ago",
    description: "Remote Relay Station - Currently Offline for Maintenance.",
    top: "22%",
    left: "35%",
  },
];

export function FindMeWindow() {
  const [selectedNode, setSelectedNode] = useState<NodeLocation>(NODES[0]);
  const [zoom, setZoom] = useState<number>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [radarActive, setRadarActive] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<"cyber" | "satellite">("cyber");
  const [logMessages, setLogMessages] = useState<string[]>([
    "SYS_INIT: Aether OS Location Tracker loaded.",
    "UPLINK: Connected to Cairo Central HQ (98.6% signal).",
    "GEO_SYNC: Egyptian Sector Grid aligned.",
  ]);

  const handleScan = () => {
    setIsScanning(true);
    setLogMessages((prev) => [
      `[${new Date().toLocaleTimeString()}] INITIATING RADAR SWEEP...`,
      ...prev.slice(0, 5),
    ]);
    setTimeout(() => {
      setIsScanning(false);
      setLogMessages((prev) => [
        `[${new Date().toLocaleTimeString()}] SWEEP COMPLETE: 3 Nodes detected. Cairo Central active.`,
        ...prev.slice(0, 5),
      ]);
    }, 1500);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden relative">
      {/* Top Status Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-cyan-400 font-mono">AETHER OS // TRACKER V2</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3" />
            <span className="font-mono text-[11px]">UPLINK: 99.9% ONLINE</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-slate-400 font-mono text-[11px]">
          <div className="flex items-center space-x-1 hover:text-cyan-400 cursor-pointer transition">
            <Wifi className="w-3.5 h-3.5" />
            <span>5G-UWB</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>60 FPS</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>UTC+3 CAIRO</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left/Center: Interactive Map Viewport */}
        <div className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center">
          {/* Cyber Grid & Map Backgrounds */}
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Background Map Image / Grid */}
            {mapMode === "cyber" ? (
              <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                alt="Satellite Map"
                className="w-full h-full object-cover opacity-25 mix-blend-luminosity filter contrast-150 brightness-75"
              />
            )}

            {/* Radar Sweep Animation Overlay */}
            {radarActive && (
              <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/20 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[350px] h-[350px] rounded-full border border-cyan-500/15 border-dashed" />
                <div className="absolute w-[200px] h-[200px] rounded-full border border-cyan-500/25" />
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent animate-spin"
                  style={{ animationDuration: "6s" }}
                />
              </div>
            )}

            {/* Crosshairs */}
            <div className="absolute w-full h-px bg-cyan-500/15 pointer-events-none" />
            <div className="absolute h-full w-px bg-cyan-500/15 pointer-events-none" />

            {/* Render Nodes on Map */}
            {NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-all duration-300"
                  style={{ top: node.top, left: node.left }}
                >
                  {/* Pulsing Outer Ring for Active Node */}
                  {node.status === "active" && (
                    <div className="absolute -inset-3 rounded-full bg-cyan-500/30 animate-ping" />
                  )}
                  {isSelected && (
                    <div className="absolute -inset-4 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: "10s" }} />
                  )}

                  {/* Node Dot Button */}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-125 ${
                      node.status === "active"
                        ? "bg-cyan-400 border-white shadow-cyan-400/80"
                        : node.status === "standby"
                        ? "bg-purple-500 border-slate-300 shadow-purple-500/50"
                        : "bg-slate-600 border-slate-400 opacity-60"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  </div>

                  {/* Hover/Selected Tooltip */}
                  <div
                    className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all pointer-events-none ${
                      isSelected
                        ? "bg-slate-900/95 border-cyan-500/60 text-cyan-300 opacity-100 scale-100"
                        : "bg-slate-900/80 border-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center space-x-1.5">
                      <span>{node.name}</span>
                      {node.status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">{node.coords}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Floating Controls Overlay */}
          <div className="absolute bottom-6 left-6 z-30 flex flex-col space-y-2">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-1 flex flex-col shadow-xl">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-800 my-0.5" />
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setSelectedNode(NODES[0])}
              className="w-10 h-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition shadow-xl group"
              title="Recenter on Cairo HQ"
            >
              <Navigation className="w-4.5 h-4.5 transform -rotate-45 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => setRadarActive(!radarActive)}
              className={`w-10 h-10 backdrop-blur-md border rounded-xl flex items-center justify-center transition shadow-xl ${
                radarActive
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-cyan-500/20"
                  : "bg-slate-900/80 border-slate-800 text-slate-500"
              }`}
              title="Toggle Radar Sweep"
            >
              <Radar className={`w-4.5 h-4.5 ${radarActive ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />
            </button>

            <button
              onClick={() => setMapMode(mapMode === "cyber" ? "satellite" : "cyber")}
              className="w-10 h-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl flex items-center justify-center text-purple-400 hover:bg-purple-500/20 transition shadow-xl"
              title="Switch Map Style"
            >
              <Layers className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Current Location Badge on Map */}
          <div className="absolute top-4 left-4 z-30 pointer-events-none">
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 shadow-2xl flex items-center space-x-2.5">
              <Compass className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Target Tracked</div>
                <div className="text-xs font-bold text-white tracking-wide">{selectedNode.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Telemetry & Node Details (Aether OS Style) */}
        <div className="w-80 md:w-88 bg-slate-900/90 backdrop-blur-2xl border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto no-scrollbar shadow-2xl relative">
          {/* Top Neon Glow Border */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60 shrink-0" />

          {/* Selected Node Header */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase font-bold flex items-center space-x-1">
                <span>ACTIVE UPLINK</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedNode.code}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight mb-2">{selectedNode.name}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.description}</p>
          </div>

          {/* Telemetry Block */}
          <div className="p-5 border-b border-slate-800/80 space-y-3.5">
            <h3 className="font-mono text-[10px] text-slate-400 tracking-wider uppercase font-bold border-b border-slate-800 pb-1">
              Telemetry & Coordinates
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Coordinates:</span>
                <span className="text-cyan-300 font-bold">{selectedNode.coords}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Last Ping:</span>
                <span className="text-purple-400">{selectedNode.lastPing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Signal Strength:</span>
                <span className={`font-bold ${selectedNode.signal > 50 ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedNode.signal}%
                </span>
              </div>

              {/* Signal Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedNode.signal > 50 ? "bg-gradient-to-r from-cyan-400 to-emerald-400" : "bg-rose-500"
                  }`}
                  style={{ width: `${selectedNode.signal}%` }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 border-b border-slate-800/80 grid grid-cols-2 gap-3">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/10 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? "Scanning..." : "Radar Scan"}</span>
            </button>
            <button
              onClick={() => setSelectedNode(NODES[0])}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Cairo HQ</span>
            </button>
          </div>

          {/* Nearby Nodes Registry */}
          <div className="p-5 flex-1 space-y-3">
            <h3 className="font-mono text-[10px] text-slate-400 tracking-wider uppercase font-bold">
              Available Network Nodes
            </h3>

            <div className="space-y-2">
              {NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          node.status === "active"
                            ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            : node.status === "standby"
                            ? "bg-purple-400"
                            : "bg-slate-600"
                        }`}
                      />
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? "text-cyan-300" : "text-slate-200"}`}>
                          {node.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {node.status.toUpperCase()} • {node.signal}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal Logs Feed */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center space-x-1">
                <History className="w-3 h-3" />
                <span>System Feed</span>
              </div>
              <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 font-mono text-[10px] space-y-1 max-h-24 overflow-y-auto no-scrollbar text-slate-400">
                {logMessages.map((msg, i) => (
                  <div key={i} className="leading-tight text-cyan-400/80 truncate">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
