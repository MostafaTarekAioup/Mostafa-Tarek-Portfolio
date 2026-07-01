"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseAlpha: number;
}

interface HexStream {
  x: number;
  y: number;
  speed: number;
  text: string;
  opacity: number;
}

interface RadarPing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking for interactive network
    const mouse = { x: -1000, y: -1000, radius: 180 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // 1. Initialize Constellation Nodes
    const nodeCount = Math.min(Math.floor((width * height) / 18000), 70);
    const colors = ["#00f0ff", "#7000ff", "#00dbe9", "#d0bcff", "#ff007a"];
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.5 + 0.3,
      });
    }

    // 2. Initialize Floating Hex/Telemetry Data Streams
    const telemetryStrings = [
      "0x7F_AETHER",
      "SYNC: 99.9%",
      "LAT: 30.0444°N",
      "LON: 31.2357°E",
      "SYS_OPTIMAL",
      "UPLINK_ACTIVE",
      "01001010",
      "NODE_CAIRO",
      "KERNEL_v2.0",
      "BIO_METRIC_OK",
      "CYBER_GRID_ON",
      "MAPBOX_READY",
    ];
    const streams: HexStream[] = [];
    const streamCount = Math.min(Math.floor(width / 120), 15);
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 0.6 + 0.2,
        text: telemetryStrings[Math.floor(Math.random() * telemetryStrings.length)],
        opacity: Math.random() * 0.25 + 0.08,
      });
    }

    // 3. Radar Pings
    const pings: RadarPing[] = [];
    let pingTimer = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- Draw Futuristic Perspective Cyber Grid (Bottom 35%) ---
      const horizonY = height * 0.65;
      ctx.save();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.07)";
      ctx.lineWidth = 1;

      // Horizontal grid lines receding to horizon
      for (let y = height; y > horizonY; y -= Math.pow((y - horizonY) / (height - horizonY), 1.5) * 40 + 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Vertical perspective lines pointing to vanishing point (width/2, horizonY)
      const vanishingX = width / 2;
      const spacing = 120;
      const numLines = Math.ceil(width / spacing) * 2;
      for (let i = -numLines; i <= numLines; i++) {
        const startX = vanishingX + i * spacing;
        ctx.beginPath();
        ctx.moveTo(startX, height);
        ctx.lineTo(vanishingX, horizonY);
        ctx.stroke();
      }
      ctx.restore();

      // --- Draw Floating Telemetry Streams ---
      ctx.save();
      ctx.font = "10px 'Space Mono', monospace, sans-serif";
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i];
        s.y -= s.speed;
        if (s.y < -30) {
          s.y = height + 20;
          s.x = Math.random() * width;
          s.text = telemetryStrings[Math.floor(Math.random() * telemetryStrings.length)];
        }
        ctx.fillStyle = `rgba(0, 219, 233, ${s.opacity})`;
        ctx.fillText(s.text, s.x, s.y);
      }
      ctx.restore();

      // --- Draw Radar Pings ---
      pingTimer++;
      if (pingTimer > 240) {
        // Trigger a new radar pulse every ~4 seconds
        pingTimer = 0;
        pings.push({
          x: Math.random() > 0.5 ? width / 2 : Math.random() * width,
          y: Math.random() * (height * 0.8),
          radius: 5,
          maxRadius: Math.random() * 200 + 150,
          alpha: 0.6,
          speed: Math.random() * 1.5 + 1,
        });
      }

      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i];
        p.radius += p.speed;
        p.alpha = 0.6 * (1 - p.radius / p.maxRadius);

        if (p.radius >= p.maxRadius || p.alpha <= 0) {
          pings.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // --- Update and Draw Constellation Nodes ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off walls
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse interaction (gentle attraction / repulsion)
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && mouse.x > 0) {
          // Push gently away or pull slightly
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 1.5;
          n.y -= (dy / dist) * force * 1.5;

          // Draw laser line from node to mouse
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * (1 - dist / mouse.radius)})`;
          ctx.lineWidth = 1;
          ctx.shadowColor = "#00f0ff";
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();
        }

        // Draw connections between nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const ndx = n2.x - n.x;
          const ndy = n2.y - n.y;
          const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
          const maxDist = 140;

          if (ndist < maxDist) {
            const alpha = (1 - ndist / maxDist) * 0.25;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(112, 0, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Draw node dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-85 transition-opacity duration-1000"
    />
  );
}
