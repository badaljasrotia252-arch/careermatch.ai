import React from 'react';
import { Sparkles, Cpu, Layers, Database, Code2, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Academic Project Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          About CareerMatch <span className="text-gradient">AI</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Job & Internship Recommendation Smart System — Engineered as a production-grade full-stack solution for students, freshers, and university placement cells.
        </p>
      </div>

      {/* Project Overview Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-indigo-500/30">
        <h2 className="text-xl font-bold text-white font-heading mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Executive Summary & Objectives</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          In contemporary recruitment ecosystems, applicants often struggle to identify positions aligning with their distinct competencies, educational coursework, and career stage. Generic job portals rely on blunt keyword queries, causing high rejection rates and applicant fatigue.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong>CareerMatch AI</strong> solves this disparity by computing multi-dimensional compatibility vectors across skills, educational qualifications, geographical preferences, and career trajectories. The platform integrates automated ATS resume parsing, entity extraction, skill gap curriculum generation, and contextual AI career advisory.
        </p>
      </div>

      {/* Mathematical Recommendation Formula (Requirement 14) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30">
        <h2 className="text-xl font-bold text-white font-heading mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Recommendation Engine Mathematical Model</span>
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          The compatibility index represents a weighted normalized sum across 7 discrete factor evaluations:
        </p>

        {/* Formula Display Box */}
        <div className="p-4 sm:p-6 rounded-xl bg-slate-950/90 border border-slate-800 text-center font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner mb-6">
          Score = (Skills × 0.40) + (Education × 0.15) + (Experience × 0.10) + (Location × 0.10) + (Interests × 0.10) + (Role × 0.10) + (WorkType × 0.05)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-indigo-400 block mb-1">1. Skills Match (40% Weight)</span>
            <p className="text-slate-400">Jaccard tokenization and weighted proficiency levels (Expert: 1.0, Adv: 0.95, Inter: 0.8, Beg: 0.6).</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">2. Education Match (15% Weight)</span>
            <p className="text-slate-400">Coursework relevance (B.Tech, BCA, MCA, MS) + academic distinction / CGPA scaling.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">3. Experience Suitability (10% Weight)</span>
            <p className="text-slate-400">Classifies student/fresher vs entry-level criteria to prevent qualification mismatches.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">4. Location & Remote (10% Weight)</span>
            <p className="text-slate-400">Evaluates remote availability (100% accessible) vs geographic city proximity.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-purple-400 block mb-1">5. Career Interests (10% Weight)</span>
            <p className="text-slate-400">Semantic intersection between user-selected domains and job classification taxonomy.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">6. Target Role (10% Weight)</span>
            <p className="text-slate-400">Calculates token cosine similarity between candidate target role and title.</p>
          </div>
        </div>
      </div>

      {/* Database Architecture & Relational Tables (Requirement 15) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white font-heading mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          <span>Relational Database Architecture</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Constructed with strict referential integrity, foreign key cascading, and indexed lookups:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          {[
            { name: 'Users', desc: 'Accounts, credentials, prefs' },
            { name: 'Education', desc: 'Degrees, colleges, CGPA' },
            { name: 'Skills', desc: 'Categorized skill taxonomy' },
            { name: 'UserSkills', desc: 'Proficiency relationships' },
            { name: 'Companies', desc: 'Organization profiles' },
            { name: 'Jobs', desc: 'Employment positions' },
            { name: 'Internships', desc: 'Training opportunities' },
            { name: 'Applications', desc: 'Lifecycle & interview status' },
            { name: 'SavedJobs', desc: 'User bookmarks' },
            { name: 'Recommendations', desc: 'Cached match vectors' }
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="font-bold text-white font-mono block">{t.name}</span>
              <span className="text-[11px] text-slate-400">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Specifications */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white font-heading mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <span>Technical Implementation Specifications</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div>
            <h4 className="font-bold text-indigo-400 mb-2 font-heading">Frontend</h4>
            <ul className="space-y-1 text-slate-300">
              <li>• React 19 Single Page App</li>
              <li>• Vite Build Pipeline</li>
              <li>• React Router DOM v7</li>
              <li>• Vanilla CSS Custom Design Tokens</li>
              <li>• Lucide Icons & Canvas Confetti</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-cyan-400 mb-2 font-heading">Backend & APIs</h4>
            <ul className="space-y-1 text-slate-300">
              <li>• Node.js v24 + Express 4</li>
              <li>• Synchronous Relational SQLite (node:sqlite)</li>
              <li>• JWT Token Authentication</li>
              <li>• Bcrypt Password Salting</li>
              <li>• Multer Multipart Uploads</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-purple-400 mb-2 font-heading">AI & NLP</h4>
            <ul className="space-y-1 text-slate-300">
              <li>• Resume Entity Extractor</li>
              <li>• 0–100 ATS Scoring Matrix</li>
              <li>• Python TF-IDF Vectorizer</li>
              <li>• Cosine Similarity Microservice</li>
              <li>• CareerMate AI Advisory Logic</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
