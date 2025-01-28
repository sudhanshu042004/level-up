import React, { useEffect, useState } from 'react';
import { TrendingUp, Trophy, X } from 'lucide-react';

type RankIncreaseToastProps = {
  oldRank?: string;
  newRank?: string;
  onClose?: () => void;
};

const RankIncreaseToast: React.FC<RankIncreaseToastProps> = ({
  oldRank = "Dormant",
  newRank = "Awakened",
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNewRank, setShowNewRank] = useState(false);

  // Darker themed rank colors with shadow essence
  const rankColors: Record<string, string> = {
    Dormant: 'from-gray-900 to-slate-800', // Deep slumber
    Awakened: 'from-slate-900 to-cyan-900', // Dark awakening
    Ascended: 'from-indigo-950 to-violet-900', // Shadow ascension
    Transcendent: 'from-purple-950 via-fuchsia-900 to-indigo-900', // Dark transcendence
    Supreme: 'from-rose-950 via-red-900 to-orange-900', // Dark supremacy
  };

  // Darker glow effects
  const rankGlows: Record<string, string> = {
    Dormant: 'shadow-lg shadow-gray-900/50',
    Awakened: 'shadow-lg shadow-cyan-900/50',
    Ascended: 'shadow-lg shadow-violet-900/50',
    Transcendent: 'shadow-lg shadow-fuchsia-900/50',
    Supreme: 'shadow-lg shadow-rose-900/50',
  };

  const getGradient = (rank: string) => rankColors[rank] || 'from-gray-900 to-slate-800';
  const getGlow = (rank: string) => rankGlows[rank] || '';

  useEffect(() => {
    setIsVisible(true);

    const rankTimer = setTimeout(() => {
      setShowNewRank(true);
    }, 1000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 5000);

    return () => {
      clearTimeout(rankTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 transform transition-all duration-500 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`relative bg-gradient-to-r ${getGradient(newRank)} 
        rounded-lg p-4 w-80 border border-white/5
        before:absolute before:inset-0 before:bg-black/40 before:rounded-lg
        ${getGlow(newRank)} animate-pulse-subtle`}>

        {/* Dark mist effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent rounded-lg" />

        <div className="relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 text-amber-700 mr-2 animate-bounce-subtle" />
              <span className="font-bold text-gray-200 text-lg tracking-wider">RANK UP!</span>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
              }}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <span className={`text-gray-400 text-lg font-semibold transition-all duration-500
                  ${showNewRank ? 'opacity-50 scale-95 translate-x-0' : 'opacity-100 scale-100 translate-x-0'}`}>
                  {oldRank}
                </span>
                <TrendingUp className="h-5 w-5 text-emerald-800 animate-pulse" />
                <span className={`text-gray-100 text-xl font-bold transition-all duration-500
                  ${showNewRank ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 -translate-x-4'}
                  drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]`}>
                  {newRank}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="bg-black/60 h-2 rounded-full overflow-hidden backdrop-blur-sm">
              <div className={`h-full transition-all duration-1000 ease-out
                bg-gradient-to-r ${getGradient(newRank)}
                ${showNewRank ? 'w-full' : 'w-0'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankIncreaseToast;
