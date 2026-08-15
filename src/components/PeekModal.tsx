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
        className="bg-[#FDFCF8] border border-[#DAD2C3] w-full max-w-sm sm:max-w-md rounded-[28px] shadow-2xl overflow-hidden text-[#4A453E] p-5 relative animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5] mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#3A5A40]" />
            <h3 className="text-base font-bold font-serif text-[#3A5A40]">{t.referenceArtwork}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#7A746B] hover:text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#F5F2EA] border border-[#DAD2C3] relative shadow-inner">
          {currentImage.url ? (
            <img
              src={currentImage.url}
              alt={t.themeName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl font-sans font-bold text-[#3A5A40]">1 – 15</span>
              <p className="text-xs text-[#7A746B] mt-2">{t.tileGuideDesc}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center text-xs text-[#7A746B]">
          <span className="font-semibold text-[#4A453E]">{t.themeName}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-semibold transition shadow-xs"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
