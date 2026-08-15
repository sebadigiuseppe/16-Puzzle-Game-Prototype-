import React from 'react';
import { X, HelpCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div
      id="modal-help-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans"
      onClick={onClose}
    >
      <div
        id="modal-help-content"
        className="bg-[#FDFCF8] border border-[#DAD2C3] w-full max-w-lg rounded-[28px] shadow-2xl overflow-hidden text-[#4A453E] p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#3A5A40]/15 border border-[#3A5A40]/25 flex items-center justify-center text-[#3A5A40]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#3A5A40]">{t.helpTitle}</h2>
              <p className="text-xs text-[#7A746B]">{t.helpSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#7A746B] hover:text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Goal */}
        <div className="bg-[#F5F2EA] p-4 rounded-2xl border border-[#E5E0D5] text-xs text-[#4A453E] space-y-2 shadow-xs">
          <h3 className="font-bold text-[#3A5A40] flex items-center gap-1.5 text-sm font-serif">
            <CheckCircle2 className="w-4 h-4" />
            {t.objective}
          </h3>
          <p className="leading-relaxed">
            {t.objectiveDesc}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A9E7C]">{t.controls}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="bg-[#F5F2EA] p-3.5 rounded-2xl border border-[#E5E0D5]">
              <div className="font-bold text-[#4A453E] mb-1">{t.clickMultiSlide}</div>
              <p className="text-[#7A746B] text-[11px] leading-relaxed">
                {t.clickMultiSlideDesc}
              </p>
            </div>

            <div className="bg-[#F5F2EA] p-3.5 rounded-2xl border border-[#E5E0D5]">
              <div className="font-bold text-[#4A453E] mb-1">{t.keyboardControls}</div>
              <div className="flex items-center gap-1 my-1.5">
                <span className="px-1.5 py-0.5 rounded-md bg-[#EBE7DF] border border-[#DAD2C3] font-sans font-semibold text-[10px] text-[#3A5A40]">W / <ArrowUp className="w-2.5 h-2.5 inline" /></span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#EBE7DF] border border-[#DAD2C3] font-sans font-semibold text-[10px] text-[#3A5A40]">A / <ArrowLeft className="w-2.5 h-2.5 inline" /></span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#EBE7DF] border border-[#DAD2C3] font-sans font-semibold text-[10px] text-[#3A5A40]">S / <ArrowDown className="w-2.5 h-2.5 inline" /></span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#EBE7DF] border border-[#DAD2C3] font-sans font-semibold text-[10px] text-[#3A5A40]">D / <ArrowRight className="w-2.5 h-2.5 inline" /></span>
              </div>
              <p className="text-[#7A746B] text-[11px] leading-relaxed">
                {t.keyboardControlsDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-[#A3B18A]/15 border border-[#9A9E7C]/30 p-4 rounded-2xl text-xs text-[#4A453E] space-y-1.5 shadow-xs">
          <h3 className="font-bold text-[#3A5A40] flex items-center gap-1.5 font-serif text-sm">
            <Zap className="w-3.5 h-3.5 text-[#3A5A40]" />
            {t.strategyTips}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-[#7A746B] leading-relaxed">
            <li><strong className="text-[#4A453E]">{t.tip1.split(':')[0]}:</strong> {t.tip1.split(':')[1]}</li>
            <li><strong className="text-[#4A453E]">{t.tip2.split(':')[0]}:</strong> {t.tip2.split(':')[1]}</li>
            <li><strong className="text-[#4A453E]">{t.tip3.split(':')[0]}:</strong> {t.tip3.split(':')[1]}</li>
            <li><strong className="text-[#4A453E]">{t.tip4.split(':')[0]}:</strong> {t.tip4.split(':')[1]}</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-semibold text-xs transition shadow-xs"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
};
