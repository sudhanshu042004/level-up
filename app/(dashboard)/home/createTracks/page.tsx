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
    <div className='min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='w-full max-w-lg bg-white rounded-xl shadow-md ring-1 ring-gray-200 relative'>
        {/* Back Button */}
        <div className='absolute top-4 left-4 z-10'>
          <Link
            href='/home'
            className='flex items-center justify-center w-8 h-8 rounded-full ring-1 ring-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white'
          >
            <ArrowLeft className='w-4 h-4' />
          </Link>
        </div>

        {/* Main Content Container */}
        <div className='p-4 sm:p-6 space-y-6'>
          {/* Track Name Section */}
          <div className='mt-12 sm:mt-16'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Track Name</label>
            <DynamicInput
              name={trackName}
              setName={setTrackName}
              TextSize='text-xl sm:text-2xl md:text-3xl'
            />
          </div>

          {/* Skills List */}
          <div className='space-y-3'>
            {skills.length > 0 && (
              <div className='space-y-2'>
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    className='relative bg-white rounded-lg ring-1 ring-gray-200 p-4 hover:shadow-sm transition-shadow'
                  >
                    {/* Delete Button */}
                    <button
                      className={`absolute top-2 right-2 p-1.5 rounded-full bg-red-100 hover:bg-red-200 transition-colors ${isHover ? 'opacity-100' : 'opacity-0'
                        }`}
                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                    >
                      <X className='w-3 h-3' />
                    </button>

                    {/* Skill Header */}
                    <div className='flex items-center justify-between pr-8'>
                      <div>
                        <h3 className='text-base font-medium'>{skill.skillName}</h3>
                        <p className='text-xs text-gray-500'>{skill.difficulty}</p>
                      </div>

                      {skill.subSkills.length > 0 && (
                        <button
                          onClick={() => toggleExpand(i)}
                          className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                        >
                          {expandedIndex === i ? (
                            <ChevronUp className='w-4 h-4' />
                          ) : (
                            <ChevronDown className='w-4 h-4' />
                          )}
                        </button>
                      )}
                    </div>

                    {/* SubSkills */}
                    {expandedIndex === i && (
                      <div className='mt-3 pl-4 space-y-1.5'>
                        {skill.subSkills.map((subSkill, subIndex) => (
                          <p key={subIndex} className='text-sm text-gray-600'>
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>Add skills</label>
            <AddSkill setSkills={setSkills} />
          </div>

          {/* Visibility Toggle */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Public or private
            </label>
            <div className='flex space-x-3'>
              <button
                onClick={() => setIspublic(true)}
                className={cn(
                  'p-2.5 rounded-full transition-all',
                  isPublic ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'
                )}
              >
                <Globe className='w-5 h-5' />
              </button>
              <button
                onClick={() => setIspublic(false)}
                className={cn(
                  'p-2.5 rounded-full transition-all',
                  !isPublic ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'
                )}
              >
                <GlobeLock className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select due date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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

          {/* Submit Button */}
          <div className='pt-4'>
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto float-right bg-black text-white hover:bg-gray-800"
            >
              Create Track
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default CreateTracks
