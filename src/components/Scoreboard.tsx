import React from 'react';
import { Timer, Footprints, Zap, Pause, Play } from 'lucide-react';
import { GameStatus } from '../types';
import { formatTime } from '../utils/puzzle';
import { Language, translations } from '../utils/i18n';

interface ScoreboardProps {
  timeSeconds: number;
  moves: number;
  status: GameStatus;
  onTogglePause: () => void;
  fewestMoves: number | null;
  language: Language;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  timeSeconds,
  moves,
  status,
  onTogglePause,
  fewestMoves,
  language,
}) => {
  const t = translations[language];
  const movesPerMin = timeSeconds > 0 ? ((moves / timeSeconds) * 60).toFixed(0) : '0';

  return (
    <div id="game-scoreboard" className="w-full max-w-2xl mx-auto mb-3">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        
        {/* Stopwatch Timer Card */}
        <div 
          id="metric-timer-card"
          className="bg-[#F5F2EA] border border-[#E5E0D5] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#7A746B] mb-1">
            <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-[#9A9E7C]">
              <Timer className="w-3.5 h-3.5 text-[#3A5A40]" />
              {t.time}
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
                title={status === 'paused' ? t.resumeGame : t.paused}
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
              {t.moves}
            </span>
            {fewestMoves !== null && (
              <span className="text-[10px] text-[#7A746B] hidden sm:inline" title="Fewest Moves">
                {t.fewestMoves}: {fewestMoves}
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
              {t.movesPerMin.split(' ')[0]}
            </span>
            <span className="text-[10px] text-[#9A9E7C] uppercase tracking-wider font-semibold">APM</span>
          </div>
          <div className="text-xl sm:text-3xl font-sans font-medium tabular-nums text-[#4A453E] flex items-baseline gap-1 mt-1">
            {movesPerMin} <span className="text-xs text-[#7A746B] font-sans font-normal">m/min</span>
          </div>
        </div>

      </div>
    </div>
  );
};
