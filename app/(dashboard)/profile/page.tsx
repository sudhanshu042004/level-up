"use client"

import React, { useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserContext } from '@/context/UserContext'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-react'
import { GetSkills } from '@/lib/actions/skills/GetSkills'
import { SkillType } from '@/types/Tracks'
import SkillCard from '@/components/SkillsCard'

// ProfileProgress
const ProfileProgress = ({ percent }: { percent: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative">
      <svg className="w-36 h-36 -rotate-90">
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.8s ease'
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// level badge
const LevelBadge = ({ level }: { level: number }) => (
  <div className="absolute -top-3 -right-3 flex items-center justify-center">
    <div className="relative">
      <div className="absolute inset-0 animate-pulse rounded-full bg-blue-100 opacity-25"></div>
      <Badge className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-colors duration-300">
        <Sparkles className="w-4 h-4 mr-1" />
        Level {level}
      </Badge>
    </div>
  </div>
);

// skill Card

const Profile = () => {
  const userContextData = useContext(UserContext)

  if (userContextData?.user == null || userContextData?.maxExp == null) {
    return (
      <div className="flex h-screen items-center w-screen justify-center bg-gray-50">
        <Card className="w-80 p-6 shadow-lg">
          <CardContent className="space-y-4">
            <Skeleton className="h-36 w-36 rounded-full mx-auto" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const { user } = userContextData

  return (
    <div className="flex ml-10 flex-col min-h-screen w-screen items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <Card className="relative w-80 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
        {user.level && <LevelBadge level={user.level} />}
        <CardContent className="space-y-6">
          <div className="relative flex justify-center">
            <ProfileProgress percent={user.exp as number / userContextData.maxExp * 100} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Avatar className="h-28 w-28 ring-4 ring-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt={user.username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600">
                  {user.username?.slice(0, 2).toUpperCase() || 'UN'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="space-x-2 text-xl font-medium">
              {user.rank && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500 font-semibold">
                  {user.rank}
                </span>
              )}
              <span className="text-gray-900 font-bold">{user.username}</span>
            </div>
            <div className="space-x-2">
              {user.name && (
                <span className="text-gray-700 font-medium">{user.name}</span>
              )}
            </div>
            <div>
              {user.email && (
                <span className="text-gray-500 text-sm">{user.email}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <SkillCard />
    </div>
  );
};

export default Profile;
