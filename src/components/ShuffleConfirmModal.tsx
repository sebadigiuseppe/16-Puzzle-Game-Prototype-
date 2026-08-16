import React from 'react';
import { Shuffle, AlertCircle } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface ShuffleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  difficultyName?: string;
  hasActiveGame: boolean;
  language: Language;
}

export const ShuffleConfirmModal: React.FC<ShuffleConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  difficultyName,
  hasActiveGame,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div
      id="modal-shuffle-confirm-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans"
      onClick={onClose}
    >
      <div
        id="modal-shuffle-confirm-content"
        className="bg-[#FDFCF8] dark:bg-[#1A1916] border border-[#DAD2C3] dark:border-[#3A3730] w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden text-[#4A453E] dark:text-[#EDE8DF] p-6 space-y-4 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3A5A40]/15 dark:bg-[#588157]/20 border border-[#3A5A40]/30 dark:border-[#588157]/30 flex items-center justify-center text-[#3A5A40] dark:text-[#84B082] shrink-0">
            <Shuffle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-[#3A5A40] dark:text-[#84B082] leading-tight">
              {t.shuffleTitle}
            </h2>
            <p className="text-xs text-[#7A746B] dark:text-[#A8A196]">
              {difficultyName ? `${t.difficulty}: ${difficultyName}` : t.shuffleTitle}
            </p>
          </div>
        </div>

        {/* Informational warning message */}
        <div className="bg-[#F5F2EA] dark:bg-[#22201B] p-3.5 rounded-2xl border border-[#E5E0D5] dark:border-[#333029] text-xs text-[#4A453E] dark:text-[#EDE8DF] space-y-1.5 shadow-xs">
          {hasActiveGame ? (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#7E8260] dark:text-[#A3B18A] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t.shuffleResetWarn}
              </p>
            </div>
          ) : (
            <p className="leading-relaxed text-[#7A746B] dark:text-[#A8A196]">
              {t.shufflePrompt}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            id="btn-cancel-shuffle"
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#22201B] hover:bg-[#EBE7DF] dark:hover:bg-[#282622] text-[#4A453E] dark:text-[#EDE8DF] border border-[#DAD2C3] dark:border-[#3A3730] font-semibold text-xs transition cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            id="btn-confirm-shuffle"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#3A5A40] dark:bg-[#588157] hover:bg-[#2E4833] dark:hover:bg-[#4d724c] text-[#FDFCF8] font-semibold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{t.yesShuffle}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
