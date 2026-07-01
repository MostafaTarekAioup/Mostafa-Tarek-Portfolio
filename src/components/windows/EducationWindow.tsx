"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Award, Calendar, BookOpen, Loader2 } from "lucide-react";

interface Education {
  id: number;
  title: string;
  institution: string;
  period: string;
  description: string;
  courses: string;
  certificateUrl: string | null;
}

export function EducationWindow() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/education");
      if (res.ok) {
        const data = await res.json();
        setEducation(data);
      }
    } catch (err) {
      console.error("Error fetching education:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    fetchEducation();
  }, []);

  const getCourses = (edu: Education): string[] => {
    try {
      if (edu.courses && edu.courses.startsWith("[")) {
        return JSON.parse(edu.courses);
      }
      return edu.courses ? edu.courses.split(",").map((c) => c.trim()) : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5 select-none pr-1 overflow-y-auto">
      <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Academic & Professional Credentials</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Formal engineering degree from Zagazig University combined with rigorous Udacity Nanodegrees.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3 py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <span className="text-xs font-mono">Loading Credentials...</span>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-800 space-y-8 my-4">
          {education.map((edu) => {
            const courses = getCourses(edu);
            const isDegree = edu.title.toLowerCase().includes("bachelor") || edu.institution.toLowerCase().includes("university");
            return (
              <div key={edu.id} className="relative group">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-slate-950 transition-transform duration-200 group-hover:scale-125 flex items-center justify-center ${
                    isDegree
                      ? "border-amber-400 shadow-sm shadow-amber-400/50"
                      : "border-purple-400 shadow-sm shadow-purple-400/50"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isDegree ? "bg-amber-400" : "bg-purple-400"}`} />
                </div>

                {/* Content card */}
                <div className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition duration-300 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                        {edu.title}
                      </h4>
                      <div className="text-xs font-medium text-cyan-400 mt-0.5">{edu.institution}</div>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{edu.period}</span>
                    </div>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{edu.description}</p>
                  )}

                  {/* Courses Pill List */}
                  {courses.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/60">
                      <div className="flex items-center text-[11px] text-slate-400 font-medium mb-1.5">
                        <BookOpen className="w-3 h-3 mr-1 text-slate-500" />
                        <span>Key Topics & Curriculum:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {courses.map((course, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2.5 py-1 bg-slate-950/80 text-slate-300 rounded-lg text-[11px] border border-slate-800 font-mono"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {edu.certificateUrl && (
                    <div className="mt-4 flex justify-end">
                      <a
                        href={edu.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Verify Credential ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
