"use client"
import React, { useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserContext } from '@/context/UserContext'
import { Sparkles } from 'lucide-react'
import SkillCard from '@/components/SkillsCard'
import ExpProgress from '@/components/ExpProgress'
import { SkillType } from '@/types/Tracks'
import { GetSkills } from '@/lib/actions/skills/GetSkills'
import LoadingBall from '@/components/LoadingBall'

const LevelBadge = ({ level }: { level: number }) => (
  <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 flex items-center justify-center">
    <div className="relative">
      <div className="absolute inset-0 animate-pulse duration-300 rounded-full bg-blue-100 opacity-100"></div>
      <Badge className="relative bg-gradient-to-r from-[#FD6325] to-[#FEC300] text-white hover:from-[#FEC300] hover:to-[#FD6325] hover:scale-125 text-xs sm:text-sm transition-all duration-300">
        <Sparkles className="sm:w-4 sm:h-4 h-3 w-3 mr-1" />
        Level {level}
      </Badge>
    </div>
  </div>
)

const Profile = () => {
  const userContextData = useContext(UserContext)
  const [skills, setSkills] = React.useState<SkillType[]>()

  React.useEffect(() => {
    async function getData() {
      const result = await GetSkills();
      setSkills(result);
    }
    getData();
  }, []);

  if (!userContextData?.user || !userContextData?.maxExp || !skills) {
    return <LoadingBall text='Loading Skills....' />
  }

  const { user } = userContextData

  return (
    <div className="min-h-screen w-full sm:pl-14 bg-gradient-to-r from-red-50 to-yellow-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Profile Card */}
          <div className="lg:w-[380px]">
            <Card className="relative lg:sticky lg:top-32 bg-white p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl hover:-translate-y-1">
              {user.level && <LevelBadge level={user.level} />}
              <CardContent className="space-y-6 sm:space-y-8">
                <div className="relative flex justify-center">
                  <div className="relative group">
                    <ExpProgress
                      size={144}
                      currentExp={user.exp as number}
                      maxExp={userContextData.maxExp}
                      className="transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Avatar className="h-28 w-28 md:h-28 md:w-28 sm:w-24 sm:h-24 ring-4 ring-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.username}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 text-xl font-semibold">
                          {user.username?.slice(0, 2).toUpperCase() || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <div className="space-x-2 text-lg sm:text-xl md:text-2xl font-medium">
                    {user.rank && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500 font-semibold inline-block hover:scale-105 transition-transform">
                        {user.rank}
                      </span>
                    )}
                    <span className="text-gray-900 font-bold">{user.username}</span>
                  </div>
                  {user.name && (
                    <div className="text-gray-700 font-medium">
                      {user.name}
                    </div>
                  )}
                  {user.email && (
                    <div className="text-gray-500 text-xs sm:text-sm">{user.email}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scrollable Skills Section */}
          <div className="flex-1 lg:max-h-screen lg:overflow-y-auto">
            <SkillCard skills={skills} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
