import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { GetSkills } from '@/lib/actions/skills/GetSkills';
import { Skeleton } from './ui/skeleton';
import { difficulty } from '@/types/Tracks';

type SkillType = {
  skillId: number;
  skillName: string;
  completed: boolean;
  difficulty: difficulty;
  subSkills: string[];
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const getDifficultyColor = (difficulty: difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    case 'hard':
      return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
  }
};

const SkillCard = ({ skills }: { skills: SkillType[] }) => {

  if (!skills) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-52 rounded-xl opacity-50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 p-3 sm:p-6">
      {skills.map((skill) => (
        <Card
          key={skill.skillId}
          className="group hover:shadow-lg transition-all  duration-300 ease-in-out hover:-translate-y-1 bg-white border-slate-200"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 line-clamp-2 leading-tight">
                {skill.skillName}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={`${getDifficultyColor(skill.difficulty)} px-2 py-0.5 text-xs font-medium border`}>
                  {capitalizeFirstLetter(skill.difficulty)}
                </Badge>
                <span className="text-xs text-slate-500 font-medium">#{skill.skillId}</span>
              </div>
            </div>
            {skill.completed &&
              (
                <div className="rounded-full p-1.5  bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                  <Check className="h-4 w-4" />
                </div>
              )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Sub Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.subSkills.map((subSkill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-normal text-center border-0 font-medium"
                    >
                      {subSkill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
      }
    </div >
  );
};

export default SkillCard;
