"use client";
import { createAccount, isUsernameExists } from '@/lib/actions/auth/signup';
import { userSignup } from '@/types/userstype';
import { AtSign, CircleUserRound, Eye, EyeOff, Lock, Mail, Sparkles, Star, Trophy } from 'lucide-react'
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

  const floatingItems = Array(3).fill(0);
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-400 via-orange-300 to-yellow-200">
      {/* Floating Background Elements */}
      {/* {floatingItems.map((_, index) => ( */}
      {/*   <motion.div */}
      {/*     key={index} */}
      {/*     className="absolute" */}
      {/*     initial={{ y: Math.random() * 100, x: Math.random() * 100 }} */}
      {/*     animate={{ */}
      {/*       y: [Math.random() * -100, Math.random() * 100], */}
      {/*       x: [Math.random() * -100, Math.random() * 100], */}
      {/*     }} */}
      {/*     transition={{ */}
      {/*       duration: 20, */}
      {/*       repeat: Infinity, */}
      {/*       repeatType: "reverse", */}
      {/*       delay: index * 2 */}
      {/*     }} */}
      {/*   > */}
      {/*     <div className="w-32 h-32 rounded-full bg-white opacity-10" /> */}
      {/*   </motion.div> */}
      {/* ))} */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 m-4 bg-white bg-opacity-95 rounded-2xl shadow-2xl relative"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-4"
          >
            <Trophy className="w-16 h-16 text-orange-500" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Begin Your Journey
          </h2>
          <p className="text-gray-600 mt-2">Level up your learning experience!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="group"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-500" />
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              placeholder="wizard@hogwarts.edu"
            />
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="group"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-500" />
              Enter your name
            </label>
            <input
              {...register("name", { required: true })}
              className="mt-1 w-full px-4 py-3 rounded-lg border focus:outline-none border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              placeholder="BrainWarrior99"
            />
          </motion.div>
          {/* Username Field */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="group"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-500" />
              Choose Your Username
            </label>
            <input
              {...register("username", { required: true, onChange: usernameValidation })}
              className="mt-1 w-full px-4 py-3 rounded-lg border focus:outline-none border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              placeholder="BrainWarrior99"
            />
            {!isUsernameValid && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                This hero name is already taken!
              </motion.span>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="group"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              Secret Password
            </label>
            <div className="relative">
              <input
                {...register("password", { required: true, minLength: 8 })}
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full px-4 py-3 rounded-lg focus:outline-none border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Your Adventure
          </motion.button>
        </form>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600">
            Already a hero?{' '}
            <Link href="/login" className="text-red-500 hover:text-red-600 font-semibold">
              Return to base
            </Link>
          </p>
        </motion.div>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  );
}

