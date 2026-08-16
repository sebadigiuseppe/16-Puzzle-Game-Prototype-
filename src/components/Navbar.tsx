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
  Sparkles,
  Heart,
  Plus,
  Moon,
  Sun
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { User } from '../firebase';
import { Difficulty } from '../types';
import { Language, LANGUAGES, translations } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLeaderboard: () => void;
  onOpenHelp: () => void;
  onOpenUpload?: () => void;
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
  darkMode,
  onToggleDarkMode,
  onOpenLeaderboard,
  onOpenHelp,
  onOpenUpload,
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

  return (
    <header id="app-navbar" className="w-full bg-[#F5F2EA]/95 dark:bg-[#1A1916]/95 backdrop-blur-md border-b border-[#E5E0D5] dark:border-[#333029] text-[#4A453E] dark:text-[#EDE8DF] sticky top-0 z-30 px-4 py-3 shadow-xs transition-colors duration-200">
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
              className="w-9 h-9 rounded-xl bg-[#A3B18A]/25 dark:bg-[#588157]/20 hover:bg-[#A3B18A]/40 dark:hover:bg-[#588157]/35 border border-[#9A9E7C]/40 dark:border-[#588157]/40 flex items-center justify-center text-[#3A5A40] dark:text-[#84B082] transition shadow-xs cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Hamburger Dropdown Popover */}
            {isMenuOpen && (
              <div
                id="hamburger-dropdown-menu"
                className="absolute left-0 mt-2 w-72 bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#DAD2C3] dark:border-[#3A3730] rounded-2xl shadow-xl z-50 p-2 overflow-visible animate-in fade-in zoom-in-95 duration-100 font-sans"
              >
                {/* Header without 4x4 */}
                <div className="px-3 py-2 border-b border-[#E5E0D5] dark:border-[#333029] text-[10px] uppercase font-bold tracking-wider text-[#9A9E7C] dark:text-[#848D75] flex items-center justify-between">
                  <span>Menu</span>
                  {totalScore > 0 && (
                    <span className="text-[11px] font-bold text-[#3A5A40] dark:text-[#84B082] flex items-center gap-1 normal-case">
                      <Sparkles className="w-3 h-3 text-[#B08968] dark:text-[#DDA15E]" />
                      {totalScore.toLocaleString()} pts
                    </span>
                  )}
                </div>

                <div className="py-1.5 flex flex-col gap-1">
                  
                  {/* Submit Your Pet */}
                  {onOpenUpload && (
                    <button
                      id="menu-btn-pet-submit"
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenUpload();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] dark:hover:bg-[#282622] text-[#4A453E] dark:text-[#EDE8DF] hover:text-[#3A5A40] dark:hover:text-[#84B082] font-medium text-xs flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#3A5A40]/15 dark:bg-[#588157]/20 flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4 text-[#3A5A40] dark:text-[#84B082]" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">Submit Your Pet</div>
                          <div className="text-[10px] text-[#7A746B] dark:text-[#A8A196] leading-tight">
                            Submit a picture of your pet to show on a puzzle
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3A5A40]/15 dark:bg-[#588157]/25 text-[#3A5A40] dark:text-[#84B082] shrink-0 ml-1">
                        🐾 Send
                      </span>
                    </button>
                  )}

                  {/* Dark Mode Toggle Item */}
                  <button
                    id="menu-btn-dark-mode"
                    type="button"
                    onClick={onToggleDarkMode}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] dark:hover:bg-[#282622] text-[#4A453E] dark:text-[#EDE8DF] hover:text-[#3A5A40] dark:hover:text-[#84B082] font-medium text-xs flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#3A5A40]/10 dark:bg-[#588157]/20 flex items-center justify-center">
                        {darkMode ? (
                          <Moon className="w-4 h-4 text-[#84B082] fill-[#84B082]/20" />
                        ) : (
                          <Sun className="w-4 h-4 text-[#B08968]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{t.darkMode}</div>
                        <div className="text-[10px] text-[#7A746B] dark:text-[#A8A196]">
                          {darkMode ? 'Dark Theme' : 'Light Theme'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                      darkMode 
                        ? 'bg-[#588157]/25 text-[#84B082] border border-[#588157]/40' 
                        : 'bg-[#EBE7DF] text-[#7A746B]'
                    }`}>
                      {darkMode ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Leaderboard */}
                  <button
                    id="menu-btn-leaderboard"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenLeaderboard();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] dark:hover:bg-[#282622] text-[#4A453E] dark:text-[#EDE8DF] hover:text-[#3A5A40] dark:hover:text-[#84B082] font-medium text-xs flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#3A5A40]/10 dark:bg-[#588157]/20 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-[#3A5A40] dark:text-[#84B082]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{t.leaderboard}</div>
                        <div className="text-[10px] text-[#7A746B] dark:text-[#A8A196]">{t.rankings}</div>
                      </div>
                    </div>
                    {dailyStreak > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B08968]/15 dark:bg-[#DDA15E]/20 text-[#B08968] dark:text-[#DDA15E]">
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
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] dark:hover:bg-[#282622] text-[#4A453E] dark:text-[#EDE8DF] font-medium text-xs flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#3A5A40]/10 dark:bg-[#588157]/20 flex items-center justify-center">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-[#3A5A40] dark:text-[#84B082]" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-[#9A9E7C] dark:text-[#848D75]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs">Audio Effects</div>
                        <div className="text-[10px] text-[#7A746B] dark:text-[#A8A196]">
                          {soundEnabled ? 'Enabled' : 'Muted'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      soundEnabled 
                        ? 'bg-[#3A5A40]/15 dark:bg-[#588157]/25 text-[#3A5A40] dark:text-[#84B082]' 
                        : 'bg-[#EBE7DF] dark:bg-[#2B2823] text-[#7A746B] dark:text-[#A8A196]'
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
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F5F2EA] dark:hover:bg-[#282622] text-[#4A453E] dark:text-[#EDE8DF] hover:text-[#3A5A40] dark:hover:text-[#84B082] font-medium text-xs flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#7E8260]/15 dark:bg-[#7E8260]/25 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-[#7E8260] dark:text-[#A3B18A]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">{t.howToPlay}</div>
                      <div className="text-[10px] text-[#7A746B] dark:text-[#A8A196]">Rules & Tips</div>
                    </div>
                  </button>

                  {/* Language Flags Row inside Menu */}
                  <div className="pt-2 mt-1 border-t border-[#E5E0D5] dark:border-[#333029] px-1 pb-1">
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
              <h1 className="text-xl font-bold font-serif tracking-tight text-[#3A5A40] dark:text-[#84B082]">
                {t.appTitle}
              </h1>
              
              {/* 4x4 Grid Badge */}
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#A3B18A]/25 dark:bg-[#588157]/20 text-[#3A5A40] dark:text-[#84B082] border border-[#9A9E7C]/40 dark:border-[#588157]/35 uppercase tracking-wider">
                {t.gridSize}
              </span>

              {/* Difficulty Selector Button at the side of the 4x4 icon */}
              <div className="relative" ref={diffRef}>
                <button
                  id="btn-difficulty-toggle"
                  type="button"
                  onClick={() => setIsDiffOpen(!isDiffOpen)}
                  className="px-2.5 py-1 rounded-xl bg-[#FDFCF8] dark:bg-[#1E1D19] hover:bg-[#EBE7DF] dark:hover:bg-[#282622] text-[#3A5A40] dark:text-[#84B082] border border-[#DAD2C3] dark:border-[#3A3730] font-sans font-bold text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Change Difficulty"
                >
                  <Sliders className="w-3 h-3 text-[#7E8260] dark:text-[#A3B18A]" />
                  <span>{difficultyLabels[difficulty]}</span>
                  <ChevronDown className="w-3 h-3 text-[#7A746B] dark:text-[#A8A196]" />
                </button>

                {/* Difficulty Popover Dropdown */}
                {isDiffOpen && (
                  <div
                    id="difficulty-dropdown-menu"
                    className="absolute left-0 mt-1.5 w-44 bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#DAD2C3] dark:border-[#3A3730] rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans"
                  >
                    <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#9A9E7C] dark:text-[#848D75] border-b border-[#E5E0D5] dark:border-[#333029]">
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
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            difficulty === d
                              ? 'bg-[#3A5A40] dark:bg-[#588157] text-[#FDFCF8]'
                              : 'text-[#4A453E] dark:text-[#EDE8DF] hover:bg-[#F5F2EA] dark:hover:bg-[#282622]'
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
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#E5E0D5] dark:border-[#333029] hover:border-[#3A5A40]/40 dark:hover:border-[#588157]/50 rounded-xl text-xs font-semibold text-[#3A5A40] dark:text-[#84B082] shadow-xs cursor-pointer transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B08968] dark:text-[#DDA15E]" />
              <span className="font-bold">{totalScore.toLocaleString()}</span>
              <span className="text-[10px] text-[#7A746B] dark:text-[#A8A196]">pts</span>
              {dailyStreak > 1 && (
                <span className="text-[10px] text-[#B08968] dark:text-[#DDA15E] font-bold ml-0.5">🔥{dailyStreak}</span>
              )}
            </div>
          )}

          {/* Google Auth Button / User Profile Card */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#E5E0D5] dark:border-[#333029] rounded-xl pl-2 pr-1.5 py-1 text-xs shadow-xs">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || "User"} 
                  className="w-5 h-5 rounded-full object-cover border border-[#DAD2C3] dark:border-[#3A3730]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-[#3A5A40] dark:text-[#84B082]" />
              )}
              <span className="font-semibold text-[#4A453E] dark:text-[#EDE8DF] max-w-[110px] truncate">
                {currentUser.displayName?.split(' ')[0] || 'Player'}
              </span>
              <button
                id="btn-sign-out"
                onClick={onSignOutGoogle}
                title={t.signOut}
                className="p-1 hover:bg-[#EBE7DF] dark:hover:bg-[#282622] rounded-lg text-[#7A746B] dark:text-[#A8A196] hover:text-[#4A453E] dark:hover:text-[#EDE8DF] transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-google-login"
              onClick={onSignInGoogle}
              title={t.signIn}
              className="px-3 py-2 rounded-xl bg-[#FDFCF8] dark:bg-[#1E1D19] hover:bg-[#EBE7DF] dark:hover:bg-[#282622] text-[#4A453E] dark:text-[#EDE8DF] border border-[#DAD2C3] dark:border-[#3A3730] font-sans font-semibold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
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


