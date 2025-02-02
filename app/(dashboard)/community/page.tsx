"use client";
import React, { useContext, useEffect, useState } from 'react';
import ExpProgress from '@/components/ExpProgress';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDifficultyColor } from '@/lib/DifficultyColor';
import { difficulty } from '@/types/Tracks';
import { Globe, Users } from 'lucide-react';
import CommunityDialog from '@/components/CommunityDialog';
import PublicTrack from '@/lib/actions/tracks/PublicTracks';
import { motion } from "motion/react";
import { TracksContext, UserTracks } from '@/context/UserTracks';

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

const CommunityGrid = () => {
  const [click, setClick] = useState(false);
  const [track, setTrack] = useState<Track>();
  const [communityPost, setCommunityPost] = useState<PublicTrackType[]>();
  const [isAlreadyHave, setIsAlreadyHave] = useState<boolean>(false);
  const trackContext = useContext(TracksContext);
  // console.log(communityPost);

  useEffect(() => {
    async function getData() {
      const result = await PublicTrack();
      setCommunityPost(result as PublicTrackType[]);
    }
    getData();
  }, []);


  if (!communityPost || !trackContext?.tracks) {
    return (
      <div className="flex h-screen w-full justify-center items-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="">
            <motion.div
              animate={{
                translateY: [0, -80, 0],
                scaleY: [1, 0.8, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: ["easeOut", "easeIn"],
              }}
            >
              <motion.div
                className="h-12 w-12 border-b-8 border-white border-t-2 rounded-full bg-black"
                animate={{
                  backgroundColor: [
                    "#C4CCD4",
                    "#D2E2ED",
                    "#FEC300",
                    "#FDC2CA",
                    "#FD6325",
                    "#FDC2CA",
                    "#FEC300",
                    "#D2E2ED",
                    "#C4CCD4",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
          <p className="text-gray-500 font-medium">Loading tracks...</p>
        </div >
      </div >
    );
  }

  function handleClick(track: Track) {
    const existingTrack = trackContext?.tracks.filter(inTrack => inTrack.trackId === track.trackId)
    if (existingTrack?.length! > 0) {
      setIsAlreadyHave(true);
    } else {
      setIsAlreadyHave(false);
    }
    setTrack(track);
    setClick(true);
  }

  return (
    <div className="container mx-auto md:ml-16 lg:ml-16 px-4 py-8">
      {track && <CommunityDialog track={track} open={click} setOpen={setClick} isAlreadyHave={isAlreadyHave} />}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communityPost.map((post, index) => (
          <Card
            key={index}
            className="group transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="space-y-4">
              <CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="relative h-14 w-14">
                      <ExpProgress
                        size={56}
                        currentExp={post.exp as number}
                        maxExp={expRequired(post.level as number)}
                      />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Avatar className="h-10 w-10 border-2 border-white">
                          <AvatarImage src={post.avatar} alt={post.username} />
                        </Avatar>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{post.username}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Level {post.level}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      EXP: {post.exp?.toLocaleString()} / {expRequired(post.level as number).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent
              className="cursor-pointer bg-gray-50 p-6 transition-colors duration-200 hover:bg-gray-100"
              onClick={() => handleClick(post.track)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {post.track.trackName}
                    </h3>
                    <Globe className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-500" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getDifficultyColor(post.track.difficulty as difficulty)} px-3 py-1`}
                  >
                    {post.track.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {post.track.skills.length} skills included
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityGrid;
