"use client";
import AddSkill from '@/components/AddSkill';
import DynamicInput from '@/components/DynamicInput';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SkillType, TrackHead } from '@/types/Tracks';
import { ArrowLeft, ChevronDown, ChevronUp, Globe, GlobeLock, X } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Calendar } from '@/components/ui/calendar';
import { createTrack } from '@/lib/actions/tracks/CreateTracks';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const createTracks = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [trackName, setTrackName] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [isPublic, setIspublic] = useState<boolean>(true);
  const router = useRouter();

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

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
    console.log(skills.length);
    toast.promise(createTrack(track), {
      loading: 'creating....',
      success: (data: string) => { router.push('/home'); return 'created successfully' },
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
    <div className='flex justify-center items-center h-screen w-full  ' >
      <div className='shadow-md p-6 relative rounded-lg ring-gray-200 ring-1 max-w-xl bg-w w-full ' >
        <Link
          href='/home'
          className='rounded-full m-2 absolute ring-gray-200 ring-1 shadow-md p-2 hover:shadow-lg z-10 left-0 top-0 cursor-pointer '
        >
          <ArrowLeft className='h-5 w-5' />
        </Link>
        <div className='mt-24 mb-6' >

          <div className='text-sm font-medium mb-2 ' >Track Name</div>
          <DynamicInput name={trackName} setName={setTrackName} TextSize='text-3xl' />

          {/* show skills */}
          <div >
            {skills.length > 0 && (
              <div className="py-4 px-4 rounded-lg mt-4" >
                {skills.map((skill, i) => (
                  <div
                    className="flex flex-col relative rounded-lg ring-gray-200 ring-1 py-4 px-4 m-2 hover:shadow-md transition-all duration-300 "
                    key={i}>
                    <div
                      className={`p-2 right-0 absolute top-5 ${isHover ? 'opacity-100' : 'opacity-0'} bg-red-300 rounded-full m-2 `}
                    >
                      <X className='h-3 w-3 ' />
                    </div>
                    <div
                      className="flex justify-between my-3 items-center"
                    >
                      <div className='pl-6' >
                        <div className='text-xl font-medium' >{skill.skillName}</div>
                        <div className='text-xs font-medium text-gray-500' >{skill.difficulty}</div>
                      </div>

                      {/* SubSkills dropdown */}
                      {skill.subSkills.length > 0 && (
                        <button
                          onClick={() => toggleExpand(i)}
                          className="flex items-center pr-8 focus:outline-none"
                        >
                          {expandedIndex === i ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      )}
                    </div>

                    {/* Show subSkills if expanded */}
                    {expandedIndex === i && (
                      <div className="ml-6 transition-transform duration-300 mt-2">
                        {skill.subSkills.map((subSkill, subIndex) => (
                          <div key={subIndex} className="text-sm text-gray-600">
                            {subSkill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* dialog for add skills */}
          <div className='my-4' >
            <div className='font-medium text-sm mb-2' >Add skills</div>
            <AddSkill setSkills={setSkills} />
          </div>
        </div>

        <div>
          {/* private or public  */}
          <div className='font-medium text-sm mb-2' >public or private</div>
          <div className='flex mt-2 mb-4' >
            <div
              className={`p-2 mx-2 ${isPublic ? 'shadow-lg' : ''} cursor-pointer rounded-full hover:bg-gray-200 transition-colors duration-300`}
              onClick={() => setIspublic(true)}
            >
              <Globe />
            </div>
            <div
              className={`p-2 mx-2 ${isPublic ? '' : 'shadow-lg'} cursor-pointer rounded-full hover:bg-gray-200 transition-colors duration-300`}
              onClick={() => setIspublic(false)}
            >
              <GlobeLock />
            </div>
          </div>

          {/* date */}
          <div className='font-medium text-sm mb-2' >select due date</div>
          <div>
            <Popover>
              <PopoverTrigger>
                <Button
                  id='Date'
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd,y")} - {" "}
                        {format(date.to, "LLL dd,y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd,y")
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
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className='absolute right-5 ring-gray-500 ring-1 p-2 rounded cursor-pointer hover:bg-black hover:text-white transition-colors duration-300 text-sm mb-2 font-medium bottom-5' >
          <button onClick={handleSubmit} >create</button>
        </div>

      </div>
      <Toaster />
    </div >
  )
}


export default createTracks
