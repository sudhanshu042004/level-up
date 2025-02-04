import React, { useContext } from 'react';
import * as dialog from '@/components/ui/dialog';
import { difficulty, Track } from '@/types/Tracks';
import { ChevronDown, ChevronUp, Globe, GlobeLock, Sparkles, Star, Trophy } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getDifficultyColor } from '@/lib/DifficultyColor';
import { Checkbox } from './ui/checkbox';
import toast, { Toaster } from 'react-hot-toast';
import { UpdateSkill } from '@/lib/actions/skills/UpdateSkill';
import { UserContext } from '@/context/UserContext';
import { TracksContext as TracksContext } from '@/context/UserTracks';
import { rank } from '@/types/userstype';
import { ProgressToast, RankIncreaseToast } from './IncreaseRank';
import { AnimatePresence, motion } from 'motion/react';

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
      console.log("Closing dialog due to track completion:", data.trackId);
      onOpenChange(false);
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
        rank: rank ?? prev.rank,
      };
    });

    TrackContextData?.setTracks((prev) => {
      if (!prev) return [];

      return prev.map((t) => {
        if (t.trackId === trackId) {
          const updatedSkills = t.skills.map((s) =>
            s.skillId === skillId ? { ...s, completed: true } : s
          );

          const allSkillsCompleted = updatedSkills.every((s) => s.completed);

          return { ...t, skills: updatedSkills, completed: allSkillsCompleted };
        }
        return t;
      });
    });

  };

  function handleCheckbox(skillId: number, skillDifficulty: difficulty, trackId: number, dueDate: null | string) {
    toast.promise(UpdateSkill(skillId, skillDifficulty, trackId, dueDate), {
      loading: "Updating progress...",
      success: (data: UpdatingResponse) => {
        console.log("UpdateSkill response:", data);
        handleSkillComplete(data, skillId, trackId);
        return "Skill completed";
      },
      error: 'Something went wrong'
    });
  }
  return (
    <>
      <Toaster />
      <dialog.Dialog open={open} onOpenChange={onOpenChange}>
        <dialog.DialogTrigger>
          <span className="hidden"></span>
        </dialog.DialogTrigger>
        <dialog.DialogContent className="max-w-3xl w-full mx-auto bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <dialog.DialogHeader className="space-y-6 p-6 border-b border-orange-100">
              <dialog.DialogTitle>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <motion.h3
                      className="text-2xl font-bold text-orange-900 leading-tight"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {track.trackName}
                    </motion.h3>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {track.visibility ? (
                        <Globe className="h-5 w-5 text-orange-400 hover:text-orange-600 transition-colors" />
                      ) : (
                        <GlobeLock className="h-5 w-5 text-orange-400 hover:text-orange-600 transition-colors" />
                      )}
                    </motion.div>
                  </div>
                  <Badge
                    className={`${getDifficultyColor(track.difficulty as difficulty)} text-sm px-4 py-1.5 self-start sm:self-center`}
                    variant="secondary"
                  >
                    {track.difficulty}
                  </Badge>
                </div>
              </dialog.DialogTitle>
              <dialog.DialogDescription className="text-orange-700 text-xs lg:text-lg">
                Master the essential skills in this learning track
              </dialog.DialogDescription>
            </dialog.DialogHeader>

            <div className="px-6 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
              <motion.div
                className="space-y-4 py-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {track.skills.map((skill) => (
                  !skill.completed && (
                    <motion.div
                      key={skill.skillId}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <Card className="group hover:shadow-lg transition-all cursor-pointer duration-300 hover:-translate-y-0.5 border-2 border-orange-100 bg-white">
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <motion.div whileTap={{ scale: 0.9 }}>
                                <Checkbox
                                  className="h-5 w-5 flex-shrink-0"
                                  onCheckedChange={(e) => handleCheckbox(skill.skillId, skill.difficulty, track.trackId as number, track.dueDate)}
                                />
                              </motion.div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="font-semibold text-orange-900 truncate">
                                  {skill.skillName}
                                </div>
                                {!expandedSkills.has(skill.skillId) && skill.subSkills.length > 0 && (
                                  <div className="text-sm text-orange-600">
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
                                <motion.button
                                  onClick={() => toggleSkill(skill.skillId)}
                                  className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {expandedSkills.has(skill.skillId) ? (
                                    <ChevronUp className="h-5 w-5 text-orange-500" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-orange-500" />
                                  )}
                                </motion.button>
                              )}
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedSkills.has(skill.skillId) && skill.subSkills.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 ml-9 space-y-3 border-l-2 border-orange-100"
                              >
                                {skill.subSkills.map((subSkill, j) => (
                                  <motion.div
                                    key={j}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: j * 0.1 }}
                                    className="flex items-center gap-4 pl-4 py-2 -ml-px border-l-2 border-transparent hover:border-orange-300 transition-colors"
                                  >
                                    <span className="text-sm text-orange-700">{subSkill}</span>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </Card>
                    </motion.div>
                  )
                ))}
              </motion.div>
            </div>

            <dialog.DialogFooter className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-100">
              <dialog.DialogClose className="w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2.5 text-sm font-medium text-orange-700 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-200"
                >
                  Close
                </motion.div>
              </dialog.DialogClose>
            </dialog.DialogFooter>
          </motion.div>
        </dialog.DialogContent>
      </dialog.Dialog>
    </>
  );
};
export default TrackDialog

