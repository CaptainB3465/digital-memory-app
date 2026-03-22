import { useState, useEffect } from 'react';

const SETTINGS_KEY = 'digital_memory_settings_v5';

const DEFAULT_SETTINGS = {
  account: {
    name: 'Alex Rivers',
    username: 'arivers',
    email: 'alex@memory.io',
    bio: 'Preserving the small moments that make a big life.',
    avatar: null
  },
  appearance: {
    theme: 'light', // light, dark, system
    accentColor: '#8b5cf6',
    layout: 'timeline', // grid, list, card
    fontSize: 'medium', // small, medium, large
    fontStyle: 'sans' // sans, serif
  },
  privacy: {
    lockMemories: false,
    privateMode: true,
    twoFactor: false,
    sessions: [
      { id: 1, device: 'MacBook Pro', location: 'San Francisco, CA', active: true },
      { id: 2, device: 'iPhone 15', location: 'London, UK', active: false }
    ]
  },
  backup: {
    autoBackup: true,
    cloudSync: true,
    lastBackup: '2026-03-22T08:00:00Z'
  },
  preferences: {
    defaultType: 'photo',
    autoTagging: true,
    reminders: true,
    sorting: 'date-desc',
    moods: ['Happy', 'Thoughtful', 'Adventurous', 'Peaceful']
  },
  notifications: {
    reminders: true,
    anniversaries: true,
    summaries: 'weekly',
    emailPrefs: true
  },
  storage: {
    used: 1.2, // GB
    total: 5.0, // GB
    mediaOptimization: true
  },
  ai: {
    summaries: true,
    smartSearch: true,
    highlights: true,
    storyGenerator: true
  },
  localization: {
    language: 'en-US',
    dateFormat: 'MMMM do, yyyy',
    timezone: 'UTC-7'
  },
  advanced: {
    beta: false,
    debug: false,
    integrations: ['Google Photos', 'Dropbox']
  },
  legacy: {
    enabled: false,
    beneficiary: '',
    sharingTrigger: 'inactivity', // inactivity, manual
    archiveMode: 'family-only'
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    
    // Apply appearance settings to document
    if (settings.appearance.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply font variables
    document.documentElement.style.setProperty('--font-base-size', 
      settings.appearance.fontSize === 'small' ? '14px' : 
      settings.appearance.fontSize === 'large' ? '18px' : '16px'
    );

    // Apply accent color to root
    if (settings.appearance.accentColor) {
      document.documentElement.style.setProperty('--color-primary', settings.appearance.accentColor);
    }
  }, [settings]);

  const updateSection = (section, data) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSection,
    resetToDefaults
  };
};
