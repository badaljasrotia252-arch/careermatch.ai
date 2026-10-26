import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Download, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Lightbulb,
  Check,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockResumeAnalysis } from '../data/mockData';

export default function ResumeAnalyzerPage() {
  const { user, showToast } = useAuth();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleLoadSampleResume = () => {
    setFile({ name: 'Alex_Morgan_FullStack_Resume.pdf', size: 142000 });
    setAnalysisResult(mockResumeAnalysis);
    showToast('Sample ATS resume loaded & scored!');
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      showToast('Please select or drop a resume file first.', 'info');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setAnalyzing(true);
    try {
      const res = await api.analyzeResume(formData);
      setAnalysisResult(res.analysis);
      showToast('Resume analyzed successfully!');
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      showToast(err.message || 'Failed to analyze resume.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadImproved = async () => {
    try {
      const blob = await api.downloadImprovedResume();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Improved_Resume_${user?.name ? user.name.replace(/\s+/g, '_') : 'Candidate'}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Improved ATS resume downloaded!');
    } catch (err) {
      showToast('Failed to download resume file', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Resume Scanner & ATS Optimizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
          Smart Resume Analyzer & ATS Score
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Upload your resume in PDF, DOC, DOCX, or TXT format. Our NLP engine evaluates section completeness, skill density, ATS keyword compatibility, and generates an optimized version.
        </p>
      </div>

      {/* Upload Zone (Requirement 4) */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl max-w-3xl mx-auto border-indigo-500/30">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragOver 
              ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/10' 
              : 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-950/40'
          }`}
          onClick={() => document.getElementById('resume-file-input').click()}
        >
          <input
            id="resume-file-input"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white font-heading mb-1">
            {file ? file.name : 'Upload your resume to analyze'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Supports <strong className="text-slate-300">PDF, DOC, DOCX, TXT</strong> up to 10MB
          </p>

          <button
            type="button"
            className="btn-secondary text-xs py-2 px-5 pointer-events-none"
          >
            {file ? 'Change Resume File' : 'Browse Files'}
          </button>
        </div>

        {file && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-white truncate max-w-[240px] sm:max-w-xs">{file.name}</div>
                <div className="text-[11px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>

            <button
              onClick={handleUploadAndAnalyze}
              disabled={analyzing}
              className="btn-primary text-xs py-2.5 px-6 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Scanning & Scoring...' : 'Analyze Resume Now'}</span>
            </button>
          </div>
        )}

        {/* Quick Sample Demo Tester */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">Want to test ATS evaluation instantly?</span>
          <button
            type="button"
            onClick={handleLoadSampleResume}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 flex items-center gap-1.5 transition-colors font-medium shadow-sm hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Full-Stack Resume</span>
          </button>
        </div>
      </div>

      {/* Analysis Output Section (Requirement 4) */}
      {analysisResult && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top KPI Cards: Score & Completeness */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ATS Score Gauge Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 border-indigo-500/30">
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${analysisResult.resume_score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-white font-heading">
                    {analysisResult.resume_score}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold -mt-1">/100</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  ATS Resume Score
                </span>
                <h3 className="text-lg font-bold text-white font-heading mt-0.5">
                  {analysisResult.resume_score >= 80 ? 'Highly Competitive' : 'Good Foundation'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Passes top applicant tracking systems with strong keyword density.
                </p>
              </div>
            </div>

            {/* Completeness Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Resume Completeness
                </span>
                <div className="text-2xl font-extrabold text-white font-heading mt-1">
                  {analysisResult.completeness}
                </div>
                <div className="progress-bar-bg my-2">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: analysisResult.completeness }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Evaluated across Contact, Education, Skills, Projects, Experience, and Certifications.
                </p>
              </div>
            </div>

            {/* Download Improved Action Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/40">
              <div>
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  AI Resume Enhancer
                </span>
                <h3 className="text-base font-bold text-white font-heading mt-1">
                  Download Improved Resume
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Export an ATS-optimized, high-impact formatted resume filling detected keyword gaps.
                </p>
              </div>

              <button
                onClick={handleDownloadImproved}
                className="btn-primary text-xs py-2 px-4 mt-4 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Improved Resume (.md)</span>
              </button>
            </div>

          </div>

          {/* Section: Skills Detected & Missing Skills (Requirement 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skills Detected */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-4 font-heading">
                <CheckCircle2 className="w-4 h-4" />
                <span>Skills Detected ({analysisResult.skills_detected.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.skills_detected.map((s, idx) => (
                  <span key={idx} className="skill-pill skill-pill-matched text-xs">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-4 font-heading">
                <AlertCircle className="w-4 h-4" />
                <span>Missing Skills for Desired Roles ({analysisResult.missing_skills.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missing_skills.map((s, idx) => (
                  <span key={idx} className="skill-pill skill-pill-missing text-xs">
                    + Add {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Education & Experience Detected */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Education */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Education Identified</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysisResult.education_detected.map((e, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{e}</span>
                  </li>
                ))}
                {analysisResult.cgpa_detected && (
                  <li className="flex items-start gap-1.5 text-cyan-400 font-semibold">
                    <span>✓</span>
                    <span>{analysisResult.cgpa_detected}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Experience */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Experience Identified</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysisResult.experience_detected.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Certifications Identified</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysisResult.certifications_detected.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* AI Suggestions (Requirement 4) */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30">
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-4 font-heading">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Intelligent Recommendations to Improve Your Resume</span>
            </div>

            <div className="space-y-3">
              {analysisResult.suggestions.map((sug, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
