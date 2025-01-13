"use client";
import TrackCard from '@/components/Card'
import Navbar from '@/components/Navbar'
import { getUncompleteTracks } from '@/lib/actions/tracks/UncompleteTracks';
import { TrackType } from '@/types/Tracks';
import React, { useEffect, useState } from 'react'

const home = () => {
  const [tracks, setTracks] = useState<any>();
  useEffect(() => {
    async function getTracks() {
      const result = await getUncompleteTracks();
      setTracks(result);
    }
  }, []);

  // tracks if not loaded
  // if (!tracks) {
  //   return (
  //     <div className='flex justify-center items-center font-bold h-screen w-screen' >Loading....</div>
  //   )
  // }

  return (
    <div className='w-full pl-14' >
      <div>
        <div className='' ><Navbar /></div>
        <div className='flex justify-center items-center my-4' ><TrackCard /></div>
      </div>
    </div>
  )
}

export default home
