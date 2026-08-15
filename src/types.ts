export type Difficulty = 'practice' | 'easy' | 'medium' | 'hard';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won';

export interface TileState {
  id: number;           // 0 to 15 (0..14 are image slices, 15 is blank)
  originalPos: number; // 0 to 15 (row * 4 + col)
  currentPos: number;  // current index 0 to 15 on the board
  isBlank: boolean;
}

export interface ScoreRecord {
  id: string;
  playerName: string;
  timeInSeconds: number;
  moves: number;
  difficulty: Difficulty;
  date: string;
  imageTheme: string;
  movesPerMinute: number;
  rankBadge?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeSeconds: Record<Difficulty, number | null>;
  fewestMoves: Record<Difficulty, number | null>;
  totalPlayTimeSeconds: number;
  totalMovesMade: number;
}

export interface PuzzleImage {
  id: string;
  name: string;
  url: string;
  author?: string;
  isCustom?: boolean;
}
