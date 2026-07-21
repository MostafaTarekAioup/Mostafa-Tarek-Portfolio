"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: [number, number, number];
}

export function ParticleField({
  count = 150,
  color = "#c8a962",
  size = 0.04,
  speed = 0.2,
  spread = [12, 10, 10],
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, opacities] = useMemo(() => {
    const posArray = new Float32Array(count * 3);
    const opacArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * spread[0];
      posArray[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      posArray[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
      opacArray[i] = Math.random() * 0.8 + 0.2;
    }

    return [posArray, opacArray];
  }, [count, spread]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    // Slow drift upward and gentle rotation
    pointsRef.current.rotation.y += delta * speed * 0.15;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    if (positionsAttr) {
      for (let i = 0; i < count; i++) {
        let y = positionsAttr.getY(i);
        y += delta * speed * (0.3 + (i % 3) * 0.2);
        if (y > spread[1] / 2) {
          y = -spread[1] / 2;
        }
        positionsAttr.setY(i, y);
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          args={[opacities, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
