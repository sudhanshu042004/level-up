import { getUncompleteTracks } from "@/lib/actions/tracks/UncompleteTracks";
import { Track } from "@/types/Tracks"
import { createContext, ReactNode, useEffect, useState } from "react"

export const UncompleteTracksContext = createContext<Track[] | undefined>(undefined)

export const UncompleteTracks = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<Track[]>();
  useEffect(() => {
    async function getTrack() {
      const result: Track[] = await getUncompleteTracks();
      setTracks(result);
    }
    getTrack();
  }, [])

  return (
    <UncompleteTracksContext.Provider value={tracks}>
      {children}
    </UncompleteTracksContext.Provider>
  )
}
