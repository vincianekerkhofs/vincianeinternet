// Strum pattern definitions for GUITAR GUIDE
export interface StrumPattern {
  id: string;
  name: string;
  style: string;
  count: string[];       // ["1", "&", "2", "&", "3", "&", "4", "&"]
  pattern: string[];     // ["↓", "", "↓", "↑", "", "↑", "↓", "↑"]
  defaultTempo: number;
}

export const STRUM_PATTERNS: Record<string, StrumPattern> = {
  pop_basic: {
    id: 'pop_basic',
    name: 'Pop básico',
    style: 'Pop/Rock',
    count: ['1', '&', '2', '&', '3', '&', '4', '&'],
    pattern: ['↓', '', '↓', '↑', '', '↑', '↓', '↑'],
    defaultTempo: 80,
  },
  rock_8ths: {
    id: 'rock_8ths',
    name: 'Rock corcheas',
    style: 'Rock',
    count: ['1', '&', '2', '&', '3', '&', '4', '&'],
    pattern: ['↓', '↓', '↓', '↓', '↓', '↓', '↓', '↓'],
    defaultTempo: 90,
  },
  reggae_skank: {
    id: 'reggae_skank',
    name: 'Reggae skank',
    style: 'Reggae',
    count: ['1', '&', '2', '&', '3', '&', '4', '&'],
    pattern: ['', '', '↓', '', '', '', '↓', ''],
    defaultTempo: 70,
  },
  folk_down: {
    id: 'folk_down',
    name: 'Folk básico',
    style: 'Folk',
    count: ['1', '&', '2', '&', '3', '&', '4', '&'],
    pattern: ['↓', '', '↓', '', '↓', '', '↓', ''],
    defaultTempo: 75,
  },
  ballad: {
    id: 'ballad',
    name: 'Balada',
    style: 'Balada',
    count: ['1', '&', '2', '&', '3', '&', '4', '&'],
    pattern: ['↓', '', '', '↑', '↓', '↑', '', '↑'],
    defaultTempo: 65,
  },
};

// Helper to get strum pattern by style
export const getStrumPatternByStyle = (style: string): StrumPattern | undefined => {
  const styleLower = style.toLowerCase();
  if (styleLower.includes('reggae')) return STRUM_PATTERNS.reggae_skank;
  if (styleLower.includes('rock')) return STRUM_PATTERNS.rock_8ths;
  if (styleLower.includes('folk')) return STRUM_PATTERNS.folk_down;
  if (styleLower.includes('balada') || styleLower.includes('ballad')) return STRUM_PATTERNS.ballad;
  return STRUM_PATTERNS.pop_basic;
};
