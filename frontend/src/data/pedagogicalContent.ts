/**
 * GUITAR GUIDE PRO - CONTENIDO PEDAGÓGICO
 * Introducciones, calentamientos y conexiones para cada semana
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
  consolidates: string[];  // What previous content this builds on
  unlocks: string[];       // What this enables next
}

// Contenido pedagógico para semanas 7-24
export const WEEK_INTROS: Record<number, WeekIntro> = {
  // ==================================================
  // SEMANA 7: PENTATÓNICA MENOR - FUNDAMENTO REAL
  // ==================================================
  7: {
    weekId: 7,
    title: 'Pentatónica Menor - Tu Primera Escala Real',
    whatYouWillLearn: [
      'La caja 1 de la pentatónica menor',
      'Navegación cuerda por cuerda',
      'Tu primer lick de blues/rock',
      'Cómo conectar escala con acordes'
    ],
    whyItMatters: 'La pentatónica menor es LA escala más usada en rock, blues, pop y metal. El 90% de los solos que escuchas usan esta escala. Dominarla te abre las puertas a la improvisación.',
    stylesUsed: ['Rock', 'Blues', 'Pop', 'Metal'],
    warmUp: [
      { name: 'Araña 1-2-3-4', duration: '2 min', focus: 'left', description: 'Cada dedo un traste, todas las cuerdas. Lento y limpio.', bpm: { min: 60, max: 80 } },
      { name: 'Púa alternada', duration: '2 min', focus: 'right', description: 'Abajo-arriba constante en cuerda 1. Mantén el pulso.', bpm: { min: 70, max: 90 } },
      { name: 'Cambio de posición', duration: '1 min', focus: 'fretboard', description: 'Traste 5 → 7 → 5 con dedo 1. Sin mirar.' }
    ],
    consolidates: ['Acordes abiertos', 'Ritmo básico', 'Coordinación mano izquierda'],
    unlocks: ['Conexión de cajas', 'Improvisación básica', 'Solos simples']
  },

  // ==================================================
  // SEMANA 8: CONECTANDO CAJAS PENTATÓNICAS
  // ==================================================
  8: {
    weekId: 8,
    title: 'Conectando Cajas Pentatónicas',
    whatYouWillLearn: [
      'Caja 2 de la pentatónica menor',
      'Conexión horizontal entre cajas',
      'Slides como herramienta de transición',
      'Mini solo guiado de 8 compases'
    ],
    whyItMatters: 'Un solo real no se queda en una posición. Aprender a conectar cajas te permite moverte por todo el mástil con fluidez y crear frases más interesantes.',
    stylesUsed: ['Rock', 'Blues'],
    warmUp: [
      { name: 'Slide cromático', duration: '2 min', focus: 'left', description: 'Traste 5-7-5 con slide. Suave, sin cortar el sonido.', bpm: { min: 50, max: 70 } },
      { name: 'Cambio de cuerda', duration: '2 min', focus: 'both', description: 'Alternar cuerdas 1-2-3 con púa alternada.', bpm: { min: 60, max: 80 } },
      { name: 'Desplazamiento diagonal', duration: '1 min', focus: 'fretboard', description: 'Traste 5 cuerda 6 → Traste 8 cuerda 1. Visualiza el camino.' }
    ],
    consolidates: ['Caja 1 pentatónica', 'Posición fija'],
    unlocks: ['Movimiento horizontal completo', 'Frases más largas', 'Escala blues']
  },

  // ==================================================
  // SEMANA 9: ESCALA BLUES Y CALL/RESPONSE
  // ==================================================
  9: {
    weekId: 9,
    title: 'Escala Blues y Pregunta/Respuesta',
    whatYouWillLearn: [
      'La "blue note" (nota blues)',
      'Fraseo pregunta-respuesta',
      'Bends básicos para expresión',
      'Improvisación guiada sobre backing track'
    ],
    whyItMatters: 'La blue note añade tensión y emoción. El fraseo pregunta-respuesta es cómo los músicos "conversan" con sus instrumentos. Es la base de toda improvisación.',
    stylesUsed: ['Blues', 'Rock', 'Jazz'],
    warmUp: [
      { name: 'Blue note isolation', duration: '2 min', focus: 'left', description: 'Toca solo la blue note (traste 6 cuerda 4). Escucha su tensión.', bpm: { min: 50, max: 60 } },
      { name: 'Micro-bends', duration: '2 min', focus: 'both', description: 'Bend de 1/4 tono en cuerda 2. Control, no fuerza.', bpm: { min: 50, max: 60 } },
      { name: 'Respiración musical', duration: '1 min', focus: 'both', description: 'Toca 4 notas, espera 4 tiempos. El silencio es parte de la música.' }
    ],
    consolidates: ['Pentatónica menor', 'Conexión de cajas', 'Técnica básica'],
    unlocks: ['Expresión en solos', 'Improvisación libre', 'Bends controlados']
  },

  // ==================================================
  // SEMANA 10: ACORDES CON CEJILLA - USO MUSICAL
  // ==================================================
  10: {
    weekId: 10,
    title: 'Acordes con Cejilla - Uso Musical Real',
    whatYouWillLearn: [
      'Mini-F (cejilla parcial) sin dolor',
      'F completo con forma E',
      'Relación cejilla-power chord',
      'Groove de rock con cambios'
    ],
    whyItMatters: 'Las cejillas te dan acceso a TODOS los acordes mayores y menores en cualquier posición. Sin cejillas, estás limitado a solo 8 acordes.',
    stylesUsed: ['Rock', 'Pop', 'Punk', 'Reggae'],
    warmUp: [
      { name: 'Presión gradual', duration: '2 min', focus: 'left', description: 'Presiona solo cuerdas 1-2-3 con dedo 1. 5 segundos on, 5 off.', bpm: { min: 0, max: 0 } },
      { name: 'Forma E preparación', duration: '2 min', focus: 'left', description: 'Forma de E sin cejilla, luego añade dedo 1.', bpm: { min: 40, max: 50 } },
      { name: 'Estiramiento de muñeca', duration: '1 min', focus: 'left', description: 'Rotaciones suaves. La cejilla requiere muñeca flexible.' }
    ],
    consolidates: ['Acordes abiertos', 'Cambios de acordes', 'Formas básicas'],
    unlocks: ['Todos los acordes mayores/menores', 'Movilidad en el mástil', 'Canciones más complejas']
  },

  // ==================================================
  // SEMANA 11: OCTAVAS Y FUNK
  // ==================================================
  11: {
    weekId: 11,
    title: 'Octavas y Ritmo Funk',
    whatYouWillLearn: [
      'Forma de octavas (cuerdas 6-4 y 5-3)',
      'Muting con mano derecha',
      'Ritmo funk de 16th notes',
      'Groove con ghost notes'
    ],
    whyItMatters: 'Las octavas crean líneas melódicas poderosas. El funk desarrolla tu mano derecha como ningún otro estilo. Precisión rítmica = profesionalismo.',
    stylesUsed: ['Funk', 'R&B', 'Rock', 'Pop'],
    warmUp: [
      { name: 'Muting practice', duration: '2 min', focus: 'right', description: 'Silencia cuerdas con palma. Golpe percusivo, sin nota.', bpm: { min: 70, max: 90 } },
      { name: 'Octava shape', duration: '2 min', focus: 'left', description: 'Forma de octava: dedo 1 y 3 (o 4). Cuerdas intermedias mudas.', bpm: { min: 60, max: 80 } },
      { name: '16th subdivisions', duration: '1 min', focus: 'right', description: 'Cuenta 1-e-&-a constante. Mano siempre en movimiento.', bpm: { min: 60, max: 80 } }
    ],
    consolidates: ['Power chords', 'Ritmo básico', 'Coordinación'],
    unlocks: ['Líneas melódicas avanzadas', 'Ritmos complejos', 'Técnica funk']
  },

  // ==================================================
  // SEMANA 12: ARPEGIOS BÁSICOS
  // ==================================================
  12: {
    weekId: 12,
    title: 'Arpegios - Acordes Nota por Nota',
    whatYouWillLearn: [
      'Diferencia entre rasgueo y arpegio',
      'Patrón p-i-m-a (pulgar-índice-medio-anular)',
      'Arpegios sobre C, Am, G, F',
      'Canción estilo balada completa'
    ],
    whyItMatters: 'Los arpegios añaden delicadeza y profundidad. Son esenciales para baladas, fingerpicking, y entender la estructura de los acordes.',
    stylesUsed: ['Balada', 'Folk', 'Pop', 'Classical'],
    warmUp: [
      { name: 'p-i-m-a básico', duration: '2 min', focus: 'right', description: 'Pulgar en cuerda 6, i-m-a en 3-2-1. Lento y uniforme.', bpm: { min: 50, max: 70 } },
      { name: 'Independencia de dedos', duration: '2 min', focus: 'right', description: 'Toca solo con índice, luego medio, luego anular.', bpm: { min: 40, max: 60 } },
      { name: 'Posición de mano', duration: '1 min', focus: 'right', description: 'Muñeca arqueada, dedos perpendiculares a cuerdas.' }
    ],
    consolidates: ['Acordes abiertos', 'Coordinación básica', 'Formas de acordes'],
    unlocks: ['Fingerpicking avanzado', 'Composición de baladas', 'Técnica clásica']
  },

  // ==================================================
  // SEMANA 13: ESCALA MAYOR - USO PRÁCTICO
  // ==================================================
  13: {
    weekId: 13,
    title: 'Escala Mayor - Melodías Reales',
    whatYouWillLearn: [
      'Escala de Do Mayor (posición abierta)',
      'Relación escala-acorde',
      'Crear melodías simples',
      'La escala sin teoría abstracta'
    ],
    whyItMatters: 'La escala mayor es el "alfabeto" de la música occidental. Entenderla te permite crear melodías, entender canciones, y comunicarte con otros músicos.',
    stylesUsed: ['Pop', 'Country', 'Folk', 'Rock'],
    warmUp: [
      { name: 'Do-Re-Mi ascendente', duration: '2 min', focus: 'both', description: 'Escala de Do Mayor subiendo. Cada nota clara.', bpm: { min: 60, max: 80 } },
      { name: 'Do-Re-Mi descendente', duration: '2 min', focus: 'both', description: 'Escala de Do Mayor bajando. Control en el descenso.', bpm: { min: 60, max: 80 } },
      { name: 'Intervalos de tercera', duration: '1 min', focus: 'both', description: 'Do-Mi, Re-Fa, Mi-Sol... Escucha las terceras.', bpm: { min: 50, max: 70 } }
    ],
    consolidates: ['Pentatónica', 'Movimiento en el mástil', 'Notas individuales'],
    unlocks: ['Composición de melodías', 'Entendimiento armónico', 'Modos (futuro)']
  },

  // ==================================================
  // SEMANA 14: MODO DÓRICO
  // ==================================================
  14: {
    weekId: 14,
    title: 'Modo Dórico - Un Solo Modo, Bien',
    whatYouWillLearn: [
      'Qué es un modo (sin teoría excesiva)',
      'Dórico = menor con 6ta mayor',
      'Sonido funk/rock del Dórico',
      'Jam guiado en Dórico'
    ],
    whyItMatters: 'El Dórico es el modo más usado después de mayor y menor. Santana, Pink Floyd, y miles de canciones funk lo usan. Un modo bien aprendido > 7 modos mal entendidos.',
    stylesUsed: ['Funk', 'Rock', 'Jazz', 'Fusion'],
    warmUp: [
      { name: 'Dórico vs menor natural', duration: '2 min', focus: 'both', description: 'Toca Am natural, luego sube el 6to grado (F→F#).', bpm: { min: 50, max: 70 } },
      { name: 'Característica del modo', duration: '2 min', focus: 'both', description: 'Enfatiza la 6ta mayor. Es lo que hace "Dórico".', bpm: { min: 50, max: 70 } },
      { name: 'Groove Dórico', duration: '1 min', focus: 'both', description: 'Am7 - D7, el movimiento característico.', bpm: { min: 70, max: 90 } }
    ],
    consolidates: ['Escala mayor', 'Pentatónica menor', 'Improvisación básica'],
    unlocks: ['Otros modos (futuro)', 'Sonido más sofisticado', 'Fusión de estilos']
  },

  // ==================================================
  // SEMANA 15: TÉCNICA LEGATO
  // ==================================================
  15: {
    weekId: 15,
    title: 'Legato - Hammer-ons y Pull-offs',
    whatYouWillLearn: [
      'Hammer-on limpio y fuerte',
      'Pull-off con control',
      'Combinaciones hammer-pull',
      'Licks legato en pentatónica'
    ],
    whyItMatters: 'El legato te permite tocar más rápido con menos esfuerzo. Es la técnica de guitarristas como Joe Satriani, Allan Holdsworth, y Eddie Van Halen.',
    stylesUsed: ['Rock', 'Fusion', 'Metal', 'Jazz'],
    warmUp: [
      { name: 'Hammer-on aislado', duration: '2 min', focus: 'left', description: 'Traste 5-7 cuerda 1. El martillo debe sonar igual de fuerte.', bpm: { min: 50, max: 70 } },
      { name: 'Pull-off aislado', duration: '2 min', focus: 'left', description: 'Traste 7-5 cuerda 1. Tira hacia abajo, no solo levantes.', bpm: { min: 50, max: 70 } },
      { name: 'Trills', duration: '1 min', focus: 'left', description: 'Hammer-pull-hammer-pull rápido. Resistencia y velocidad.', bpm: { min: 80, max: 120 } }
    ],
    consolidates: ['Fuerza de mano izquierda', 'Pentatónica', 'Coordinación'],
    unlocks: ['Velocidad sin esfuerzo', 'Licks avanzados', 'Tapping (futuro)']
  },

  // ==================================================
  // SEMANA 16: BENDS Y VIBRATO
  // ==================================================
  16: {
    weekId: 16,
    title: 'Bends y Vibrato - Expresión Total',
    whatYouWillLearn: [
      'Bend de 1/2 y 1 tono con afinación',
      'Vibrato controlado (no nervioso)',
      'Pre-bend y release',
      'Añadir emoción a cualquier nota'
    ],
    whyItMatters: 'Bends y vibrato son lo que separa a un guitarrista "correcto" de uno "expresivo". B.B. King tocaba pocas notas, pero cada una tenía vida.',
    stylesUsed: ['Blues', 'Rock', 'Soul', 'Country'],
    warmUp: [
      { name: 'Bend afinado', duration: '2 min', focus: 'both', description: 'Bend en traste 7 cuerda 2. Iguala al traste 9. Usa tuner.', bpm: { min: 0, max: 0 } },
      { name: 'Vibrato lento', duration: '2 min', focus: 'left', description: 'Vibrato de muñeca, no de dedo. Ondas lentas y controladas.', bpm: { min: 0, max: 0 } },
      { name: 'Combinación', duration: '1 min', focus: 'both', description: 'Bend 1 tono + vibrato en la cima. Sostén 4 tiempos.' }
    ],
    consolidates: ['Técnica de mano izquierda', 'Oído musical', 'Control'],
    unlocks: ['Solos expresivos', 'Estilo personal', 'Fraseo avanzado']
  },

  // ==================================================
  // SEMANA 17: SHELL CHORDS / JAZZ PRÁCTICO
  // ==================================================
  17: {
    weekId: 17,
    title: 'Shell Chords - Jazz Accesible',
    whatYouWillLearn: [
      'Qué son los shell chords (3ra y 7ma)',
      'Voicings reducidos para jazz',
      'ii-V-I la progresión esencial',
      'Groove jazz simple'
    ],
    whyItMatters: 'No necesitas saber toda la teoría del jazz para sonar "jazzy". Los shell chords son acordes mínimos que suenan sofisticados y son fáciles de mover.',
    stylesUsed: ['Jazz', 'Bossa Nova', 'Neo-Soul', 'R&B'],
    warmUp: [
      { name: 'Shell Dm7', duration: '2 min', focus: 'left', description: 'Solo 3 notas: raíz-3ra-7ma. Encuentra en diferentes posiciones.', bpm: { min: 50, max: 70 } },
      { name: 'Shell G7', duration: '2 min', focus: 'left', description: 'Dominante shell. Siente la tensión que quiere resolver.', bpm: { min: 50, max: 70 } },
      { name: 'ii-V-I básico', duration: '1 min', focus: 'both', description: 'Dm7 - G7 - Cmaj7. LA progresión del jazz.', bpm: { min: 60, max: 80 } }
    ],
    consolidates: ['Acordes 7ma', 'Conocimiento del mástil', 'Oído armónico'],
    unlocks: ['Jazz más avanzado', 'Comping', 'Armonía sofisticada']
  },

  // ==================================================
  // SEMANA 18: RIFFS DE ROCK
  // ==================================================
  18: {
    weekId: 18,
    title: 'Riffs de Rock - Palm Mute y Precisión',
    whatYouWillLearn: [
      'Palm muting controlado',
      'Ritmo gallop (da-da-DUM)',
      'Acentos y dinámicas',
      'Riff original estilo rock clásico'
    ],
    whyItMatters: 'Un buen riff es la base de toda canción de rock. AC/DC, Led Zeppelin, Metallica - todos empezaron con riffs memorables. Es hora de crear los tuyos.',
    stylesUsed: ['Rock', 'Hard Rock', 'Metal', 'Punk'],
    warmUp: [
      { name: 'Palm mute cerrado', duration: '2 min', focus: 'right', description: 'Palma cerca del puente. Sonido "chunk" apretado.', bpm: { min: 80, max: 100 } },
      { name: 'Palm mute abierto', duration: '2 min', focus: 'right', description: 'Palma más lejos. Sonido más lleno pero controlado.', bpm: { min: 80, max: 100 } },
      { name: 'Gallop rhythm', duration: '1 min', focus: 'right', description: 'da-da-DUM da-da-DUM. Iron Maiden style.', bpm: { min: 90, max: 120 } }
    ],
    consolidates: ['Power chords', 'Ritmo básico', 'Coordinación'],
    unlocks: ['Composición de riffs', 'Técnica metal', 'Tu sonido propio']
  },

  // ==================================================
  // SEMANA 19: REGGAE
  // ==================================================
  19: {
    weekId: 19,
    title: 'Reggae - Offbeat y Disciplina',
    whatYouWillLearn: [
      'El offbeat (skank) característico',
      'Staccato controlado',
      'Patrón One Drop',
      'Groove reggae completo'
    ],
    whyItMatters: 'Reggae te enseña disciplina rítmica como ningún otro estilo. Si puedes tocar reggae limpio, puedes tocar cualquier cosa. El offbeat mejora tu timing.',
    stylesUsed: ['Reggae', 'Ska', 'Dub', 'Dancehall'],
    warmUp: [
      { name: 'Offbeat puro', duration: '2 min', focus: 'right', description: 'Cuenta 1-Y-2-Y-3-Y-4-Y. Toca SOLO en Y.', bpm: { min: 70, max: 90 } },
      { name: 'Staccato', duration: '2 min', focus: 'both', description: 'Toca-silencia inmediato. Notas cortas y definidas.', bpm: { min: 70, max: 90 } },
      { name: 'Metrónomo challenge', duration: '1 min', focus: 'both', description: 'Metrónomo en 2 y 4 solamente. Tú pones el offbeat.', bpm: { min: 65, max: 85 } }
    ],
    consolidates: ['Ritmo básico', 'Acordes abiertos/cejilla', 'Control de mano derecha'],
    unlocks: ['Cualquier estilo rítmico', 'Precisión de timing', 'Independencia rítmica']
  },

  // ==================================================
  // SEMANA 20: METAL - VELOCIDAD
  // ==================================================
  20: {
    weekId: 20,
    title: 'Metal - Velocidad y Sincronización',
    whatYouWillLearn: [
      'Alternate picking a velocidad',
      'Tremolo picking',
      'Sincronización manos a tempo rápido',
      'Riff estilo thrash/speed metal'
    ],
    whyItMatters: 'La velocidad no es solo para presumir. Desarrolla control muscular y sincronización que mejora TODO tu playing. El metal es el gimnasio del guitarrista.',
    stylesUsed: ['Metal', 'Thrash', 'Speed Metal', 'Technical'],
    warmUp: [
      { name: 'Picking burst', duration: '2 min', focus: 'right', description: '4 notas rápidas, pausa. Repite. Construye velocidad.', bpm: { min: 100, max: 140 } },
      { name: 'Sincronización', duration: '2 min', focus: 'both', description: 'Escala cromática lenta. Púa y dedo exactamente juntos.', bpm: { min: 60, max: 80 } },
      { name: 'Tremolo', duration: '1 min', focus: 'right', description: 'Una nota, picking lo más rápido posible. 10 segundos.', bpm: { min: 0, max: 0 } }
    ],
    consolidates: ['Alternate picking', 'Power chords', 'Resistencia'],
    unlocks: ['Velocidad real', 'Técnicas avanzadas', 'Shred (futuro)']
  },

  // ==================================================
  // SEMANA 21: CONEXIÓN COMPLETA DEL MÁSTIL
  // ==================================================
  21: {
    weekId: 21,
    title: 'Conexión Total del Mástil',
    whatYouWillLearn: [
      'Las 5 posiciones de pentatónica',
      'Movimiento vertical + horizontal + diagonal',
      'Visualización del mástil completo',
      'Solo que recorre todo el mástil'
    ],
    whyItMatters: 'Ya no estás atrapado en una caja. Ver el mástil completo te convierte de "alguien que toca guitarra" a "guitarrista". Libertad total.',
    stylesUsed: ['Todos'],
    warmUp: [
      { name: '5 posiciones', duration: '3 min', focus: 'both', description: 'Pentatónica en posiciones 1, 2, 3, 4, 5. Una tras otra.', bpm: { min: 60, max: 80 } },
      { name: 'Conexión slide', duration: '2 min', focus: 'both', description: 'Posición 1 → 2 → 3 usando slides.', bpm: { min: 50, max: 70 } }
    ],
    consolidates: ['Todas las cajas pentatónicas', 'Slides', 'Visualización'],
    unlocks: ['Improvisación libre', 'Composición de solos', 'Maestría del instrumento']
  },

  // ==================================================
  // SEMANA 22: CONSTRUCCIÓN DE SOLOS
  // ==================================================
  22: {
    weekId: 22,
    title: 'Construcción de Solos - Fraseo Musical',
    whatYouWillLearn: [
      'Estructura de un solo (intro-desarrollo-clímax)',
      'Target notes (notas objetivo)',
      'Respiración musical',
      'Tu primer solo completo de 16 compases'
    ],
    whyItMatters: 'Un solo no es solo "tocar notas de la escala". Tiene estructura, emoción, tensión y resolución. Aprende a contar una historia con tu guitarra.',
    stylesUsed: ['Rock', 'Blues', 'Pop'],
    warmUp: [
      { name: 'Frase de 4 compases', duration: '2 min', focus: 'both', description: 'Crea una frase simple. Repítela. Varía la última nota.', bpm: { min: 70, max: 90 } },
      { name: 'Target note', duration: '2 min', focus: 'both', description: 'Decide una nota final. Llega a ella desde diferentes lugares.', bpm: { min: 60, max: 80 } },
      { name: 'Silencio', duration: '1 min', focus: 'both', description: 'Toca 2 compases, silencio 2 compases. Espacio es música.' }
    ],
    consolidates: ['Escala completa', 'Técnicas expresivas', 'Teoría básica'],
    unlocks: ['Solos originales', 'Estilo personal', 'Composición']
  },

  // ==================================================
  // SEMANA 23: COMPOSICIÓN
  // ==================================================
  23: {
    weekId: 23,
    title: 'Composición - Crea Tu Propia Música',
    whatYouWillLearn: [
      'Estructura de una canción (intro-verso-coro)',
      'Crear riffs originales',
      'Construir progresiones que funcionen',
      'Tu primera composición completa'
    ],
    whyItMatters: 'Todo lo que has aprendido culmina aquí. No eres solo un ejecutante - eres un creador. Tu música, tu voz, tu expresión.',
    stylesUsed: ['Tu estilo'],
    warmUp: [
      { name: 'Idea libre', duration: '2 min', focus: 'both', description: 'Toca lo que quieras. Sin juzgar. Graba todo.', bpm: { min: 0, max: 0 } },
      { name: 'Desarrollo', duration: '2 min', focus: 'both', description: 'Toma una idea de antes. Hazla más larga/corta/diferente.', bpm: { min: 0, max: 0 } },
      { name: 'Loop mental', duration: '1 min', focus: 'both', description: 'Imagina un riff en tu cabeza. Luego tócalo. Oído interno.' }
    ],
    consolidates: ['Todo el programa', 'Técnica', 'Teoría', 'Oído'],
    unlocks: ['Carrera musical', 'Expresión ilimitada', 'Tu voz única']
  },

  // ==================================================
  // SEMANA 24: INTEGRACIÓN TOTAL
  // ==================================================
  24: {
    weekId: 24,
    title: 'Integración Total - El Guitarrista Completo',
    whatYouWillLearn: [
      'Jam session completa (todos los estilos)',
      'Improvisación libre extendida',
      'Auto-evaluación honesta',
      'Plan de práctica personalizado para el futuro'
    ],
    whyItMatters: 'Este no es el final - es el comienzo de tu viaje real. Ahora tienes las herramientas. El resto es práctica, exploración, y expresión.',
    stylesUsed: ['Todos'],
    warmUp: [
      { name: 'Warm-up completo', duration: '5 min', focus: 'both', description: 'Tu rutina personal. Lo que funciona para ti.', bpm: { min: 60, max: 120 } }
    ],
    consolidates: ['Todo el programa de 24 semanas'],
    unlocks: ['Tu futuro musical', 'Aprendizaje continuo', 'Maestría']
  }
};

// Función helper para obtener intro de semana
export const getWeekIntro = (weekNum: number): WeekIntro | null => {
  return WEEK_INTROS[weekNum] || null;
};

// Función para obtener ejercicios de calentamiento sugeridos
export const getWarmUpExercises = (weekNum: number): WarmUpExercise[] => {
  const intro = WEEK_INTROS[weekNum];
  return intro?.warmUp || [];
};
