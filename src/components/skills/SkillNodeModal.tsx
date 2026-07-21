"use client";

import React from "react";
import { SidePanel } from "@/components/game-ui/SidePanel";
import { RuneButton } from "@/components/game-ui/RuneButton";

interface Skill {
  id: number;
  title: string;
  iconName: string;
  acquiredDate: string;
  sources: string[];
  category: string;
  proficiency: number;
}

interface SkillNodeModalProps {
  skill: Skill | null;
  onClose: () => void;
}

export function SkillNodeModal({ skill, onClose }: SkillNodeModalProps) {
  if (!skill) return null;

  const isMastery = skill.proficiency >= 90;

  return (
    <SidePanel
      isOpen={!!skill}
      onClose={onClose}
      title={skill.title}
      subtitle={`SKILL NODE #${skill.id} • ${skill.category.toUpperCase()} TREE`}
      badgeText={isMastery ? "CORE MASTERY NODE" : "PROFICIENT NODE"}
      badgeColor={isMastery ? "gold" : "mana"}
      width="md"
    >
      {/* 1. Proficiency Meter & Rank */}
      <div className="game-panel p-5 rounded-2xl border border-iron/80 space-y-3 bg-dark-steel/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            NODE ATTACK & MASTERY POWER
          </span>
          <span className={`text-xl font-black font-cinzel ${isMastery ? "text-gold" : "text-mana"}`}>
            {skill.proficiency}/100
          </span>
        </div>

        <div className="w-full h-3 bg-void rounded-full overflow-hidden border border-iron p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 shadow-sm ${
              isMastery
                ? "bg-gradient-to-r from-ember via-gold to-nature"
                : "bg-gradient-to-r from-dark-steel via-mana to-cyan-300"
            }`}
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
          <span>RANK: {isMastery ? "GRANDMASTER (TIER S)" : "EXPERT VANGUARD (TIER A)"}</span>
          <span>ACQUIRED: {skill.acquiredDate || "2020"}</span>
        </div>
      </div>

      {/* 2. Lore & Training Sources */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
          TRAINING GRIMOIRES & EXPERIENCE SOURCES
        </h4>
        <div className="space-y-2">
          {skill.sources.map((src, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-dark-steel/60 border border-iron/70 flex items-center gap-3"
            >
              <span className="text-xl">📜</span>
              <span className="text-sm font-rajdhani text-slate-200 font-medium">
                {src}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Category Cluster & Synergy */}
      <div className="game-panel p-4 rounded-xl border border-iron/60 bg-void/60 space-y-2">
        <h4 className="text-xs font-mono font-bold text-mana uppercase tracking-wider">
          CONSTELLATION SYNERGY
        </h4>
        <p className="text-xs font-rajdhani text-slate-300 leading-relaxed">
          This skill node forms a direct neural link with other technologies in the{" "}
          <strong className="text-white">{skill.category}</strong> constellation. Upgrading this node enhances overall front-end architecture rendering speed and state management stability.
        </p>
      </div>

      {/* Footer Close */}
      <div className="pt-4 border-t border-iron/80 flex justify-end">
        <RuneButton variant="primary" size="md" onClick={onClose}>
          CLOSE NODE INSPECTOR [ESC]
        </RuneButton>
      </div>
    </SidePanel>
  );
}
