"use client";
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ExpProgress from '@/components/ExpProgress';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDifficultyColor } from '@/lib/DifficultyColor';
import { difficulty } from '@/types/Tracks';
import { Globe, Users, Trophy, Sparkles } from 'lucide-react';
import CommunityDialog from '@/components/CommunityDialog';
import PublicTrack from '@/lib/actions/tracks/PublicTracks';
import { TracksContext } from '@/context/UserTracks';
import LoadingBall from '@/components/LoadingBall';

interface Track {
  trackId: number;
  trackName: string;
  difficulty: difficulty;
  dueDate: number | null;
  skills: {
    skillId: number;
    skillName: string;
    skillDifficulty: difficulty;
    subSkillName: string[];
  }[];
}

interface PublicTrackType {
  userId: number;
  username: string;
  avatar: string;
  level: number | null;
  exp: number | null;
  track: Track;
}
const expRequired = (level: number) => level * 200;

const calculateExpPercentage = (current: number, max: number) =>
  ((current / max) * 100).toFixed(1);

const CommunityGrid = () => {
  const [click, setClick] = useState(false);
  const [track, setTrack] = useState<Track>();
  const [communityPost, setCommunityPost] = useState<PublicTrackType[]>();
  const [isAlreadyHave, setIsAlreadyHave] = useState<boolean>(false);
  const trackContext = useContext(TracksContext);

  useEffect(() => {
    async function getData() {
      const result = await PublicTrack();
      setCommunityPost(result as PublicTrackType[]);
    }
    getData();
  }, []);

  if (!communityPost || !trackContext?.tracks) {
    return <LoadingBall text={"Loading Tracks..."} />;
  }

  function handleClick(track: Track) {
    const existingTrack = trackContext?.tracks.filter(inTrack =>
      inTrack.trackId === track.trackId
    );
    setIsAlreadyHave(existingTrack?.length! > 0);
    setTrack(track);
    setClick(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container lg:pl-20 sm:pl-20 mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
    >
      {track && (
        <CommunityDialog
          track={track}
          open={click}
          setOpen={setClick}
          isAlreadyHave={isAlreadyHave}
        />
      )}

      <motion.div
        className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Community Tracks</h2>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 self-start sm:self-auto">
          {communityPost.length} Active Users
        </Badge>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {communityPost.map((post, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-100">
              <CardHeader className="space-y-3 sm:space-y-4 bg-gradient-to-r from-orange-50 to-red-50 p-4 sm:p-6">
                <CardTitle>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="relative h-14 w-14">
                        <ExpProgress
                          className=''
                          size={56}
                          currentExp={post.exp as number}
                          maxExp={expRequired(post.level as number)}
                        />
                        <motion.div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          // whileHover={{ rotate: 360 }}
                          transition={{ duration: 1 }}
                        >
                          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                            <AvatarImage src={post.avatar} alt={post.username} />
                          </Avatar>
                        </motion.div>
                      </div>
                    </motion.div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 truncate">{post.username}</span>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs sm:text-sm">
                            Level {post.level}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                        <span className="truncate">
                          {post.exp?.toLocaleString()} / {expRequired(post.level as number).toLocaleString()} EXP
                          ({calculateExpPercentage(post.exp as number, expRequired(post.level as number))}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent
                className="cursor-pointer bg-white p-4 sm:p-6 transition-all duration-200 hover:bg-orange-50"
                onClick={() => handleClick(post.track)}
              >
                <motion.div
                  className="space-y-3 sm:space-y-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                        {post.track.trackName}
                      </h3>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0"
                      >
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 transition-colors group-hover:text-orange-500" />
                      </motion.div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getDifficultyColor(post.track.difficulty as difficulty)} px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm flex-shrink-0`}
                    >
                      {post.track.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex-shrink-0"
                    >
                      <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                    </motion.div>
                    {post.track.skills.length} skills included
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CommunityGrid;
