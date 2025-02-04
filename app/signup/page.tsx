"use client";
import { createAccount, isUsernameExists } from '@/lib/actions/auth/signup';
import { userSignup } from '@/types/userstype';
import { AtSign, CircleUserRound, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'motion/react';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm<userSignup>()
  const route = useRouter();

  async function usernameValidation(e: any) {
    const validity = await isUsernameExists(e.target.value);
    setIsUsernameValid(!validity);
  }
  const onSubmit: SubmitHandler<userSignup> = async (data) => {
    toast.promise(createAccount(data),
      {
        loading: "Loading...",
        success: (data: string) => { `${data}` + route.push('/home') },
        error: (err: string) => `${err}`
      })
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md shadow-lg rounded-lg p-8 bg-white'
      >
        <div className='text-center'>
          <h2 className='mt-6 font-bold text-2xl text-orange-600'>Welcome</h2>
          <p className='text-sm mt-2 text-gray-600'>Create an account.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className='mt-2'>
              <label className='text-sm font-medium text-gray-600' htmlFor='email'>Email</label>
              <div className='mt-1 relative'>
                <div className='absolute pl-3 inset-y-0 flex items-center left-0'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input type='email' {...register("email", { required: true })} className='pl-10 w-full pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:shadow-md focus:border-orange-500' placeholder='Enter your email' />
              </div>
            </div>
            <div className='mt-2'>
              <label className='text-sm font-medium text-gray-600' htmlFor='username'>Username</label>
              <div className='relative mt-1'>
                <div className='absolute inset-y-0 flex pl-3 items-center'>
                  <AtSign className='text-gray-400 h-5 w-5' />
                </div>
                <input {...register("username", { required: true, onChange: usernameValidation })} placeholder='Create a username' type='text' className='pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:shadow-md focus:outline-none focus:border-orange-500' />
              </div>
              {!isUsernameValid && <span className='text-sm pl-1 text-red-500'>Username already exists</span>}
            </div>
            <div className='mt-2'>
              <label className='text-sm font-medium text-gray-600' htmlFor='name'>Name</label>
              <div className='relative mt-1'>
                <div className='absolute flex items-center inset-y-0 pl-3'>
                  <CircleUserRound className='h-5 w-5 text-gray-400' />
                </div>
                <input {...register("name", { required: true })} placeholder='Enter your name' type='text' className='pl-10 w-full py-2 rounded-lg pr-4 border border-gray-300 focus:outline-none focus:shadow-md focus:border-orange-500' />
              </div>
            </div>
            <div className='mt-2'>
              <label className='text-sm font-medium text-gray-600' htmlFor='password'>Password</label>
              <div className='relative mt-1'>
                <div className='absolute flex items-center pl-3 inset-y-0'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input {...register("password", { required: true, minLength: 8 })} placeholder='Create a password' type={showPassword ? "text" : "password"} className='py-2 w-full rounded-lg border border-gray-300 pl-10 pr-4 focus:outline-none focus:shadow-md focus:border-orange-500' />
                <button type='button' onClick={() => setShowPassword(prev => !prev)} className='absolute right-0 pr-4 flex items-center inset-y-0'>
                  {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
                </button>
              </div>
              {errors.password && <span className='text-sm text-gray-700 pl-1'>Minimum 8 characters required</span>}
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type='submit' className='w-full py-3 rounded bg-orange-600 mt-6 text-white'>Submit</motion.button>
        </form>
        <div className='text-center text-sm mt-6 py-2'>
          <span>Already have an account?</span>
          <Link href="/login" className='font-semibold text-red-500 ml-1'>Login</Link>
        </div>
      </motion.div>
      <Toaster position='bottom-center' reverseOrder={false} />
    </div>
  )
}

