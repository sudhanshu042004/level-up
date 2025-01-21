"use client"

import React, { useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserContext } from '@/context/UserContext'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-react'
import SkillCard from '@/components/SkillsCard'
import ProfileProgress from '@/components/ProfileProgressor'

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
