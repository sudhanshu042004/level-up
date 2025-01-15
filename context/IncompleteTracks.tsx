import { getUncompleteTracks } from "@/lib/actions/tracks/UncompleteTracks";
import { UncompleteTrack } from "@/types/Tracks"
import { Result } from "postcss";
import { createContext, ReactNode, useEffect, useState } from "react"

export const UncompleteTracksContext = createContext<UncompleteTrack[] | undefined>(undefined)

export const UncompleteTracks = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<UncompleteTrack[]>();
  useEffect(() => {
    async function getTrack() {
      const result = await getUncompleteTracks();
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
