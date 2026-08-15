import React from 'react';
import { Timer, Footprints, Zap, Pause, Play, Award, ChevronDown, EyeOff, Hash } from 'lucide-react';
import { Difficulty, GameStatus } from '../types';
import { formatTime, formatTimeCompact } from '../utils/puzzle';

interface ScoreboardProps {
  timeSeconds: number;
  moves: number;
  difficulty: Difficulty;
  onChangeDifficulty: (diff: Difficulty) => void;
  status: GameStatus;
  onTogglePause: () => void;
  bestTime: number | null;
  fewestMoves: number | null;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  timeSeconds,
  moves,
  difficulty,
  onChangeDifficulty,
  status,
  onTogglePause,
  bestTime,
  fewestMoves,
}) => {
  const movesPerMin = timeSeconds > 0 ? ((moves / timeSeconds) * 60).toFixed(0) : '0';

  const difficulties: { key: Difficulty; label: string; detail: string; hasNumbers: boolean }[] = [
    { key: 'easy', label: 'Easy', detail: '35 moves • Numbers on', hasNumbers: true },
    { key: 'medium', label: 'Standard', detail: '85 moves • Numbers on', hasNumbers: true },
    { key: 'hard', label: 'Hard', detail: '200 moves • Numbers on', hasNumbers: true },
    { key: 'master', label: 'Master', detail: '320 moves • No Numbers', hasNumbers: false },
  ];

  const currentDiffConfig = difficulties.find(d => d.key === difficulty) || difficulties[1];

  return (
    <div id="game-scoreboard" className="w-full max-w-2xl mx-auto mb-3">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 mb-3">
        
        {/* Stopwatch Timer Card */}
        <div 
          id="metric-timer-card"
          className="bg-[#F5F2EA] border border-[#E5E0D5] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#7A746B] mb-1">
            <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-[#9A9E7C]">
              <Timer className="w-3.5 h-3.5 text-[#3A5A40]" />
              Session
            </span>
            {status === 'playing' && (
              <span className="w-2 h-2 rounded-full bg-[#3A5A40] animate-ping" />
            )}
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-3xl font-sans font-medium tabular-nums tracking-tight text-[#4A453E]">
              {formatTime(timeSeconds)}
            </span>
            {status === 'playing' || status === 'paused' ? (
              <button
                id="btn-pause-toggle"
                onClick={onTogglePause}
                title={status === 'paused' ? "Resume Game" : "Pause Game"}
                className="p-1.5 rounded-xl bg-[#EBE7DF] hover:bg-[#DAD2C3] text-[#4A453E] transition text-xs border border-[#DAD2C3]"
              >
                {status === 'paused' ? (
                  <Play className="w-3.5 h-3.5 text-[#3A5A40] fill-[#3A5A40]" />
                ) : (
                  <Pause className="w-3.5 h-3.5 text-[#7E8260]" />
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* Moves Card */}
        <div 
          id="metric-moves-card"
          className="bg-[#F5F2EA] border border-[#E5E0D5] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#7A746B] mb-1">
            <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-[#9A9E7C]">
              <Footprints className="w-3.5 h-3.5 text-[#3A5A40]" />
              Moves
            </span>
            {fewestMoves !== null && (
              <span className="text-[10px] text-[#7A746B] hidden sm:inline" title="Personal Record Fewest Moves">
                Best: {fewestMoves}
              </span>
            )}
          </div>
          <div className="text-xl sm:text-3xl font-sans font-medium tabular-nums text-[#4A453E] mt-1">
            {moves}
          </div>
        </div>

        {/* Speed / Pace Card */}
        <div 
          id="metric-pace-card"
          className="bg-[#F5F2EA] border border-[#E5E0D5] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-[#7A746B] mb-1">
            <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-[#9A9E7C]">
              <Zap className="w-3.5 h-3.5 text-[#7E8260]" />
              Pace
            </span>
            <span className="text-[10px] text-[#9A9E7C] uppercase tracking-wider font-semibold">APM</span>
          </div>
          <div className="text-xl sm:text-3xl font-sans font-medium tabular-nums text-[#4A453E] flex items-baseline gap-1 mt-1">
            {movesPerMin} <span className="text-xs text-[#7A746B] font-sans font-normal">m/min</span>
          </div>
        </div>

      </div>

      {/* Difficulty Dropdown & Record Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-[#EBE7DF] p-2 sm:px-3 sm:py-2 rounded-2xl border border-[#DAD2C3]">
        
        {/* Difficulty Dropdown Selector */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <label htmlFor="difficulty-select" className="text-xs font-semibold text-[#4A453E] shrink-0 font-sans">
            Difficulty:
          </label>

          <div className="relative flex-1">
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={(e) => onChangeDifficulty(e.target.value as Difficulty)}
              className="w-full appearance-none bg-[#FDFCF8] hover:bg-[#F5F2EA] text-[#4A453E] font-sans font-semibold text-xs py-2 pl-3 pr-8 rounded-xl border border-[#DAD2C3] focus:outline-none focus:border-[#3A5A40] cursor-pointer shadow-xs transition"
            >
              <option value="easy">Easy (35 moves • Numbers ON)</option>
              <option value="medium">Standard (85 moves • Numbers ON)</option>
              <option value="hard">Hard (200 moves • Numbers ON)</option>
              <option value="master">Master (320 moves • NO NUMBERS)</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A746B]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Difficulty badge indicator */}
          {!currentDiffConfig.hasNumbers ? (
            <span 
              title="Numbers are hidden in Master mode" 
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-1 rounded-xl bg-[#3A5A40] text-[#FDFCF8] shadow-xs shrink-0"
            >
              <EyeOff className="w-3 h-3" />
              No Numbers
            </span>
          ) : (
            <span 
              title="Tile numbers are visible in this mode" 
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-1 rounded-xl bg-[#3A5A40]/10 text-[#3A5A40] border border-[#3A5A40]/25 shrink-0"
            >
              <Hash className="w-3 h-3 text-[#3A5A40]" />
              Numbers On
            </span>
          )}
        </div>

        {/* Best Record Badge for current difficulty */}
        {bestTime !== null ? (
          <div className="px-3 py-1.5 rounded-xl bg-[#3A5A40]/10 border border-[#3A5A40]/25 text-[#3A5A40] text-xs flex items-center gap-1.5 shrink-0 font-sans font-medium">
            <Award className="w-3.5 h-3.5 text-[#3A5A40]" />
            <span>Record: <span className="font-mono font-bold">{formatTimeCompact(bestTime)}</span></span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-[#FDFCF8] text-[#7A746B] border border-[#E5E0D5] text-xs shrink-0 font-sans">
            <span>No record yet</span>
          </div>
        )}

      </div>
    </div>
  );
};
