import React, { useState, useRef, useEffect } from 'react';
import { Language, LANGUAGES } from '../utils/i18n';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  variant?: 'dropdown' | 'inline';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  variant = 'dropdown',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  if (variant === 'inline') {
    return (
      <div id="language-selector-inline" className="flex items-center justify-between gap-1 w-full">
        {LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLanguage;
          return (
            <button
              key={lang.code}
              id={`btn-lang-inline-${lang.code}`}
              type="button"
              title={lang.nativeLabel}
              onClick={() => onSelectLanguage(lang.code)}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center text-lg transition select-none cursor-pointer ${
                isSelected
                  ? 'bg-[#3A5A40]/20 dark:bg-[#588157]/30 ring-2 ring-[#3A5A40] dark:ring-[#588157] scale-105 shadow-2xs'
                  : 'hover:bg-[#EBE7DF] dark:hover:bg-[#282622] hover:scale-105 bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#E5E0D5] dark:border-[#333029]'
              }`}
            >
              <span className="leading-none">{lang.flag}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div id="language-selector-wrapper" className="relative" ref={dropdownRef}>
      {/* Trigger Button - Displays ONLY the active language flag */}
      <button
        id="btn-language-selector"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={activeLang.nativeLabel}
        aria-label="Select Language"
        className="w-9 h-9 rounded-xl bg-[#FDFCF8] dark:bg-[#1E1D19] hover:bg-[#EBE7DF] dark:hover:bg-[#282622] border border-[#E5E0D5] dark:border-[#333029] transition flex items-center justify-center shadow-xs text-lg select-none cursor-pointer"
      >
        <span className="leading-none">{activeLang.flag}</span>
      </button>

      {/* Popover Dropdown - Displays flag choices */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          className="absolute right-0 mt-2 bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#DAD2C3] dark:border-[#3A3730] rounded-2xl shadow-2xl z-[100] p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100 min-w-[50px]"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                id={`btn-lang-${lang.code}`}
                type="button"
                title={lang.nativeLabel}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition select-none cursor-pointer ${
                  isSelected
                    ? 'bg-[#3A5A40]/20 dark:bg-[#588157]/30 ring-2 ring-[#3A5A40] dark:ring-[#588157] scale-105'
                    : 'hover:bg-[#EBE7DF] dark:hover:bg-[#282622] hover:scale-105'
                }`}
              >
                <span className="leading-none">{lang.flag}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


