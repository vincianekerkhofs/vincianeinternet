/**
 * GUITAR GUIDE PRO - CONTENIDO PEDAGÓGICO
 * Introducciones, calentamientos y conexiones para cada semana
 * Alineado con curriculum.ts (semanas 6+)
 */

export interface WarmUpExercise {
  name: string;
  duration: string;
  focus: 'left' | 'right' | 'both' | 'fretboard';
  description: string;
  bpm?: { min: number; max: number };
}

export interface WeekIntro {
  weekId: number;
  title: string;
  whatYouWillLearn: string[];
  whyItMatters: string;
  stylesUsed: string[];
  warmUp: WarmUpExercise[];
  consolidates: string[];
  unlocks: string[];
}

// Contenido pedagógico alineado con curriculum.ts
export const WEEK_INTROS: Record<number, WeekIntro> = {
  // SEMANA 6: PENTATÓNICA MENOR
  6: {
    weekId: 6,
    title: 'Pentatónica Menor - Tu Primera Escala',
    whatYouWillLearn: [
      'La caja 1 de la pentatónica menor',
      'Navegación cuerda por cuerda',
      'Tu primer lick de blues/rock',
    ],
    whyItMatters: 'La pentatónica menor es LA escala más usada en rock, blues, pop y metal. El 90% de los solos usan esta escala.',
    stylesUsed: ['Rock', 'Blues', 'Pop', 'Metal'],
    warmUp: [
      { name: 'Araña 1-2-3-4', duration: '2 min', focus: 'left', description: 'Cada dedo un traste, todas las cuerdas.', bpm: { min: 60, max: 80 } },
      { name: 'Púa alternada', duration: '2 min', focus: 'right', description: 'Abajo-arriba constante en cuerda 1.', bpm: { min: 70, max: 90 } },
    ],
    consolidates: ['Acordes abiertos', 'Ritmo básico'],
    unlocks: ['Improvisación básica', 'Solos simples']
  },

  // SEMANA 7: CEJILLAS (BARRE CHORDS)
  7: {
    weekId: 7,
    title: 'Acordes con Cejilla - Todo el Mástil',
    whatYouWillLearn: [
      'Cejilla parcial (2-3 cuerdas)',
      'F Mayor con forma E',
      'Fm menor con forma Em',
      'Bb con forma A',
      'Progresión I-V-vi-IV con cejillas',
    ],
    whyItMatters: 'Las cejillas desbloquean TODOS los acordes en cualquier posición. Sin cejillas = 8 acordes. Con cejillas = cientos.',
    stylesUsed: ['Rock', 'Punk', 'Pop', 'Reggae'],
    warmUp: [
      { name: 'Presión gradual', duration: '2 min', focus: 'left', description: 'Presiona cuerdas 1-2-3 con dedo 1. 5s on, 5s off.', bpm: { min: 0, max: 0 } },
      { name: 'Rotación de muñeca', duration: '1 min', focus: 'left', description: 'Muñeca relajada y flexible.', bpm: { min: 0, max: 0 } },
      { name: 'Forma E preparación', duration: '2 min', focus: 'left', description: 'Forma E con dedos 2-3-4, luego añade barra.', bpm: { min: 40, max: 50 } },
    ],
    consolidates: ['Acordes abiertos', 'Power chords', 'Cambios'],
    unlocks: ['Todos los acordes', 'Movilidad en mástil', 'Transposición']
  },

  // SEMANA 8: OCTAVAS + FUNK
  8: {
    weekId: 8,
    title: 'Octavas y Ritmo Funk',
    whatYouWillLearn: [
      'Forma de octavas (cuerdas 6-4 y 5-3)',
      'Muting con mano derecha',
      'Ritmo funk de 16th notes',
      'Groove con ghost notes',
    ],
    whyItMatters: 'Las octavas crean líneas melódicas potentes. El funk desarrolla tu mano derecha como ningún otro estilo.',
    stylesUsed: ['Funk', 'R&B', 'Rock', 'Pop'],
    warmUp: [
      { name: 'Muting practice', duration: '2 min', focus: 'right', description: 'Silencia cuerdas con palma. Golpe percusivo.', bpm: { min: 70, max: 90 } },
      { name: 'Forma octava', duration: '2 min', focus: 'left', description: 'Dedo 1 y 3. Cuerdas intermedias mudas.', bpm: { min: 60, max: 80 } },
      { name: '16th subdivisions', duration: '1 min', focus: 'right', description: 'Cuenta 1-e-&-a. Mano siempre en movimiento.', bpm: { min: 60, max: 80 } },
    ],
    consolidates: ['Power chords', 'Ritmo básico'],
    unlocks: ['Ritmos complejos', 'Técnica funk']
  },

  // SEMANA 9: REGGAE BÁSICO
  9: {
    weekId: 9,
    title: 'Reggae - Offbeat y Disciplina',
    whatYouWillLearn: [
      'El offbeat (skank) característico',
      'Staccato controlado',
      'Patrón One Drop',
      'Groove reggae completo',
    ],
    whyItMatters: 'Reggae te enseña disciplina rítmica como ningún otro estilo. Si puedes tocar reggae limpio, puedes tocar cualquier cosa.',
    stylesUsed: ['Reggae', 'Ska', 'Dub'],
    warmUp: [
      { name: 'Offbeat puro', duration: '2 min', focus: 'right', description: 'Cuenta 1-Y-2-Y. Toca SOLO en Y.', bpm: { min: 70, max: 90 } },
      { name: 'Staccato', duration: '2 min', focus: 'both', description: 'Toca-silencia inmediato. Notas cortas.', bpm: { min: 70, max: 90 } },
    ],
    consolidates: ['Ritmo básico', 'Acordes'],
    unlocks: ['Precisión rítmica', 'Independencia']
  },

  // SEMANA 10: BOSSA NOVA
  10: {
    weekId: 10,
    title: 'Bossa Nova - Elegancia Brasileña',
    whatYouWillLearn: [
      'Acordes jazz básicos (Maj7, m7)',
      'Patrón de Bossa Nova',
      'Progresión ii-V-I',
      'Groove brasileño completo',
    ],
    whyItMatters: 'Bossa Nova desarrolla coordinación entre bajo y acordes. Es el puente entre pop y jazz.',
    stylesUsed: ['Bossa Nova', 'Jazz', 'Latin'],
    warmUp: [
      { name: 'Patrón bossa básico', duration: '2 min', focus: 'right', description: 'Pulgar en bajo, dedos en agudos.', bpm: { min: 100, max: 130 } },
      { name: 'Acordes maj7', duration: '2 min', focus: 'left', description: 'Cmaj7, Dm7, G7. Suaves y claros.', bpm: { min: 80, max: 100 } },
    ],
    consolidates: ['Acordes 7ma', 'Fingerpicking'],
    unlocks: ['Jazz básico', 'Armonía sofisticada']
  },

  // SEMANA 11: METAL PALM MUTE
  11: {
    weekId: 11,
    title: 'Metal - Palm Mute y Precisión',
    whatYouWillLearn: [
      'Palm muting controlado',
      'Ritmo gallop (da-da-DUM)',
      'Riffs estilo metal clásico',
      'Breakdown pesado',
    ],
    whyItMatters: 'El metal es el gimnasio del guitarrista. Desarrolla precisión, velocidad y resistencia.',
    stylesUsed: ['Metal', 'Hard Rock', 'Thrash'],
    warmUp: [
      { name: 'Palm mute cerrado', duration: '2 min', focus: 'right', description: 'Palma cerca del puente. Sonido "chunk".', bpm: { min: 100, max: 130 } },
      { name: 'Gallop rhythm', duration: '2 min', focus: 'right', description: 'da-da-DUM. Iron Maiden style.', bpm: { min: 90, max: 120 } },
    ],
    consolidates: ['Power chords', 'Alternate picking'],
    unlocks: ['Velocidad', 'Técnica metal']
  },

  // SEMANA 12: ARPEGIOS BÁSICOS
  12: {
    weekId: 12,
    title: 'Arpegios - Acordes Nota por Nota',
    whatYouWillLearn: [
      'Diferencia rasgueo vs arpegio',
      'Patrón p-i-m-a',
      'Arpegios sobre C, Am, G, F',
      'Canción estilo balada',
    ],
    whyItMatters: 'Los arpegios añaden delicadeza y profundidad. Esenciales para baladas y fingerpicking.',
    stylesUsed: ['Balada', 'Folk', 'Pop', 'Classical'],
    warmUp: [
      { name: 'p-i-m-a básico', duration: '2 min', focus: 'right', description: 'Pulgar cuerda 6, i-m-a en 3-2-1.', bpm: { min: 50, max: 70 } },
      { name: 'Independencia de dedos', duration: '2 min', focus: 'right', description: 'Solo índice, luego medio, luego anular.', bpm: { min: 40, max: 60 } },
    ],
    consolidates: ['Acordes abiertos', 'Coordinación'],
    unlocks: ['Fingerpicking avanzado', 'Composición baladas']
  },

  // SEMANA 13-24 (contenido adicional)
  13: {
    weekId: 13,
    title: 'Escala Mayor - Melodías Reales',
    whatYouWillLearn: ['Escala de Do Mayor', 'Relación escala-acorde', 'Crear melodías simples'],
    whyItMatters: 'La escala mayor es el alfabeto de la música occidental.',
    stylesUsed: ['Pop', 'Country', 'Folk'],
    warmUp: [
      { name: 'Do-Re-Mi', duration: '3 min', focus: 'both', description: 'Escala ascendente y descendente.', bpm: { min: 60, max: 80 } },
    ],
    consolidates: ['Pentatónica', 'Notas individuales'],
    unlocks: ['Composición de melodías', 'Modos']
  },

  14: {
    weekId: 14,
    title: 'Modo Dórico - Sonido Sofisticado',
    whatYouWillLearn: ['Dórico vs menor natural', 'La 6ta mayor', 'Jam en Dórico'],
    whyItMatters: 'El Dórico es usado en funk, rock y jazz. Un modo bien aprendido > 7 modos mal entendidos.',
    stylesUsed: ['Funk', 'Rock', 'Jazz'],
    warmUp: [
      { name: 'Característica Dórica', duration: '3 min', focus: 'both', description: 'Enfatiza la 6ta mayor.', bpm: { min: 50, max: 70 } },
    ],
    consolidates: ['Escala mayor', 'Pentatónica'],
    unlocks: ['Otros modos', 'Sonido sofisticado']
  },

  15: {
    weekId: 15,
    title: 'Legato - Hammer-ons y Pull-offs',
    whatYouWillLearn: ['Hammer-on limpio', 'Pull-off controlado', 'Licks legato'],
    whyItMatters: 'El legato permite tocar más rápido con menos esfuerzo.',
    stylesUsed: ['Rock', 'Fusion', 'Metal'],
    warmUp: [
      { name: 'Hammer-on aislado', duration: '2 min', focus: 'left', description: 'Traste 5-7. Martillo fuerte.', bpm: { min: 50, max: 70 } },
      { name: 'Pull-off aislado', duration: '2 min', focus: 'left', description: 'Traste 7-5. Tira hacia abajo.', bpm: { min: 50, max: 70 } },
    ],
    consolidates: ['Fuerza mano izquierda', 'Pentatónica'],
    unlocks: ['Velocidad sin esfuerzo', 'Tapping']
  },

  16: {
    weekId: 16,
    title: 'Bends y Vibrato - Expresión Total',
    whatYouWillLearn: ['Bend de 1/2 y 1 tono', 'Vibrato controlado', 'Pre-bend'],
    whyItMatters: 'Bends y vibrato separan a un guitarrista correcto de uno expresivo.',
    stylesUsed: ['Blues', 'Rock', 'Soul'],
    warmUp: [
      { name: 'Bend afinado', duration: '2 min', focus: 'both', description: 'Iguala al traste superior.', bpm: { min: 0, max: 0 } },
      { name: 'Vibrato lento', duration: '2 min', focus: 'left', description: 'Vibrato de muñeca, no de dedo.', bpm: { min: 0, max: 0 } },
    ],
    consolidates: ['Técnica mano izquierda', 'Oído musical'],
    unlocks: ['Solos expresivos', 'Estilo personal']
  },

  17: {
    weekId: 17,
    title: 'Shell Chords - Jazz Accesible',
    whatYouWillLearn: ['Shell chords (3ra y 7ma)', 'ii-V-I', 'Groove jazz simple'],
    whyItMatters: 'No necesitas toda la teoría del jazz para sonar jazzy.',
    stylesUsed: ['Jazz', 'Bossa', 'Neo-Soul'],
    warmUp: [
      { name: 'Dm7 shell', duration: '2 min', focus: 'left', description: 'Solo 3 notas.', bpm: { min: 50, max: 70 } },
    ],
    consolidates: ['Acordes 7ma', 'Conocimiento mástil'],
    unlocks: ['Jazz avanzado', 'Comping']
  },

  18: {
    weekId: 18,
    title: 'Riffs de Rock - Tu Voz',
    whatYouWillLearn: ['Palm muting avanzado', 'Acentos dinámicos', 'Riff original'],
    whyItMatters: 'Un buen riff es la base de toda canción de rock.',
    stylesUsed: ['Rock', 'Hard Rock', 'Punk'],
    warmUp: [
      { name: 'Palm mute dinámico', duration: '3 min', focus: 'right', description: 'Abierto-cerrado-abierto.', bpm: { min: 80, max: 100 } },
    ],
    consolidates: ['Power chords', 'Ritmo'],
    unlocks: ['Composición de riffs', 'Tu sonido']
  },

  19: {
    weekId: 19,
    title: 'Reggae Avanzado',
    whatYouWillLearn: ['Variaciones de skank', 'Fills', 'Dub style'],
    whyItMatters: 'Profundizar en reggae mejora cualquier estilo.',
    stylesUsed: ['Reggae', 'Dub'],
    warmUp: [
      { name: 'Skank variations', duration: '3 min', focus: 'both', description: 'Diferentes acentos.', bpm: { min: 72, max: 85 } },
    ],
    consolidates: ['Reggae básico', 'Ritmo'],
    unlocks: ['Ritmos complejos', 'Groove']
  },

  20: {
    weekId: 20,
    title: 'Metal - Velocidad',
    whatYouWillLearn: ['Alternate picking rápido', 'Tremolo', 'Sincronización'],
    whyItMatters: 'La velocidad desarrolla control muscular que mejora todo tu playing.',
    stylesUsed: ['Metal', 'Thrash', 'Speed'],
    warmUp: [
      { name: 'Picking burst', duration: '2 min', focus: 'right', description: '4 notas rápidas, pausa.', bpm: { min: 100, max: 140 } },
      { name: 'Sincronización', duration: '2 min', focus: 'both', description: 'Cromático lento, púa y dedo juntos.', bpm: { min: 60, max: 80 } },
    ],
    consolidates: ['Alternate picking', 'Resistencia'],
    unlocks: ['Velocidad real', 'Shred']
  },

  21: {
    weekId: 21,
    title: 'Conexión Total del Mástil',
    whatYouWillLearn: ['5 posiciones pentatónica', 'Movimiento vertical + horizontal', 'Solo completo'],
    whyItMatters: 'Ver el mástil completo te convierte en guitarrista de verdad.',
    stylesUsed: ['Todos'],
    warmUp: [
      { name: '5 posiciones', duration: '3 min', focus: 'both', description: 'Pentatónica completa.', bpm: { min: 60, max: 80 } },
    ],
    consolidates: ['Todas las cajas', 'Slides'],
    unlocks: ['Improvisación libre', 'Maestría']
  },

  22: {
    weekId: 22,
    title: 'Construcción de Solos',
    whatYouWillLearn: ['Estructura de solo', 'Target notes', 'Respiración musical'],
    whyItMatters: 'Un solo tiene estructura, emoción, tensión y resolución.',
    stylesUsed: ['Rock', 'Blues', 'Pop'],
    warmUp: [
      { name: 'Frase de 4 compases', duration: '3 min', focus: 'both', description: 'Crea, repite, varía.', bpm: { min: 70, max: 90 } },
    ],
    consolidates: ['Escala completa', 'Técnicas expresivas'],
    unlocks: ['Solos originales', 'Estilo personal']
  },

  23: {
    weekId: 23,
    title: 'Composición - Tu Música',
    whatYouWillLearn: ['Estructura de canción', 'Crear riffs', 'Tu primera composición'],
    whyItMatters: 'No eres solo un ejecutante - eres un creador.',
    stylesUsed: ['Tu estilo'],
    warmUp: [
      { name: 'Idea libre', duration: '3 min', focus: 'both', description: 'Toca lo que quieras. Graba.', bpm: { min: 0, max: 0 } },
    ],
    consolidates: ['Todo el programa'],
    unlocks: ['Expresión ilimitada', 'Tu voz única']
  },

  24: {
    weekId: 24,
    title: 'Integración Total',
    whatYouWillLearn: ['Jam session completa', 'Improvisación libre', 'Plan de futuro'],
    whyItMatters: 'Este no es el final - es el comienzo de tu viaje real.',
    stylesUsed: ['Todos'],
    warmUp: [
      { name: 'Tu rutina', duration: '5 min', focus: 'both', description: 'Lo que funciona para ti.', bpm: { min: 60, max: 120 } },
    ],
    consolidates: ['Todo el programa'],
    unlocks: ['Tu futuro musical']
  }
};

// Helper functions
export const getWeekIntro = (weekNum: number): WeekIntro | null => {
  return WEEK_INTROS[weekNum] || null;
};

export const getWarmUpExercises = (weekNum: number): WarmUpExercise[] => {
  const intro = WEEK_INTROS[weekNum];
  return intro?.warmUp || [];
};
