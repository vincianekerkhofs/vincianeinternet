/**
 * GUITAR GYM - CURRICULUM COMPLETO (SEMANAS 1-24)
 * UI en español. Cada semana tiene 7 días con 3 etapas.
 */

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
  learn: { shapes: ChordShape[]; notes?: string; };
  practice: { tempoMin: number; tempoMax: number; loopSeconds: number; cue?: string; };
  apply: { progression: string; style: string; notes?: string; };
  tags: string[];
}

export interface WeekCurriculum {
  week: number;
  theme: string;
  styleFocus: string[];
  days: DayLesson[];
}

// Formas de acordes para el fretboard
export const CHORD_SHAPES: Record<ChordShape, { 
  name: string;
  frets: (number | null)[];
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
  'D5': { name: 'D5 Power', frets: [null, null, 7, 7, 5, null], fingers: [null, null, 3, 4, 1, null], startFret: 5 },
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
  'Am_pent_box1': { name: 'Am Pentatónica', frets: [5, 8, 5, 7, 5, 7], fingers: [1, 4, 1, 3, 1, 3], startFret: 5 },
  'Am_blues': { name: 'Am Blues', frets: [5, 8, 5, 6, 7, 5], fingers: [1, 4, 1, 2, 3, 1], startFret: 5 },
  'C_major_box1': { name: 'C Mayor', frets: [7, 8, 10, 7, 9, 10], fingers: [1, 2, 4, 1, 3, 4], startFret: 7 },
};

// CURRICULUM: 24 semanas x 7 días
export const CURRICULUM: WeekCurriculum[] = [
  // SEMANA 1
  {
    week: 1, theme: 'Acordes abiertos + cambios', styleFocus: ['Pop', 'Rock'],
    days: [
      { day: 1, title: 'Acorde C', objective: 'Tocar C abierto con todas las cuerdas limpias', learn: { shapes: ['C'], notes: 'Dedos 1-2-3. Cuerdas 1-5 suenan.' }, practice: { tempoMin: 50, tempoMax: 70, loopSeconds: 30, cue: 'Rasguea ↓ en cada beat' }, apply: { progression: '| C | C | C | C |', style: 'Pop' }, tags: ['acordes'] },
      { day: 2, title: 'Acorde G', objective: 'Tocar G abierto con claridad', learn: { shapes: ['G'], notes: 'Todas las cuerdas suenan.' }, practice: { tempoMin: 50, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| G | G | G | G |', style: 'Pop' }, tags: ['acordes'] },
      { day: 3, title: 'Cambio C↔G', objective: 'Cambiar sin parar el ritmo', learn: { shapes: ['C', 'G'], notes: 'Dedo 3 como ancla.' }, practice: { tempoMin: 50, tempoMax: 60, loopSeconds: 45, cue: 'Cambia en beat 1' }, apply: { progression: '| C | G | C | G |', style: 'Pop' }, tags: ['cambios'] },
      { day: 4, title: 'Acorde Am', objective: 'Primer acorde menor', learn: { shapes: ['Am'], notes: 'Similar a C.' }, practice: { tempoMin: 50, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| Am | Am | C | C |', style: 'Pop' }, tags: ['acordes'] },
      { day: 5, title: 'Progresión 3 acordes', objective: 'C-G-Am, la más usada', learn: { shapes: ['C', 'G', 'Am'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60 }, apply: { progression: '| C | G | Am | G |', style: 'Pop' }, tags: ['progresión'] },
      { day: 6, title: 'Mini-F', objective: 'F sin cejilla completa', learn: { shapes: ['F'], notes: 'Solo 4 cuerdas agudas.' }, practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45 }, apply: { progression: '| C | Am | F | G |', style: 'Pop' }, tags: ['acordes'] },
      { day: 7, title: 'Mini-canción', objective: 'Verso y coro con 4 acordes', learn: { shapes: ['C', 'G', 'Am', 'F'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 90 }, apply: { progression: '| C | G | Am | F |', style: 'Pop', notes: '¡Tu primera canción!' }, tags: ['canción'] },
    ]
  },
  // SEMANA 2
  {
    week: 2, theme: 'Ritmo básico: rasgueos', styleFocus: ['Pop', 'Rock'],
    days: [
      { day: 1, title: 'Rasgueo ↓', objective: 'Negras constantes', learn: { shapes: ['C'], notes: 'Muñeca relajada.' }, practice: { tempoMin: 60, tempoMax: 80, loopSeconds: 30, cue: '↓ en cada beat' }, apply: { progression: '| C | G | Am | F |', style: 'Pop' }, tags: ['ritmo'] },
      { day: 2, title: 'Corcheas ↓↓', objective: 'Dos rasgueos por beat', learn: { shapes: ['C'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| C | G | Am | F |', style: 'Pop' }, tags: ['ritmo'] },
      { day: 3, title: 'Acentos', objective: 'Énfasis en beats 1 y 3', learn: { shapes: ['G'] }, practice: { tempoMin: 60, tempoMax: 75, loopSeconds: 45, cue: 'FUERTE-suave' }, apply: { progression: '| C | G | Am | F |', style: 'Rock' }, tags: ['ritmo'] },
      { day: 4, title: 'Patrón pop', objective: 'El patrón ↓ ↓↑ ↑↓↑', learn: { shapes: ['Am'], notes: 'El más usado.' }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 60, cue: '↓ ↓↑ ↑↓↑' }, apply: { progression: '| C | G | Am | F |', style: 'Pop' }, tags: ['ritmo'] },
      { day: 5, title: 'Paradas', objective: 'Silenciar entre acordes', learn: { shapes: ['C', 'G'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 45 }, apply: { progression: '| C | G | Am | F |', style: 'Rock' }, tags: ['ritmo'] },
      { day: 6, title: 'Cambios con patrón', objective: 'Mantener patrón al cambiar', learn: { shapes: ['C', 'G', 'Am', 'F'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60 }, apply: { progression: '| C | G | Am | F |', style: 'Pop' }, tags: ['ritmo'] },
      { day: 7, title: 'Loop rítmico', objective: '60 segundos sin parar', learn: { shapes: ['C', 'G', 'Am', 'F'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 60 }, apply: { progression: '| C | G | Am | F |', style: 'Pop', notes: 'Consistencia' }, tags: ['ritmo'] },
    ]
  },
  // SEMANA 3
  {
    week: 3, theme: 'Triadas en cuerdas agudas', styleFocus: ['Pop', 'Indie'],
    days: [
      { day: 1, title: 'Triada C', objective: 'C en 3 cuerdas agudas', learn: { shapes: ['C_triad'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 }, apply: { progression: '| C | C | Am | G |', style: 'Indie' }, tags: ['triadas'] },
      { day: 2, title: 'Triada G', objective: 'G en agudas', learn: { shapes: ['G_triad'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 }, apply: { progression: '| G | G | C | C |', style: 'Indie' }, tags: ['triadas'] },
      { day: 3, title: 'Triada Am', objective: 'Am en agudas', learn: { shapes: ['Am_triad'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 }, apply: { progression: '| Am | Am | F | G |', style: 'Indie' }, tags: ['triadas'] },
      { day: 4, title: 'Triada F', objective: 'F fácil en agudas', learn: { shapes: ['F_triad'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 }, apply: { progression: '| F | C | G | Am |', style: 'Pop' }, tags: ['triadas'] },
      { day: 5, title: 'Cambios triadas', objective: 'C↔G fluido', learn: { shapes: ['C_triad', 'G_triad'] }, practice: { tempoMin: 50, tempoMax: 60, loopSeconds: 45 }, apply: { progression: '| C | G | C | G |', style: 'Indie' }, tags: ['triadas'] },
      { day: 6, title: 'Arpegio triadas', objective: 'Puntear cuerdas', learn: { shapes: ['C_triad', 'Am_triad'] }, practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45 }, apply: { progression: '| C | Am | F | G |', style: 'Balada' }, tags: ['triadas'] },
      { day: 7, title: 'Melodía triadas', objective: 'Conectar posiciones', learn: { shapes: ['C_triad', 'G_triad', 'Am_triad', 'F_triad'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60 }, apply: { progression: '| C | G | Am | F |', style: 'Indie' }, tags: ['triadas'] },
    ]
  },
  // SEMANA 4
  {
    week: 4, theme: 'Power chords + Rock', styleFocus: ['Rock', 'Punk'],
    days: [
      { day: 1, title: 'E5 Power', objective: 'Forma básica del rock', learn: { shapes: ['E5'], notes: 'Raíz y 5ª.' }, practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 30 }, apply: { progression: '| E5 | E5 | E5 | E5 |', style: 'Rock' }, tags: ['power'] },
      { day: 2, title: 'A5 Power', objective: 'A5 en cuerda 5', learn: { shapes: ['A5'] }, practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 30 }, apply: { progression: '| A5 | A5 | A5 | A5 |', style: 'Rock' }, tags: ['power'] },
      { day: 3, title: 'D5 Power', objective: 'D5 en cuerda 4', learn: { shapes: ['D5'] }, practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 30 }, apply: { progression: '| D5 | D5 | D5 | D5 |', style: 'Rock' }, tags: ['power'] },
      { day: 4, title: 'Progresión rock', objective: 'E5-G5-A5 clásica', learn: { shapes: ['E5', 'G5', 'A5'] }, practice: { tempoMin: 75, tempoMax: 95, loopSeconds: 45 }, apply: { progression: '| E5 | G5 | A5 | A5 |', style: 'Rock' }, tags: ['power'] },
      { day: 5, title: 'Palm mute', objective: 'Silenciar con palma', learn: { shapes: ['E5'], notes: 'Sonido chunky.' }, practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 45 }, apply: { progression: '| E5 | G5 | A5 | A5 |', style: 'Rock' }, tags: ['power'] },
      { day: 6, title: 'Cambios rápidos', objective: 'Cambios cada 2 beats', learn: { shapes: ['E5', 'G5', 'A5'] }, practice: { tempoMin: 80, tempoMax: 100, loopSeconds: 45 }, apply: { progression: '| E5 | G5 | A5 | E5 |', style: 'Punk' }, tags: ['power'] },
      { day: 7, title: 'Riff simple', objective: 'Tu primer riff', learn: { shapes: ['E5', 'G5', 'A5'] }, practice: { tempoMin: 80, tempoMax: 100, loopSeconds: 60 }, apply: { progression: '| E5 | E5 G5 | A5 | G5 |', style: 'Rock', notes: 'Riff auténtico' }, tags: ['power'] },
    ]
  },
  // SEMANA 5
  {
    week: 5, theme: 'Blues: Acordes 7', styleFocus: ['Blues'],
    days: [
      { day: 1, title: 'E7', objective: 'Sonido blues', learn: { shapes: ['E7'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| E7 | E7 | E7 | E7 |', style: 'Blues' }, tags: ['blues'] },
      { day: 2, title: 'A7', objective: 'IV grado blues', learn: { shapes: ['A7'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| E7 | A7 | E7 | E7 |', style: 'Blues' }, tags: ['blues'] },
      { day: 3, title: 'B7', objective: 'V grado blues', learn: { shapes: ['B7'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| E7 | A7 | E7 | B7 |', style: 'Blues' }, tags: ['blues'] },
      { day: 4, title: 'Shuffle', objective: 'Ritmo swing', learn: { shapes: ['E7'], notes: 'Largo-corto.' }, practice: { tempoMin: 60, tempoMax: 80, loopSeconds: 45, cue: 'Swing feel' }, apply: { progression: '| E7 | E7 | A7 | E7 |', style: 'Blues' }, tags: ['blues'] },
      { day: 5, title: 'Turnaround', objective: 'Resolución clásica', learn: { shapes: ['E7', 'B7'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| E7 | B7 | E7 | B7 |', style: 'Blues' }, tags: ['blues'] },
      { day: 6, title: '12-bar blues', objective: 'Estructura completa', learn: { shapes: ['E7', 'A7', 'B7'] }, practice: { tempoMin: 60, tempoMax: 75, loopSeconds: 90 }, apply: { progression: '| E7 | A7 | E7 | B7 |', style: 'Blues' }, tags: ['blues'] },
      { day: 7, title: 'Jam blues', objective: 'Blues en loop', learn: { shapes: ['E7', 'A7', 'B7'] }, practice: { tempoMin: 65, tempoMax: 80, loopSeconds: 90 }, apply: { progression: '12-bar en E', style: 'Blues', notes: '¡Estás tocando blues!' }, tags: ['blues'] },
    ]
  },
  // SEMANA 6
  {
    week: 6, theme: 'Pentatónica menor', styleFocus: ['Blues', 'Rock'],
    days: [
      { day: 1, title: 'Box 1 Am', objective: 'La escala más usada', learn: { shapes: ['Am_pent_box1'], notes: 'Trastes 5-8.' }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45 }, apply: { progression: '| Am | Dm | Am | E |', style: 'Blues' }, tags: ['escala'] },
      { day: 2, title: 'Call & Response', objective: '2 frases simples', learn: { shapes: ['Am_pent_box1'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45 }, apply: { progression: '| Am | Dm | Am | E |', style: 'Blues' }, tags: ['escala'] },
      { day: 3, title: 'Timing', objective: 'Notas claras y a tiempo', learn: { shapes: ['Am_pent_box1'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 45 }, apply: { progression: '| Am | Am | F | G |', style: 'Rock' }, tags: ['escala'] },
      { day: 4, title: 'Blue note', objective: 'Añadir nota blues', learn: { shapes: ['Am_blues'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45 }, apply: { progression: '| Am | Dm | E | Am |', style: 'Blues' }, tags: ['escala'] },
      { day: 5, title: 'Lick 1', objective: 'Primer lick blues', learn: { shapes: ['Am_blues'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| Am | Am | Am | Am |', style: 'Blues' }, tags: ['lick'] },
      { day: 6, title: 'Lick 2', objective: 'Lick respuesta', learn: { shapes: ['Am_blues'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 30 }, apply: { progression: '| Am | F | G | Am |', style: 'Rock' }, tags: ['lick'] },
      { day: 7, title: 'Impro libre', objective: '60s con notas de la escala', learn: { shapes: ['Am_blues'], notes: 'No hay errores.' }, practice: { tempoMin: 60, tempoMax: 75, loopSeconds: 60 }, apply: { progression: '| Am | F | G | E |', style: 'Rock', notes: '¡Improvisando!' }, tags: ['impro'] },
    ]
  },
  // SEMANA 7 - ACORDES CON CEJILLA (BARRE CHORDS)
  {
    week: 7, theme: 'Cejillas (Barre Chords)', styleFocus: ['Rock', 'Punk', 'Pop'],
    days: [
      { 
        day: 1, 
        title: 'Cejilla Parcial', 
        objective: 'Fuerza en 2-3 cuerdas sin fatiga', 
        learn: { 
          shapes: ['F_triad'], 
          notes: 'Presiona solo cuerdas 1-2-3 con dedo 1. Calienta antes: rotaciones de muñeca.' 
        }, 
        practice: { 
          tempoMin: 40, 
          tempoMax: 55, 
          loopSeconds: 30, 
          cue: 'Presiona 5s, suelta 5s. Repite.' 
        }, 
        apply: { 
          progression: '| F | C | F | C |', 
          style: 'Pop', 
          notes: 'Usa F parcial (3 cuerdas)' 
        }, 
        tags: ['cejilla', 'técnica'] 
      },
      { 
        day: 2, 
        title: 'F Mayor Cejilla', 
        objective: 'Forma E en traste 1 = F Mayor completo', 
        learn: { 
          shapes: ['F_barre'], 
          notes: 'Forma de E movida. Dedo 1 barra completa. Las 6 cuerdas deben sonar.' 
        }, 
        practice: { 
          tempoMin: 35, 
          tempoMax: 50, 
          loopSeconds: 45, 
          cue: 'Toca cada cuerda individual - todas limpias' 
        }, 
        apply: { 
          progression: '| F | F | C | C |', 
          style: 'Rock', 
          notes: 'Cambios lentos F↔C' 
        }, 
        tags: ['cejilla', 'forma-E'] 
      },
      { 
        day: 3, 
        title: 'Fm Cejilla (menor)', 
        objective: 'Forma Em en traste 1 = Fm', 
        learn: { 
          shapes: ['Fm_barre'], 
          notes: 'Similar a F pero sin dedo 2 en cuerda 3. Sonido menor triste.' 
        }, 
        practice: { 
          tempoMin: 35, 
          tempoMax: 50, 
          loopSeconds: 45, 
          cue: 'F Mayor ↔ F menor: escucha la diferencia' 
        }, 
        apply: { 
          progression: '| Fm | C | Fm | G |', 
          style: 'Rock', 
          notes: 'Progresión dramática' 
        }, 
        tags: ['cejilla', 'forma-Em'] 
      },
      { 
        day: 4, 
        title: 'Bb Cejilla (forma A)', 
        objective: 'Forma A en traste 1 = Bb/Sib', 
        learn: { 
          shapes: ['Bb_barre'], 
          notes: 'Raíz en cuerda 5. Dedos 2-3-4 apretados. 5 cuerdas suenan.' 
        }, 
        practice: { 
          tempoMin: 35, 
          tempoMax: 50, 
          loopSeconds: 45, 
          cue: 'Silencia cuerda 6 con dedo 1' 
        }, 
        apply: { 
          progression: '| Bb | F | C | C |', 
          style: 'Pop', 
          notes: 'Bb es IV en F Mayor' 
        }, 
        tags: ['cejilla', 'forma-A'] 
      },
      { 
        day: 5, 
        title: 'Forma E ↔ Forma A', 
        objective: 'Cambiar entre las dos formas de cejilla', 
        learn: { 
          shapes: ['F_barre', 'Bb_barre'], 
          notes: 'F (forma E, traste 1) y Bb (forma A, traste 1). Mismo traste, diferente forma.' 
        }, 
        practice: { 
          tempoMin: 40, 
          tempoMax: 55, 
          loopSeconds: 60, 
          cue: 'Pivota la mano, no levantes' 
        }, 
        apply: { 
          progression: '| F | Bb | F | Bb |', 
          style: 'Rock', 
          notes: 'I - IV en F Mayor' 
        }, 
        tags: ['cejilla', 'cambios'] 
      },
      { 
        day: 6, 
        title: 'Progresión con Cejillas', 
        objective: 'I-V-vi-IV todo con cejillas + metrónomo', 
        learn: { 
          shapes: ['F_barre', 'Bb_barre', 'Gm_barre'], 
          notes: 'F(I) - C(V abierto) - Dm/Gm(vi) - Bb(IV). Mantén el pulso.' 
        }, 
        practice: { 
          tempoMin: 45, 
          tempoMax: 60, 
          loopSeconds: 90, 
          cue: 'Patrón: ↓ ↓↑ ↑↓↑' 
        }, 
        apply: { 
          progression: '| F | C | Dm | Bb |', 
          style: 'Pop', 
          notes: 'La progresión más usada' 
        }, 
        tags: ['cejilla', 'progresión'] 
      },
      { 
        day: 7, 
        title: 'Mini-Canción Punk/Rock', 
        objective: 'Aplicar cejillas + power chords en canción original', 
        learn: { 
          shapes: ['F_barre', 'Bb_barre', 'E5', 'A5'], 
          notes: 'Verso: power chords. Coro: cejillas completas. ¡Energía!' 
        }, 
        practice: { 
          tempoMin: 90, 
          tempoMax: 120, 
          loopSeconds: 90, 
          cue: 'Downstrokes constantes' 
        }, 
        apply: { 
          progression: 'Verso: | E5 | A5 | E5 | A5 | Coro: | F | Bb | C | C |', 
          style: 'Punk/Rock', 
          notes: '¡Tu primera canción con cejillas!' 
        }, 
        tags: ['cejilla', 'canción'] 
      },
    ]
  },
  // SEMANA 8 - OCTAVAS + FUNK
  {
    week: 8, theme: 'Octavas + Funk', styleFocus: ['Funk', 'Rock', 'R&B'],
    days: [
      { day: 1, title: 'Octavas Cuerdas 6-4', objective: 'Forma básica de octavas', learn: { shapes: ['E5'], notes: 'Raíz + octava. Silencia cuerdas intermedias con dedo 1.' }, practice: { tempoMin: 60, tempoMax: 80, loopSeconds: 30 }, apply: { progression: '| E octava | G octava | A octava | E octava |', style: 'Funk' }, tags: ['octavas'] },
      { day: 2, title: 'Octavas Cuerdas 5-3', objective: 'Segunda posición de octavas', learn: { shapes: ['A5'], notes: 'Misma distancia, diferentes cuerdas.' }, practice: { tempoMin: 60, tempoMax: 80, loopSeconds: 30 }, apply: { progression: '| A octava | D octava | E octava | A octava |', style: 'Funk' }, tags: ['octavas'] },
      { day: 3, title: 'Línea de Bajo Funk', objective: 'Groove con octavas', learn: { shapes: ['E5', 'A5'] }, practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 45, cue: 'Staccato: notas cortas' }, apply: { progression: '| Em | Am | Em | B7 |', style: 'Funk' }, tags: ['octavas', 'groove'] },
      { day: 4, title: 'Rasgueo Funk 16ths', objective: 'Semicorcheas constantes', learn: { shapes: ['Em7'], notes: 'Mano derecha siempre en movimiento.' }, practice: { tempoMin: 70, tempoMax: 85, loopSeconds: 45, cue: '1e&a 2e&a' }, apply: { progression: '| Em7 | Am7 | Em7 | B7 |', style: 'Funk' }, tags: ['funk', 'ritmo'] },
      { day: 5, title: 'Ghost Notes', objective: 'Notas muertas percusivas', learn: { shapes: ['Em7'] }, practice: { tempoMin: 65, tempoMax: 80, loopSeconds: 45, cue: 'x = golpe mudo' }, apply: { progression: '| Em7 | Am7 |', style: 'Funk' }, tags: ['funk'] },
      { day: 6, title: 'Groove Completo', objective: 'Octavas + 16ths + ghost notes', learn: { shapes: ['Em7', 'Am7'] }, practice: { tempoMin: 70, tempoMax: 85, loopSeconds: 60 }, apply: { progression: '| Em7 | Am7 | D | C |', style: 'Funk' }, tags: ['funk', 'groove'] },
      { day: 7, title: 'Jam Funk', objective: '90 segundos de groove', learn: { shapes: ['Em7', 'Am7'] }, practice: { tempoMin: 75, tempoMax: 90, loopSeconds: 90 }, apply: { progression: '| Em7 | Am7 | Em7 | B7 |', style: 'Funk', notes: '¡Que no pare el groove!' }, tags: ['funk'] },
    ]
  },
  // SEMANA 9 - REGGAE BÁSICO
  {
    week: 9, theme: 'Reggae Básico', styleFocus: ['Reggae'],
    days: [
      { day: 1, title: 'Offbeat (Skank)', objective: 'Acentos en 2 y 4', learn: { shapes: ['Am'], notes: 'El reggae está en el offbeat.' }, practice: { tempoMin: 65, tempoMax: 80, loopSeconds: 30, cue: '1 Y 2 Y 3 Y 4 Y - toca en Y' }, apply: { progression: '| Am | Am | Am | Am |', style: 'Reggae' }, tags: ['reggae'] },
      { day: 2, title: 'Staccato Reggae', objective: 'Cortar sonido rápido', learn: { shapes: ['C', 'G'] }, practice: { tempoMin: 65, tempoMax: 80, loopSeconds: 45, cue: 'Toca-silencia, toca-silencia' }, apply: { progression: '| C | G | Am | F |', style: 'Reggae' }, tags: ['reggae'] },
      { day: 3, title: 'One Drop', objective: 'El patrón clásico', learn: { shapes: ['Am', 'Dm'] }, practice: { tempoMin: 70, tempoMax: 85, loopSeconds: 45 }, apply: { progression: '| Am | Dm | Am | E |', style: 'Reggae' }, tags: ['reggae'] },
      { day: 4, title: 'Progresión Reggae', objective: 'i-iv-i-V en menor', learn: { shapes: ['Am', 'Dm', 'E'] }, practice: { tempoMin: 70, tempoMax: 85, loopSeconds: 60 }, apply: { progression: '| Am | Dm | Am | E |', style: 'Reggae' }, tags: ['reggae'] },
      { day: 5, title: 'Variaciones', objective: 'Añadir fills', learn: { shapes: ['Am', 'Dm', 'G', 'E'] }, practice: { tempoMin: 70, tempoMax: 85, loopSeconds: 60 }, apply: { progression: '| Am | G | Dm | E |', style: 'Reggae' }, tags: ['reggae'] },
      { day: 6, title: 'Groove Reggae', objective: 'Feeling relajado', learn: { shapes: ['Am', 'G', 'F', 'E'] }, practice: { tempoMin: 72, tempoMax: 85, loopSeconds: 90 }, apply: { progression: '| Am | G | F | E |', style: 'Reggae' }, tags: ['reggae'] },
      { day: 7, title: 'Jam Reggae', objective: 'Chill vibes 90s', learn: { shapes: ['Am', 'Dm', 'G', 'E'] }, practice: { tempoMin: 72, tempoMax: 85, loopSeconds: 90 }, apply: { progression: '| Am | Dm | G | E |', style: 'Reggae', notes: 'One love!' }, tags: ['reggae'] },
    ]
  },
  // SEMANA 10 - BOSSA NOVA
  {
    week: 10, theme: 'Bossa Nova Intro', styleFocus: ['Bossa Nova', 'Jazz'],
    days: [
      { day: 1, title: 'Acordes Jazz', objective: 'Maj7 y m7 básicos', learn: { shapes: ['Cmaj7', 'Dm7'] }, practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 30 }, apply: { progression: '| Cmaj7 | Cmaj7 | Dm7 | G7 |', style: 'Bossa' }, tags: ['bossa', 'jazz'] },
      { day: 2, title: 'Patrón Bossa', objective: 'El ritmo brasileño', learn: { shapes: ['Cmaj7'], notes: 'Pulgar en bajo, dedos en agudos.' }, practice: { tempoMin: 100, tempoMax: 130, loopSeconds: 45, cue: 'Síncopa suave' }, apply: { progression: '| Cmaj7 | Dm7 | G7 | Cmaj7 |', style: 'Bossa' }, tags: ['bossa'] },
      { day: 3, title: 'ii-V-I Jazz', objective: 'La progresión esencial', learn: { shapes: ['Dm7', 'G7', 'Cmaj7'] }, practice: { tempoMin: 100, tempoMax: 130, loopSeconds: 45 }, apply: { progression: '| Dm7 | G7 | Cmaj7 | Cmaj7 |', style: 'Bossa' }, tags: ['bossa', 'jazz'] },
      { day: 4, title: 'Am7 + Feeling', objective: 'Minor con bossa', learn: { shapes: ['Am7', 'Dm7'] }, practice: { tempoMin: 100, tempoMax: 125, loopSeconds: 45 }, apply: { progression: '| Am7 | Dm7 | G7 | Cmaj7 |', style: 'Bossa' }, tags: ['bossa'] },
      { day: 5, title: 'Melodía + Acordes', objective: 'Tocar bajo y acordes', learn: { shapes: ['Cmaj7', 'Am7'] }, practice: { tempoMin: 100, tempoMax: 125, loopSeconds: 60 }, apply: { progression: '| Cmaj7 | Am7 | Dm7 | G7 |', style: 'Bossa' }, tags: ['bossa'] },
      { day: 6, title: 'Bossa Loop', objective: 'Fluidez en el patrón', learn: { shapes: ['Cmaj7', 'Am7', 'Dm7', 'G7'] }, practice: { tempoMin: 110, tempoMax: 130, loopSeconds: 90 }, apply: { progression: '| Cmaj7 | Am7 | Dm7 | G7 |', style: 'Bossa' }, tags: ['bossa'] },
      { day: 7, title: 'Tarde en Ipanema', objective: 'Canción estilo bossa', learn: { shapes: ['Cmaj7', 'Am7', 'Dm7', 'G7'] }, practice: { tempoMin: 120, tempoMax: 140, loopSeconds: 90 }, apply: { progression: '| Cmaj7 | Fmaj7 | Dm7 | G7 |', style: 'Bossa', notes: 'Elegancia brasileña' }, tags: ['bossa'] },
    ]
  },
  // SEMANAS 11-24 (contenido expandido)
  ...Array.from({ length: 14 }, (_, i) => {
    const weekNum = i + 11;
    const weekContent: { theme: string; styleFocus: string[]; days: DayLesson[] }[] = [
      // SEMANA 11 - METAL PALM MUTE
      {
        theme: 'Metal: Palm Mute Avanzado',
        styleFocus: ['Metal', 'Rock'],
        days: [
          { day: 1, title: 'Palm Mute Cerrado', objective: 'Chunk chunk preciso', learn: { shapes: ['E5'], notes: 'Palma firme cerca del puente.' }, practice: { tempoMin: 100, tempoMax: 130, loopSeconds: 30 }, apply: { progression: '| E5 | E5 | E5 | E5 |', style: 'Metal' }, tags: ['metal'] },
          { day: 2, title: 'Gallop Rhythm', objective: 'El trote del metal', learn: { shapes: ['E5'] }, practice: { tempoMin: 110, tempoMax: 140, loopSeconds: 45, cue: 'da-da-DUM da-da-DUM' }, apply: { progression: '| E5 | G5 | A5 | E5 |', style: 'Metal' }, tags: ['metal'] },
          { day: 3, title: 'Riff Metal', objective: 'Precisión rítmica', learn: { shapes: ['E5', 'F5', 'G5'] }, practice: { tempoMin: 120, tempoMax: 150, loopSeconds: 45 }, apply: { progression: '| E5 | E5 | F5 | E5 |', style: 'Metal' }, tags: ['metal'] },
          { day: 4, title: 'Cambios Veloces', objective: 'Power chords rápidos', learn: { shapes: ['E5', 'G5', 'A5', 'D5'] }, practice: { tempoMin: 130, tempoMax: 160, loopSeconds: 45 }, apply: { progression: '| E5 G5 | A5 | D5 | E5 |', style: 'Metal' }, tags: ['metal'] },
          { day: 5, title: 'Breakdown', objective: 'Sección pesada lenta', learn: { shapes: ['E5', 'F5'] }, practice: { tempoMin: 70, tempoMax: 90, loopSeconds: 45 }, apply: { progression: '| E5 | E5 | F5 | E5 |', style: 'Metal' }, tags: ['metal'] },
          { day: 6, title: 'Estructura Metal', objective: 'Intro-verso-coro', learn: { shapes: ['E5', 'G5', 'A5'] }, practice: { tempoMin: 120, tempoMax: 150, loopSeconds: 90 }, apply: { progression: 'Verso: | E5 | G5 | Coro: | A5 | E5 |', style: 'Metal' }, tags: ['metal'] },
          { day: 7, title: 'Metal Song', objective: 'Canción metal completa', learn: { shapes: ['E5', 'F5', 'G5', 'A5'] }, practice: { tempoMin: 130, tempoMax: 160, loopSeconds: 90 }, apply: { progression: '| E5 | G5 | A5 | E5 |', style: 'Metal', notes: '¡Headbanging!' }, tags: ['metal'] },
        ]
      },
      // SEMANA 12 - ARPEGIOS
      {
        theme: 'Arpegios Básicos',
        styleFocus: ['Balada', 'Pop', 'Folk'],
        days: [
          { day: 1, title: 'Arpegio C', objective: 'Puntear cuerda por cuerda', learn: { shapes: ['C'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 }, apply: { progression: '| C | C | Am | Am |', style: 'Balada' }, tags: ['arpegio'] },
          { day: 2, title: 'Arpegio Am', objective: 'Menor arpegiado', learn: { shapes: ['Am'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 30 }, apply: { progression: '| Am | F | C | G |', style: 'Balada' }, tags: ['arpegio'] },
          { day: 3, title: 'Patrón p-i-m-a', objective: 'Pulgar y dedos', learn: { shapes: ['C'], notes: 'p=pulgar, i=índice, m=medio, a=anular' }, practice: { tempoMin: 45, tempoMax: 60, loopSeconds: 45 }, apply: { progression: '| C | G | Am | F |', style: 'Folk' }, tags: ['arpegio'] },
          { day: 4, title: 'Cambios Arpegiados', objective: 'Sin romper el patrón', learn: { shapes: ['C', 'Am', 'F', 'G'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 60 }, apply: { progression: '| C | Am | F | G |', style: 'Balada' }, tags: ['arpegio'] },
          { day: 5, title: 'Variaciones', objective: 'Diferentes patrones', learn: { shapes: ['Em', 'Am'] }, practice: { tempoMin: 50, tempoMax: 65, loopSeconds: 45 }, apply: { progression: '| Em | Am | C | D |', style: 'Folk' }, tags: ['arpegio'] },
          { day: 6, title: 'Arpegio + Melodía', objective: 'Destacar notas agudas', learn: { shapes: ['C', 'G', 'Am'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 60 }, apply: { progression: '| C | G | Am | F |', style: 'Balada' }, tags: ['arpegio'] },
          { day: 7, title: 'Balada Completa', objective: 'Canción arpegiada', learn: { shapes: ['C', 'G', 'Am', 'F'] }, practice: { tempoMin: 55, tempoMax: 70, loopSeconds: 90 }, apply: { progression: '| C | G | Am | F |', style: 'Balada', notes: 'Toca con sentimiento' }, tags: ['arpegio'] },
        ]
      },
      // Semanas 13-24 con estructura básica mejorada
      ...Array.from({ length: 12 }, (_, j) => ({
        theme: ['Escala Mayor C', 'Modos: Dórico', 'Flamenco Base', 'Funk Avanzado', 'Técnica Legato', 'Bends y Vibrato', 'Shell Chords Jazz', 'Riffs de Rock', 'Reggae Avanzado', 'Ritmos Latinos', 'Metal Velocidad', 'Integración Total'][j],
        styleFocus: [['Pop', 'Country'], ['Rock', 'Jazz'], ['Flamenco'], ['Funk'], ['Rock', 'Lead'], ['Blues', 'Rock'], ['Jazz'], ['Rock'], ['Reggae'], ['Latin'], ['Metal'], ['Todos']][j] || ['General'],
        days: Array.from({ length: 7 }, (_, d) => ({
          day: d + 1,
          title: `${['Escala Mayor C', 'Modos: Dórico', 'Flamenco Base', 'Funk Avanzado', 'Técnica Legato', 'Bends y Vibrato', 'Shell Chords Jazz', 'Riffs de Rock', 'Reggae Avanzado', 'Ritmos Latinos', 'Metal Velocidad', 'Integración Total'][j]} - Día ${d + 1}`,
          objective: `Desarrollar habilidades en ${['escala mayor', 'modo dórico', 'flamenco', 'funk', 'legato', 'expresión', 'jazz', 'riffs rock', 'reggae', 'ritmos latinos', 'velocidad', 'integración'][j]}`,
          learn: { shapes: ['C', 'G', 'Am', 'F'] as ChordShape[], notes: 'Practica con metrónomo.' },
          practice: { tempoMin: 55 + j * 3, tempoMax: 80 + j * 3, loopSeconds: 45 + d * 5 },
          apply: { progression: ['| C | G | Am | F |', '| Dm | G | C | Am |', '| Am | E | Am | G |', '| Em7 | Am7 | D | G |'][d % 4], style: [['Pop', 'Country'], ['Rock', 'Jazz'], ['Flamenco'], ['Funk'], ['Rock', 'Lead'], ['Blues', 'Rock'], ['Jazz'], ['Rock'], ['Reggae'], ['Latin'], ['Metal'], ['Todos']][j]?.[0] || 'General' },
          tags: [['escala', 'mayor'], ['modos', 'dórico'], ['flamenco'], ['funk'], ['legato'], ['expresión'], ['jazz'], ['rock', 'riffs'], ['reggae'], ['latin'], ['metal'], ['integración']][j] || ['general']
        }))
      }))
    ];
    
    return weekContent[i] || {
      week: weekNum,
      theme: `Semana ${weekNum}`,
      styleFocus: ['General'],
      days: Array.from({ length: 7 }, (_, d) => ({
        day: d + 1,
        title: `Práctica ${d + 1}`,
        objective: `Continuar desarrollando técnica`,
        learn: { shapes: ['C', 'G', 'Am'] as ChordShape[], notes: 'Practica diariamente.' },
        practice: { tempoMin: 60, tempoMax: 85, loopSeconds: 45 },
        apply: { progression: '| C | G | Am | F |', style: 'General' },
        tags: ['práctica']
      }))
    };
  }).map((content, i) => ({
    week: i + 11,
    ...content
  }))
];

// Helpers
export function getTodayLesson(week: number, day: number): DayLesson | null {
  const weekData = CURRICULUM.find(w => w.week === week);
  return weekData?.days.find(d => d.day === day) || null;
}

export function getWeek(weekNum: number): WeekCurriculum | null {
  return CURRICULUM.find(w => w.week === weekNum) || null;
}

export function isWeekLocked(week: number): boolean {
  return week >= 25;
}
