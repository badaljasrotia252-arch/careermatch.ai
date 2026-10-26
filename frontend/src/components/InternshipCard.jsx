import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { MapPin, DollarSign, Clock, Bookmark, Sparkles, Send, Check, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InternshipCard({ internship, onSelect, onUpdate }) {
  const { isAuthenticated, showToast } = useAuth();
  const [isSaved, setIsSaved] = useState(internship.is_saved || false);
  const [isApplied, setIsApplied] = useState(internship.is_applied || false);
  const [loading, setLoading] = useState(false);

  const matchScore = internship.match_score || 85;
  const skills = internship.required_skills || [];

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please sign in to save internships.', 'info');
      return;
    }
    try {
      const res = await api.toggleSaveOpportunity({
        opportunity_type: 'internship',
        opportunity_id: internship.internship_id
      });
      setIsSaved(res.is_saved);
      showToast(res.message);
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast('Failed to save internship.', 'error');
    }
  };

  const handleQuickApply = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please sign in to apply for this internship.', 'info');
      return;
    }
    try {
      setLoading(true);
      await api.addApplication({
        opportunity_type: 'internship',
        opportunity_id: internship.internship_id,
        status: 'Applied',
        notes: `Quick applied from Internship Search (Match: ${matchScore}%).`
      });
      setIsApplied(true);
      showToast(`Applied for ${internship.title} at ${internship.company_name}!`);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast(err.message || 'Already applied or failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (score) => {
    if (score >= 85) return 'match-badge-high';
    if (score >= 70) return 'match-badge-mid';
    return 'match-badge-low';
  };

  return (
    <div 
      onClick={() => onSelect(internship)}
      className="glass-panel glass-panel-hover p-5 lg:p-6 flex flex-col justify-between cursor-pointer relative group transition-all"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={internship.logo || internship.company_logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150'}
              alt={internship.company_name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700/80 bg-slate-800"
            />
            <div>
              <div className="text-xs font-semibold text-slate-300">
                {internship.company_name}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 font-heading">
                {internship.title}
              </h3>
            </div>
          </div>

          <div className={`match-badge ${getBadgeClass(matchScore)} flex-shrink-0`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Domain tag & Meta */}
        <div className="flex items-center gap-2 mb-3">
          {internship.domain && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
              {internship.domain}
            </span>
          )}
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
            {internship.internship_type || 'Summer'} Internship
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
            {internship.work_mode || 'Remote'}
          </span>
        </div>

        {/* Location, Stipend, Duration */}
        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            {internship.location}
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
            {internship.stipend || internship.stipend_text || (internship.stipend_amount ? `$${internship.stipend_amount}/mo` : 'Competitive Stipend')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {internship.duration || '3 Months'}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="skill-pill text-[11px]">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[11px] text-slate-500 self-center">
              +{skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2 mt-auto">
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-rose-400" />
          <span>Deadline: {internship.deadline || 'Rolling'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSave}
            title={isSaved ? 'Remove from Saved' : 'Save Internship'}
            className={`p-2 rounded-lg border transition-all ${
              isSaved
                ? 'bg-indigo-950/60 text-indigo-400 border-indigo-500/50'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(internship);
            }}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            View Internship
          </button>

          <button
            onClick={handleQuickApply}
            disabled={loading || isApplied}
            className={`btn-primary text-xs py-1.5 px-3 flex items-center gap-1 ${
              isApplied ? 'bg-emerald-600 opacity-90 cursor-default' : ''
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Apply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
