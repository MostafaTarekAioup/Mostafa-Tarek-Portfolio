"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Search, Tag, Eye, Layers, Loader2 } from "lucide-react";

interface Project {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string;
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
    fetchProjects();
  }, []);

  // Parse tags
  const getTags = (project: Project): string[] => {
    try {
      if (project.tags.startsWith("[")) {
        return JSON.parse(project.tags);
      }
      return project.tags.split(",").map((t) => t.trim());
    } catch {
      return ["React"];
    }
  };

  // Collect all unique tags
  const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => getTags(p))))];

  const filteredProjects = projects.filter((p) => {
    const tags = getTags(p);
    const matchesTag = selectedTag === "All" || tags.includes(selectedTag);
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full space-y-5 select-none">
      {/* Top Controls: Search and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or tech tag..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Tags Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedTag === tag
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20"
                  : "bg-slate-800/50 text-slate-400 border-slate-700 hover:text-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs font-mono">Loading Projects Registry...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <Layers className="w-10 h-10 text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-300">No projects found matching query</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedTag("All");
            }}
            className="mt-3 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-400 hover:bg-cyan-500/20 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto pr-1 pb-4">
          {filteredProjects.map((project) => {
            const tags = getTags(project);
            return (
              <div
                key={project.id}
                className="group relative bg-slate-900/70 border border-slate-800/80 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-cyan-500/10"
              >
                {/* Project Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
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
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-200"
                    title="Quick Zoom"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Project Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition mb-2">
                      {project.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-400 border border-slate-700/60"
                        >
                          <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">ID: #{project.id}</span>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition shadow-sm"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
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
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-2">
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-600 transition z-10"
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
