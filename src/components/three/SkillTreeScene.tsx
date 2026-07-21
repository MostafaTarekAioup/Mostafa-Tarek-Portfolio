"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/context/GameContext";

interface SkillNodeData {
  id: number;
  title: string;
  iconName: string;
  acquiredDate: string;
  sources: string[];
  category: string;
  proficiency: number;
  coords: [number, number, number];
  hubCoords: [number, number, number];
}

interface SkillTreeSceneProps {
  skills: SkillNodeData[];
  selectedId: number | null;
  onSelectSkill: (skill: SkillNodeData) => void;
}

export function SkillTreeScene({ skills, selectedId, onSelectSkill }: SkillTreeSceneProps) {
  const { playSfx } = useGame();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Build connecting lines from each node to its hub
  const lineGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (const skill of skills) {
      points.push(new THREE.Vector3(...skill.coords));
      points.push(new THREE.Vector3(...skill.hubCoords));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [skills]);

  // Unique category hubs
  const hubs = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const skill of skills) {
      if (!map.has(skill.category)) {
        map.set(skill.category, skill.hubCoords);
      }
    }
    return Array.from(map.entries());
  }, [skills]);

  return (
    <group position={[0, -0.4, -1]}>
      {/* Constellation Neural Lines */}
      {lineGeo && (
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial color="#4a9eff" transparent opacity={0.35} />
        </lineSegments>
      )}

      {/* Category Core Hubs */}
      {hubs.map(([category, coords], idx) => (
        <group key={`hub-${idx}`} position={coords}>
          <mesh>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#c8a962" metalness={0.9} roughness={0.1} emissive="#c8a962" emissiveIntensity={0.4} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshBasicMaterial color="#c8a962" wireframe transparent opacity={0.25} />
          </mesh>
        </group>
      ))}

      {/* Individual Skill Nodes */}
      {skills.map((skill) => {
        const isSelected = selectedId === skill.id;
        const isHovered = hoveredId === skill.id;
        const isMastery = skill.proficiency >= 90;
        const nodeColor = isSelected ? "#00f0ff" : isHovered ? "#ff6b35" : isMastery ? "#c8a962" : "#4a9eff";

        return (
          <SkillNodeMesh
            key={skill.id}
            skill={skill}
            color={nodeColor}
            isSelected={isSelected}
            isHovered={isHovered}
            isMastery={isMastery}
            onPointerOver={() => {
              playSfx("hover");
              setHoveredId(skill.id);
            }}
            onPointerOut={() => setHoveredId(null)}
            onClick={(e) => {
              e.stopPropagation();
              playSfx("click");
              onSelectSkill(skill);
            }}
          />
        );
      })}
    </group>
  );
}

function SkillNodeMesh({
  skill,
  color,
  isSelected,
  isHovered,
  isMastery,
  onPointerOver,
  onPointerOut,
  onClick,
}: {
  skill: SkillNodeData;
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  isMastery: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isSelected || isHovered ? 3 : 1);
      meshRef.current.rotation.z += delta * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 2;
    }
  });

  const size = isMastery ? 0.32 : 0.24;

  return (
    <group position={skill.coords} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* Node Core Polyhedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[size, isMastery ? 1 : 0]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 0.9 : isMastery ? 0.5 : 0.2}
          metalness={0.7}
          roughness={0.15}
        />
      </mesh>

      {/* Outer Orbiting Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[size * 1.3, size * 1.5, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected || isHovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Hover/Selection Pulse Sphere */}
      {(isSelected || isHovered) && (
        <mesh>
          <sphereGeometry args={[size * 1.8, 16, 16]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
