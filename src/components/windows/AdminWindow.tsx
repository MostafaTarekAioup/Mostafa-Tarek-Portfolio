"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
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
}

export function AdminWindow() {
  const { isAdminMode, setIsAdminMode } = useOS();
  const [activeTab, setActiveTab] = useState<"skills" | "projects" | "education" | "profile" | "security">("skills");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Data state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState<string | null>(null);

  // Modals / Form state
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  const showNotification = (msg: string) => {
    setNotify(msg);
    setTimeout(() => setNotify(null), 3500);
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
      if (pRes.ok) setProjects(await pRes.json());
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

  if (!isAdminMode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 animate-bounce-slow shadow-lg shadow-cyan-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Aether OS Administrator Portal</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Log into Prisma Postgres management dashboard. Enter your verified account credentials below to manage projects, skills, and site configurations.
        </p>

        <form onSubmit={handleLoginSubmit} className="w-full max-w-xs space-y-3">
          <div>
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <div>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setLoginError("");
              }}
              placeholder="Password (Default: admin123)"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          {loginError && <p className="text-xs text-rose-400 font-medium">{loginError}</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In to Dashboard</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4 select-none relative">
      {/* Toast Notification */}
      {notify && (
        <div className="absolute top-2 right-2 z-50 bg-emerald-500 text-black px-4 py-2 rounded-xl shadow-2xl font-semibold text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notify}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white">OS Content Management System</h3>
            <span className="text-[10px] font-mono text-cyan-400">STATUS: ADMIN AUTHENTICATED • PRISMA POSTGRES CONNECTED</span>
          </div>
        </div>

        {/* Tab Buttons & Lock */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "skills" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skills ({skills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "projects" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "security" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Account Security</span>
          </button>
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
            title="Logout of Dashboard"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition ml-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs font-mono">Syncing Database Records...</span>
        </div>
      ) : activeTab === "skills" ? (
        /* SKILLS MANAGEMENT TAB */
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tech Stack Database</h4>
            <button
              onClick={() =>
                setEditingSkill({
                  title: "",
                  category: "Frontend",
                  proficiency: 85,
                  acquiredDate: new Date().getFullYear().toString(),
                  sources: "Self-Taught, Official Docs",
                })
              }
              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Skill</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{skill.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                      {skill.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Acquired: <span className="text-slate-300">{skill.acquiredDate}</span> • Sources:{" "}
                    <span className="text-slate-300">{skill.sources}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingSkill(skill)}
                    className="p-1.5 bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 rounded-lg transition border border-slate-700"
                    title="Edit Skill"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-lg transition border border-slate-700"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* PROJECTS MANAGEMENT TAB */
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Projects Registry</h4>
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
              className="flex items-center space-x-1.5 bg-purple-500 hover:bg-purple-400 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img src={proj.imgUrl} alt={proj.title} className="w-12 h-12 object-cover rounded-lg border border-slate-800 shrink-0" />
                  <div className="truncate">
                    <div className="font-bold text-sm text-white truncate">{proj.title}</div>
                    <div className="text-[11px] text-purple-400 font-mono truncate">Tags: {proj.tags}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">Tools: {proj.tools}</div>
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline block truncate"
                    >
                      {proj.liveLink}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setEditingProject(proj)}
                    className="p-1.5 bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 rounded-lg transition border border-slate-700"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-lg transition border border-slate-700"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACCOUNT SECURITY MANAGEMENT TAB */}
      {activeTab === "security" && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Administrator Credentials</h4>
                <p className="text-xs text-slate-400">Update your username, email, or password stored securely in Prisma Postgres.</p>
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
                    showNotification("Account credentials updated successfully!");
                    form.reset();
                  } else {
                    showNotification(`Error: ${data.error || "Failed to update"}`);
                  }
                } catch {
                  showNotification("Error: Network or server error");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">New Username (Optional)</label>
                <input name="sec_username" type="text" placeholder="e.g. mostafa" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">New Email Address (Optional)</label>
                <input name="sec_email" type="email" placeholder="e.g. mostafammt9@gmail.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition" />
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-mono text-amber-400 mb-1">Current Password (Required for changes) *</label>
                <input name="sec_cur_pass" type="password" required placeholder="Enter current password to verify identity" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">New Password (Optional)</label>
                <input name="sec_new_pass" type="password" placeholder="Enter new secret password" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition" />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Security Settings</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <button onClick={() => setEditingSkill(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white mb-4">
              {editingSkill.id ? `Edit Skill #${editingSkill.id}` : "Add New Tech Skill"}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Skill Title *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.title || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, title: e.target.value })}
                  placeholder="e.g. Next.js 15, Prisma ORM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Category</label>
                  <select
                    value={editingSkill.category || "Frontend"}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Tools & OS">Tools & OS</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Proficiency % (0-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingSkill.proficiency || 80}
                    onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Acquisition Date (e.g., 2024, 2025)</label>
                <input
                  type="text"
                  value={editingSkill.acquiredDate || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, acquiredDate: e.target.value })}
                  placeholder="e.g. 2024 or Jan 2025"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Learning Sources (comma separated)</label>
                <input
                  type="text"
                  value={editingSkill.sources || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, sources: e.target.value })}
                  placeholder="e.g. Udacity, Self-Taught, Official Docs"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <button onClick={() => setEditingProject(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white mb-4">
              {editingProject.id ? `Edit Project #${editingProject.id}` : "Add New Project"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Aether E-Commerce Portal"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProject.imgUrl || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, imgUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Live Demo Link</label>
                <input
                  type="url"
                  value={editingProject.liveLink || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, liveLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Tech Stack Tags (comma separated)</label>
                <input
                  type="text"
                  value={editingProject.tags || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                  placeholder="e.g. React, Next.js, UI/UX, Tailwind"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Tools & Libraries (comma separated)</label>
                <input
                  type="text"
                  value={editingProject.tools || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, tools: e.target.value })}
                  placeholder="e.g. reactHooks, redux, reduxToolkit, scss"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
