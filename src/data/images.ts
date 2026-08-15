import horseImageSrc from '../assets/images/horse_puzzle_image_1786758398286.jpg';
import { PuzzleImage } from '../types';

export const PRESET_IMAGES: PuzzleImage[] = [
  {
    id: 'horse-original',
    name: 'Blonde Mane Horse',
    url: horseImageSrc,
    author: 'Original Upload',
  },
  {
    id: 'numbers',
    name: 'Classic Number Grid',
    url: '', // Empty URL signifies number grid mode with gradient styling
    author: 'Classic 15-Puzzle',
  },
  {
    id: 'sunset-stallion',
    name: 'Golden Paddock',
    url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1000&auto=format&fit=crop',
    author: 'Unsplash',
  },
  {
    id: 'wild-spirit',
    name: 'Wild Mustang',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    author: 'Unsplash',
  },
];

export const DEFAULT_IMAGE = PRESET_IMAGES[0];
