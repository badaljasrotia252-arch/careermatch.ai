import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  BookmarkCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  FileText, 
  Building2, 
  CheckCircle2, 
  X, 
  Save, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { mockApplications } from '../data/mockData';

const STATUS_OPTIONS = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected'
];

export default function ApplicationTrackerPage() {
  const { showToast } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Drawer state for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [formData, setFormData] = useState({
    opportunity_type: 'job',
    opportunity_id: 1,
    company_name: '',
    position_title: '',
    status: 'Applied',
    interview_date: '',
    notes: ''
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.getApplications();
      setApplications(res.applications || []);
    } catch (e) {
      console.warn('Failed to load applications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenAddModal = () => {
    setEditingApp(null);
    setFormData({
      opportunity_type: 'job',
      opportunity_id: 1,
      company_name: '',
      position_title: '',
      status: 'Applied',
      interview_date: '',
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      opportunity_type: app.opportunity_type || 'job',
      opportunity_id: app.opportunity_id,
      company_name: app.company_name || '',
      position_title: app.position_title || '',
      status: app.status || 'Applied',
      interview_date: app.interview_date || '',
      notes: app.notes || ''
    });
    setShowModal(true);
  };

  const handleSaveApplication = async (e) => {
    e.preventDefault();
    try {
      if (editingApp) {
        // Update
        await api.updateApplication(editingApp.application_id, {
          status: formData.status,
          interview_date: formData.interview_date || null,
          notes: formData.notes
        });
        showToast('Application updated successfully!');
      } else {
        // Add new
        await api.addApplication({
          opportunity_type: formData.opportunity_type,
          opportunity_id: formData.opportunity_id || 1,
          status: formData.status,
          interview_date: formData.interview_date || null,
          notes: formData.notes
        });
        showToast('Application tracked successfully!');
      }
      setShowModal(false);
      fetchApplications();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to remove this tracked application?')) return;
    try {
      await api.deleteApplication(appId);
      showToast('Application removed from tracker.');
      fetchApplications();
    } catch (err) {
      showToast('Failed to delete application', 'error');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.updateApplication(appId, { status: newStatus });
      setApplications(prev => prev.map(a => a.application_id === appId ? { ...a, status: newStatus } : a));
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const formatted = (status || 'Applied').replace(' ', '-');
    return `badge-status badge-${formatted}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recruitment Pipeline & Status Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your submissions, track interview dates, add interview notes, and monitor your placement conversion.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-primary text-xs sm:text-sm py-2 px-4 flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Application</span>
        </button>
      </div>

      {/* Main Applications Table (Requirement 10) */}
      <div className="glass-panel rounded-2xl overflow-hidden border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            
            {/* Table Header */}
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-heading">
              <tr>
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-6">Position</th>
                <th className="py-4 px-6">Applied Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Interview Date</th>
                <th className="py-4 px-6">Notes</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    Loading your applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <p className="font-semibold text-white mb-1">No tracked applications yet</p>
                    <p className="text-xs">Apply to jobs or internships from the Explore tabs to auto-track them here!</p>
                    <button
                      type="button"
                      onClick={() => {
                        setApplications(mockApplications);
                        localStorage.setItem('careermatch_demo_apps', JSON.stringify(mockApplications));
                        showToast('Sample applications loaded into tracker!');
                      }}
                      className="mt-3 btn-secondary text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Populate Sample Applications</span>
                    </button>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Company */}
                    <td className="py-4 px-6 font-semibold text-white flex items-center gap-2.5">
                      <img
                        src={app.company_logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150'}
                        alt={app.company_name}
                        className="w-7 h-7 rounded-lg object-cover bg-slate-800 border border-slate-700"
                      />
                      <span>{app.company_name || 'Tech Company'}</span>
                    </td>

                    {/* Position */}
                    <td className="py-4 px-6 font-medium text-slate-200">
                      <div>{app.position_title || 'Software Opportunity'}</div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {app.opportunity_type}
                      </span>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer ${getStatusBadge(app.status)}`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-white font-normal">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Interview Date */}
                    <td className="py-4 px-6 text-xs text-slate-300">
                      {app.interview_date ? (
                        <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{app.interview_date}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">None scheduled</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-4 px-6 text-xs text-slate-400 max-w-xs truncate">
                      {app.notes || <span className="text-slate-600">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(app)}
                          title="Edit application details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app.application_id)}
                          title="Delete application"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Add / Edit Application Modal (Requirement 10) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div 
            className="modal-content max-w-lg p-6 rounded-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white font-heading">
                {editingApp ? 'Update Tracked Application' : 'Add Custom Opportunity'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveApplication} className="space-y-4">
              
              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Current Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field text-sm"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Interview Date */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Interview Date & Time (Optional)
                </label>
                <input
                  type="text"
                  value={formData.interview_date}
                  onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                  placeholder="e.g. 2026-10-24 14:00"
                  className="input-field text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Notes & Preparation Tips
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Round 2 Technical: Practice system design, DSA, and LeetCode medium questions."
                  className="input-field text-sm resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
