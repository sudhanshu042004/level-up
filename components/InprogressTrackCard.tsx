import React from 'react';
import { Globe, GlobeLock, CalendarClock, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { difficulty, Track } from '@/types/Tracks';
import { getDifficultyColor } from '@/utils/trackUtils';

interface TrackCardProps {
  track: Track;
  onClick: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onClick }) => {
  const difficultyColor = getDifficultyColor(track.difficulty as difficulty);

  return (
    <Card
      onClick={onClick}
      className="group hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 p-4"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold line-clamp-2 flex-grow">
            {track.trackName}
          </h3>
          {track.visibility ? (
            <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
          ) : (
            <GlobeLock className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          <Badge
            variant="secondary"
            className={`${difficultyColor} text-xs`}
          >
            {track.difficulty}
          </Badge>

          {track.dueDate && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs"
            >
              <CalendarClock className="w-3 h-3" />
              {track.dueDate}
            </Badge>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Card>
  );
};

export default TrackCard;
