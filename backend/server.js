require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Middlewares
const { authenticateToken, optionalAuth, requireAdmin } = require('./middleware/auth');
const upload = require('./middleware/upload');

// Controllers
const authController = require('./controllers/authController');
const profileController = require('./controllers/profileController');
const jobsController = require('./controllers/jobsController');
const internshipsController = require('./controllers/internshipsController');
const recommendationsController = require('./controllers/recommendationsController');
const resumeController = require('./controllers/resumeController');
const applicationsController = require('./controllers/applicationsController');
const savedJobsController = require('./controllers/savedJobsController');
const skillGapController = require('./controllers/skillGapController');
const chatbotController = require('./controllers/chatbotController');
const adminController = require('./controllers/adminController');

const app = express();
const PORT = process.env.PORT || 5000;

// Express configurations
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1. Health check & API info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CareerMatch AI - Job & Internship Recommendation Smart System',
    timestamp: new Date().toISOString()
  });
});

// 2. Authentication Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authenticateToken, authController.getMe);

// 3. Profile Routes
app.get('/api/profile', authenticateToken, profileController.getProfile);
app.put('/api/profile', authenticateToken, profileController.updateProfile);
app.get('/api/skills', profileController.getAllSkillsTaxonomy);

// 4. Jobs Routes
app.get('/api/jobs', optionalAuth, jobsController.getJobs);
app.get('/api/jobs/:id', optionalAuth, jobsController.getJobDetails);

// 5. Internships Routes
app.get('/api/internships', optionalAuth, internshipsController.getInternships);
app.get('/api/internships/:id', optionalAuth, internshipsController.getInternshipDetails);

// 6. Recommendation Routes (Core)
app.get('/api/recommendations', authenticateToken, recommendationsController.getRecommendations);

// 7. Resume Analyzer Routes
app.post('/api/resume/analyze', optionalAuth, upload.single('resume'), resumeController.analyzeResume);
app.get('/api/resume/download-improved', optionalAuth, resumeController.downloadImprovedResume);

// 8. Application Tracker Routes
app.get('/api/applications', authenticateToken, applicationsController.getApplications);
app.post('/api/applications', authenticateToken, applicationsController.addApplication);
app.put('/api/applications/:id', authenticateToken, applicationsController.updateApplication);
app.delete('/api/applications/:id', authenticateToken, applicationsController.deleteApplication);

// 9. Saved Opportunities Routes
app.get('/api/saved', authenticateToken, savedJobsController.getSavedOpportunities);
app.post('/api/saved/toggle', authenticateToken, savedJobsController.toggleSaveOpportunity);

// 10. Skill Gap Analysis Routes
app.get('/api/skill-gap', optionalAuth, skillGapController.getSkillGap);

// 11. AI Career Assistant (CareerMate AI)
app.post('/api/chat', optionalAuth, chatbotController.chatWithCareerMate);

// 12. Admin Management & Analytics Routes
app.get('/api/admin/analytics', authenticateToken, requireAdmin, adminController.getAnalytics);

// Admin - Users
app.get('/api/admin/users', authenticateToken, requireAdmin, adminController.getUsers);
app.put('/api/admin/users/:id', authenticateToken, requireAdmin, adminController.updateUser);
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, adminController.deleteUser);

// Admin - Jobs
app.post('/api/admin/jobs', authenticateToken, requireAdmin, adminController.createJob);
app.put('/api/admin/jobs/:id', authenticateToken, requireAdmin, adminController.updateJob);
app.delete('/api/admin/jobs/:id', authenticateToken, requireAdmin, adminController.deleteJob);

// Admin - Internships
app.post('/api/admin/internships', authenticateToken, requireAdmin, adminController.createInternship);
app.put('/api/admin/internships/:id', authenticateToken, requireAdmin, adminController.updateInternship);
app.delete('/api/admin/internships/:id', authenticateToken, requireAdmin, adminController.deleteInternship);

// Admin - Companies
app.get('/api/admin/companies', authenticateToken, requireAdmin, adminController.getCompanies);
app.post('/api/admin/companies', authenticateToken, requireAdmin, adminController.createCompany);
app.put('/api/admin/companies/:id', authenticateToken, requireAdmin, adminController.updateCompany);
app.delete('/api/admin/companies/:id', authenticateToken, requireAdmin, adminController.deleteCompany);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CareerMatch AI Backend Server Running on Port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
