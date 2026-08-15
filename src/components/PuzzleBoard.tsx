import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TileState, GameStatus, PuzzleImage } from '../types';
import { BLANK_ID, getRowCol, getSlidePath } from '../utils/puzzle';
import { Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface PuzzleBoardProps {
  tiles: TileState[];
  currentImage: PuzzleImage;
  showNumbers: boolean;
  status: GameStatus;
  onTileClick: (clickedPos: number) => void;
  onKeyDownMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onResume: () => void;
  language: Language;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  tiles,
  currentImage,
  showNumbers,
  status,
  onTileClick,
  onKeyDownMove,
  onResume,
  language,
}) => {
  const t = translations[language];
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Find current blank tile position
  const blankTile = tiles.find(t => t.isBlank || t.id === BLANK_ID);
  const blankPos = blankTile ? blankTile.currentPos : 15;

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'playing' && status !== 'idle') return;

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      onKeyDownMove('up'); // Move tile below blank upward
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      onKeyDownMove('down'); // Move tile above blank downward
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      onKeyDownMove('left'); // Move tile to the right of blank leftward
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      onKeyDownMove('right'); // Move tile to the left of blank rightward
    }
  }, [status, onKeyDownMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const threshold = 30;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) {
        onKeyDownMove('right');
      } else if (dx < -threshold) {
        onKeyDownMove('left');
      }
    } else {
      if (dy > threshold) {
        onKeyDownMove('down');
      } else if (dy < -threshold) {
        onKeyDownMove('up');
      }
    }
  };

  const isNumericOnly = !currentImage.url;

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      <div
        id="puzzle-board-container"
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-[480px] sm:max-w-[530px] md:max-w-[560px] aspect-square relative bg-[#EBE7DF] p-2 sm:p-2.5 rounded-3xl sm:rounded-[32px] border border-[#DAD2C3] shadow-inner overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Background Grid Slots */}
        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 sm:gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={`slot-${i}`}
              id={`puzzle-slot-${i}`}
              className="w-full h-full rounded-xl sm:rounded-2xl bg-[#FDFCF8]/60 border border-dashed border-[#DAD2C3]/80 flex items-center justify-center text-[#9A9E7C] font-sans text-xs"
            >
              <span className="opacity-30 text-[11px]">{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Sliding Tiles */}
        <div className="absolute inset-2 sm:inset-2.5 pointer-events-none">
          {tiles.map((tile) => {
            if (tile.isBlank) return null;

            const { row: targetRow, col: targetCol } = getRowCol(tile.currentPos);
            const { row: origRow, col: origCol } = getRowCol(tile.originalPos);
            const isMovable = getSlidePath(tile.currentPos, blankPos) !== null;
            const isCorrectPosition = tile.currentPos === tile.originalPos;

            // Background positioning for image slice
            const bgPosX = (origCol / 3) * 100;
            const bgPosY = (origRow / 3) * 100;
            const tileNumber = tile.originalPos + 1;

            return (
              <motion.div
                key={`tile-${tile.id}`}
                id={`puzzle-tile-${tileNumber}`}
                layout
                initial={false}
                animate={{
                  left: `${targetCol * 25}%`,
                  top: `${targetRow * 25}%`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 30,
                  mass: 0.8,
                }}
                onClick={() => {
                  if (status !== 'paused') {
                    onTileClick(tile.currentPos);
                  }
                }}
                style={{
                  position: 'absolute',
                  width: '25%',
                  height: '25%',
                  padding: '1.5px',
                }}
                className={`pointer-events-auto cursor-pointer transition-shadow duration-150 ${
                  isMovable ? 'hover:z-10' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative transition-all duration-150 group flex items-center justify-center ${
                    isNumericOnly
                      ? 'bg-[#9A9E7C] text-[#FDFCF8] shadow-sm border-b-2 sm:border-b-4 border-[#7E8260]'
                      : `shadow-sm border ${
                          isCorrectPosition
                            ? 'border-[#3A5A40]/80 shadow-[#3A5A40]/10'
                            : 'border-[#DAD2C3]/90'
                        }`
                  } ${
                    isMovable
                      ? 'hover:scale-[1.01] hover:border-[#3A5A40] active:scale-95'
                      : ''
                  }`}
                  style={{
                    backgroundColor: isNumericOnly ? '#9A9E7C' : '#EBE7DF',
                    backgroundImage: isNumericOnly ? undefined : `url(${currentImage.url})`,
                    backgroundSize: '400% 400%',
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Subtle contrast gradient for image tiles */}
                  {!isNumericOnly && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                  )}

                  {/* Tile Number Overlay / Indicator (Only rendered when showNumbers is enabled) */}
                  {!isNumericOnly && showNumbers && (
                    <div
                      className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-sans font-semibold transition-opacity backdrop-blur-md flex items-center gap-0.5 shadow-xs ${
                        isCorrectPosition
                          ? 'bg-[#3A5A40] text-[#FDFCF8] border border-[#3A5A40]'
                          : 'bg-[#FDFCF8]/95 text-[#4A453E] border border-[#DAD2C3]'
                      }`}
                    >
                      <span>{tileNumber}</span>
                      {isCorrectPosition && (
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#FDFCF8] ml-0.5" />
                      )}
                    </div>
                  )}

                  {/* For Numeric Mode: Big Serif Display Number in Center */}
                  {isNumericOnly && (
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold font-serif text-[#FDFCF8] drop-shadow-xs">
                        {tileNumber}
                      </span>
                    </div>
                  )}

                  {/* Subtle Movable Hover Cue */}
                  {isMovable && (
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#3A5A40]/40 rounded-xl sm:rounded-2xl transition pointer-events-none" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Paused Overlay */}
        <AnimatePresence>
          {status === 'paused' && (
            <motion.div
              id="paused-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-[#FDFCF8]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#A3B18A]/25 border border-[#9A9E7C]/40 flex items-center justify-center text-[#3A5A40] mb-3">
                <Play className="w-6 h-6 fill-[#3A5A40] ml-0.5" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-[#3A5A40] mb-1">{t.paused}</h3>
              <p className="text-xs font-sans text-[#7A746B] max-w-xs mb-4">
                {t.paused}
              </p>
              <button
                id="btn-resume-game"
                onClick={onResume}
                className="px-6 h-11 rounded-full bg-[#A3B18A] hover:bg-[#8F9E77] text-[#FDFCF8] font-sans text-xs font-bold uppercase tracking-wider shadow-sm transition transform hover:scale-105 active:scale-95"
              >
                {t.resumeGame}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Helper Guidance Below Board */}
      <div className="mt-3 flex items-center justify-between w-full max-w-[480px] sm:max-w-[530px] md:max-w-[560px] text-xs font-sans text-[#9A9E7C] px-2 italic">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#3A5A40]" />
          Slide tiles to restore the image
        </span>
        <span className="hidden sm:inline">Controls: Click, Tap, or Arrow Keys / WASD</span>
      </div>
    </div>
  );
};
