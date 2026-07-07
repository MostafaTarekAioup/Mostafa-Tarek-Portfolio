"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  Cpu,
  Award,
  Filter,
  X,
  Code2,
  Sparkles,
  CheckCircle2,
  Zap,
  TrendingUp,
  Layers,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  id: number;
  title: string;
  iconName: string;
  acquiredDate: string;
  sources: string;
  category: string;
  proficiency: number;
}

export function SkillsWindow() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        // Sort by proficiency descending so top skills appear first
        const sorted = Array.isArray(data)
          ? [...data].sort((a: Skill, b: Skill) => b.proficiency - a.proficiency)
          : data;
        setSkills(sorted);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    fetchSkills();
  }, []);

  const getSources = (skill: Skill): string[] => {
    try {
      if (skill.sources.startsWith("[")) {
        return JSON.parse(skill.sources);
      }
      return skill.sources.split(",").map((s) => s.trim());
    } catch {
      return ["Self-Taught & Commercial Exp"];
    }
  };

  const categories = [
    "All",
    ...Array.from(new Set(skills.map((s) => s.category)))
  ];

  const filteredSkills = skills.filter((s) => {
    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;
    const sources = getSources(s);
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      sources.some((src) => src.toLowerCase().includes(search.toLowerCase())) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate quick metrics
  const avgProficiency =
    skills.length > 0
      ? Math.round(
          skills.reduce((acc, curr) => acc + curr.proficiency, 0) / skills.length
        )
      : 0;

  const masteryCount = skills.filter((s) => s.proficiency >= 90).length;

  return (
    <div className="flex flex-col min-h-full space-y-6 text-slate-100 font-sans pb-4">
      {/* Top Console Bar: Competency Stats & Filter Engine */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/90 backdrop-blur-xl shadow-xl flex flex-col gap-4 shrink-0">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner shrink-0">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>TECHNICAL COMPETENCY & SKILLS MATRIX</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  VERIFIED STACK
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                Comprehensive breakdown of frontend frameworks, backend integrations, AI tools, and core proficiencies.
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto shrink-0 flex-wrap">
            <div className="bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Avg Mastery: <strong className="text-white font-bold">{avgProficiency}%</strong></span>
            </div>
            <div className="bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Mastery: <strong className="text-white font-bold">{masteryCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill name, category, or training source..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition shadow-inner font-sans"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 mr-1 shrink-0">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Category:</span>
            </div>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 scale-[1.02] font-bold"
                      : "bg-slate-950/70 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/80 active:scale-[0.98]"
                  }`}
                >
                  <span>{cat}</span>
                  {cat === "All" && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? "bg-black/20 text-black" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {skills.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills Matrix Display Area */}
      {loading ? (
        /* Skeletal Bento Grid Loader */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 flex flex-col justify-between h-[230px] animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800/80 rounded-xl" />
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-800 rounded w-28" />
                    <div className="h-3 bg-slate-800/60 rounded w-16" />
                  </div>
                </div>
                <div className="h-6 bg-slate-800 rounded w-12" />
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-800 rounded-full w-full" />
                <div className="flex gap-1.5 pt-2">
                  <div className="h-5 bg-slate-800/70 rounded w-16" />
                  <div className="h-5 bg-slate-800/70 rounded w-20" />
                </div>
              </div>
              <div className="h-3 bg-slate-800/50 rounded w-3/4 mt-2" />
            </div>
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        /* Editorial Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 my-auto min-h-[350px]">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4 shadow-xl">
            <Cpu className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Matching Competencies Located</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            We could not locate any technical skill matching &ldquo;{search || selectedCategory}&rdquo; in the active registry. Try resetting filters or choosing another technology category.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-400/20 active:scale-[0.98]"
          >
            Reset Filters & Show All
          </button>
        </div>
      ) : (
        /* Dynamic Competency Grid */
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, idx) => {
              const sources = getSources(skill);
              const isMastery = skill.proficiency >= 90;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  key={skill.id}
                  className={`group relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-lg min-h-[235px] ${
                    isMastery
                      ? "bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 border-2 border-cyan-500/50 hover:border-cyan-400 shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-1"
                      : "bg-slate-900/80 hover:bg-slate-900/95 border border-slate-800/90 hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {/* Subtle Top Mastery Glow */}
                  {isMastery && (
                    <div className="absolute -top-1 right-6 px-2.5 py-0.5 bg-cyan-400 text-black font-extrabold text-[9px] uppercase tracking-wider rounded-b-md shadow-md flex items-center gap-1 font-mono">
                      <Sparkles className="w-2.5 h-2.5 fill-black" />
                      <span>CORE MASTERY</span>
                    </div>
                  )}

                  <div>
                    {/* Header: Title, Category & Percentage Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner transition duration-300 group-hover:scale-105 ${
                            isMastery
                              ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                              : "bg-slate-800/80 border border-slate-700/80 text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/30"
                          }`}
                        >
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h3
                            className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition tracking-tight"
                            title={skill.title}
                          >
                            {skill.title}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">
                            {skill.category}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`font-mono text-xs font-black px-2.5 py-1 rounded-xl border shrink-0 ${
                          isMastery
                            ? "bg-cyan-400 text-black border-cyan-300 shadow-sm"
                            : "bg-slate-950/80 text-cyan-400 border-slate-800"
                        }`}
                      >
                        {skill.proficiency}%
                      </span>
                    </div>

                    {/* Proficiency Progress Bar */}
                    <div className="w-full bg-slate-950/80 h-2.5 rounded-full overflow-hidden my-3.5 border border-slate-800/80 p-0.5 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                          isMastery
                            ? "bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 shadow-cyan-400/30"
                            : "bg-gradient-to-r from-slate-600 via-cyan-500 to-cyan-400"
                        }`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>

                    {/* Learning Sources & Verified Badges */}
                    <div className="space-y-1.5 mt-3">
                      <div className="flex items-center text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                        <BookOpen className="w-3 h-3 mr-1.5 text-cyan-400" />
                        <span>Training & Experience Sources:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sources.map((src, idx) => (
                          <span
                            key={`src-${idx}`}
                            className="px-2 py-0.5 bg-slate-950/90 text-slate-300 rounded-lg text-[10px] border border-slate-800/80 font-mono font-medium shadow-2xs"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer / Acquisition Date */}
                  <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Acquired: <strong className="text-slate-300 font-semibold">{skill.acquiredDate}</strong></span>
                    </div>
                    <span className="text-slate-500">ID #{skill.id}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
