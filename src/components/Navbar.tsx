import React from 'react';
import { 
  Trophy, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Eye, 
  Hash, 
  Image as ImageIcon,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  showNumbers: boolean;
  onToggleNumbers: () => void;
  onOpenLeaderboard: () => void;
  onOpenImageSelector: () => void;
  onOpenHelp: () => void;
  onOpenPeek: () => void;
  onNewGame: () => void;
  imageName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
  showNumbers,
  onToggleNumbers,
  onOpenLeaderboard,
  onOpenImageSelector,
  onOpenHelp,
  onOpenPeek,
  onNewGame,
  imageName,
}) => {
  return (
    <header id="app-navbar" className="w-full bg-[#F5F2EA]/95 backdrop-blur-md border-b border-[#E5E0D5] text-[#4A453E] sticky top-0 z-30 px-4 py-3 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        
        {/* Brand & Theme Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#A3B18A]/25 border border-[#9A9E7C]/40 flex items-center justify-center text-[#3A5A40] font-black shadow-inner">
            <Sparkles className="w-5 h-5 text-[#3A5A40]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-tight text-[#3A5A40] flex items-center gap-2">
              16 Puzzle Game
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#A3B18A]/25 text-[#3A5A40] border border-[#9A9E7C]/40 uppercase tracking-wider">
                4×4
              </span>
            </h1>
            <p className="text-xs font-sans text-[#7A746B] hidden sm:block">
              Theme: <span className="text-[#4A453E] font-medium">{imageName}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          
          {/* Peek Original Image */}
          <button
            id="btn-peek-image"
            onClick={onOpenPeek}
            title="Peek at target picture"
            className="p-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#E5E0D5] transition flex items-center gap-1.5 text-xs font-sans font-medium shadow-xs"
          >
            <Eye className="w-4 h-4 text-[#3A5A40]" />
            <span className="hidden md:inline">Peek</span>
          </button>

          {/* Toggle Numbers Overlay */}
          <button
            id="btn-toggle-numbers"
            onClick={onToggleNumbers}
            title={showNumbers ? "Hide tile numbers" : "Show tile numbers guide"}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-sans font-medium shadow-xs ${
              showNumbers
                ? 'bg-[#3A5A40]/10 border-[#3A5A40]/30 text-[#3A5A40] font-semibold'
                : 'bg-[#FDFCF8] border-[#E5E0D5] text-[#7A746B] hover:text-[#4A453E] hover:bg-[#EBE7DF]'
            }`}
          >
            <Hash className="w-4 h-4 text-[#7E8260]" />
            <span className="hidden md:inline">Numbers {showNumbers ? 'ON' : 'OFF'}</span>
          </button>

          {/* Change Image */}
          <button
            id="btn-change-image"
            onClick={onOpenImageSelector}
            title="Change puzzle photo or upload custom image"
            className="p-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#E5E0D5] transition flex items-center gap-1.5 text-xs font-sans font-medium shadow-xs"
          >
            <ImageIcon className="w-4 h-4 text-[#7E8260]" />
            <span className="hidden md:inline">Photos</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={() => {
              sounds.enabled = !soundEnabled;
              onToggleSound();
            }}
            title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            className="p-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#3A5A40]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#9A9E7C]" />
            )}
          </button>

          {/* Leaderboard Button */}
          <button
            id="btn-leaderboard"
            onClick={onOpenLeaderboard}
            title="High Scores Leaderboard & Stats"
            className="px-3.5 py-2 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-sans font-semibold text-xs shadow-sm transition flex items-center gap-1.5 border border-[#3A5A40]"
          >
            <Trophy className="w-4 h-4 text-[#FDFCF8]" />
            <span>Leaderboard</span>
          </button>

          {/* How to Play */}
          <button
            id="btn-help"
            onClick={onOpenHelp}
            title="How to play instructions"
            className="p-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#7A746B] hover:text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-[#7E8260]" />
          </button>

          {/* Reset / New Game */}
          <button
            id="btn-restart-game"
            onClick={onNewGame}
            title="Shuffle & Start New Game"
            className="p-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-[#7E8260]" />
          </button>

        </div>
      </div>
    </header>
  );
};
