import { getUserTracksData as getUserTracksData } from "@/lib/actions/tracks/UncompleteTracks";
import { Track } from "@/types/Tracks"
import React, { createContext, ReactNode, useEffect, useState } from "react"

type TrackContextType = {
  tracks: Track[],
  setTracks: React.Dispatch<React.SetStateAction<Track[] | undefined>>
}
export const TracksContext = createContext<TrackContextType | undefined>(undefined)

export const UserTracks = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<Track[]>();
  useEffect(() => {
    async function getTrack() {
      const result: Track[] = await getUserTracksData();
      setTracks(result);
    }
    getTrack();
  }, [])

  const ContextValue: TrackContextType = {
    tracks: tracks as Track[],
    setTracks: setTracks
  }
  return (
    <TracksContext.Provider value={ContextValue}>
      {children}
    </TracksContext.Provider>
  )
}
