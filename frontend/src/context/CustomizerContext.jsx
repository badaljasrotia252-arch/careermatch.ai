import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';

const CustomizerContext = createContext(null);

const STORAGE_KEY = 'careermatch_customizer_settings';

export function CustomizerProvider({ children }) {
  // Load saved state or default
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...getDefaultSettings(), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load customizer settings from localStorage');
    }
    return getDefaultSettings();
  });

  const [isOpen, setIsOpen] = useState(false);

  function getDefaultSettings() {
    return {
      activeThemeId: 'neon-space',
      density: 'comfortable', // 'compact', 'comfortable', 'spacious'
      glassLevel: 'standard', // 'subtle', 'standard', 'ultra'
      fontScale: 'md', // 'sm', 'md', 'lg'
      brandName: siteConfig.brand.name,
      brandSuffix: siteConfig.brand.suffix,
      tagline: siteConfig.brand.tagline,
      heroTitle: siteConfig.hero.typedPhrases[0],
      heroSubtitle: siteConfig.hero.subtitle,
      showChatbot: siteConfig.featureFlags.showChatbot,
      showParticles: siteConfig.featureFlags.showParticleBackground,
      showConfetti: siteConfig.featureFlags.showConfetti,
      demoMode: true, // Enabled by default for rich interactive preview even when backend is offline
    };
  }

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to persist customizer settings');
    }

    // Apply CSS variables to root document
    applyThemeVariables(settings.activeThemeId, settings.glassLevel, settings.density, settings.fontScale);
  }, [settings]);

  const applyThemeVariables = (themeId, glass, density, fontScale) => {
    const root = document.documentElement;
    const theme = siteConfig.themePresets.find(t => t.id === themeId) || siteConfig.themePresets[0];

    // Colors
    root.style.setProperty('--accent-indigo', theme.primary);
    root.style.setProperty('--accent-cyan', theme.secondary);
    root.style.setProperty('--accent-purple', theme.accent);
    root.style.setProperty('--bg-primary', theme.bgDark);
    root.style.setProperty('--bg-card', theme.bgCard);
    root.style.setProperty(
      '--gradient-brand',
      `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.accent} 100%)`
    );

    // Glassmorphism Blur
    const blurMap = {
      subtle: '8px',
      standard: '20px',
      ultra: '36px'
    };
    root.style.setProperty('--glass-blur', blurMap[glass] || '20px');

    // Font Scale
    const fontMap = {
      sm: '15px',
      md: '16px',
      lg: '17px'
    };
    root.style.setProperty('--base-font-size', fontMap[fontScale] || '16px');

    // UI Density padding factor
    const densityMap = {
      compact: '0.8',
      comfortable: '1',
      spacious: '1.25'
    };
    root.style.setProperty('--density-factor', densityMap[density] || '1');
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateMultipleSettings = (newValues) => {
    setSettings(prev => ({
      ...prev,
      ...newValues
    }));
  };

  const resetToDefaults = () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    localStorage.removeItem(STORAGE_KEY);
  };

  const currentTheme = siteConfig.themePresets.find(t => t.id === settings.activeThemeId) || siteConfig.themePresets[0];

  return (
    <CustomizerContext.Provider
      value={{
        settings,
        isOpen,
        setIsOpen,
        toggleCustomizer: () => setIsOpen(!isOpen),
        updateSetting,
        updateMultipleSettings,
        resetToDefaults,
        currentTheme,
        themePresets: siteConfig.themePresets
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
}

export function useCustomizer() {
  const context = useContext(CustomizerContext);
  if (!context) {
    throw new Error('useCustomizer must be used within a CustomizerProvider');
  }
  return context;
}
