"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOS } from "@/context/OSContext";
import { Terminal as TerminalIcon, Play, RotateCcw } from "lucide-react";

interface HistoryItem {
  cmd: string;
  output: string | React.ReactNode;
}

export function TerminalWindow() {
  const { openWindow, isAdminMode } = useOS();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      cmd: "init",
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-cyan-400 font-bold">Welcome to Aether OS Terminal [Version 2.0.26]</p>
          <p>Type <code className="text-emerald-400">help</code> to see available commands or <code className="text-emerald-400">projects</code> to view work.</p>
        </div>
      ),
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    let output: React.ReactNode = "";

    switch (trimmed) {
      case "help":
        output = (
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 py-1">
            <div><span className="text-cyan-400 font-bold">whoami</span> - Display short bio</div>
            <div><span className="text-cyan-400 font-bold">skills</span> - List tech stack & matrix</div>
            <div><span className="text-cyan-400 font-bold">projects</span> - List portfolio projects</div>
            <div><span className="text-cyan-400 font-bold">education</span> - University & Udacity</div>
            <div><span className="text-cyan-400 font-bold">contact</span> - Email & Phone details</div>
            <div><span className="text-cyan-400 font-bold">admin</span> - Launch Admin Dashboard</div>
            <div><span className="text-cyan-400 font-bold">clear</span> - Clear terminal buffer</div>
          </div>
        );
        break;
      case "whoami":
      case "bio":
        output = (
          <div className="text-slate-300 space-y-1">
            <p className="font-bold text-white">Mostafa Tarek | Front-End React Developer</p>
            <p>1+ Years of commercial experience building modern, reactive web architectures in Cairo, Egypt.</p>
          </div>
        );
        break;
      case "skills":
        output = (
          <div className="text-emerald-300 font-mono space-y-1">
            <p>• Frontend: React, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, HTML5/CSS3</p>
            <p>• Tools & State: Git, GitHub, Vite, Prisma, SQLite, REST APIs</p>
            <p>• Learning Sources: Udacity Nanodegree, Self-Taught, Official Documentation</p>
          </div>
        );
        break;
      case "projects":
        output = (
          <div className="space-y-1 text-purple-300">
            <p>Loading projects list... Opening Project Gallery window...</p>
          </div>
        );
        openWindow("projects");
        break;
      case "education":
        output = (
          <div className="text-amber-300 space-y-1">
            <p>• Zagazig University - Bachelor's Degree (2020)</p>
            <p>• Udacity - Advanced React Professional Nanodegree (2022)</p>
          </div>
        );
        break;
      case "contact":
        output = (
          <div className="text-rose-300 space-y-1">
            <p>Email: mostafammt9@gmail.com</p>
            <p>Phone / WhatsApp: +20 01150414986</p>
            <p>GitHub: github.com/MostafaTarekAioup</p>
          </div>
        );
        break;
      case "admin":
        output = (
          <div className="text-cyan-300">
            {isAdminMode
              ? "Admin Mode already active. Opening Admin Dashboard..."
              : "Opening Admin Authentication prompt..."}
          </div>
        );
        openWindow("admin");
        break;
      case "clear":
      case "cls":
        setHistory([]);
        setInput("");
        return;
      default:
        output = (
          <div className="text-rose-400">
            Command not recognized: <span className="font-bold">{trimmed}</span>. Type <code className="text-white">help</code> for list.
          </div>
        );
    }

    setHistory((prev) => [...prev, { cmd: input, output }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/95 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 select-none overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-slate-400">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span>aether-terminal@cairo:~</span>
        </div>
        <button
          onClick={() => setHistory([])}
          className="flex items-center space-x-1 hover:text-white transition"
          title="Clear Terminal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>clear</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {history.map((item, index) => (
          <div key={index} className="space-y-1">
            {item.cmd !== "init" && (
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
                <span>mostafa@aether:~$</span>
                <span className="text-white">{item.cmd}</span>
              </div>
            )}
            <div className="pl-4 border-l border-slate-800 text-slate-300">{item.output}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-3 pt-3 border-t border-slate-800 flex items-center space-x-2">
        <span className="text-cyan-400 font-bold">mostafa@aether:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command (e.g., help, skills, whoami)..."
          autoFocus
          className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600 font-mono"
        />
        <button type="submit" className="text-slate-500 hover:text-cyan-400 transition">
          <Play className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
