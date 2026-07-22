"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"
import { useGame } from "@/context/GameContext"

export interface ProjectBeaconData {
  id: number
  title: string
  imgUrl: string
  liveLink: string
  tags: string[]
  tools: string[]
  description: string
  images: string[]
  coords: [number, number, number]
  region?: string
}

interface WorldMapSceneProps {
  projects: ProjectBeaconData[]
  selectedId: number | null
  onSelectProject: (project: ProjectBeaconData) => void
  activeRegion?: string | null
}

export function WorldMapScene({
  projects,
  selectedId,
  onSelectProject,
  activeRegion = null,
}: WorldMapSceneProps) {
  const { playSfx } = useGame()
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null)
  const [mapTexture, setMapTexture] = useState<THREE.Texture | null>(null)
  const [aspectRatio, setAspectRatio] = useState<number>(1.33) // Default aspect ratio

  // 1. Load the 4K Elden Ring Diorama Map Texture with full resolution sharpness
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    // We prioritize the new 4K high-res map (`elden-ring-4k-map.jpg`), with fallback to `elden-ring-map.jpg`
    const primaryPath = "/images/elden-ring-4k-map.jpg"
    const fallbackPath = "/images/elden-ring-map.jpg"

    const loadTexture = (path: string, isFallback: boolean) => {
      loader.load(
        path,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = 16 // Max sharpness for 4K zooming
          tex.minFilter = THREE.LinearMipmapLinearFilter
          tex.magFilter = THREE.LinearFilter

          if (tex.image && tex.image.width && tex.image.height) {
            setAspectRatio(tex.image.width / tex.image.height)
          }
          setMapTexture(tex)
        },
        undefined,
        (err) => {
          if (!isFallback) {
            console.warn(`Could not load ${primaryPath}, attempting fallback to ${fallbackPath}...`)
            loadTexture(fallbackPath, true)
          } else {
            console.error("Could not load any map texture.", err)
          }
        }
      )
    }

    loadTexture(primaryPath, false)
  }, [])

  // Region targets for smooth camera panning when user selects a realm from UI
  const regionTargets: Record<
    string,
    { target: [number, number, number]; cam: [number, number, number] }
  > = {
    LIMGRAVE: { target: [-7, -4, 0], cam: [-7, -8, 8] },
    LIURNIA: { target: [-7, 4, 0], cam: [-7, 1, 9] },
    CAELID: { target: [7, -4, 0], cam: [7, -8, 8] },
    ALTUS: { target: [6, 4, 0], cam: [6, 1, 9] },
    ERDTREE: { target: [0, 0, 0], cam: [0, -4, 10] },
  }

  // Smooth OrbitControls tracking for active project / region selection
  useFrame((state, delta) => {
    const controls = controlsRef.current as any
    if (controls && controls.target) {
      if (selectedId) {
        const selectedProj = projects.find((p) => p.id === selectedId)
        if (selectedProj) {
          const [px, py, pz] = selectedProj.coords
          const targetPos = new THREE.Vector3(px, py, pz)
          controls.target.lerp(targetPos, delta * 5)
        }
      } else if (activeRegion && regionTargets[activeRegion]) {
        const tgt = new THREE.Vector3(...regionTargets[activeRegion].target)
        controls.target.lerp(tgt, delta * 4)
      }
      controls.update()
    }
  })

  // Full uncropped 4K Map Dimensions (Width fixed at 28 units, height adjusted strictly by natural aspect ratio)
  const mapWidth = 28
  const mapHeight = mapWidth / aspectRatio

  return (
    <>
      {/* 
        Interactive Camera Controls:
        - enablePan=true allows dragging freely across the entire map.
        - enableZoom=true allows zooming in close (minDistance=2) to inspect 4K details and zooming out (maxDistance=45).
        - enableRotate=true allows cinematic tabletop tilting.
      */}
      <OrbitControls
        ref={controlsRef}
        enableRotate
        enablePan
        enableZoom
        panSpeed={1.5}
        zoomSpeed={1.2}
        rotateSpeed={0.8}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={2}
        maxDistance={45}
        makeDefault
      />

      {/* Dedicated Scene Lighting so diorama and beacons are always brilliantly lit */}
      <ambientLight intensity={3.0} color="#ffffff" />
      <directionalLight position={[15, 25, 20]} intensity={3.5} color="#fffcf0" />
      <pointLight position={[0, 0, 20]} intensity={2.5} color="#ffd700" distance={80} />

      {/* Main Diorama World Group */}
      <group rotation={[-Math.PI / 3.2, 0, 0]} position={[0, -1, -2]}>
        {/* 1. THE FULL 4K WORLD MAP PLANE (100% Full Resolution & Uncropped Aspect Ratio) */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[mapWidth, mapHeight, 1, 1]} />
          {mapTexture ? (
            <meshBasicMaterial
              map={mapTexture}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          ) : (
            <meshBasicMaterial color="#1a1c23" side={THREE.DoubleSide} />
          )}
        </mesh>

        {/* 2. ELEGANT OBSIDIAN DIORAMA TABLETOP PEDESTAL BORDER */}
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[mapWidth + 0.8, mapHeight + 0.8]} />
          <meshStandardMaterial color="#0c0a08" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Golden Frame Outline connecting map to pedestal */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[mapWidth + 0.15, mapHeight + 0.15]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.45} />
        </mesh>

        {/* 3. PROJECT BEACONS DISTRIBUTED ACROSS THE 4K MAP */}
        {projects.map((proj) => {
          const isSelected = selectedId === proj.id
          const isHovered = hoveredId === proj.id
          const [px, py] = proj.coords

          // Ensure project beacons sit comfortably on top of our map plane
          const beaconZ = 0.1

          const isAI = proj.tags.some(
            (t) =>
              t.toLowerCase().includes("ai") ||
              t.toLowerCase().includes("three") ||
              proj.tools.join(" ").toLowerCase().includes("ai")
          )
          const isBackend = proj.tags.some(
            (t) =>
              t.toLowerCase().includes("node") ||
              t.toLowerCase().includes("backend") ||
              t.toLowerCase().includes("prisma")
          )

          const siteColor = isSelected
            ? "#00f0ff"
            : isHovered
            ? "#ff6b35"
            : isAI
            ? "#ff8c42"
            : isBackend
            ? "#00f0ff"
            : "#ffd700"

          return (
            <ProjectSiteBeacon
              key={proj.id}
              project={proj}
              position={[px, py, beaconZ]}
              color={siteColor}
              isSelected={isSelected}
              isHovered={isHovered}
              onPointerOver={() => {
                playSfx("hover")
                setHoveredId(proj.id)
              }}
              onPointerOut={() => setHoveredId(null)}
              onClick={(e) => {
                e.stopPropagation()
                playSfx("click")
                onSelectProject(proj)
              }}
              onInspect={() => {
                playSfx("open")
                onSelectProject(proj)
              }}
            />
          )
        })}
      </group>
    </>
  )
}

function ProjectSiteBeacon({
  project,
  position,
  color,
  isSelected,
  isHovered,
  onPointerOver,
  onPointerOut,
  onClick,
  onInspect,
}: {
  project: ProjectBeaconData
  position: [number, number, number]
  color: string
  isSelected: boolean
  isHovered: boolean
  onPointerOver: () => void
  onPointerOut: () => void
  onClick: (e: ThreeEvent<MouseEvent>) => void
  onInspect: () => void
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 2.2
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 1.4
    }
  })

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Elden Ring Site of Grace Medallion Base Plate */}
      <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshStandardMaterial color="#14120e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rotating Rune Rings on Ground */}
      <mesh ref={ringRef} position={[0, 0, 0.04]}>
        <ringGeometry args={[0.22, 0.38, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || isHovered ? 1 : 0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={outerRingRef} position={[0, 0, 0.03]}>
        <ringGeometry args={[0.42, 0.52, 6]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={isSelected || isHovered ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical Guidance of Grace Pillar */}
      <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.06, 1.8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || isHovered ? 0.9 : 0.35}
        />
      </mesh>

      {/* FLOATING PROJECT BEACON BADGE WITH SCREENSHOT */}
      <Html position={[0, 0, 1.3]} center distanceFactor={14} zIndexRange={[100, 0]}>
        <div className="relative group cursor-pointer flex flex-col items-center">
          {/* Circular Project Screenshot Frame */}
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-[#181510] shadow-xl ${
              isSelected || isHovered
                ? "scale-125 border-[#00f0ff] shadow-[0_0_25px_#00f0ff]"
                : "border-[#ffd700] shadow-[0_0_15px_rgba(200,169,98,0.6)] hover:border-white"
            }`}
          >
            <img
              src={project.imgUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
              }}
            />
          </div>

          {/* Golden Pulse Ring below badge */}
          <div
            className={`absolute inset-0 rounded-full border border-gold/60 animate-ping pointer-events-none ${
              isSelected || isHovered ? "opacity-80" : "opacity-30"
            }`}
          />

          {/* Hover Name Tag (Shown when hovered but not expanded) */}
          {(isHovered && !isSelected) && (
            <div className="absolute top-full mt-2 px-3 py-1.5 rounded-lg bg-[#181510]/95 border-2 border-[#ffd700] shadow-2xl shadow-gold/40 pointer-events-none flex flex-col items-center whitespace-nowrap animate-fade-in z-50">
              <div className="flex items-center gap-1.5 border-b border-[#5e4f34]/60 pb-1 mb-1 w-full justify-center">
                <span className="text-[10px] font-mono text-[#00f0ff] font-bold">
                  {project.region || "REALM"}
                </span>
                <span className="text-gold text-xs">•</span>
                <span className="text-[10px] font-mono text-slate-300 uppercase">
                  {project.tags[0] || "Code"}
                </span>
              </div>
              <span className="font-cinzel font-bold text-xs sm:text-sm text-white tracking-wide">
                {project.title}
              </span>
              <span className="text-[9px] font-mono text-gold/80 mt-0.5">
                ✦ CLICK TO EXPAND DETAILS ✦
              </span>
            </div>
          )}

          {/* EXPANDED PROJECT CARD WHEN CLICKED */}
          {isSelected && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-full mt-2 w-72 bg-[#1c1812]/95 border-2 border-[#ffd700] rounded-xl shadow-[0_0_35px_rgba(200,169,98,0.5)] p-4 text-white z-50 animate-fade-in flex flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b border-[#5e4f34] pb-2">
                <span className="font-cinzel font-bold text-sm text-gold flex items-center gap-1.5 truncate">
                  <span className="animate-pulse">🌟</span> {project.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-void text-gold border border-gold/40">
                  {project.region}
                </span>
              </div>

              <div className="relative h-32 w-full rounded-lg overflow-hidden border border-[#5e4f34]">
                <img
                  src={project.imgUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1812] via-transparent to-transparent opacity-60" />
              </div>

              <p className="text-xs font-rajdhani text-slate-300 line-clamp-2 leading-relaxed">
                {project.description || "Ancient code scroll discovered in the Erdtree archives."}
              </p>

              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 font-mono text-[9px]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#5e4f34]">
                <button
                  onClick={onInspect}
                  className="flex-1 py-1.5 rounded bg-[#ffd700] hover:bg-white text-black font-mono text-xs font-bold uppercase transition shadow-md"
                >
                  📜 FULL DETAILS
                </button>
                {project.liveLink && project.liveLink !== "#" && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-dark-steel hover:bg-[#00f0ff]/20 text-[#00f0ff] font-mono text-xs font-bold border border-[#00f0ff]/40 transition text-center"
                  >
                    🌐 DEMO
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
