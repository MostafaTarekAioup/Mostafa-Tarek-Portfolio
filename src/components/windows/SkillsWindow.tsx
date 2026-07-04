"use client";

import React, { useState, useEffect } from "react";
import { Search, BookOpen, Calendar, Cpu, Loader2, Award } from "lucide-react";

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
        setSkills(data);
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
      return ["Self-Taught"];
    }
  };

  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const sources = getSources(s);
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      sources.some((src) => src.toLowerCase().includes(search.toLowerCase())) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* Top Bar: Search and Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name, category, or learning source..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm shadow-emerald-500/20"
                  : "bg-slate-800/50 text-slate-400 border-slate-700 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Matrix Grid */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs font-mono">Loading Tech Stack Matrix...</span>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <Cpu className="w-10 h-10 text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-300">No skills found matching query</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="mt-3 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/20 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1 pb-4">
          {filteredSkills.map((skill) => {
            const sources = getSources(skill);
            return (
              <div
                key={skill.id}
                className="group bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition duration-300 shadow-lg hover:shadow-emerald-500/10"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition">
                          {skill.title}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          {skill.category}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {skill.proficiency}%
                    </span>
                  </div>

                  {/* Proficiency Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>

                  {/* Learning Sources */}
                  <div className="space-y-1 mt-3">
                    <div className="flex items-center text-[11px] text-slate-400 font-medium">
                      <BookOpen className="w-3 h-3 mr-1 text-slate-500" />
                      <span>Sources:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sources.map((src, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded text-[10px] border border-slate-800 font-mono"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer / Acquisition Date */}
                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-slate-600" />
                    <span>Acquired: {skill.acquiredDate}</span>
                  </div>
                  <span>ID #{skill.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
