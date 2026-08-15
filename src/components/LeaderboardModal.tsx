import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  X, 
  Timer, 
  Footprints, 
  Zap, 
  Search, 
  BarChart2, 
  Medal, 
  RotateCcw, 
  Filter,
  Flame,
  Clock
} from 'lucide-react';
import { Difficulty, PlayerStats, ScoreRecord } from '../types';
import { formatTime, formatTimeCompact } from '../utils/puzzle';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: ScoreRecord[];
  stats: PlayerStats;
  onClearLeaderboard: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  scores,
  stats,
  onClearLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'stats'>('leaderboard');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'moves' | 'apm'>('time');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter and sort scores
  const filteredScores = useMemo(() => {
    return scores
      .filter((s) => {
        const matchesDiff = selectedDifficulty === 'all' || s.difficulty === selectedDifficulty;
        const matchesSearch = s.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              s.imageTheme.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDiff && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'time') return a.timeInSeconds - b.timeInSeconds;
        if (sortBy === 'moves') return a.moves - b.moves;
        if (sortBy === 'apm') return (b.movesPerMinute || 0) - (a.movesPerMinute || 0);
        return 0;
      });
  }, [scores, selectedDifficulty, sortBy, searchQuery]);

  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  const avgMoves = stats.gamesWon > 0 
    ? Math.round(stats.totalMovesMade / stats.gamesWon) 
    : 0;

  const overallAPM = stats.totalPlayTimeSeconds > 0
    ? Math.round((stats.totalMovesMade / stats.totalPlayTimeSeconds) * 60)
    : 0;

  return (
    <div 
      id="modal-leaderboard-backdrop" 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
      onClick={onClose}
    >
      <div 
        id="modal-leaderboard-content"
        className="bg-[#FDFCF8] border border-[#DAD2C3] w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden text-[#4A453E] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E0D5] flex items-center justify-between bg-[#F5F2EA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3A5A40]/15 border border-[#3A5A40]/25 flex items-center justify-center text-[#3A5A40]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#3A5A40] flex items-center gap-2">
                Leaderboard & Performance
              </h2>
              <p className="text-xs text-[#7A746B]">
                Track best times, fewest moves, and player statistics
              </p>
            </div>
          </div>
          <button
            id="btn-close-leaderboard"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#7A746B] hover:text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E0D5] px-4 bg-[#F5F2EA]/50">
          <button
            id="tab-leaderboard"
            onClick={() => setActiveTab('leaderboard')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition uppercase tracking-wider ${
              activeTab === 'leaderboard'
                ? 'border-[#3A5A40] text-[#3A5A40]'
                : 'border-transparent text-[#7A746B] hover:text-[#4A453E]'
            }`}
          >
            <Medal className="w-4 h-4" />
            Rankings ({filteredScores.length})
          </button>
          <button
            id="tab-stats"
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition uppercase tracking-wider ${
              activeTab === 'stats'
                ? 'border-[#3A5A40] text-[#3A5A40]'
                : 'border-transparent text-[#7A746B] hover:text-[#4A453E]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Analytics
          </button>
        </div>

        {/* Tab 1: High Score Rankings */}
        {activeTab === 'leaderboard' && (
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
              
              {/* Difficulty Filter */}
              <div className="flex items-center gap-1 bg-[#EBE7DF] p-1 rounded-xl border border-[#DAD2C3] overflow-x-auto text-xs">
                {(['all', 'practice', 'easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    id={`filter-diff-${diff}`}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                      selectedDifficulty === diff
                        ? 'bg-[#3A5A40] text-[#FDFCF8] font-semibold shadow-xs'
                        : 'text-[#7A746B] hover:text-[#4A453E] hover:bg-[#F5F2EA]'
                    }`}
                  >
                    {diff === 'all' ? 'All' : diff === 'medium' ? 'Standard' : diff}
                  </button>
                ))}
              </div>

              {/* Sort & Search Controls */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A746B]" />
                  <input
                    type="text"
                    placeholder="Search player..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-[#F5F2EA] border border-[#E5E0D5] rounded-xl text-xs text-[#4A453E] placeholder-[#9A9E7C] focus:outline-none focus:border-[#3A5A40]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#EBE7DF] p-1 rounded-xl border border-[#DAD2C3] text-xs">
                  <span className="text-[10px] text-[#7A746B] px-1 font-semibold flex items-center gap-0.5">
                    <Filter className="w-3 h-3" />
                  </span>
                  <button
                    onClick={() => setSortBy('time')}
                    className={`px-2 py-1 rounded-lg ${
                      sortBy === 'time' ? 'bg-[#3A5A40] text-[#FDFCF8] font-semibold shadow-xs' : 'text-[#7A746B] hover:text-[#4A453E]'
                    }`}
                    title="Sort by fastest time"
                  >
                    Time
                  </button>
                  <button
                    onClick={() => setSortBy('moves')}
                    className={`px-2 py-1 rounded-lg ${
                      sortBy === 'moves' ? 'bg-[#3A5A40] text-[#FDFCF8] font-semibold shadow-xs' : 'text-[#7A746B] hover:text-[#4A453E]'
                    }`}
                    title="Sort by fewest moves"
                  >
                    Moves
                  </button>
                  <button
                    onClick={() => setSortBy('apm')}
                    className={`px-2 py-1 rounded-lg ${
                      sortBy === 'apm' ? 'bg-[#3A5A40] text-[#FDFCF8] font-semibold shadow-xs' : 'text-[#7A746B] hover:text-[#4A453E]'
                    }`}
                    title="Sort by highest moves per minute"
                  >
                    Pace
                  </button>
                </div>
              </div>

            </div>

            {/* Scores Table */}
            <div className="border border-[#E5E0D5] rounded-2xl overflow-hidden bg-[#FDFCF8] shadow-xs">
              {filteredScores.length === 0 ? (
                <div className="py-12 text-center text-[#7A746B] text-xs">
                  No records match your filters. Complete a puzzle to post a high score!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EBE7DF] text-[#7A746B] border-b border-[#DAD2C3] uppercase tracking-wider font-semibold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3"># Rank</th>
                        <th className="py-2.5 px-3">Player</th>
                        <th className="py-2.5 px-3">Difficulty</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Moves</th>
                        <th className="py-2.5 px-3">Pace</th>
                        <th className="py-2.5 px-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D5]">
                      {filteredScores.map((score, idx) => {
                        return (
                          <tr 
                            key={score.id}
                            className={`hover:bg-[#F5F2EA]/70 transition ${
                              idx === 0 ? 'bg-[#3A5A40]/5' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 font-sans font-bold">
                              {idx === 0 ? (
                                <span className="inline-flex items-center gap-1 text-[#3A5A40]">
                                  🥇 1st
                                </span>
                              ) : idx === 1 ? (
                                <span className="inline-flex items-center gap-1 text-[#7A746B]">
                                  🥈 2nd
                                </span>
                              ) : idx === 2 ? (
                                <span className="inline-flex items-center gap-1 text-[#7E8260]">
                                  🥉 3rd
                                </span>
                              ) : (
                                <span className="text-[#9A9E7C] pl-1">{idx + 1}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-[#4A453E] flex items-center gap-1.5">
                                {score.playerName}
                                {score.rankBadge && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#EBE7DF] text-[#7A746B] border border-[#DAD2C3] font-normal">
                                    {score.rankBadge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#9A9E7C]">{score.imageTheme}</div>
                            </td>
                            <td className="py-2.5 px-3 capitalize">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                score.difficulty === 'hard'
                                  ? 'bg-[#3A5A40] text-[#FDFCF8] border-[#3A5A40]'
                                  : score.difficulty === 'medium'
                                  ? 'bg-[#A3B18A]/30 text-[#3A5A40] border-[#9A9E7C]/40'
                                  : score.difficulty === 'easy'
                                  ? 'bg-[#EBE7DF] text-[#4A453E] border-[#DAD2C3]'
                                  : 'bg-[#F5F2EA] text-[#7A746B] border-[#E5E0D5]'
                              }`}>
                                {score.difficulty === 'medium' ? 'Standard' : score.difficulty}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-sans font-bold text-[#3A5A40] tabular-nums">
                              {formatTime(score.timeInSeconds)}
                            </td>
                            <td className="py-2.5 px-3 font-sans text-[#4A453E] tabular-nums">
                              {score.moves}
                            </td>
                            <td className="py-2.5 px-3 font-sans text-[#7A746B] tabular-nums">
                              {score.movesPerMinute ? `${Math.round(score.movesPerMinute)} m/m` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-right text-[#9A9E7C] font-sans text-[11px] tabular-nums">
                              {score.date}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Clear Board Action */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#9A9E7C]">
                Top {filteredScores.length} records displayed
              </span>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-700">Reset all records?</span>
                  <button
                    onClick={() => {
                      onClearLeaderboard();
                      setConfirmClear(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 rounded-lg bg-[#EBE7DF] text-[#4A453E] text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-[#7A746B] hover:text-rose-700 flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Leaderboard
                </button>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Player Performance Analytics */}
        {activeTab === 'stats' && (
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
            
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F5F2EA] border border-[#E5E0D5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A9E7C] mb-1 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-[#3A5A40]" />
                  Games Won
                </div>
                <div className="text-2xl font-sans font-medium tabular-nums text-[#4A453E]">
                  {stats.gamesWon} <span className="text-xs font-normal text-[#9A9E7C]">/ {stats.gamesPlayed}</span>
                </div>
                <div className="text-[10px] text-[#7A746B] mt-1">
                  Win Rate: <span className="text-[#3A5A40] font-semibold">{winRate}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F2EA] border border-[#E5E0D5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A9E7C] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#3A5A40]" />
                  Total Time
                </div>
                <div className="text-2xl font-sans font-medium tabular-nums text-[#4A453E]">
                  {formatTimeCompact(stats.totalPlayTimeSeconds)}
                </div>
                <div className="text-[10px] text-[#7A746B] mt-1">
                  Across all sessions
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F2EA] border border-[#E5E0D5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A9E7C] mb-1 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-[#3A5A40]" />
                  Total Moves
                </div>
                <div className="text-2xl font-sans font-medium tabular-nums text-[#4A453E]">
                  {stats.totalMovesMade}
                </div>
                <div className="text-[10px] text-[#7A746B] mt-1">
                  Avg: {avgMoves} moves/win
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F2EA] border border-[#E5E0D5] shadow-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A9E7C] mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#7E8260]" />
                  Overall Pace
                </div>
                <div className="text-2xl font-sans font-medium tabular-nums text-[#3A5A40]">
                  {overallAPM} <span className="text-xs font-normal text-[#7A746B]">m/min</span>
                </div>
                <div className="text-[10px] text-[#7A746B] mt-1">
                  Speed rating
                </div>
              </div>
            </div>

            {/* Personal Records by Difficulty Matrix */}
            <div>
              <h3 className="text-xs font-bold font-sans uppercase tracking-widest text-[#9A9E7C] mb-3 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#3A5A40]" />
                Personal Records by Difficulty
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['practice', 'easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
                  const bestT = stats.bestTimeSeconds[diff];
                  const bestM = stats.fewestMoves[diff];
                  const title = diff === 'medium' ? 'Standard (85 moves)' : diff === 'practice' ? 'Practice (12 moves)' : diff === 'easy' ? 'Easy (35 moves)' : 'Expert (200 moves)';
                  
                  return (
                    <div 
                      key={diff}
                      className="p-3.5 rounded-2xl bg-[#F5F2EA] border border-[#E5E0D5] flex flex-col justify-between shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#4A453E] text-xs capitalize">{title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          bestT !== null ? 'bg-[#3A5A40]/10 text-[#3A5A40] border border-[#3A5A40]/20' : 'bg-[#EBE7DF] text-[#9A9E7C]'
                        }`}>
                          {bestT !== null ? 'Completed' : 'Not Cleared'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#FDFCF8] p-2.5 rounded-xl border border-[#E5E0D5]">
                          <div className="text-[10px] text-[#9A9E7C] flex items-center gap-1 mb-0.5">
                            <Timer className="w-3 h-3 text-[#3A5A40]" />
                            Best Time
                          </div>
                          <div className="font-sans font-bold text-[#3A5A40] tabular-nums">
                            {bestT !== null ? formatTime(bestT) : '--:--.-'}
                          </div>
                        </div>

                        <div className="bg-[#FDFCF8] p-2.5 rounded-xl border border-[#E5E0D5]">
                          <div className="text-[10px] text-[#9A9E7C] flex items-center gap-1 mb-0.5">
                            <Footprints className="w-3 h-3 text-[#7E8260]" />
                            Fewest Moves
                          </div>
                          <div className="font-sans font-bold text-[#4A453E] tabular-nums">
                            {bestM !== null ? `${bestM} moves` : '--'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E0D5] bg-[#F5F2EA] flex justify-end">
          <button
            id="btn-dismiss-leaderboard"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-sans font-semibold text-xs shadow-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
