"use client"

import React, { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useGame } from "@/context/GameContext"
import { PageTransition } from "@/components/game-ui/PageTransition"
import { GameNav } from "@/components/game-ui/GameNav"
import { SceneWrapper } from "@/components/three/SceneWrapper"
import { ParticleField } from "@/components/three/ParticleField"
import {
  WorldMapScene,
  ProjectBeaconData,
} from "@/components/three/WorldMapScene"
import { ProjectPanel } from "@/components/portfolio/ProjectPanel"
import { RuneButton } from "@/components/game-ui/RuneButton"

function ProjectCardImage({ src, alt }: { src: string; alt: string }) {
  const fallback =
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  const [isError, setIsError] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  if (src !== prevSrc) {
    setPrevSrc(src)
    setIsError(false)
  }

  const currentSrc = isError ? fallback : src || fallback

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover"
      unoptimized
      onError={() => setIsError(true)}
    />
  )
}

interface RawProject {
  id: number
  title: string
  imgUrl: string
  liveLink: string
  tags?: string
  tools?: string
  description?: string
  images?: string
}

export default function PortfolioWorldMapPage() {
  const { setActivePose, playSfx, setGamePhase } = useGame()
  const [projects, setProjects] = useState<ProjectBeaconData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [selectedProject, setSelectedProject] =
    useState<ProjectBeaconData | null>(null)
  const [viewMode, setViewMode] = useState<"3d" | "atlas" | "grid">("3d")
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  useEffect(() => {
    setGamePhase("exploring")
    setActivePose("portfolio")
  }, [setGamePhase, setActivePose])

  const getArrayField = (fieldValue?: string): string[] => {
    if (!fieldValue) return []
    try {
      if (fieldValue.startsWith("[")) {
        return JSON.parse(fieldValue)
      }
      return fieldValue.split(",").map((t) => t.trim())
    } catch {
      return ["react"]
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/projects")
        if (res.ok) {
          const rawData: RawProject[] = await res.json()
          const sorted = Array.isArray(rawData)
            ? [...rawData].sort((a, b) => b.id - a.id)
            : []

          // Assign deterministic Elden Ring regional coordinates and region classifications
          const regionsList = ["LIMGRAVE", "LIURNIA", "CAELID", "ALTUS"]
          const withCoords: ProjectBeaconData[] = sorted.map((proj, idx) => {
            const tags = getArrayField(proj.tags)
            const tools = getArrayField(proj.tools)
            const tagStr =
              tags.join(" ").toLowerCase() + " " + tools.join(" ").toLowerCase()

            let region = regionsList[idx % regionsList.length]
            let x = 0
            let y = 0

            // Classify into exact regions
            if (
              tagStr.includes("web") ||
              tagStr.includes("frontend") ||
              tagStr.includes("react") ||
              tagStr.includes("next")
            ) {
              region = "LIMGRAVE"
              x = -8 + (idx % 3) * 3 + Math.sin(idx) * 1.2
              y = -4 + Math.floor(idx / 3) * 2.5 + Math.cos(idx) * 0.8
            } else if (
              tagStr.includes("node") ||
              tagStr.includes("backend") ||
              tagStr.includes("api") ||
              tagStr.includes("database")
            ) {
              region = "LIURNIA"
              x = -7 + (idx % 3) * 3 + Math.cos(idx) * 1.2
              y = 4 + Math.floor(idx / 3) * 2.2 + Math.sin(idx) * 0.8
            } else if (
              tagStr.includes("ai") ||
              tagStr.includes("three") ||
              tagStr.includes("3d") ||
              tagStr.includes("python")
            ) {
              region = "CAELID"
              x = 7 + (idx % 3) * 2.8 + Math.sin(idx * 2) * 1.0
              y = -4 + Math.floor(idx / 3) * 2.5 + Math.cos(idx * 2) * 0.8
            } else {
              region = "ALTUS"
              x = 6 + (idx % 3) * 2.8 + Math.cos(idx * 2) * 1.0
              y = 4 + Math.floor(idx / 3) * 2.5 + Math.sin(idx * 2) * 0.8
            }

            // Ensure coordinates stay within continental bounds
            x = Math.max(-11, Math.min(11, x))
            y = Math.max(-8, Math.min(8, y))
            const z = 0.2

            return {
              id: proj.id,
              title: proj.title,
              imgUrl: proj.imgUrl,
              liveLink: proj.liveLink || "#",
              tags,
              tools,
              description:
                proj.description ||
                "No architecture scroll located in the Erdtree archives.",
              images: getArrayField(proj.images),
              coords: [x, y, z] as [number, number, number],
              region,
            }
          })

          setProjects(withCoords)
        }
      } catch (err) {
        console.error("Error fetching project Sites of Grace:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const allFilters = ["ALL", "WEB", "MOBILE", "FULLSTACK", "AI & TOOLS"]
  const regionsNav = [
    { id: "LIMGRAVE", label: "🏰 Limgrave (Frontend)" },
    { id: "LIURNIA", label: "🌊 Liurnia (Backend)" },
    { id: "CAELID", label: "🌋 Caelid (AI/3D)" },
    { id: "ALTUS", label: "⛰️ Altus (Architecture)" },
    { id: "ERDTREE", label: "🌟 The Erdtree Core" },
  ]

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const tagStr = p.tags.join(" ").toLowerCase()
      const toolStr = p.tools.join(" ").toLowerCase()
      const titleStr = p.title.toLowerCase()

      const matchesSearch =
        !search ||
        titleStr.includes(search.toLowerCase()) ||
        tagStr.includes(search.toLowerCase()) ||
        toolStr.includes(search.toLowerCase()) ||
        (p.region && p.region.toLowerCase().includes(search.toLowerCase()))

      let matchesFilter = true
      if (selectedFilter !== "ALL") {
        if (selectedFilter === "WEB")
          matchesFilter =
            tagStr.includes("web") ||
            tagStr.includes("react") ||
            tagStr.includes("next")
        else if (selectedFilter === "MOBILE")
          matchesFilter =
            tagStr.includes("mobile") ||
            tagStr.includes("react native") ||
            tagStr.includes("flutter")
        else if (selectedFilter === "FULLSTACK")
          matchesFilter =
            tagStr.includes("fullstack") ||
            tagStr.includes("node") ||
            tagStr.includes("prisma")
        else if (selectedFilter === "AI & TOOLS")
          matchesFilter =
            tagStr.includes("ai") ||
            tagStr.includes("three") ||
            toolStr.includes("ai") ||
            tagStr.includes("tool")
      }

      let matchesRegion = true
      if (activeRegion && activeRegion !== "ERDTREE") {
        matchesRegion = p.region === activeRegion
      }

      return matchesSearch && matchesFilter && matchesRegion
    })
  }, [projects, search, selectedFilter, activeRegion])

  return (
    <PageTransition>
      <div className='relative w-screen h-screen overflow-hidden bg-void flex flex-col justify-between select-none'>
        {/* Top Control HUD Bar */}
        <div className='relative z-30 p-3 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-gradient-to-b from-void via-void/95 to-transparent pointer-events-auto border-b border-iron/50'>
          <div>
            <span className='text-[10px] font-mono text-gold tracking-widest uppercase block mb-0.5'>
              REALM REGISTRY • THE LANDS BETWEEN ARCHITECTURE
            </span>
            <h1 className='text-2xl sm:text-3xl font-black font-cinzel text-white tracking-wide flex items-center gap-2.5'>
              <span>ELDEN RING WORLD MAP</span>
              <span className='px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/50 text-xs font-mono font-bold'>
                {filteredProjects.length} SITES OF GRACE
              </span>
            </h1>
          </div>

          {/* Search & View Switchers */}
          <div className='flex flex-col sm:flex-row items-center gap-3'>
            <div className='relative w-full sm:w-60'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search Sites of Grace or tech...'
                className='w-full bg-dark-steel/90 border border-iron rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-gold transition shadow-inner'
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-mono text-xs'
                >
                  ✕
                </button>
              )}
            </div>

            <div className='flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto'>
              {allFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    playSfx("click")
                    setSelectedFilter(filter)
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition shrink-0 border cursor-pointer ${
                    selectedFilter === filter
                      ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                      : "bg-dark-steel/70 text-slate-300 border-iron hover:border-gold/50 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}

              <div className='h-5 w-[1px] bg-iron mx-1 hidden sm:block' />

              {/* View Mode Switcher */}
              <button
                onClick={() => {
                  playSfx("click")
                  setViewMode("3d")
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition shrink-0 cursor-pointer border ${
                  viewMode === "3d"
                    ? "bg-mana text-black border-mana shadow-md shadow-mana/20"
                    : "bg-dark-steel/70 text-slate-300 border-iron hover:border-mana/50"
                }`}
              >
                🗺️ 3D LANDS
              </button>
              <button
                onClick={() => {
                  playSfx("click")
                  setViewMode("atlas")
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition shrink-0 cursor-pointer border ${
                  viewMode === "atlas"
                    ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                    : "bg-dark-steel/70 text-slate-300 border-iron hover:border-gold/50"
                }`}
              >
                📜 2D PARCHMENT
              </button>
              <button
                onClick={() => {
                  playSfx("click")
                  setViewMode("grid")
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition shrink-0 cursor-pointer border ${
                  viewMode === "grid"
                    ? "bg-ember text-white border-ember shadow-md shadow-ember/20"
                    : "bg-dark-steel/70 text-slate-300 border-iron hover:border-ember/50"
                }`}
              >
                📓 GRIMOIRE
              </button>
            </div>
          </div>
        </div>

        {/* Region Fast-Travel Bar (Only visible in 3D or Atlas modes) */}
        {(viewMode === "3d" || viewMode === "atlas") && (
          <div className='relative z-30 bg-dark-steel/80 border-b border-iron/60 py-2 px-4 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto'>
            <span className='text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-2'>
              ⚡ FAST TRAVEL REGIONS:
            </span>
            <button
              onClick={() => {
                playSfx("click")
                setActiveRegion(null)
              }}
              className={`px-3 py-1 rounded text-xs font-mono transition shrink-0 border ${
                activeRegion === null
                  ? "bg-gold/20 text-gold border-gold font-bold"
                  : "bg-void/60 text-slate-400 border-iron hover:text-white"
              }`}
            >
              🌐 Entire Realm
            </button>
            {regionsNav.map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  playSfx("click")
                  setActiveRegion(activeRegion === reg.id ? null : reg.id)
                }}
                className={`px-3 py-1 rounded text-xs font-mono transition shrink-0 border cursor-pointer ${
                  activeRegion === reg.id
                    ? "bg-gold text-black border-gold font-bold shadow-md shadow-gold/20"
                    : "bg-void/60 text-slate-300 border-iron hover:border-gold/50 hover:text-gold"
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        )}

        {/* Center Canvas or Atlas/Grid View */}
        <div className='relative flex-1 w-full overflow-hidden'>
          {loading ? (
            <div className='absolute inset-0 flex flex-col items-center justify-center text-gold font-mono space-y-3 z-20'>
              <div className='w-14 h-14 rounded-full border-2 border-gold border-t-transparent animate-spin' />
              <span className='text-xs tracking-widest uppercase animate-pulse font-cinzel'>
                AWAKENING SITES OF GRACE FROM THE ERDTREE ARCHIVES...
              </span>
            </div>
          ) : viewMode === "3d" ? (
            <div className='absolute inset-0 z-10 cursor-grab active:cursor-grabbing'>
              <SceneWrapper cameraPosition={[0, 6, 14]} fov={45}>
                <ParticleField
                  count={220}
                  color='#ffd700'
                  speed={0.12}
                  size={0.04}
                />
                <WorldMapScene
                  projects={filteredProjects}
                  selectedId={selectedProject?.id || null}
                  onSelectProject={(proj) => {
                    setSelectedProject(proj)
                  }}
                  activeRegion={activeRegion}
                />
              </SceneWrapper>
            </div>
          ) : viewMode === "atlas" ? (
            /* 2D Parchment Elden Ring Atlas Map View with Circular Project Image Beacons */
            <div className='absolute inset-0 overflow-y-auto overflow-x-auto p-4 sm:p-8 z-20 pointer-events-auto bg-[#0a0806]'>
              <div
                className='relative min-w-[1100px] max-w-6xl mx-auto min-h-[740px] rounded-3xl border-4 border-[#8a7146] shadow-2xl overflow-hidden p-8 flex flex-col justify-between'
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(10, 8, 6, 0.45) 0%, rgba(20, 15, 10, 0.75) 100%), url('/images/elden-ring-map.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "inset 0 0 100px rgba(0,0,0,0.85)",
                }}
              >
                {/* Top Header on Map */}
                <div className='flex items-center justify-between border-b border-gold/40 pb-4 relative z-10 bg-void/60 backdrop-blur-md px-6 py-3 rounded-2xl'>
                  <div>
                    <span className='text-[10px] font-mono text-gold uppercase tracking-widest block'>
                      THE LANDS BETWEEN • CARTOGRAPHY ARCHIVES
                    </span>
                    <h2 className='text-xl sm:text-2xl font-cinzel font-bold text-white flex items-center gap-2'>
                      <span>ELDEN RING REALM ATLAS</span>
                      <span className='text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/50 font-mono font-bold'>
                        {filteredProjects.length} BEACONS
                      </span>
                    </h2>
                  </div>
                  <div className='text-right hidden sm:block font-mono text-xs text-slate-300'>
                    <p>HOVER BEACON TO VIEW TITLE</p>
                    <p className='text-gold font-bold'>
                      CLICK BEACON TO EXPAND SCROLL
                    </p>
                  </div>
                </div>

                {/* SCATTERED CIRCULAR PROJECT BEACONS ACROSS THE PARCHMENT MAP */}
                <div className='relative w-full h-[540px] my-6 z-10'>
                  {filteredProjects.map((proj, idx) => {
                    const isSelected = selectedProject?.id === proj.id
                    // Map continental coordinates [-11, 11] x [-8, 8] cleanly to percentage bounds [12%, 88%] x [10%, 85%]
                    const leftPct = Math.max(
                      12,
                      Math.min(88, ((proj.coords[0] + 11) / 22) * 76 + 12),
                    )
                    const topPct = Math.max(
                      10,
                      Math.min(85, ((proj.coords[1] + 8) / 16) * 75 + 10),
                    )

                    return (
                      <div
                        key={proj.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          playSfx("click")
                          setSelectedProject(isSelected ? null : proj)
                        }}
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        className='absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 flex flex-col items-center'
                      >
                        {/* Circular Gold Beacon Badge with Project Image */}
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-[#181510] shadow-xl relative ${
                            isSelected
                              ? "scale-125 border-[#00f0ff] shadow-[0_0_30px_#00f0ff] z-40"
                              : "border-[#ffd700] shadow-[0_0_18px_rgba(200,169,98,0.7)] group-hover:scale-115 group-hover:border-white"
                          }`}
                        >
                          <img
                            src={proj.imgUrl}
                            alt={proj.title}
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                            }}
                          />
                        </div>

                        {/* Pulsing Gold Ring */}
                        <div
                          className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gold/70 animate-ping pointer-events-none ${
                            isSelected
                              ? "opacity-80"
                              : "opacity-30 group-hover:opacity-70"
                          }`}
                        />

                        {/* Hover Name Banner (Shows when hovered or selected) */}
                        <div className='mt-2 px-3 py-1.5 rounded-lg bg-[#181510]/95 border-2 border-[#ffd700] shadow-2xl shadow-gold/40 pointer-events-none flex flex-col items-center whitespace-nowrap transition-all duration-300 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 z-30'>
                          <div className='flex items-center gap-1.5 border-b border-[#5e4f34]/60 pb-1 mb-1 w-full justify-center'>
                            <span className='text-[10px] font-mono text-[#00f0ff] font-bold'>
                              {proj.region || "REALM"}
                            </span>
                            <span className='text-gold text-xs'>•</span>
                            <span className='text-[10px] font-mono text-slate-300 uppercase'>
                              {proj.tags[0] || "Code"}
                            </span>
                          </div>
                          <span className='font-cinzel font-bold text-xs sm:text-sm text-white tracking-wide'>
                            {proj.title}
                          </span>
                          <span className='text-[9px] font-mono text-gold/80 mt-0.5'>
                            ✦ CLICK TO EXPAND DETAILS ✦
                          </span>
                        </div>

                        {/* EXPANDED CARD WHEN CLICKED */}
                        {isSelected && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className='absolute top-full mt-3 w-72 bg-[#1c1812]/95 border-2 border-[#ffd700] rounded-2xl shadow-[0_0_40px_rgba(200,169,98,0.6)] p-4 text-white z-50 animate-fade-in flex flex-col gap-3 cursor-default'
                          >
                            <div className='flex items-center justify-between border-b border-[#5e4f34] pb-2'>
                              <span className='font-cinzel font-bold text-sm text-gold flex items-center gap-1.5 truncate'>
                                <span className='animate-pulse'>🌟</span>{" "}
                                {proj.title}
                              </span>
                              <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-void text-gold border border-gold/40'>
                                {proj.region}
                              </span>
                            </div>

                            <div className='relative h-32 w-full rounded-lg overflow-hidden border border-[#5e4f34]'>
                              <ProjectCardImage src={proj.imgUrl} alt={proj.title} />
                              <div className='absolute inset-0 bg-gradient-to-t from-[#1c1812] via-transparent to-transparent opacity-60' />
                            </div>

                            <p className='text-xs font-rajdhani text-slate-300 line-clamp-2 leading-relaxed'>
                              {proj.description ||
                                "Ancient code scroll discovered in the Erdtree archives."}
                            </p>

                            <div className='flex flex-wrap gap-1'>
                              {proj.tags.slice(0, 3).map((t, i) => (
                                <span
                                  key={i}
                                  className='px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 font-mono text-[9px]'
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className='flex items-center gap-2 pt-2 border-t border-[#5e4f34]'>
                              <button
                                onClick={() => {
                                  playSfx("open")
                                  setSelectedProject(proj)
                                }}
                                className='flex-1 py-1.5 rounded bg-[#ffd700] hover:bg-white text-black font-mono text-xs font-bold uppercase transition shadow-md'
                              >
                                📜 FULL DETAILS
                              </button>
                              {proj.liveLink && proj.liveLink !== "#" && (
                                <a
                                  href={proj.liveLink}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='px-3 py-1.5 rounded bg-dark-steel hover:bg-[#00f0ff]/20 text-[#00f0ff] font-mono text-xs font-bold border border-[#00f0ff]/40 transition text-center'
                                >
                                  🌐 DEMO
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Footer Legend */}
                <div className='border-t border-gold/40 pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-gold/90 relative z-10 bg-void/60 backdrop-blur-md px-6 py-2.5 rounded-2xl'>
                  <span>
                    ERDTREE GUIDANCE: ALL BEACONS ARE ARCHIVED & SYNCHRONIZED
                    WITH DATABASE
                  </span>
                  <span>THE LANDS BETWEEN • REGISTRY CARTOGRAPHY V2.5</span>
                </div>
              </div>
            </div>
          ) : (
            /* Journal Card Grid View */
            <div className='absolute inset-0 overflow-y-auto p-4 sm:p-6 pb-28 z-20 pointer-events-auto'>
              <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      playSfx("click")
                      setSelectedProject(proj)
                    }}
                    className='game-panel rounded-xl overflow-hidden border border-iron hover:border-gold transition-all duration-300 flex flex-col justify-between h-[380px] group cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-gold/10'
                  >
                    <div className='relative h-44 w-full overflow-hidden bg-dark-steel border-b border-iron'>
                      <img
                        src={proj.imgUrl}
                        alt={proj.title}
                        className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500'
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                        }}
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80' />
                      <span className='absolute top-2 right-2 px-2 py-1 bg-void/80 border border-gold/40 text-gold font-mono text-[10px] rounded'>
                        {proj.region || "REALM"} #{proj.id}
                      </span>
                    </div>

                    <div className='p-4 flex-1 flex flex-col justify-between overflow-hidden'>
                      <div>
                        <h3 className='text-base font-bold font-rajdhani text-white group-hover:text-gold transition truncate'>
                          {proj.title}
                        </h3>
                        <p className='text-xs font-rajdhani text-slate-300 line-clamp-2 mt-1'>
                          {proj.description ||
                            "Click to inspect realm architecture."}
                        </p>
                      </div>

                      <div className='flex flex-wrap gap-1.5 mt-3 overflow-hidden max-h-12'>
                        {proj.tags.map((t, i) => (
                          <span
                            key={i}
                            className='px-2 py-0.5 rounded bg-mana/15 text-mana border border-mana/30 font-mono text-[10px]'
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className='pt-3 mt-3 border-t border-iron/60 flex items-center justify-between'>
                        <span className='font-mono text-xs text-gold flex items-center gap-1 font-bold'>
                          🔍 INSPECT GRACE
                        </span>
                        <a
                          href={proj.liveLink}
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={(e) => e.stopPropagation()}
                          className='px-3 py-1 rounded bg-gold/20 hover:bg-gold text-gold hover:text-black font-mono text-xs font-bold transition border border-gold/50'
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
          <div className='relative z-20 pointer-events-none pb-16 pt-2 text-center text-xs font-mono text-slate-400 bg-gradient-to-t from-void via-void/80 to-transparent'>
            <span>
              ELDEN RING COMMANDS: DRAG TO ORBIT • SCROLL TO ZOOM • CLICK ANY
              SITE OF GRACE OR REGION BUTTON TO PAN & INSPECT
            </span>
          </div>
        )}

        {/* Slide-in Project Details Panel */}
        <ProjectPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        <GameNav />
      </div>
    </PageTransition>
  )
}
