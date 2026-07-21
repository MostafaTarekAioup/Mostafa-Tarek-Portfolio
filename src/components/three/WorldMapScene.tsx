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
  const groupRef = useRef<THREE.Group>(null)
  const [mapTexture, setMapTexture] = useState<THREE.Texture | null>(null)

  // Load the detailed Elden Ring Medieval World Map texture asynchronously
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      "/images/elden-ring-map.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        setMapTexture(tex)
      },
      undefined,
      (err) => {
        console.warn("Could not load elden-ring-map.jpg, using procedural terrain colors.", err)
      }
    )
  }, [])

  // Region centers and camera targets for smooth Elden Ring fast-travel panning
  const regionTargets: Record<
    string,
    { target: [number, number, number]; cam: [number, number, number] }
  > = {
    LIMGRAVE: { target: [-7, -4, 0], cam: [-7, -8, 7] },
    LIURNIA: { target: [-7, 4, 0], cam: [-7, 1, 8] },
    CAELID: { target: [8, -4, 0], cam: [8, -8, 7] },
    ALTUS: { target: [7, 4, 0], cam: [7, 1, 8] },
    ERDTREE: { target: [0, 1.5, 0], cam: [0, -3.5, 9] },
  }

  // Topographic Elden Ring continent plane with custom height noise and vertex parchment colors
  const { terrainGeo } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 22, 140, 100)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)

    const cDeepOcean = new THREE.Color("#050810")
    const cShallowWater = new THREE.Color("#111e38")
    const cBeach = new THREE.Color("#5e4f34")
    const cLimgrave = new THREE.Color("#2a3b22")
    const cLiurnia = new THREE.Color("#192f4d")
    const cCaelid = new THREE.Color("#522018")
    const cAltus = new THREE.Color("#735a26")
    const cPeak = new THREE.Color("#a39882")

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)

      const distFromCenter = Math.sqrt(x * x + y * y)
      const n1 = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 1.5
      const n2 = Math.cos(x * 0.8 + y * 0.6) * 0.8
      const n3 = Math.sin((x - y) * 1.2) * 0.4

      let elevation = (n1 + n2 + n3) * 0.7

      // Continental mask
      if (distFromCenter > 11) {
        elevation -= (distFromCenter - 11) * 0.8
      }

      // Sculpt specific realm features
      if (x > 3 && y < -1) {
        elevation += Math.sin(x * 1.5) * 0.6 // Caelid jagged hills
      } else if (x < -3 && y > 1) {
        elevation -= 0.5 // Liurnia sunken lake
      } else if (x > 2 && y > 2) {
        elevation += 1.2 // Altus high plateau
      }

      if (elevation < -0.2) {
        elevation = -0.3 + elevation * 0.1
      }

      pos.setZ(i, elevation)

      // Vertex coloring fallback if texture is not applied yet
      const vertexColor = new THREE.Color()
      if (elevation <= -0.2) {
        vertexColor.lerpColors(cDeepOcean, cShallowWater, (elevation + 1.5) / 1.3)
      } else if (elevation < 0.1) {
        vertexColor.lerpColors(cShallowWater, cBeach, (elevation + 0.2) / 0.3)
      } else {
        if (x < 0 && y <= 1) {
          vertexColor.copy(cLimgrave)
        } else if (x < 0 && y > 1) {
          vertexColor.copy(cLiurnia)
        } else if (x >= 0 && y <= 0) {
          vertexColor.copy(cCaelid)
        } else {
          vertexColor.copy(cAltus)
        }
        if (elevation > 1.4) {
          vertexColor.lerp(cPeak, Math.min(1, (elevation - 1.4) / 1.0))
        }
      }

      colors[i * 3] = vertexColor.r
      colors[i * 3 + 1] = vertexColor.g
      colors[i * 3 + 2] = vertexColor.b
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return { terrainGeo: geo }
  }, [])

  // Generate golden light lines (Guidance of Grace)
  const guidanceTrails = useMemo(() => {
    const lines: THREE.BufferGeometry[] = []
    const erdtreePos = new THREE.Vector3(0, 1.5, 1.8)

    for (const proj of projects) {
      const [px, py, pz] = proj.coords
      const startPos = new THREE.Vector3(px, py, pz + 0.5)
      const midPos = new THREE.Vector3(
        (px + erdtreePos.x) / 2,
        (py + erdtreePos.y) / 2,
        Math.max(pz, erdtreePos.z) + 3.5
      )

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, erdtreePos)
      const points = curve.getPoints(32)
      lines.push(new THREE.BufferGeometry().setFromPoints(points))
    }
    return lines
  }, [projects])

  // Smooth OrbitControls and camera panning when user picks a region jump or project
  useFrame((state, delta) => {
    const controls = controlsRef.current
    if (controls && controls.target) {
      if (selectedId) {
        const selectedProj = projects.find((p) => p.id === selectedId)
        if (selectedProj) {
          const [px, py, pz] = selectedProj.coords
          const targetPos = new THREE.Vector3(px, py, pz)
          controls.target.lerp(targetPos, delta * 4)
        }
      } else if (activeRegion && regionTargets[activeRegion]) {
        const tgt = new THREE.Vector3(...regionTargets[activeRegion].target)
        controls.target.lerp(tgt, delta * 4)
      } else {
        controls.target.lerp(new THREE.Vector3(0, 0, 0), delta * 2)
      }
      controls.update()
    }
  })

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableRotate
        enablePan
        enableZoom
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4}
        maxDistance={28}
        makeDefault
      />

      <group
        ref={groupRef}
        rotation={[-Math.PI / 3.4, 0, 0]}
        position={[0, -1.5, -3]}
      >
        {/* Topographic Lands Between Continent Mesh */}
        <mesh geometry={terrainGeo} position={[0, 0, 0]}>
          <meshStandardMaterial
            map={mapTexture || undefined}
            color={mapTexture ? "#ffffff" : undefined}
            vertexColors={!mapTexture}
            roughness={0.85}
            metalness={0.15}
            wireframe={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Topographic Contour Ring Wireframe Overlay */}
        <mesh geometry={terrainGeo} position={[0, 0, 0.02]}>
          <meshBasicMaterial
            color="#c8a962"
            wireframe
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer Elden Ring Compass Rings */}
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[14.2, 14.6, 96]} />
          <meshBasicMaterial
            color="#c8a962"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[14.8, 14.9, 96]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* THE ERDTREE CORE (Majestic Central World Tree) */}
        <group position={[0, 1.5, 0.8]}>
          {/* Golden Trunk */}
          <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.6, 2.4, 12]} />
            <meshStandardMaterial
              color="#c8a962"
              metalness={0.8}
              roughness={0.2}
              emissive="#ffd700"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Glowing Golden Canopy */}
          <mesh position={[0, 0, 2.8]}>
            <sphereGeometry args={[1.6, 24, 24]} />
            <meshBasicMaterial
              color="#ffe57f"
              transparent
              opacity={0.35}
              wireframe={false}
            />
          </mesh>
          <mesh position={[0, 0, 2.8]}>
            <sphereGeometry args={[1.3, 16, 16]} />
            <meshPhysicalMaterial
              color="#ffd700"
              emissive="#ffd700"
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Erdtree Grace Aura Ring */}
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2.8, 32]} />
            <meshBasicMaterial
              color="#ffd700"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Guidance of Grace Golden Light Trails */}
        {guidanceTrails.map((geometry, idx) => (
          <primitive
            key={`guidance-${idx}`}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                  color: "#ffe57f",
                  transparent: true,
                  opacity: selectedId === projects[idx]?.id ? 0.9 : 0.28,
                })
              )
            }
          />
        ))}

        {/* SITES OF GRACE BEACONS WITH PROJECT IMAGES */}
        {projects.map((proj) => {
          const isSelected = selectedId === proj.id
          const isHovered = hoveredId === proj.id
          const [px, py, pz] = proj.coords

          const landZ = 0.3
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
            <SiteOfGraceBeacon
              key={proj.id}
              project={proj}
              position={[px, py, pz + landZ]}
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

function SiteOfGraceBeacon({
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
      ringRef.current.rotation.z += delta * 2
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 1.2
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
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.08, 16]} />
        <meshStandardMaterial color="#1c1914" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Ornate Golden Rune Rings on Ground */}
      <mesh ref={ringRef} position={[0, 0, 0.1]}>
        <ringGeometry args={[0.25, 0.42, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || isHovered ? 1 : 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={outerRingRef} position={[0, 0, 0.08]}>
        <ringGeometry args={[0.45, 0.55, 6]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={isSelected || isHovered ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Guidance of Grace Vertical Light Pillar */}
      <mesh position={[0, 0, 1.2]}>
        <cylinderGeometry args={[0.03, 0.06, 2.0, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || isHovered ? 0.9 : 0.3}
        />
      </mesh>

      {/* FLOATING PROJECT BEACON BADGE WITH SCREENSHOT */}
      <Html position={[0, 0.6, 1.4]} center distanceFactor={14} zIndexRange={[100, 0]}>
        <div className="relative group cursor-pointer flex flex-col items-center">
          {/* Circular Gold Beacon Icon Frame */}
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

          {/* Hover Name Banner */}
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
