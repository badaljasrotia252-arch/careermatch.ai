import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomizerProvider, useCustomizer } from './context/CustomizerContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbotDrawer from './components/AIChatbotDrawer';
import AnimatedBackground from './components/AnimatedBackground';
import FrontendCustomizerDrawer from './components/FrontendCustomizerDrawer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import RecommendationsPage from './pages/RecommendationsPage';
import JobSearchPage from './pages/JobSearchPage';
import InternshipSearchPage from './pages/InternshipSearchPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import SkillGapPage from './pages/SkillGapPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <span className="text-sm font-medium">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppShell() {
  const { settings, currentTheme } = useCustomizer();

  return (
    <Router>
      <div 
        className="flex flex-col min-h-screen text-slate-100 font-sans selection:bg-indigo-500 selection:text-white" 
        style={{ background: currentTheme?.bgDark || '#050816', position: 'relative' }}
      >
        {settings.showParticles && <AnimatedBackground />}
        
        <div style={{ position: 'relative', zIndex: 2 }} className="flex flex-col min-h-screen">
          <Navbar />
        
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobSearchPage />} />
              <Route path="/internships" element={<InternshipSearchPage />} />
              <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
              <Route path="/skills" element={<SkillGapPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Authenticated User Routes */}
              <Route 
                path="/recommendations" 
                element={
                  <ProtectedRoute>
                    <RecommendationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileSetupPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tracker" 
                element={
                  <ProtectedRoute>
                    <ApplicationTrackerPage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Route */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Global Floating CareerMate AI Chatbot */}
          {settings.showChatbot && <AIChatbotDrawer />}

          {/* Frontend Customizer & Management Studio */}
          <FrontendCustomizerDrawer />
        </div>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <CustomizerProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </CustomizerProvider>
  );
}
