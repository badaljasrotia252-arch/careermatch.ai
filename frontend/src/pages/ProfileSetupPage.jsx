import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Sparkles, 
  Plus, 
  X, 
  Check, 
  Save, 
  ArrowRight,
  Award,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js',
  'SQL', 'MongoDB', 'PostgreSQL', 'Machine Learning', 'Data Science', 'Data Analytics',
  'Deep Learning', 'PyTorch', 'Power BI', 'Tableau', 'AWS', 'Docker', 'Kubernetes',
  'Git & GitHub', 'Cybersecurity', 'UI/UX Design', 'Communication', 'Leadership'
];

const INTERESTS_OPTIONS = [
  'Software Development',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'Business Analytics',
  'UI/UX',
  'Finance',
  'Marketing'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function ProfileSetupPage() {
  const { user, refreshProfile, showToast } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [personal, setPersonal] = useState({
    name: '',
    phone: '',
    location: '',
    profile_photo: '',
    user_type: 'Student'
  });

  const [education, setEducation] = useState({
    degree: 'B.Tech / B.E.',
    specialization: 'Computer Science and Engineering',
    college: '',
    cgpa: '8.5',
    graduation_year: '2026'
  });

  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const [preferences, setPreferences] = useState({
    desired_job_role: 'Full Stack Developer',
    desired_internship_role: 'Software Engineering Summer Intern',
    preferred_industry: 'Software Development',
    preferred_location: 'Bengaluru / Remote',
    work_mode: 'Remote',
    expected_salary: '₹10,00,000 / yr',
    internship_duration: '3-6 Months',
    work_type: 'Full-time'
  });

  const [interests, setInterests] = useState(['Software Development', 'Data Science']);

  // Load existing profile if available
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getProfile();
        const p = res.profile;
        if (p) {
          setPersonal({
            name: p.name || '',
            phone: p.phone || '',
            location: p.location || '',
            profile_photo: p.profile_photo || '',
            user_type: p.user_type || 'Student'
          });

          if (p.education) {
            setEducation({
              degree: p.education.degree || 'B.Tech / B.E.',
              specialization: p.education.specialization || 'Computer Science',
              college: p.education.college || p.college || '',
              cgpa: p.education.cgpa ? String(p.education.cgpa) : '8.5',
              graduation_year: p.education.graduation_year ? String(p.education.graduation_year) : '2026'
            });
          } else {
            setEducation(prev => ({
              ...prev,
              college: p.college || '',
              graduation_year: p.graduation_year ? String(p.graduation_year) : '2026'
            }));
          }

          if (Array.isArray(p.skills) && p.skills.length > 0) {
            setSkills(p.skills.map(s => ({
              skill_name: s.skill_name || s,
              skill_level: s.skill_level || 'Intermediate'
            })));
          } else {
            // Default recommended starter skills
            setSkills([
              { skill_name: 'Python', skill_level: 'Advanced' },
              { skill_name: 'SQL', skill_level: 'Advanced' },
              { skill_name: 'React', skill_level: 'Intermediate' }
            ]);
          }

          setPreferences({
            desired_job_role: p.desired_job_role || 'Python Developer',
            desired_internship_role: p.desired_internship_role || 'Software Engineering Summer Intern',
            preferred_industry: p.preferred_industry || 'Software Development',
            preferred_location: p.preferred_location || p.location || 'Bengaluru / Remote',
            work_mode: p.work_mode || 'Remote',
            expected_salary: p.expected_salary || '₹10,00,000 / yr',
            internship_duration: p.internship_duration || '3-6 Months',
            work_type: p.work_type || 'Full-time'
          });

          if (Array.isArray(p.interests) && p.interests.length > 0) {
            setInterests(p.interests);
          }
        }
      } catch (e) {
        console.warn('Failed to load profile data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Skill Add / Remove / Change Level
  const handleAddSkill = (name, level = 'Intermediate') => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.some(s => s.skill_name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Skill already added', 'info');
      return;
    }
    setSkills(prev => [...prev, { skill_name: trimmed, skill_level: level }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (name) => {
    setSkills(prev => prev.filter(s => s.skill_name.toLowerCase() !== name.toLowerCase()));
  };

  const handleChangeSkillLevel = (name, newLevel) => {
    setSkills(prev => prev.map(s => s.skill_name.toLowerCase() === name.toLowerCase() ? { ...s, skill_level: newLevel } : s));
  };

  // Toggle Interest
  const handleToggleInterest = (interest) => {
    setInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  // Save Profile Handler (Requirement 3)
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        name: personal.name,
        phone: personal.phone,
        location: personal.location,
        profile_photo: personal.profile_photo,
        user_type: personal.user_type,
        // Education
        degree: education.degree,
        specialization: education.specialization,
        college: education.college,
        cgpa: education.cgpa,
        graduation_year: education.graduation_year,
        // Career Preferences
        desired_job_role: preferences.desired_job_role,
        desired_internship_role: preferences.desired_internship_role,
        preferred_industry: preferences.preferred_industry,
        preferred_location: preferences.preferred_location,
        work_mode: preferences.work_mode,
        expected_salary: preferences.expected_salary,
        internship_duration: preferences.internship_duration,
        work_type: preferences.work_type,
        // Interests
        interests: interests,
        // Skills
        skills: skills
      });

      await refreshProfile();
      showToast('Profile saved successfully! Recommendation scores refreshed.');
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      showToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Recommendation Engine Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            User Profile & Career Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep your skills and preferences up-to-date to maximize matching scores and opportunity precision.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="btn-primary py-2.5 px-6 flex items-center gap-2 self-start sm:self-center shadow-lg shadow-indigo-500/30"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {/* 1. PERSONAL INFORMATION (Requirement 3) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white font-heading">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={personal.name}
              onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. Aryan Sharma"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={personal.phone}
              onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
              className="input-field text-sm"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Location</label>
            <input
              type="text"
              value={personal.location}
              onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. Bengaluru, India"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">User Category</label>
            <select
              value={personal.user_type}
              onChange={(e) => setPersonal({ ...personal, user_type: e.target.value })}
              className="input-field text-sm"
            >
              <option value="Student">Student</option>
              <option value="Fresher">Fresher</option>
              <option value="Experienced Professional">Experienced Professional</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Profile Photo URL</label>
            <input
              type="url"
              value={personal.profile_photo}
              onChange={(e) => setPersonal({ ...personal, profile_photo: e.target.value })}
              className="input-field text-sm"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>
      </div>

      {/* 2. EDUCATION (Requirement 3) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white font-heading">
            Education Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree</label>
            <input
              type="text"
              value={education.degree}
              onChange={(e) => setEducation({ ...education, degree: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. B.Tech / B.E."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Branch / Specialization</label>
            <input
              type="text"
              value={education.specialization}
              onChange={(e) => setEducation({ ...education, specialization: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. Computer Science & Engineering"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">College / University</label>
            <input
              type="text"
              value={education.college}
              onChange={(e) => setEducation({ ...education, college: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. National Institute of Technology"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">CGPA / Percentage</label>
            <input
              type="text"
              value={education.cgpa}
              onChange={(e) => setEducation({ ...education, cgpa: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. 8.8 / 10"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Year</label>
            <select
              value={education.graduation_year}
              onChange={(e) => setEducation({ ...education, graduation_year: e.target.value })}
              className="input-field text-sm"
            >
              <option value="2028">2028</option>
              <option value="2027">2027</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. SKILLS WITH PROFICIENCY LEVELS (Requirement 3) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Technical & Professional Skills
              </h2>
              <p className="text-xs text-slate-400">
                Skills constitute 40% of your AI recommendation score.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
            {skills.length} Selected
          </span>
        </div>

        {/* Current User Skills List with Level Dropdown */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="p-1.5 pl-3 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center gap-2 shadow-sm"
            >
              <span className="text-xs font-semibold text-white">
                {skill.skill_name}
              </span>
              <select
                value={skill.skill_level}
                onChange={(e) => handleChangeSkillLevel(skill.skill_name, e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md text-[11px] text-cyan-400 font-medium px-2 py-0.5 outline-none"
              >
                {SKILL_LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <button
                onClick={() => handleRemoveSkill(skill.skill_name)}
                className="p-1 text-slate-500 hover:text-rose-400 rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Skill Adder Form */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(newSkillName, newSkillLevel);
              }
            }}
            placeholder="Type skill name (e.g. FastAPI, Tailwind, PyTorch)..."
            className="input-field text-sm flex-1"
          />
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value)}
            className="input-field text-sm sm:w-40"
          >
            {SKILL_LEVELS.map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleAddSkill(newSkillName, newSkillLevel)}
            className="btn-secondary text-sm py-2 px-4 whitespace-nowrap flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Suggested High-Demand Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((sk, idx) => {
              const alreadyAdded = skills.some(s => s.skill_name.toLowerCase() === sk.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => !alreadyAdded && handleAddSkill(sk, 'Intermediate')}
                  disabled={alreadyAdded}
                  className={`skill-pill text-xs transition-all ${
                    alreadyAdded
                      ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                      : 'hover:border-cyan-500/50 hover:text-cyan-300'
                  }`}
                >
                  {alreadyAdded ? '✓ ' : '+ '}
                  {sk}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. CAREER PREFERENCES (Requirement 3) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            <Briefcase className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white font-heading">
            Career & Placement Preferences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Desired Job Role</label>
            <input
              type="text"
              value={preferences.desired_job_role}
              onChange={(e) => setPreferences({ ...preferences, desired_job_role: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. Python Developer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Desired Internship Role</label>
            <input
              type="text"
              value={preferences.desired_internship_role}
              onChange={(e) => setPreferences({ ...preferences, desired_internship_role: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. Software Engineering Intern"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Industry</label>
            <select
              value={preferences.preferred_industry}
              onChange={(e) => setPreferences({ ...preferences, preferred_industry: e.target.value })}
              className="input-field text-sm"
            >
              <option value="Software Development">Software Development</option>
              <option value="Data Science & AI">Data Science & AI</option>
              <option value="Web Development">Web Development</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="UI/UX & Product Design">UI/UX & Product Design</option>
              <option value="FinTech">FinTech</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Location</label>
            <input
              type="text"
              value={preferences.preferred_location}
              onChange={(e) => setPreferences({ ...preferences, preferred_location: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. Bengaluru, Hyderabad, Remote"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Mode</label>
            <select
              value={preferences.work_mode}
              onChange={(e) => setPreferences({ ...preferences, work_mode: e.target.value })}
              className="input-field text-sm"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Expected Salary</label>
            <input
              type="text"
              value={preferences.expected_salary}
              onChange={(e) => setPreferences({ ...preferences, expected_salary: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g. ₹12,00,000 / yr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Internship Duration</label>
            <select
              value={preferences.internship_duration}
              onChange={(e) => setPreferences({ ...preferences, internship_duration: e.target.value })}
              className="input-field text-sm"
            >
              <option value="3 Months">3 Months</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Work Type</label>
            <select
              value={preferences.work_type}
              onChange={(e) => setPreferences({ ...preferences, work_type: e.target.value })}
              className="input-field text-sm"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. CAREER INTERESTS (Requirement 3) */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
            <Heart className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white font-heading">
            Career Interests & Passions
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Select all domains you are eager to build your career in. Contributes 10% to matching score.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {INTERESTS_OPTIONS.map((interest, idx) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleInterest(interest)}
                className={`py-2 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selected
                    ? 'bg-rose-950/50 border-rose-500/60 text-rose-300 shadow-sm shadow-rose-500/20'
                    : 'bg-slate-900/60 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {selected ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-slate-500" />}
                <span>{interest}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="text-xs text-slate-400">
          Ready to view your updated smart recommendations?
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/recommendations')}
            className="btn-secondary text-sm py-2 px-4"
          >
            <span>View Recommendations</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="btn-primary text-sm py-2 px-6 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
