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
        className="bg-[#FDFCF8] dark:bg-[#1A1916] border border-[#DAD2C3] dark:border-[#3A3730] w-full max-w-lg rounded-[28px] shadow-2xl overflow-hidden text-[#4A453E] dark:text-[#EDE8DF] p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5] dark:border-[#333029]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#3A5A40]/15 dark:bg-[#588157]/20 border border-[#3A5A40]/25 dark:border-[#588157]/30 flex items-center justify-center text-[#3A5A40] dark:text-[#84B082]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#3A5A40] dark:text-[#84B082]">{t.helpTitle}</h2>
              <p className="text-xs text-[#7A746B] dark:text-[#A8A196]">{t.helpSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F5F2EA] dark:bg-[#22201B] hover:bg-[#EBE7DF] dark:hover:bg-[#282622] text-[#7A746B] dark:text-[#A8A196] hover:text-[#4A453E] dark:hover:text-[#EDE8DF] border border-[#E5E0D5] dark:border-[#333029] transition shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Goal */}
        <div className="bg-[#F5F2EA] dark:bg-[#22201B] p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#333029] text-xs text-[#4A453E] dark:text-[#EDE8DF] space-y-2 shadow-xs">
          <h3 className="font-bold text-[#3A5A40] dark:text-[#84B082] flex items-center gap-1.5 text-sm font-serif">
            <CheckCircle2 className="w-4 h-4" />
            {t.objective}
          </h3>
          <p className="leading-relaxed">
            {t.objectiveDesc}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A9E7C] dark:text-[#848D75]">{t.controls}</h3>
          <div className="bg-[#F5F2EA] dark:bg-[#22201B] p-3.5 rounded-2xl border border-[#E5E0D5] dark:border-[#333029] text-xs">
            <div className="font-bold text-[#4A453E] dark:text-[#EDE8DF] mb-1">{t.clickMultiSlide}</div>
            <p className="text-[#7A746B] dark:text-[#A8A196] text-[11px] leading-relaxed">
              {t.clickMultiSlideDesc}
            </p>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-[#A3B18A]/15 dark:bg-[#588157]/15 border border-[#9A9E7C]/30 dark:border-[#588157]/30 p-4 rounded-2xl text-xs text-[#4A453E] dark:text-[#EDE8DF] space-y-1.5 shadow-xs">
          <h3 className="font-bold text-[#3A5A40] dark:text-[#84B082] flex items-center gap-1.5 font-serif text-sm">
            <Zap className="w-3.5 h-3.5 text-[#3A5A40] dark:text-[#84B082]" />
            {t.strategyTips}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-[#7A746B] dark:text-[#A8A196] leading-relaxed">
            <li><strong className="text-[#4A453E] dark:text-[#EDE8DF]">{t.tip1.split(':')[0]}:</strong> {t.tip1.split(':')[1]}</li>
            <li><strong className="text-[#4A453E] dark:text-[#EDE8DF]">{t.tip2.split(':')[0]}:</strong> {t.tip2.split(':')[1]}</li>
            <li><strong className="text-[#4A453E] dark:text-[#EDE8DF]">{t.tip3.split(':')[0]}:</strong> {t.tip3.split(':')[1]}</li>
            <li><strong className="text-[#4A453E] dark:text-[#EDE8DF]">{t.tip4.split(':')[0]}:</strong> {t.tip4.split(':')[1]}</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#3A5A40] dark:bg-[#588157] hover:bg-[#2E4833] dark:hover:bg-[#4d724c] text-[#FDFCF8] font-semibold text-xs transition shadow-xs cursor-pointer"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
};
