"use client";
import { UserContext } from '@/context/UserContext';
import Link from 'next/link';
import React, { useContext } from 'react';
import { Skeleton } from './ui/skeleton';

const Navbar = () => {
  const user = useContext(UserContext);
  const userData = user?.user;
  if (userData == undefined) {
    return (
      <div className=" p-5 rounded bg-white shadow-md flex justify-between items-center w-full" >
        <div className='flex' >
          <Skeleton className='h-16 p-1 w-16 rounded-full' />
          <div className='mx-2 flex justify-center flex-col' >
            <Skeleton className='relative w-16 h-3' />
            <Skeleton className='px-1 w-16 h-3 my-1' />
            <div className='flex flex-col ' >
              <Skeleton className='px-1 h-3 w-36' />
            </div>
          </div>
        </div>
        <Skeleton className='p-2 h-10 w-20' />
      </div>
    )
  }
  return (
    <div className=" p-5 rounded bg-white shadow-md flex justify-between items-center w-full" >
      <div className='flex' >
        <div className="h-16 p-1 w-16 rounded-full bg-gray-700"><img className='rounded-full' src={userData?.avatar} /></div>
        <div className='mx-2 flex justify-center flex-col' >
          <div className='font-bold relative left-1 text-md' >{userData?.username}</div>
          <div className='px-1 text-sm' >{userData?.rank}</div>
          <div className='flex' >
            <div className=' px-1 text-sm '>Level {userData?.level}</div>
            <div className='relative bottom-1' > <progress className='rounded text-[#f43c04] text-sm h-2' value={userData.exp as number} max={user?.maxExp} /> </div>
          </div>
        </div>
      </div>
      <Link href="/home/createTracks" className="font-bold shadow-md hover:shadow-xl hover:p-3 cursor-pointer p-2 rounded-l ">create + </Link>
    </div>
  );
};

export default Navbar;
