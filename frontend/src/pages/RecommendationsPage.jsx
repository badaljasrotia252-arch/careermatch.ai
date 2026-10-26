import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import JobCard from '../components/JobCard';
import InternshipCard from '../components/InternshipCard';
import OpportunityModal from '../components/OpportunityModal';
import { 
  Sparkles, 
  Briefcase, 
  BookmarkCheck, 
  SlidersHorizontal, 
  ArrowRight, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Layers, 
  Cpu 
} from 'lucide-react';

export default function RecommendationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState({
    recommended_jobs: [],
    recommended_internships: [],
    top_overall_matches: [],
    user_summary: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'jobs', 'internships'
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.getRecommendations();
      setData(res);
    } catch (err) {
      console.warn('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner / Heading */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden border-indigo-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Recommendation Engine (Core AI System)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading">
              Personalized Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Calculated using weighted multi-factor matching across your Skills (40%), Education (15%), Location (10%), Experience (10%), Interests (10%), Target Role (10%), and Work Preference (5%).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/profile" className="btn-secondary text-xs py-2 px-4 whitespace-nowrap">
              Edit Skills & Preferences
            </Link>
          </div>
        </div>

        {/* Algorithm Weight Indicator Pills */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 uppercase tracking-wider">Formula Weights:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300">Skills × 40%</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">Education × 15%</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">Location × 10%</span>
          <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300">Interests × 10%</span>
          <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300">Role × 10%</span>
          <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300">Experience × 10%</span>
        </div>
      </div>

      {/* If User Not Signed In */}
      {!isAuthenticated && (
        <div className="p-8 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-heading">
            Sign In to Unlock Your Personalized Recommendations
          </h2>
          <p className="text-xs text-slate-300">
            Our recommendation algorithm computes personalized match scores based on your specific profile and skills.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/login" className="btn-primary text-xs py-2 px-5 text-decoration-none">
              Sign In
            </Link>
            <Link to="/register" className="btn-secondary text-xs py-2 px-5 text-decoration-none">
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Filter Tabs: All / Jobs / Internships */}
      {isAuthenticated && (
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              All Top Matches ({data.top_overall_matches.length})
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Jobs ({data.recommended_jobs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'internships'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Internships ({data.recommended_internships.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Showing opportunities sorted by highest compatibility score
          </div>
        </div>
      )}

      {/* Content Feed */}
      {isAuthenticated && (
        <>
          {loading ? (
            <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
              <span>Calculating weighted compatibility matrix...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tab: ALL TOP MATCHES */}
              {activeTab === 'all' && (
                data.top_overall_matches.map((item, idx) => {
                  const isInternship = item.opportunity_type === 'internship' || !!item.internship_id;
                  return isInternship ? (
                    <InternshipCard
                      key={`opp-intern-${item.internship_id || idx}`}
                      internship={item}
                      onSelect={(opp) => setSelectedOpportunity(opp)}
                      onUpdate={fetchRecommendations}
                    />
                  ) : (
                    <JobCard
                      key={`opp-job-${item.job_id || idx}`}
                      job={item}
                      onSelect={(opp) => setSelectedOpportunity(opp)}
                      onUpdate={fetchRecommendations}
                    />
                  );
                })
              )}

              {/* Tab: JOBS ONLY */}
              {activeTab === 'jobs' && (
                data.recommended_jobs.map((job) => (
                  <JobCard
                    key={`rec-job-${job.job_id}`}
                    job={job}
                    onSelect={(opp) => setSelectedOpportunity(opp)}
                    onUpdate={fetchRecommendations}
                  />
                ))
              )}

              {/* Tab: INTERNSHIPS ONLY */}
              {activeTab === 'internships' && (
                data.recommended_internships.map((internship) => (
                  <InternshipCard
                    key={`rec-intern-${internship.internship_id}`}
                    internship={internship}
                    onSelect={(opp) => setSelectedOpportunity(opp)}
                    onUpdate={fetchRecommendations}
                  />
                ))
              )}

            </div>
          )}
        </>
      )}

      {/* Modal Inspector */}
      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onUpdate={fetchRecommendations}
        />
      )}

    </div>
  );
}
