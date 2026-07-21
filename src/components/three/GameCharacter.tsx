"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/context/GameContext";

interface GameCharacterProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function GameCharacter({
  scale = 1,
  position = [1.2, -1.1, 0],
  rotation = [0, -0.3, 0],
}: GameCharacterProps) {
  const { activePose, gamePhase } = useGame();

  const groupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const swordRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Group>(null);

  // Materials definition
  const materials = useMemo(() => {
    return {
      armorSteel: new THREE.MeshStandardMaterial({
        color: "#1a1f2e",
        metalness: 0.85,
        roughness: 0.25,
      }),
      armorGold: new THREE.MeshStandardMaterial({
        color: "#c8a962",
        metalness: 0.9,
        roughness: 0.15,
        emissive: "#c8a962",
        emissiveIntensity: 0.2,
      }),
      hoodieDark: new THREE.MeshStandardMaterial({
        color: "#0f1523",
        roughness: 0.9,
      }),
      skin: new THREE.MeshStandardMaterial({
        color: "#d4a373",
        roughness: 0.6,
      }),
      eyeGlow: new THREE.MeshBasicMaterial({
        color: "#00f0ff",
      }),
      swordBlade: new THREE.MeshPhysicalMaterial({
        color: "#2a3040",
        metalness: 0.95,
        roughness: 0.1,
        emissive: "#50c878",
        emissiveIntensity: 0.4,
      }),
      shieldBody: new THREE.MeshStandardMaterial({
        color: "#0a0e17",
        metalness: 0.8,
        roughness: 0.3,
      }),
      shieldGlow: new THREE.MeshBasicMaterial({
        color: "#4a9eff",
      }),
    };
  }, []);

  // Frame loop for idle animations, mouse tracking, and pose transitions
  useFrame((state, delta) => {
    if (!groupRef.current || !torsoRef.current || !headRef.current || !rightArmRef.current || !leftArmRef.current) {
      return;
    }

    const t = state.clock.elapsedTime;

    // 1. Idle breathing loop (torso expansion and vertical float)
    torsoRef.current.position.y = Math.sin(t * 2) * 0.03;
    torsoRef.current.scale.y = 1 + Math.sin(t * 2) * 0.015;

    // 2. Head & eye mouse tracking (smooth lerp towards cursor)
    const targetHeadX = state.pointer.y * 0.3;
    const targetHeadY = state.pointer.x * 0.5;
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetHeadX, delta * 5);
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetHeadY, delta * 5);

    // 3. Target poses for arms based on active menu item hover (activePose)
    let targetRightArmX = 0;
    let targetRightArmZ = -0.1;
    let targetLeftArmX = 0;
    let targetLeftArmZ = 0.1;
    let targetGroupY = position[1];
    let targetGroupZ = position[2];

    if (gamePhase === "loading") {
      // Powerful Kratos idle stance centered on screen right
      targetRightArmX = -0.3 + Math.sin(t * 1.5) * 0.05;
      targetLeftArmX = -0.2 + Math.cos(t * 1.5) * 0.05;
    } else {
      // Menu / exploring phase
      switch (activePose) {
        case "portfolio":
          // Raise sword (Code Blade) forward proudly
          targetRightArmX = -1.2;
          targetRightArmZ = -0.3;
          targetLeftArmX = -0.1;
          break;
        case "about":
          // Cross arms or stand tall
          targetRightArmX = -0.5;
          targetLeftArmX = -0.5;
          targetRightArmZ = -0.4;
          targetLeftArmZ = 0.4;
          break;
        case "skills":
          // Present shield forward
          targetLeftArmX = -1.1;
          targetLeftArmZ = 0.3;
          targetRightArmX = -0.2;
          break;
        case "findMe":
          // Point outward / weapon outward
          targetRightArmX = -0.8;
          targetRightArmZ = -0.6;
          break;
        case "contact":
          // Open stance welcoming
          targetRightArmX = -0.4;
          targetRightArmZ = -0.5;
          targetLeftArmX = -0.4;
          targetLeftArmZ = 0.5;
          break;
        case "admin":
          // Commanding executive pose (arms steady, ready for terminal command)
          targetRightArmX = -0.7;
          targetRightArmZ = -0.2;
          targetLeftArmX = -0.7;
          targetLeftArmZ = 0.2;
          break;
        default:
          // Heroic resting stance
          targetRightArmX = -0.2 + Math.sin(t * 1.5) * 0.04;
          targetLeftArmX = -0.15 + Math.cos(t * 1.5) * 0.04;
          break;
      }
    }

    // Lerp arms toward target pose
    rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRightArmX, delta * 6);
    rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetRightArmZ, delta * 6);
    leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetLeftArmX, delta * 6);
    leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, targetLeftArmZ, delta * 6);

    // Smooth transition between loading position and menu position
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetGroupY, delta * 4);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetGroupZ, delta * 4);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Root Torso Assembly */}
      <group ref={torsoRef} position={[0, 1.3, 0]}>
        {/* Main Chest Plate (Armor) */}
        <mesh material={materials.armorSteel} position={[0, 0.4, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.4]} />
        </mesh>

        {/* Gold Rune Trim on Chest Plate */}
        <mesh material={materials.armorGold} position={[0, 0.4, 0.21]}>
          <boxGeometry args={[0.4, 0.6, 0.02]} />
        </mesh>
        <mesh material={materials.eyeGlow} position={[0, 0.5, 0.22]}>
          <boxGeometry args={[0.15, 0.15, 0.01]} />
        </mesh>

        {/* Shoulder Pauldrons (Left & Right) */}
        <mesh material={materials.armorGold} position={[-0.45, 0.7, 0]}>
          <boxGeometry args={[0.3, 0.25, 0.45]} />
        </mesh>
        <mesh material={materials.armorGold} position={[0.45, 0.7, 0]}>
          <boxGeometry args={[0.3, 0.25, 0.45]} />
        </mesh>

        {/* Hoodie Under-layer (Neck/Collar) */}
        <mesh material={materials.hoodieDark} position={[0, 0.85, -0.05]}>
          <cylinderGeometry args={[0.22, 0.28, 0.2, 8]} />
        </mesh>

        {/* Head & Face Group */}
        <group ref={headRef} position={[0, 1.1, 0]}>
          {/* Head Sphere */}
          <mesh material={materials.skin}>
            <sphereGeometry args={[0.26, 12, 12]} />
          </mesh>

          {/* Short Beard Stubble / Jaw */}
          <mesh material={materials.hoodieDark} position={[0, -0.08, 0.08]}>
            <boxGeometry args={[0.28, 0.18, 0.28]} />
          </mesh>

          {/* Glowing Eyes (Left & Right) */}
          <mesh material={materials.eyeGlow} position={[-0.09, 0.06, 0.23]}>
            <boxGeometry args={[0.06, 0.03, 0.02]} />
          </mesh>
          <mesh material={materials.eyeGlow} position={[0.09, 0.06, 0.23]}>
            <boxGeometry args={[0.06, 0.03, 0.02]} />
          </mesh>
        </group>

        {/* Right Arm & Code Blade Weapon */}
        <group ref={rightArmRef} position={[-0.48, 0.6, 0]}>
          {/* Upper Arm & Forearm */}
          <mesh material={materials.armorSteel} position={[0, -0.35, 0]}>
            <boxGeometry args={[0.22, 0.7, 0.22]} />
          </mesh>
          {/* Hand */}
          <mesh material={materials.skin} position={[0, -0.75, 0]}>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
          </mesh>

          {/* Code Blade Weapon held in Right Hand */}
          <group ref={swordRef} position={[0, -0.75, 0.4]} rotation={[1.2, 0, 0]}>
            {/* Hilt / Grip */}
            <mesh material={materials.armorGold} position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
            </mesh>
            {/* Crossguard */}
            <mesh material={materials.armorSteel} position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.06, 0.1]} />
            </mesh>
            {/* Main Blade with Terminal Green Glow */}
            <mesh material={materials.swordBlade} position={[0, 0.6, 0]}>
              <boxGeometry args={[0.16, 1.2, 0.04]} />
            </mesh>
            {/* Keyboard Keys texture notches along the blade */}
            <mesh material={materials.eyeGlow} position={[0, 0.5, 0.025]}>
              <boxGeometry args={[0.08, 0.8, 0.01]} />
            </mesh>
          </group>
        </group>

        {/* Left Arm & </> Hex Shield */}
        <group ref={leftArmRef} position={[0.48, 0.6, 0]}>
          {/* Upper Arm & Forearm */}
          <mesh material={materials.armorSteel} position={[0, -0.35, 0]}>
            <boxGeometry args={[0.22, 0.7, 0.22]} />
          </mesh>
          {/* Hand */}
          <mesh material={materials.skin} position={[0, -0.75, 0]}>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
          </mesh>

          {/* Hexagonal Shield held on Left Forearm */}
          <group ref={shieldRef} position={[0.15, -0.4, 0]} rotation={[0, -1.5, 0]}>
            {/* Shield Body (Hex Cylinder) */}
            <mesh material={materials.shieldBody} rotation={[0, 0, Math.PI / 6]}>
              <cylinderGeometry args={[0.45, 0.45, 0.06, 6]} />
            </mesh>
            {/* Gold Rim */}
            <mesh material={materials.armorGold} rotation={[0, 0, Math.PI / 6]} position={[0, 0, 0.01]}>
              <cylinderGeometry args={[0.47, 0.47, 0.05, 6]} />
            </mesh>
            {/* Glowing </> Emblem in center */}
            <mesh material={materials.shieldGlow} position={[0, 0, 0.04]}>
              <boxGeometry args={[0.2, 0.06, 0.02]} />
            </mesh>
          </group>
        </group>

        {/* Legs / Lower Body */}
        <group position={[0, -0.4, 0]}>
          {/* Waist/Belt */}
          <mesh material={materials.armorGold} position={[0, 0, 0]}>
            <boxGeometry args={[0.68, 0.15, 0.38]} />
          </mesh>

          {/* Left Leg */}
          <mesh material={materials.hoodieDark} position={[-0.2, -0.55, 0]}>
            <boxGeometry args={[0.26, 0.9, 0.26]} />
          </mesh>
          {/* Left Greave (Armor Boot) */}
          <mesh material={materials.armorSteel} position={[-0.2, -0.8, 0.02]}>
            <boxGeometry args={[0.28, 0.45, 0.3]} />
          </mesh>

          {/* Right Leg */}
          <mesh material={materials.hoodieDark} position={[0.2, -0.55, 0]}>
            <boxGeometry args={[0.26, 0.9, 0.26]} />
          </mesh>
          {/* Right Greave (Armor Boot) */}
          <mesh material={materials.armorSteel} position={[0.2, -0.8, 0.02]}>
            <boxGeometry args={[0.28, 0.45, 0.3]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
