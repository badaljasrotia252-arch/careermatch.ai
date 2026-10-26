import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCustomizer } from '../context/CustomizerContext';
import { 
  Briefcase, 
  Compass, 
  Sparkles, 
  FileText, 
  BarChart3, 
  LayoutDashboard, 
  BookmarkCheck, 
  ShieldAlert, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Info,
  Palette,
  SlidersHorizontal
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings, toggleCustomizer } = useCustomizer();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Internships', path: '/internships', icon: BookmarkCheck },
    { name: 'AI Matches', path: '/recommendations', icon: Sparkles, badge: 'AI' },
    { name: 'Resume ATS', path: '/resume-analyzer', icon: FileText },
    { name: 'Skill Gap', path: '/skills', icon: BarChart3 },
    ...(isAuthenticated ? [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Tracker', path: '/tracker', icon: BookmarkCheck }
    ] : []),
    { name: 'About', path: '/about', icon: Info }
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-tight text-white flex items-center gap-1.5">
              {settings.brandName || 'CareerMatch'}{' '}
              <span className="text-cyan-400">{settings.brandSuffix || 'AI'}</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wide">
              {settings.tagline || 'Smart Recommendation System'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 text-decoration-none ${
                  active
                    ? 'text-white bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Action / Auth & Customizer Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          
          {/* Quick Demo Mode Badge */}
          {settings.demoMode && (
            <div 
              title="Interactive Demo Mode Active" 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-[11px] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Demo Mode</span>
            </div>
          )}

          {/* Customize UI Trigger */}
          <button
            onClick={toggleCustomizer}
            title="Open Frontend Customization Studio"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-cyan-400 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden 2xl:inline">Theme</span>
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-decoration-none ${
                isActive('/admin')
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-purple-950/60 text-purple-300 border border-purple-800/50 hover:bg-purple-900/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Panel</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all text-decoration-none text-slate-200 text-sm"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="font-medium max-w-[120px] truncate">{user?.name}</span>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-700/60 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors text-decoration-none"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-xs py-1.5 px-3.5 text-decoration-none"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={toggleCustomizer}
            className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 bg-slate-800/60 border border-slate-700/60"
            title="Customize UI"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
          </button>

          {isAuthenticated && (
            <Link to="/profile" className="text-slate-300 p-1.5">
              <User className="w-5 h-5 text-indigo-400" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700/60"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-1 pb-3 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between text-decoration-none ${
                  active ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="bg-indigo-500 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 text-purple-300 bg-purple-950/40 text-decoration-none mt-1"
            >
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <div className="pt-3 mt-2 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-left text-sm font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user?.name})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-sm text-center py-2 text-decoration-none"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-sm text-center py-2 text-decoration-none"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
