import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, Phone, MapPin, GraduationCap, Building2, Calendar, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register, showToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    education_level: 'B.Tech / B.E. (Computer Science)',
    college: '',
    graduation_year: '2026',
    user_type: 'Student'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      // Redirect to Profile Setup page as required by Requirement 2
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl border-slate-800 animate-fade-in relative">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Create Your Account</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join CareerMatch AI to discover smart personalized jobs and internships
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User Type Selection (Student / Fresher / Experienced) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              I Am A:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Student', 'Fresher', 'Experienced Professional'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, user_type: type }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    formData.user_type === type
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Verma"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, India"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Education Level
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="input-field pl-10 text-sm"
                >
                  <option value="B.Tech / B.E. (Computer Science)">B.Tech / B.E. (Computer Science)</option>
                  <option value="B.Tech / B.E. (IT / AI / Data Science)">B.Tech / B.E. (IT / AI / Data Science)</option>
                  <option value="B.Tech / B.E. (ECE / EEE)">B.Tech / B.E. (ECE / EEE)</option>
                  <option value="BCA / MCA">BCA / MCA</option>
                  <option value="B.Sc / M.Sc (Computer Science / IT)">B.Sc / M.Sc (Computer Science / IT)</option>
                  <option value="Master of Technology (M.Tech / M.E.)">Master of Technology (M.Tech / M.E.)</option>
                  <option value="MBA / Business Management">MBA / Business Management</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                </select>
              </div>
            </div>

            {/* College / University */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                College / University
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. National Institute of Technology"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Graduation Year
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleChange}
                  className="input-field pl-10 text-sm"
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm mt-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Profile Setup'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
