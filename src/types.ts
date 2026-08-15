export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won';

export interface TileState {
  id: number;           // 0 to 15 (0..14 are image slices, 15 is blank)
  originalPos: number; // 0 to 15 (row * 4 + col)
  currentPos: number;  // current index 0 to 15 on the board
  isBlank: boolean;
}

export interface ScoreBreakdown {
  totalScore: number;
  baseScore: number;
  timeBonus: number;
  moveBonus: number;
  paceBonus: number;
  difficultyMultiplier: number;
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
  photoURL?: string | null;
  userId?: string | null;
  scorePoints?: number;
  cumulativeScore?: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeSeconds: Record<Difficulty, number | null>;
  fewestMoves: Record<Difficulty, number | null>;
  totalPlayTimeSeconds: number;
  totalMovesMade: number;
  totalCumulativeScore: number;
  todayScore: number;
  lastPlayedDate: string;
  dailyStreak: number;
}

export interface AIReviewResult {
  approved: boolean;
  animalDetected: string;
  qualityScore: number;
  reason: string;
  title: string;
}

export interface CommunityPetPicture {
  id: string;
  petName: string;
  description: string;
  location: string;
  submitterName: string;
  authorUid?: string | null;
  imageUrl: string;
  animalType: string;
  qualityScore?: number;
  aiComment?: string;
  status: 'approved' | 'rejected' | 'pending';
  createdAt: string;
  timesUsedAsDaily: number;
  lastUsedDate?: string | null;
  usedDates?: string[];
  isPreset?: boolean;
}

export interface PuzzleImage {
  id: string;
  name: string;
  url: string;
  author?: string;
  isCustom?: boolean;
  isDaily?: boolean;
  isCommunityPet?: boolean;
  petData?: CommunityPetPicture;
}

