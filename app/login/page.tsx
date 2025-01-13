"use client"
import { authenticateAccount } from '@/lib/actions/auth/login';
import { userLogin } from '@/types/userstype';
import { CircleUserRound, Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<userLogin>()
  const route = useRouter();

  const onSubmit: SubmitHandler<userLogin> = (data) => {
    toast.promise(authenticateAccount(data),
      {
        loading: "Loading...",
        success: (data: string) => { `${data}` + route.push('/home') },
        error: (err: string) => `${err}`
      })
  }

  return (
    <div className='flex min-h-screen justify-center items-center' >
      <div className='shadow-lg max-w-md rounded-lg p-8 w-full bg-white' >
        <div className='text-center' >
          <h2 className='font-bold text-2xl text-gray-900 mt-6' >Welcome Back</h2>
          <p className="text-sm text-gray-600 mt-2">Please signin into your account.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} >
          <div>
            {/* identifier */}
            <div className='mt-2' >
              <label htmlFor='identifier' className='text-sm font-medium text-gray-600' >Email or Username</label>
              <div className='mt-1 relative'>
                <div className='absolute inset-y-0 flex items-center pl-3 left-0' >
                  <CircleUserRound className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  {...register("identifier", { required: true })}
                  type='text'
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
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { required: true, minLength: 8 })}
                  className='pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:border-gray-600 focus:shadow-md focus:outline-none'
                  placeholder='Enter your password' />

                <button type='button' className='absolute right-0 pr-4 inset-y-0' onClick={() => setShowPassword(prev => !prev)} >
                  {showPassword ? <Eye className='h-5 w-5 text-gray-400' /> : <EyeOff className='h-5 w-5 text-gray-400 ' />}
                </button>
              </div>
              {errors.password && <span className='pl-1 text-sm text-gray-700' >minimum length 8</span>}
            </div>
          </div>
          <div className='my-7 flex items-center ' >
            <input
              type='checkbox'
              {...register("rememberMe")}
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
      <Toaster position='bottom-center' reverseOrder={false} />
    </div>
  )
}

export default Login
