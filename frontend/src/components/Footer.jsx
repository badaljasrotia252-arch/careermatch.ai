import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Code2, Cpu, Globe } from 'lucide-react';
import { useCustomizer } from '../context/CustomizerContext';

export default function Footer() {
  const { settings } = useCustomizer();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/70 text-slate-400 pt-12 pb-8 px-4 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand Col */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold font-heading text-white">
              {settings.brandName || 'CareerMatch'} <span className="text-cyan-400">{settings.brandSuffix || 'AI'}</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            {settings.tagline || 'Smart Job & Internship Recommendation Platform empowering students, freshers, and professionals through AI-driven career matching.'}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-800/50 text-indigo-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>College Final Year Project</span>
          </div>
        </div>

        {/* Quick Discovery */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">
            Opportunities
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-cyan-400 transition-colors text-decoration-none text-slate-400">Explore Tech Jobs</Link></li>
            <li><Link to="/internships" className="hover:text-cyan-400 transition-colors text-decoration-none text-slate-400">Find Internships</Link></li>
            <li><Link to="/recommendations" className="hover:text-cyan-400 transition-colors text-decoration-none text-slate-400">Smart AI Recommendations</Link></li>
            <li><Link to="/resume-analyzer" className="hover:text-cyan-400 transition-colors text-decoration-none text-slate-400">ATS Resume Analyzer</Link></li>
            <li><Link to="/skills" className="hover:text-cyan-400 transition-colors text-decoration-none text-slate-400">Skill Gap Analysis</Link></li>
          </ul>
        </div>

        {/* Career Tools */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">
            AI Platform
          </h4>
          <ul className="space-y-2 text-sm">
            <li><span className="text-slate-300 font-medium">Weighted Matching Engine</span></li>
            <li><span className="text-slate-400">Skills Weight: 40%</span></li>
            <li><span className="text-slate-400">Education Weight: 15%</span></li>
            <li><span className="text-slate-400">Experience & Location: 20%</span></li>
            <li><span className="text-slate-400">Interests & Role: 20%</span></li>
            <li><Link to="/about" className="text-indigo-400 hover:underline">System Architecture & Math →</Link></li>
          </ul>
        </div>

        {/* Technology Stack */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-heading">
            Technology Stack
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="skill-pill text-xs">React 19</span>
            <span className="skill-pill text-xs">Vite</span>
            <span className="skill-pill text-xs">Node.js</span>
            <span className="skill-pill text-xs">Express</span>
            <span className="skill-pill text-xs">SQLite / SQL</span>
            <span className="skill-pill text-xs">Python NLP</span>
            <span className="skill-pill text-xs">JWT Auth</span>
            <span className="skill-pill text-xs">TF-IDF Vector</span>
          </div>
          <p className="text-xs text-slate-500">
            Designed with relational database architecture and RESTful service orchestration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div>
          © 2026 <span className="text-slate-300 font-medium">CareerMatch AI</span> — Job & Internship Recommendation Smart System.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-slate-300 text-decoration-none text-slate-500">Documentation</Link>
          <Link to="/jobs" className="hover:text-slate-300 text-decoration-none text-slate-500">Browse Jobs</Link>
          <Link to="/internships" className="hover:text-slate-300 text-decoration-none text-slate-500">Browse Internships</Link>
        </div>
      </div>
    </footer>
  );
}
