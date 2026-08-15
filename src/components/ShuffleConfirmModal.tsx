import React from 'react';
import { Shuffle, AlertCircle } from 'lucide-react';

interface ShuffleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  difficultyName?: string;
  hasActiveGame: boolean;
}

export const ShuffleConfirmModal: React.FC<ShuffleConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  difficultyName,
  hasActiveGame,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-shuffle-confirm-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans"
      onClick={onClose}
    >
      <div
        id="modal-shuffle-confirm-content"
        className="bg-[#FDFCF8] border border-[#DAD2C3] w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden text-[#4A453E] p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3A5A40]/15 border border-[#3A5A40]/30 flex items-center justify-center text-[#3A5A40] shrink-0">
            <Shuffle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-[#3A5A40] leading-tight">
              Shuffle Puzzle?
            </h2>
            <p className="text-xs text-[#7A746B]">
              {difficultyName ? `Difficulty: ${difficultyName}` : 'Reset & rearrange tiles'}
            </p>
          </div>
        </div>

        {/* Informational warning message */}
        <div className="bg-[#F5F2EA] p-3.5 rounded-2xl border border-[#E5E0D5] text-xs text-[#4A453E] space-y-1.5 shadow-xs">
          {hasActiveGame ? (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#7E8260] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Your current game in progress, moves, and timer will be reset with a fresh solvable shuffle.
              </p>
            </div>
          ) : (
            <p className="leading-relaxed text-[#7A746B]">
              Are you ready to shuffle the 16-puzzle board and generate a new solvable starting layout?
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            id="btn-cancel-shuffle"
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#4A453E] border border-[#DAD2C3] font-semibold text-xs transition"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-shuffle"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#3A5A40] hover:bg-[#2E4833] text-[#FDFCF8] font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Yes, Shuffle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
