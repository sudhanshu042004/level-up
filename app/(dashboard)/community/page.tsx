"use client";
import React, { useEffect, useState } from 'react';
import ExpProgress from '@/components/ExpProgress';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDifficultyColor } from '@/lib/DifficultyColor';
import { difficulty } from '@/types/Tracks';
import { Globe } from 'lucide-react';
import CommunityDialog from '@/components/CommunityDialog';
import PublicTrack from '@/lib/actions/tracks/PublicTracks';

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

interface PublicTrackType {
  userId: number,
  username: string,
  avatar: string,
  level: number | null,
  exp: number | null,
  track: Track

}

const CommunityGrid = () => {
  const [click, setClick] = useState(false);
  const [track, setTrack] = useState<Track | undefined>();
  const [communitPost, setCommunityPost] = useState<PublicTrackType[] | undefined>();


  useEffect(() => {
    async function getData() {
      const result = await PublicTrack();
      setCommunityPost(result as PublicTrack[]);
    }
    getData();
  }, [])



  if (!communitPost) {
    return (
      <div className="flex h-screen w-full justify-center items-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className='animate-bounce' >
            <div className="animate-spin h-12 w-12 border-b-8  border-white border-t-2 rounded-full  bg-black " ></div>
          </div>

          <p className="text-gray-500 font-medium">Loading tracks...</p>
        </div>
      </div>
    );
  }

  function handlClick(track: Track) {
    setTrack(track)
    setClick(true);
  }

  return (
    <div className="container ml-20 mx-auto p-4">
      {track && <CommunityDialog track={track} open={click} setOpen={setClick} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communitPost.map((post, index) => (

          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <div className="flex">
                  <div className="relative">
                    <ExpProgress size={50} currentExp={post.exp as number} maxExp={100} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Avatar>
                        <AvatarImage src={post.avatar} alt={post.username} />
                      </Avatar>
                    </div>
                  </div>
                  <div className="flex ml-2 items-center">
                    {post.username}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className='bg-gray-100 pt-4 cursor-pointer' onClick={() => handlClick(post.track)} >
              <div className="space-y-2 text-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {post.track.trackName}
                  </h3>
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className={`${getDifficultyColor(post.track.difficulty as difficulty)} px-3 py-1`}
                  >
                    {post.track.difficulty}
                  </Badge>
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
