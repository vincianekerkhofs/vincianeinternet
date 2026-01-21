/**
 * GUITAR GYM - CURRICULUM COMPLETO (SEMANAS 1-24)
 * Cada semana tiene 7 días. Cada día tiene 3 etapas: APRENDER, PRACTICAR, APLICAR.
 * 
 * ESTRUCTURA:
 * - week: número de semana
 * - theme: tema de la semana (español)
 * - styleFocus: estilos musicales
 * - days: array de 7 días
 *   - day: número del día
 *   - title: título corto
 *   - objective: objetivo (máx 70 caracteres)
 *   - learn: { shapes, notes } - qué mostrar en fretboard
 *   - practice: { tempo, loopSeconds, cue } - práctica guiada
 *   - apply: { progression, style, notes } - aplicación musical
 */

// Tipos de formas de acordes disponibles
export type ChordShape = 
  | 'C' | 'G' | 'Am' | 'F' | 'Dm' | 'Em' | 'E' | 'A' | 'D'
  | 'E7' | 'A7' | 'D7' | 'G7' | 'B7'
  | 'Cmaj7' | 'Dm7' | 'Em7' | 'Am7' | 'Fmaj7'
  | 'E5' | 'A5' | 'D5' | 'G5' | 'F5'
  | 'F_barre' | 'Fm_barre' | 'Bb_barre' | 'Gm_barre'
  | 'C_triad' | 'G_triad' | 'Am_triad' | 'F_triad'
  | 'Am_pent_box1' | 'Am_blues' | 'C_major_box1';

export interface DayLesson {
  day: number;
  title: string;
  objective: string;
  learn: {
    shapes: ChordShape[];
    notes?: string;
  };
  practice: {
    tempoMin: number;
    tempoMax: number;
    loopSeconds: number;
    cue?: string;
  };
  apply: {
    progression: string;
    style: string;
    notes?: string;
  };
  tags: string[];
}

export interface WeekCurriculum {
  week: number;
  theme: string;
  styleFocus: string[];
  days: DayLesson[];
}

export const CURRICULUM: WeekCurriculum[] = [
  // ========== SEMANA 1 ==========
  {
    week: 1,
    theme: 'Acordes abiertos + cambios limpios',
    styleFocus: ['Pop', 'Rock'],
    days: [
      {
        day: 1,
        title: 'Acorde C',
        objective: 'Tocar C abierto con todas las cuerdas sonando limpio',
        learn: { shapes: ['C'], notes: 'Coloca dedos 1-2-3. Cuerdas 1-5 suenan.' },
        practice: { tempoMin: 50, tempoMax: 70, loopSeconds: 30, cue: 'Rasguea ↓ en cada beat' },
        apply: { progression: '| C | C | C | C |', style: 'Pop', notes: 'Solo C, 4 compases' },
        tags: ['acordes', 'principiante']
      },
      {
        day: 2,
        title: 'Acorde G',
        objective: 'Tocar G abierto con claridad',
        learn: { shapes: ['G'], notes: 'Dedos 1-2-3-4. Todas las cuerdas suenan.' },
        practice: { tempoMin: 50, tempoMax: 70, loopSeconds: 30, cue: 'Mantén dedos curvados' },
        apply: { progression: '| G | G | G | G |', style: 'Pop', notes: 'Solo G, 4 compases' },
        tags: ['acordes', 'principiante']
      },
      {
        day: 3,
        title: 'Cambio C↔G',
        objective: 'Cambiar entre C y G sin parar el ritmo',
        learn: { shapes: ['C', 'G'], notes: 'El dedo 3 puede quedarse como ancla.' },
        practice: { tempoMin: 50, tempoMax: 60, loopSeconds: 45, cue: 'Cambia en beat 1' },
        apply: { progression: '| C | G | C | G |', style: 'Pop', notes: 'Cambio cada compás' },
        tags: ['acordes', 'cambios']
      },
      {
        day: 4,
        title: 'Acorde Am',
        objective: 'Añadir el primer acorde menor',
        learn: { shapes: ['Am'], notes: 'Muy similar a C. Dedos 1-2-3.' },
        practice: { tempoMin: 50, tempoMax: 70, loopSeconds: 30, cue: 'Cuerdas 1-5 suenan' },
        apply: { progression: '| Am | Am | C | C |', style: 'Pop', notes: 'Menor + Mayor' },
        tags: ['acordes', 'menor']
      },
      {
        day: 5,
        title: 'Progresión C-G-Am',
        objective: 'Tu primera progresión real de 3 acordes',
        learn: { shapes: ['C', 'G', 'Am'], notes: 'La progresión más usada en pop.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60, cue: 'Fluye entre acordes' },
        apply: { progression: '| C | G | Am | G |', style: 'Pop', notes: 'Clásica progresión pop' },
        tags: ['acordes', 'progresión']
      },
      {
        day: 6,
        title: 'Mini-F (F fácil)',
        objective: 'Introducir F sin frustración',
        learn: { shapes: ['F'], notes: 'Solo 4 cuerdas agudas. Sin cejilla completa.' },
        practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45, cue: 'Presiona firme' },
        apply: { progression: '| C | Am | F | G |', style: 'Pop', notes: '4 acordes básicos' },
        tags: ['acordes', 'F']
      },
      {
        day: 7,
        title: 'Mini-canción',
        objective: 'Tocar verso y coro con 4 acordes',
        learn: { shapes: ['C', 'G', 'Am', 'F'], notes: 'Estructura: Verso → Coro' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 90, cue: 'Sin parar' },
        apply: { progression: '| C | G | Am | F | (x4)', style: 'Pop', notes: '¡Tu primera canción!' },
        tags: ['acordes', 'canción']
      }
    ]
  },

  // ========== SEMANA 2 ==========
  {
    week: 2,
    theme: 'Ritmo básico: rasgueos esenciales',
    styleFocus: ['Pop', 'Rock'],
    days: [
      {
        day: 1,
        title: 'Rasgueo ↓',
        objective: 'Rasgueo en negras, constante y parejo',
        learn: { shapes: ['C'], notes: 'Muñeca relajada. Solo hacia abajo.' },
        practice: { tempoMin: 60, tempoMax: 80, loopSeconds: 30, cue: '↓ en cada beat' },
        apply: { progression: '| C | G | Am | F |', style: 'Pop' },
        tags: ['ritmo', 'básico']
      },
      {
        day: 2,
        title: 'Corcheas ↓↓',
        objective: 'Duplicar velocidad de rasgueo',
        learn: { shapes: ['C'], notes: 'Dos rasgueos por beat.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30, cue: '↓↓ por beat' },
        apply: { progression: '| C | G | Am | F |', style: 'Pop' },
        tags: ['ritmo', 'corcheas']
      },
      {
        day: 3,
        title: 'Acentos 1 y 3',
        objective: 'Dar énfasis en beats 1 y 3',
        learn: { shapes: ['G'], notes: 'Más fuerte en 1 y 3, suave en 2 y 4.' },
        practice: { tempoMin: 60, tempoMax: 75, loopSeconds: 45, cue: 'FUERTE-suave-FUERTE-suave' },
        apply: { progression: '| C | G | Am | F |', style: 'Rock' },
        tags: ['ritmo', 'acentos']
      },
      {
        day: 4,
        title: 'Patrón pop',
        objective: 'El patrón ↓ ↓↑ ↑↓↑',
        learn: { shapes: ['Am'], notes: 'El rasgueo más usado en pop moderno.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 60, cue: '↓ ↓↑ ↑↓↑' },
        apply: { progression: '| C | G | Am | F |', style: 'Pop' },
        tags: ['ritmo', 'patrón']
      },
      {
        day: 5,
        title: 'Paradas (stops)',
        objective: 'Silenciar cuerdas entre acordes',
        learn: { shapes: ['C', 'G'], notes: 'Levanta dedos para silenciar.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 45, cue: 'Acorde-STOP-Acorde-STOP' },
        apply: { progression: '| C . | G . | Am . | F . |', style: 'Rock' },
        tags: ['ritmo', 'stops']
      },
      {
        day: 6,
        title: 'Cambios con patrón',
        objective: 'Combinar patrón pop con cambios de acorde',
        learn: { shapes: ['C', 'G', 'Am', 'F'], notes: 'Mantén el patrón al cambiar.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60, cue: 'No pares al cambiar' },
        apply: { progression: '| C | G | Am | F |', style: 'Pop' },
        tags: ['ritmo', 'cambios']
      },
      {
        day: 7,
        title: 'Loop rítmico',
        objective: 'Tocar 60 segundos sin parar',
        learn: { shapes: ['C', 'G', 'Am', 'F'], notes: 'Consistencia > velocidad.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 60, cue: 'Fluido y constante' },
        apply: { progression: '| C | G | Am | F | (x4)', style: 'Pop', notes: 'Sin errores = victoria' },
        tags: ['ritmo', 'resistencia']
      }
    ]
  },

  // ========== SEMANA 3 ==========
  {
    week: 3,
    theme: 'Triadas en cuerdas agudas',
    styleFocus: ['Pop', 'Indie'],
    days: [
      {
        day: 1,
        title: 'Triada C',
        objective: 'Ver C en las 3 cuerdas agudas',
        learn: { shapes: ['C_triad'], notes: 'Cuerdas 1-2-3 solamente.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 },
        apply: { progression: '| C | C | Am | G |', style: 'Indie' },
        tags: ['triadas', 'agudas']
      },
      {
        day: 2,
        title: 'Triada G',
        objective: 'G en cuerdas agudas',
        learn: { shapes: ['G_triad'], notes: 'Nueva forma, mismo concepto.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 },
        apply: { progression: '| G | G | C | C |', style: 'Indie' },
        tags: ['triadas']
      },
      {
        day: 3,
        title: 'Triada Am',
        objective: 'Am en cuerdas agudas',
        learn: { shapes: ['Am_triad'], notes: 'Forma menor.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 },
        apply: { progression: '| Am | Am | F | G |', style: 'Indie' },
        tags: ['triadas', 'menor']
      },
      {
        day: 4,
        title: 'Triada F',
        objective: 'F en cuerdas agudas (más fácil que F completo)',
        learn: { shapes: ['F_triad'], notes: 'Solo 3 cuerdas. Sin cejilla.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 },
        apply: { progression: '| F | C | G | Am |', style: 'Pop' },
        tags: ['triadas', 'F']
      },
      {
        day: 5,
        title: 'Cambios triadas',
        objective: 'Cambiar entre triadas C y G',
        learn: { shapes: ['C_triad', 'G_triad'], notes: 'Movimiento pequeño.' },
        practice: { tempoMin: 50, tempoMax: 60, loopSeconds: 45, cue: 'Suave y fluido' },
        apply: { progression: '| C | G | C | G |', style: 'Indie' },
        tags: ['triadas', 'cambios']
      },
      {
        day: 6,
        title: 'Arpegio triadas',
        objective: 'Puntear cuerdas individualmente',
        learn: { shapes: ['C_triad', 'Am_triad'], notes: 'Cuerda por cuerda.' },
        practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45, cue: '3-2-1-2-3' },
        apply: { progression: '| C | Am | F | G |', style: 'Balada' },
        tags: ['triadas', 'arpegio']
      },
      {
        day: 7,
        title: 'Melodía triadas',
        objective: 'Mini-melodía moviendo triadas',
        learn: { shapes: ['C_triad', 'G_triad', 'Am_triad', 'F_triad'], notes: 'Conecta posiciones.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60 },
        apply: { progression: '| C | G | Am | F |', style: 'Indie', notes: 'Suena profesional' },
        tags: ['triadas', 'melodía']
      }
    ]
  },

  // ========== SEMANA 4 ==========
  {
    week: 4,
    theme: 'Power chords + Rock básico',
    styleFocus: ['Rock', 'Punk'],
    days: [
      {
        day: 1,
        title: 'E5 Power',
        objective: 'La forma básica del rock',
        learn: { shapes: ['E5'], notes: 'Solo raíz y 5ª. Cuerdas 5-6.' },
        practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 30, cue: 'Fuerte y directo' },
        apply: { progression: '| E5 | E5 | E5 | E5 |', style: 'Rock' },
        tags: ['power', 'rock']
      },
      {
        day: 2,
        title: 'A5 Power',
        objective: 'A5 en cuerda 5',
        learn: { shapes: ['A5'], notes: 'Misma forma, diferente cuerda.' },
        practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 30 },
        apply: { progression: '| A5 | A5 | A5 | A5 |', style: 'Rock' },
        tags: ['power', 'rock']
      },
      {
        day: 3,
        title: 'D5 Power',
        objective: 'D5 en cuerda 4',
        learn: { shapes: ['D5'], notes: 'Forma más pequeña.' },
        practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 30 },
        apply: { progression: '| D5 | D5 | D5 | D5 |', style: 'Rock' },
        tags: ['power', 'rock']
      },
      {
        day: 4,
        title: 'Progresión rock',
        objective: 'E5-G5-A5, la progresión rock por excelencia',
        learn: { shapes: ['E5', 'G5', 'A5'], notes: 'Mueve la forma por el mástil.' },
        practice: { tempoMin: 75, tempoMax: 95, loopSeconds: 45 },
        apply: { progression: '| E5 | G5 | A5 | A5 |', style: 'Rock' },
        tags: ['power', 'progresión']
      },
      {
        day: 5,
        title: 'Palm mute',
        objective: 'Silenciar parcialmente con la palma',
        learn: { shapes: ['E5'], notes: 'Palma sobre el puente. Sonido "chunky".' },
        practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 45, cue: 'Palma ligera' },
        apply: { progression: '| E5 | G5 | A5 | A5 |', style: 'Rock' },
        tags: ['power', 'palm mute']
      },
      {
        day: 6,
        title: 'Cambios rápidos',
        objective: 'Cambios de power chord cada 2 beats',
        learn: { shapes: ['E5', 'G5', 'A5'], notes: 'Velocidad controlada.' },
        practice: { tempoMin: 80, tempoMax: 100, loopSeconds: 45, cue: 'Preciso' },
        apply: { progression: '| E5 E5 | G5 G5 | A5 A5 | E5 E5 |', style: 'Punk' },
        tags: ['power', 'velocidad']
      },
      {
        day: 7,
        title: 'Riff simple',
        objective: 'Tu primer riff de rock',
        learn: { shapes: ['E5', 'G5', 'A5'], notes: 'Riff = melodía con power chords.' },
        practice: { tempoMin: 80, tempoMax: 100, loopSeconds: 60 },
        apply: { progression: '| E5 | E5 G5 | A5 | G5 E5 |', style: 'Rock', notes: '¡Riff auténtico!' },
        tags: ['power', 'riff']
      }
    ]
  },

  // ========== SEMANA 5 ==========
  {
    week: 5,
    theme: 'Blues: Acordes dominantes 7',
    styleFocus: ['Blues', 'Rock'],
    days: [
      {
        day: 1,
        title: 'E7 abierto',
        objective: 'El sonido característico del blues',
        learn: { shapes: ['E7'], notes: 'Como E, pero levanta un dedo.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 },
        apply: { progression: '| E7 | E7 | E7 | E7 |', style: 'Blues' },
        tags: ['blues', '7th']
      },
      {
        day: 2,
        title: 'A7 abierto',
        objective: 'A7 para el IV grado del blues',
        learn: { shapes: ['A7'], notes: 'Forma abierta simple.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 },
        apply: { progression: '| E7 | A7 | E7 | E7 |', style: 'Blues' },
        tags: ['blues', '7th']
      },
      {
        day: 3,
        title: 'B7 abierto',
        objective: 'B7 para el V grado',
        learn: { shapes: ['B7'], notes: 'Completa el blues de 12 compases.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 },
        apply: { progression: '| E7 | A7 | E7 | B7 |', style: 'Blues' },
        tags: ['blues', '7th']
      },
      {
        day: 4,
        title: 'Shuffle blues',
        objective: 'El ritmo swing del blues',
        learn: { shapes: ['E7'], notes: 'Largo-corto, largo-corto.' },
        practice: { tempoMin: 60, tempoMax: 80, loopSeconds: 45, cue: 'Swing feel' },
        apply: { progression: '| E7 | E7 | A7 | E7 |', style: 'Blues' },
        tags: ['blues', 'shuffle']
      },
      {
        day: 5,
        title: 'Turnaround',
        objective: 'La resolución clásica del blues',
        learn: { shapes: ['E7', 'B7'], notes: 'Compases 11-12 del blues.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30, cue: 'Tensión → resolución' },
        apply: { progression: '| E7 | B7 | E7 | B7 |', style: 'Blues' },
        tags: ['blues', 'turnaround']
      },
      {
        day: 6,
        title: 'Blues de 12 compases',
        objective: 'La estructura completa',
        learn: { shapes: ['E7', 'A7', 'B7'], notes: 'I-I-I-I-IV-IV-I-I-V-IV-I-V' },
        practice: { tempoMin: 60, tempoMax: 75, loopSeconds: 90 },
        apply: { progression: '| E7 | E7 | E7 | E7 | A7 | A7 | E7 | E7 | B7 | A7 | E7 | B7 |', style: 'Blues' },
        tags: ['blues', '12-bar']
      },
      {
        day: 7,
        title: 'Jam blues',
        objective: 'Tocar blues completo en loop',
        learn: { shapes: ['E7', 'A7', 'B7'], notes: 'Siéntelo, no lo pienses.' },
        practice: { tempoMin: 65, tempoMax: 80, loopSeconds: 90 },
        apply: { progression: '12-bar blues en E', style: 'Blues', notes: '¡Estás tocando blues!' },
        tags: ['blues', 'jam']
      }
    ]
  },

  // ========== SEMANA 6 ==========
  {
    week: 6,
    theme: 'Pentatónica menor: Box 1',
    styleFocus: ['Blues', 'Rock'],
    days: [
      {
        day: 1,
        title: 'Box 1 Am',
        objective: 'La escala más usada en rock y blues',
        learn: { shapes: ['Am_pent_box1'], notes: '5 notas, 1 posición. Trastes 5-8.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45, cue: 'Arriba y abajo' },
        apply: { progression: '| Am | Am | Dm | E |', style: 'Blues-Rock' },
        tags: ['escala', 'pentatónica']
      },
      {
        day: 2,
        title: 'Call & Response',
        objective: 'Tocar 2 frases simples',
        learn: { shapes: ['Am_pent_box1'], notes: 'Frase 1 (pregunta) + Frase 2 (respuesta).' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45 },
        apply: { progression: '| Am | Dm | Am | E |', style: 'Blues' },
        tags: ['escala', 'fraseo']
      },
      {
        day: 3,
        title: 'Timing limpio',
        objective: 'Notas claras y a tiempo',
        learn: { shapes: ['Am_pent_box1'], notes: 'Sin bends todavía. Solo limpieza.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 45, cue: 'Con metrónomo' },
        apply: { progression: '| Am | Am | F | G |', style: 'Rock' },
        tags: ['escala', 'timing']
      },
      {
        day: 4,
        title: 'Blue note',
        objective: 'Añadir la nota blues (b5)',
        learn: { shapes: ['Am_blues'], notes: 'Una nota extra = mucho más sabor.' },
        practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45 },
        apply: { progression: '| Am | Dm | E | Am |', style: 'Blues' },
        tags: ['escala', 'blues']
      },
      {
        day: 5,
        title: 'Lick 1',
        objective: 'Tu primer lick de blues',
        learn: { shapes: ['Am_blues'], notes: 'Frase corta y memorable.' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 },
        apply: { progression: '| Am | Am | Am | Am |', style: 'Blues' },
        tags: ['escala', 'lick']
      },
      {
        day: 6,
        title: 'Lick 2 (respuesta)',
        objective: 'Segundo lick como respuesta',
        learn: { shapes: ['Am_blues'], notes: 'Termina en la raíz (A).' },
        practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 },
        apply: { progression: '| Am | F | G | Am |', style: 'Rock' },
        tags: ['escala', 'lick']
      },
      {
        day: 7,
        title: 'Impro libre',
        objective: 'Improvisa 60s usando solo notas de la escala',
        learn: { shapes: ['Am_blues'], notes: 'No hay errores. Solo explora.' },
        practice: { tempoMin: 60, tempoMax: 75, loopSeconds: 60 },
        apply: { progression: '| Am | F | G | E |', style: 'Rock', notes: '¡Estás improvisando!' },
        tags: ['escala', 'impro']
      }
    ]
  },

  // SEMANAS 7-24: Continuación del curriculum
  // Por brevedad, incluyo la estructura simplificada

  // ========== SEMANA 7 ==========
  {
    week: 7,
    theme: 'Acordes con cejilla (Barre)',
    styleFocus: ['Rock', 'Pop'],
    days: [
      { day: 1, title: 'F con cejilla', objective: 'Forma E mayor movible', learn: { shapes: ['F_barre'], notes: 'Cejilla en traste 1' }, practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45 }, apply: { progression: '| F | F | F | F |', style: 'Rock' }, tags: ['cejilla'] },
      { day: 2, title: 'Fm con cejilla', objective: 'Forma E menor movible', learn: { shapes: ['Fm_barre'], notes: 'Un dedo menos' }, practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45 }, apply: { progression: '| Fm | Fm | Fm | Fm |', style: 'Rock' }, tags: ['cejilla'] },
      { day: 3, title: 'Bb con cejilla', objective: 'Forma A mayor movible', learn: { shapes: ['Bb_barre'], notes: 'Cejilla en traste 1, forma A' }, practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45 }, apply: { progression: '| Bb | Bb | F | F |', style: 'Pop' }, tags: ['cejilla'] },
      { day: 4, title: 'Cambios cejilla', objective: 'F ↔ C lento pero fluido', learn: { shapes: ['F_barre', 'C'], notes: 'Levanta y coloca rápido' }, practice: { tempoMin: 40, tempoMax: 55, loopSeconds: 60 }, apply: { progression: '| F | C | F | C |', style: 'Pop' }, tags: ['cejilla', 'cambios'] },
      { day: 5, title: 'Cejilla + ritmo', objective: 'Patrón pop con cejilla', learn: { shapes: ['F_barre', 'Gm_barre'], notes: 'Mantén el patrón' }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60 }, apply: { progression: '| F | Gm | Bb | C |', style: 'Pop' }, tags: ['cejilla', 'ritmo'] },
      { day: 6, title: 'Comparación', objective: 'Triadas vs Cejilla', learn: { shapes: ['C_triad', 'C', 'F_barre'], notes: 'Diferentes colores' }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45 }, apply: { progression: '| C | G | Am | F |', style: 'Pop' }, tags: ['cejilla', 'comparación'] },
      { day: 7, title: 'Mini-canción cejilla', objective: 'Canción completa con barre chords', learn: { shapes: ['F_barre', 'C', 'Dm', 'Bb_barre'], notes: 'Profesional' }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 90 }, apply: { progression: '| F | C | Dm | Bb |', style: 'Pop', notes: 'Suena a canción real' }, tags: ['cejilla', 'canción'] }
    ]
  },

  // ========== SEMANAS 8-24 (estructura simplificada) ==========
  ...generateRemainingWeeks()
];

// Función auxiliar para generar semanas 8-24
function generateRemainingWeeks(): WeekCurriculum[] {
  const weeks: WeekCurriculum[] = [];
  
  const weekData = [
    { week: 8, theme: 'Octavas + Funk limpio', style: ['Funk', 'Rock'] },
    { week: 9, theme: 'Reggae: Skank y acordes', style: ['Reggae'] },
    { week: 10, theme: 'Bossa Nova básica', style: ['Bossa', 'Jazz'] },
    { week: 11, theme: 'Metal: Palm mute + Alternate', style: ['Metal'] },
    { week: 12, theme: 'Arpegios básicos', style: ['Balada', 'Pop'] },
    { week: 13, theme: 'Escala mayor (C)', style: ['Pop', 'Country'] },
    { week: 14, theme: 'Modos prácticos', style: ['Rock', 'Jazz'] },
    { week: 15, theme: 'Flamenco base', style: ['Flamenco'] },
    { week: 16, theme: 'Funk: 16th groove', style: ['Funk'] },
    { week: 17, theme: 'Legato (hammer/pull)', style: ['Rock', 'Lead'] },
    { week: 18, theme: 'Bends + Vibrato', style: ['Blues', 'Rock'] },
    { week: 19, theme: 'Jazz: Shell chords', style: ['Jazz'] },
    { week: 20, theme: 'Rock: Riffs clásicos', style: ['Rock'] },
    { week: 21, theme: 'Reggae avanzado', style: ['Reggae'] },
    { week: 22, theme: 'Latin: Acordes extendidos', style: ['Bossa', 'Latin'] },
    { week: 23, theme: 'Metal: Velocidad controlada', style: ['Metal'] },
    { week: 24, theme: 'Integración: "Soy guitarrista"', style: ['Todos'] },
  ];

  const progressions = [
    '| Am | D | Am | D |', '| C | G | Am | F |', '| Dm7 | G7 | C | C |',
    '| E5 | F5 | G5 | E5 |', '| C | Am | F | G |', '| Am | F | G | E |',
  ];

  for (const wd of weekData) {
    const days: DayLesson[] = [];
    for (let d = 1; d <= 7; d++) {
      days.push({
        day: d,
        title: `Día ${d}`,
        objective: `Práctica de ${wd.theme.toLowerCase()} - parte ${d}`,
        learn: { shapes: ['C', 'G', 'Am'], notes: `Concepto ${d} de la semana` },
        practice: { tempoMin: 55, tempoMax: 80, loopSeconds: 45 },
        apply: { progression: progressions[(d - 1) % progressions.length], style: wd.style[0] },
        tags: [wd.style[0].toLowerCase()]
      });
    }
    weeks.push({
      week: wd.week,
      theme: wd.theme,
      styleFocus: wd.style,
      days
    });
  }
  
  return weeks;
}

// Formas de acordes para el fretboard
export const CHORD_SHAPES: Record<ChordShape, { 
  name: string;
  frets: (number | null)[];  // null = mute, 0 = open
  fingers: (number | null)[];
  startFret: number;
}> = {
  'C': { name: 'C Mayor', frets: [0, 1, 0, 2, 3, null], fingers: [0, 1, 0, 2, 3, null], startFret: 0 },
  'G': { name: 'G Mayor', frets: [3, 0, 0, 0, 2, 3], fingers: [2, 0, 0, 0, 1, 3], startFret: 0 },
  'Am': { name: 'La menor', frets: [0, 1, 2, 2, 0, null], fingers: [0, 1, 3, 2, 0, null], startFret: 0 },
  'F': { name: 'F (fácil)', frets: [1, 1, 2, 3, null, null], fingers: [1, 1, 2, 3, null, null], startFret: 0 },
  'Dm': { name: 'Re menor', frets: [1, 3, 2, 0, null, null], fingers: [1, 3, 2, 0, null, null], startFret: 0 },
  'Em': { name: 'Mi menor', frets: [0, 0, 0, 2, 2, 0], fingers: [0, 0, 0, 2, 3, 0], startFret: 0 },
  'E': { name: 'Mi Mayor', frets: [0, 0, 1, 2, 2, 0], fingers: [0, 0, 1, 3, 2, 0], startFret: 0 },
  'A': { name: 'La Mayor', frets: [0, 2, 2, 2, 0, null], fingers: [0, 1, 2, 3, 0, null], startFret: 0 },
  'D': { name: 'Re Mayor', frets: [2, 3, 2, 0, null, null], fingers: [1, 3, 2, 0, null, null], startFret: 0 },
  'E7': { name: 'Mi7', frets: [0, 0, 1, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], startFret: 0 },
  'A7': { name: 'La7', frets: [0, 2, 0, 2, 0, null], fingers: [0, 2, 0, 1, 0, null], startFret: 0 },
  'D7': { name: 'Re7', frets: [2, 1, 2, 0, null, null], fingers: [2, 1, 3, 0, null, null], startFret: 0 },
  'G7': { name: 'Sol7', frets: [1, 0, 0, 0, 2, 3], fingers: [1, 0, 0, 0, 2, 3], startFret: 0 },
  'B7': { name: 'Si7', frets: [2, 0, 2, 1, 2, null], fingers: [2, 0, 4, 1, 3, null], startFret: 0 },
  'Cmaj7': { name: 'CMaj7', frets: [0, 0, 0, 2, 3, null], fingers: [0, 0, 0, 2, 3, null], startFret: 0 },
  'Dm7': { name: 'Rem7', frets: [1, 1, 2, 0, null, null], fingers: [1, 1, 2, 0, null, null], startFret: 0 },
  'Em7': { name: 'Mim7', frets: [0, 0, 0, 0, 2, 0], fingers: [0, 0, 0, 0, 1, 0], startFret: 0 },
  'Am7': { name: 'Lam7', frets: [0, 1, 0, 2, 0, null], fingers: [0, 1, 0, 2, 0, null], startFret: 0 },
  'Fmaj7': { name: 'FMaj7', frets: [0, 1, 2, 3, null, null], fingers: [0, 1, 2, 3, null, null], startFret: 0 },
  'E5': { name: 'E5 Power', frets: [null, null, null, 2, 2, 0], fingers: [null, null, null, 3, 2, 0], startFret: 0 },
  'A5': { name: 'A5 Power', frets: [null, null, null, 2, 0, null], fingers: [null, null, null, 1, 0, null], startFret: 0 },
  'D5': { name: 'D5 Power', frets: [null, null, null, 0, null, null], fingers: [null, null, null, 0, null, null], startFret: 0 },
  'G5': { name: 'G5 Power', frets: [null, null, null, 5, 5, 3], fingers: [null, null, null, 3, 4, 1], startFret: 3 },
  'F5': { name: 'F5 Power', frets: [null, null, null, 3, 3, 1], fingers: [null, null, null, 3, 4, 1], startFret: 1 },
  'F_barre': { name: 'F Cejilla', frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 4, 3, 1], startFret: 1 },
  'Fm_barre': { name: 'Fm Cejilla', frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 4, 3, 1], startFret: 1 },
  'Bb_barre': { name: 'Bb Cejilla', frets: [1, 3, 3, 3, 1, null], fingers: [1, 2, 3, 4, 1, null], startFret: 1 },
  'Gm_barre': { name: 'Gm Cejilla', frets: [3, 3, 3, 5, 5, 3], fingers: [1, 1, 1, 3, 4, 1], startFret: 3 },
  'C_triad': { name: 'C Triada', frets: [0, 1, 0, null, null, null], fingers: [0, 1, 0, null, null, null], startFret: 0 },
  'G_triad': { name: 'G Triada', frets: [3, 0, 0, null, null, null], fingers: [1, 0, 0, null, null, null], startFret: 0 },
  'Am_triad': { name: 'Am Triada', frets: [0, 1, 2, null, null, null], fingers: [0, 1, 2, null, null, null], startFret: 0 },
  'F_triad': { name: 'F Triada', frets: [1, 1, 2, null, null, null], fingers: [1, 1, 2, null, null, null], startFret: 0 },
  'Am_pent_box1': { name: 'Am Pentatónica', frets: [5, 8, 5, 7, 5, 7, 5, 7, 5, 8, 5, 8], fingers: [1, 4, 1, 3, 1, 3, 1, 3, 1, 4, 1, 4], startFret: 5 },
  'Am_blues': { name: 'Am Blues', frets: [5, 8, 5, 6, 7, 5, 7, 5, 7, 5, 8, 5, 8], fingers: [1, 4, 1, 2, 3, 1, 3, 1, 3, 1, 4, 1, 4], startFret: 5 },
  'C_major_box1': { name: 'C Mayor Box 1', frets: [7, 8, 10, 7, 9, 10, 7, 9, 10, 7, 8, 10, 8, 10], fingers: [1, 2, 4, 1, 3, 4, 1, 3, 4, 1, 2, 4, 2, 4], startFret: 7 },
};

// Helper para obtener la lección del día actual
export function getTodayLesson(week: number, day: number): DayLesson | null {
  const weekData = CURRICULUM.find(w => w.week === week);
  if (!weekData) return null;
  return weekData.days.find(d => d.day === day) || null;
}

// Helper para obtener la semana
export function getWeek(weekNum: number): WeekCurriculum | null {
  return CURRICULUM.find(w => w.week === weekNum) || null;
}

// Check if week is locked (paywall)
export function isWeekLocked(week: number): boolean {
  return week >= 25;
}
