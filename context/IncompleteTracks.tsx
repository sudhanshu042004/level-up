import { getUncompleteTracks } from "@/lib/actions/tracks/UncompleteTracks";
import { Track } from "@/types/Tracks"
import React, { createContext, ReactNode, useEffect, useState } from "react"

type TrackContextType = {
  tracks: Track[],
  setTracks: React.Dispatch<React.SetStateAction<Track[] | undefined>>
}
export const UncompleteTracksContext = createContext<TrackContextType | undefined>(undefined)

export const UncompleteTracks = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<Track[]>();
  useEffect(() => {
    async function getTrack() {
      const result: Track[] = await getUncompleteTracks();
      setTracks(result);
    }
    getTrack();
  }, [])

  const ContextValue: TrackContextType = {
    tracks: tracks as Track[],
    setTracks: setTracks
  }
  return (
    <UncompleteTracksContext.Provider value={ContextValue}>
      {children}
    </UncompleteTracksContext.Provider>
  )
}
