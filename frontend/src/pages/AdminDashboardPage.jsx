import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  Users, 
  Briefcase, 
  BookmarkCheck, 
  Building2, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles,
  TrendingUp,
  PieChart
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'users', 'jobs', 'internships', 'companies'
  
  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Entities State
  const [userList, setUserList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [internshipList, setInternshipList] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  // Modals
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddInternshipModal, setShowAddInternshipModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  // New Job Form
  const [jobForm, setJobForm] = useState({
    title: '',
    company_id: 1,
    location: 'Remote',
    salary: '$120,000 / yr',
    min_salary: 120000,
    experience: '0-2 years',
    job_type: 'Full-time',
    work_mode: 'Remote',
    industry: 'Software Development',
    required_skills: 'Python, SQL, React',
    description: 'High impact engineering role.',
    deadline: '2026-12-31'
  });

  // New Internship Form
  const [internshipForm, setInternshipForm] = useState({
    title: '',
    company_id: 1,
    domain: 'Software Development',
    location: 'Remote',
    stipend: '$5,000 / month',
    duration: '3 Months',
    internship_type: 'Summer',
    work_mode: 'Remote',
    required_skills: 'Python, Git, SQL',
    description: 'Summer practical training program.',
    deadline: '2026-12-31'
  });

  // New Company Form
  const [companyForm, setCompanyForm] = useState({
    company_name: '',
    industry: 'Technology',
    location: 'San Francisco, CA',
    size: '1,000+ employees',
    website: 'https://example.com'
  });

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await api.getAdminAnalytics();
      setAnalytics(res);
    } catch (e) {
      console.warn('Analytics error:', e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.getAdminUsers();
      setUserList(res.users || []);
    } catch (e) {
      console.warn('Load users error:', e);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await api.getJobs({ sort: 'newest' });
      setJobList(res.jobs || []);
    } catch (e) {
      console.warn('Load jobs error:', e);
    }
  };

  const loadInternships = async () => {
    try {
      const res = await api.getInternships({ sort: 'newest' });
      setInternshipList(res.internships || []);
    } catch (e) {
      console.warn('Load internships error:', e);
    }
  };

  const loadCompanies = async () => {
    try {
      const res = await api.getCompanies();
      setCompanyList(res.companies || []);
    } catch (e) {
      console.warn('Load companies error:', e);
    }
  };

  useEffect(() => {
    loadAnalytics();
    loadUsers();
    loadJobs();
    loadInternships();
    loadCompanies();
  }, []);

  // Delete Handlers
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.deleteAdminUser(id);
      showToast('User deleted');
      loadUsers();
      loadAnalytics();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job opening?')) return;
    try {
      await api.deleteJob(id);
      showToast('Job deleted');
      loadJobs();
      loadAnalytics();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    try {
      await api.deleteInternship(id);
      showToast('Internship deleted');
      loadInternships();
      loadAnalytics();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await api.deleteCompany(id);
      showToast('Company deleted');
      loadCompanies();
      loadAnalytics();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // Create Handlers
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = jobForm.required_skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.createJob({
        ...jobForm,
        required_skills: skillsArray
      });
      showToast('Job opening added successfully!');
      setShowAddJobModal(false);
      loadJobs();
      loadAnalytics();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = internshipForm.required_skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.createInternship({
        ...internshipForm,
        required_skills: skillsArray
      });
      showToast('Internship added successfully!');
      setShowAddInternshipModal(false);
      loadInternships();
      loadAnalytics();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await api.createCompany(companyForm);
      showToast('Company registered successfully!');
      setShowAddCompanyModal(false);
      loadCompanies();
      loadAnalytics();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>Master Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Admin Panel & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            System administration for users, opportunities, companies, and placement analytics.
          </p>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        {[
          { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
          { id: 'users', label: `Users (${userList.length})`, icon: Users },
          { id: 'jobs', label: `Jobs (${jobList.length})`, icon: Briefcase },
          { id: 'internships', label: `Internships (${internshipList.length})`, icon: BookmarkCheck },
          { id: 'companies', label: `Companies (${companyList.length})`, icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                active
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ANALYTICS TAB (Requirement 13) */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top KPI Counts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="glass-panel p-5 rounded-xl border-purple-500/20">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Users</span>
              <div className="text-3xl font-extrabold text-white font-heading">{analytics?.counts?.total_users || 0}</div>
            </div>

            <div className="glass-panel p-5 rounded-xl border-indigo-500/20">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Jobs</span>
              <div className="text-3xl font-extrabold text-indigo-400 font-heading">{analytics?.counts?.total_jobs || 0}</div>
            </div>

            <div className="glass-panel p-5 rounded-xl border-cyan-500/20">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Internships</span>
              <div className="text-3xl font-extrabold text-cyan-400 font-heading">{analytics?.counts?.total_internships || 0}</div>
            </div>

            <div className="glass-panel p-5 rounded-xl border-emerald-500/20">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Applications</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-heading">{analytics?.counts?.total_applications || 0}</div>
            </div>

            <div className="glass-panel p-5 rounded-xl border-amber-500/20">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Companies</span>
              <div className="text-3xl font-extrabold text-amber-400 font-heading">{analytics?.counts?.total_companies || 0}</div>
            </div>
          </div>

          {/* Charts & Analytical Distributions (Requirement 13) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Most Popular Skills in Database */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Most Popular User Skills</span>
                </h3>
                <span className="text-[11px] text-slate-400">Candidate Frequency</span>
              </div>

              <div className="space-y-3">
                {analytics?.popular_skills?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{item.skill_name}</span>
                      <span className="text-cyan-400">{item.user_count} candidates</span>
                    </div>
                    <div className="progress-bar-bg h-2">
                      <div
                        className="progress-bar-fill bg-cyan-500"
                        style={{ width: `${Math.min(100, item.user_count * 35)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Popular Job Domains / Roles */}
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Industry Role Distribution</span>
                </h3>
                <span className="text-[11px] text-slate-400">Database Breakdown</span>
              </div>

              <div className="space-y-3">
                {analytics?.popular_roles?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{item.industry}</span>
                      <span className="text-indigo-400">{item.count} opportunities</span>
                    </div>
                    <div className="progress-bar-bg h-2">
                      <div
                        className="progress-bar-fill bg-indigo-500"
                        style={{ width: `${Math.min(100, item.count * 20)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Applications Feed */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white font-heading mb-4">
              Recent Application Submissions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Candidate</th>
                    <th className="py-2.5 px-4">Position</th>
                    <th className="py-2.5 px-4">Company</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {analytics?.recent_applications?.map((a) => (
                    <tr key={a.application_id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">{a.user_name}</td>
                      <td className="py-3 px-4 text-slate-300">{a.title}</td>
                      <td className="py-3 px-4 text-slate-400">{a.company_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{a.applied_date ? new Date(a.applied_date).toLocaleDateString() : 'Recent'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. USERS MANAGEMENT TAB (Requirement 13) */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl overflow-hidden border-slate-800 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Name & Email</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Location</th>
                  <th className="py-3.5 px-5">College & Year</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {userList.map((u) => (
                  <tr key={u.user_id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300">{u.user_type}</td>
                    <td className="py-3.5 px-5 text-slate-400">{u.location || '—'}</td>
                    <td className="py-3.5 px-5 text-slate-400">{u.college || '—'} ({u.graduation_year || '—'})</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.user_id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. JOBS MANAGEMENT TAB (Requirement 13) */}
      {activeTab === 'jobs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddJobModal(true)}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job Opening</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Title</th>
                    <th className="py-3.5 px-5">Company</th>
                    <th className="py-3.5 px-5">Location</th>
                    <th className="py-3.5 px-5">Salary</th>
                    <th className="py-3.5 px-5">Mode</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {jobList.map((j) => (
                    <tr key={j.job_id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-5 font-bold text-white">{j.title}</td>
                      <td className="py-3.5 px-5 text-slate-300">{j.company_name}</td>
                      <td className="py-3.5 px-5 text-slate-400">{j.location}</td>
                      <td className="py-3.5 px-5 text-emerald-400 font-semibold">{j.salary}</td>
                      <td className="py-3.5 px-5 text-slate-300">{j.work_mode}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteJob(j.job_id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. INTERNSHIPS MANAGEMENT TAB (Requirement 13) */}
      {activeTab === 'internships' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddInternshipModal(true)}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Internship</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Title</th>
                    <th className="py-3.5 px-5">Company</th>
                    <th className="py-3.5 px-5">Domain</th>
                    <th className="py-3.5 px-5">Stipend</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {internshipList.map((i) => (
                    <tr key={i.internship_id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-5 font-bold text-white">{i.title}</td>
                      <td className="py-3.5 px-5 text-slate-300">{i.company_name}</td>
                      <td className="py-3.5 px-5 text-cyan-300">{i.domain}</td>
                      <td className="py-3.5 px-5 text-emerald-400 font-semibold">{i.stipend}</td>
                      <td className="py-3.5 px-5 text-slate-400">{i.duration}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteInternship(i.internship_id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. COMPANIES MANAGEMENT TAB (Requirement 13) */}
      {activeTab === 'companies' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companyList.map((c) => (
              <div key={c.company_id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <img
                      src={c.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150'}
                      alt={c.company_name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800"
                    />
                    <button
                      onClick={() => handleDeleteCompany(c.company_id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">{c.company_name}</h3>
                  <div className="text-xs text-indigo-400 mb-2">{c.industry}</div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-2">{c.description || 'Enterprise Technology Organization'}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
                  <span>{c.location}</span>
                  <span>{c.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD JOB MODAL */}
      {showAddJobModal && (
        <div className="modal-overlay" onClick={() => setShowAddJobModal(false)}>
          <div className="modal-content max-w-lg p-6 rounded-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white font-heading">Post New Job Opening</h3>
              <button onClick={() => setShowAddJobModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Backend Engineer"
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company</label>
                <select
                  value={jobForm.company_id}
                  onChange={(e) => setJobForm({ ...jobForm, company_id: parseInt(e.target.value) })}
                  className="input-field text-xs py-2"
                >
                  {companyList.map((c) => (
                    <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Salary</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jobForm.required_skills}
                  onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                  placeholder="Python, SQL, React, Docker"
                  className="input-field text-xs py-2"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddJobModal(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD INTERNSHIP MODAL */}
      {showAddInternshipModal && (
        <div className="modal-overlay" onClick={() => setShowAddInternshipModal(false)}>
          <div className="modal-content max-w-lg p-6 rounded-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white font-heading">Post New Internship</h3>
              <button onClick={() => setShowAddInternshipModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateInternship} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Internship Title *</label>
                <input
                  type="text"
                  required
                  value={internshipForm.title}
                  onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })}
                  placeholder="e.g. AI Research Intern"
                  className="input-field text-xs py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Domain</label>
                  <input
                    type="text"
                    value={internshipForm.domain}
                    onChange={(e) => setInternshipForm({ ...internshipForm, domain: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Stipend</label>
                  <input
                    type="text"
                    value={internshipForm.stipend}
                    onChange={(e) => setInternshipForm({ ...internshipForm, stipend: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={internshipForm.required_skills}
                  onChange={(e) => setInternshipForm({ ...internshipForm, required_skills: e.target.value })}
                  placeholder="Python, Machine Learning, SQL"
                  className="input-field text-xs py-2"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddInternshipModal(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">Publish Internship</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COMPANY MODAL */}
      {showAddCompanyModal && (
        <div className="modal-overlay" onClick={() => setShowAddCompanyModal(false)}>
          <div className="modal-content max-w-lg p-6 rounded-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white font-heading">Register New Company</h3>
              <button onClick={() => setShowAddCompanyModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyForm.company_name}
                  onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                  className="input-field text-xs py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCompanyModal(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">Add Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
