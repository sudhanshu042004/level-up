"use client";
import AddSkill from '@/components/AddSkill';
import DynamicInput from '@/components/DynamicInput';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CreatingSkill, Track, TrackHead } from '@/types/Tracks';
import { ArrowLeft, ChevronDown, ChevronUp, Globe, GlobeLock, X } from 'lucide-react'
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Calendar } from '@/components/ui/calendar';
import { createTrack } from '@/lib/actions/tracks/CreateTracks';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { TracksContext as TracksContext } from '@/context/UserTracks';

const CreateTracks = () => {
  const [skills, setSkills] = useState<CreatingSkill[]>([]);
  const [trackName, setTrackName] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [isPublic, setIspublic] = useState<boolean>(true);

  const router = useRouter();
  const trackData = useContext(TracksContext);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  function handleSuccess(track: Track) {
    trackData?.setTracks((prev) => prev ? [...prev, track] : [track]);
    router.push("/home")
    return 'created successfully'
  }

  const handleSubmit = () => {
    if (!trackName || skills.length == 0) {
      toast.error('At least one skill required');
      return 1;
    }

    const track: TrackHead = {
      trackName: trackName,
      visibility: isPublic,
      skills: skills,
      dueDate: date
    }

    toast.promise(createTrack(track), {
      loading: 'creating....',
      success: (data: Track) => handleSuccess(data),
      error: 'Something went wrong!'
    }, {
      success: {
        duration: 5000,
        icon: '🔥',
      },
      error: {
        duration: 5000,
      }
    })
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8 '>
      <div className='w-full max-w-lg bg-white rounded-lg sm:rounded-xl shadow-md ring-1 ring-gray-200 relative flex flex-col max-h-[80vh] '>
        {/* Back Button */}
        <div className='absolute top-3 left-3 sm:top-4 sm:left-4 z-10'>
          <Link
            href='/home'
            className='flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-1 ring-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white'
          >
            <ArrowLeft className='w-3.5 h-3.5 sm:h-4 sm:w-4' />
          </Link>
        </div>

        {/* Main Content Container */}
        <div className='flex-1 overflow-y-auto' >
          <div className='p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6'>
            {/* Track Name Section */}
            <div className='mt-10 sm:mt-12 md:mt-16'>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>Track Name</label>
              <DynamicInput
                name={trackName}
                setName={setTrackName}
                TextSize='text-lg  sm:text-xl md:text-2xl lg:text-3xl'
              />
            </div>

            {/* Skills List */}
            <div className='space-y-2 sm:space-y-3'>
              {skills.length > 0 && (
                <div className='space-y-1.5 sm:space-y-2'>
                  {skills.map((skill, i) => (
                    <div
                      key={i}
                      className='relative bg-white rounded-lg ring-1 ring-gray-200 p-3 sm:p-4 hover:shadow-sm transition-all duration-300'
                    >
                      {/* Delete Button */}
                      <button
                        className={`absolute top-2 right-2 sm:p-1.5 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 ${isHover ? 'opacity-100' : 'opacity-0'
                          }`}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                      >
                        <X className='w-2.5 h-2.5 sm:w-3 sm:h-3 ' />
                      </button>

                      {/* Skill Header */}
                      <div className='flex items-center justify-between pr-6 sm:pr-8'>
                        <div>
                          <h3 className='text-sm sm:text-base font-medium'>{skill.skillName}</h3>
                          <p className='text-xs text-gray-500'>{skill.difficulty}</p>
                        </div>

                        {skill.subSkills.length > 0 && (
                          <button
                            onClick={() => toggleExpand(i)}
                            className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                          >
                            {expandedIndex === i ? (
                              <ChevronUp className='sm:w-4 sm:h-4 w-3.5 h-3.5 ' />
                            ) : (
                              <ChevronDown className='sm:w-4 sm:h-4 h-3.5 w-3.5 ' />
                            )}
                          </button>
                        )}
                      </div>

                      {/* SubSkills */}
                      {expandedIndex === i && (
                        <div className='mt-2 sm:mt-3 pl-4 space-y-1 sm:space-y-1.5 transition-opacity duration-300'>
                          {skill.subSkills.map((subSkill, subIndex) => (
                            <p key={subIndex} className='text-xs sm:text-sm text-gray-600'>
                              {subSkill}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Skills Section */}
            <div>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>Add skills</label>
              <AddSkill setSkills={setSkills} />
            </div>

            {/* Visibility Toggle */}
            <div>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3'>
                Public or private
              </label>
              <div className='flex space-x-2 sm:space-x-3'>
                <button
                  onClick={() => setIspublic(true)}
                  className={cn(
                    'p-2 sm:p-2.5 rounded-full transition-all',
                    isPublic ? 'bg-gray-200 shadow-sm' : 'hover:bg-gray-50'
                  )}
                >
                  <Globe className='sm:w-5 w-4 h-4 sm:h-5' />
                </button>
                <button
                  onClick={() => setIspublic(false)}
                  className={cn(
                    ' p-2 sm:p-2.5 rounded-full transition-all',
                    !isPublic ? 'bg-gray-200 shadow-sm' : 'hover:bg-gray-50'
                  )}
                >
                  <GlobeLock className='w-4 h-4 sm:h-5 sm:w-5' />
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                Select due date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-xs sm:text-sm ",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='h-16 sm:h-20' ></div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='sticky bottom-0 left-0 right-0 bg-white  border-gray-100 p-3 sm:p-4 mt-auto z-50 ' >
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto float-right bg-black text-white hover:bg-gray-800 text-sm"
          >
            Create Track
          </Button>
        </div>
      </div>
      <Toaster />
    </div >
  )
}

export default CreateTracks
