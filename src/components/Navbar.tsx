import React from 'react';
import { 
  Trophy, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { User } from '../firebase';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
  onOpenHelp: () => void;
  imageName: string;
  currentUser: User | null;
  onSignInGoogle: () => void;
  onSignOutGoogle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenLeaderboard,
  onOpenHelp,
  imageName,
  currentUser,
  onSignInGoogle,
  onSignOutGoogle,
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
              Sliding Puzzles
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

          {/* Google Auth Button / User Profile Card */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl pl-2 pr-1.5 py-1 text-xs shadow-xs">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || "User"} 
                  className="w-5 h-5 rounded-full object-cover border border-[#DAD2C3]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-[#3A5A40]" />
              )}
              <span className="font-semibold text-[#4A453E] max-w-[90px] truncate hidden sm:inline">
                {currentUser.displayName?.split(' ')[0] || 'Player'}
              </span>
              <button
                id="btn-sign-out"
                onClick={onSignOutGoogle}
                title="Sign out of Google"
                className="p-1 hover:bg-[#EBE7DF] rounded-lg text-[#7A746B] hover:text-[#4A453E] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-google-login"
              onClick={onSignInGoogle}
              title="Sign in with Google to sync scores"
              className="px-3 py-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#DAD2C3] font-sans font-semibold text-xs transition flex items-center gap-1.5 shadow-xs"
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
              <span>Sign In</span>
            </button>
          )}

          {/* How to Play */}
          <button
            id="btn-help"
            onClick={onOpenHelp}
            title="How to play instructions"
            className="p-2 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#7A746B] hover:text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-[#7E8260]" />
          </button>

        </div>
      </div>
    </header>
  );
};
