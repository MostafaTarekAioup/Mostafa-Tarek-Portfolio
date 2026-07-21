"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

interface SceneWrapperProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  interactive?: boolean;
}

export function SceneWrapper({
  children,
  className = "w-full h-full",
  cameraPosition = [0, 1.5, 5],
  fov = 45,
  interactive = true,
}: SceneWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!webglSupported) {
    return (
      <div className={`flex items-center justify-center bg-void/80 p-6 text-center ${className}`}>
        <div className="game-panel p-4 rounded-xl max-w-sm">
          <span className="text-2xl font-cinzel text-gold block mb-2">🛡️</span>
          <p className="text-xs text-slate-300 font-mono">
            [3D ENGINE OFFLINE] WebGL acceleration is not enabled or supported on this device. Displaying 2D fallback mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        frameloop={isMobile ? "demand" : "always"}
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full pointer-events-auto"
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />
        
        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          color="#c8a962"
        />
        <directionalLight
          position={[-5, -5, -5]}
          intensity={0.6}
          color="#4a9eff"
        />
        <pointLight position={[0, 3, 2]} intensity={0.8} color="#ff6b35" distance={8} />

        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
