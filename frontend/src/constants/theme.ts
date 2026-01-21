export const COLORS = {
  // Primary palette - guitar-themed
  primary: '#FF6B35',      // Warm orange - like guitar strings under stage lights
  primaryDark: '#E55A2B',
  primaryLight: '#FF8F66',
  
  // Secondary
  secondary: '#00D4AA',    // Teal accent
  secondaryDark: '#00B394',
  
  // Background - dark studio feel
  background: '#0A0A0F',
  backgroundLight: '#12121A',
  backgroundCard: '#1A1A24',
  backgroundElevated: '#22222E',
  
  // Surface
  surface: '#1E1E28',
  surfaceLight: '#2A2A36',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#6B6B7B',
  
  // Fretboard colors
  fretboard: '#2D1810',
  fret: '#C9A96B',
  string: '#D4D4D4',
  stringHighlight: '#FF6B35',
  
  // Status
  success: '#00D68F',
  warning: '#FFB547',
  error: '#FF4757',
  info: '#00C2FF',
  
  // Difficulty colors
  beginner: '#00D68F',
  intermediate: '#FFB547',
  advanced: '#FF6B35',
  pro: '#FF4757',
  
  // Domain colors
  timing: '#00C2FF',
  strumming: '#00D68F',
  picking: '#FFB547',
  fretting: '#FF6B35',
  chords: '#9D4EDD',
  scales: '#00D4AA',
  lead: '#FF4757',
  techniques: '#FF8F66',
  application: '#00B394',
  improvisation: '#E55A2B',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    hero: 36,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  round: 100,
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return COLORS.beginner;
    case 'intermediate': return COLORS.intermediate;
    case 'advanced': return COLORS.advanced;
    case 'pro': return COLORS.pro;
    default: return COLORS.textSecondary;
  }
};

export const getDomainColor = (domain: string) => {
  const domainLower = domain?.toLowerCase() || '';
  if (domainLower.includes('timing')) return COLORS.timing;
  if (domainLower.includes('strum')) return COLORS.strumming;
  if (domainLower.includes('pick')) return COLORS.picking;
  if (domainLower.includes('fret')) return COLORS.fretting;
  if (domainLower.includes('chord')) return COLORS.chords;
  if (domainLower.includes('scale')) return COLORS.scales;
  if (domainLower.includes('lead')) return COLORS.lead;
  if (domainLower.includes('tech')) return COLORS.techniques;
  if (domainLower.includes('music')) return COLORS.application;
  if (domainLower.includes('improv')) return COLORS.improvisation;
  return COLORS.primary;
};
