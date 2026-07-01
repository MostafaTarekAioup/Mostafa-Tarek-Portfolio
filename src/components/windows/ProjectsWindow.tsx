"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Search, Tag, Eye, Layers, Loader2, Wrench } from "lucide-react";

interface Project {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string;
  tools?: string;
}

export function ProjectsWindow() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    fetchProjects();
  }, []);

  // Parse tags helper
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

  // Collect all unique tags for filter tabs
  const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => getArrayField(p.tags))))];

  const filteredProjects = projects.filter((p) => {
    const tags = getArrayField(p.tags);
    const tools = getArrayField(p.tools);
    const matchesTag = selectedTag === "All" || tags.includes(selectedTag) || tools.includes(selectedTag);
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      tools.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-full space-y-5 select-none">
      {/* Top Controls: Search and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 backdrop-blur-md shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, tag, or technology tool..."
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
          />
        </div>

        {/* Tags Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border shrink-0 ${
                selectedTag === tag
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid Container */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3 py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs font-mono">Loading Projects Registry...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 py-20">
          <Layers className="w-10 h-10 text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-300">No projects found matching query</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedTag("All");
            }}
            className="mt-3 px-3.5 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-400 hover:bg-cyan-500/20 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {filteredProjects.map((project) => {
            const tags = getArrayField(project.tags);
            const tools = getArrayField(project.tools);

            return (
              <div
                key={project.id}
                className="group relative bg-slate-900/85 border border-slate-800/90 rounded-xl overflow-hidden hover:border-cyan-500/60 transition-all duration-300 flex flex-col justify-between h-[390px] min-h-[390px] max-h-[390px] w-full shrink-0 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                {/* Project Image - Guaranteed Fixed Height */}
                <div className="relative h-[180px] min-h-[180px] max-h-[180px] w-full shrink-0 overflow-hidden bg-slate-950 border-b border-slate-800/70">
                  <img
                    src={project.imgUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                  {/* Quick View Button */}
                  <button
                    onClick={() => setPreviewImg(project.imgUrl)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-200 border border-white/10"
                    title="Quick Zoom"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Project Content - Fixed Overflow Layout */}
                <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="overflow-hidden">
                    <h3
                      className="text-sm font-bold text-white group-hover:text-cyan-300 transition truncate mb-2.5"
                      title={project.title}
                    >
                      {project.title}
                    </h3>

                    {/* Tags & Tools Container with internal scroll if too many */}
                    <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[105px] no-scrollbar pr-1">
                      {tags.map((t, idx) => (
                        <span
                          key={`tag-${idx}`}
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        >
                          <Tag className="w-2.5 h-2.5 mr-1 text-cyan-400 shrink-0" />
                          {t}
                        </span>
                      ))}
                      {tools.map((t, idx) => (
                        <span
                          key={`tool-${idx}`}
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700/80"
                        >
                          <Wrench className="w-2.5 h-2.5 mr-1 text-slate-400 shrink-0" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">ID: #{project.id}</span>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition shadow-sm group/btn"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-2"
          >
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-600 transition z-10 shadow-lg"
            >
              Close [ESC]
            </button>
            <img src={previewImg} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
