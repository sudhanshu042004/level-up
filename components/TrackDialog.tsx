import React, { useContext } from 'react';
import * as dialog from '@/components/ui/dialog';
import { difficulty, Track } from '@/types/Tracks';
import { ChevronDown, ChevronUp, Globe, GlobeLock, Star, Trophy } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getDifficultyColor } from '@/lib/DifficultyColor';
import { Checkbox } from './ui/checkbox';
import toast, { Toaster } from 'react-hot-toast';
import { UpdateSkill } from '@/lib/actions/skills/UpdateSkill';
import { UserContext } from '@/context/UserContext';
import { Progress } from "rsuite"
import { TracksContext as TracksContext } from '@/context/UserTracks';
import { rank } from '@/types/userstype';
import RankIncreaseToast from './IncreaseRank';

interface TrackDialogProps {
  track: Track;
  open: boolean;
  setTrack: React.Dispatch<React.SetStateAction<Track | undefined>>
  onOpenChange: (open: boolean) => void;
}
interface UpdatingResponse {
  level: number,
  exp: number,
  trackId: number | null,
  rank: rank | null
}

const TrackDialog: React.FC<TrackDialogProps> = ({ open, onOpenChange, track, setTrack }) => {
  const [expandedSkills, setExpandedSkills] = React.useState<Set<number>>(new Set());
  const UserContextData = useContext(UserContext);
  const TrackContextData = useContext(TracksContext);

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

  const handleSkillComplete = (data: UpdatingResponse, skillId: number, trackId: number) => {
    setTrack((prev) => {
      if (!prev) return undefined;

      return {
        ...prev,
        skills: prev.skills.map(skill =>
          skill.skillId === skillId ? { ...skill, completed: true } : skill
        ),
        trackId: prev.trackId ?? null,
      };
    });

    const { level, exp, rank } = data;
    const currentLevel = UserContextData?.user.level ?? 0;
    const currentExp = UserContextData?.user.exp ?? 0;
    const currentRank = UserContextData?.user.rank

    if (data.trackId !== null) {
      onOpenChange(false)
    }

    if (level > currentLevel || exp > currentExp || rank != currentRank) {
      toast.custom(() => (
        <ProgressToast
          oldLevel={currentLevel}
          newLevel={level}
          oldExp={currentExp}
          newExp={exp}
          currentRank={currentRank as rank}
          newRank={rank as rank}
        />
      ), {
        duration: 4000,
        position: 'bottom-right',
      });
    }
    let newRank: rank;
    if (rank != null) {
      newRank = rank
    }

    UserContextData?.setUser((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        level: level,
        exp: exp,
        username: prev.username,
        rank: newRank
      };
    });

    TrackContextData?.setTracks((prev) => {
      return prev?.filter(prev => prev.trackId !== trackId)
    })
    console.log(TrackContextData?.tracks);

  };

  function handleCheckbox(skillId: number, skillDifficulty: difficulty, trackId: number, dueDate: null | string) {
    toast.promise(UpdateSkill(skillId, skillDifficulty, trackId, dueDate), {
      loading: "updating progress....",
      success: (data: UpdatingResponse) => { handleSkillComplete(data, skillId, trackId); return "Skill completed" },
      error: 'something went Wrong'
    })
  }
  return (
    <>
      <Toaster />
      <dialog.Dialog open={open} onOpenChange={onOpenChange}>
        <dialog.DialogTrigger>
          <span className="hidden"></span>
        </dialog.DialogTrigger>
        <dialog.DialogContent className="max-w-3xl w-full mx-auto">
          <dialog.DialogHeader className="space-y-6 p-6">
            <dialog.DialogTitle>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {track.trackName}
                  </h3>
                  {track.visibility ? (
                    <Globe className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <GlobeLock className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </div>
                <Badge
                  className={`${getDifficultyColor(track.difficulty as difficulty)} text-sm px-4 py-1.5 self-start sm:self-center`}
                  variant="secondary"
                >
                  {track.difficulty}
                </Badge>
              </div>
            </dialog.DialogTitle>
            <dialog.DialogDescription className="text-gray-600 text-xs lg:text-lg">
              Master the essential skills in this learning track
            </dialog.DialogDescription>
          </dialog.DialogHeader>

          <div className="px-6 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className="space-y-4 pb-6">
              {track.skills.map((skill) => (
                !skill.completed && (
                  <Card
                    key={skill.skillId}
                    className="group hover:shadow-lg transition-all cursor-pointer duration-300 hover:-translate-y-0.5 border-2"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Checkbox
                            className="h-5 w-5 flex-shrink-0"
                            onCheckedChange={(e) => handleCheckbox(skill.skillId, skill.difficulty, track.trackId as number, track.dueDate)}
                          />
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {skill.skillName}
                            </div>
                            {!expandedSkills.has(skill.skillId) && skill.subSkills.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {skill.subSkills.length} sub-skills
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-9 sm:ml-0">
                          <Badge
                            className={`${getDifficultyColor(skill.difficulty)}`}
                            variant="secondary"
                          >
                            {skill.difficulty}
                          </Badge>
                          {skill.subSkills.length > 0 && (
                            <button
                              onClick={() => toggleSkill(skill.skillId)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              {expandedSkills.has(skill.skillId) ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {expandedSkills.has(skill.skillId) && skill.subSkills.length > 0 && (
                        <div className="mt-4 ml-9 space-y-3 border-l-2 border-gray-100">
                          {skill.subSkills.map((subSkill, j) => (
                            <div
                              key={j}
                              className="flex items-center gap-4 pl-4 py-2 -ml-px border-l-2 border-transparent hover:border-gray-300 transition-colors"
                            >
                              <span className="text-sm text-gray-600">{subSkill}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              ))}
            </div>
          </div>

          <dialog.DialogFooter className="p-6 bg-gray-50">
            <dialog.DialogClose className="w-full">
              <div className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                Close
              </div>
            </dialog.DialogClose>
          </dialog.DialogFooter>
        </dialog.DialogContent>
      </dialog.Dialog>
    </>
  );
};

export default TrackDialog;

const ProgressToast = ({ oldLevel, newLevel, oldExp, newExp, currentRank, newRank }: {
  oldLevel: number;
  newLevel: number;
  oldExp: number;
  newExp: number;
  currentRank: rank;
  newRank: rank;
}) => (
  <div className="flex flex-col sm:flex-row items-start gap-4 bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-md">
    {currentRank !== newRank && newRank !== null && (
      <RankIncreaseToast oldRank={currentRank} newRank={newRank} />
    )}
    <div className="flex items-start gap-4 w-full">
      <div className="flex-shrink-0">
        {newLevel > oldLevel ? (
          <div className="p-2.5 bg-yellow-100 rounded-full">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
        ) : (
          <div className="p-2.5 bg-blue-100 rounded-full">
            <Star className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="font-semibold text-gray-900">
          {newLevel > oldLevel ? 'Level Up!' : 'Experience Gained!'}
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          {newLevel > oldLevel && (
            <div className="flex items-center gap-2">
              <span>Level: {oldLevel} → {newLevel}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>EXP: +{newExp - oldExp}</span>
          </div>
          <div className="w-full">
            <Progress.Line percent={100} showInfo={false} status="active" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
