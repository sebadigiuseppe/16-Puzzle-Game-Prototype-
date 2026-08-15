import { Difficulty, PlayerStats, ScoreRecord } from '../types';
import { calculateGameScore } from './puzzle';

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
    scorePoints: calculateGameScore('medium', 42.4, 58).totalScore,
    cumulativeScore: 8450,
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
    scorePoints: calculateGameScore('easy', 18.2, 26).totalScore,
    cumulativeScore: 3200,
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
    scorePoints: calculateGameScore('hard', 84.6, 112).totalScore,
    cumulativeScore: 12800,
  },
  {
    id: 'seed-4',
    playerName: 'BlindMaster',
    timeInSeconds: 118.4,
    moves: 146,
    difficulty: 'master',
    date: '2026-08-14',
    imageTheme: 'Rustic Horse',
    movesPerMinute: 74.0,
    rankBadge: 'Grandmaster',
    scorePoints: calculateGameScore('master', 118.4, 146).totalScore,
    cumulativeScore: 19500,
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
    scorePoints: calculateGameScore('medium', 59.8, 74).totalScore,
    cumulativeScore: 5600,
  }
];

const INITIAL_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTimeSeconds: {
    easy: null,
    medium: null,
    hard: null,
    master: null,
  },
  fewestMoves: {
    easy: null,
    medium: null,
    hard: null,
    master: null,
  },
  totalPlayTimeSeconds: 0,
  totalMovesMade: 0,
  totalCumulativeScore: 0,
  todayScore: 0,
  lastPlayedDate: '',
  dailyStreak: 0,
};


export function deduplicateScores(records: ScoreRecord[]): ScoreRecord[] {
  const seenKeys = new Set<string>();
  const result: ScoreRecord[] = [];

  for (const record of records) {
    // Unique key identifying a specific recorded win
    const compositeKey = record.id && !record.id.startsWith('score-')
      ? record.id
      : `${record.userId || record.playerName}_${record.difficulty}_${record.timeInSeconds}_${record.moves}_${record.date}`;

    if (!seenKeys.has(compositeKey)) {
      seenKeys.add(compositeKey);
      result.push(record);
    }
  }

  return result;
}

export function getStoredLeaderboard(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(INITIAL_BENCHMARK_SCORES));
      return INITIAL_BENCHMARK_SCORES;
    }
    const parsed = JSON.parse(raw);
    return deduplicateScores(parsed);
  } catch {
    return INITIAL_BENCHMARK_SCORES;
  }
}

export function saveScoreToLeaderboard(record: ScoreRecord): ScoreRecord[] {
  try {
    const current = getStoredLeaderboard();
    // Check if duplicate already exists (e.g. same user/player, difficulty, time and moves)
    const isDuplicate = current.some((s) => {
      if (s.id === record.id) return true;
      const sameUser = (record.userId && s.userId === record.userId) || 
                       (s.playerName.trim().toLowerCase() === record.playerName.trim().toLowerCase());
      const sameStats = s.difficulty === record.difficulty && 
                        Math.abs(s.timeInSeconds - record.timeInSeconds) < 0.05 && 
                        s.moves === record.moves;
      return sameUser && sameStats;
    });

    if (isDuplicate) {
      return current;
    }

    const updated = [record, ...current];
    // Sort primarily by time, then moves
    updated.sort((a, b) => a.timeInSeconds - b.timeInSeconds || a.moves - b.moves);
    // Deduplicate
    const deduped = deduplicateScores(updated);
    // Keep top 100
    const trimmed = deduped.slice(0, 100);
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
    const parsed = JSON.parse(raw);
    
    // Check if today is a new day to reset todayScore
    const todayStr = new Date().toISOString().split('T')[0];
    const isSameDay = parsed.lastPlayedDate === todayStr;

    return {
      ...INITIAL_STATS,
      ...parsed,
      bestTimeSeconds: {
        ...INITIAL_STATS.bestTimeSeconds,
        ...(parsed.bestTimeSeconds || {}),
      },
      fewestMoves: {
        ...INITIAL_STATS.fewestMoves,
        ...(parsed.fewestMoves || {}),
      },
      totalCumulativeScore: parsed.totalCumulativeScore || 0,
      todayScore: isSameDay ? (parsed.todayScore || 0) : 0,
      lastPlayedDate: parsed.lastPlayedDate || '',
      dailyStreak: parsed.dailyStreak || 0,
    };
  } catch {
    return INITIAL_STATS;
  }
}

export function updatePlayerStats(
  difficulty: Difficulty,
  timeSeconds: number,
  moves: number,
  earnedScore?: number
): PlayerStats {
  try {
    const stats = getPlayerStats();
    const scoreToAdd = earnedScore !== undefined 
      ? earnedScore 
      : calculateGameScore(difficulty, timeSeconds, moves).totalScore;

    stats.gamesPlayed += 1;
    stats.gamesWon += 1;
    stats.totalPlayTimeSeconds += timeSeconds;
    stats.totalMovesMade += moves;
    stats.totalCumulativeScore = (stats.totalCumulativeScore || 0) + scoreToAdd;

    // Daily streak & today score calculation
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stats.lastPlayedDate === todayStr) {
      stats.todayScore = (stats.todayScore || 0) + scoreToAdd;
    } else if (stats.lastPlayedDate === yesterdayStr) {
      stats.todayScore = scoreToAdd;
      stats.dailyStreak = (stats.dailyStreak || 0) + 1;
    } else {
      stats.todayScore = scoreToAdd;
      stats.dailyStreak = 1;
    }
    stats.lastPlayedDate = todayStr;

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
