"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ExternalLink, Search, Tag, Eye, Layers, Loader2, Wrench, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Project {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string;
  tools?: string;
  description?: string;
  images?: string;
  isPinned?: boolean;
  pinOrder?: number;
}

function SafeProjectCardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [prevSrc, setPrevSrc] = useState(src);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setImgSrc(src);
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
      onError={() => {
        setImgSrc("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80");
      }}
    />
  );
}

export function ProjectsWindow() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        const sorted = Array.isArray(data) ? [...data].sort((a: Project, b: Project) => {
          // Pinned projects always come first
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          // Among pinned, sort by pinOrder
          if (a.isPinned && b.isPinned) return (a.pinOrder || 0) - (b.pinOrder || 0);
          // Among non-pinned, sort by id desc
          return b.id - a.id;
        }) : data;
        setProjects(sorted);
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
    <div className="flex flex-col min-h-full space-y-5">
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
                className={`group relative bg-slate-900/85 border rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between h-[390px] min-h-[390px] max-h-[390px] w-full shrink-0 shadow-lg hover:-translate-y-1 ${
                  project.isPinned
                    ? 'border-cyan-500/50 shadow-cyan-500/10 hover:border-cyan-400/70 hover:shadow-cyan-500/20'
                    : 'border-slate-800/90 hover:border-cyan-500/60 hover:shadow-cyan-500/10'
                }`}
              >
                {/* Featured Badge */}
                {project.isPinned && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 rounded-lg shadow-lg">
                    <Star className="w-3 h-3 text-cyan-300 fill-cyan-300" />
                    <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase">Featured</span>
                  </div>
                )}
                {/* Project Image - Guaranteed Fixed Height */}
                <div
                  onClick={() => setSelectedProject(project)}
                  className="relative h-[180px] min-h-[180px] max-h-[180px] w-full shrink-0 overflow-hidden bg-slate-950 border-b border-slate-800/70 cursor-pointer"
                >
                  <SafeProjectCardImage
                    src={project.imgUrl}
                    alt={project.title}
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    className="absolute top-2 right-2 px-2.5 py-1.5 bg-black/80 hover:bg-cyan-500 hover:text-black text-white font-bold rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-200 border border-white/20 text-xs flex items-center gap-1.5 shadow-lg"
                    title="View Gallery & Info"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Gallery</span>
                  </button>
                </div>

                {/* Project Content - Fixed Overflow Layout */}
                <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="overflow-hidden">
                    <h3
                      onClick={() => setSelectedProject(project)}
                      className="text-sm font-bold text-white group-hover:text-cyan-300 transition truncate mb-2.5 cursor-pointer"
                      title={project.title}
                    >
                      {project.title}
                    </h3>

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
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Details & Gallery</span>
                    </button>
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

      {/* Project Details & Swiper 3D Coverflow Modal */}
      {selectedProject && typeof window !== "undefined" && document.body && createPortal(
        <div
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-lg p-3 sm:p-4 animate-fadeIn overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900/95 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 p-5 sm:p-6 flex flex-col max-h-[88vh] my-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full font-bold">
                  Project Registry #{selectedProject.id}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <span>{selectedProject.title}</span>
                </h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 rounded-xl transition border border-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 sm:py-5 space-y-6 flex-1 pr-1 max-h-[calc(88vh-140px)] no-scrollbar">
              {(() => {
                const imgs = selectedProject.images
                  ? (typeof selectedProject.images === "string" ? getArrayField(selectedProject.images) : selectedProject.images)
                  : (selectedProject.imgUrl ? [selectedProject.imgUrl] : []);

                if (!imgs || imgs.length === 0) return null;

                return (
                  <div className="w-full bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-slate-800/80">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>Project Gallery (3D Coverflow Slider)</span>
                    </h4>
                    <Swiper
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      slidesPerView={"auto"}
                      coverflowEffect={{
                        rotate: 35,
                        stretch: 0,
                        depth: 150,
                        modifier: 1,
                        slideShadows: true,
                      }}
                      pagination={{ clickable: true }}
                      navigation={true}
                      modules={[EffectCoverflow, Pagination, Navigation]}
                      className="w-full py-4 !pb-10"
                    >
                      {imgs.map((url, index) => (
                        <SwiperSlide
                          key={index}
                          className="relative !w-[260px] sm:!w-[340px] md:!w-[420px] aspect-video rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-slate-900 group cursor-pointer"
                          onClick={() => setPreviewImg(url)}
                        >
                          <Image
                            src={url}
                            alt={`${selectedProject.title} screenshot ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 260px, (max-width: 768px) 340px, 420px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-xs text-white font-semibold flex items-center gap-1 bg-black/60 px-2 py-1 rounded border border-white/20">
                              <Eye className="w-3.5 h-3.5 text-cyan-400" /> Click to enlarge
                            </span>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                );
              })()}

              {selectedProject.description && (
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 font-mono">
                    About This Project
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              {selectedProject.tools && getArrayField(selectedProject.tools).length > 0 && (
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2.5 font-mono flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" />
                    <span>Tools & Libraries Used</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {getArrayField(selectedProject.tools).map((tool, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-mono font-medium shadow-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Primary Tech Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {getArrayField(selectedProject.tags).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-800/80 text-cyan-300 border border-slate-700 shadow-sm"
                    >
                      <Tag className="w-3 h-3 text-cyan-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Click any slide image to zoom in fullscreen.
              </span>
              <div className="flex items-center space-x-3 ml-auto">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Close Window
                </button>
                <a
                  href={selectedProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-lg shadow-cyan-500/20"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Image Zoom Modal */}
      {previewImg && typeof window !== "undefined" && document.body && createPortal(
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full h-[80vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-2 flex items-center justify-center my-auto"
          >
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-600 transition z-10 shadow-lg"
            >
              Close [ESC]
            </button>
            <Image
              src={previewImg}
              alt="Preview"
              fill
              unoptimized
              sizes="100vw"
              className="object-contain p-2 rounded-xl"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
