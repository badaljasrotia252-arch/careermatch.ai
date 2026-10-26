import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import InternshipCard from '../components/InternshipCard';
import OpportunityModal from '../components/OpportunityModal';
import { 
  Search, 
  BookmarkCheck, 
  MapPin, 
  Clock, 
  DollarSign, 
  Sparkles, 
  X,
  SlidersHorizontal 
} from 'lucide-react';

export default function InternshipSearchPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Filters State (Requirement 7)
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [internshipType, setInternshipType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [sort, setSort] = useState('match');

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await api.getInternships({
        search,
        domain,
        skill,
        location,
        duration,
        internship_type: internshipType,
        work_mode: workMode,
        sort
      });
      setInternships(res.internships);
    } catch (e) {
      console.warn('Failed to load internships:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [domain, skill, location, duration, internshipType, workMode, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleClearFilters = () => {
    setSearch('');
    setDomain('');
    setSkill('');
    setLocation('');
    setDuration('');
    setInternshipType('');
    setWorkMode('');
    setSort('match');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-2">
          Discover High-Impact <span className="text-gradient">Internships</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Paid summer, winter, and semester internships designed specifically for students and fresh graduates.
        </p>
      </div>

      {/* Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search internships by domain, title, skill, or company..."
          className="input-field pl-12 pr-28 py-3.5 text-sm sm:text-base rounded-2xl shadow-xl"
        />
        <button
          type="submit"
          className="btn-primary text-xs sm:text-sm absolute right-2 py-2 px-5 rounded-xl"
        >
          Search
        </button>
      </form>

      {/* Quick Filter Presets */}
      <div className="flex items-center gap-2 flex-wrap text-xs -mt-3">
        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Quick Filters:</span>
        {[
          { label: 'Summer 2026', fn: () => { setType('Summer'); } },
          { label: 'Remote Only', fn: () => { setWorkMode('Remote'); } },
          { label: 'High Stipend ($5k+/mo)', fn: () => { setMinStipend('5000'); } },
          { label: 'AI & Data Science', fn: () => { setDomain('Data Science'); } },
          { label: 'Web Dev & React', fn: () => { setDomain('Web Development'); } },
        ].map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={pill.fn}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-medium transition-all"
          >
            + {pill.label}
          </button>
        ))}
      </div>

      {/* Multi-Filters Controls Bar (Requirement 7) */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Internship Filters</span>
          </div>
          <button
            onClick={handleClearFilters}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Domain */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">All Domains</option>
              <option value="Software Development">Software Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="AI/ML">AI / Machine Learning</option>
              <option value="UI/UX">UI/UX Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Skill</label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">All Skills</option>
              <option value="Python">Python</option>
              <option value="React">React</option>
              <option value="SQL">SQL</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Node.js">Node.js</option>
              <option value="Figma">Figma</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">Any Mode</option>
              <option value="Remote">100% Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">Any Duration</option>
              <option value="3 Months">3 Months</option>
              <option value="4 Months">4 Months</option>
              <option value="6 Months">6 Months</option>
            </select>
          </div>

          {/* Internship Type */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Type</label>
            <select
              value={internshipType}
              onChange={(e) => setInternshipType(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">All Types</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
              <option value="Regular">Regular</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field text-xs py-2 px-2.5 text-cyan-300 font-semibold"
            >
              <option value="match">AI Match % (High)</option>
              <option value="newest">Newly Added</option>
            </select>
          </div>

        </div>
      </div>

      {/* Internships Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found <strong className="text-white">{internships.length}</strong> available internships</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
            <span>Finding matching student internships...</span>
          </div>
        ) : internships.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-md mx-auto space-y-3">
            <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white font-heading">No internships match filters</h3>
            <p className="text-xs text-slate-400">
              Try changing domain or removing some filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-secondary text-xs py-2 px-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internships.map((internship) => (
              <InternshipCard
                key={internship.internship_id}
                internship={internship}
                onSelect={(opp) => setSelectedInternship(opp)}
                onUpdate={fetchInternships}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Inspector */}
      {selectedInternship && (
        <OpportunityModal
          opportunity={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          onUpdate={fetchInternships}
        />
      )}

    </div>
  );
}
