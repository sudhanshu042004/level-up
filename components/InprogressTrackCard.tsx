import React from 'react';
import { Globe, GlobeLock, CalendarClock, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { difficulty, Track } from '@/types/Tracks';
import { getDifficultyColor } from '@/utils/trackUtils';
import { motion } from 'motion/react';

interface TrackCardProps {
  track: Track;
  onClick: () => void;
  index: number
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onClick, index }) => {
  const difficultyColor = getDifficultyColor(track.difficulty as difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        onClick={onClick}
        className="group hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 overflow-hidden"
      >
        <motion.div
          className="p-5"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold line-clamp-2 flex-grow text-orange-900">
                {track.trackName}
              </h3>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {track.visibility ? (
                  <Globe className="w-5 h-5 text-orange-400 flex-shrink-0 ml-2" />
                ) : (
                  <GlobeLock className="w-5 h-5 text-orange-400 flex-shrink-0 ml-2" />
                )}
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              <Badge
                variant="secondary"
                className={`${difficultyColor} text-xs font-medium shadow-sm`}
              >
                {track.difficulty}
              </Badge>
              {track.dueDate && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-xs bg-white/50 backdrop-blur-sm border-orange-200"
                >
                  <CalendarClock className="w-3 h-3 text-orange-500" />
                  {track.dueDate}
                </Badge>
              )}
            </div>

            <motion.div
              className="mt-4 flex justify-end"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ChevronRight className="w-5 h-5 text-orange-400 group-hover:text-orange-600 transition-colors" />
            </motion.div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default TrackCard;
