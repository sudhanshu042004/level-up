import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Track } from '@/types/Tracks';
import { motion } from 'motion/react';
import { Flame, Trophy } from 'lucide-react';


const CompletedTracks: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  return (
    <section>
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tracks.length === 0 ? (
          <motion.div
            className="col-span-full text-center py-12"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-8 rounded-lg shadow-md">
              <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <p className="text-orange-800 font-medium">Complete your first track to see it here!</p>
            </div>
          </motion.div>
        ) : (
          tracks.map((track, index) => (
            <motion.div
              key={track.trackId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-100 via-yellow-50 to-red-50 border-2 border-orange-200 hover:shadow-lg">
                <motion.div
                  className="p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-orange-800">{track.trackName}</h3>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
                      <Trophy className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
};
export default CompletedTracks
