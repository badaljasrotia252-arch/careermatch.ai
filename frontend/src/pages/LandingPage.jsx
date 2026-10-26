import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  BookmarkCheck, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Target, 
  Cpu, 
  TrendingUp, 
  Users, 
  Award,
  Zap,
  Layers,
  ChevronRight,
  Star,
  Globe,
  Rocket,
  Brain,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { api } from '../api/client';
import JobCard from '../components/JobCard';
import OpportunityModal from '../components/OpportunityModal';
import { useScrollReveal, useAnimatedCounter, useTypingEffect } from '../hooks/useAnimations';
import { useCustomizer } from '../context/CustomizerContext';

/* ─── Animated Counter Component ─── */
function AnimatedStat({ value, suffix = '', label, icon: Icon, color }) {
  const [ref, count] = useAnimatedCounter(parseInt(value) || 0, 2200);
  return (
    <div ref={ref} className="text-center group">
      <div className={`text-4xl lg:text-5xl font-extrabold font-heading ${color} counter-value transition-transform group-hover:scale-110`}>
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium flex items-center justify-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 opacity-60" />}
        {label}
      </div>
    </div>
  );
}

/* ─── Reveal Section Wrapper ─── */
function RevealSection({ children, className = '', delay = '' }) {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${isVisible ? 'visible' : ''} ${delay} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { settings } = useCustomizer();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Typing effect for hero
  const typedText = useTypingEffect([
    'Your Dream Job',
    'Your Perfect Internship',
    'Your Career Growth',
    'Your Future Success'
  ], 70, 40, 2500);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getJobs({ limit: 4 });
        setFeaturedJobs(res.jobs ? res.jobs.slice(0, 4) : []);
      } catch (e) {
        console.warn('Failed to load featured jobs:', e);
      }
    }
    loadFeatured();
  }, []);

  const featureCards = [
    {
      title: 'AI-Powered Recommendations',
      description: 'Weighted algorithm matching your exact skills, education, location, and career goals with sub-second precision.',
      icon: Brain,
      gradient: 'from-indigo-500 via-indigo-400 to-cyan-400',
      badge: 'Core Engine',
      glow: 'rgba(99, 102, 241, 0.15)'
    },
    {
      title: 'Skill-Based Matching',
      description: 'Granular skill compatibility matrix analyzing language proficiencies, frameworks, and developer tools.',
      icon: Target,
      gradient: 'from-cyan-500 via-cyan-400 to-blue-400',
      badge: 'Smart Matrix',
      glow: 'rgba(6, 182, 212, 0.15)'
    },
    {
      title: 'ATS Resume Analysis',
      description: 'Instant 0–100 ATS scoring with entity extraction for projects, education, experience, and 1-click improved resume export.',
      icon: FileText,
      gradient: 'from-purple-500 via-violet-400 to-indigo-400',
      badge: 'NLP Parser',
      glow: 'rgba(139, 92, 246, 0.15)'
    },
    {
      title: 'Personalized Opportunities',
      description: 'Curated feeds distinguishing entry-level fresher roles, paid summer internships, and high-growth startups.',
      icon: Rocket,
      gradient: 'from-emerald-500 via-emerald-400 to-teal-400',
      badge: 'Tailored',
      glow: 'rgba(16, 185, 129, 0.15)'
    },
    {
      title: 'Skill Gap & Learning Roadmap',
      description: 'Visual progress charts comparing your profile against target roles like Data Analyst or Full Stack Engineer.',
      icon: BarChart3,
      gradient: 'from-amber-500 via-orange-400 to-yellow-400',
      badge: 'Roadmaps',
      glow: 'rgba(245, 158, 11, 0.15)'
    },
    {
      title: 'Application Tracking Pipeline',
      description: 'End-to-end recruitment lifecycle tracker managing status from Applied, Under Review, Interview to Offer.',
      icon: TrendingUp,
      gradient: 'from-rose-500 via-pink-400 to-fuchsia-400',
      badge: 'Lifecycle',
      glow: 'rgba(244, 63, 94, 0.15)'
    }
  ];

  return (
    <div className="pb-16">
      
      {/* ═══ 1. HERO SECTION ═══ */}
      <section className="relative pt-16 lg:pt-28 pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Animated glowing orbs */}
        <div className="hero-orb" style={{
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          top: '-100px', left: '10%',
          animationDelay: '0s'
        }} />
        <div className="hero-orb" style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          top: '50px', right: '5%',
          animationDelay: '3s', animationDuration: '10s'
        }} />
        <div className="hero-orb" style={{
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          bottom: '-100px', left: '40%',
          animationDelay: '5s', animationDuration: '12s'
        }} />
        
        <div className="text-center max-w-4xl mx-auto relative z-10">
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/50 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-8 shadow-lg shadow-indigo-500/10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
            <span>AI-Driven Career Matching & Placement Intelligence</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          {/* Hero Title with Typing Effect */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-heading animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="block mb-2">Discover</span>
            <span className="text-gradient inline-block min-h-[1.2em]">
              {settings.heroTitle && settings.heroTitle !== 'Your Dream Job' ? settings.heroTitle : typedText}
              <span className="typing-cursor"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300/90 mb-8 max-w-2xl mx-auto font-normal leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {settings.heroSubtitle || 'Get personalized career opportunities powered by intelligent matching algorithms analyzing your skills, education, interests, and career goals.'}
          </p>

          {/* Popular Tracks Quick Filter Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.45s' }}>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Popular Tracks:</span>
            {['Software Engineer', 'Full Stack', 'Data Science', 'Machine Learning', 'DevOps & Cloud', 'UI/UX'].map((track, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(track)}`)}
                className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-indigo-950/70 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs"
              >
                + {track}
              </button>
            ))}
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Link
              to="/register"
              className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-indigo-500/30 text-decoration-none group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/jobs"
              className="btn-secondary text-base py-3.5 px-7 text-decoration-none flex items-center gap-2 group"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Explore Jobs</span>
            </Link>

            <Link
              to="/internships"
              className="btn-secondary text-base py-3.5 px-7 text-decoration-none flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Explore Internships</span>
            </Link>
          </div>

          {/* Hero Interactive Architecture Card */}
          <div className="relative mx-auto max-w-5xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {/* Neon outer glow border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 via-cyan-500/20 to-purple-500/30 rounded-2xl blur-sm"></div>
            
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-indigo-500/10 via-slate-800/30 to-transparent border border-slate-700/40 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
              <div className="rounded-xl bg-slate-950/95 p-4 sm:p-6 border border-slate-800/60 text-left">
                
                {/* Graphic Titlebar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/90"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/90"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/90"></div>
                    <span className="text-xs font-mono text-slate-500 ml-2">CareerMatch Engine // Live Matching Pipeline</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    Algorithm v2.4 Active
                  </div>
                </div>

                {/* Graphic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Candidate Vector */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/30 transition-colors">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Candidate Profile</span>
                    </div>
                    <div className="font-semibold text-white text-sm mb-1">Aryan Sharma (Student)</div>
                    <div className="text-xs text-slate-500 mb-3">B.Tech CS • NIT • CGPA 8.8</div>
                    <div className="flex flex-wrap gap-1">
                      <span className="skill-pill text-[10px] skill-pill-matched">Python (Adv)</span>
                      <span className="skill-pill text-[10px] skill-pill-matched">SQL (Adv)</span>
                      <span className="skill-pill text-[10px] skill-pill-matched">React</span>
                      <span className="skill-pill text-[10px] skill-pill-matched">ML</span>
                    </div>
                  </div>

                  {/* Engine Box */}
                  <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Weighted Compatibility</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between"><span>Skills (40%)</span><span className="font-bold text-emerald-400">95%</span></div>
                        <div className="flex justify-between"><span>Education (15%)</span><span className="font-bold text-emerald-400">90%</span></div>
                        <div className="flex justify-between"><span>Location (10%)</span><span className="font-bold text-cyan-400">100%</span></div>
                        <div className="flex justify-between"><span>Interest (10%)</span><span className="font-bold text-cyan-400">95%</span></div>
                        <div className="flex justify-between"><span>Experience (10%)</span><span className="font-bold text-amber-400">80%</span></div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-indigo-800/30 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Target Match:</span>
                      <span className="text-base font-bold text-emerald-400">92% Precision</span>
                    </div>
                  </div>

                  {/* Top Match */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-emerald-500/30 transition-colors">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Top Match Opportunity</span>
                    </div>
                    <div className="font-bold text-white text-sm">Python Developer Intern</div>
                    <div className="text-xs text-indigo-400 mb-2">Google • Mountain View / Remote</div>
                    <p className="text-[11px] text-slate-500 leading-snug italic">
                      "You match this opportunity because you have Python, SQL and Machine Learning skills and selected Data Science."
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ 2. STATS BANNER — Animated Counters ═══ */}
      <RevealSection className="px-4 lg:px-8 max-w-7xl mx-auto mt-4 mb-20">
        <div className="glass-panel p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 border-slate-800/40 relative overflow-hidden">
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" style={{ transform: 'skewX(-15deg)' }}></div>
          
          <AnimatedStat value="20" suffix="+" label="Curated Tech Jobs" icon={Briefcase} color="text-gradient" />
          <AnimatedStat value="21" suffix="+" label="Verified Internships" icon={GraduationCap} color="text-gradient" />
          <AnimatedStat value="12" suffix="+" label="Top Tier Companies" icon={Globe} color="text-gradient" />
          <AnimatedStat value="92" suffix="%" label="Average Match Precision" icon={Target} color="text-gradient" />
        </div>
      </RevealSection>

      <hr className="glow-divider max-w-7xl mx-auto" />

      {/* ═══ 3. FEATURE CARDS — Staggered Reveal ═══ */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto py-16">
        <RevealSection className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold mb-4">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 font-heading">
            Engineered for Modern <span className="text-gradient">Career Growth</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything students, freshers, and job seekers need to discover, qualify, and track dream opportunities.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <RevealSection key={idx} delay={`delay-${(idx + 1) * 100}`}>
                <div 
                  className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group transition-all h-full"
                  style={{ '--card-glow': feat.glow }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-800/70 text-slate-300 border border-slate-700/50">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2.5 font-heading group-hover:text-indigo-400 transition-colors duration-300">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-800/60 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300">
                    <span>Explore Feature</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </section>

      <hr className="glow-divider max-w-7xl mx-auto" />

      {/* ═══ 4. FEATURED OPPORTUNITIES ═══ */}
      {featuredJobs.length > 0 && (
        <section className="px-4 lg:px-8 max-w-7xl mx-auto py-16">
          <RevealSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold mb-3">
                  <Zap className="w-3 h-3" />
                  <span>LIVE OPENINGS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading">
                  Top Featured Jobs
                </h2>
              </div>
              <Link
                to="/jobs"
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 text-decoration-none group"
              >
                <span>View all 20+ jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job, idx) => (
              <RevealSection key={job.job_id} delay={`delay-${(idx + 1) * 100}`}>
                <JobCard
                  job={job}
                  onSelect={(j) => setSelectedOpportunity(j)}
                />
              </RevealSection>
            ))}
          </div>
        </section>
      )}

      <hr className="glow-divider max-w-7xl mx-auto" />

      {/* ═══ 5. CALL TO ACTION ═══ */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto py-16">
        <RevealSection>
          <div className="relative rounded-3xl overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-slate-900/80 to-purple-900/80"></div>
            <div className="absolute inset-0 opacity-30" style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(6,182,212,0.2) 0%, transparent 50%)'
            }}></div>

            {/* Content */}
            <div className="relative p-8 sm:p-14 text-center border border-indigo-500/20 rounded-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-semibold mb-6">
                <Rocket className="w-3.5 h-3.5" />
                <span>START YOUR JOURNEY</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 font-heading max-w-2xl mx-auto">
                Ready to Discover Your Next Opportunity?
              </h2>
              <p className="text-slate-300/90 text-sm sm:text-base mb-10 leading-relaxed max-w-xl mx-auto">
                Create your profile in 2 minutes, get instant AI-matched compatibility scores, analyze your resume, and accelerate your career.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="btn-primary py-3.5 px-10 text-sm sm:text-base text-decoration-none group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/recommendations"
                  className="btn-secondary py-3.5 px-7 text-sm sm:text-base text-decoration-none"
                >
                  View Live Demo Recommendations
                </Link>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Opportunity Modal */}
      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
}
