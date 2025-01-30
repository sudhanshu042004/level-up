"use client";
import { UserContext } from '@/context/UserContext';
import Link from 'next/link';
import React, { useContext } from 'react';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight } from 'lucide-react';

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
        className="p-6 rounded-2xl shadow-lg flex justify-between items-center"
        style={{
          backgroundColor: colors.white,
          color: colors.darkBlue
        }}
      >
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-20 w-20 rounded-full' style={{ backgroundColor: colors.midBlue }} />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32 rounded' style={{ backgroundColor: colors.midBlue }} />
            <Skeleton className='h-4 w-24 rounded' style={{ backgroundColor: colors.midBlue }} />
            <Skeleton className='h-4 w-40 rounded' style={{ backgroundColor: colors.midBlue }} />
          </div>
        </div>
        <Skeleton className='h-12 w-28 rounded-lg' style={{ backgroundColor: colors.midBlue }} />
      </div>
    )
  }

  return (
    <div
      className="p-6 rounded-2xl shadow-lg flex justify-between items-center"
      style={{
        backgroundColor: colors.white,
        color: colors.darkBlue
      }}
    >
      <div className='flex items-center space-x-4'>
        <Avatar className='h-20 w-20 border-4' style={{ borderColor: colors.red }}>
          <AvatarImage src={userData.avatar} alt={`${userData.username}'s avatar`} className="object-cover" />
          <AvatarFallback
            style={{
              backgroundColor: colors.midBlue,
              color: colors.white
            }}
            className="font-bold"
          >
            {userData.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className='space-y-1'>
          <div
            className='text-xl font-semibold'
            style={{ color: colors.darkBlue }}
          >
            {userData?.username}
          </div>
          <div
            className='text-sm flex items-center'
            style={{ color: colors.midBlue }}
          >
            {userData?.rank}
            <ChevronRight className='w-4 h-4 mx-1' style={{ color: colors.red }} />
            <span className='font-medium'>Level {userData?.level}</span>
          </div>

          <div
            className='w-full rounded-full h-2.5 overflow-hidden'
            style={{ backgroundColor: colors.midBlue }}
          >
            <div
              className='h-2.5 rounded-full'
              style={{
                width: `${(userData.exp as number / (user?.maxExp || 1)) * 100}%`,
                backgroundColor: colors.red,
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
        </div>
      </div>

      <Link
        href="/home/createTracks"
        className="group flex items-center bg-[#f43c04] text-[#ffffff] hover:-translate-y-1 hover:shadow-lg  space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out"
      >
        <span className="font-semibold">Create</span>
        <ChevronRight className='w-5 h-5 transition-opacity' />
      </Link>
    </div>
  );
};

export default Navbar;
