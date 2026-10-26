import React, { useState } from 'react';
import { useCustomizer } from '../context/CustomizerContext';
import { 
  Palette, 
  Sliders, 
  Type, 
  Sparkles, 
  Layers, 
  RotateCcw, 
  Download, 
  Check, 
  X, 
  Settings2, 
  Eye, 
  ShieldCheck, 
  Zap, 
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';

export default function FrontendCustomizerDrawer() {
  const { 
    settings, 
    isOpen, 
    setIsOpen, 
    updateSetting, 
    resetToDefaults, 
    currentTheme, 
    themePresets 
  } = useCustomizer();

  const [activeTab, setActiveTab] = useState('theme'); // 'theme', 'display', 'branding', 'features'
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleExportConfig = () => {
    const configString = JSON.stringify(settings, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careermatch-frontend-config.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Frontend Customizer"
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-indigo-500/40 shadow-xl shadow-indigo-950/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          <Palette className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
        </div>
        <span className="text-xs font-semibold tracking-wide font-heading">
          Customize UI
        </span>
      </button>

      {/* Slide-out Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
        />
      )}

      {/* Slide-out Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-slate-950/95 backdrop-blur-2xl border-l border-indigo-500/20 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Settings2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-white flex items-center gap-1.5">
                Frontend Studio <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">v3.2</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Manage themes, branding & layout live
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/20 px-3 pt-2">
          {[
            { id: 'theme', label: 'Theme & Colors', icon: Palette },
            { id: 'display', label: 'Layout & Glass', icon: Sliders },
            { id: 'branding', label: 'Branding & Text', icon: Type },
            { id: 'features', label: 'Mode & Toggles', icon: Zap },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-2 text-[11px] font-semibold flex flex-col items-center gap-1 border-b-2 transition-all ${
                  active
                    ? 'border-indigo-400 text-indigo-300 bg-indigo-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: THEME & COLOR PRESETS */}
          {activeTab === 'theme' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Preset Color Schemes
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  Click a theme to instantly transform the accent gradients, badges, and glows.
                </p>

                <div className="space-y-2.5">
                  {themePresets.map(theme => {
                    const isSelected = settings.activeThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => updateSetting('activeThemeId', theme.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/20'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${theme.previewGradient} shadow-sm border border-white/10 flex items-center justify-center`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-heading">
                              {theme.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {theme.description}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: theme.primary }} />
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: theme.secondary }} />
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: theme.accent }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Live Palette Preview
                </span>
                <div className="flex items-center gap-2">
                  <div className="btn-primary text-xs py-1.5 px-3">Primary Action</div>
                  <div className="btn-secondary text-xs py-1.5 px-3">Secondary</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="match-badge match-badge-high text-xs">96% Match</span>
                  <span className="badge-status badge-Interview">Interview Scheduled</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISPLAY, GLASS & DENSITY */}
          {activeTab === 'display' && (
            <div className="space-y-6 animate-fade-in">
              {/* Glassmorphism Blur */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Glassmorphism Frost Level
                </label>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Adjust the backdrop-filter blur intensity on cards and navigation.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'subtle', label: 'Subtle', desc: '8px blur' },
                    { id: 'standard', label: 'Standard', desc: '20px blur' },
                    { id: 'ultra', label: 'Ultra Frost', desc: '36px blur' },
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => updateSetting('glassLevel', lvl.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        settings.glassLevel === lvl.id
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{lvl.label}</div>
                      <div className="text-[10px] opacity-60">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Layout Density
                </label>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Card padding and gap proportions.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'compact', label: 'Compact', desc: 'Tight spacing' },
                    { id: 'comfortable', label: 'Comfortable', desc: 'Balanced' },
                    { id: 'spacious', label: 'Spacious', desc: 'Wide air' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => updateSetting('density', item.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        settings.density === item.id
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] opacity-60">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Scale */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Typography Base Scale
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: 'sm', label: 'Compact (15px)' },
                    { id: 'md', label: 'Standard (16px)' },
                    { id: 'lg', label: 'Large (17px)' },
                  ].map(scale => (
                    <button
                      key={scale.id}
                      onClick={() => updateSetting('fontScale', scale.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        settings.fontScale === scale.id
                          ? 'bg-indigo-950/50 border-indigo-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {scale.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANDING & HEADLINE CUSTOMIZATION */}
          {activeTab === 'branding' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Brand Name & Suffix
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Name</span>
                    <input
                      type="text"
                      value={settings.brandName}
                      onChange={e => updateSetting('brandName', e.target.value)}
                      className="input-field text-xs py-2"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Suffix / Badge</span>
                    <input
                      type="text"
                      value={settings.brandSuffix}
                      onChange={e => updateSetting('brandSuffix', e.target.value)}
                      className="input-field text-xs py-2 text-cyan-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={e => updateSetting('tagline', e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Hero Tagline (Typing Headline)
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={e => updateSetting('heroTitle', e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={e => updateSetting('heroSubtitle', e.target.value)}
                  className="input-field text-xs py-2"
                />
              </div>
            </div>
          )}

          {/* TAB 4: DEMO MODE & FEATURE TOGGLES */}
          {activeTab === 'features' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* DEMO MODE HIGHLIGHT */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white font-heading">
                      Interactive Demo Mode
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.demoMode}
                      onChange={e => updateSetting('demoMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  When enabled, all pages showcase rich interactive demo datasets (jobs, internships, pipeline applications, skill gaps) without requiring backend database initialization.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{settings.demoMode ? 'Demo Mode Active (Zero network latency)' : 'Live Mode (API Requests Direct)'}</span>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Visual Features
                </h4>

                {[
                  {
                    key: 'showChatbot',
                    label: 'CareerMate AI Floating Chatbot',
                    desc: 'Floating AI assistant in the lower right corner'
                  },
                  {
                    key: 'showParticles',
                    label: 'Dynamic Mesh Background',
                    desc: 'Smooth animated gradient mesh drifts in background'
                  },
                  {
                    key: 'showConfetti',
                    label: 'Celebration Confetti',
                    desc: 'Particle bursts on resume scan and job application'
                  }
                ].map(item => (
                  <div 
                    key={item.key} 
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={e => updateSetting(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-2">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleExportConfig}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Exported JSON!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export Settings</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
