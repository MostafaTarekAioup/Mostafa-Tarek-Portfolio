"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { PageTransition } from "@/components/game-ui/PageTransition";
import { GameNav } from "@/components/game-ui/GameNav";
import { SceneWrapper } from "@/components/three/SceneWrapper";
import { ParticleField } from "@/components/three/ParticleField";
import { SkillTreeScene } from "@/components/three/SkillTreeScene";
import { SkillNodeModal } from "@/components/skills/SkillNodeModal";

interface RawSkill {
  id: number;
  title: string;
  iconName: string;
  acquiredDate: string;
  sources?: string;
  category: string;
  proficiency: number;
}

interface SkillNodeData {
  id: number;
  title: string;
  iconName: string;
  acquiredDate: string;
  sources: string[];
  category: string;
  proficiency: number;
  coords: [number, number, number];
  hubCoords: [number, number, number];
}

export default function SkillsConstellationPage() {
  const { setActivePose, playSfx, setGamePhase } = useGame();
  const [skills, setSkills] = useState<SkillNodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeData | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  useEffect(() => {
    setGamePhase("exploring");
    setActivePose("skills");
  }, [setGamePhase, setActivePose]);

  const getSources = (src?: string): string[] => {
    if (!src) return ["Commercial Exp"];
    try {
      if (src.startsWith("[")) {
        return JSON.parse(src);
      }
      return src.split(",").map((s) => s.trim());
    } catch {
      return [src];
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/skills");
        if (res.ok) {
          const raw: RawSkill[] = await res.json();
          const sorted = Array.isArray(raw)
            ? [...raw].sort((a, b) => b.proficiency - a.proficiency)
            : [];

          // Assign category hubs and orbital node positions
          const categoryHubs: Record<string, [number, number, number]> = {
            Frontend: [-3.5, 1.5, 0],
            "UI/UX": [-1.2, 2.5, -0.5],
            Backend: [3.5, 1.5, 0],
            "AI & Tools": [1.2, -2.2, 0],
            Tools: [3.2, -1.8, -0.5],
            Other: [0, 0.5, 0],
          };

          const categoryCounters: Record<string, number> = {};

          const withCoords: SkillNodeData[] = sorted.map((skill) => {
            const cat = skill.category || "Frontend";
            const hub = categoryHubs[cat] || [-0.5, 0, 0];
            const idx = categoryCounters[cat] || 0;
            categoryCounters[cat] = idx + 1;

            // Calculate orbit angle around the category hub
            const angle = idx * ((Math.PI * 2) / 6) + idx * 0.4;
            const radius = 1.4 + (idx % 3) * 0.55;
            const x = hub[0] + Math.cos(angle) * radius;
            const y = hub[1] + Math.sin(angle) * radius;
            const z = hub[2] + ((idx % 2 === 0 ? 1 : -1) * 0.4);

            return {
              id: skill.id,
              title: skill.title,
              iconName: skill.iconName || "Code",
              acquiredDate: skill.acquiredDate || "2021",
              sources: getSources(skill.sources),
              category: cat,
              proficiency: skill.proficiency,
              coords: [x, y, z] as [number, number, number],
              hubCoords: hub,
            };
          });

          setSkills(withCoords);
        }
      } catch (err) {
        console.error("Error loading skills tree:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(skills.map((s) => s.category));
    return ["All", ...Array.from(set)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase()) ||
        s.sources.some((src) => src.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [skills, selectedCategory, search]);

  return (
    <PageTransition>
      <div className="relative w-screen h-screen overflow-hidden bg-void flex flex-col justify-between select-none">
        {/* Top Control HUD Bar */}
        <div className="relative z-30 p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-gradient-to-b from-void via-void/90 to-transparent pointer-events-auto">
          <div>
            <span className="text-[10px] font-mono text-gold tracking-widest uppercase block">
              CONSTELLATION REGISTRY • TECHNICAL SKILL TREE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-white tracking-wide flex items-center gap-2.5">
              <span>TECHNICAL SKILL TREE</span>
              <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/40 text-xs font-mono font-bold">
                {filteredSkills.length} NODES
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
                placeholder="Search skill nodes..."
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
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playSfx("click");
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition shrink-0 border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                      : "bg-dark-steel/70 text-slate-300 border-iron hover:border-gold/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => {
                  playSfx("click");
                  setViewMode((prev) => (prev === "3d" ? "grid" : "3d"));
                }}
                className="ml-2 px-3 py-1.5 rounded-lg bg-mana/20 border border-mana text-mana hover:bg-mana hover:text-black font-mono text-xs font-bold uppercase transition shrink-0 cursor-pointer shadow-sm"
              >
                {viewMode === "3d" ? "⬡ HEX GRID VIEW" : "🔮 3D TREE VIEW"}
              </button>
            </div>
          </div>
        </div>

        {/* Center Canvas or Hexagonal Grid */}
        <div className="relative flex-1 w-full overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gold font-mono space-y-3 z-20">
              <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
              <span className="text-xs tracking-widest uppercase animate-pulse">
                INITIALIZING CONSTELLATION NODES FROM DATABASE...
              </span>
            </div>
          ) : viewMode === "3d" ? (
            <div className="absolute inset-0 z-10">
              <SceneWrapper cameraPosition={[0, 0, 7.8]} fov={48}>
                <ParticleField count={180} color="#4a9eff" speed={0.2} size={0.035} />
                <SkillTreeScene
                  skills={filteredSkills}
                  selectedId={selectedSkill?.id || null}
                  onSelectSkill={(skill) => {
                    setSelectedSkill(skill);
                  }}
                />
              </SceneWrapper>
            </div>
          ) : (
            /* Hexagonal / Bento Grid Fallback View */
            <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 pb-28 z-20 pointer-events-auto">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSkills.map((skill) => {
                  const isMastery = skill.proficiency >= 90;
                  return (
                    <div
                      key={skill.id}
                      onClick={() => {
                        playSfx("click");
                        setSelectedSkill(skill);
                      }}
                      className={`game-panel rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between h-[210px] cursor-pointer shadow-lg group hover:-translate-y-1 ${
                        isMastery ? "border-gold/60 glow-gold bg-dark-steel/90" : "border-iron hover:border-mana"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">⚡</span>
                            <div>
                              <h3 className="text-base font-bold font-rajdhani text-white group-hover:text-gold transition">
                                {skill.title}
                              </h3>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {skill.category}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                              isMastery ? "bg-gold/20 text-gold border-gold" : "bg-mana/20 text-mana border-mana/50"
                            }`}
                          >
                            {skill.proficiency}%
                          </span>
                        </div>

                        <div className="w-full bg-void h-2 rounded-full overflow-hidden my-3 border border-iron p-0.5 shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isMastery
                                ? "bg-gradient-to-r from-ember via-gold to-nature"
                                : "bg-gradient-to-r from-dark-steel via-mana to-cyan-300"
                            }`}
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-iron/60 text-[11px] font-mono text-slate-400">
                        <span>ACQUIRED: {skill.acquiredDate}</span>
                        <span className="text-gold font-bold">🔍 INSPECT NODE</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Helper Hint Overlay */}
        {viewMode === "3d" && (
          <div className="relative z-20 pointer-events-none pb-16 pt-2 text-center text-xs font-mono text-slate-400 bg-gradient-to-t from-void via-void/80 to-transparent">
            <span>CONSTELLATION COMMANDS: CLICK ANY GLOWING SKILL NODE OR OCTAHEDRON HUB TO INSPECT PROFICIENCY & LORE</span>
          </div>
        )}

        <SkillNodeModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />

        <GameNav />
      </div>
    </PageTransition>
  );
}
