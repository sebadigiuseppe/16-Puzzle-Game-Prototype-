import React, { useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PRESET_IMAGES } from '../data/images';
import { PuzzleImage } from '../types';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: PuzzleImage;
  onSelectImage: (img: PuzzleImage) => void;
  customImages: PuzzleImage[];
  onUploadCustomImage: (img: PuzzleImage) => void;
}

export const ImageSelectorModal: React.FC<ImageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  onSelectImage,
  customImages,
  onUploadCustomImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (url) {
        const newImg: PuzzleImage = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 18) || 'Custom Image',
          url: url,
          author: 'Your Photo',
          isCustom: true,
        };
        onUploadCustomImage(newImg);
        onSelectImage(newImg);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      id="modal-images-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans"
      onClick={onClose}
    >
      <div
        id="modal-images-content"
        className="bg-[#FDFCF8] border border-[#DAD2C3] w-full max-w-lg rounded-[28px] shadow-2xl overflow-hidden text-[#4A453E] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#3A5A40]/15 border border-[#3A5A40]/25 flex items-center justify-center text-[#3A5A40]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#3A5A40]">Select Puzzle Theme</h2>
              <p className="text-xs text-[#7A746B]">Choose artwork or upload your own photo</p>
            </div>
          </div>
          <button
            id="btn-close-images"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#7A746B] hover:text-[#4A453E] border border-[#E5E0D5] transition shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Custom Image Button */}
        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="file-upload-input"
          />
          <button
            id="btn-trigger-upload"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 border-2 border-dashed border-[#DAD2C3] hover:border-[#3A5A40] rounded-2xl bg-[#F5F2EA] hover:bg-[#EBE7DF] text-[#4A453E] hover:text-[#3A5A40] transition flex items-center justify-center gap-2 text-xs font-semibold group cursor-pointer shadow-xs"
          >
            <Upload className="w-4 h-4 text-[#7E8260] group-hover:text-[#3A5A40] transition" />
            <span>Upload Any Photo From Your Device</span>
          </button>
        </div>

        {/* Presets and Custom Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {[...PRESET_IMAGES, ...customImages].map((img) => {
            const isSelected = currentImage.id === img.id;
            const isNumeric = !img.url;

            return (
              <div
                key={img.id}
                id={`img-card-${img.id}`}
                onClick={() => {
                  onSelectImage(img);
                  onClose();
                }}
                className={`group relative rounded-2xl border-2 overflow-hidden cursor-pointer transition p-1 bg-[#F5F2EA] flex flex-col ${
                  isSelected
                    ? 'border-[#3A5A40] shadow-md ring-2 ring-[#3A5A40]/20'
                    : 'border-[#E5E0D5] hover:border-[#DAD2C3]'
                }`}
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden relative bg-[#EBE7DF] flex items-center justify-center">
                  {isNumeric ? (
                    <div className="w-full h-full bg-[#EBE7DF] flex flex-col items-center justify-center text-[#3A5A40]">
                      <span className="text-3xl font-bold font-sans">1–15</span>
                      <span className="text-[10px] text-[#7A746B] mt-1 uppercase font-semibold">Numbers Mode</span>
                    </div>
                  ) : (
                    <img
                      src={img.url}
                      alt={img.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#3A5A40] text-[#FDFCF8] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {img.id === 'horse-original' && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#FDFCF8]/90 backdrop-blur-md text-[10px] text-[#3A5A40] font-bold border border-[#DAD2C3] flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5 text-[#3A5A40]" />
                      Original Horse
                    </div>
                  )}
                </div>

                <div className="p-2 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#4A453E] truncate">{img.name}</h4>
                    <span className="text-[10px] text-[#9A9E7C]">{img.author}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#E5E0D5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#EBE7DF] hover:bg-[#DAD2C3] text-xs font-semibold text-[#4A453E] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
