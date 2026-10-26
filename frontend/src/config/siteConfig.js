/**
 * CareerMatch AI - Centralized Frontend Site Configuration
 * 
 * Edit this file to manage site branding, navigation, theme presets,
 * matching algorithm weights, and feature toggles across the entire frontend.
 */

export const siteConfig = {
  brand: {
    name: 'CareerMatch',
    suffix: 'AI',
    tagline: 'Smart Recommendation & Career System',
    description: 'AI-Powered career discovery and recommendation engine matching candidates with ideal jobs and internships based on multi-factor skill & profile analytics.',
    version: '3.2.0',
    logoIcon: 'Sparkles',
    copyright: '© 2026 CareerMatch AI Technologies. All rights reserved.'
  },

  hero: {
    badge: '⚡ Powered by Multi-Factor AI Engine 3.0',
    titlePrefix: 'Accelerate Your Future with',
    typedPhrases: [
      'Your Dream Job',
      'Your Perfect Internship',
      'AI Resume Optimization',
      'Skill Gap Intelligence',
      'Precision Career Matches'
    ],
    subtitle: 'Stop endless job browsing. Our intelligent matching engine calculates precise compatibility scores across your skills, education, experience, and aspirations in real-time.',
    primaryCta: { label: 'Explore AI Matches', path: '/recommendations' },
    secondaryCta: { label: 'Analyze My Resume', path: '/resume-analyzer' }
  },

  themePresets: [
    {
      id: 'neon-space',
      name: 'Deep Space Neon',
      description: 'Default indigo & cyber cyan on obsidian dark',
      primary: '#6366f1',
      secondary: '#06b6d4',
      accent: '#8b5cf6',
      bgDark: '#050816',
      bgCard: 'rgba(12, 17, 35, 0.72)',
      previewGradient: 'from-indigo-600 via-indigo-500 to-cyan-400'
    },
    {
      id: 'cyber-emerald',
      name: 'Cyber Emerald',
      description: 'Vibrant emerald green & teal mint with dark slate',
      primary: '#10b981',
      secondary: '#14b8a6',
      accent: '#06b6d4',
      bgDark: '#04130d',
      bgCard: 'rgba(7, 26, 19, 0.75)',
      previewGradient: 'from-emerald-600 via-teal-500 to-cyan-400'
    },
    {
      id: 'sunset-crimson',
      name: 'Sunset Crimson',
      description: 'Warm rose, amber flame & coral violet',
      primary: '#f43f5e',
      secondary: '#f59e0b',
      accent: '#ec4899',
      bgDark: '#14060b',
      bgCard: 'rgba(30, 10, 18, 0.75)',
      previewGradient: 'from-rose-600 via-pink-500 to-amber-400'
    },
    {
      id: 'royal-violet',
      name: 'Royal Violet',
      description: 'Deep amethyst purple & electric magenta',
      primary: '#9333ea',
      secondary: '#c026d3',
      accent: '#6366f1',
      bgDark: '#0f051d',
      bgCard: 'rgba(23, 11, 41, 0.75)',
      previewGradient: 'from-purple-600 via-fuchsia-500 to-indigo-400'
    },
    {
      id: 'midnight-ocean',
      name: 'Midnight Ocean',
      description: 'Electrifying sapphire blue & sky azure',
      primary: '#2563eb',
      secondary: '#38bdf8',
      accent: '#4f46e5',
      bgDark: '#030c1d',
      bgCard: 'rgba(8, 21, 45, 0.75)',
      previewGradient: 'from-blue-600 via-sky-500 to-cyan-400'
    }
  ],

  algorithmWeights: [
    { factor: 'Skills Match', weight: 40, color: '#6366f1', description: 'Cosine & Jaccard overlap between candidate skills and job requirements' },
    { factor: 'Education Level', weight: 15, color: '#10b981', description: 'Degree level and discipline alignment' },
    { factor: 'Location Match', weight: 10, color: '#06b6d4', description: 'Geographic proximity or remote preference alignment' },
    { factor: 'Experience Match', weight: 10, color: '#f59e0b', description: 'Years of professional experience required vs candidate history' },
    { factor: 'Interests & Industry', weight: 10, color: '#8b5cf6', description: 'Domain focus and industry aspirations' },
    { factor: 'Target Role', weight: 10, color: '#ec4899', description: 'Direct match with candidate preferred role' },
    { factor: 'Work Mode', weight: 5, color: '#14b8a6', description: 'Remote, Hybrid, or On-site preference' }
  ],

  quickRoles: [
    'Software Engineer',
    'Frontend Developer',
    'Backend Engineer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'AI / ML Engineer',
    'Cloud Architect',
    'Cybersecurity Analyst',
    'UI/UX Designer'
  ],

  quickSkills: [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS',
    'PostgreSQL', 'Docker', 'AWS', 'Next.js', 'Git', 'GraphQL', 'MongoDB',
    'Kubernetes', 'FastAPI', 'Machine Learning', 'TensorFlow', 'REST API'
  ],

  featureFlags: {
    showChatbot: true,
    showParticleBackground: true,
    showConfetti: true,
    enableMockFallback: true,
    showAlgorithmWeightsBar: true,
    enableCustomizer: true
  }
};
