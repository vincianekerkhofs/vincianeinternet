// Didactic Content for GUITAR GUIDE
// Educational introductions, style guides, and original songs

export interface DidacticIntro {
  id: string;
  title: string;
  lines: string[];  // Max 6-8 short lines
  icon: string;     // Ionicons name
}

export interface StyleGuide {
  id: string;
  name: string;
  icon: string;
  whatDefinesIt: string;
  focusOn: string[];
  dontOverthink: string;
  keyTechniques: string[];
}

export interface OriginalSong {
  id: string;
  title: string;
  style: string;
  bars: number;
  objective: string;
  progression: string;
  strumPattern: string;
  tempo: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
}

// ===========================================
// DIDACTIC INTROS - Before each major section
// ===========================================

export const DIDACTIC_INTROS: Record<string, DidacticIntro> = {
  warmup: {
    id: 'warmup',
    title: 'Calentamiento',
    icon: 'fitness-outline',
    lines: [
      'Antes de tocar, preparamos los dedos.',
      'El calentamiento previene lesiones.',
      'Aumenta la flexibilidad y velocidad.',
      'Solo 5 minutos hacen la diferencia.',
      'Empieza lento, luego acelera.',
      '¡Tu técnica mejorará cada día!',
    ],
  },
  technique: {
    id: 'technique',
    title: 'Técnica',
    icon: 'hand-left-outline',
    lines: [
      'La técnica es tu base musical.',
      'Dedos precisos = sonido limpio.',
      'Practica cada ejercicio lentamente.',
      'La velocidad viene con el tiempo.',
      'Enfócate en la posición de la mano.',
      'Cada nota debe sonar clara.',
    ],
  },
  chords: {
    id: 'chords',
    title: 'Acordes',
    icon: 'grid-outline',
    lines: [
      'Los acordes son la base de las canciones.',
      'Empezamos con formas abiertas.',
      'Presiona justo detrás del traste.',
      'Todas las cuerdas deben sonar limpias.',
      'Practica cambios lentos primero.',
      '¡Pronto tocarás tus canciones favoritas!',
    ],
  },
  scales: {
    id: 'scales',
    title: 'Escalas',
    icon: 'musical-notes-outline',
    lines: [
      'Las escalas son el alfabeto musical.',
      'Te permiten improvisar y crear solos.',
      'Empezamos con la pentatónica menor.',
      'Memoriza las posiciones gradualmente.',
      'Conecta las notas, no solo las toques.',
      '¡Abre un mundo de posibilidades!',
    ],
  },
  styles: {
    id: 'styles',
    title: 'Estilos Musicales',
    icon: 'radio-outline',
    lines: [
      'Cada estilo tiene su personalidad.',
      'El ritmo es lo que define el género.',
      'Escucha mucha música del estilo.',
      'Imita antes de improvisar.',
      'Siente el groove, no solo lo toques.',
      '¡Encuentra tu estilo favorito!',
    ],
  },
  solos: {
    id: 'solos',
    title: 'Solos y Composición',
    icon: 'rocket-outline',
    lines: [
      'Es hora de recorrer todo el mástil.',
      'Conectaremos escalas y posiciones.',
      'Un solo cuenta una historia musical.',
      'No se trata de velocidad, sino de expresión.',
      'Aprenderás a moverte con fluidez.',
      '¡Prepárate para crear tu propia música!',
    ],
  },
};

// ===========================================
// STYLE GUIDES - What defines each style
// ===========================================

export const STYLE_GUIDES: Record<string, StyleGuide> = {
  rock: {
    id: 'rock',
    name: 'Rock',
    icon: 'flash-outline',
    whatDefinesIt: 'Energía, power chords y actitud. El rock es directo y poderoso.',
    focusOn: [
      'Power chords con quinta',
      'Rasgueo fuerte y constante',
      'Palm mute en las partes rítmicas',
      'Acentos en 2 y 4',
    ],
    dontOverthink: 'No te preocupes por ser perfecto. El rock es actitud.',
    keyTechniques: ['Power chords', 'Palm mute', 'Bends'],
  },
  blues: {
    id: 'blues',
    name: 'Blues',
    icon: 'moon-outline',
    whatDefinesIt: 'Sentimiento y expresión. El blues viene del corazón.',
    focusOn: [
      'Bends expresivos',
      'Vibrato en notas largas',
      'Escala pentatónica con blue notes',
      'Deja respirar las frases',
    ],
    dontOverthink: 'No llenes cada espacio. Los silencios hablan.',
    keyTechniques: ['Bends', 'Vibrato', 'Shuffle rhythm'],
  },
  reggae: {
    id: 'reggae',
    name: 'Reggae',
    icon: 'sunny-outline',
    whatDefinesIt: 'Ritmo relajado con acentos en el offbeat. Menos es más.',
    focusOn: [
      'Golpes cortos (staccato)',
      'Acentos en 2 y 4',
      'Mutear rápido después del rasgueo',
      'Mantén el pulso constante',
    ],
    dontOverthink: 'No toques de más. El espacio es parte del ritmo.',
    keyTechniques: ['Staccato', 'Muting', 'Offbeat strumming'],
  },
  metal: {
    id: 'metal',
    name: 'Metal',
    icon: 'skull-outline',
    whatDefinesIt: 'Precisión, potencia y velocidad controlada.',
    focusOn: [
      'Palm mute apretado',
      'Púa alternada precisa',
      'Power chords con distorsión',
      'Sincronización perfecta',
    ],
    dontOverthink: 'No corras antes de caminar. Precisión > Velocidad.',
    keyTechniques: ['Palm mute', 'Alternate picking', 'Gallop rhythm'],
  },
  punk: {
    id: 'punk',
    name: 'Punk',
    icon: 'bolt-outline',
    whatDefinesIt: 'Energía cruda, velocidad y actitud rebelde. Simple pero intenso.',
    focusOn: [
      'Downstrokes constantes',
      'Power chords rápidos',
      'Progresiones I-IV-V',
      'Energía sin parar',
    ],
    dontOverthink: 'No busques perfección. El punk es actitud pura.',
    keyTechniques: ['Fast downstrokes', 'Power chords', 'Constant energy'],
  },
  bossanova: {
    id: 'bossanova',
    name: 'Bossa Nova',
    icon: 'leaf-outline',
    whatDefinesIt: 'Elegancia brasileña. Suave, sincopado y sofisticado.',
    focusOn: [
      'Patrón de bajo con pulgar',
      'Acordes con extensiones (7, 9)',
      'Ritmo sincopado suave',
      'Dinámica delicada',
    ],
    dontOverthink: 'No fuerces el ritmo. Deja que fluya naturalmente.',
    keyTechniques: ['Fingerpicking', 'Syncopation', 'Chord extensions'],
  },
  funk: {
    id: 'funk',
    name: 'Funk',
    icon: 'pulse-outline',
    whatDefinesIt: 'Groove irresistible. El ritmo es el rey.',
    focusOn: [
      'Rasgueo percusivo',
      'Notas muertas (ghost notes)',
      'Sincopa constante',
      'Mano derecha activa',
    ],
    dontOverthink: 'No pienses, siente el groove en tu cuerpo.',
    keyTechniques: ['Muted strums', '16th note patterns', 'Ghost notes'],
  },
};

// ===========================================
// ORIGINAL SONGS - Pedagogical, no copyright
// ===========================================

export const ORIGINAL_SONGS: OriginalSong[] = [
  // ROCK
  {
    id: 'rock_primer_riff',
    title: 'Primer Riff',
    style: 'Rock',
    bars: 8,
    objective: 'Dominar power chords E5 y A5',
    progression: 'E5 | E5 | A5 | A5 | E5 | A5 | E5 | E5',
    strumPattern: '↓ · ↓ · ↓ · ↓ ·',
    tempo: 100,
    difficulty: 'beginner',
    notes: 'Mantén el palm mute ligero en las cuerdas graves.',
  },
  {
    id: 'rock_power_drive',
    title: 'Power Drive',
    style: 'Rock',
    bars: 16,
    objective: 'Cambios rápidos entre G5, C5, D5',
    progression: 'G5 | G5 | C5 | D5 | G5 | G5 | C5 | D5 | G5 | C5 | G5 | D5 | G5 | C5 | D5 | G5',
    strumPattern: '↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓',
    tempo: 120,
    difficulty: 'intermediate',
  },
  
  // BLUES
  {
    id: 'blues_midnight',
    title: 'Medianoche Azul',
    style: 'Blues',
    bars: 12,
    objective: 'Progresión blues de 12 compases',
    progression: 'E7 | E7 | E7 | E7 | A7 | A7 | E7 | E7 | B7 | A7 | E7 | B7',
    strumPattern: '↓ · ↓ ↑ · ↑ ↓ ·',
    tempo: 70,
    difficulty: 'beginner',
    notes: 'Siente el shuffle: largo-corto, largo-corto.',
  },
  {
    id: 'blues_slow_burn',
    title: 'Fuego Lento',
    style: 'Blues',
    bars: 12,
    objective: 'Blues en A con turnaround',
    progression: 'A7 | D7 | A7 | A7 | D7 | D7 | A7 | A7 | E7 | D7 | A7 | E7',
    strumPattern: '↓ · · ↑ ↓ · · ↑',
    tempo: 65,
    difficulty: 'intermediate',
  },
  
  // REGGAE
  {
    id: 'reggae_sunshine',
    title: 'Sol Caribeño',
    style: 'Reggae',
    bars: 8,
    objective: 'Dominar el skank (offbeat)',
    progression: 'C | G | Am | F | C | G | F | G',
    strumPattern: '· · ↓ · · · ↓ ·',
    tempo: 75,
    difficulty: 'beginner',
    notes: 'Corta el sonido inmediatamente después del rasgueo.',
  },
  {
    id: 'reggae_island_groove',
    title: 'Groove Isleño',
    style: 'Reggae',
    bars: 16,
    objective: 'Reggae con acordes menores',
    progression: 'Am | Em | F | G | Am | Em | F | G | Am | Am | F | G | Am | Em | F | Am',
    strumPattern: '· · ↓ · · · ↓ ·',
    tempo: 72,
    difficulty: 'intermediate',
  },
  
  // METAL
  {
    id: 'metal_iron_riff',
    title: 'Riff de Hierro',
    style: 'Metal',
    bars: 8,
    objective: 'Palm mute preciso con E5',
    progression: 'E5 | E5 | E5 | E5 | G5 | F#5 | E5 | E5',
    strumPattern: '↓↓↓↓ ↓↓↓↓',
    tempo: 130,
    difficulty: 'intermediate',
    notes: 'Palm mute apretado en todas las notas.',
  },
  {
    id: 'metal_thunder',
    title: 'Trueno de Acero',
    style: 'Metal',
    bars: 16,
    objective: 'Ritmo gallop con power chords',
    progression: 'E5 | E5 | E5 | E5 | D5 | D5 | E5 | E5 | E5 | G5 | A5 | E5 | E5 | D5 | A5 | E5',
    strumPattern: '↓··↓↓ ↓··↓↓',
    tempo: 140,
    difficulty: 'advanced',
  },
  
  // PUNK
  {
    id: 'punk_raw_energy',
    title: 'Energía Cruda',
    style: 'Punk',
    bars: 8,
    objective: 'Downstrokes rápidos constantes',
    progression: 'G5 | C5 | D5 | D5 | G5 | C5 | D5 | G5',
    strumPattern: '↓↓↓↓↓↓↓↓',
    tempo: 160,
    difficulty: 'beginner',
    notes: '¡Solo downstrokes! Mantén la energía.',
  },
  {
    id: 'punk_rebellion',
    title: 'Rebelión',
    style: 'Punk',
    bars: 16,
    objective: 'Progresión I-IV-V a alta velocidad',
    progression: 'A5 | D5 | E5 | E5 | A5 | D5 | E5 | A5 | A5 | A5 | D5 | D5 | E5 | E5 | A5 | A5',
    strumPattern: '↓↓↓↓↓↓↓↓',
    tempo: 180,
    difficulty: 'intermediate',
  },
  {
    id: 'punk_three_chords',
    title: 'Tres Acordes',
    style: 'Punk',
    bars: 8,
    objective: 'La esencia del punk: simplicidad',
    progression: 'C5 | F5 | G5 | G5 | C5 | F5 | G5 | C5',
    strumPattern: '↓↓↓↓↓↓↓↓',
    tempo: 170,
    difficulty: 'beginner',
  },
  
  // BOSSA NOVA
  {
    id: 'bossa_noite',
    title: 'Noche en Río',
    style: 'Bossa Nova',
    bars: 8,
    objective: 'Patrón básico de bossa nova',
    progression: 'Dm7 | G7 | Cmaj7 | Cmaj7 | Dm7 | G7 | Cmaj7 | Cmaj7',
    strumPattern: '↓ · ↓ ↑ · ↓ ↑ ·',
    tempo: 130,
    difficulty: 'intermediate',
    notes: 'El pulgar toca el bajo, los dedos los acordes.',
  },
  {
    id: 'bossa_tarde',
    title: 'Tarde Brasileña',
    style: 'Bossa Nova',
    bars: 16,
    objective: 'Acordes con extensiones en bossa',
    progression: 'Am7 | D7 | Gmaj7 | Cmaj7 | F#m7b5 | B7 | Em7 | E7 | Am7 | D7 | Gmaj7 | Cmaj7 | F#m7b5 | B7 | Em7 | Em7',
    strumPattern: '↓ · ↓ ↑ · ↓ ↑ ·',
    tempo: 125,
    difficulty: 'advanced',
  },
  
  // FUNK
  {
    id: 'funk_groove_one',
    title: 'Groove Número Uno',
    style: 'Funk',
    bars: 8,
    objective: 'Rasgueo percusivo básico',
    progression: 'E9 | E9 | E9 | E9 | A9 | A9 | E9 | E9',
    strumPattern: '↓ x ↓ x ↑ x ↓ ↑',
    tempo: 95,
    difficulty: 'intermediate',
    notes: 'x = golpe mudo (muted strum). ¡Mantén el groove!',
  },
  {
    id: 'funk_tight_pocket',
    title: 'Bolsillo Apretado',
    style: 'Funk',
    bars: 16,
    objective: 'Ghost notes y sincopa',
    progression: 'Am7 | Am7 | D9 | D9 | Am7 | Am7 | E7#9 | E7#9 | Am7 | D9 | Am7 | E7#9 | Am7 | Am7 | D9 | Am7',
    strumPattern: '↓ x ↑ x ↓ x ↑ ↓',
    tempo: 100,
    difficulty: 'advanced',
  },
];

// Helper function to get songs by style
export const getSongsByStyle = (style: string): OriginalSong[] => {
  return ORIGINAL_SONGS.filter(song => 
    song.style.toLowerCase() === style.toLowerCase()
  );
};

// Helper function to get style guide
export const getStyleGuide = (style: string): StyleGuide | undefined => {
  const key = style.toLowerCase().replace(/\s+/g, '');
  return STYLE_GUIDES[key] || Object.values(STYLE_GUIDES).find(
    g => g.name.toLowerCase() === style.toLowerCase()
  );
};
