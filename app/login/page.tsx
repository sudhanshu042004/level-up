"use client"
import { CircleUserRound, Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='flex min-h-screen justify-center items-center' >
      <div className='shadow-lg max-w-md rounded-lg p-8 w-full bg-white' >
        <div className='text-center' >
          <h2 className='font-bold text-2xl text-gray-900 mt-6' >Welcome Back</h2>
          <p className="text-sm text-gray-600 mt-2">Please signin into your account.</p>
        </div>
        <form>
          <div>
            {/* email */}
            <div className='mt-2' >
              <label htmlFor='email' className='text-sm font-medium text-gray-600' >Email or Username</label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 flex items-center pl-3 left-0' >
                  <CircleUserRound className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  name='email'
                  type='text'
                  required
                  className='appearance-none block w-full rounded-lg pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-600 focus:shadow-md '
                  placeholder='Enter your username or email' />
              </div>
            </div>
            {/* password */}
            <div className='mt-2'>
              <label htmlFor='password' className='text-sm mt-2 text-gray-600 font-medium' >Password</label>
              <div className=' mt-1 relative' >
                <div className='absolute inset-y-0 flex items-center pl-3 '>
                  <Lock className='h-5 w-5 text-gray-400 ' />
                </div>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className='pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:border-gray-600 focus:shadow-md focus:outline-none'
                  placeholder='Enter your password' />

                <button type='button' className='absolute right-0 pr-4 inset-y-0' onClick={() => setShowPassword(prev => !prev)} >
                  {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400 ' />}
                </button>
              </div>
            </div>
          </div>
          <div className='my-7 flex items-center ' >
            <input
              type='checkbox'
              name='remember-me'
              className='h-4 w-4 text-gray-900 accent-gray-900'
            />
            <label htmlFor='remember-me' className='px-2' >Remember me</label>
          </div>
          <div>
            <button
              type='submit'
              className='w-full bg-gray-800 text-white rounded py-2 px-4 '>
              Submit
            </button>
          </div>
        </form>
        <div className='text-sm text-center mt-6 py-2'  >
          <span>Don't have account?</span>
          <Link href="/signup" className='font-semibold' >Signup</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
