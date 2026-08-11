'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { useOS } from '@/context/OSContext';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string;
  tools: string;
  description: string;
  images: string;
  isPinned: boolean;
  pinOrder: number;
}

const parseTags = (tagsString: string): string[] => {
  if (!tagsString) return [];
  try {
    if (tagsString.trim().startsWith('[')) {
      return JSON.parse(tagsString);
    }
    return tagsString.split(',').map((t) => t.trim()).filter(Boolean);
  } catch (error) {
    console.error('Failed to parse tags:', error);
    return [];
  }
};

export const FeaturedProjectsWidget: React.FC = () => {
  const { openWindow, focusWindow } = useOS();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured projects');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error('Error fetching featured projects:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / 2);

  useEffect(() => {
    if (projects.length <= 2) return;

    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length, totalPages]);

  if (error || (!isLoading && projects.length === 0)) {
    return null;
  }

  const handleCardClick = () => {
    openWindow('projects');
    focusWindow('projects');
  };

  const visibleProjects = projects.slice(page * 2, page * 2 + 2);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="hidden md:flex absolute right-4 top-8 z-10 w-[280px] lg:w-[320px] flex-col gap-3"
    >
      <div className="flex items-center gap-2 mb-1 px-2">
        <Zap className="w-4 h-4 text-[var(--primary)]" />
        <h3 className="font-mono text-sm font-semibold tracking-wider neon-glow-text text-[var(--primary)] uppercase">
          Featured Systems
        </h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="glass-panel h-28 rounded-lg border border-white/5 animate-pulse bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="relative min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {visibleProjects.map((project, index) => {
                const tags = parseTags(project.tags).slice(0, 3);
                const isLatest = !project.isPinned;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleCardClick}
                    className={`glass-panel relative flex flex-col p-3 rounded-lg cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] ${
                      project.isPinned
                        ? 'border border-[var(--primary)] shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                        : 'border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {project.isPinned && (
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-mono rounded-bl-lg font-bold border-b border-l border-[var(--primary)]/30 flex items-center gap-1 z-20 backdrop-blur-md">
                        <Pin className="w-3 h-3" /> Pinned
                      </div>
                    )}
                    {isLatest && (
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-mono rounded-bl-lg font-bold border-b border-l border-green-500/30 flex items-center gap-1 z-20 backdrop-blur-md">
                        <Sparkles className="w-3 h-3" /> Latest
                      </div>
                    )}

                    <div className="flex gap-3 h-full">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border border-white/10 group-hover:border-[var(--primary)]/50 transition-colors">
                        {project.imgUrl ? (
                          <Image
                            src={project.imgUrl}
                            alt={project.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <span className="text-white/20 text-xs">No img</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </div>

                      <div className="flex flex-col flex-grow justify-between min-w-0">
                        <h4 className="font-semibold text-white/90 text-sm truncate pr-14 group-hover:text-white transition-colors">
                          {project.title}
                        </h4>
                        
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-white/60 border border-white/5 whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {project.liveLink && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.liveLink, '_blank', 'noopener,noreferrer');
                            }}
                            className="self-start mt-2 flex items-center gap-1 text-[10px] font-mono text-[var(--primary)] hover:text-white hover:bg-[var(--primary)]/20 px-2 py-1 rounded transition-colors"
                          >
                            Launch <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && !isLoading && (
        <div className="flex justify-center gap-1.5 mt-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                page === idx
                  ? 'bg-[var(--primary)] w-3 shadow-[0_0_5px_var(--primary)]'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FeaturedProjectsWidget;
