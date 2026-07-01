"use client";

import React from "react";
import { TopBar } from "@/components/desktop/TopBar";
import { Dock } from "@/components/desktop/Dock";
import { DesktopShortcuts } from "@/components/desktop/DesktopShortcuts";
import { OSWindow } from "@/components/desktop/OSWindow";

import { AboutWindow } from "@/components/windows/AboutWindow";
import { SkillsWindow } from "@/components/windows/SkillsWindow";
import { ProjectsWindow } from "@/components/windows/ProjectsWindow";
import { EducationWindow } from "@/components/windows/EducationWindow";
import { ContactWindow } from "@/components/windows/ContactWindow";
import { AdminWindow } from "@/components/windows/AdminWindow";
import { TerminalWindow } from "@/components/windows/TerminalWindow";

import {
  UserCircle,
  Code2,
  LayoutGrid,
  GraduationCap,
  Mail,
  ShieldCheck,
  Terminal,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Top System Menu Bar */}
      <TopBar />

      {/* Main Desktop Workspace Area */}
      <div className="relative h-[calc(100vh-2.25rem)] w-full">
        {/* Clickable Desktop Icons Grid */}
        <DesktopShortcuts />

        {/* Windows */}
        <OSWindow
          id="about"
          title="Personal Profile & Bio"
          icon={UserCircle}
          defaultWidth={880}
          defaultHeight={580}
          defaultX={120}
          defaultY={50}
        >
          <AboutWindow />
        </OSWindow>

        <OSWindow
          id="skills"
          title="Skills Matrix & Tech Stack"
          icon={Code2}
          defaultWidth={900}
          defaultHeight={600}
          defaultX={160}
          defaultY={60}
        >
          <SkillsWindow />
        </OSWindow>

        <OSWindow
          id="projects"
          title="Project Gallery & Portfolio"
          icon={LayoutGrid}
          defaultWidth={960}
          defaultHeight={620}
          defaultX={140}
          defaultY={55}
        >
          <ProjectsWindow />
        </OSWindow>

        <OSWindow
          id="education"
          title="Education & Certifications"
          icon={GraduationCap}
          defaultWidth={800}
          defaultHeight={540}
          defaultX={180}
          defaultY={70}
        >
          <EducationWindow />
        </OSWindow>

        <OSWindow
          id="contact"
          title="Contact Me & Communications"
          icon={Mail}
          defaultWidth={820}
          defaultHeight={560}
          defaultX={200}
          defaultY={80}
        >
          <ContactWindow />
        </OSWindow>

        <OSWindow
          id="admin"
          title="OS Content Management System (CMS)"
          icon={ShieldCheck}
          defaultWidth={920}
          defaultHeight={640}
          defaultX={150}
          defaultY={55}
        >
          <AdminWindow />
        </OSWindow>

        <OSWindow
          id="terminal"
          title="Aether Terminal [v2.0.26]"
          icon={Terminal}
          defaultWidth={750}
          defaultHeight={480}
          defaultX={220}
          defaultY={90}
        >
          <TerminalWindow />
        </OSWindow>

        {/* Desktop Watermark Footer */}
        <div className="absolute bottom-20 right-6 text-right pointer-events-none z-0 opacity-40">
          <div className="text-sm font-bold tracking-widest text-cyan-400 font-mono">
            AETHER OS • V2.0
          </div>
          <div className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} Mostafa Tarek. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Bottom macOS/Aether Dock */}
      <Dock />
    </main>
  );
}
