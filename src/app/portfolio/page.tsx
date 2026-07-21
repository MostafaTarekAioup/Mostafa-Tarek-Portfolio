"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { PageTransition } from "@/components/game-ui/PageTransition";
import { GameNav } from "@/components/game-ui/GameNav";
import { SceneWrapper } from "@/components/three/SceneWrapper";
import { ParticleField } from "@/components/three/ParticleField";
import { WorldMapScene } from "@/components/three/WorldMapScene";
import { ProjectPanel } from "@/components/portfolio/ProjectPanel";
import { RuneButton } from "@/components/game-ui/RuneButton";

interface RawProject {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags?: string;
  tools?: string;
  description?: string;
  images?: string;
}

interface ProjectBeaconData {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string[];
  tools: string[];
  description: string;
  images: string[];
  coords: [number, number, number];
}

export default function PortfolioWorldMapPage() {
  const { setActivePose, playSfx, setGamePhase } = useGame();
  const [projects, setProjects] = useState<ProjectBeaconData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<ProjectBeaconData | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  useEffect(() => {
    setGamePhase("exploring");
    setActivePose("portfolio");
  }, [setGamePhase, setActivePose]);

  const getArrayField = (fieldValue?: string): string[] => {
    if (!fieldValue) return [];
    try {
      if (fieldValue.startsWith("[")) {
        return JSON.parse(fieldValue);
      }
      return fieldValue.split(",").map((t) => t.trim());
    } catch {
      return ["react"];
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/projects");
        if (res.ok) {
          const rawData: RawProject[] = await res.json();
          const sorted = Array.isArray(rawData) ? [...rawData].sort((a, b) => b.id - a.id) : [];

          // Assign deterministic 3D coordinates on our 26x18 topographic map
          const withCoords: ProjectBeaconData[] = sorted.map((proj, idx) => {
            const cols = 4;
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            // Spread evenly with slight spiral/jitter offset
            const x = (col - (cols - 1) / 2) * 4.8 + Math.sin(idx * 2) * 0.8;
            const y = (row - 1.2) * 3.8 + Math.cos(idx * 2) * 0.8;
            const z = 0.1;
            return {
              id: proj.id,
              title: proj.title,
              imgUrl: proj.imgUrl,
              liveLink: proj.liveLink || "#",
              tags: getArrayField(proj.tags),
              tools: getArrayField(proj.tools),
              description: proj.description || "No architecture scroll located.",
              images: getArrayField(proj.images),
              coords: [x, y, z] as [number, number, number],
            };
          });

          setProjects(withCoords);
        }
      } catch (err) {
        console.error("Error fetching project beacons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const allFilters = ["ALL", "WEB", "MOBILE", "FULLSTACK", "AI & TOOLS"];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const tagStr = p.tags.join(" ").toLowerCase();
      const toolStr = p.tools.join(" ").toLowerCase();
      const titleStr = p.title.toLowerCase();

      const matchesSearch =
        !search ||
        titleStr.includes(search.toLowerCase()) ||
        tagStr.includes(search.toLowerCase()) ||
        toolStr.includes(search.toLowerCase());

      let matchesFilter = true;
      if (selectedFilter !== "ALL") {
        if (selectedFilter === "WEB") matchesFilter = tagStr.includes("web") || tagStr.includes("react") || tagStr.includes("next");
        else if (selectedFilter === "MOBILE") matchesFilter = tagStr.includes("mobile") || tagStr.includes("react native") || tagStr.includes("flutter");
        else if (selectedFilter === "FULLSTACK") matchesFilter = tagStr.includes("fullstack") || tagStr.includes("node") || tagStr.includes("prisma");
        else if (selectedFilter === "AI & TOOLS") matchesFilter = tagStr.includes("ai") || tagStr.includes("three") || toolStr.includes("ai") || tagStr.includes("tool");
      }

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, selectedFilter]);

  return (
    <PageTransition>
      <div className="relative w-screen h-screen overflow-hidden bg-void flex flex-col justify-between select-none">
        {/* Top Control HUD Bar */}
        <div className="relative z-30 p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-gradient-to-b from-void via-void/90 to-transparent pointer-events-auto">
          <div>
            <span className="text-[10px] font-mono text-gold tracking-widest uppercase block">
              REALM REGISTRY • ELDEN MAP ARCHITECTURE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-white tracking-wide flex items-center gap-2.5">
              <span>PORTFOLIO WORLD MAP</span>
              <span className="px-2 py-0.5 rounded-full bg-mana/15 text-mana border border-mana/40 text-xs font-mono font-bold">
                {filteredProjects.length} BEACONS
              </span>
            </h1>
          </div>

          {/* Search Input & View Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search beacons or tech..."
                className="w-full bg-dark-steel/90 border border-iron rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-gold transition shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-mono text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {allFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    playSfx("click");
                    setSelectedFilter(filter);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition shrink-0 border cursor-pointer ${
                    selectedFilter === filter
                      ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                      : "bg-dark-steel/70 text-slate-300 border-iron hover:border-gold/50 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}

              <button
                onClick={() => {
                  playSfx("click");
                  setViewMode((prev) => (prev === "3d" ? "grid" : "3d"));
                }}
                className="ml-2 px-3 py-1.5 rounded-lg bg-mana/20 border border-mana text-mana hover:bg-mana hover:text-black font-mono text-xs font-bold uppercase transition shrink-0 cursor-pointer shadow-sm"
              >
                {viewMode === "3d" ? "📜 JOURNAL VIEW" : "🗺️ 3D MAP VIEW"}
              </button>
            </div>
          </div>
        </div>

        {/* Center Canvas or Grid */}
        <div className="relative flex-1 w-full overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gold font-mono space-y-3 z-20">
              <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
              <span className="text-xs tracking-widest uppercase animate-pulse">
                DISCOVERING REALM BEACONS FROM DATABASE...
              </span>
            </div>
          ) : viewMode === "3d" ? (
            <div className="absolute inset-0 z-10">
              <SceneWrapper cameraPosition={[0, 4.2, 8.8]} fov={45}>
                <ParticleField count={160} color="#c8a962" speed={0.15} size={0.035} />
                <WorldMapScene
                  projects={filteredProjects}
                  selectedId={selectedProject?.id || null}
                  onSelectProject={(proj) => {
                    setSelectedProject(proj);
                  }}
                />
              </SceneWrapper>
            </div>
          ) : (
            /* Journal Card Grid View */
            <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 pb-28 z-20 pointer-events-auto">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      playSfx("click");
                      setSelectedProject(proj);
                    }}
                    className="game-panel rounded-xl overflow-hidden border border-iron hover:border-gold transition-all duration-300 flex flex-col justify-between h-[380px] group cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-gold/10"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-dark-steel border-b border-iron">
                      <img
                        src={proj.imgUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />
                      <span className="absolute top-2 right-2 px-2 py-1 bg-void/80 border border-gold/40 text-gold font-mono text-[10px] rounded">
                        BEACON #{proj.id}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                      <div>
                        <h3 className="text-base font-bold font-rajdhani text-white group-hover:text-gold transition truncate">
                          {proj.title}
                        </h3>
                        <p className="text-xs font-rajdhani text-slate-300 line-clamp-2 mt-1">
                          {proj.description || "Click to inspect realm architecture."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3 overflow-hidden max-h-12">
                        {proj.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-mana/15 text-mana border border-mana/30 font-mono text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 mt-3 border-t border-iron/60 flex items-center justify-between">
                        <span className="font-mono text-xs text-gold flex items-center gap-1 font-bold">
                          🔍 INSPECT SCROLL
                        </span>
                        <a
                          href={proj.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded bg-gold/20 hover:bg-gold text-gold hover:text-black font-mono text-xs font-bold transition border border-gold/50"
                        >
                          FAST TRAVEL ➔
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Helper Hint Overlay */}
        {viewMode === "3d" && (
          <div className="relative z-20 pointer-events-none pb-16 pt-2 text-center text-xs font-mono text-slate-400 bg-gradient-to-t from-void via-void/80 to-transparent">
            <span>MAP COMMANDS: CLICK ANY GLOWING BEACON OBELISK TO INSPECT PROJECT DETAILS & LAUNCH DEMO</span>
          </div>
        )}

        {/* Slide-in Project Details Panel */}
        <ProjectPanel project={selectedProject} onClose={() => setSelectedProject(null)} />

        <GameNav />
      </div>
    </PageTransition>
  );
}
