import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import JobCard from '../components/JobCard';
import OpportunityModal from '../components/OpportunityModal';
import { 
  Search, 
  Filter, 
  X, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Clock, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function JobSearchPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filters State (Requirement 6)
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [industry, setIndustry] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [jobType, setJobType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [sort, setSort] = useState('match');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.getJobs({
        search,
        role,
        skill,
        location,
        experience,
        industry,
        work_mode: workMode,
        job_type: jobType,
        min_salary: minSalary,
        sort
      });
      setJobs(res.jobs);
    } catch (e) {
      console.warn('Failed to fetch jobs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [role, skill, location, experience, industry, workMode, jobType, minSalary, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearch('');
    setRole('');
    setSkill('');
    setLocation('');
    setExperience('');
    setIndustry('');
    setWorkMode('');
    setJobType('');
    setMinSalary('');
    setSort('match');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Search Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-2">
          Explore Professional <span className="text-gradient">Tech Jobs</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Discover vetted engineering, data, and software positions tailored to your qualifications.
        </p>
      </div>

      {/* Main Search Bar (Requirement 6) */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title, skill or company..."
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
          { label: 'React Developer', fn: () => { setRole('Frontend'); setSkill('React'); } },
          { label: 'Full Stack', fn: () => { setRole('Full Stack'); setSkill(''); } },
          { label: 'AI / Python', fn: () => { setRole('Data Scientist'); setSkill('Python'); } },
          { label: 'Remote Only', fn: () => { setWorkMode('Remote'); } },
          { label: 'High Salary ($140k+)', fn: () => { setMinSalary('140000'); } },
        ].map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={pill.fn}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 text-[11px] font-medium transition-all"
          >
            + {pill.label}
          </button>
        ))}
      </div>

      {/* Multi-Filter Controls Bar (Requirement 6) */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Search Filters</span>
          </div>
          <button
            onClick={handleClearFilters}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Filter: Job Role */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Job Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">All Roles</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Frontend">Frontend Developer</option>
              <option value="Backend">Backend Engineer</option>
              <option value="Full Stack">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="DevOps">DevOps & Cloud</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          {/* Filter: Skill */}
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
              <option value="Node.js">Node.js</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="AWS">AWS</option>
              <option value="Power BI">Power BI</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          {/* Filter: Location */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">Any Location</option>
              <option value="Remote">Remote</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="San Francisco">San Francisco</option>
              <option value="New York">New York</option>
              <option value="Seattle">Seattle</option>
            </select>
          </div>

          {/* Filter: Work Mode */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">Any Mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Filter: Experience */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="input-field text-xs py-2 px-2.5"
            >
              <option value="">All Levels</option>
              <option value="0-1">0-1 yrs (Freshers)</option>
              <option value="0-2">0-2 yrs (Entry)</option>
              <option value="1-3">1-3 yrs (Mid)</option>
            </select>
          </div>

          {/* Filter: Sorting */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field text-xs py-2 px-2.5 text-indigo-300 font-semibold"
            >
              <option value="match">AI Match % (High)</option>
              <option value="newest">Newly Posted</option>
              <option value="salary_high">Salary (Highest)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Jobs Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found <strong className="text-white">{jobs.length}</strong> matching jobs</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
            <span>Retrieving jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-md mx-auto space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white font-heading">No matching jobs found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search criteria or clearing filters.
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
            {jobs.map((job) => (
              <JobCard
                key={job.job_id}
                job={job}
                onSelect={(j) => setSelectedJob(j)}
                onUpdate={fetchJobs}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Details Inspector */}
      {selectedJob && (
        <OpportunityModal
          opportunity={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdate={fetchJobs}
        />
      )}

    </div>
  );
}
