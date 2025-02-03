"use client";
import { UserContext } from '@/context/UserContext';
import Link from 'next/link';
import React, { useContext } from 'react';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const user = useContext(UserContext);
  const userData = user?.user;

  const colors = {
    white: '#ffffff',
    red: '#f43c04',
    darkBlue: '#0c0c24',
    midBlue: '#1c1c2c',
    black: '#000000'
  };

  if (userData == undefined) {
    return (
      <div
        className="w-full p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg ">
        <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6' >

          <div className='flex items-center w-full sm:w-auto space-x-3 sm:space-x-4'>
            <Skeleton className='h-12 w-12 rounded-full sm:h-16 sm:w-16 md:h-20 md:w-20 border-2 ms:border-4' />

            <div className='flex-1 space-y-2'>
              <Skeleton className='h-3 w-24 sm:h-4 sm:w-32 rounded' />
              <Skeleton className='h-4 w-20 sm:w-24 rounded' />
              <Skeleton className='h-4 w-32 sm:h-4 sm:40 rounded' />
            </div>
          </div>
          <Skeleton className='h-10 sm:h-12 w-24 sm:w-28 rounded-lg ml-auto ' />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg bg-white">
      <Toaster />
      <div className='flex flex-col sm:flex-row sm:justify-between items-center gap-3 sm:gap-4 md:gap-6'>

        <div className='flex items-center w-full sm:w-auto space-x-3 sm:space-x-4  ' >
          <Avatar
            className='h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 border-2 border-[#FD6325] sm:border-4'>
            <AvatarImage src={userData.avatar} alt={`${userData.username}'s avatar`} className="object-cover" />
            <AvatarFallback
              style={{
                backgroundColor: "#D2E2ED",
                color: colors.white
              }}
              className="text-sm sm:text-base font-bold"
            >
              {userData.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className=' flex-1 space-y-1 sm:space-y-2'>
            <div
              className='text-base sm:text-lg md:text-xl font-semibold '
              style={{ color: colors.darkBlue }}
            >
              {userData?.username}
            </div>

            <div
              className='text-xs sm:text-sm flex items-center'
              style={{ color: colors.midBlue }}
            >
              {userData?.rank}
              <ChevronRight className='w-3 h-3 sm:w-4 sm:h-4 mx-1 ' style={{ color: "#FD6325" }} />
              <span className='font-medium'>Level {userData?.level}</span>
            </div>

            <div
              className='w-full max-w-[200px] sm:max-w-none'
            >
              <div className='w-full rounded-full h-2 sm:h-2.5 bg-[#D2E2ED] overflow-hidden '
              >
                <div
                  className='h-full rounded-full transition-all duration-500 ease-in-out '
                  style={{
                    width: `${(userData.exp as number / (user?.maxExp || 1)) * 100}%`,
                    backgroundColor: '#FD6325',
                  }}
                />
              </div>
              <div className='text-xs sm:text-sm mt-1 ' >
                {user?.user.exp} / {user?.maxExp}
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/home/createTracks"
          className="group w-full sm:w-28 flex bg-[#FD6325] text-white items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg  "
        >
          <span className="font-semibold">Create</span>
          <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 transition-opacity' />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
