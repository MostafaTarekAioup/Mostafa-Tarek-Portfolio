"use client"

import React, { useRef, useMemo, useState } from "react"
import { useFrame, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Text, Html } from "@react-three/drei"
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
  coords: [number, number, number] // [x, y, z] on map
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
  const { terrainGeo, terrainColors } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 22, 140, 100)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)

    // Elden Ring Palette
    const cDeepOcean = new THREE.Color("#050810")
    const cShallowWater = new THREE.Color("#111e38")
    const cGoldenShore = new THREE.Color("#967d48")
    const cParchmentLow = new THREE.Color("#2f281e")
    const cParchmentMid = new THREE.Color("#3d3326")
    const cForestHigh = new THREE.Color("#293826")
    const cCaelidScarlet = new THREE.Color("#4a1f1f")
    const cAltusGold = new THREE.Color("#6b5a35")
    const cMountainPeak = new THREE.Color("#8f7e63")

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const distFromCenter = Math.sqrt(x * x + y * y)

      // Procedural continent shaping: high center/midlands, tapering off to oceanic trench edges
      const continentMask = Math.max(
        0,
        Math.min(1, (13.5 - distFromCenter) / 4.5),
      )

      // Multi-frequency topographic elevation noise
      const n1 = Math.sin(x * 0.3 + y * 0.2) * Math.cos(x * 0.2 - y * 0.3) * 1.2
      const n2 = Math.sin(x * 0.8 - y * 0.9) * 0.4
      const n3 = Math.cos(x * 1.8 + y * 1.5) * 0.15

      // Regional variation
      let z = (n1 + n2 + n3 + 0.6) * continentMask - (1 - continentMask) * 1.5

      // Create sunken Liurnia lake basin top-left
      if (x < -2 && y > 1) z -= 0.4 * continentMask
      // Raise Altus Plateau top-right
      if (x > 2 && y > 1) z += 0.5 * continentMask
      // Erdtree central pedestal
      if (Math.abs(x) < 2.5 && Math.abs(y - 1.5) < 2.5)
        z += 0.4 * Math.max(0, 2.5 - Math.sqrt(x * x + (y - 1.5) * (y - 1.5)))

      pos.setZ(i, z)

      // Color based on elevation and region coordinates
      const color = new THREE.Color()
      if (z < -0.4) {
        color.copy(cDeepOcean)
      } else if (z < 0.05) {
        color.lerpColors(cDeepOcean, cShallowWater, (z + 0.4) / 0.45)
      } else if (z < 0.25) {
        color.lerpColors(cShallowWater, cGoldenShore, (z - 0.05) / 0.2)
      } else {
        // Above sea level landmass
        if (x > 3 && y < -1) {
          // Caelid Scarlet rot region
          color.lerpColors(
            cParchmentLow,
            cCaelidScarlet,
            Math.min(1, (z - 0.25) / 0.8),
          )
        } else if (x > 2 && y > 1) {
          // Altus Plateau golden wheat
          color.lerpColors(
            cParchmentMid,
            cAltusGold,
            Math.min(1, (z - 0.25) / 1.0),
          )
        } else if (x < -2 && y > 1 && z < 0.6) {
          // Liurnia lake region
          color.lerpColors(
            cShallowWater,
            cForestHigh,
            Math.min(1, (z - 0.25) / 0.5),
          )
        } else if (z < 0.8) {
          color.lerpColors(cParchmentLow, cParchmentMid, (z - 0.25) / 0.55)
        } else if (z < 1.5) {
          color.lerpColors(cParchmentMid, cForestHigh, (z - 0.8) / 0.7)
        } else {
          color.lerpColors(
            cForestHigh,
            cMountainPeak,
            Math.min(1, (z - 1.5) / 0.8),
          )
        }
      }

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return { terrainGeo: geo, terrainColors: colors }
  }, [])

  // Guidance of Grace golden light trails pointing from each project Site of Grace to the central Erdtree
  const guidanceTrails = useMemo(() => {
    const erdtreePos = new THREE.Vector3(0, 1.5, 1.2)
    const lines: THREE.BufferGeometry[] = []

    for (const proj of projects) {
      const [px, py, pz] = proj.coords
      const start = new THREE.Vector3(px, py, pz + 0.3)
      // Midpoint curves high upward
      const mid = new THREE.Vector3(
        (px + 0) * 0.5,
        (py + 1.5) * 0.5,
        Math.max(pz, 1.2) + 2.2,
      )

      const curve = new THREE.QuadraticBezierCurve3(start, mid, erdtreePos)
      const points = curve.getPoints(24)
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
        // Return center
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
        maxPolarAngle={Math.PI / 2.1}
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
            vertexColors
            roughness={0.85}
            metalness={0.15}
            wireframe={false}
          />
        </mesh>

        {/* Topographic Contour Ring Wireframe Overlay */}
        <mesh geometry={terrainGeo} position={[0, 0, 0.02]}>
          <meshBasicMaterial
            color='#c8a962'
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>

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

        {/* THE ERDTREE CORE (Majestic Central World Tree) */}
        <group position={[0, 1.5, 0.8]}>
          {/* Golden Trunk */}
          <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.6, 2.4, 12]} />
            <meshStandardMaterial
              color='#c8a962'
              metalness={0.8}
              roughness={0.2}
              emissive='#ffd700'
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Glowing Golden Canopy */}
          <mesh position={[0, 0, 2.8]}>
            <sphereGeometry args={[1.6, 24, 24]} />
            <meshBasicMaterial
              color='#ffe57f'
              transparent
              opacity={0.35}
              wireframe={false}
            />
          </mesh>
          <mesh position={[0, 0, 2.8]}>
            <sphereGeometry args={[1.3, 16, 16]} />
            <meshPhysicalMaterial
              color='#ffd700'
              emissive='#ffd700'
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
              color='#ffd700'
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Text
            position={[0, -1.8, 1.2]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            fontSize={0.45}
            font='/fonts/Cinzel-Bold.ttf'
            color='#ffd700'
            anchorX='center'
            anchorY='middle'
          >
            THE ERDTREE CORE
          </Text>
        </group>

        {/* Region Banner Labels & Ruined Landmarks across the Lands Between */}
        <group position={[-7, -4.5, 0.5]}>
          <Text
            position={[0, 0, 0.8]}
            rotation={[0, 0, 0]}
            fontSize={0.45}
            color='#4a9eff'
            anchorX='center'
            anchorY='middle'
            outlineWidth={0.02}
            outlineColor='#000000'
          >
            LIMGRAVE • FRONTEND REGION
          </Text>
          {/* Castle Ruin */}
          <mesh position={[-1.8, 1.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color='#2d3548' roughness={0.8} />
          </mesh>
        </group>

        <group position={[-7, 4.5, 0.5]}>
          <Text
            position={[0, 0, 0.8]}
            rotation={[0, 0, 0]}
            fontSize={0.45}
            color='#00f0ff'
            anchorX='center'
            anchorY='middle'
            outlineWidth={0.02}
            outlineColor='#000000'
          >
            LIURNIA • BACKEND & API LAKES
          </Text>
          {/* Raya Lucaria Spire */}
          <mesh position={[1.5, 0.8, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.3, 1.2, 8]} />
            <meshStandardMaterial
              color='#1f2c44'
              roughness={0.7}
              emissive='#00f0ff'
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>

        <group position={[8, -4.5, 0.5]}>
          <Text
            position={[0, 0, 0.8]}
            rotation={[0, 0, 0]}
            fontSize={0.45}
            color='#ff6b35'
            anchorX='center'
            anchorY='middle'
            outlineWidth={0.02}
            outlineColor='#000000'
          >
            CAELID • AI & ALGORITHMS
          </Text>
          {/* Redmane Ruin */}
          <mesh position={[1.2, -1, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.8, 0.5, 0.7]} />
            <meshStandardMaterial color='#4a1c1c' roughness={0.9} />
          </mesh>
        </group>

        <group position={[7, 4.5, 0.6]}>
          <Text
            position={[0, 0, 0.8]}
            rotation={[0, 0, 0]}
            fontSize={0.45}
            color='#c8a962'
            anchorX='center'
            anchorY='middle'
            outlineWidth={0.02}
            outlineColor='#000000'
          >
            ALTUS PLATEAU • ARCHITECTURE
          </Text>
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

        {/* SITES OF GRACE (Lost Grace Beacons for each Project) */}
        {projects.map((proj) => {
          const isSelected = selectedId === proj.id
          const isHovered = hoveredId === proj.id
          const [px, py, pz] = proj.coords

          // Compute exact terrain height at this x,y so Site of Grace sits perfectly on land
          const landZ = 0.3
          const isWeb = proj.tags.some(
            (t) =>
              t.toLowerCase().includes("web") ||
              t.toLowerCase().includes("react") ||
              t.toLowerCase().includes("next"),
          )
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
                  : "#c8a962"

          return (
            <SiteOfGraceMesh
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
            />
          )
        })}
      </group>
    </>
  )
}

function SiteOfGraceMesh({
  project,
  position,
  color,
  isSelected,
  isHovered,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  project: ProjectBeaconData
  position: [number, number, number]
  color: string
  isSelected: boolean
  isHovered: boolean
  onPointerOver: () => void
  onPointerOut: () => void
  onClick: (e: ThreeEvent<MouseEvent>) => void
}) {
  const flameRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (flameRef.current) {
      // Golden flame flicker & spin
      flameRef.current.rotation.z += delta * (isSelected || isHovered ? 4 : 1.8)
      flameRef.current.position.z =
        position[2] +
        0.35 +
        Math.sin(state.clock.elapsedTime * 4 + project.id) * 0.08
      const scaleVariation =
        1 + Math.sin(state.clock.elapsedTime * 6 + project.id) * 0.15
      flameRef.current.scale.set(scaleVariation, scaleVariation, scaleVariation)
    }
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

      {/* The Dancing Golden Flame of Grace */}
      <mesh ref={flameRef} position={[0, 0, 0.35]}>
        <coneGeometry args={[0.22, 0.6, 6]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 1.5 : 0.7}
          metalness={0.2}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Guidance of Grace Vertical Ember Pillar */}
      <mesh position={[0, 0, 1.4]}>
        <cylinderGeometry args={[0.03, 0.06, 2.2, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || isHovered ? 0.8 : 0.25}
        />
      </mesh>

      {/* Floating Name Badge when Hovered or Selected */}
      {(isHovered || isSelected) && (
        <Html position={[0, 0.8, 1.8]} center distanceFactor={12}>
          <div className='px-3 py-1.5 rounded-lg bg-void/95 border-2 border-gold shadow-2xl shadow-gold/30 pointer-events-none flex items-center gap-2 whitespace-nowrap animate-fade-in'>
            <span className='w-2 h-2 rounded-full bg-gold animate-ping' />
            <span className='font-cinzel font-bold text-sm text-white tracking-wider'>
              {project.title}
            </span>
            <span className='text-[10px] font-mono text-gold uppercase px-1.5 py-0.5 bg-gold/20 rounded'>
              SITE OF GRACE
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}
