"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useOS } from "@/context/OSContext";
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Code2,
  LayoutGrid,
  CheckCircle2,
  Loader2,
  Lock,
  UploadCloud,
  Image as ImageIcon,
  Search,
  Sparkles,
  Cpu,
  Database,
  Terminal,
  LogOut,
  ExternalLink,
  KeyRound,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Skill {
  id: number;
  title: string;
  category: string;
  proficiency: number;
  acquiredDate: string;
  sources: string;
}

interface Project {
  id: number;
  title: string;
  imgUrl: string;
  liveLink: string;
  tags: string;
  tools?: string;
  description?: string;
  images?: string;
}

const tryParseJsonArray = (str?: string): string[] => {
  if (!str) return [];
  try {
    const res = JSON.parse(str);
    return Array.isArray(res) ? res : [str];
  } catch {
    return [str];
  }
};

export function AdminWindow() {
  const { isAdminMode, setIsAdminMode } = useOS();
  const [activeTab, setActiveTab] = useState<"skills" | "projects" | "security">("skills");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Data state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState<string | null>(null);

  // Modals / Form state
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);

  const showNotification = (msg: string) => {
    setNotify(msg);
    setTimeout(() => setNotify(null), 3500);
  };

  const handleCloudinaryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "mostafaaiopu";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "myPreset1";

    const currentImages: string[] = editingProject?.images
      ? (typeof editingProject.images === "string" ? tryParseJsonArray(editingProject.images) : editingProject.images)
      : (editingProject?.imgUrl ? [editingProject.imgUrl] : []);

    const uploadedUrls: string[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        setUploadProgress(Math.round((i / totalFiles) * 100));
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true);
        
        const url = await new Promise<string>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const filePercent = (e.loaded / e.total) * (100 / totalFiles);
              setUploadProgress(Math.min(99, Math.round(((i / totalFiles) * 100) + filePercent)));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200) {
              const res = JSON.parse(xhr.responseText);
              resolve(res.secure_url || res.url);
            } else {
              reject("Upload failed");
            }
          };
          xhr.onerror = () => reject("Network error");
          xhr.send(formData);
        });

        uploadedUrls.push(url);
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        showNotification("Failed to upload image to Cloudinary!");
      }
    }

    setUploadProgress(null);
    setUploadingFiles(false);
    if (uploadedUrls.length > 0) {
      const newImages = [...currentImages, ...uploadedUrls];
      setEditingProject((prev) => prev ? ({
        ...prev,
        images: JSON.stringify(newImages),
        imgUrl: prev.imgUrl || newImages[0],
      }) : null);
      showNotification(`Uploaded ${uploadedUrls.length} image(s) successfully!`);
    }
  };

  const loadData = async () => {
    if (!isAdminMode) return;
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        fetch("/api/skills"),
        fetch("/api/projects"),
      ]);
      if (sRes.ok) setSkills(await sRes.json());
      if (pRes.ok) {
        const pData = await pRes.json();
        setProjects(Array.isArray(pData) ? [...pData].sort((a: Project, b: Project) => b.id - a.id) : pData);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        if (isAdminMode) setIsAdminMode(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/session", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setIsAdminMode(true);
            loadData();
          } else {
            localStorage.removeItem("admin_token");
            setIsAdminMode(false);
          }
        } else {
          localStorage.removeItem("admin_token");
          setIsAdminMode(false);
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    };

    if (isAdminMode) {
      checkSession();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isAdminMode, activeTab]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem("admin_token", data.token);
        setIsAdminMode(true);
        setLoginError("");
        setUsernameInput("");
        setPasswordInput("");
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.2 } });
      } else {
        setLoginError(data.error || "Invalid username or password");
        setPasswordInput("");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setLoginError("Connection error to auth server");
    }
  };

  // --- CRUD SKILLS ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.title) return;

    const isEdit = !!editingSkill.id;
    const method = isEdit ? "PUT" : "POST";
    const payload = {
      ...editingSkill,
      proficiency: Number(editingSkill.proficiency || 80),
      sources: typeof editingSkill.sources === "string"
        ? editingSkill.sources.split(",").map((s) => s.trim())
        : editingSkill.sources || ["Self-Taught"],
    };

    try {
      const res = await fetch("/api/skills", {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showNotification(isEdit ? "Skill Updated Successfully!" : "New Skill Added to Database!");
        setEditingSkill(null);
        loadData();
      } else {
        showNotification("Error: Unauthorized or failed to save!");
      }
    } catch (err) {
      console.error("Error saving skill:", err);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill from database?")) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      if (res.ok) {
        showNotification("Skill Deleted!");
        loadData();
      } else {
        showNotification("Error: Unauthorized or failed to delete!");
      }
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  // --- CRUD PROJECTS ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    const isEdit = !!editingProject.id;
    const method = isEdit ? "PUT" : "POST";
    const payload = {
      ...editingProject,
      tags: typeof editingProject.tags === "string"
        ? editingProject.tags.split(",").map((t) => t.trim())
        : editingProject.tags || ["React"],
      tools: typeof editingProject.tools === "string"
        ? editingProject.tools.split(",").map((t: string) => t.trim())
        : editingProject.tools || [],
      description: editingProject.description || "",
      images: typeof editingProject.images === "string"
        ? tryParseJsonArray(editingProject.images)
        : editingProject.images || (editingProject.imgUrl ? [editingProject.imgUrl] : []),
    };

    try {
      const res = await fetch("/api/projects", {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showNotification(isEdit ? "Project Updated Successfully!" : "New Project Added to Registry!");
        setEditingProject(null);
        loadData();
      } else {
        showNotification("Error: Unauthorized or failed to save!");
      }
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project from database?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
        },
      });
      if (res.ok) {
        showNotification("Project Deleted!");
        loadData();
      } else {
        showNotification("Error: Unauthorized or failed to delete!");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // Filter skills or projects by search
  const filteredSkills = skills.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- UNAUTHENTICATED TERMINAL LOGIN VIEW ---
  if (!isAdminMode) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-6 text-center font-sans bg-slate-950/40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-md w-full bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Top Status Strip */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500" />
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="mb-6 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              SECURITY REGISTRY // RESTRICTED ACCESS
            </span>
            <h3 className="text-xl font-black text-white tracking-tight mt-2">
              Aether OS Command Center
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Authenticate via encrypted administrator credentials to execute CRUD operations on Prisma Postgres database and Cloudinary storage.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5 font-bold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Administrator Identity</span>
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setLoginError("");
                }}
                placeholder="Username or Email (e.g. mostafa)"
                required
                autoFocus
                className="w-full bg-slate-950/90 border border-slate-700/90 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5 font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Security Passkey</span>
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError("");
                }}
                placeholder="Enter password..."
                required
                className="w-full bg-slate-950/90 border border-slate-700/90 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition shadow-inner"
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-mono text-center"
              >
                [AUTH ERROR]: {loginError}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/20 transition active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Launch Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>SSL ENCRYPTED</span>
            <span>PRISMA ORM CONNECTED</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- AUTHENTICATED EXECUTIVE CMS DASHBOARD ---
  return (
    <div className="flex flex-col min-h-full space-y-6 text-slate-100 font-sans pb-6 relative">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {notify && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[99999] bg-emerald-400 text-black px-5 py-3 rounded-2xl shadow-2xl font-extrabold text-xs flex items-center space-x-2.5 border border-white/20"
          >
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            <span>{notify}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Console Bar: System Identity & Tabs Navigation */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/90 backdrop-blur-xl shadow-xl flex flex-col gap-4 shrink-0">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner shrink-0">
              <Terminal className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>OS CONTENT MANAGEMENT SYSTEM (CMS)</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  ROOT PRIVILEGED
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Prisma Postgres ORM connection active. Modifying records reflects immediately on public deployment.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto shrink-0 flex-wrap">
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Skills: <strong className="text-white font-bold">{skills.length}</strong></span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
              <span>Projects: <strong className="text-white font-bold">{projects.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Navigation Pill Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab("skills");
                setSearchQuery("");
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === "skills"
                  ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Skills Registry</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("projects");
                setSearchQuery("");
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === "projects"
                  ? "bg-purple-400 text-black shadow-lg shadow-purple-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Projects Suite</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("security");
                setSearchQuery("");
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === "security"
                  ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Security & Auth</span>
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1 shrink-0" />

            <button
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}` },
                  });
                } catch {}
                localStorage.removeItem("admin_token");
                setIsAdminMode(false);
              }}
              title="Terminate Admin Session"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Quick Search inside Active Tab */}
          {activeTab !== "security" && (
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3 min-h-[350px]">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs font-mono">Syncing PostgreSQL Database Records...</span>
        </div>
      ) : activeTab === "skills" ? (
        /* SKILLS MANAGEMENT TAB */
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Active Tech Stack Registry ({filteredSkills.length})
              </h4>
            </div>
            <button
              onClick={() =>
                setEditingSkill({
                  title: "",
                  category: "Frontend",
                  proficiency: 85,
                  acquiredDate: new Date().getFullYear().toString(),
                  sources: "Self-Taught, Commercial Projects",
                })
              }
              className="flex items-center space-x-1.5 bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-lg shadow-cyan-400/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Deploy New Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 flex items-center justify-between hover:border-cyan-500/50 transition duration-200 shadow-lg group"
              >
                <div className="flex items-start space-x-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0 group-hover:border-cyan-500/30 transition">
                    #{skill.id}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white truncate">{skill.title}</span>
                      <span className="text-[10px] font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/25 shrink-0">
                        {skill.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                      Acquired: <strong className="text-slate-300">{skill.acquiredDate}</strong> • Sources: {skill.sources}
                    </div>
                    {/* Proficiency progress bar */}
                    <div className="w-36 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-800">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${skill.proficiency}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 mr-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    {skill.proficiency}%
                  </span>
                  <button
                    onClick={() => setEditingSkill(skill)}
                    className="p-2 bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded-xl transition border border-slate-700/80 active:scale-95"
                    title="Edit Skill Record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-xl transition border border-slate-700/80 active:scale-95"
                    title="Delete Skill Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "projects" ? (
        /* PROJECTS MANAGEMENT TAB */
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Projects & Systems Suite ({filteredProjects.length})
              </h4>
            </div>
            <button
              onClick={() =>
                setEditingProject({
                  title: "",
                  imgUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                  liveLink: "https://github.com/MostafaTarekAioup",
                  tags: "React, Next.js, Tailwind",
                  tools: "react, jsx, css, reactHooks",
                })
              }
              className="flex items-center space-x-1.5 bg-purple-400 hover:bg-purple-300 text-black px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-lg shadow-purple-400/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Deploy New System</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-purple-500/50 transition duration-200 shadow-lg group"
              >
                <div className="flex items-center space-x-3.5 overflow-hidden w-full sm:w-auto">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img src={proj.imgUrl} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute top-1 left-1 px-1.5 py-0.2 bg-black/80 rounded text-[9px] font-mono text-purple-300">
                      #{proj.id}
                    </div>
                  </div>
                  <div className="truncate flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-white truncate">{proj.title}</span>
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-purple-400 hover:text-purple-300 font-mono inline-flex items-center gap-1 shrink-0"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono mt-1 truncate">
                      <strong className="text-purple-300">Stack:</strong> {proj.tags}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      <strong className="text-slate-300">Tools:</strong> {proj.tools}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setEditingProject(proj)}
                    className="px-3 py-2 bg-slate-800/80 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 rounded-xl transition border border-slate-700/80 text-xs font-bold flex items-center gap-1.5 active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-xl transition border border-slate-700/80 active:scale-95"
                    title="Delete Project Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ACCOUNT SECURITY MANAGEMENT TAB */
        <div className="flex-1 max-w-xl mx-auto w-full pt-2">
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />
            
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-800/80">
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-inner">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Administrator Credentials & Auth</h4>
                <p className="text-xs text-slate-400">Update encrypted passkeys and root email stored in Prisma Postgres.</p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const u = (form.elements.namedItem("sec_username") as HTMLInputElement).value;
                const m = (form.elements.namedItem("sec_email") as HTMLInputElement).value;
                const curP = (form.elements.namedItem("sec_cur_pass") as HTMLInputElement).value;
                const newP = (form.elements.namedItem("sec_new_pass") as HTMLInputElement).value;

                try {
                  const res = await fetch("/api/auth/session", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("admin_token") || ""}`,
                    },
                    body: JSON.stringify({
                      username: u || undefined,
                      email: m || undefined,
                      currentPassword: curP || undefined,
                      newPassword: newP || undefined,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    showNotification("Account security credentials updated!");
                    form.reset();
                  } else {
                    showNotification(`Error: ${data.error || "Update failed"}`);
                  }
                } catch {
                  showNotification("Error: Network or server failure");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">New Username (Optional)</label>
                <input name="sec_username" type="text" placeholder="e.g. mostafa" className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">New Email Address (Optional)</label>
                <input name="sec_email" type="email" placeholder="e.g. mostafammt9@gmail.com" className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
              </div>
              <div className="pt-3 border-t border-slate-800/80">
                <label className="block text-xs font-mono text-amber-400 mb-1 font-bold">Current Password (Required for identity verification) *</label>
                <input name="sec_cur_pass" type="password" required placeholder="Enter current passkey..." className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">New Passkey (Optional)</label>
                <input name="sec_new_pass" type="password" placeholder="Enter new passkey..." className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition" />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Security Configuration</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SKILL CRUD MODAL */}
      {editingSkill && typeof window !== "undefined" && document.body && createPortal(
        <div
          onClick={() => setEditingSkill(null)}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-fadeIn overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 border border-cyan-500/40 rounded-3xl w-full max-w-md shadow-2xl shadow-cyan-500/15 flex flex-col max-h-[85vh] my-auto relative overflow-hidden font-sans"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  {editingSkill.id ? `Configure Skill Record #${editingSkill.id}` : "Deploy New Tech Competency"}
                </h3>
              </div>
              <button
                onClick={() => setEditingSkill(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form onSubmit={handleSaveSkill} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1 max-h-[calc(85vh-140px)] no-scrollbar">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold">Skill Title *</label>
                  <input
                    type="text"
                    required
                    value={editingSkill.title || ""}
                    onChange={(e) => setEditingSkill({ ...editingSkill, title: e.target.value })}
                    placeholder="e.g. Next.js 15, Prisma ORM"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5 font-bold">Category</label>
                    <select
                      value={editingSkill.category || "Frontend"}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Tools & OS">Tools & OS</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5 font-bold">Proficiency % (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editingSkill.proficiency || 80}
                      onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono font-bold text-cyan-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold">Acquisition Timestamp</label>
                  <input
                    type="text"
                    value={editingSkill.acquiredDate || ""}
                    onChange={(e) => setEditingSkill({ ...editingSkill, acquiredDate: e.target.value })}
                    placeholder="e.g. 2024 or Jan 2025"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold">Learning Sources (comma separated)</label>
                  <input
                    type="text"
                    value={editingSkill.sources || ""}
                    onChange={(e) => setEditingSkill({ ...editingSkill, sources: e.target.value })}
                    placeholder="e.g. Udacity, Self-Taught, Official Docs"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950 flex justify-end items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-400/20 transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Commit Skill Record</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* PROJECT CRUD MODAL & CLOUDINARY UPLOADER */}
      {editingProject && typeof window !== "undefined" && document.body && createPortal(
        <div
          onClick={() => setEditingProject(null)}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-fadeIn overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 border border-purple-500/40 rounded-3xl w-full max-w-xl shadow-2xl shadow-purple-500/15 flex flex-col max-h-[90vh] my-auto relative overflow-hidden font-sans"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  {editingProject.id ? `Configure Project Suite #${editingProject.id}` : "Deploy New System Architecture"}
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form onSubmit={handleSaveProject} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1 pr-3 max-h-[calc(90vh-140px)] no-scrollbar">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Aether E-Commerce Portal"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none shadow-inner font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold">System Description & Architecture</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Describe the system features, backend integrations, and UI design..."
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none resize-none shadow-inner"
                  />
                </div>

                {/* Cloudinary Multi-Upload Dropzone */}
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold flex items-center justify-between">
                    <span>Gallery Images (Cloudinary CDN Direct Upload)</span>
                    <span className="text-[10px] font-mono text-cyan-400">Preset: myPreset1</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-700 hover:border-purple-400 rounded-2xl p-5 text-center bg-slate-950/60 transition relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={uploadingFiles}
                      onChange={(e) => handleCloudinaryUpload(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition duration-300">
                        {uploadingFiles ? (
                          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white">
                          {uploadingFiles ? `Transmitting to Cloudinary CDN (${uploadProgress ?? 0}%)...` : "Click or drag high-res screenshots to upload"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Supports PNG, WEBP, JPG • Instant CDN URL generation</p>
                      </div>
                    </div>
                  </div>

                  {uploadingFiles && uploadProgress !== null && (
                    <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300 rounded-full shadow-lg"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Thumbnail Preview Deck */}
                  {(() => {
                    const imgs = editingProject.images
                      ? (typeof editingProject.images === "string" ? tryParseJsonArray(editingProject.images) : editingProject.images)
                      : (editingProject.imgUrl ? [editingProject.imgUrl] : []);
                    if (!imgs || imgs.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-2.5 mt-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 max-h-[160px] overflow-y-auto no-scrollbar">
                        {imgs.map((url, idx) => (
                          <div key={idx} className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-700/80 shrink-0 shadow-md">
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = imgs.filter((_, i) => i !== idx);
                                setEditingProject({
                                  ...editingProject,
                                  images: JSON.stringify(updated),
                                  imgUrl: updated[0] || "",
                                });
                              }}
                              className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                              title="Remove Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-purple-500 text-black text-[9px] font-black text-center py-0.5 uppercase tracking-wider font-mono">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold">Direct Image URL / Cover Fallback</label>
                  <input
                    type="url"
                    value={editingProject.imgUrl || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const imgs = editingProject.images
                        ? (typeof editingProject.images === "string" ? tryParseJsonArray(editingProject.images) : editingProject.images)
                        : [];
                      const updated = imgs.length > 0 ? [val, ...imgs.slice(1)] : [val];
                      setEditingProject({ ...editingProject, imgUrl: val, images: JSON.stringify(updated) });
                    }}
                    placeholder="https://..."
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-bold">Live Demo Link</label>
                  <input
                    type="url"
                    value={editingProject.liveLink || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5 font-bold">Primary Stack Tags</label>
                    <input
                      type="text"
                      value={editingProject.tags || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                      placeholder="e.g. React, Next.js, Tailwind"
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5 font-bold">Tools & Libraries</label>
                    <input
                      type="text"
                      value={editingProject.tools || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, tools: e.target.value })}
                      placeholder="e.g. redux, framer-motion, swiper"
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950 flex justify-end items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-400/20 transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Commit System Record</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
