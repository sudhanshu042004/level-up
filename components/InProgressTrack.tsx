import React, { useState } from 'react';
import { Track } from '@/types/Tracks';
import TrackDialog from './TrackDialog';
import TrackCard from './InprogressTrackCard';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

const InProgressTracks: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const [selectedTrack, setSelectedTrack] = useState<Track | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track);
    setDialogOpen(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {tracks.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center p-8 text-center space-y-6 rounded-xl bg-gradient-to-r from-orange-50 via-yellow-50 to-red-50 border-2 border-orange-100 shadow-lg"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Flame className="w-16 h-16 text-orange-500" />
          </motion.div>
          <div>
            <p className="text-xl font-semibold text-orange-900 mb-2">No tracks in progress</p>
            <p className="text-orange-600">Start a new learning journey!</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tracks.map((track, index) => (
            <TrackCard
              key={track.trackId}
              track={track}
              onClick={() => handleTrackClick(track)}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {selectedTrack && (
        <TrackDialog
          track={selectedTrack}
          setTrack={setSelectedTrack}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </motion.div>
  );
};

export default InProgressTracks;
