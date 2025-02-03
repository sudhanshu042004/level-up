import { difficulty } from '@/types/Tracks';

export const getDifficultyColor = (difficulty: difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'hard': return 'bg-rose-100 text-rose-800 border-rose-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
