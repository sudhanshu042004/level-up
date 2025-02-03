import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Track } from '@/types/Tracks';

interface CompletedTracksProps {
  tracks: Track[];
}

const CompletedTracks: React.FC<CompletedTracksProps> = ({ tracks }) => {
  return (
    <section>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tracks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Complete your first track to see it here!</p>
          </div>
        ) : (
          tracks.map((track) => (
            <Card
              key={track.trackId}
              className="bg-green-50 border-2 border-green-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-800">{track.trackName}</h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Completed
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};

export default CompletedTracks;
