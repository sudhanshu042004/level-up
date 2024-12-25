"use client";
import { AtSign, CircleUserRound, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react'

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='flex justify-center items-center h-screen' >
      <div className='w-full max-w-md shadow-lg rounded-lg p-8'>
        <div className=' text-center' >
          <h2 className=' mt-6 font-bold text-2xl text-gray-900' >Welcome</h2>
          <p className='text-sm mt-2 text-gray-600' >Create an account.</p>
        </div>
        <form>
          <div>
            {/* email */}
            <div>
              <label className='text-sm font-medium text-gray-600' htmlFor='email'>Email</label>
              <div className='mt-1 relative' >
                <div className='absolute pl-3 inset-y-0 flex items-center left-0' >
                  <Mail className='h-5 w-5 text-gray-400 ' />
                </div>
                <input
                  name='email'
                  type='email'
                  required
                  className='pl-10 w-full pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:shadow-md focus:border-gray-600 '
                  placeholder='Enter your email'
                />
              </div>
            </div>
            {/*username*/}
            <div className='mt-2' >
              <label className='text-sm font-medium text-gray-600' htmlFor='username'>Username</label>
              <div className='relative mt-1'>
                <div className='absolute inset-y-0 flex pl-3 items-center' >
                  <AtSign className='text-gray-400 h-5 w-5' />
                </div>
                <input required placeholder='Create an username' name='username' type='text' className='pl-10 pr-4 py-2 w-full rounded-lg  border border-gray-300 focus:shadow-md focus:outline-none focus:border-gray-600' />
              </div>
            </div>
            {/*name*/}
            <div className='mt-2'>
              <label className='text-sm font-medium text-gray-600' htmlFor='name' >Name</label>
              <div className='relative mt-1' >
                <div className='absolute flex items-center inset-y-0 pl-3' >
                  <CircleUserRound className='h-5 w-5 text-gray-400' />
                </div>
                <input required placeholder='Enter your name' name='name' type='text' className='pl-10 w-full py-2 rounded-lg pr-4 border border-gray-300 focus:outline-none focus:shadow-md focus:border-gray-600' />
              </div>
            </div>
            {/* password */}
            <div className='mt-2' >
              <label className='text-sm font-medium text-gray-600' htmlFor='password'>Password</label>
              <div className='relative mt-1' >
                <div className='absolute flex items-center pl-3 inset-y-0 ' >
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input required placeholder='Create a password' minLength={6} name='password' type={showPassword ? "text" : "password"} className='py-2 w-full rounded-lg border border-gray-300 pl-10 pr-4 focus:outline-none focus:shadow-md focus:border-gray-600 ' />
                <button type='button' onClick={() => setShowPassword(prev => !prev)} className='absolute right-0 pr-4 flex items-center inset-y-0' >
                  {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
                </button>
              </div>
            </div>
          </div>
          <div className='mt-7' ><hr /></div>
          <button type='submit' className='w-full py-3 rounded bg-gray-800 mt-6 text-white  ' >
            submit
          </button>
        </form>
        <div className='text-center text-sm mt-6 py-2' >
          <span>already have an account?</span>
          <Link href="/login" className='font-semibold' >Login</Link>
        </div>
      </div>
    </div>
  )
}

