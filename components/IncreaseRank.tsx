import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Trophy, Star, X, Sparkles } from 'lucide-react';
import { number } from 'zod';

type RankIncreaseToastProps = {
  oldRank?: string;
  newRank?: string;
  onClose?: () => void;
};

const RankIncreaseToast: React.FC<RankIncreaseToastProps> = ({
  oldRank,
  newRank,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNewRank, setShowNewRank] = useState(false);

  const rankColors: Record<string, string> = {
    Dormant: 'from-orange-900 to-red-800',
    Awakened: 'from-red-800 to-orange-700',
    Ascended: 'from-yellow-700 to-orange-800',
    Transcendent: 'from-orange-800 via-red-700 to-yellow-700',
    Supreme: 'from-red-700 via-orange-600 to-yellow-600',
  };

  const rankGlows: Record<string, string> = {
    Dormant: 'shadow-lg shadow-orange-500/30',
    Awakened: 'shadow-lg shadow-red-500/30',
    Ascended: 'shadow-lg shadow-yellow-500/30',
    Transcendent: 'shadow-lg shadow-orange-500/40',
    Supreme: 'shadow-lg shadow-red-500/50',
  };

  const getGradient = (rank: string) => rankColors[rank] || rankColors.Dormant;
  const getGlow = (rank: string) => rankGlows[rank] || rankGlows.Dormant;

  useEffect(() => {
    setIsVisible(true);
    const rankTimer = setTimeout(() => setShowNewRank(true), 1000);
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
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="relative z-10"
    >
      <motion.div
        className={`relative bg-gradient-to-r ${getGradient(newRank as string)} 
          rounded-xl p-6 w-96 border border-orange-300/10
          backdrop-blur-xl ${getGlow(newRank as string)}`}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <div className="relative">
          <motion.div
            className="flex justify-between items-start"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="h-7 w-7 text-yellow-400 mr-3" />
              </motion.div>
              <span className="font-bold text-yellow-100 text-xl tracking-wider">RANK UP!</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
              }}
              className="text-orange-200 hover:text-yellow-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center space-x-4">
              <motion.span
                animate={showNewRank ? { opacity: 0.5, scale: 0.95 } : { opacity: 1, scale: 1 }}
                className="text-orange-200 text-lg font-semibold"
              >
                {oldRank}
              </motion.span>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={showNewRank ? { opacity: 1, scale: 1, x: 0 } : {}}
                className="text-yellow-100 text-2xl font-bold drop-shadow-glow"
              >
                {newRank}
              </motion.span>
            </div>
          </motion.div>

          <motion.div className="mt-4">
            <div className="bg-black/40 h-2.5 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full bg-gradient-to-r ${getGradient(newRank as string)}`}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const calculateExpProgress = (currentExp: number, maxExp: number) => {
  return Math.min((currentExp / maxExp) * 100, 100);
};

const getExpRequiredForLevel = (level: number) => {
  return level * 200;
};


type ProgressToastProps = {
  oldLevel: number;
  newLevel: number;
  oldExp: number;
  newExp: number;
  currentRank: string;
  newRank: string;
};

const ProgressToast: React.FC<ProgressToastProps> = ({
  oldLevel,
  newLevel,
  oldExp,
  newExp,
  currentRank,
  newRank
}) => {
  const expRequired = getExpRequiredForLevel(newLevel);
  const progressPercentage = calculateExpProgress(newExp, expRequired);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col sm:flex-row items-start gap-4 bg-gradient-to-br from-orange-950 to-red-900 rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md border border-orange-500/20"
    >
      {currentRank !== newRank && newRank !== null && (
        <RankIncreaseToast oldRank={currentRank} newRank={newRank} />
      )}

      <motion.div
        className="flex items-start gap-3 sm:gap-4 w-full"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        <motion.div
          className="flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {newLevel > oldLevel ? (
            <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/30">
              <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
          ) : (
            <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg shadow-red-500/30">
              <Star className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
          )}
        </motion.div>

        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          <motion.div
            className="font-bold text-base sm:text-lg text-yellow-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {newLevel > oldLevel ? 'Level Up!' : 'Experience Gained!'}
          </motion.div>

          <motion.div
            className="space-y-2 sm:space-y-3 text-orange-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {newLevel > oldLevel && (
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                </motion.div>
                <span className="text-sm sm:text-lg">Level: {oldLevel} → {newLevel}</span>
              </motion.div>
            )}

            <motion.div
              className="flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <span className="text-sm sm:text-lg">
                EXP: {newExp}/{expRequired} (+{newExp - oldExp})
              </span>
            </motion.div>

            <div className="w-full pt-1 sm:pt-2">
              <div className="relative">
                <motion.div
                  className="h-2 bg-black/40 rounded-full overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </motion.div>
                <motion.div
                  className="absolute -top-5 text-xs text-yellow-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {progressPercentage.toFixed(1)}%
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { RankIncreaseToast, ProgressToast };
