import React, { useState, useRef, useEffect } from 'react';
import { Language, LANGUAGES } from '../utils/i18n';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
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

  return (
    <div id="language-selector-wrapper" className="relative" ref={dropdownRef}>
      {/* Trigger Button - Displays ONLY the active language flag */}
      <button
        id="btn-language-selector"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={activeLang.nativeLabel}
        aria-label="Select Language"
        className="w-9 h-9 rounded-xl bg-[#FDFCF8] hover:bg-[#EBE7DF] border border-[#E5E0D5] transition flex items-center justify-center shadow-xs text-lg select-none"
      >
        <span className="leading-none">{activeLang.flag}</span>
      </button>

      {/* Popover Dropdown - Displays ONLY the flag choices */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          className="absolute right-0 mt-2 bg-[#FDFCF8] border border-[#DAD2C3] rounded-2xl shadow-xl z-50 p-1.5 flex flex-col gap-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 min-w-[50px]"
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
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition select-none ${
                  isSelected
                    ? 'bg-[#3A5A40]/15 ring-2 ring-[#3A5A40] scale-105'
                    : 'hover:bg-[#EBE7DF] hover:scale-105'
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

