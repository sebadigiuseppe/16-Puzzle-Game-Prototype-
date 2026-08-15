import { Difficulty, PlayerStats, ScoreRecord } from '../types';

const LEADERBOARD_KEY = '16puzzle_leaderboard_v1';
const STATS_KEY = '16puzzle_player_stats_v1';
const PLAYER_NAME_KEY = '16puzzle_last_player_name';

const INITIAL_BENCHMARK_SCORES: ScoreRecord[] = [
  {
    id: 'seed-1',
    playerName: 'EquestrianAce',
    timeInSeconds: 42.4,
    moves: 58,
    difficulty: 'medium',
    date: '2026-08-10',
    imageTheme: 'Rustic Horse',
    movesPerMinute: 82.1,
    rankBadge: 'Grandmaster',
  },
  {
    id: 'seed-2',
    playerName: 'PuzzleRider',
    timeInSeconds: 18.2,
    moves: 26,
    difficulty: 'easy',
    date: '2026-08-12',
    imageTheme: 'Rustic Horse',
    movesPerMinute: 85.7,
    rankBadge: 'Master',
  },
  {
    id: 'seed-3',
    playerName: 'BlondeMane99',
    timeInSeconds: 84.6,
    moves: 112,
    difficulty: 'hard',
    date: '2026-08-13',
    imageTheme: 'Rustic Horse',
    movesPerMinute: 79.4,
    rankBadge: 'Champion',
  },
  {
    id: 'seed-4',
    playerName: 'SlideSwift',
    timeInSeconds: 12.1,
    moves: 16,
    difficulty: 'practice',
    date: '2026-08-14',
    imageTheme: 'Rustic Horse',
    movesPerMinute: 79.3,
    rankBadge: 'Pro',
  },
  {
    id: 'seed-5',
    playerName: 'CanyonGallop',
    timeInSeconds: 59.8,
    moves: 74,
    difficulty: 'medium',
    date: '2026-08-14',
    imageTheme: 'Rustic Horse',
    movesPerMinute: 74.2,
    rankBadge: 'Expert',
  }
];

const INITIAL_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTimeSeconds: {
    practice: null,
    easy: null,
    medium: null,
    hard: null,
  },
  fewestMoves: {
    practice: null,
    easy: null,
    medium: null,
    hard: null,
  },
  totalPlayTimeSeconds: 0,
  totalMovesMade: 0,
};

export function getStoredLeaderboard(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(INITIAL_BENCHMARK_SCORES));
      return INITIAL_BENCHMARK_SCORES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BENCHMARK_SCORES;
  }
}

export function saveScoreToLeaderboard(record: ScoreRecord): ScoreRecord[] {
  try {
    const current = getStoredLeaderboard();
    const updated = [record, ...current];
    // Sort primarily by time, then moves
    updated.sort((a, b) => a.timeInSeconds - b.timeInSeconds || a.moves - b.moves);
    // Keep top 100
    const trimmed = updated.slice(0, 100);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch {
    return [];
  }
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch {
    // Ignore
  }
}

export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    return { ...INITIAL_STATS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATS;
  }
}

export function updatePlayerStats(
  difficulty: Difficulty,
  timeSeconds: number,
  moves: number
): PlayerStats {
  try {
    const stats = getPlayerStats();
    stats.gamesPlayed += 1;
    stats.gamesWon += 1;
    stats.totalPlayTimeSeconds += timeSeconds;
    stats.totalMovesMade += moves;

    const currentBestTime = stats.bestTimeSeconds[difficulty];
    if (currentBestTime === null || timeSeconds < currentBestTime) {
      stats.bestTimeSeconds[difficulty] = timeSeconds;
    }

    const currentFewestMoves = stats.fewestMoves[difficulty];
    if (currentFewestMoves === null || moves < currentFewestMoves) {
      stats.fewestMoves[difficulty] = moves;
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch {
    return INITIAL_STATS;
  }
}

export function recordGameStarted(): void {
  try {
    const stats = getPlayerStats();
    stats.gamesPlayed += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore
  }
}

export function getSavedPlayerName(): string {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || 'Player 1';
  } catch {
    return 'Player 1';
  }
}

export function setSavedPlayerName(name: string): void {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name.trim());
  } catch {
    // Ignore
  }
}
