import React, { useContext, useEffect } from 'react';
import * as dialog from '@/components/ui/dialog';
import { difficulty } from '@/types/Tracks';
import { ChevronDown, ChevronUp, Globe, GlobeLock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getDifficultyColor } from '@/lib/DifficultyColor';
import AddTrack from '@/lib/actions/tracks/AddTrack';
import toast, { Toaster } from 'react-hot-toast';

interface TrackDialogProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  track: Track;
  isAlreadyHave: boolean
}
interface Track {
  trackId: number,
  trackName: string,
  difficulty: difficulty,
  dueDate: number | null,
  skills: {
    skillId: number,
    skillName: string,
    skillDifficulty: difficulty,
    subSkillName: string[],
  }[]

}


const CommunityDialog: React.FC<TrackDialogProps> = ({ open, setOpen, track, isAlreadyHave }) => {
  const [expandedSkills, setExpandedSkills] = React.useState<Set<number>>(new Set());


  const toggleSkill = (skillId: number) => {
    setExpandedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
  };


  function handleClick(trackId: number) {
    // toast.promise(AddTrack(trackId), {
    //   loading: "Adding...",
    //   success: "Added to track",
    //   error: "Failed to load"
    // })
    return;
  }


  return (
    <>
      <Toaster />
      <dialog.Dialog open={open} onOpenChange={setOpen}>
        <dialog.DialogTrigger>
          <span className="hidden"></span>
        </dialog.DialogTrigger>
        <dialog.DialogContent className="max-w-2xl">
          <dialog.DialogHeader className="space-y-4">
            <dialog.DialogTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {track.trackName}
                  </h3>
                  <Globe className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </div>
                <Badge
                  className={`${getDifficultyColor(track.difficulty as difficulty)} text-sm px-3 py-1`}
                  variant="secondary"
                >
                  {track.difficulty}
                </Badge>
              </div>
            </dialog.DialogTitle>
            <dialog.DialogDescription className="text-gray-600">
              Learn from tracks and gain exp
            </dialog.DialogDescription>
          </dialog.DialogHeader>

          <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {track.skills.map((skill, i) => (
              <Card
                key={i}
                className='group hover:shadow-lg hover:-translate-y-0.5'
              >
                <div className='p-4 sm:p-6' >
                  <div className='flex items-center justify-center gap-4' >
                    <div className='flex items-center gap-4 flex-1' >
                      <div className='space-y-1 flex-1' >
                        <div className='font-semibold text-gray-900' >
                          {skill.skillName}
                        </div>
                        {!expandedSkills.has(i) && skill.subSkillName.length > 0 && (
                          <div className='text-sm text-gray-500' >
                            {skill.subSkillName.length} sub-skills
                          </div>
                        )}
                      </div>
                      <Badge
                        variant='secondary'
                        className={`${getDifficultyColor(skill.skillDifficulty as difficulty)} ml-auto`}
                      >
                        {skill.skillDifficulty}
                      </Badge>
                    </div>
                    {skill.subSkillName.length > 0 && (
                      <button
                        onClick={() => toggleSkill(i)}
                        className='p-1 hover:bg-gray-100 rounded-full'
                      >
                        {expandedSkills.has(i) ? (
                          <ChevronUp className='h-5 w-5 text-gray-500' />
                        ) : (
                          <ChevronDown className='h-5 w-5 text-gray-500' />
                        )}
                      </button>
                    )}
                  </div>
                  {expandedSkills.has(i) && skill.subSkillName.length > 0 && (
                    <div className='mt-4 pl-9 space-y-3' >
                      {skill.subSkillName.map((subSkill, j) => (
                        <div
                          key={j}
                          className='flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 '
                        >
                          <span className='text-sm text-gray-600' >{subSkill}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <dialog.DialogFooter className="mt-6">
            <dialog.DialogClose className="w-full">
              <div
                className={`max-w-full px-4 py-2 text-sm font-medium  bg-gray-100 rounded-lg ${isAlreadyHave ? 'text-gray-400 cursor-default ' : 'text-gray-700 hover:bg-gray-200'} transition-colors duration-300 `}
                onClick={() => handleClick(track.trackId)}

              >
                {isAlreadyHave ? <>Already have</> : <>Add track</>}
              </div>
            </dialog.DialogClose>
          </dialog.DialogFooter>
        </dialog.DialogContent>
      </dialog.Dialog>
    </>
  );
};

export default CommunityDialog;

