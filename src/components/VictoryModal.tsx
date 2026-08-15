import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Footprints, Timer, Zap, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { Difficulty } from '../types';
import { formatTime } from '../utils/puzzle';
import { sounds } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  timeSeconds: number;
  moves: number;
  difficulty: Difficulty;
  imageTheme: string;
  isNewRecord: boolean;
  initialPlayerName: string;
  onSaveScore: (playerName: string) => void;
  onPlayAgain: () => void;
  onNextDifficulty?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  timeSeconds,
  moves,
  difficulty,
  imageTheme,
  isNewRecord,
  initialPlayerName,
  onSaveScore,
  onPlayAgain,
  onNextDifficulty,
}) => {
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSaved(false);
      setPlayerName(initialPlayerName);
      sounds.playVictory();

      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#10b981', '#ffffff', '#fbbf24'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#f59e0b', '#fbbf24', '#ffffff'],
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#10b981', '#34d399', '#ffffff'],
          });
        }, 300);
      } catch {
        // Ignore if confetti fails
      }
    }
  }, [isOpen, initialPlayerName]);

  if (!isOpen) return null;

  const movesPerMin = timeSeconds > 0 ? Math.round((moves / timeSeconds) * 60) : 0;

  const handleSaveAndLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = playerName.trim() || 'Champion Player';
    onSaveScore(finalName);
    setSaved(true);
  };

  return (
    <div 
      id="modal-victory-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div 
        id="modal-victory-content"
        className="bg-[#FDFCF8] border border-[#DAD2C3] w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden text-[#4A453E] text-center p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200"
      >
        {/* Victory Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#A3B18A]/30 border border-[#9A9E7C]/40 flex items-center justify-center mb-4 text-[#3A5A40] shadow-sm">
          <Trophy className="w-8 h-8 text-[#3A5A40] animate-bounce" />
        </div>

        {/* Header Title */}
        <div className="mb-2">
          {isNewRecord && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3A5A40]/10 text-[#3A5A40] font-bold text-xs border border-[#3A5A40]/25 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              NEW PERSONAL RECORD!
            </span>
          )}
          <h2 className="text-3xl font-bold font-serif text-[#3A5A40] tracking-tight">
            Puzzle Solved!
          </h2>
          <p className="text-xs text-[#7A746B] mt-1">
            Splendid work! You completed the 16-puzzle challenge.
          </p>
        </div>

        {/* Performance Results Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-5 bg-[#F5F2EA] p-3.5 rounded-2xl border border-[#E5E0D5]">
          
          {/* Time Stat */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#9A9E7C] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
              <Timer className="w-3 h-3 text-[#3A5A40]" />
              Time
            </span>
            <span className="text-lg sm:text-xl font-sans font-bold text-[#3A5A40] tabular-nums">
              {formatTime(timeSeconds)}
            </span>
          </div>

          {/* Moves Stat */}
          <div className="flex flex-col items-center justify-center border-x border-[#E5E0D5] px-2">
            <span className="text-[10px] text-[#9A9E7C] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
              <Footprints className="w-3 h-3 text-[#3A5A40]" />
              Moves
            </span>
            <span className="text-lg sm:text-xl font-sans font-bold text-[#4A453E] tabular-nums">
              {moves}
            </span>
          </div>

          {/* Pace Stat */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#9A9E7C] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-[#7E8260]" />
              Pace
            </span>
            <span className="text-lg sm:text-xl font-sans font-bold text-[#4A453E] tabular-nums">
              {movesPerMin} <span className="text-[10px] font-normal text-[#7A746B]">m/m</span>
            </span>
          </div>

        </div>

        {/* Mode Tag */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#7A746B] mb-5">
          <span>Difficulty: <strong className="text-[#4A453E] capitalize">{difficulty === 'medium' ? 'Standard' : difficulty}</strong></span>
          <span>•</span>
          <span>Theme: <strong className="text-[#4A453E]">{imageTheme}</strong></span>
        </div>

        {/* Player Name Leaderboard Submission Form */}
        <form onSubmit={handleSaveAndLeaderboard} className="space-y-3">
          <div className="text-left">
            <label htmlFor="player-name-input" className="block text-xs font-semibold text-[#4A453E] mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#3A5A40]" />
              Enter Player Name for Leaderboard:
            </label>
            <input
              id="player-name-input"
              type="text"
              maxLength={24}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name or handle"
              className="w-full px-3.5 py-2.5 bg-[#F5F2EA] border border-[#DAD2C3] focus:border-[#3A5A40] rounded-xl text-sm text-[#4A453E] placeholder-[#9A9E7C] focus:outline-none transition shadow-inner font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              id="btn-save-score"
              type="submit"
              disabled={saved}
              className="flex-1 py-3 px-4 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-sans font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Trophy className="w-4 h-4" />
              {saved ? 'Saved to Leaderboard ✓' : 'Save to Leaderboard'}
            </button>

            <button
              id="btn-play-again"
              type="button"
              onClick={onPlayAgain}
              className="py-3 px-4 rounded-xl bg-[#EBE7DF] hover:bg-[#DAD2C3] text-[#4A453E] font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-[#7E8260]" />
              Play Again
            </button>
          </div>

          {onNextDifficulty && difficulty !== 'master' && (
            <button
              id="btn-next-difficulty"
              type="button"
              onClick={onNextDifficulty}
              className="w-full py-2 text-xs text-[#3A5A40] hover:text-[#2E4833] font-semibold flex items-center justify-center gap-1 transition"
            >
              Try next harder difficulty ({difficulty === 'hard' ? 'Master • No Numbers' : 'Next Level'}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

      </div>
    </div>
  );
};
