"use client";
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddSkill from '@/components/AddSkill';
import DynamicInput from '@/components/DynamicInput';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CreatingSkill, Track, TrackHead } from '@/types/Tracks';
import { ArrowLeft, ChevronDown, ChevronUp, Globe, GlobeLock, X } from 'lucide-react';
import Link from 'next/link';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from '@/components/ui/calendar';
import { createTrack } from '@/lib/actions/tracks/CreateTracks';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { TracksContext } from '@/context/UserTracks';

const CreateTracks = () => {
  const [skills, setSkills] = useState<CreatingSkill[]>([]);
  const [trackName, setTrackName] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const router = useRouter();
  const trackData = useContext(TracksContext);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  function handleSuccess(track: Track) {
    trackData?.setTracks((prev) => prev ? [...prev, track] : [track]);
    router.push("/home");
    return 'Track created successfully! 🎉';
  }

  const handleSubmit = () => {
    if (!trackName || skills.length === 0) {
      toast.error('Please add a track name and at least one skill');
      return;
    }

    const track: TrackHead = {
      trackName: trackName,
      visibility: isPublic,
      skills: skills,
      dueDate: date
    };

    toast.promise(createTrack(track), {
      loading: 'Creating your track...',
      success: (data: Track) => handleSuccess(data),
      error: 'Oops! Something went wrong'
    }, {
      success: {
        duration: 5000,
        icon: '🚀',
      },
      error: {
        duration: 5000,
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-lg bg-white rounded-lg sm:rounded-xl shadow-lg ring-1 ring-orange-200 relative flex flex-col max-h-[80vh]"
      >
        {/* Back Button */}
        <motion.div
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/home"
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-1 ring-orange-200 shadow-md hover:shadow-lg transition-all bg-white hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 sm:h-5 sm:w-5 text-orange-600" />
          </Link>
        </motion.div>

        {/* Main Content Container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
          <motion.div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8" variants={containerVariants}>
            {/* Track Name Section */}
            <motion.div variants={itemVariants} className="mt-16 sm:mt-20">
              <label className="block text-sm font-medium text-orange-700 mb-2">Track Name</label>
              <DynamicInput
                name={trackName}
                setName={setTrackName}
                TextSize="text-2xl sm:text-3xl md:text-4xl"
              />
            </motion.div>

            {/* Skills List */}
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="relative bg-white rounded-lg ring-1 ring-orange-200 p-4 sm:p-5 hover:shadow-md transition-all duration-300"
                  >
                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute top-2 right-2 p-2 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 ${isHover ? 'opacity-100' : 'opacity-0'
                        }`}
                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </motion.button>

                    {/* Skill Header */}
                    <div className="flex items-center justify-between pr-8">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-800">{skill.skillName}</h3>
                        <p className="text-sm text-orange-600">{skill.difficulty}</p>
                      </div>

                      {skill.subSkills.length > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleExpand(i)}
                          className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                        >
                          {expandedIndex === i ? (
                            <ChevronUp className="w-4 h-4 text-orange-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-orange-600" />
                          )}
                        </motion.button>
                      )}
                    </div>

                    {/* SubSkills */}
                    <AnimatePresence>
                      {expandedIndex === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pl-4 space-y-2"
                        >
                          {skill.subSkills.map((subSkill, subIndex) => (
                            <motion.p
                              key={subIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-sm text-gray-600"
                            >
                              • {subSkill}
                            </motion.p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Add Skills Section */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-orange-700 mb-2">Add skills</label>
              <AddSkill setSkills={setSkills} />
            </motion.div>

            {/* Visibility Toggle */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-orange-700 mb-3">
                Visibility
              </label>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPublic(true)}
                  className={cn(
                    'p-3 rounded-full transition-all',
                    isPublic
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-md'
                      : 'hover:bg-orange-100'
                  )}
                >
                  <Globe className={`w-5 h-5 ${isPublic ? 'text-white' : 'text-orange-600'}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPublic(false)}
                  className={cn(
                    'p-3 rounded-full transition-all',
                    !isPublic
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-md'
                      : 'hover:bg-orange-100'
                  )}
                >
                  <GlobeLock className={`w-5 h-5 ${!isPublic ? 'text-white' : 'text-orange-600'}`} />
                </motion.button>
              </div>
            </motion.div>

            {/* Date Picker */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Due date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-sm border-orange-200 hover:bg-orange-50",
                        !date && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                    className="rounded-lg border-orange-200"
                  />
                </PopoverContent>
              </Popover>
            </motion.div>

            <div className="h-20 sm:h-24" />
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          className="sticky bottom-0 left-0 right-0 bg-white border-t border-orange-100 p-4 sm:p-5 mt-auto z-50"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto float-right bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              Create Track
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      <Toaster />
    </div>
  );
};

export default CreateTracks;
