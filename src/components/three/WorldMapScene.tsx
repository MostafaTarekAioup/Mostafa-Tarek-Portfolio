"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/context/GameContext";

interface ProjectBeaconData {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string[];
  tools: string[];
  description: string;
  images: string[];
  coords: [number, number, number]; // [x, y, z] on map
}

interface WorldMapSceneProps {
  projects: ProjectBeaconData[];
  selectedId: number | null;
  onSelectProject: (project: ProjectBeaconData) => void;
}

export function WorldMapScene({ projects, selectedId, onSelectProject }: WorldMapSceneProps) {
  const { playSfx } = useGame();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Topographic grid / map plane
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(26, 18, 64, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Topographic height variation
      const z = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 0.35 + Math.sin(x * 1.2 + y * 0.8) * 0.12;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group rotation={[-Math.PI / 3.4, 0, 0]} position={[0, -1.2, -2]}>
      {/* Topographic Terrain Base */}
      <mesh geometry={terrainGeo} position={[0, 0, -0.1]}>
        <meshStandardMaterial
          color="#0f1523"
          roughness={0.8}
          metalness={0.4}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe Topographic Grid Overlay */}
      <mesh geometry={terrainGeo} position={[0, 0, 0.01]}>
        <meshBasicMaterial
          color="#1a263c"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Decorative Outer Ring / Compass Border */}
      <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0]}>
        <ringGeometry args={[11.5, 11.8, 64]} />
        <meshBasicMaterial color="#c8a962" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Project Beacons / Fast Travel Obelisks */}
      {projects.map((proj) => {
        const isSelected = selectedId === proj.id;
        const isHovered = hoveredId === proj.id;
        const [px, py, pz] = proj.coords;

        // Color based on category / tag
        const isWeb = proj.tags.some((t) => t.toLowerCase().includes("web") || t.toLowerCase().includes("react") || t.toLowerCase().includes("next"));
        const beaconColor = isSelected ? "#00f0ff" : isHovered ? "#ff6b35" : isWeb ? "#4a9eff" : "#c8a962";

        return (
          <BeaconMesh
            key={proj.id}
            project={proj}
            position={[px, py, pz]}
            color={beaconColor}
            isSelected={isSelected}
            isHovered={isHovered}
            onPointerOver={() => {
              playSfx("hover");
              setHoveredId(proj.id);
            }}
            onPointerOut={() => setHoveredId(null)}
            onClick={(e) => {
              e.stopPropagation();
              playSfx("click");
              onSelectProject(proj);
            }}
          />
        );
      })}
    </group>
  );
}

function BeaconMesh({
  project,
  position,
  color,
  isSelected,
  isHovered,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  project: ProjectBeaconData;
  position: [number, number, number];
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.z += delta * (isSelected || isHovered ? 2.5 : 1);
      crystalRef.current.position.z = position[2] + 0.6 + Math.sin(state.clock.elapsedTime * 3 + project.id) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 1.5;
    }
  });

  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* Base Pedestal */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.5, 0.3, 6]} />
        <meshStandardMaterial color="#1a1f2e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rotating Magic Ring on ground */}
      <mesh ref={ringRef} position={[0, 0, 0.05]}>
        <ringGeometry args={[0.45, 0.6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected || isHovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating Hex Crystal Beacon */}
      <mesh ref={crystalRef} position={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.18, 0.02, 0.8, 6]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 0.8 : 0.3}
          metalness={0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Vertical Light Pillar / Beam */}
      <mesh position={[0, 0, 2.2]}>
        <cylinderGeometry args={[0.04, 0.04, 3.6, 8]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected || isHovered ? 0.7 : 0.25} />
      </mesh>
    </group>
  );
}
