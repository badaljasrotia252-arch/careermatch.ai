/**
 * CareerMatch AI - HTTP API Client with Intelligent Demo & Offline Fallback
 */

import { 
  mockJobs, 
  mockInternships, 
  mockApplications, 
  mockSkillGapData, 
  mockResumeAnalysis 
} from '../data/mockData';

const API_BASE = '/api';

function isDemoMode() {
  try {
    const raw = localStorage.getItem('careermatch_customizer_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.demoMode !== undefined) return parsed.demoMode;
    }
  } catch (e) {}
  return true; // Default fallback to true for smooth experience
}

// In-memory / localStorage demo stores
function getStoredApplications() {
  try {
    const stored = localStorage.getItem('careermatch_demo_apps');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return mockApplications;
}

function saveStoredApplications(apps) {
  try {
    localStorage.setItem('careermatch_demo_apps', JSON.stringify(apps));
  } catch (e) {}
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('careermatch_token');

  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast fallback
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      localStorage.removeItem('careermatch_token');
      localStorage.removeItem('careermatch_user');
    }

    if (options.responseType === 'blob') {
      if (!response.ok) throw new Error('File download failed');
      return response.blob();
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Network request failed');
    }
    return data;
  } catch (err) {
    // If backend is unavailable or demo mode is on, handle graceful mock fallbacks
    if (isDemoMode()) {
      return handleMockFallback(endpoint, options);
    }
    throw err;
  }
}

// Intelligent mock handlers for offline / demo mode
function handleMockFallback(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();

  // 1. Jobs
  if (endpoint.startsWith('/jobs')) {
    let list = [...mockJobs];
    // Filter if search or role query present
    if (endpoint.includes('?')) {
      const params = new URLSearchParams(endpoint.split('?')[1]);
      const search = params.get('search')?.toLowerCase();
      const role = params.get('role');
      const workMode = params.get('work_mode');
      const sort = params.get('sort');

      if (search) {
        list = list.filter(j => 
          j.title.toLowerCase().includes(search) || 
          j.company_name.toLowerCase().includes(search) ||
          j.required_skills.some(s => s.toLowerCase().includes(search))
        );
      }
      if (role) {
        list = list.filter(j => j.title.toLowerCase().includes(role.toLowerCase()));
      }
      if (workMode) {
        list = list.filter(j => j.work_mode.toLowerCase() === workMode.toLowerCase());
      }
      if (sort === 'salary_high') {
        list.sort((a, b) => b.min_salary - a.min_salary);
      } else if (sort === 'salary_low') {
        list.sort((a, b) => a.min_salary - b.min_salary);
      }
    }
    return { jobs: list, total: list.length };
  }

  // 2. Internships
  if (endpoint.startsWith('/internships')) {
    let list = [...mockInternships];
    if (endpoint.includes('?')) {
      const params = new URLSearchParams(endpoint.split('?')[1]);
      const search = params.get('search')?.toLowerCase();
      const workMode = params.get('work_mode');

      if (search) {
        list = list.filter(i => 
          i.title.toLowerCase().includes(search) || 
          i.company_name.toLowerCase().includes(search)
        );
      }
      if (workMode) {
        list = list.filter(i => i.work_mode.toLowerCase() === workMode.toLowerCase());
      }
    }
    return { internships: list, total: list.length };
  }

  // 3. Recommendations
  if (endpoint.startsWith('/recommendations')) {
    return {
      recommended_jobs: mockJobs,
      recommended_internships: mockInternships,
      top_overall_matches: [...mockJobs.slice(0, 3), ...mockInternships.slice(0, 2)],
      user_summary: {
        total_skills: 8,
        match_confidence: '95%'
      }
    };
  }

  // 4. Application Tracker
  if (endpoint.startsWith('/applications')) {
    let apps = getStoredApplications();

    if (method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const newApp = {
        application_id: Date.now(),
        ...body,
        applied_date: new Date().toISOString().split('T')[0]
      };
      apps.unshift(newApp);
      saveStoredApplications(apps);
      return { success: true, application: newApp };
    }

    if (method === 'PUT') {
      const parts = endpoint.split('/');
      const id = parseInt(parts[2]);
      const body = JSON.parse(options.body || '{}');
      apps = apps.map(a => a.application_id === id ? { ...a, ...body } : a);
      saveStoredApplications(apps);
      return { success: true };
    }

    if (method === 'DELETE') {
      const parts = endpoint.split('/');
      const id = parseInt(parts[2]);
      apps = apps.filter(a => a.application_id !== id);
      saveStoredApplications(apps);
      return { success: true };
    }

    // GET /applications
    const stats = {
      total: apps.length,
      applied: apps.filter(a => a.status === 'Applied').length,
      under_review: apps.filter(a => a.status === 'Under Review').length,
      shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
      interview: apps.filter(a => a.status === 'Interview').length,
      selected: apps.filter(a => a.status === 'Selected').length,
      rejected: apps.filter(a => a.status === 'Rejected').length
    };
    return { applications: apps, stats };
  }

  // 5. Skill Gap Analysis
  if (endpoint.startsWith('/skill-gap')) {
    return mockSkillGapData;
  }

  // 6. Resume Analysis
  if (endpoint.startsWith('/resume/analyze')) {
    return { success: true, analysis: mockResumeAnalysis };
  }

  if (endpoint.startsWith('/resume/download-improved')) {
    const text = `# Alex Morgan - Optimized Professional Resume\nEmail: alex.morgan@example.com | GitHub: github.com/alexmorgan\n\n## Summary\nInnovative Full Stack Engineer with 4+ years of experience developing responsive web applications...\n`;
    return new Blob([text], { type: 'text/markdown' });
  }

  // 7. Chatbot
  if (endpoint.startsWith('/chat')) {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
    const query = (body.message || '').toLowerCase();
    
    let answer = "Based on your technical profile in React, Node.js, and TypeScript, you match strongly with Full Stack and Frontend Engineering roles. I recommend brushing up on Docker and Cloud CI/CD to expand your opportunities to 95%+!";
    if (query.includes('internship')) {
      answer = "Great question! We currently have 4 top internships matching your skillset with competitive stipends up to $6,000/month at Starlight Interactive and DeepMinded Analytics.";
    } else if (query.includes('resume')) {
      answer = "To boost your resume ATS score, make sure you include quantifiable bullet metrics (e.g., 'Decreased latency by 30%') and add keywords like Docker, AWS, and Microservices!";
    }

    return {
      message: answer,
      suggestions: [
        "Show me top internship matches",
        "How can I practice for technical interviews?",
        "What skills are most in demand in 2026?"
      ]
    };
  }

  // 8. Auth / Current User
  if (endpoint === '/auth/login' || endpoint === '/auth/register') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
    const email = body.email || 'candidate@careermatch.ai';
    const isAdmin = email.includes('admin');
    const user = {
      id: isAdmin ? 999 : 1,
      name: isAdmin ? 'System Administrator' : (email.includes('fresher') ? 'Jordan Lee' : 'Alex Morgan'),
      email: email,
      role: isAdmin ? 'admin' : 'user',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
      education: "Bachelor's in Computer Science",
      location: 'San Francisco, CA'
    };
    return { token: 'demo_token_' + Date.now(), user };
  }

  if (endpoint === '/auth/me') {
    const storedUser = localStorage.getItem('careermatch_user');
    if (storedUser) {
      try { return { user: JSON.parse(storedUser) }; } catch (e) {}
    }
    return {
      user: {
        id: 1,
        name: 'Alex Morgan',
        email: 'alex.morgan@careermatch.ai',
        role: 'user',
        skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'PostgreSQL'],
        education: "Bachelor's in Computer Science",
        location: 'San Francisco, CA'
      }
    };
  }

  // Default empty object
  return {};
}

export const api = {
  // Auth
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => apiRequest('/auth/me'),

  // Profile
  getProfile: () => apiRequest('/profile'),
  updateProfile: (profileData) => apiRequest('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getSkillsTaxonomy: () => apiRequest('/skills'),

  // Jobs
  getJobs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/jobs?${qs}`);
  },
  getJobDetails: (id) => apiRequest(`/jobs/${id}`),

  // Internships
  getInternships: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/internships?${qs}`);
  },
  getInternshipDetails: (id) => apiRequest(`/internships/${id}`),

  // Recommendations
  getRecommendations: () => apiRequest('/recommendations'),

  // Resume Analyzer
  analyzeResume: (formData) => apiRequest('/resume/analyze', { method: 'POST', body: formData }),
  downloadImprovedResume: () => apiRequest('/resume/download-improved', { responseType: 'blob' }),

  // Application Tracker
  getApplications: () => apiRequest('/applications'),
  addApplication: (appData) => apiRequest('/applications', { method: 'POST', body: JSON.stringify(appData) }),
  updateApplication: (id, appData) => apiRequest(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(appData) }),
  deleteApplication: (id) => apiRequest(`/applications/${id}`, { method: 'DELETE' }),

  // Saved Opportunities
  getSavedOpportunities: () => apiRequest('/saved'),
  toggleSaveOpportunity: (data) => apiRequest('/saved/toggle', { method: 'POST', body: JSON.stringify(data) }),

  // Skill Gap Analysis
  getSkillGap: (role) => apiRequest(`/skill-gap${role ? `?role=${encodeURIComponent(role)}` : ''}`),

  // AI Assistant Chatbot
  chatWithCareerMate: (message) => apiRequest('/chat', { method: 'POST', body: JSON.stringify({ message }) }),

  // Admin
  getAdminAnalytics: () => apiRequest('/admin/analytics'),
  getAdminUsers: () => apiRequest('/admin/users'),
  updateAdminUser: (id, data) => apiRequest(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAdminUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),

  createJob: (data) => apiRequest('/admin/jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateJob: (id, data) => apiRequest(`/admin/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteJob: (id) => apiRequest(`/admin/jobs/${id}`, { method: 'DELETE' }),

  createInternship: (data) => apiRequest('/admin/internships', { method: 'POST', body: JSON.stringify(data) }),
  updateInternship: (id, data) => apiRequest(`/admin/internships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInternship: (id) => apiRequest(`/admin/internships/${id}`, { method: 'DELETE' }),

  getCompanies: () => apiRequest('/admin/companies'),
  createCompany: (data) => apiRequest('/admin/companies', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id, data) => apiRequest(`/admin/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompany: (id) => apiRequest(`/admin/companies/${id}`, { method: 'DELETE' })
};
