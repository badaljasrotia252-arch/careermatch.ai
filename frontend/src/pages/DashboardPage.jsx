import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import JobCard from '../components/JobCard';
import InternshipCard from '../components/InternshipCard';
import OpportunityModal from '../components/OpportunityModal';
import { 
  Briefcase, 
  BookmarkCheck, 
  Bookmark, 
  FileText, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  User,
  Calendar,
  Layers
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState({
    recommended_jobs: [],
    recommended_internships: [],
    top_overall_matches: []
  });
  const [appStats, setAppStats] = useState({
    total: 0,
    applied: 0,
    under_review: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0
  });
  const [savedCount, setSavedCount] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [recRes, appRes, savedRes] = await Promise.all([
        api.getRecommendations().catch(() => ({ recommended_jobs: [], recommended_internships: [], top_overall_matches: [] })),
        api.getApplications().catch(() => ({ stats: {} })),
        api.getSavedOpportunities().catch(() => ({ saved: [] }))
      ]);

      setRecommendations(recRes);
      if (appRes.stats) setAppStats(appRes.stats);
      if (savedRes.saved) setSavedCount(savedRes.saved.length);
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statusList = [
    { label: 'Applied', count: appStats.applied || 0, color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-800/40' },
    { label: 'Under Review', count: appStats.under_review || 0, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40' },
    { label: 'Shortlisted', count: appStats.shortlisted || 0, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800/40' },
    { label: 'Interview', count: appStats.interview || 0, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/40' },
    { label: 'Selected', count: appStats.selected || 0, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' },
    { label: 'Rejected', count: appStats.rejected || 0, color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-800/40' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      
      {/* 1. Welcome Greeting Header (Requirement 9) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Candidate Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Welcome, {user?.name || 'Candidate'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your personalized job recommendations, applications pipeline, and career progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="btn-secondary text-xs py-2 px-4 whitespace-nowrap">
            Edit Profile
          </Link>
          <Link to="/recommendations" className="btn-primary text-xs py-2 px-4 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Matches</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards (Requirement 9) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Recommended Jobs */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Rec. Jobs</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {recommendations.recommended_jobs?.length || 0}
          </div>
          <Link to="/jobs" className="text-[11px] text-indigo-400 hover:underline mt-2">
            Browse jobs →
          </Link>
        </div>

        {/* Recommended Internships */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Internships</span>
            <BookmarkCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {recommendations.recommended_internships?.length || 0}
          </div>
          <Link to="/internships" className="text-[11px] text-cyan-400 hover:underline mt-2">
            Browse internships →
          </Link>
        </div>

        {/* Saved Jobs */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Saved</span>
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {savedCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-2">Opportunities</span>
        </div>

        {/* Total Applications */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Applications</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {appStats.total || 0}
          </div>
          <Link to="/tracker" className="text-[11px] text-purple-400 hover:underline mt-2">
            View tracker →
          </Link>
        </div>

        {/* Resume Score */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Resume ATS</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-heading">
            {user?.resume_score ? `${user.resume_score}/100` : '78/100'}
          </div>
          <Link to="/resume-analyzer" className="text-[11px] text-emerald-400 hover:underline mt-2">
            Analyze resume →
          </Link>
        </div>

        {/* Total Skills */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Skills</span>
            <Award className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {user?.skills?.length || 8}
          </div>
          <Link to="/skills" className="text-[11px] text-rose-400 hover:underline mt-2">
            Skill gap test →
          </Link>
        </div>

      </div>

      {/* 3. APPLICATION STATUS PIPELINE (Requirement 9) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Application Status Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status overview of all your submitted roles and interview stages.
            </p>
          </div>
          <Link to="/tracker" className="btn-secondary text-xs py-1.5 px-3">
            Open Full Tracker
          </Link>
        </div>

        {/* Status Pipeline Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {statusList.map((st, idx) => (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between ${st.bg}`}
            >
              <span className="text-xs font-semibold text-slate-300">
                {st.label}
              </span>
              <div className={`text-2xl font-bold font-heading mt-2 ${st.color}`}>
                {st.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECOMMENDED FOR YOU SECTION (Requirement 9) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Recommended For You</span>
            </h2>
            <p className="text-xs text-slate-400">
              Top matching roles calculated using your weighted compatibility profile.
            </p>
          </div>
          <Link to="/recommendations" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>View All Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.top_overall_matches?.slice(0, 4).map((opp, idx) => {
            const isInternship = opp.opportunity_type === 'internship' || !!opp.internship_id;
            return isInternship ? (
              <InternshipCard
                key={`dash-intern-${opp.internship_id || idx}`}
                internship={opp}
                onSelect={(o) => setSelectedOpportunity(o)}
                onUpdate={fetchDashboardData}
              />
            ) : (
              <JobCard
                key={`dash-job-${opp.job_id || idx}`}
                job={opp}
                onSelect={(o) => setSelectedOpportunity(o)}
                onUpdate={fetchDashboardData}
              />
            );
          })}
        </div>
      </div>

      {/* Opportunity Modal */}
      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onUpdate={fetchDashboardData}
        />
      )}

    </div>
  );
}
