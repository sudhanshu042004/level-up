import { CalendarClock, Globe } from 'lucide-react'
import React from 'react'

const TrackCard = () => {
  return (
    <div className='flex p-6 shadow-md rounded-lg w-full mx-5 hover:shadow-lg cursor-pointer hover:mx-4 justify-between ' >
      <div className="grid grid-cols-2 gap-2 ">
        <div className="font-semibold text-xl">Learn React</div>
        <div className='py-2'>
          <Globe className='h-4 w-4' />
        </div>
        <div className="text-sm ">medium</div>
      </div>
      <div>
        <div><CalendarClock /></div>
      </div>
    </div >
  )
}

export default TrackCard
