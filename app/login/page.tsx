"use client"
import { authenticateAccount } from '@/lib/actions/auth/login';
import { userLogin } from '@/types/userstype';
import { CircleUserRound, Eye, EyeOff, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Bubble = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{
      y: [0, -100],
      opacity: [0, 0.7, 0]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className="absolute rounded-full mix-blend-multiply filter blur-sm"
    style={{
      width: `${Math.random() * 50 + 20}px`,
      height: `${Math.random() * 50 + 20}px`,
      left: `${Math.random() * 100}%`,
      background: `rgba(${Math.random() * 255}, ${Math.random() * 100}, 0, 0.15)`
    }}
  />
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<userLogin>();
  const route = useRouter();

  const onSubmit: SubmitHandler<userLogin> = (data) => {
    toast.promise(authenticateAccount(data),
      {
        loading: "Preparing your adventure...",
        success: (data: string) => { `${data}` + route.push('/home') },
        error: (err: string) => `${err}`
      });
  };

  return (
    <div className='relative min-h-screen flex justify-center items-center bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 overflow-hidden'>
      {/* Animated Bubbles */}
      {[...Array(15)].map((_, i) => (
        <Bubble key={i} delay={i * 0.3} />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='relative shadow-lg max-w-md rounded-lg p-8 w-full bg-white/95 backdrop-blur-sm'
      >
        <div className='text-center'>
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className='font-bold text-2xl text-orange-600 mt-6'
          >
            Welcome Back
          </motion.h2>
          <p className="text-sm text-gray-600 mt-2">Continue your learning journey!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className='mt-4'>
              <label htmlFor='identifier' className='text-sm font-medium text-gray-600'>Email or Username</label>
              <div className='mt-1 relative group'>
                <div className='absolute inset-y-0 flex items-center pl-3 left-0'>
                  <CircleUserRound className='h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors' />
                </div>
                <input
                  {...register("identifier", { required: true })}
                  type='text'
                  className='appearance-none block w-full rounded-lg pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all'
                  placeholder='Enter your username or email'
                />
              </div>
            </div>

            <div className='mt-4'>
              <label htmlFor='password' className='text-sm text-gray-600 font-medium'>Password</label>
              <div className='mt-1 relative group'>
                <div className='absolute inset-y-0 flex items-center pl-3'>
                  <Lock className='h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { required: true, minLength: 8 })}
                  className='pl-10 pr-12 py-2 w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all'
                  placeholder='Enter your password'
                />
                <button
                  type='button'
                  className='absolute right-0 pr-4 inset-y-0 hover:text-orange-500 transition-colors'
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ?
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors' /> :
                    <Eye className='h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors' />
                  }
                </button>
              </div>
              {errors.password && <span className='pl-1 text-sm text-red-500'>Minimum length 8 characters</span>}
            </div>
          </div>

          <div className='my-6 flex items-center'>
            <motion.input
              whileTap={{ scale: 0.9 }}
              type='checkbox'
              {...register("rememberMe")}
              className='h-4 w-4 text-orange-600 accent-orange-600 rounded'
            />
            <label htmlFor='remember-me' className='px-2 text-gray-600'>Remember me</label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type='submit'
            className='w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg py-3 px-4 font-medium shadow-lg hover:shadow-xl transition-all duration-200'
          >
            Login to Continue
          </motion.button>
        </form>

        <div className='text-sm text-center mt-6 py-2'>
          <span className="text-gray-600">Don't have an account?</span>
          <motion.span whileHover={{ scale: 1.05 }}>
            <Link href="/signup" className='font-semibold text-red-500 ml-1 hover:text-red-600 transition-colors'>
              Start your journey
            </Link>
          </motion.span>
        </div>
      </motion.div>
      <Toaster position='bottom-center' reverseOrder={false} />
    </div>
  );
};

export default Login;
