export const COLORS = {
  // =============================================
  // GUITAR GUIDE PRO - ORGANIC COLOR SYSTEM
  // Premium, musical, wood-inspired palette
  // =============================================
  
  // Primary palette - Warm amber (musical, wood-like)
  primary: '#D4A574',        // Warm amber - like acoustic guitar wood
  primaryDark: '#B8956A',    // Darker amber
  primaryLight: '#E8C49A',   // Light amber glow
  
  // Secondary - Deep teal/olive (organic, natural)
  secondary: '#5A8A7A',      // Deep teal-olive
  secondaryDark: '#3D5A50',  // Forest green-teal
  secondaryLight: '#7AAA9A', // Light teal
  
  // Background - Warm dark gray (NOT pure black)
  background: '#1A1A1F',     // Deep charcoal with warmth
  backgroundLight: '#202025', // Slightly lighter charcoal
  backgroundCard: '#252530',  // Card surfaces
  backgroundElevated: '#2D2D38', // Elevated elements
  
  // Surface - Warm grays
  surface: '#28282F',        // Surface base
  surfaceLight: '#363640',   // Light surface
  
  // Text - Warm whites
  text: '#F5F5F0',           // Warm white (not pure white)
  textSecondary: '#A8A8B0',  // Muted text
  textMuted: '#6B6B75',      // Very muted
  
  // Fretboard colors - Natural wood tones
  fretboard: '#2D1810',      // Dark rosewood
  fret: '#C9A96B',           // Brass frets
  string: '#D4D4D4',         // Steel strings
  stringHighlight: '#D4A574', // Warm amber highlight
  
  // Playback states (CRITICAL - no color conflicts)
  activeNote: '#D4A574',     // Warm amber = PLAYING NOW
  referenceNote: '#7A8A9A',  // Soft blue-gray = reference
  completedNote: '#5A7A6A',  // Muted green = DONE (never for active)
  rootNote: '#C4785A',       // Warm rust-orange for roots
  
  // Status - Refined, less neon
  success: '#5A8A6A',        // Muted sage green
  warning: '#C9A060',        // Warm gold
  error: '#B85A5A',          // Muted red
  info: '#6A8A9A',           // Soft blue-gray
  
  // Difficulty colors - Organic progression
  beginner: '#6A9A7A',       // Sage green
  intermediate: '#C9A060',   // Warm gold
  advanced: '#C4785A',       // Rust orange
  pro: '#9A5A6A',            // Deep mauve
  
  // Domain colors - Musical, harmonious
  timing: '#6A8A9A',         // Soft blue
  strumming: '#6A9A7A',      // Sage green
  picking: '#C9A060',        // Warm gold
  fretting: '#D4A574',       // Amber
  chords: '#8A7A9A',         // Soft purple
  scales: '#5A8A7A',         // Teal-olive
  lead: '#C4785A',           // Rust orange
  techniques: '#B89A7A',     // Warm tan
  application: '#5A7A6A',    // Forest green
  improvisation: '#9A7A6A',  // Warm mauve
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
