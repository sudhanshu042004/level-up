import React, { useState } from 'react';
import { Track } from '@/types/Tracks';
import TrackDialog from './TrackDialog';
import TrackCard from './InprogressTrackCard';

const InProgressTracks: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const [selectedTrack, setSelectedTrack] = useState<Track | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track);
    setDialogOpen(true);
  };

  return (
    <div className="w-full">
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gray-50 rounded-lg">
          <p className="text-xl font-semibold text-gray-700">No tracks in progress</p>
          <p className="text-gray-500">Start a new learning journey!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <TrackCard
              key={track.trackId}
              track={track}
              onClick={() => handleTrackClick(track)}
            />
          ))}
        </div>
      )}
      {selectedTrack && (
        <TrackDialog
          track={selectedTrack}
          setTrack={setSelectedTrack}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
};

export default InProgressTracks;
