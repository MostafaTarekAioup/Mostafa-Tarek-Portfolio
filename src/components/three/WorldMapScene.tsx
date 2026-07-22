"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
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

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
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
  const [customObjMesh, setCustomObjMesh] = useState<THREE.Group | null>(null)

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
        console.warn(
          "Could not load elden-ring-map.jpg, using procedural terrain colors.",
          err,
        )
      },
    )
  }, [])

  // Load user's custom 3D map model (`3dMap.obj`) asynchronously
  useEffect(() => {
    const objLoader = new OBJLoader()
    objLoader.load(
      "/models/3dMap.obj",
      (obj) => {
        const box = new THREE.Box3().setFromObject(obj)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Center the custom mesh accurately
        obj.position.sub(center)

        // Scale nicely so max dimension is ~24 units
        const maxDim = Math.max(size.x, size.y, size.z)
        if (maxDim > 0) {
          const scale = 24 / maxDim
          obj.scale.set(scale, scale, scale)
        }

        // Apply our Elden Ring map texture to all submeshes
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh
            m.castShadow = true
            m.receiveShadow = true
            if (mapTexture) {
              m.material = new THREE.MeshStandardMaterial({
                map: mapTexture,
                roughness: 0.85,
                metalness: 0.15,
                side: THREE.DoubleSide,
              })
            } else {
              m.material = new THREE.MeshStandardMaterial({
                color: "#8c7038",
                roughness: 0.85,
                metalness: 0.15,
                side: THREE.DoubleSide,
              })
            }
          }
        })

        setCustomObjMesh(obj.clone())
      },
      undefined,
      (err) => {
        console.warn(
          "Could not load /models/3dMap.obj, using procedural terrain fallback.",
          err,
        )
      },
    )
  }, [mapTexture])

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
  const { terrainGeo, crustGeo } = useMemo(() => {
    // Top surface terrain
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
        vertexColor.lerpColors(
          cDeepOcean,
          cShallowWater,
          (elevation + 1.5) / 1.3,
        )
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

    // Floating Diorama Crust Foundation (Underland tapered apron)
    const crust = new THREE.CylinderGeometry(13.5, 9.5, 3.2, 48, 4)
    return { terrainGeo: geo, crustGeo: crust }
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
        Math.max(pz, erdtreePos.z) + 3.5,
      )

      const curve = new THREE.QuadraticBezierCurve3(
        startPos,
        midPos,
        erdtreePos,
      )
      const points = curve.getPoints(32)
      lines.push(new THREE.BufferGeometry().setFromPoints(points))
    }
    return lines
  }, [projects])

  // Swirling Golden Particle Atmosphere (Tiny Elden Ring Floating Fireflies)
  const particlesCount = 160
  const particlesRef = useRef<THREE.Points>(null)
  const { particlePositions, particleColors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    const col = new Float32Array(particlesCount * 3)
    const gold = new THREE.Color("#ffd700")
    const cyan = new THREE.Color("#00f0ff")

    for (let i = 0; i < particlesCount; i++) {
      const r1 = pseudoRandom(i * 4 + 1)
      const r2 = pseudoRandom(i * 4 + 2)
      const r3 = pseudoRandom(i * 4 + 3)
      const r4 = pseudoRandom(i * 4 + 4)

      const angle = r1 * Math.PI * 2
      const radius = 2 + r2 * 12
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = r3 * 5 + 0.2

      const c = r4 > 0.8 ? cyan : gold
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { particlePositions: pos, particleColors: col }
  }, [])

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

    // Swirling floating golden fireflies
    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.12
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 2] += delta * 0.3
        if (positions[i * 3 + 2] > 6) positions[i * 3 + 2] = 0.2
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
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
        {/* Swirling Golden Atmosphere Fireflies */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach='attributes-position'
              args={[particlePositions, 3]}
            />
            <bufferAttribute
              attach='attributes-color'
              args={[particleColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.16}
            vertexColors
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* If user's custom 3D map (`3dMap.obj`) is loaded, render it directly! Otherwise fallback to procedural terrain */}
        {customObjMesh ? (
          <group position={[0, 0, 0]}>
            <primitive object={customObjMesh} />
            {/* Subtle Golden Trim Ring below custom mesh */}
            <mesh position={[0, 0, -0.2]}>
              <ringGeometry args={[13.2, 13.6, 64]} />
              <meshBasicMaterial
                color='#ffd700'
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ) : (
          <>
            {/* Topographic Lands Between Continent Surface Mesh */}
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
                color='#c8a962'
                wireframe
                transparent
                opacity={0.18}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Tiny Elden Ring Floating Diorama Crust / Rock Foundation underneath */}
            <mesh
              geometry={crustGeo}
              position={[0, 0, -1.6]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color='#191612'
                roughness={0.95}
                metalness={0.05}
              />
            </mesh>
            {/* Golden Trim Ring connecting crust to void */}
            <mesh position={[0, 0, -0.02]}>
              <ringGeometry args={[13.2, 13.6, 64]} />
              <meshBasicMaterial
                color='#ffd700'
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )}

        {/* Outer Elden Ring Compass Rings */}
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[14.2, 14.6, 96]} />
          <meshBasicMaterial
            color='#c8a962'
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, -0.05]}>
          <ringGeometry args={[14.8, 14.9, 96]} />
          <meshBasicMaterial
            color='#ffd700'
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 🏰 TINY ELDEN RING MINIATURE 3D BIOME LANDMARKS (Sketchfab Reference Diorama) */}
        <group>
          {/* 1. CASTLE STORMVEIL (Limgrave West Fortress) */}
          <group position={[-8, -4.5, 0.5]}>
            <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.38, 1.0, 8]} />
              <meshStandardMaterial
                color='#595c63'
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.36, 0.5, 8]} />
              <meshStandardMaterial color='#2d3038' roughness={0.6} />
            </mesh>
            {/* Side Turret */}
            <mesh position={[0.5, 0.3, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.8, 8]} />
              <meshStandardMaterial color='#595c63' roughness={0.7} />
            </mesh>
            <mesh position={[0.5, 0.3, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.24, 0.4, 8]} />
              <meshStandardMaterial color='#8a7146' roughness={0.5} />
            </mesh>
          </group>

          {/* 2. RAYA LUCARIA CRYSTAL ACADEMY (Liurnia Magical Spire) */}
          <group position={[-7.5, 4.5, 0.4]}>
            <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.35, 2.2, 6]} />
              <meshPhysicalMaterial
                color='#00f0ff'
                emissive='#00f0ff'
                emissiveIntensity={0.6}
                roughness={0.1}
                transmission={0.7}
                metalness={0.1}
              />
            </mesh>
            <mesh position={[0.4, -0.4, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.2, 1.4, 6]} />
              <meshPhysicalMaterial
                color='#00f0ff'
                emissive='#00f0ff'
                emissiveIntensity={0.4}
                roughness={0.1}
              />
            </mesh>
          </group>

          {/* 3. CAELID ROT BATTLEFIELD (Fallen Giant Iron Greatswords) */}
          <group position={[8.5, -3.8, 0.6]}>
            <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 3, 0.4, 0.2]}>
              <boxGeometry args={[0.12, 1.6, 0.35]} />
              <meshStandardMaterial
                color='#38211c'
                roughness={0.8}
                metalness={0.6}
              />
            </mesh>
            <mesh
              position={[-0.6, 0.5, 0.4]}
              rotation={[Math.PI / 2.5, -0.3, 0.5]}
            >
              <boxGeometry args={[0.08, 1.2, 0.25]} />
              <meshStandardMaterial
                color='#52261f'
                roughness={0.8}
                metalness={0.5}
              />
            </mesh>
            {/* Scarlet Embers */}
            <mesh position={[0, 0, 0.1]}>
              <ringGeometry args={[0.3, 0.8, 12]} />
              <meshBasicMaterial
                color='#ff3300'
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* 4. LEYNDELL ROYAL CAPITAL (Altus Plateau Golden Domes) */}
          <group position={[6.5, 3.2, 1.4]}>
            <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.6, 0.65, 0.8, 12]} />
              <meshStandardMaterial
                color='#e6e4dc'
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
            <mesh position={[0, 0, 0.9]}>
              <sphereGeometry
                args={[0.62, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
              />
              <meshStandardMaterial
                color='#ffd700'
                metalness={0.9}
                roughness={0.1}
                emissive='#ffd700'
                emissiveIntensity={0.4}
              />
            </mesh>
          </group>

          {/* 5. MINIATURE STYLIZED FORESTS / TREES ACROSS LIMGRAVE & ALTUS */}
          {[
            [-5.5, -5.5, 0.4],
            [-6.2, -3.2, 0.4],
            [-4.8, -6.8, 0.4],
            [4.5, 4.5, 1.2],
            [5.8, 1.8, 1.3],
          ].map((tpos, i) => (
            <group
              key={`tree-${i}`}
              position={tpos as [number, number, number]}
            >
              <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 0.4, 6]} />
                <meshStandardMaterial color='#3b2d1d' />
              </mesh>
              <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.22, 0.5, 6]} />
                <meshStandardMaterial
                  color={i < 3 ? "#3d5a28" : "#8c7038"}
                  roughness={0.6}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* THE ERDTREE CORE (Majestic Central World Tree) */}
        <group position={[0, 1.5, 0.8]}>
          {/* Golden Trunk */}
          <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.7, 2.8, 16]} />
            <meshStandardMaterial
              color='#c8a962'
              metalness={0.8}
              roughness={0.2}
              emissive='#ffd700'
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Golden Roots on Ground */}
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.2, 0.4, 0.1, 16]} />
            <meshStandardMaterial
              color='#8a7146'
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          {/* Glowing Golden Canopy */}
          <mesh position={[0, 0, 3.2]}>
            <sphereGeometry args={[1.8, 24, 24]} />
            <meshBasicMaterial
              color='#ffe57f'
              transparent
              opacity={0.35}
              wireframe={false}
            />
          </mesh>
          <mesh position={[0, 0, 3.2]}>
            <sphereGeometry args={[1.4, 16, 16]} />
            <meshPhysicalMaterial
              color='#ffd700'
              emissive='#ffd700'
              emissiveIntensity={1.3}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.88}
            />
          </mesh>
          {/* Erdtree Grace Aura Ring */}
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.6, 3.0, 32]} />
            <meshBasicMaterial
              color='#ffd700'
              transparent
              opacity={0.3}
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
                }),
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
              proj.tools.join(" ").toLowerCase().includes("ai"),
          )
          const isBackend = proj.tags.some(
            (t) =>
              t.toLowerCase().includes("node") ||
              t.toLowerCase().includes("backend") ||
              t.toLowerCase().includes("prisma"),
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
        <meshStandardMaterial color='#1c1914' metalness={0.9} roughness={0.2} />
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
          color='#ffd700'
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
      <Html
        position={[0, 0.6, 1.4]}
        center
        distanceFactor={14}
        zIndexRange={[100, 0]}
      >
        <div className='relative group cursor-pointer flex flex-col items-center'>
          {/* Circular Gold Beacon Icon Frame */}
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-[#181510] shadow-xl ${
              isSelected || isHovered
                ? "scale-125 border-[#00f0ff] shadow-[0_0_25px_#00f0ff]"
                : "border-[#ffd700] shadow-[0_0_15px_rgba(200,169,98,0.6)] hover:border-white"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imgUrl}
              alt={project.title}
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
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
          {isHovered && !isSelected && (
            <div className='absolute top-full mt-2 px-3 py-1.5 rounded-lg bg-[#181510]/95 border-2 border-[#ffd700] shadow-2xl shadow-gold/40 pointer-events-none flex flex-col items-center whitespace-nowrap animate-fade-in z-50'>
              <div className='flex items-center gap-1.5 border-b border-[#5e4f34]/60 pb-1 mb-1 w-full justify-center'>
                <span className='text-[10px] font-mono text-[#00f0ff] font-bold'>
                  {project.region || "REALM"}
                </span>
                <span className='text-gold text-xs'>•</span>
                <span className='text-[10px] font-mono text-slate-300 uppercase'>
                  {project.tags[0] || "Code"}
                </span>
              </div>
              <span className='font-cinzel font-bold text-xs sm:text-sm text-white tracking-wide'>
                {project.title}
              </span>
              <span className='text-[9px] font-mono text-gold/80 mt-0.5'>
                ✦ CLICK TO EXPAND DETAILS ✦
              </span>
            </div>
          )}

          {/* EXPANDED PROJECT CARD WHEN CLICKED */}
          {isSelected && (
            <div
              onClick={(e) => e.stopPropagation()}
              className='absolute top-full mt-2 w-72 bg-[#1c1812]/95 border-2 border-[#ffd700] rounded-xl shadow-[0_0_35px_rgba(200,169,98,0.5)] p-4 text-white z-50 animate-fade-in flex flex-col gap-3'
            >
              <div className='flex items-center justify-between border-b border-[#5e4f34] pb-2'>
                <span className='font-cinzel font-bold text-sm text-gold flex items-center gap-1.5 truncate'>
                  <span className='animate-pulse'>🌟</span> {project.title}
                </span>
                <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-void text-gold border border-gold/40'>
                  {project.region}
                </span>
              </div>

              <div className='relative h-32 w-full rounded-lg overflow-hidden border border-[#5e4f34]'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imgUrl}
                  alt={project.title}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                  }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[#1c1812] via-transparent to-transparent opacity-60' />
              </div>

              <p className='text-xs font-rajdhani text-slate-300 line-clamp-2 leading-relaxed'>
                {project.description ||
                  "Ancient code scroll discovered in the Erdtree archives."}
              </p>

              <div className='flex flex-wrap gap-1'>
                {project.tags.slice(0, 3).map((t, i) => (
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
                  onClick={onInspect}
                  className='flex-1 py-1.5 rounded bg-[#ffd700] hover:bg-white text-black font-mono text-xs font-bold uppercase transition shadow-md'
                >
                  📜 FULL DETAILS
                </button>
                {project.liveLink && project.liveLink !== "#" && (
                  <a
                    href={project.liveLink}
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
      </Html>
    </group>
  )
}
