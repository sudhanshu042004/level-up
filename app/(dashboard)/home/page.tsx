"use client";
import TrackCard from '@/components/Card'
import Navbar from '@/components/Navbar'
import React from 'react'

const home = () => {

  return (
    <div className='w-full pl-14' >
      <div>
        <div className='' ><Navbar /></div>
        <div className='flex justify-center items-center' ><TrackCard /> </div>
      </div>
    </div>
  )
}

export default home
