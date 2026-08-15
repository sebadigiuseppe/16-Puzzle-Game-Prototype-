import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sliders,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { User } from '../firebase';
import { Difficulty } from '../types';
import { Language, LANGUAGES, translations } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
  onOpenHelp: () => void;
  currentUser: User | null;
  onSignInGoogle: () => void;
  onSignOutGoogle: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  difficulty: Difficulty;
  onChangeDifficulty: (diff: Difficulty) => void;
  totalScore?: number;
  dailyStreak?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenLeaderboard,
  onOpenHelp,
  currentUser,
  onSignInGoogle,
  onSignOutGoogle,
  currentLanguage,
  onSelectLanguage,
  difficulty,
  onChangeDifficulty,
  totalScore = 0,
  dailyStreak = 0,
}) => {
  const t = translations[currentLanguage];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (diffRef.current && !diffRef.current.contains(event.target as Node)) {
        setIsDiffOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const difficultyLabels: Record<Difficulty, string> = {
    easy: t.diffEasy,
    medium: t.diffMedium,
    hard: t.diffHard,
    master: t.diffMaster,
  };

  const activeLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header id="app-navbar" className="w-full bg-[#F5F2EA]/95 backdrop-blur-md border-b border-[#E5E0D5] text-[#4A453E] sticky top-0 z-30 px-4 py-3 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-3">
          
          {/* Hamburger Menu Trigger Button */}
          <div className="relative" ref={menuRef}>
            <button
              id="btn-hamburger-menu"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu"
              aria-label="Toggle Navigation Menu"
              className="w-9 h-9 rounded-xl bg-[#A3B18A]/25 hover:bg-[#A3B18A]/40 border border-[#9A9E7C]/40 flex items-center justify-center text-[#3A5A40] transition shadow-xs cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-[#3A5A40]" />
              ) : (
                <Menu className="w-5 h-5 text-[#3A5A40]" />
              )}
            </button>

            {/* Hamburger Dropdown Popover */}
            {isMenuOpen && (
              <div
                id="hamburger-dropdown-menu"
                className="absolute left-0 mt-2 w-72 bg-[#FDFCF8] border border-[#DAD2C3] rounded-2xl shadow-xl z-50 p-2 overflow-visible animate-in fade-in zoom-in-95 duration-100 font-sans"
              >
                {/* Header without 4x4 */}
                <div className="px-3 py-2 border-b border-[#E5E0D5] text-[10px] uppercase font-bold tracking-wider text-[#9A9E7C] flex items-center justify-between">
                  <span>Menu</span>
                  {totalScore > 0 && (
                    <span className="text-[11px] font-bold text-[#3A5A40] flex items-center gap-1 normal-case">
                      <Sparkles className="w-3 h-3 text-[#B08968]" />
                      {totalScore.toLocaleString()} pts
                    </span>
                  )}
                </div>

                <div className="py-1.5 flex flex-col gap-1">
                  
                  {/* Leaderboard */}
                  <button
                    id="menu-btn-leaderboard"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenLeaderboard();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] text-[#4A453E] hover:text-[#3A5A40] font-medium text-xs flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#3A5A40]/10 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-[#3A5A40]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{t.leaderboard}</div>
                        <div className="text-[10px] text-[#7A746B]">{t.rankings}</div>
                      </div>
                    </div>
                    {dailyStreak > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B08968]/15 text-[#B08968]">
                        🔥 {dailyStreak}d
                      </span>
                    )}
                  </button>

                  {/* Sound Toggle */}
                  <button
                    id="menu-btn-sound"
                    type="button"
                    onClick={() => {
                      sounds.enabled = !soundEnabled;
                      onToggleSound();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] text-[#4A453E] font-medium text-xs flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#3A5A40]/10 flex items-center justify-center">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-[#3A5A40]" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-[#9A9E7C]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs">Audio Effects</div>
                        <div className="text-[10px] text-[#7A746B]">
                          {soundEnabled ? 'Enabled' : 'Muted'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      soundEnabled ? 'bg-[#3A5A40]/15 text-[#3A5A40]' : 'bg-[#EBE7DF] text-[#7A746B]'
                    }`}>
                      {soundEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* How to Play Help */}
                  <button
                    id="menu-btn-help"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenHelp();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] text-[#4A453E] hover:text-[#3A5A40] font-medium text-xs flex items-center gap-2.5 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#7E8260]/15 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-[#7E8260]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">{t.howToPlay}</div>
                      <div className="text-[10px] text-[#7A746B]">Rules & Tips</div>
                    </div>
                  </button>

                  {/* Language Selector Row inside Menu - clean inline selector so it never clips or goes behind */}
                  <div className="pt-2.5 mt-1 border-t border-[#E5E0D5] px-3 pb-1.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#7A746B]">Language</span>
                      <span className="text-[11px] font-bold text-[#3A5A40]">{activeLang.nativeLabel}</span>
                    </div>
                    <LanguageSelector
                      currentLanguage={currentLanguage}
                      onSelectLanguage={onSelectLanguage}
                      variant="inline"
                    />
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* App Title & Difficulty Button at the side of 4x4 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif tracking-tight text-[#3A5A40]">
                {t.appTitle}
              </h1>
              
              {/* 4x4 Grid Badge */}
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#A3B18A]/25 text-[#3A5A40] border border-[#9A9E7C]/40 uppercase tracking-wider">
                {t.gridSize}
              </span>

              {/* Difficulty Selector Button at the side of the 4x4 icon */}
              <div className="relative" ref={diffRef}>
                <button
                  id="btn-difficulty-toggle"
                  type="button"
                  onClick={() => setIsDiffOpen(!isDiffOpen)}
                  className="px-2.5 py-1 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] text-[#3A5A40] border border-[#DAD2C3] font-sans font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
                  title="Change Difficulty"
                >
                  <Sliders className="w-3 h-3 text-[#7E8260]" />
                  <span>{difficultyLabels[difficulty]}</span>
                  <ChevronDown className="w-3 h-3 text-[#7A746B]" />
                </button>

                {/* Difficulty Popover Dropdown */}
                {isDiffOpen && (
                  <div
                    id="difficulty-dropdown-menu"
                    className="absolute left-0 mt-1.5 w-44 bg-[#FDFCF8] border border-[#DAD2C3] rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans"
                  >
                    <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#9A9E7C] border-b border-[#E5E0D5]">
                      {t.difficulty}
                    </div>
                    <div className="py-1 flex flex-col gap-0.5">
                      {(['easy', 'medium', 'hard', 'master'] as Difficulty[]).map((d) => (
                        <button
                          key={d}
                          id={`btn-diff-choice-${d}`}
                          type="button"
                          onClick={() => {
                            onChangeDifficulty(d);
                            setIsDiffOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                            difficulty === d
                              ? 'bg-[#3A5A40] text-[#FDFCF8]'
                              : 'text-[#4A453E] hover:bg-[#F5F2EA]'
                          }`}
                        >
                          <span>{difficultyLabels[d]}</span>
                          {d === 'master' && (
                            <span className="text-[10px] opacity-75 font-normal">Blind</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Action Controls: Stacked Points + Profile / Sign-in */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Stacked Score Badge if user has accumulated score */}
          {totalScore > 0 && (
            <div 
              onClick={onOpenLeaderboard}
              title="Your Total Stacked Points - Click to view Leaderboard & Standing"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFCF8] border border-[#E5E0D5] hover:border-[#3A5A40]/40 rounded-xl text-xs font-semibold text-[#3A5A40] shadow-xs cursor-pointer transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B08968]" />
              <span className="font-bold">{totalScore.toLocaleString()}</span>
              <span className="text-[10px] text-[#7A746B]">pts</span>
              {dailyStreak > 1 && (
                <span className="text-[10px] text-[#B08968] font-bold ml-0.5">🔥{dailyStreak}</span>
              )}
            </div>
          )}

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
              <span className="font-semibold text-[#4A453E] max-w-[110px] truncate">
                {currentUser.displayName?.split(' ')[0] || 'Player'}
              </span>
              <button
                id="btn-sign-out"
                onClick={onSignOutGoogle}
                title={t.signOut}
                className="p-1 hover:bg-[#EBE7DF] rounded-lg text-[#7A746B] hover:text-[#4A453E] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-google-login"
              onClick={onSignInGoogle}
              title={t.signIn}
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
              <span>{t.signIn}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

