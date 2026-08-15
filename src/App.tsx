import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Scoreboard } from './components/Scoreboard';
import { PuzzleBoard } from './components/PuzzleBoard';
import { LeaderboardModal } from './components/LeaderboardModal';
import { VictoryModal } from './components/VictoryModal';
import { InstructionsModal } from './components/InstructionsModal';
import { PeekModal } from './components/PeekModal';
import { ShuffleConfirmModal } from './components/ShuffleConfirmModal';
import { DEFAULT_IMAGE } from './data/images';
import { Difficulty, GameStatus, PlayerStats, PuzzleImage, ScoreRecord, TileState } from './types';
import { 
  BLANK_ID, 
  getRowCol, 
  getSlidePath, 
  isPuzzleSolved, 
  shuffleBoard 
} from './utils/puzzle';
import { sounds } from './utils/audio';
import { 
  clearLeaderboard, 
  getPlayerStats, 
  getSavedPlayerName, 
  getStoredLeaderboard, 
  recordGameStarted, 
  saveScoreToLeaderboard, 
  setSavedPlayerName, 
  updatePlayerStats 
} from './utils/storage';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithGoogle, 
  signOutPlayer, 
  saveScoreToCloud, 
  fetchCloudLeaderboard, 
  User 
} from './firebase';
import { Trophy, Shuffle, Eye } from 'lucide-react';

export default function App() {
  // Puzzle & Game State (Fixed to Horse Portrait theme)
  const currentImage = DEFAULT_IMAGE;
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [tiles, setTiles] = useState<TileState[]>(() => shuffleBoard('medium'));
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Preferences & Toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const showNumbers = difficulty !== 'master';

  // Leaderboard & Analytics State
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [stats, setStats] = useState<PlayerStats>(getPlayerStats());
  const [lastPlayerName, setLastPlayerName] = useState<string>(getSavedPlayerName());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isPeekOpen, setIsPeekOpen] = useState<boolean>(false);
  const [isShuffleConfirmOpen, setIsShuffleConfirmOpen] = useState<boolean>(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null);

  // Timer reference
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Track Firebase Auth state & fetch Cloud Leaderboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.displayName) {
        setSavedPlayerName(user.displayName);
        setLastPlayerName(user.displayName);
      }
    });

    // Load initial local scores & stats
    const localScores = getStoredLeaderboard();
    setScores(localScores);
    setStats(getPlayerStats());

    // Fetch live cloud scores
    fetchCloudLeaderboard().then((cloudScores) => {
      if (cloudScores && cloudScores.length > 0) {
        // Merge without duplicating IDs
        setScores((prev) => {
          const map = new Map<string, ScoreRecord>();
          [...cloudScores, ...prev].forEach((item) => map.set(item.id, item));
          return Array.from(map.values()).sort((a, b) => a.timeInSeconds - b.timeInSeconds);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user?.displayName) {
        setLastPlayerName(user.displayName);
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
    }
  };

  // Google Sign Out handler
  const handleGoogleSignOut = async () => {
    try {
      await signOutPlayer();
    } catch (err) {
      console.warn('Google sign-out error:', err);
    }
  };

  // Timer interval handling
  useEffect(() => {
    if (status === 'playing') {
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setTimeSeconds(accumulatedTimeRef.current + elapsed);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  // Start new game / shuffle
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    sounds.playShuffle();
    const newTiles = shuffleBoard(diff);
    setTiles(newTiles);
    setStatus('idle');
    setTimeSeconds(0);
    setMoves(0);
    accumulatedTimeRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [difficulty]);

  // Request shuffle with confirmation dialog
  const handleRequestShuffle = () => {
    setPendingDifficulty(null);
    setIsShuffleConfirmOpen(true);
  };

  // Request difficulty change with confirmation dialog
  const handleRequestDifficultyChange = (newDiff: Difficulty) => {
    if (newDiff === difficulty) return;
    setPendingDifficulty(newDiff);
    setIsShuffleConfirmOpen(true);
  };

  // Confirm shuffle execution
  const handleConfirmShuffle = () => {
    if (pendingDifficulty) {
      setDifficulty(pendingDifficulty);
      startNewGame(pendingDifficulty);
      setPendingDifficulty(null);
    } else {
      startNewGame(difficulty);
    }
  };

  // Pause / Resume Toggle
  const handleTogglePause = () => {
    if (status === 'playing') {
      accumulatedTimeRef.current = timeSeconds;
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('playing');
    }
  };

  // Resume handler from overlay
  const handleResume = () => {
    setStatus('playing');
  };

  // Core Tile Movement
  const moveTileAtPosition = useCallback((clickedPos: number) => {
    setTiles((prevTiles) => {
      const blankTile = prevTiles.find((t) => t.isBlank || t.id === BLANK_ID);
      if (!blankTile) return prevTiles;

      const blankPos = blankTile.currentPos;
      const path = getSlidePath(clickedPos, blankPos);
      if (!path || path.length === 0) return prevTiles;

      // Start timer on first move if idle
      if (status === 'idle') {
        setStatus('playing');
        recordGameStarted();
      }

      // Clone tiles array
      const nextTiles = prevTiles.map((t) => ({ ...t }));

      // Slide sequence: move each position towards blank
      let currentEmpty = blankPos;
      for (const movePos of path) {
        const tileIndex = nextTiles.findIndex((t) => t.currentPos === movePos);
        const blankIndex = nextTiles.findIndex((t) => t.currentPos === currentEmpty);

        if (tileIndex !== -1 && blankIndex !== -1) {
          nextTiles[tileIndex].currentPos = currentEmpty;
          nextTiles[blankIndex].currentPos = movePos;
          currentEmpty = movePos;
        }
      }

      if (path.length > 1) {
        sounds.playMultiSlide();
      } else {
        sounds.playSlide();
      }

      setMoves((m) => m + 1);

      // Check win condition
      if (isPuzzleSolved(nextTiles)) {
        setTimeout(() => {
          handleWin(timeSeconds, moves + 1);
        }, 150);
      }

      return nextTiles;
    });
  }, [status, timeSeconds, moves]);

  // Keyboard navigation
  const handleKeyDownMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setTiles((prevTiles) => {
      const blankTile = prevTiles.find((t) => t.isBlank || t.id === BLANK_ID);
      if (!blankTile) return prevTiles;

      const blankPos = blankTile.currentPos;
      const { row, col } = getRowCol(blankPos);

      let targetPos: number | null = null;
      if (direction === 'up' && row < 3) {
        targetPos = (row + 1) * 4 + col; // tile below moves UP into blank
      } else if (direction === 'down' && row > 0) {
        targetPos = (row - 1) * 4 + col; // tile above moves DOWN into blank
      } else if (direction === 'left' && col < 3) {
        targetPos = row * 4 + (col + 1); // tile right moves LEFT into blank
      } else if (direction === 'right' && col > 0) {
        targetPos = row * 4 + (col - 1); // tile left moves RIGHT into blank
      }

      if (targetPos !== null) {
        setTimeout(() => {
          moveTileAtPosition(targetPos!);
        }, 0);
      }

      return prevTiles;
    });
  }, [moveTileAtPosition]);

  // Handle Win Condition
  const handleWin = (finalTime: number, finalMoves: number) => {
    setStatus('won');
    if (timerRef.current) clearInterval(timerRef.current);

    const prevBest = stats.bestTimeSeconds[difficulty];
    const isNew = prevBest === null || finalTime < prevBest;
    setIsNewRecord(isNew);

    const updatedStats = updatePlayerStats(difficulty, finalTime, finalMoves);
    setStats(updatedStats);

    setIsVictoryOpen(true);
  };

  // Submit score to Leaderboard (locally and Firestore cloud)
  const handleSaveScore = async (name: string) => {
    setSavedPlayerName(name);
    setLastPlayerName(name);

    const movesPerMin = timeSeconds > 0 ? (moves / timeSeconds) * 60 : 0;
    const newRecord: ScoreRecord = {
      id: `score-${Date.now()}`,
      playerName: name,
      photoURL: currentUser?.photoURL || null,
      userId: currentUser?.uid || null,
      timeInSeconds: timeSeconds,
      moves: moves,
      difficulty: difficulty,
      date: new Date().toISOString().split('T')[0],
      imageTheme: currentImage.name,
      movesPerMinute: movesPerMin,
      rankBadge: movesPerMin > 90 ? 'Grandmaster' : movesPerMin > 65 ? 'Master' : 'Challenger',
    };

    const updatedLeaderboard = saveScoreToLeaderboard(newRecord);
    setScores(updatedLeaderboard);

    // Save to Firebase Firestore
    await saveScoreToCloud(newRecord, currentUser);
  };

  // Reset Leaderboard
  const handleClearLeaderboard = () => {
    clearLeaderboard();
    setScores([]);
  };

  // Switch to next harder difficulty after win
  const handleNextDifficulty = () => {
    setIsVictoryOpen(false);
    const order: Difficulty[] = ['easy', 'medium', 'hard', 'master'];
    const currentIdx = order.indexOf(difficulty);
    if (currentIdx < order.length - 1) {
      const nextDiff = order[currentIdx + 1];
      setDifficulty(nextDiff);
      startNewGame(nextDiff);
    } else {
      startNewGame(difficulty);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#FDFCF8] text-[#4A453E] flex flex-col font-sans selection:bg-[#A3B18A]/30 selection:text-[#3A5A40]">
      
      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        imageName={currentImage.name}
        currentUser={currentUser}
        onSignInGoogle={handleGoogleSignIn}
        onSignOutGoogle={handleGoogleSignOut}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-4xl mx-auto w-full">
        
        {/* Score & Stopwatch Metric Cards */}
        <Scoreboard
          timeSeconds={timeSeconds}
          moves={moves}
          difficulty={difficulty}
          onChangeDifficulty={handleRequestDifficultyChange}
          status={status}
          onTogglePause={handleTogglePause}
          bestTime={stats.bestTimeSeconds[difficulty]}
          fewestMoves={stats.fewestMoves[difficulty]}
        />

        {/* The 4x4 Puzzle Board */}
        <PuzzleBoard
          tiles={tiles}
          currentImage={currentImage}
          showNumbers={showNumbers}
          status={status}
          onTileClick={moveTileAtPosition}
          onKeyDownMove={handleKeyDownMove}
          onResume={handleResume}
        />

        {/* Quick Footer Action Bar */}
        <div className="mt-6 flex items-center justify-center gap-2.5 flex-wrap w-full max-w-md">
          <button
            id="btn-quick-shuffle"
            onClick={handleRequestShuffle}
            className="px-4 py-2.5 rounded-2xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#DAD2C3] transition flex items-center gap-2 text-xs font-semibold shadow-xs"
          >
            <Shuffle className="w-4 h-4 text-[#3A5A40]" />
            Shuffle Board
          </button>

          <button
            id="btn-quick-peek"
            onClick={() => setIsPeekOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#DAD2C3] transition flex items-center gap-2 text-xs font-semibold shadow-xs"
          >
            <Eye className="w-4 h-4 text-[#7E8260]" />
            Reference Photo
          </button>

          <button
            id="btn-quick-leaderboard"
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#DAD2C3] transition flex items-center gap-2 text-xs font-semibold shadow-xs"
          >
            <Trophy className="w-4 h-4 text-[#3A5A40]" />
            High Scores
          </button>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="py-3 px-4 border-t border-[#E5E0D5] bg-[#F5F2EA]/40 text-center text-xs text-[#7A746B]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <span className="font-serif italic text-[#4A453E]">Sliding Puzzles • 4×4 Solvable Board</span>
          <span className="text-[11px] text-[#9A9E7C]">
            Live Timer Stopwatch & Cloud High Score Leaderboard Tracker
          </span>
        </div>
      </footer>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        scores={scores}
        stats={stats}
        onClearLeaderboard={handleClearLeaderboard}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryOpen}
        timeSeconds={timeSeconds}
        moves={moves}
        difficulty={difficulty}
        imageTheme={currentImage.name}
        isNewRecord={isNewRecord}
        initialPlayerName={lastPlayerName}
        onSaveScore={handleSaveScore}
        onPlayAgain={() => {
          setIsVictoryOpen(false);
          startNewGame();
        }}
        onNextDifficulty={difficulty !== 'master' ? handleNextDifficulty : undefined}
      />

      {/* How to Play Help Modal */}
      <InstructionsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Target Picture Reference Peek Modal */}
      <PeekModal
        isOpen={isPeekOpen}
        onClose={() => setIsPeekOpen(false)}
        currentImage={currentImage}
      />

      {/* Shuffle Confirmation Dialog Modal */}
      <ShuffleConfirmModal
        isOpen={isShuffleConfirmOpen}
        onClose={() => {
          setIsShuffleConfirmOpen(false);
          setPendingDifficulty(null);
        }}
        onConfirm={handleConfirmShuffle}
        difficultyName={
          pendingDifficulty 
            ? pendingDifficulty === 'medium' ? 'Standard' : pendingDifficulty === 'master' ? 'Master (No Numbers)' : pendingDifficulty 
            : undefined
        }
        hasActiveGame={status === 'playing' || moves > 0}
      />

    </div>
  );
}

