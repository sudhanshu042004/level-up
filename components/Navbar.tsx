"use client";
import { getUserHeadData } from '@/lib/actions/users/getUsersProfile';
import { expRequired } from '@/lib/LevelManaging';
import { UserHead } from '@/types/userstype';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [userData, setUserData] = useState<UserHead | undefined>()
  const [maxExp, setMaxExp] = useState<number | undefined>();

  useEffect(() => {
    const callData = async () => {
      const user = await getUserHeadData();
      setUserData(user);
      const exp = await expRequired(user?.level as number);
      setMaxExp(exp);
    }
    callData();
  }, []);


  // if (!maxExp && !userData) {
  //   return (
  //     <>
  //       Loading....
  //     </>
  //   )
  // }

  return (
    <div className=" p-5 rounded bg-white shadow-md flex justify-between items-center w-full" >
      <div className='flex' >
        <div className="h-16 p-1 w-16 rounded-full bg-gray-700"><img className='rounded-full' src={userData?.avatar} /></div>
        <div className='mx-2 flex justify-center flex-col' >
          <div className='font-bold relative left-1 text-md' >{userData?.username}</div>
          <div className='px-1 text-sm' >{userData?.rank}</div>
          <div className='flex' >
            <div className=' px-1 text-sm '>Level {userData?.level}</div>
            <div className='relative bottom-1' > <progress className='rounded text-[#f43c04] text-sm h-2' value={125} max={maxExp} /> </div>
          </div>
        </div>
      </div>
      <Link href="/home/createTracks" className="font-bold shadow-md hover:shadow-xl hover:p-3 cursor-pointer p-2 rounded-l ">create + </Link>
    </div>
  );
};

export default Navbar;
