/**
 * GUITAR GUIDE PRO - TECHNIQUE SYSTEM
 * Complete definitions for all guitar techniques
 * Each technique includes: explanation, how-to, audio cue, common mistakes
 */

export type TechniqueHand = 'left' | 'right';
export type TechniqueLevel = 1 | 2 | 3 | 4;

export interface TechniqueDefinition {
  id: string;
  name: string;
  nameEn: string;       // English name for reference
  icon: string;         // SVG path or icon identifier
  hand: TechniqueHand;
  color: string;        // Theme color
  
  // Micro-tutorial content
  whatItIs: string;           // 1 sentence
  howToDo: string[];          // Step by step physical instruction
  commonMistakes: string[];   // 1-2 tips
  audioDescription: string;   // How it should sound
  
  // Mastery tracking
  levels: {
    level: TechniqueLevel;
    name: string;
    description: string;
    exerciseIds: string[];    // Links to exercise library
  }[];
  
  // Visual indicators
  notation: string;           // Tab notation (e.g., "h", "p", "b")
  animation: 'pulse' | 'curve' | 'wave' | 'slide' | 'bounce';
}

// =============================================
// LEFT HAND TECHNIQUES
// =============================================

export const LEFT_HAND_TECHNIQUES: TechniqueDefinition[] = [
  // HAMMER-ON
  {
    id: 'hammer_on',
    name: 'Hammer-on',
    nameEn: 'Hammer-on',
    icon: 'hammer',
    hand: 'left',
    color: '#8A7A9A',
    
    whatItIs: 'Golpear la cuerda con el dedo para producir una nota sin usar la púa.',
    howToDo: [
      'Toca la primera nota con la púa normalmente',
      'Mientras la cuerda vibra, golpea el siguiente traste con fuerza',
      'El dedo debe caer como un martillo, perpendicular al mástil',
      'Mantén el primer dedo presionado hasta que suene la segunda nota',
    ],
    commonMistakes: [
      'Golpe demasiado suave → la nota no suena. Usa más fuerza en el dedo.',
      'Levantar el primer dedo → pierdes la nota. Mantén ambos dedos presionados.',
    ],
    audioDescription: 'Suena ligado, fluido. La segunda nota es más suave pero clara.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Hammer-ons en una cuerda, tempo lento', exerciseIds: ['hammer-001'] },
      { level: 2, name: 'Precisión', description: 'Hammer-ons con pitch exacto', exerciseIds: ['hammer-002'] },
      { level: 3, name: 'Expresión', description: 'Combinaciones con pull-offs', exerciseIds: ['hammer-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Licks y frases con hammer-ons', exerciseIds: ['hammer-004'] },
    ],
    
    notation: 'h',
    animation: 'bounce',
  },
  
  // PULL-OFF
  {
    id: 'pull_off',
    name: 'Pull-off',
    nameEn: 'Pull-off',
    icon: 'pull',
    hand: 'left',
    color: '#C9A060',
    
    whatItIs: 'Tirar de la cuerda con el dedo para producir una nota más baja sin púa.',
    howToDo: [
      'Coloca ambos dedos en los trastes antes de empezar',
      'Toca la nota alta con la púa',
      'Tira el dedo superior hacia abajo (como un pequeño rasgueo)',
      'El dedo inferior ya debe estar presionado para sonar',
    ],
    commonMistakes: [
      'Levantar en lugar de tirar → nota muerta. Tira lateralmente, no arriba.',
      'Dedo inferior no presionado → silencio. Prepara ambos dedos antes.',
    ],
    audioDescription: 'Suena descendente, ligado. Similar al hammer-on pero hacia abajo.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Pull-offs simples, tempo lento', exerciseIds: ['pulloff-001'] },
      { level: 2, name: 'Precisión', description: 'Pull-offs con volumen consistente', exerciseIds: ['pulloff-002'] },
      { level: 3, name: 'Expresión', description: 'Trills (hammer + pull rápidos)', exerciseIds: ['pulloff-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Frases legato completas', exerciseIds: ['pulloff-004'] },
    ],
    
    notation: 'p',
    animation: 'curve',
  },
  
  // SLIDE
  {
    id: 'slide',
    name: 'Slide',
    nameEn: 'Slide',
    icon: 'slide',
    hand: 'left',
    color: '#6A8A9A',
    
    whatItIs: 'Deslizar el dedo por la cuerda de un traste a otro manteniendo la presión.',
    howToDo: [
      'Toca la primera nota con la púa',
      'Mantén presión constante mientras deslizas',
      'El dedo nunca se levanta de la cuerda',
      'Llega al traste destino y mantén la presión',
    ],
    commonMistakes: [
      'Presión inconsistente → nota muerta. Mantén presión firme todo el camino.',
      'Deslizar demasiado rápido → saltas notas. Controla la velocidad.',
    ],
    audioDescription: 'Suena como un "glissando" continuo entre dos notas.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Slides cortos (2-3 trastes)', exerciseIds: ['slide-001'] },
      { level: 2, name: 'Precisión', description: 'Slides largos con parada exacta', exerciseIds: ['slide-002'] },
      { level: 3, name: 'Expresión', description: 'Slides con diferentes velocidades', exerciseIds: ['slide-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Conexiones de posiciones', exerciseIds: ['slide-004'] },
    ],
    
    notation: 's',
    animation: 'slide',
  },
  
  // BEND (Half Step)
  {
    id: 'bend_half',
    name: 'Bend (½ tono)',
    nameEn: 'Half Step Bend',
    icon: 'bend_half',
    hand: 'left',
    color: '#B85A5A',
    
    whatItIs: 'Empujar la cuerda hacia arriba para subir el tono medio paso (1 traste).',
    howToDo: [
      'Usa 2-3 dedos juntos para más fuerza',
      'Empuja la cuerda hacia arriba (hacia tu cara)',
      'El movimiento viene del giro de muñeca, no solo dedos',
      'Escucha: debe sonar como el siguiente traste',
    ],
    commonMistakes: [
      'Bend insuficiente → nota desafinada. Escucha la nota objetivo primero.',
      'Solo usar un dedo → falta fuerza. Refuerza con dedos adicionales.',
    ],
    audioDescription: 'La nota sube gradualmente medio tono. Debe sonar afinada al llegar.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Bends de medio tono, cuerda 2', exerciseIds: ['bend-001'] },
      { level: 2, name: 'Precisión', description: 'Afinación exacta del bend', exerciseIds: ['bend-002'] },
      { level: 3, name: 'Expresión', description: 'Velocidad variable del bend', exerciseIds: ['bend-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Bends en frases blues', exerciseIds: ['bend-004'] },
    ],
    
    notation: 'b½',
    animation: 'curve',
  },
  
  // BEND (Full Step)
  {
    id: 'bend_full',
    name: 'Bend (1 tono)',
    nameEn: 'Full Step Bend',
    icon: 'bend_full',
    hand: 'left',
    color: '#C4785A',
    
    whatItIs: 'Empujar la cuerda para subir el tono un paso completo (2 trastes).',
    howToDo: [
      'Usa siempre 3 dedos de apoyo',
      'El giro de muñeca es esencial',
      'Empuja más que en el medio tono',
      'Referencia: debe sonar como 2 trastes arriba',
    ],
    commonMistakes: [
      'Quedarse corto → nota desafinada. Practica tocando la nota objetivo primero.',
      'Tensión excesiva → fatiga. Relaja el brazo, usa la muñeca.',
    ],
    audioDescription: 'Subida expresiva de un tono completo. El sonido característico del blues.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Bends de tono completo', exerciseIds: ['bend-005'] },
      { level: 2, name: 'Precisión', description: 'Afinación perfecta', exerciseIds: ['bend-006'] },
      { level: 3, name: 'Expresión', description: 'Bend + release', exerciseIds: ['bend-007'] },
      { level: 4, name: 'Contexto Musical', description: 'Bends en solos', exerciseIds: ['bend-008'] },
    ],
    
    notation: 'b',
    animation: 'curve',
  },
  
  // VIBRATO
  {
    id: 'vibrato',
    name: 'Vibrato',
    nameEn: 'Vibrato',
    icon: 'vibrato',
    hand: 'left',
    color: '#7AAA9A',
    
    whatItIs: 'Oscilación rápida del tono para dar expresión y vida a las notas largas.',
    howToDo: [
      'Presiona la nota firmemente',
      'Haz pequeños bends rítmicos arriba y abajo',
      'El movimiento debe ser regular y controlado',
      'La velocidad define el carácter (lento = blues, rápido = rock)',
    ],
    commonMistakes: [
      'Vibrato demasiado amplio → desafina. Mantén la oscilación pequeña.',
      'Vibrato irregular → suena amateur. Practica con metrónomo.',
    ],
    audioDescription: 'La nota "tiembla" de forma musical, como la voz de un cantante.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Vibrato lento y controlado', exerciseIds: ['vibrato-001'] },
      { level: 2, name: 'Precisión', description: 'Vibrato con timing regular', exerciseIds: ['vibrato-002'] },
      { level: 3, name: 'Expresión', description: 'Diferentes velocidades', exerciseIds: ['vibrato-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Vibrato en notas finales', exerciseIds: ['vibrato-004'] },
    ],
    
    notation: '~',
    animation: 'wave',
  },
  
  // POSITION SHIFT
  {
    id: 'position_shift',
    name: 'Cambio de Posición',
    nameEn: 'Position Shift',
    icon: 'shift',
    hand: 'left',
    color: '#5A8A7A',
    
    whatItIs: 'Mover toda la mano a una nueva posición en el mástil.',
    howToDo: [
      'Planifica el momento del cambio',
      'Usa una nota de conexión (pivot note)',
      'Desliza suavemente sin levantar completamente',
      'El pulgar guía el movimiento',
    ],
    commonMistakes: [
      'Cambio brusco → interrupción musical. Practica la transición aislada.',
      'Perderse → mira el traste destino antes de moverte.',
    ],
    audioDescription: 'La transición debe ser fluida, sin pausas audibles.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Cambios de 2-3 trastes', exerciseIds: ['shift-001'] },
      { level: 2, name: 'Precisión', description: 'Cambios grandes (5+ trastes)', exerciseIds: ['shift-002'] },
      { level: 3, name: 'Expresión', description: 'Cambios con slides', exerciseIds: ['shift-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Conectar cajas pentatónicas', exerciseIds: ['shift-004'] },
    ],
    
    notation: '',
    animation: 'slide',
  },
  
  // FINGER ROLLING
  {
    id: 'finger_rolling',
    name: 'Rodado de Dedo',
    nameEn: 'Finger Rolling',
    icon: 'roll',
    hand: 'left',
    color: '#B89A7A',
    
    whatItIs: 'Usar un dedo para tocar notas en cuerdas adyacentes rodando la articulación.',
    howToDo: [
      'Presiona la primera cuerda con la punta del dedo',
      'Rueda el dedo para presionar la siguiente cuerda',
      'Solo una cuerda debe sonar a la vez',
      'El dedo se "aplana" al rodar',
    ],
    commonMistakes: [
      'Ambas cuerdas suenan → levantas muy poco. Rueda más el dedo.',
      'Nota muerta → presión insuficiente. Mantén firmeza al rodar.',
    ],
    audioDescription: 'Notas separadas y limpias en cuerdas adyacentes.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Rolling entre 2 cuerdas', exerciseIds: ['roll-001'] },
      { level: 2, name: 'Precisión', description: 'Rolling limpio a tempo', exerciseIds: ['roll-002'] },
      { level: 3, name: 'Expresión', description: 'Rolling en arpegios', exerciseIds: ['roll-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Frases sweep picking', exerciseIds: ['roll-004'] },
    ],
    
    notation: '',
    animation: 'curve',
  },
];

// =============================================
// RIGHT HAND TECHNIQUES
// =============================================

export const RIGHT_HAND_TECHNIQUES: TechniqueDefinition[] = [
  // ALTERNATE PICKING
  {
    id: 'alternate_picking',
    name: 'Púa Alternada',
    nameEn: 'Alternate Picking',
    icon: 'alternate',
    hand: 'right',
    color: '#D4A574',
    
    whatItIs: 'Alternar constantemente entre púa abajo y púa arriba.',
    howToDo: [
      'Abajo en beats (1, 2, 3, 4)',
      'Arriba en "y" (y-1-y-2-y-3-y-4)',
      'Movimiento pequeño y eficiente',
      'La muñeca hace el trabajo, no el brazo',
    ],
    commonMistakes: [
      'Movimiento muy grande → lento. Minimiza el recorrido de la púa.',
      'Tensión → fatiga. Relaja la mano y usa menos fuerza.',
    ],
    audioDescription: 'Ataque consistente en cada nota, ritmo perfectamente regular.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Alternate picking en una cuerda', exerciseIds: ['alt-001'] },
      { level: 2, name: 'Precisión', description: 'Cruce de cuerdas', exerciseIds: ['alt-002'] },
      { level: 3, name: 'Expresión', description: 'Velocidad aumentada', exerciseIds: ['alt-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Scales y licks rápidos', exerciseIds: ['alt-004'] },
    ],
    
    notation: '',
    animation: 'bounce',
  },
  
  // PALM MUTE
  {
    id: 'palm_mute',
    name: 'Palm Mute',
    nameEn: 'Palm Mute',
    icon: 'palm',
    hand: 'right',
    color: '#5A7A6A',
    
    whatItIs: 'Apoyar la palma de la mano en las cuerdas cerca del puente para silenciarlas parcialmente.',
    howToDo: [
      'Apoya el borde de la palma en el puente',
      'Las cuerdas deben vibrar pero amortiguadas',
      'Ajusta la presión para más o menos "mute"',
      'Usa púa hacia abajo para más punch',
    ],
    commonMistakes: [
      'Demasiado mute → notas muertas. Aleja un poco la mano del puente.',
      'Poco mute → suena normal. Acerca más la palma.',
    ],
    audioDescription: 'Sonido "chug" percusivo, corto y definido. Característico del rock/metal.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Palm mute en cuerda grave', exerciseIds: ['palm-001'] },
      { level: 2, name: 'Precisión', description: 'Alternar mute y abierto', exerciseIds: ['palm-002'] },
      { level: 3, name: 'Expresión', description: 'Diferentes intensidades', exerciseIds: ['palm-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Riffs de rock/metal', exerciseIds: ['palm-004'] },
    ],
    
    notation: 'PM',
    animation: 'pulse',
  },
  
  // ACCENTED PICKING
  {
    id: 'accented_picking',
    name: 'Acentos',
    nameEn: 'Accented Picking',
    icon: 'accent',
    hand: 'right',
    color: '#C9A060',
    
    whatItIs: 'Tocar algunas notas más fuerte que otras para crear énfasis rítmico.',
    howToDo: [
      'Identifica qué notas deben ser fuertes',
      'Usa más fuerza y velocidad de púa en esas notas',
      'Las notas no acentuadas deben ser suaves',
      'El contraste crea el groove',
    ],
    commonMistakes: [
      'Todo igual → aburrido. Exagera los acentos al principio.',
      'Acentos en lugar equivocado → pierde el groove. Escucha el original.',
    ],
    audioDescription: 'Algunas notas destacan sobre otras, creando un patrón rítmico dinámico.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Acentos en tiempo 1', exerciseIds: ['accent-001'] },
      { level: 2, name: 'Precisión', description: 'Acentos en tiempos 2 y 4', exerciseIds: ['accent-002'] },
      { level: 3, name: 'Expresión', description: 'Patrones de acentos complejos', exerciseIds: ['accent-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Acentos en riffs reales', exerciseIds: ['accent-004'] },
    ],
    
    notation: '>',
    animation: 'bounce',
  },
  
  // LEGATO (Combined)
  {
    id: 'legato',
    name: 'Legato',
    nameEn: 'Legato',
    icon: 'legato',
    hand: 'right',
    color: '#9A7A6A',
    
    whatItIs: 'Tocar fluidamente usando mínimas púas, maximizando hammer-ons y pull-offs.',
    howToDo: [
      'Solo usa púa para iniciar la frase',
      'Hammer-ons para subir, pull-offs para bajar',
      'Mantén presión constante en la mano izquierda',
      'El sonido debe ser fluido, sin ataques duros',
    ],
    commonMistakes: [
      'Notas desiguales → practica hammer/pull aislados primero.',
      'Falta de sustain → más fuerza en mano izquierda.',
    ],
    audioDescription: 'Sonido fluido, cantante. Las notas se conectan sin separación.',
    
    levels: [
      { level: 1, name: 'Control Básico', description: 'Frases legato de 3 notas', exerciseIds: ['legato-001'] },
      { level: 2, name: 'Precisión', description: 'Legato en escala', exerciseIds: ['legato-002'] },
      { level: 3, name: 'Expresión', description: 'Legato con timing variado', exerciseIds: ['legato-003'] },
      { level: 4, name: 'Contexto Musical', description: 'Solos legato style', exerciseIds: ['legato-004'] },
    ],
    
    notation: '',
    animation: 'wave',
  },
];

// =============================================
// ALL TECHNIQUES COMBINED
// =============================================

export const ALL_TECHNIQUES: TechniqueDefinition[] = [
  ...LEFT_HAND_TECHNIQUES,
  ...RIGHT_HAND_TECHNIQUES,
];

// Helper functions
export const getTechniqueById = (id: string): TechniqueDefinition | undefined => {
  return ALL_TECHNIQUES.find(t => t.id === id);
};

export const getTechniqueByNotation = (notation: string): TechniqueDefinition | undefined => {
  const notationMap: Record<string, string> = {
    'h': 'hammer_on',
    'p': 'pull_off',
    's': 'slide',
    'b': 'bend_full',
    'b½': 'bend_half',
    '~': 'vibrato',
    'PM': 'palm_mute',
    '>': 'accented_picking',
  };
  const id = notationMap[notation];
  return id ? getTechniqueById(id) : undefined;
};

// Map solo technique strings to technique IDs
export const mapSoloTechniqueToId = (technique?: string): string | undefined => {
  if (!technique) return undefined;
  const map: Record<string, string> = {
    'hammer': 'hammer_on',
    'pull': 'pull_off',
    'slide': 'slide',
    'bend': 'bend_full',
    'vibrato': 'vibrato',
  };
  return map[technique];
};

export const getTechniquesByHand = (hand: TechniqueHand): TechniqueDefinition[] => {
  return ALL_TECHNIQUES.filter(t => t.hand === hand);
};
