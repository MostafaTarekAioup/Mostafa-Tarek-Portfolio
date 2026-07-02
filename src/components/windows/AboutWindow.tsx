"use client";

import React, { useState, useEffect } from "react";
import { useOS } from "@/context/OSContext";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Download,
  Code2,
  LayoutGrid,
  Sparkles,
  Award,
} from "lucide-react";

interface ProfileData {
  fullName?: string;
  name?: string;
  title?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  cvUrl?: string;
  experience?: string;
  phone?: string;
  city?: string;
}

export function AboutWindow() {
  const { openWindow } = useOS();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  const bioParagraphs = profile?.bio
    ? profile.bio.split("\n\n")
    : [
      "Specialized in Front-End React development with a strong focus on building responsive, performant, and interactive web applications.",
      "Experienced in transforming UI/UX designs into functional code, collaborating with cross-functional teams, and implementing scalable state management architectures.",
    ];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full overflow-y-auto select-none pr-1">
      {/* Left Column: Avatar & Quick Info Card */}
      <div className="w-full md:w-72 flex flex-col items-center bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-xl backdrop-blur-md">
        {/* Glowing Avatar */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse-slow" />
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-950">
            <img
              src={"/images/MyPersonalImage.jpg"}
              alt={profile?.name || "Mostafa Tarek"}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
              }}
            />
          </div>
          <div className="absolute bottom-2 right-2 flex items-center bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-mono shadow-lg backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
            <span>ONLINE</span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white tracking-wide">
          {profile?.fullName || profile?.name || "Mostafa Tarek"}
        </h2>
        <p className="text-xs font-medium text-cyan-400 mt-0.5">
          {profile?.title || profile?.role || "Frontend Engineer (React)"}
        </p>

        <div className="w-full border-t border-slate-800 my-4" />

        {/* Info List */}
        <div className="w-full space-y-2.5 text-left text-xs text-slate-300">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Cairo, Egypt</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{profile?.experience || "4+ Years Commercial Exp"}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Zagazig Univ • Udacity Cert</span>
          </div>
        </div>

        <div className="w-full border-t border-slate-800 my-4" />

        {/* CV Download Button */}
        <a
          href={profile?.cvUrl || "/images/Mostafa Tarek_Aioup_CV.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download CV / Resume</span>
        </a>
      </div>

      {/* Right Column: Bio & Highlights */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden">
          <Sparkles className="absolute right-4 top-4 w-20 h-20 text-cyan-500/10 -rotate-12 pointer-events-none" />
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
            <span>SYSTEM INITIALIZED • AETHER OS V2.0</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Welcome to my Interactive Portfolio Desktop
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            I build sleek, responsive, and modern front-end architectures using React, Next.js, and TypeScript. Explore my projects, skills, and certifications using this OS window interface or the dock below.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => openWindow("projects")}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Explore Projects</span>
            </button>
            <button
              onClick={() => openWindow("skills")}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>View Tech Stack</span>
            </button>
            <button
              onClick={() => openWindow("education")}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certifications</span>
            </button>
          </div>
        </div>

        {/* Biography Section */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-semibold text-white flex items-center">
            <User className="w-4 h-4 mr-2 text-cyan-400" />
            <span>Professional Summary</span>
          </h4>
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            {bioParagraphs.map((para, i) => (
              <p key={i} className="text-slate-300/90">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Education & Nanodegrees Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Zagazig University</h5>
              <p className="text-[11px] text-cyan-400">Bachelor&apos;s Degree • 2020</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Completed undergraduate studies with solid engineering & analytical foundation.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Udacity Nanodegree</h5>
              <p className="text-[11px] text-purple-400">React Professional • 2022</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Advanced React Nanodegree covering Redux, hooks, routing, and modern web apps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
