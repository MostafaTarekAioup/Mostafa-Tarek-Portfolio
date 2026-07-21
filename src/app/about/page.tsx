"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { PageTransition } from "@/components/game-ui/PageTransition";
import { GameNav } from "@/components/game-ui/GameNav";
import { RuneButton } from "@/components/game-ui/RuneButton";
import { SceneWrapper } from "@/components/three/SceneWrapper";
import { ParticleField } from "@/components/three/ParticleField";
import { GameCharacter } from "@/components/three/GameCharacter";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  fullName?: string;
  name?: string;
  title?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  cvUrl?: string;
  experience?: string;
  phone?: string;
  city?: string;
}

interface Education {
  id: number;
  title: string;
  institution: string;
  period: string;
  description: string;
  courses: string;
  certificateUrl: string | null;
}

export default function AboutCharacterSheetPage() {
  const { setActivePose, playSfx, setGamePhase } = useGame();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bio" | "education" | "badges">("bio");

  useEffect(() => {
    setGamePhase("exploring");
    setActivePose("about");
  }, [setGamePhase, setActivePose]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profRes, eduRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/education"),
        ]);
        if (profRes.ok) setProfile(await profRes.json());
        if (eduRes.ok) setEducation(await eduRes.json());
      } catch (err) {
        console.error("Error loading profile/education:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bioParagraphs = profile?.bio
    ? profile.bio.split("\n\n")
    : [
        "Specialized in Front-End React development with over 5 years of commercial experience engineering high-performance, scalable, and responsive web applications.",
        "Experienced in transforming intricate design specifications into flawless code, designing custom 3D web experiences using Three.js, and leading front-end architecture decisions.",
      ];

  const getCourses = (edu: Education): string[] => {
    try {
      if (edu.courses && edu.courses.startsWith("[")) {
        return JSON.parse(edu.courses);
      }
      return edu.courses ? edu.courses.split(",").map((c) => c.trim()) : [];
    } catch {
      return [];
    }
  };

  const badges = [
    { id: 1, name: "REACT GRANDMASTER", desc: "Engineered scalable state architectures for 5+ commercial systems.", icon: "⚡", tier: "gold" },
    { id: 2, name: "THREE.JS ALCHEMIST", desc: "Forged interactive 3D particle fields and custom geometries.", icon: "🔮", tier: "mana" },
    { id: 3, name: "UDACITY VANGUARD", desc: "Graduated with honors from advanced React & Redux Nanodegree.", icon: "🎓", tier: "purple" },
    { id: 4, name: "ZERO DOWNTIME DEPLOYER", desc: "Shipped production releases with CI/CD automation & 99.9% uptime.", icon: "🚀", tier: "ember" },
    { id: 5, name: "AETHER ENGINE ARCHITECT", desc: "Built full-stack OS desktop & gamified quest logs from scratch.", icon: "🛡️", tier: "gold" },
    { id: 6, name: "PIXEL PERFECT WARRIOR", desc: "Achieved 100% responsive fidelity across mobile, tablet, and desktop.", icon: "🎯", tier: "nature" },
  ];

  const badgeTierStyles: Record<string, string> = {
    gold: "border-gold/60 bg-gold/10 text-gold",
    mana: "border-mana/60 bg-mana/10 text-mana",
    purple: "border-purple-400/60 bg-purple-500/10 text-purple-300",
    ember: "border-ember/60 bg-ember/10 text-ember",
    nature: "border-nature/60 bg-nature/10 text-nature",
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen w-screen overflow-x-hidden bg-void pb-28 pt-6 px-4 sm:px-8 md:px-12 select-none">
        {/* Top Header Strip */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-iron/60 pb-6 mb-8">
          <div>
            <span className="text-[10px] font-mono text-gold tracking-widest uppercase block mb-1">
              CHARACTER SHEET • ATTRIBUTE LEDGER
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-cinzel text-white tracking-wide flex items-center gap-3">
              <span>{profile?.fullName || profile?.name || "MOSTAFA TAREK"}</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-gold/20 text-gold border border-gold/50">
                LVL 45
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-rajdhani text-slate-300 mt-1">
              {profile?.title || profile?.role || "Senior Front-End Architect & 3D Web Engineer"}
            </p>
          </div>

          {/* RPG Stats Bar */}
          <div className="flex flex-wrap gap-3 sm:gap-4 bg-dark-steel/80 border border-iron p-3 sm:p-4 rounded-xl shadow-inner">
            <div className="text-center px-3 border-r border-iron/60">
              <span className="text-[10px] font-mono text-slate-400 block">ARCHITECTURE</span>
              <span className="text-lg font-black font-cinzel text-gold">98/100</span>
            </div>
            <div className="text-center px-3 border-r border-iron/60">
              <span className="text-[10px] font-mono text-slate-400 block">PERFORMANCE</span>
              <span className="text-lg font-black font-cinzel text-mana">99/100</span>
            </div>
            <div className="text-center px-3 border-r border-iron/60">
              <span className="text-[10px] font-mono text-slate-400 block">3D EXPERIENCE</span>
              <span className="text-lg font-black font-cinzel text-ember">95/100</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] font-mono text-slate-400 block">COMMERCIAL EXP</span>
              <span className="text-lg font-black font-cinzel text-nature">5+ YRS</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Character Inspection vs Right Lore & Quests */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Character Inspection Card & Equipment */}
          <div className="lg:col-span-5 space-y-6">
            <div className="game-panel rounded-2xl overflow-hidden border border-gold/40 p-4 sm:p-6 shadow-2xl relative flex flex-col justify-between min-h-[460px]">
              <div className="flex items-center justify-between z-10">
                <span className="px-2 py-0.5 rounded bg-void/80 border border-gold/40 text-gold font-mono text-xs font-bold">
                  GUILD: FRONT-END VANGUARD
                </span>
                <span className="text-xs font-mono text-nature animate-pulse">● ONLINE</span>
              </div>

              {/* 3D Character Canvas */}
              <div className="absolute inset-0 z-0">
                <SceneWrapper cameraPosition={[0, 0.4, 3.8]} fov={38}>
                  <ParticleField count={100} color="#c8a962" speed={0.15} size={0.035} />
                  <GameCharacter position={[0, -1.15, 0]} rotation={[0, -0.3, 0]} scale={1.1} />
                </SceneWrapper>
              </div>

              {/* Bottom Level / XP Progress Box */}
              <div className="relative z-10 bg-void/85 backdrop-blur-md border border-iron/80 p-4 rounded-xl mt-64 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gold font-bold">LEVEL 45 ARCHITECT</span>
                  <span className="text-slate-300">45,800 / 50,000 XP</span>
                </div>
                <div className="w-full h-2.5 bg-dark-steel rounded-full overflow-hidden border border-iron p-0.5">
                  <div className="h-full bg-gradient-to-r from-ember via-gold to-nature rounded-full w-[91%] shadow-sm" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-rajdhani text-slate-400 pt-1 border-t border-iron/40">
                  <span>LOCATION: {profile?.city || "Cairo, Egypt"}</span>
                  <span>STATUS: AVAILABLE FOR MISSION</span>
                </div>
              </div>
            </div>

            {/* Equipment Slot / CV Download Box */}
            <div className="game-panel rounded-xl p-5 border border-mana/50 shadow-xl space-y-3 bg-dark-steel/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-mana uppercase tracking-wider">
                  EQUIPPED LEGENDARY SCROLL
                </span>
                <span className="text-[10px] font-mono text-slate-400">[EQUIPMENT SLOT #1]</span>
              </div>
              <div className="flex items-center gap-3 bg-void/70 p-3 rounded-lg border border-iron">
                <span className="text-3xl">📜</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Full Commercial Curriculum Vitae</h4>
                  <p className="text-xs text-slate-400">PDF Document • Formal Engineering Resume</p>
                </div>
              </div>
              <a
                href={profile?.cvUrl || "/images/Mostafa Tarek_Aioup_CV.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <RuneButton variant="secondary" size="md" fullWidth glow icon="📥">
                  DOWNLOAD RESUME SCROLL (CV)
                </RuneButton>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Tabs (Bio vs Education vs Badges) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab Navigation Strip */}
            <div className="flex items-center gap-2 border-b border-iron/80 pb-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  playSfx("click");
                  setActiveTab("bio");
                }}
                className={`px-4 py-2 rounded-xl font-rajdhani font-bold text-sm uppercase transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "bio"
                    ? "bg-gold text-black border border-gold shadow-md shadow-gold/20"
                    : "bg-dark-steel/70 text-slate-300 border border-iron hover:border-gold/50 hover:text-white"
                }`}
              >
                <span>🛡️</span>
                <span>ATTRIBUTES & BIO</span>
              </button>

              <button
                onClick={() => {
                  playSfx("click");
                  setActiveTab("education");
                }}
                className={`px-4 py-2 rounded-xl font-rajdhani font-bold text-sm uppercase transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "education"
                    ? "bg-mana text-black border border-mana shadow-md shadow-mana/20"
                    : "bg-dark-steel/70 text-slate-300 border border-iron hover:border-mana/50 hover:text-white"
                }`}
              >
                <span>🎓</span>
                <span>ACADEMIC QUESTS ({education.length})</span>
              </button>

              <button
                onClick={() => {
                  playSfx("click");
                  setActiveTab("badges");
                }}
                className={`px-4 py-2 rounded-xl font-rajdhani font-bold text-sm uppercase transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "badges"
                    ? "bg-ember text-white border border-ember shadow-md shadow-ember/20"
                    : "bg-dark-steel/70 text-slate-300 border border-iron hover:border-ember/50 hover:text-white"
                }`}
              >
                <span>🏆</span>
                <span>ACHIEVEMENTS ({badges.length})</span>
              </button>
            </div>

            {/* Tab Content Panels */}
            <AnimatePresence mode="wait">
              {activeTab === "bio" && (
                <motion.div
                  key="bio"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="game-panel p-6 rounded-2xl border border-iron space-y-4 shadow-xl">
                    <h3 className="text-lg font-bold font-cinzel text-gold uppercase tracking-wider flex items-center gap-2 border-b border-iron/60 pb-3">
                      <span>📜 THE ARCHITECT&apos;S CHRONICLE</span>
                    </h3>
                    <div className="space-y-3 font-rajdhani text-base text-slate-200 leading-relaxed">
                      {bioParagraphs.map((para, i) => (
                        <p key={i} className="text-slate-200/95">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="game-panel p-5 rounded-xl border border-iron/80 space-y-2">
                      <span className="text-xs font-mono text-gold uppercase font-bold block">
                        CORE COMBAT STYLE
                      </span>
                      <h4 className="text-base font-bold font-rajdhani text-white">
                        React & Next.js Architecture
                      </h4>
                      <p className="text-xs font-rajdhani text-slate-300 leading-relaxed">
                        Expertise in client-server components, state machine workflows, and modular UI components.
                      </p>
                    </div>

                    <div className="game-panel p-5 rounded-xl border border-iron/80 space-y-2">
                      <span className="text-xs font-mono text-mana uppercase font-bold block">
                        SPECIALIZED ENCHANTMENT
                      </span>
                      <h4 className="text-base font-bold font-rajdhani text-white">
                        Three.js & WebGL 3D Graphics
                      </h4>
                      <p className="text-xs font-rajdhani text-slate-300 leading-relaxed">
                        Custom particle systems, custom shaders, and low-poly 3D gamified user interfaces.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "education" && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {loading ? (
                    <div className="py-12 text-center text-slate-400 font-mono text-xs">
                      FETCHING ACADEMIC CREDENTIALS...
                    </div>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-gold/40 space-y-8 my-2">
                      {education.map((edu) => {
                        const courses = getCourses(edu);
                        const isDegree =
                          edu.title.toLowerCase().includes("bachelor") ||
                          edu.institution.toLowerCase().includes("university");

                        return (
                          <div key={edu.id} className="relative group">
                            {/* Timeline Node */}
                            <div
                              className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-void transition-transform duration-300 group-hover:scale-125 flex items-center justify-center ${
                                isDegree ? "border-gold shadow-sm shadow-gold" : "border-mana shadow-sm shadow-mana"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isDegree ? "bg-gold" : "bg-mana"}`} />
                            </div>

                            <div className="game-panel p-5 rounded-2xl border border-iron hover:border-gold transition duration-300 shadow-lg space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-iron/60 pb-3">
                                <div>
                                  <h4 className="text-lg font-bold font-rajdhani text-white group-hover:text-gold transition">
                                    {edu.title}
                                  </h4>
                                  <span className="text-xs font-mono text-mana">{edu.institution}</span>
                                </div>
                                <span className="px-3 py-1 rounded-lg bg-void border border-iron text-xs font-mono text-slate-300 self-start sm:self-auto">
                                  {edu.period}
                                </span>
                              </div>

                              {edu.description && (
                                <p className="text-sm font-rajdhani text-slate-300 leading-relaxed">
                                  {edu.description}
                                </p>
                              )}

                              {courses.length > 0 && (
                                <div className="pt-2">
                                  <span className="text-xs font-mono text-slate-400 block mb-2">
                                    CURRICULUM SPECIALIZATION NODES:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {courses.map((course, cIdx) => (
                                      <span
                                        key={cIdx}
                                        className="px-2.5 py-1 rounded bg-dark-steel border border-iron text-xs font-mono text-slate-200"
                                      >
                                        ⚡ {course}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {edu.certificateUrl && (
                                <div className="pt-3 flex justify-end">
                                  <a
                                    href={edu.certificateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-gold/15 border border-gold/50 text-gold hover:bg-gold hover:text-black transition font-mono text-xs font-bold"
                                  >
                                    VERIFY CREDENTIAL ↗
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "badges" && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className="game-panel p-5 rounded-2xl border border-iron hover:border-gold transition duration-300 flex items-start gap-4 shadow-lg"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shrink-0 ${badgeTierStyles[b.tier]}`}
                      >
                        {b.icon}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
                          ACHIEVEMENT UNLOCKED
                        </span>
                        <h4 className="text-base font-bold font-rajdhani text-white tracking-wide">
                          {b.name}
                        </h4>
                        <p className="text-xs font-rajdhani text-slate-300 leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <GameNav />
      </div>
    </PageTransition>
  );
}
