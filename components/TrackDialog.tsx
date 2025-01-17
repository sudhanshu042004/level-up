import React from 'react'
import * as dialog from '@/components/ui/dialog'
import { Track } from '@/types/Tracks';
import { ChevronDown, ChevronUp, Globe, GlobeLock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getDifficultyColor } from '@/lib/DifficultyColor';

interface TrackDialogProps {
  open: boolean,
  setOpen: (isOpen: boolean) => void;
  track: Track
}

const TrackDialog: React.FC<TrackDialogProps> = ({ open, setOpen, track }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  return (
    <dialog.Dialog open={open} onOpenChange={setOpen} >
      <dialog.DialogTrigger>
        <span className='hidden' ></span>
      </dialog.DialogTrigger>
      {/* content */}
      <dialog.DialogContent>
        {/* header */}
        <dialog.DialogHeader>
          <dialog.DialogTitle>
            <div className='flex items-center gap-3' >
              <h3 className="text-xl font-semibold text-gray-900">
                {track.trackName}
              </h3>
              {track.visibility ? (
                <Globe className="h-5 w-5 text-gray-400" />
              ) : (
                <GlobeLock className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </dialog.DialogTitle>
          <dialog.DialogDescription>
            {track.difficulty}
          </dialog.DialogDescription>
        </dialog.DialogHeader>
        <div>
          {track.skills.map((skill, i) => (
            <Card className={`mt-2 relative hover:shadow-xl flex hover:-translate-y-1 transition-all duration-300 `}
              key={i}
              onClick={() => setIsExpanded(prev => !prev)}
            >

              <div className='p-6' >
                <div className='flex font-medium items-center' >
                  {skill.skillName}
                </div>
                <Badge
                  className={`${getDifficultyColor(skill.difficulty)}  `}
                  variant={"secondary"}
                >
                  {skill.difficulty}
                </Badge>
              </div>
              <div className='absolute right-2 inset-y-3' >
                {skill.subSkills.length > 0 &&
                  <div>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </div>
                }
              </div>
            </Card>
          ))}
        </div>
        {/* footer */}
        <dialog.DialogFooter>
          <dialog.DialogClose>
            {/* <Button type='button' variant={"secondary"} > */}
            {/*   close */}
            {/* </Button> */}
          </dialog.DialogClose>
        </dialog.DialogFooter>
      </dialog.DialogContent>
    </dialog.Dialog >
  )
}

export default TrackDialog
