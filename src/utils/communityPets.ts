import { CommunityPetPicture, PuzzleImage } from '../types';
import horseImageSrc from '../assets/images/horse_puzzle_image_1786758398286.jpg';

const LOCAL_PETS_KEY = 'sliding_puzzle_community_pets_v1';
const DAILY_PET_KEY = 'sliding_puzzle_daily_pet_v1';

// Initial curated preset pets to ensure a rich rotation from day one
export const SEED_PETS: CommunityPetPicture[] = [
  {
    id: 'preset-horse-blondie',
    petName: 'Blondie',
    animalType: 'Palomino Horse',
    description: 'A majestic golden mare who loves sunrise trots through open wildflower meadows.',
    location: 'Cordoba, Argentina',
    submitterName: 'Seba Di Giuseppe',
    imageUrl: horseImageSrc,
    qualityScore: 9.8,
    aiComment: 'Magnificent golden mane with crisp, high-contrast details perfect for 16-piece sliding tiles.',
    status: 'approved',
    createdAt: '2026-08-01T10:00:00.000Z',
    timesUsedAsDaily: 1,
    lastUsedDate: '2026-08-10',
    usedDates: ['2026-08-10'],
    isPreset: true,
  },
  {
    id: 'preset-dog-milo',
    petName: 'Milo & Pippin',
    animalType: 'Golden Retriever & Beagle',
    description: 'Best friends on an autumn afternoon hike in the coastal hills.',
    location: 'Montevideo, Uruguay',
    submitterName: 'Camila R.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=900&auto=format&fit=crop',
    qualityScore: 9.6,
    aiComment: 'Bright warm lighting with clear expressive eyes. Great tile recognition.',
    status: 'approved',
    createdAt: '2026-08-02T12:00:00.000Z',
    timesUsedAsDaily: 1,
    lastUsedDate: '2026-08-11',
    usedDates: ['2026-08-11'],
    isPreset: true,
  },
  {
    id: 'preset-cat-oliver',
    petName: 'Oliver the Explorer',
    animalType: 'Ginger Tabby Cat',
    description: 'Curious green-eyed tabby lounging near a sunny garden window sill.',
    location: 'Barcelona, Spain',
    submitterName: 'Lucas & Sofia',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=900&auto=format&fit=crop',
    qualityScore: 9.7,
    aiComment: 'Striking vibrant emerald eyes and intricate whisker textures provide great visual cues.',
    status: 'approved',
    createdAt: '2026-08-03T14:30:00.000Z',
    timesUsedAsDaily: 1,
    lastUsedDate: '2026-08-12',
    usedDates: ['2026-08-12'],
    isPreset: true,
  },
  {
    id: 'preset-dog-barnaby',
    petName: 'Barnaby',
    animalType: 'Corgi Pup',
    description: 'High-energy puppy playing in clover grass on a sunny spring morning.',
    location: 'Portland, Oregon',
    submitterName: 'Emma W.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=900&auto=format&fit=crop',
    qualityScore: 9.5,
    aiComment: 'Adorable head tilt with excellent contrast between warm fur and green background.',
    status: 'approved',
    createdAt: '2026-08-04T09:15:00.000Z',
    timesUsedAsDaily: 1,
    lastUsedDate: '2026-08-13',
    usedDates: ['2026-08-13'],
    isPreset: true,
  },
  {
    id: 'preset-rabbit-clover',
    petName: 'Clover & Thumper',
    animalType: 'Holland Lop Bunny',
    description: 'Fluffy rescued lop-eared bunny who loves fresh parsley and nose boops.',
    location: 'Munich, Germany',
    submitterName: 'Felix B.',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=900&auto=format&fit=crop',
    qualityScore: 9.4,
    aiComment: 'Super soft textures and expressive gentle lighting. Delightful family puzzle subject.',
    status: 'approved',
    createdAt: '2026-08-05T11:00:00.000Z',
    timesUsedAsDaily: 1,
    lastUsedDate: '2026-08-14',
    usedDates: ['2026-08-14'],
    isPreset: true,
  },
  {
    id: 'preset-wild-stallion',
    petName: 'Echo',
    animalType: 'Wild Mustang',
    description: 'Free spirited mustang running along the golden prairie during golden hour.',
    location: 'Wyoming, USA',
    submitterName: 'David K.',
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=900&auto=format&fit=crop',
    qualityScore: 9.7,
    aiComment: 'Epic dynamic movement with high depth-of-field contrast.',
    status: 'approved',
    createdAt: '2026-08-06T16:00:00.000Z',
    timesUsedAsDaily: 0,
    lastUsedDate: null,
    usedDates: [],
    isPreset: true,
  },
];

// Get stored local community pictures
export function getLocalCommunityPets(): CommunityPetPicture[] {
  try {
    const raw = localStorage.getItem(LOCAL_PETS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PETS_KEY, JSON.stringify(SEED_PETS));
      return SEED_PETS;
    }
    const parsed: CommunityPetPicture[] = JSON.parse(raw);
    // Ensure all seed presets exist
    const map = new Map<string, CommunityPetPicture>();
    SEED_PETS.forEach((p) => map.set(p.id, p));
    parsed.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  } catch (e) {
    console.warn('Error reading local community pets:', e);
    return SEED_PETS;
  }
}

// Save or add a community pet to local storage
export function saveLocalCommunityPet(pet: CommunityPetPicture): CommunityPetPicture[] {
  const current = getLocalCommunityPets();
  const existingIdx = current.findIndex((p) => p.id === pet.id);
  let updated: CommunityPetPicture[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = pet;
  } else {
    updated = [pet, ...current];
  }

  // Storage Limit Pruning (Keep max 60 pictures locally to respect browser quota)
  if (updated.length > 60) {
    // Keep presets + newest approved pets
    const presets = updated.filter((p) => p.isPreset);
    const nonPresets = updated.filter((p) => !p.isPreset);
    // Sort by createdAt descending
    nonPresets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    updated = [...presets, ...nonPresets.slice(0, 50)];
  }

  try {
    localStorage.setItem(LOCAL_PETS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving local community pets:', e);
  }
  return updated;
}

// Deterministic simple hash from string for daily consistency
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Get or Pick Today's Daily Featured Pet Puzzle.
 * Cycle Algorithm Guarantee:
 * - Flags pictures that were already used as daily puzzles.
 * - Does NOT repeat any picture until ALL approved pictures in the pool have been used once in the current cycle!
 * - When all have been used, increments the cycle tier and repeats smoothly.
 */
export function getDailyFeaturedPet(allPets: CommunityPetPicture[] = getLocalCommunityPets()): {
  dailyPet: CommunityPetPicture;
  isNewCycle: boolean;
  cycleProgress: { used: number; total: number };
} {
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const approved = allPets.filter((p) => p.status === 'approved');

  if (approved.length === 0) {
    return {
      dailyPet: SEED_PETS[0],
      isNewCycle: false,
      cycleProgress: { used: 1, total: 1 },
    };
  }

  // Check if we already picked and saved today's pet
  try {
    const cachedDailyRaw = localStorage.getItem(DAILY_PET_KEY);
    if (cachedDailyRaw) {
      const cached = JSON.parse(cachedDailyRaw);
      if (cached.date === today && cached.petId) {
        const found = approved.find((p) => p.id === cached.petId);
        if (found) {
          const minUsed = Math.min(...approved.map((p) => p.timesUsedAsDaily || 0));
          const usedInCycle = approved.filter((p) => (p.timesUsedAsDaily || 0) > minUsed).length;
          return {
            dailyPet: found,
            isNewCycle: false,
            cycleProgress: { used: usedInCycle, total: approved.length },
          };
        }
      }
    }
  } catch (e) {
    console.warn('Error reading cached daily pet:', e);
  }

  // Determine current cycle level (minimum timesUsedAsDaily)
  const minUsage = Math.min(...approved.map((p) => p.timesUsedAsDaily || 0));
  
  // Find candidates that have NOT been used in the current cycle
  let candidates = approved.filter((p) => (p.timesUsedAsDaily || 0) === minUsage);

  // If somehow empty, all have equal usage
  if (candidates.length === 0) {
    candidates = approved;
  }

  // Deterministically select candidate based on today's date string
  const hash = hashString(today);
  const selectedIndex = hash % candidates.length;
  const chosenPet = candidates[selectedIndex];

  // Mark as used for today
  const updatedPet: CommunityPetPicture = {
    ...chosenPet,
    timesUsedAsDaily: (chosenPet.timesUsedAsDaily || 0) + 1,
    lastUsedDate: today,
    usedDates: Array.from(new Set([...(chosenPet.usedDates || []), today])),
  };

  saveLocalCommunityPet(updatedPet);

  // Cache today's selection
  try {
    localStorage.setItem(
      DAILY_PET_KEY,
      JSON.stringify({
        date: today,
        petId: updatedPet.id,
      })
    );
  } catch (e) {
    console.warn('Error saving daily pet cache:', e);
  }

  const newMinUsage = Math.min(...approved.map((p) => p.id === updatedPet.id ? updatedPet.timesUsedAsDaily : (p.timesUsedAsDaily || 0)));
  const usedInCycle = approved.filter((p) => {
    const usage = p.id === updatedPet.id ? updatedPet.timesUsedAsDaily : (p.timesUsedAsDaily || 0);
    return usage > newMinUsage;
  }).length;

  return {
    dailyPet: updatedPet,
    isNewCycle: candidates.length === 1,
    cycleProgress: { used: usedInCycle || 1, total: approved.length },
  };
}

/**
 * Converts a CommunityPetPicture into a playable PuzzleImage object
 */
export function petToPuzzleImage(pet: CommunityPetPicture, isDaily = false): PuzzleImage {
  return {
    id: `pet-${pet.id}`,
    name: `${pet.petName} (${pet.animalType})`,
    url: pet.imageUrl,
    author: `${pet.submitterName}${pet.location ? ` • ${pet.location}` : ''}`,
    isCustom: !pet.isPreset,
    isDaily,
    isCommunityPet: true,
    petData: pet,
  };
}

/**
 * Client-side fast image compressor and square cropper.
 * Takes a File or Blob, crops the center square, resizes to max 800x800,
 * and returns lightweight base64 JPEG/WebP string (< 90 KB).
 */
export function processAndCompressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const TARGET_SIZE = 800; // Optimal for 4x4 crisp tiles

          // Calculate center square crop
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;

          canvas.width = TARGET_SIZE;
          canvas.height = TARGET_SIZE;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not create canvas context'));
          }

          // Clean smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw cropped center square
          ctx.drawImage(
            img,
            startX,
            startY,
            minSide,
            minSide,
            0,
            0,
            TARGET_SIZE,
            TARGET_SIZE
          );

          // Convert to lightweight JPEG at 82% quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
