import React, { useState, useContext } from 'react';
import { Globe, GlobeLock, CalendarClock, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UncompleteTracksContext } from '@/context/IncompleteTracks';
import { difficulty, Track } from '@/types/Tracks';
import TrackDialog from './TrackDialog';

const getDifficultyColor = (difficulty: difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
const TrackCard = () => {
  const [open, setOpen] = useState(false);
  const data = useContext(UncompleteTracksContext);
  const [track, setTrack] = React.useState<Track>()

  function handleClick(track: Track) {
    setOpen(true);
    setTrack(track)
  }

  if (!data?.tracks) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 font-medium">Loading tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4  py-6 w-full space-y-4" >
      {track &&
        <TrackDialog open={open} setOpen={setOpen} track={track} setTrack={setTrack} />
      }

      {data.tracks.map((track) => (
        <Card
          key={track.trackId}
          onClick={() => handleClick(track)}
          className="hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div className="p-6" key={track.trackId} >
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {track.trackName}
                  </h3>
                  {track.visibility ? (
                    <Globe className="h-5 w-5 text-gray-400" />
                  ) : (
                    <GlobeLock className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className={`${getDifficultyColor(track.difficulty as difficulty)} px-3 py-1`}
                  >
                    {track.difficulty}
                  </Badge>

                  {track.dueDate && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      <span>{track.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </Card>
      ))}

    </div>
  );
};

export default TrackCard;
