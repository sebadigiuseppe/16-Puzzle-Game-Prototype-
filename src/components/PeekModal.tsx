import React from 'react';
import { X, Eye } from 'lucide-react';
import { PuzzleImage } from '../types';
import { Language, translations } from '../utils/i18n';

interface PeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: PuzzleImage;
  language: Language;
}

export const PeekModal: React.FC<PeekModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div
      id="modal-peek-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
      onClick={onClose}
    >
      <div
        id="modal-peek-content"
        className="bg-[#FDFCF8] dark:bg-[#1A1916] border border-[#DAD2C3] dark:border-[#3A3730] w-full max-w-sm sm:max-w-md rounded-[28px] shadow-2xl overflow-hidden text-[#4A453E] dark:text-[#EDE8DF] p-5 relative animate-in fade-in zoom-in duration-150 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5] dark:border-[#333029] mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#3A5A40] dark:text-[#84B082]" />
            <h3 className="text-base font-bold font-serif text-[#3A5A40] dark:text-[#84B082]">{t.referenceArtwork}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F5F2EA] dark:bg-[#22201B] hover:bg-[#EBE7DF] dark:hover:bg-[#282622] text-[#7A746B] dark:text-[#A8A196] hover:text-[#4A453E] dark:hover:text-[#EDE8DF] border border-[#E5E0D5] dark:border-[#333029] transition shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#F5F2EA] dark:bg-[#22201B] border border-[#DAD2C3] dark:border-[#3A3730] relative shadow-inner">
          {currentImage.url ? (
            <img
              src={currentImage.url}
              alt={t.themeName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl font-sans font-bold text-[#3A5A40] dark:text-[#84B082]">1 – 15</span>
              <p className="text-xs text-[#7A746B] dark:text-[#A8A196] mt-2">{t.tileGuideDesc}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center text-xs text-[#7A746B] dark:text-[#A8A196]">
          <span className="font-semibold text-[#4A453E] dark:text-[#EDE8DF]">{t.themeName}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#3A5A40] dark:bg-[#588157] hover:bg-[#2E4833] dark:hover:bg-[#4d724c] text-[#FDFCF8] font-semibold transition shadow-xs cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
