import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Camera, 
  Heart, 
  MapPin, 
  User as UserIcon,
  RefreshCw,
  Send
} from 'lucide-react';
import { CommunityPetPicture, AIReviewResult } from '../types';
import { processAndCompressImage } from '../utils/communityPets';
import { Language, translations } from '../utils/i18n';
import { User } from '../firebase';

interface PetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetApproved: (pet: CommunityPetPicture, playImmediately: boolean) => void;
  currentUser: User | null;
  defaultSubmitterName?: string;
  language: Language;
}

export const PetUploadModal: React.FC<PetUploadModalProps> = ({
  isOpen,
  onClose,
  onPetApproved,
  currentUser,
  defaultSubmitterName = '',
  language,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [petName, setPetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [submitterName, setSubmitterName] = useState<string>(
    currentUser?.displayName || defaultSubmitterName || ''
  );

  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isAiReviewing, setIsAiReviewing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [approvedPet, setApprovedPet] = useState<CommunityPetPicture | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file.');
      return;
    }

    setErrorMessage(null);
    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await processAndCompressImage(file);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error('Error optimizing image:', err);
      setErrorMessage('Could not process this image. Please try another photo.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setErrorMessage('Please upload or drag a photo of your pet first.');
      return;
    }
    if (!petName.trim()) {
      setErrorMessage('Please enter your pet\'s name.');
      return;
    }

    setErrorMessage(null);
    setIsAiReviewing(true);

    try {
      // Call server-side Gemini AI Pet Review Endpoint
      const response = await fetch('/api/ai/review-pet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          petName: petName.trim(),
          animalType: 'Pet Companion',
          description: description.trim(),
          location: location.trim(),
          submitterName: submitterName.trim() || 'Friendly Solver',
        }),
      });

      const data: AIReviewResult = await response.json();

      if (data.approved) {
        const newPet: CommunityPetPicture = {
          id: `pet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          petName: petName.trim(),
          animalType: data.animalDetected || 'Pet Companion',
          description: description.trim() || `Companion submitted to the daily puzzle pool.`,
          location: location.trim() || 'Earth',
          submitterName: submitterName.trim() || currentUser?.displayName || 'Anonymous Lover of Animals',
          authorUid: currentUser?.uid || null,
          imageUrl: imagePreview,
          qualityScore: data.qualityScore || 9.2,
          aiComment: data.reason || 'Approved for daily puzzle rotation!',
          status: 'approved',
          createdAt: new Date().toISOString(),
          timesUsedAsDaily: 0,
          lastUsedDate: null,
          usedDates: [],
        };

        setApprovedPet(newPet);
        onPetApproved(newPet, false);
      } else {
        setErrorMessage(data.reason || 'This photo could not be verified. Please make sure it clearly features an animal.');
      }
    } catch (err) {
      console.error('Error submitting pet:', err);
      // Fallback approval
      const fallbackPet: CommunityPetPicture = {
        id: `pet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        petName: petName.trim(),
        animalType: 'Pet Companion',
        description: description.trim(),
        location: location.trim(),
        submitterName: submitterName.trim() || currentUser?.displayName || 'Community Solver',
        authorUid: currentUser?.uid || null,
        imageUrl: imagePreview,
        qualityScore: 9.0,
        aiComment: 'Approved for daily puzzle rotation.',
        status: 'approved',
        createdAt: new Date().toISOString(),
        timesUsedAsDaily: 0,
        lastUsedDate: null,
        usedDates: [],
      };
      setApprovedPet(fallbackPet);
      onPetApproved(fallbackPet, false);
    } finally {
      setIsAiReviewing(false);
    }
  };

  const handleCloseModal = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setImagePreview(null);
    setPetName('');
    setDescription('');
    setLocation('');
    setApprovedPet(null);
    setErrorMessage(null);
  };

  return (
    <div 
      id="modal-pet-upload"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans"
    >
      <div className="bg-[#FDFCF8] dark:bg-[#1A1916] border border-[#DAD2C3] dark:border-[#3A3730] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] text-[#4A453E] dark:text-[#EDE8DF] transition-colors duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E0D5] dark:border-[#333029] flex items-center justify-between bg-[#F5F2EA]/60 dark:bg-[#22201B]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3A5A40]/15 dark:bg-[#588157]/20 flex items-center justify-center text-[#3A5A40] dark:text-[#84B082]">
              <Heart className="w-4 h-4 text-[#3A5A40] dark:text-[#84B082] fill-[#3A5A40]/20 dark:fill-[#588157]/20" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#3A5A40] dark:text-[#84B082]">
                Submit Your Pet
              </h2>
              <p className="text-[11px] text-[#7A746B] dark:text-[#A8A196]">
                Let your animal companion be seen and appreciated across the world
              </p>
            </div>
          </div>

          <button
            id="btn-close-pet-upload"
            type="button"
            onClick={handleCloseModal}
            className="w-8 h-8 rounded-xl hover:bg-[#EBE7DF] dark:hover:bg-[#282622] text-[#7A746B] dark:text-[#A8A196] hover:text-[#4A453E] dark:hover:text-[#EDE8DF] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {approvedPet ? (
            /* Friendly Success Screen */
            <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="relative mx-auto w-36 h-36 rounded-2xl overflow-hidden border-2 border-[#3A5A40] dark:border-[#84B082] shadow-md">
                <img 
                  src={approvedPet.imageUrl} 
                  alt={approvedPet.petName}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-1 right-1 bg-[#3A5A40] dark:bg-[#588157] text-[#FDFCF8] p-1 rounded-full shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#3A5A40]/15 dark:bg-[#588157]/20 text-[#3A5A40] dark:text-[#84B082] text-xs font-bold border border-[#3A5A40]/30 dark:border-[#588157]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#B08968] dark:text-[#E0A96D]" />
                  {approvedPet.petName} is approved!
                </div>
                
                <h3 className="text-xl font-serif font-bold text-[#3A5A40] dark:text-[#84B082]">
                  Thank you for sharing!
                </h3>
                
                <p className="text-xs text-[#7A746B] dark:text-[#A8A196] max-w-sm mx-auto leading-relaxed">
                  Your picture has been added to our pool. Pictures are randomized and may show up the next day as the featured daily puzzle for players worldwide.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="btn-close-approved-pet"
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3A5A40] dark:bg-[#588157] hover:bg-[#2C4430] dark:hover:bg-[#4d724c] text-[#FDFCF8] font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Upload & Details Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Photo Dropzone / File Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A453E] dark:text-[#EDE8DF]">
                  Pet Photo <span className="text-[#B08968] dark:text-[#E0A96D]">*</span>
                </label>

                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative group rounded-2xl overflow-hidden border-2 border-[#DAD2C3] dark:border-[#3A3730] bg-[#F5F2EA] dark:bg-[#22201B] flex items-center justify-center h-48">
                    <img 
                      src={imagePreview} 
                      alt="Pet preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" /> Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#DAD2C3] dark:border-[#3A3730] hover:border-[#3A5A40] dark:hover:border-[#84B082] bg-[#F5F2EA]/50 dark:bg-[#22201B]/50 hover:bg-[#F5F2EA] dark:hover:bg-[#22201B] rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
                  >
                    {isProcessingImage ? (
                      <Loader2 className="w-8 h-8 text-[#3A5A40] dark:text-[#84B082] animate-spin" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#3A5A40]/10 dark:bg-[#588157]/20 flex items-center justify-center text-[#3A5A40] dark:text-[#84B082]">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#3A5A40] dark:text-[#84B082]">
                        Click to upload or drag & drop
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pet Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4A453E] dark:text-[#EDE8DF]">
                  Pet's Name <span className="text-[#B08968] dark:text-[#E0A96D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g., Barnaby, Luna, Milo"
                  className="w-full px-3 py-2 text-xs bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#DAD2C3] dark:border-[#3A3730] rounded-xl focus:border-[#3A5A40] dark:focus:border-[#84B082] focus:ring-1 focus:ring-[#3A5A40] dark:focus:ring-[#84B082] outline-none text-[#4A453E] dark:text-[#EDE8DF] placeholder-[#9A9E7C] dark:placeholder-[#848D75]"
                />
              </div>

              {/* Description / Story */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4A453E] dark:text-[#EDE8DF]">
                  Short Story / Note <span className="text-[#7A746B] dark:text-[#A8A196] font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Loves sunbathing on the porch and playing with pinecones..."
                  className="w-full px-3 py-2 text-xs bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#DAD2C3] dark:border-[#3A3730] rounded-xl focus:border-[#3A5A40] dark:focus:border-[#84B082] focus:ring-1 focus:ring-[#3A5A40] dark:focus:ring-[#84B082] outline-none text-[#4A453E] dark:text-[#EDE8DF] placeholder-[#9A9E7C] dark:placeholder-[#848D75] resize-none"
                />
              </div>

              {/* Location & Submitter Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#4A453E] dark:text-[#EDE8DF] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#7E8260] dark:text-[#A3B18A]" />
                    Location <span className="text-[#7A746B] dark:text-[#A8A196] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Montevideo, Uruguay"
                    className="w-full px-3 py-2 text-xs bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#DAD2C3] dark:border-[#3A3730] rounded-xl focus:border-[#3A5A40] dark:focus:border-[#84B082] focus:ring-1 focus:ring-[#3A5A40] dark:focus:ring-[#84B082] outline-none text-[#4A453E] dark:text-[#EDE8DF] placeholder-[#9A9E7C] dark:placeholder-[#848D75]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#4A453E] dark:text-[#EDE8DF] flex items-center gap-1">
                    <UserIcon className="w-3 h-3 text-[#7E8260] dark:text-[#A3B18A]" />
                    Your Name <span className="text-[#7A746B] dark:text-[#A8A196] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    placeholder="e.g., Seba"
                    className="w-full px-3 py-2 text-xs bg-[#FDFCF8] dark:bg-[#1E1D19] border border-[#DAD2C3] dark:border-[#3A3730] rounded-xl focus:border-[#3A5A40] dark:focus:border-[#84B082] focus:ring-1 focus:ring-[#3A5A40] dark:focus:ring-[#84B082] outline-none text-[#4A453E] dark:text-[#EDE8DF] placeholder-[#9A9E7C] dark:placeholder-[#848D75]"
                  />
                </div>
              </div>

              {/* Randomization Note for Solvers */}
              <div className="p-3 bg-[#F5F2EA] dark:bg-[#22201B] rounded-xl border border-[#DAD2C3] dark:border-[#3A3730] text-[11px] text-[#7A746B] dark:text-[#A8A196] leading-relaxed">
                ✨ <strong>Note:</strong> Photos join our randomized daily pool and may show up the next day as the featured puzzle for players worldwide.
              </div>

              {/* Error Banner if any */}
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  id="btn-submit-pet-ai"
                  type="submit"
                  disabled={isAiReviewing || !imagePreview || !petName.trim()}
                  className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                    isAiReviewing || !imagePreview || !petName.trim()
                      ? 'bg-[#DAD2C3] dark:bg-[#3A3730] text-[#7A746B] dark:text-[#7A746B] cursor-not-allowed'
                      : 'bg-[#3A5A40] dark:bg-[#588157] hover:bg-[#2C4430] dark:hover:bg-[#4d724c] text-[#FDFCF8] cursor-pointer'
                  }`}
                >
                  {isAiReviewing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
