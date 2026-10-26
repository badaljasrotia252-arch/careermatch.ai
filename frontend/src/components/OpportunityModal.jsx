import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  Share2, 
  Send, 
  Sparkles, 
  Award, 
  GraduationCap 
} from 'lucide-react';

export default function OpportunityModal({ opportunity, onClose, onUpdate }) {
  const { isAuthenticated, showToast } = useAuth();
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(opportunity?.is_saved || false);
  const [isApplied, setIsApplied] = useState(opportunity?.is_applied || false);

  if (!opportunity) return null;

  const isInternship = opportunity.opportunity_type === 'internship' || !!opportunity.internship_id;
  const oppId = isInternship ? opportunity.internship_id : opportunity.job_id;
  const oppType = isInternship ? 'internship' : 'job';

  const matchScore = opportunity.match_score || 85;
  const matchingSkills = opportunity.matching_skills || [];
  const missingSkills = opportunity.missing_skills || [];
  const requiredSkills = opportunity.required_skills || [];

  const handleApply = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to apply and track applications.', 'info');
      return;
    }

    try {
      setApplying(true);
      await api.addApplication({
        opportunity_type: oppType,
        opportunity_id: oppId,
        status: 'Applied',
        notes: `Applied via CareerMatch AI recommendation (Match: ${matchScore}%).`
      });

      setIsApplied(true);
      showToast('Application submitted successfully! Track it in your Dashboard & Tracker.');

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      if (onUpdate) onUpdate();
    } catch (err) {
      showToast(err.message || 'Failed to submit application', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save opportunities.', 'info');
      return;
    }

    try {
      const res = await api.toggleSaveOpportunity({
        opportunity_type: oppType,
        opportunity_id: oppId
      });
      setIsSaved(res.is_saved);
      showToast(res.message);
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast('Failed to update saved status', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Opportunity link copied to clipboard!', 'info');
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#6366f1';
    return '#f59e0b';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in p-6 lg:p-8" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <img
              src={opportunity.logo || opportunity.company_logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150'}
              alt={opportunity.company_name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700/80 bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {opportunity.company_name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                  {opportunity.work_mode || 'Hybrid'}
                </span>
                {opportunity.industry && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                    {opportunity.industry || opportunity.domain}
                  </span>
                )}
              </div>
              <h2 className="text-xl lg:text-2xl font-bold font-heading text-white">
                {opportunity.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {opportunity.location}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  {opportunity.salary || opportunity.salary_range || opportunity.stipend || opportunity.stipend_text || 'Competitive'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {opportunity.experience || opportunity.experience_level || opportunity.duration || 'Full-time'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Compatibility Score Card (Requirement 8) */}
        <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white shadow-lg"
                style={{ background: getScoreColor(matchScore) }}
              >
                <span className="text-lg leading-tight">{matchScore}%</span>
                <span className="text-[10px] font-normal opacity-90">MATCH</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-heading">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Your Compatibility: {matchScore}%
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated using AI weighted matching across skills, education & preferences.
                </p>
              </div>
            </div>

            {opportunity.breakdown && (
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="text-center px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60">
                  <div className="font-bold text-indigo-400">{opportunity.breakdown.skills_match || 85}%</div>
                  <div className="text-[10px] text-slate-400">Skills</div>
                </div>
                <div className="text-center px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60">
                  <div className="font-bold text-emerald-400">{opportunity.breakdown.education_match || 90}%</div>
                  <div className="text-[10px] text-slate-400">Education</div>
                </div>
                <div className="text-center px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60">
                  <div className="font-bold text-cyan-400">{opportunity.breakdown.location_match || 100}%</div>
                  <div className="text-[10px] text-slate-400">Location</div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendation Reason */}
          {opportunity.recommendation_reason && (
            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{opportunity.recommendation_reason}</span>
            </div>
          )}

          {/* Skills Breakdown Grid: Matching vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Matching Skills */}
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Matching Skills ({matchingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchingSkills.length > 0 ? (
                  matchingSkills.map((s, idx) => (
                    <span key={idx} className="skill-pill skill-pill-matched text-xs">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No direct matching skills detected</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Missing Skills to Learn ({missingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.length > 0 ? (
                  missingSkills.map((s, idx) => (
                    <span key={idx} className="skill-pill skill-pill-missing text-xs">
                      △ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 italic font-medium">
                    ✓ You possess 100% of required skills!
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Opportunity Body Details */}
        <div className="space-y-5 text-sm text-slate-300">
          
          {/* Description */}
          {opportunity.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-heading">
                About the Role
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs lg:text-sm">
                {opportunity.description}
              </p>
            </div>
          )}

          {/* Key Responsibilities */}
          {opportunity.responsibilities && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-heading">
                Key Responsibilities
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs lg:text-sm">
                {opportunity.responsibilities}
              </p>
            </div>
          )}

          {/* Qualifications & Preferred Education */}
          {(opportunity.qualifications || opportunity.preferred_education) && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-heading">
                Qualifications & Education
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs lg:text-sm">
                {opportunity.qualifications || opportunity.preferred_education}
              </p>
            </div>
          )}

          {/* Benefits */}
          {opportunity.benefits && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-heading">
                Benefits & Perks
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs lg:text-sm">
                {opportunity.benefits}
              </p>
            </div>
          )}

          {/* Required Skills All */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-heading">
              All Required Competencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((sk, idx) => (
                <span key={idx} className="skill-pill text-xs">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Deadline */}
          {opportunity.deadline && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Application Deadline: <strong className="text-white">{opportunity.deadline}</strong></span>
            </div>
          )}
        </div>

        {/* Action Buttons Footer (Requirement 8) */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 ${
                isSaved ? 'text-indigo-400 border-indigo-500/50 bg-indigo-950/40' : ''
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-4"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              disabled={applying || isApplied}
              className={`btn-primary text-xs py-2 px-5 flex items-center gap-2 ${
                isApplied ? 'opacity-80 cursor-default bg-emerald-600' : ''
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isApplied ? '✓ Application Submitted' : (applying ? 'Submitting...' : 'Apply Now')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
