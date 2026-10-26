import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  BarChart3, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Award, 
  Zap,
  TrendingUp,
  Check
} from 'lucide-react';

export default function SkillGapPage() {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState(user?.desired_job_role || 'Data Analyst');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSkillGap = async (roleName) => {
    try {
      setLoading(true);
      const res = await api.getSkillGap(roleName);
      setData(res);
    } catch (e) {
      console.warn('Failed to load skill gap:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap(targetRole);
  }, [targetRole]);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Competency & Career Readiness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Skill Gap & Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare your current skill profile against industry standards for your dream role.
          </p>
        </div>

        {/* Role Selector Dropdown (Requirement 11) */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">
            Target Role:
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="input-field text-xs sm:text-sm py-2 px-3 sm:w-60 font-semibold text-cyan-400 bg-slate-900 border-indigo-500/40"
          >
            {data?.available_roles?.map((r) => (
              <option key={r} value={r}>{r}</option>
            )) || (
              <>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
              </>
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
          <span>Analyzing skill taxonomy and required competencies...</span>
        </div>
      ) : data && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Visual Progress Banner (Requirement 11) */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Readiness Score for {data.target_role}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1 flex items-baseline gap-2">
                  <span className="text-gradient">{data.progress_score}%</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({data.current_skills.length} of {data.total_required} required competencies acquired)
                  </span>
                </div>
              </div>

              <Link
                to="/profile"
                className="btn-secondary text-xs py-2 px-4 whitespace-nowrap self-start sm:self-center"
              >
                Update My Skills Profile
              </Link>
            </div>

            {/* Visual Skill Progress Bar */}
            <div className="progress-bar-bg h-3.5 my-2">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${data.progress_score}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Foundation Level (0%)</span>
              <span>Job-Ready Proficiency (100%)</span>
            </div>
          </div>

          {/* Current Skills vs Recommended Missing Skills Grid (Requirement 11) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Current Skills */}
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/30">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-3 font-heading">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your Current Matching Skills ({data.current_skills.length})</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Proficiencies verified in your profile that directly satisfy requirements for {data.target_role}.
              </p>
              <div className="flex flex-wrap gap-2">
                {data.current_skills.length > 0 ? (
                  data.current_skills.map((s, idx) => (
                    <span key={idx} className="skill-pill skill-pill-matched text-xs">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No matching skills added yet in profile.</span>
                )}
              </div>
            </div>

            {/* Missing Recommended Skills */}
            <div className="glass-panel p-6 rounded-2xl border-amber-500/30">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-3 font-heading">
                <AlertCircle className="w-4 h-4" />
                <span>Recommended Skills to Learn ({data.missing_skills.length})</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                High-priority competencies required by top employers hiring for {data.target_role}.
              </p>
              <div className="flex flex-wrap gap-2">
                {data.missing_skills.length > 0 ? (
                  data.missing_skills.map((s, idx) => (
                    <span key={idx} className="skill-pill skill-pill-missing text-xs">
                      △ Learn {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold italic">
                    ✓ Outstanding! You have mastered all core skills for this role.
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Recommended Learning Path (Requirement 11) */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center gap-2 text-base font-bold text-white mb-2 font-heading">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Recommended Learning Path for {data.target_role}</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Step-by-step curriculum milestones curated by hiring managers and tech recruiters.
            </p>

            <div className="space-y-4">
              {data.learning_path.map((item) => (
                <div 
                  key={item.step}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
