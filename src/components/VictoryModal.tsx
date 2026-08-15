import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Footprints, 
  Timer, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  LogIn,
  Flame,
  Heart
} from 'lucide-react';
import { Difficulty, ScoreBreakdown } from '../types';
import { formatTime, calculateGameScore } from '../utils/puzzle';
import { sounds } from '../utils/audio';
import { Language, translations } from '../utils/i18n';
import { User } from '../firebase';

interface VictoryModalProps {
  isOpen: boolean;
  timeSeconds: number;
  moves: number;
  difficulty: Difficulty;
  isNewRecord: boolean;
  currentUser: User | null;
  initialPlayerName: string;
  hasAutoSaved: boolean;
  onSaveScore: (playerName: string) => void;
  onSignInAndSave: () => Promise<void>;
  onOpenLeaderboard: () => void;
  onPlayAgain: () => void;
  onNextDifficulty?: () => void;
  onOpenUpload?: () => void;
  language: Language;
  earnedScore?: number;
  totalCumulativeScore?: number;
  dailyStreak?: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  timeSeconds,
  moves,
  difficulty,
  isNewRecord,
  currentUser,
  initialPlayerName,
  hasAutoSaved,
  onSaveScore,
  onSignInAndSave,
  onOpenLeaderboard,
  onPlayAgain,
  onNextDifficulty,
  onOpenUpload,
  language,
  earnedScore,
  totalCumulativeScore,
  dailyStreak = 1,
}) => {
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [manualSaved, setManualSaved] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const t = translations[language];

  // Calculate score breakdown
  const scoreData: ScoreBreakdown = calculateGameScore(timeSeconds, moves, difficulty);
  const totalScoreEarned = earnedScore ?? scoreData.totalScore;

  useEffect(() => {
    if (isOpen) {
      setManualSaved(false);
      setShowGuestInput(false);
      setShowScoreBreakdown(false);
      setPlayerName(currentUser?.displayName || initialPlayerName);
      sounds.playVictory();

      // Festive celebration confetti
      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#3A5A40', '#A3B18A', '#E0A96D', '#ffffff', '#588157'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 65,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#A3B18A', '#588157', '#ffffff'],
          });
          confetti({
            particleCount: 65,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#3A5A40', '#E0A96D', '#ffffff'],
          });
        }, 280);
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen, initialPlayerName, currentUser]);

  if (!isOpen) return null;

  const movesPerMin = timeSeconds > 0 ? Math.round((moves / timeSeconds) * 60) : 0;

  const handleGoogleSignInClick = async () => {
    setIsSigningIn(true);
    try {
      await onSignInAndSave();
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = playerName.trim() || 'Champion Solver';
    onSaveScore(finalName);
    setManualSaved(true);
  };

  const isSaved = hasAutoSaved || manualSaved;

  return (
    <div 
      id="modal-victory-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div 
        id="modal-victory-content"
        className="bg-[#FDFCF8] border border-[#DAD2C3] w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden text-[#4A453E] text-center p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200 my-auto"
      >
        {/* Victory Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#A3B18A]/30 border border-[#9A9E7C]/40 flex items-center justify-center mb-3 text-[#3A5A40] shadow-sm">
          <Trophy className="w-8 h-8 text-[#3A5A40] animate-bounce" />
        </div>

        {/* Header Title */}
        <div className="mb-2">
          {isNewRecord && (
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#3A5A40]/10 text-[#3A5A40] font-bold text-xs border border-[#3A5A40]/25 mb-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {t.newRecord}
            </span>
          )}
          <h2 className="text-3xl font-bold font-serif text-[#3A5A40] tracking-tight">
            {t.victoryTitle}
          </h2>
          <p className="text-xs text-[#7A746B] mt-0.5">
            {t.victorySubtitle}
          </p>
        </div>

        {/* Score & Points Banner with Stack Info */}
        <div className="my-3 bg-linear-to-r from-[#3A5A40]/10 via-[#B08968]/15 to-[#3A5A40]/10 border border-[#3A5A40]/20 rounded-2xl p-3.5 text-center">
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#7E8260] mb-0.5">
            {t.totalEarned}
          </div>
          <div className="text-3xl font-extrabold text-[#3A5A40] flex items-center justify-center gap-1.5 font-sans">
            <Sparkles className="w-5 h-5 text-[#B08968] fill-[#B08968]/30" />
            <span>+{totalScoreEarned.toLocaleString()}</span>
            <span className="text-sm font-semibold text-[#7E8260]">pts</span>
          </div>

          {/* Daily Stack & Streak Footer inside banner */}
          <div className="mt-2 pt-2 border-t border-[#3A5A40]/15 flex items-center justify-around text-xs">
            {totalCumulativeScore !== undefined && totalCumulativeScore > 0 && (
              <div className="flex items-center gap-1 text-[#4A453E]">
                <span className="text-[11px] text-[#7A746B]">{t.stackedTotal}:</span>
                <strong className="text-[#3A5A40] font-bold">{(totalCumulativeScore).toLocaleString()}</strong>
              </div>
            )}
            {dailyStreak > 0 && (
              <div className="flex items-center gap-1 text-[#B08968] font-bold text-[11px]">
                <Flame className="w-3.5 h-3.5 fill-[#B08968]/30" />
                <span>{dailyStreak} {dailyStreak === 1 ? 'Day Streak' : 'Days Streak'}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
              className="text-[10px] text-[#3A5A40] hover:underline font-semibold"
            >
              {showScoreBreakdown ? 'Hide Breakdown' : 'Breakdown ▾'}
            </button>
          </div>

          {/* Expandable Breakdown Drawer */}
          {showScoreBreakdown && (
            <div className="mt-2.5 pt-2 border-t border-[#3A5A40]/15 grid grid-cols-2 gap-1.5 text-left text-[11px] bg-[#FDFCF8]/90 p-2.5 rounded-xl">
              <div className="flex justify-between text-[#7A746B]">
                <span>{t.basePoints}:</span>
                <strong className="text-[#4A453E]">+{scoreData.baseScore}</strong>
              </div>
              <div className="flex justify-between text-[#7A746B]">
                <span>{t.timeBonus}:</span>
                <strong className="text-[#3A5A40]">+{scoreData.timeBonus}</strong>
              </div>
              <div className="flex justify-between text-[#7A746B]">
                <span>{t.moveBonus}:</span>
                <strong className="text-[#3A5A40]">+{scoreData.moveBonus}</strong>
              </div>
              <div className="flex justify-between text-[#7A746B]">
                <span>{t.paceBonus}:</span>
                <strong className="text-[#3A5A40]">+{scoreData.paceBonus}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Performance Results Grid */}
        <div className="grid grid-cols-3 gap-2 my-3 bg-[#F5F2EA] p-3 rounded-2xl border border-[#E5E0D5]">
          
          {/* Time Stat */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#9A9E7C] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Timer className="w-3 h-3 text-[#3A5A40]" />
              {t.time}
            </span>
            <span className="text-base sm:text-lg font-sans font-bold text-[#3A5A40] tabular-nums">
              {formatTime(timeSeconds)}
            </span>
          </div>

          {/* Moves Stat */}
          <div className="flex flex-col items-center justify-center border-x border-[#E5E0D5] px-1.5">
            <span className="text-[10px] text-[#9A9E7C] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Footprints className="w-3 h-3 text-[#3A5A40]" />
              {t.moves}
            </span>
            <span className="text-base sm:text-lg font-sans font-bold text-[#4A453E] tabular-nums">
              {moves}
            </span>
          </div>

          {/* Pace Stat */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#9A9E7C] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Zap className="w-3 h-3 text-[#7E8260]" />
              {t.movesPerMin.split(' ')[0]}
            </span>
            <span className="text-base sm:text-lg font-sans font-bold text-[#4A453E] tabular-nums">
              {movesPerMin} <span className="text-[10px] font-normal text-[#7A746B]">m/m</span>
            </span>
          </div>

        </div>

        {/* Score Persistence & Authentication Section */}
        {currentUser || isSaved ? (
          /* Case 1: User is Logged In -> Auto-saved state */
          <div className="mb-3.5 bg-[#A3B18A]/20 border border-[#9A9E7C]/40 p-3 rounded-2xl text-left flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3A5A40]/15 flex items-center justify-center shrink-0 border border-[#3A5A40]/25 overflow-hidden">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'Player'} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#3A5A40]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#3A5A40] flex items-center gap-1.5">
                <span>{t.autoSavedBadge}</span>
              </div>
              <div className="text-[11px] text-[#7A746B] truncate">
                {t.savedAs} <strong className="text-[#4A453E]">{currentUser?.displayName || playerName || 'Player'}</strong>
              </div>
            </div>
          </div>
        ) : (
          /* Case 2: User is NOT Logged In -> Prompt to Sign In with Google & Auto-Save */
          <div className="mb-3.5 bg-[#F5F2EA] border border-[#DAD2C3] p-3.5 rounded-2xl text-left space-y-2.5">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#3A5A40]/10 flex items-center justify-center shrink-0 text-[#3A5A40] mt-0.5">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#4A453E]">
                  {t.signInToSavePrompt}
                </p>
                <p className="text-[10px] text-[#7A746B] mt-0.5">
                  Sign in once to record this score and track your rank against players worldwide.
                </p>
              </div>
            </div>

            {/* Google Sign In & Auto-Save Button */}
            <button
              id="btn-victory-google-login"
              type="button"
              onClick={handleGoogleSignInClick}
              disabled={isSigningIn}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#DAD2C3] font-sans font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.54 0 2.9.54 3.97 1.43l2.97-2.97C17.06 1.71 14.7 1 12 1 7.42 1 3.51 3.58 1.63 7.3l3.57 2.77C6.07 7.04 8.78 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.28c0-.82-.07-1.6-.21-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-2 3.71-4.94 3.71-8.69z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.2 14.93c-.22-.67-.35-1.38-.35-2.12s.13-1.45.35-2.12L1.63 7.92C.59 9.99 0 12.3 0 14.81s.59 4.82 1.63 6.89l3.57-2.77z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.63c3.24 0 5.95-1.07 7.94-2.92l-3.71-2.88c-1.07.72-2.45 1.16-4.23 1.16-3.22 0-5.93-2.04-6.8-4.93L1.63 16.83C3.51 20.55 7.42 23.63 12 23.63z"
                />
              </svg>
              <span>{isSigningIn ? 'Signing in...' : t.signInAndSaveBtn}</span>
            </button>

            {/* Optional Guest Name Form */}
            {!showGuestInput ? (
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowGuestInput(true)}
                  className="text-[11px] text-[#7A746B] hover:text-[#3A5A40] underline underline-offset-2 transition"
                >
                  {t.guestSaveToggle}
                </button>
              </div>
            ) : (
              <form onSubmit={handleManualSave} className="space-y-2 pt-1 border-t border-[#E5E0D5]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={24}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder={t.enterName}
                    className="flex-1 px-3 py-1.5 bg-[#FDFCF8] border border-[#DAD2C3] focus:border-[#3A5A40] rounded-xl text-xs text-[#4A453E] placeholder-[#9A9E7C] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-bold text-xs"
                  >
                    {t.saveScoreBtn}
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          
          <button
            id="btn-victory-view-leaderboard"
            type="button"
            onClick={onOpenLeaderboard}
            className="py-3 px-4 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-sans font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-1.5 flex-1 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>{t.viewLeaderboard}</span>
          </button>

          <button
            id="btn-play-again"
            type="button"
            onClick={onPlayAgain}
            className="py-3 px-4 rounded-xl bg-[#EBE7DF] hover:bg-[#DAD2C3] text-[#4A453E] font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 flex-1 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#7E8260]" />
            <span>{t.playAgain}</span>
          </button>

        </div>

        {/* Submit Your Pet Button */}
        {onOpenUpload && (
          <button
            id="btn-victory-submit-pet"
            type="button"
            onClick={onOpenUpload}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#3A5A40] border border-[#DAD2C3] font-sans font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Heart className="w-3.5 h-3.5 text-[#3A5A40] fill-[#3A5A40]/20" />
            <span>Submit Your Pet for Daily Rotation</span>
          </button>
        )}

        {/* Next Difficulty Link */}
        {onNextDifficulty && difficulty !== 'master' && (
          <button
            id="btn-next-difficulty"
            type="button"
            onClick={onNextDifficulty}
            className="w-full mt-2.5 py-1.5 text-xs text-[#3A5A40] hover:text-[#2E4833] font-semibold flex items-center justify-center gap-1 transition"
          >
            {t.nextChallenge} ({difficulty === 'hard' ? 'Master' : 'Next'}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
};

