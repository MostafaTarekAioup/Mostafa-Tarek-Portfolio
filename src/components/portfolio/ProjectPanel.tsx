"use client";

import React, { useState } from "react";
import { SidePanel } from "@/components/game-ui/SidePanel";
import { RuneButton } from "@/components/game-ui/RuneButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ProjectBeaconData {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string[];
  tools: string[];
  description: string;
  images: string[];
}

interface ProjectPanelProps {
  project: ProjectBeaconData | null;
  onClose: () => void;
}

export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  if (!project) return null;

  const images = project.images && project.images.length > 0 ? project.images : [project.imgUrl];

  return (
    <SidePanel
      isOpen={!!project}
      onClose={onClose}
      title={project.title}
      subtitle={`BEACON REGISTRY #${project.id} • REALM ARCHITECTURE`}
      badgeText="DISCOVERED BEACON"
      badgeColor="mana"
      width="lg"
    >
      {/* 1. Swiper Coverflow Gallery or Hero Screenshot */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>PROJECT GALLERY (CLICK TO ZOOM)</span>
          <span>{images.length} SCREENSHOT{images.length > 1 ? "S" : ""}</span>
        </div>

        <div className="w-full bg-void/80 p-3 sm:p-4 rounded-xl border border-iron/80 overflow-hidden">
          {images.length > 1 ? (
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 120,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[EffectCoverflow, Pagination, Navigation]}
              className="w-full py-2 !pb-8"
            >
              {images.map((url, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => setPreviewImg(url)}
                  className="!w-[240px] sm:!w-[320px] aspect-video rounded-lg overflow-hidden border border-gold/40 shadow-lg bg-dark-steel cursor-pointer group"
                >
                  <img
                    src={url}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-xs text-gold">
                    🔍 ENLARGE
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              onClick={() => setPreviewImg(images[0])}
              className="relative aspect-video w-full rounded-lg overflow-hidden border border-gold/40 shadow-lg bg-dark-steel cursor-pointer group"
            >
              <img
                src={images[0]}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-xs text-gold">
                🔍 ENLARGE
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Lore & Description */}
      {project.description && (
        <div className="space-y-2 bg-dark-steel/60 p-4 rounded-xl border border-iron/80">
          <h4 className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
            SCROLL OF ARCHITECTURE (DESCRIPTION)
          </h4>
          <p className="text-sm font-rajdhani text-slate-200 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      )}

      {/* 3. Primary Tech Stack Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-mana uppercase tracking-wider">
            CORE ENCHANTMENTS (TECH STACK)
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-mana/15 text-mana border border-mana/40 text-xs font-mono font-bold uppercase tracking-wider"
              >
                ⚡ {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Tools & Libraries Used */}
      {project.tools && project.tools.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-nature uppercase tracking-wider">
            FORGE IMPLEMENTS (TOOLS & LIBRARIES)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.tools.map((tool, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-dark-steel text-slate-300 border border-iron text-xs font-mono"
              >
                🔨 {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. Fast Travel Action Button */}
      <div className="pt-4 border-t border-iron/80 flex items-center justify-between gap-4">
        <RuneButton variant="ghost" size="sm" onClick={onClose}>
          RETURN TO MAP
        </RuneButton>
        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <RuneButton variant="primary" size="md" glow icon="🌌">
            FAST TRAVEL (LIVE DEMO) ➔
          </RuneButton>
        </a>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-void/95 backdrop-blur-xl p-4 sm:p-8 animate-fadeIn cursor-pointer"
        >
          <div className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center">
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute -top-12 right-0 px-4 py-2 bg-dark-steel border border-gold text-gold font-mono text-xs rounded-lg hover:bg-gold hover:text-black transition shadow-lg"
            >
              ✕ CLOSE ZOOM [ESC]
            </button>
            <img
              src={previewImg}
              alt="Zoomed preview"
              className="max-w-full max-h-[80vh] object-contain rounded-xl border-2 border-gold/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </SidePanel>
  );
}
