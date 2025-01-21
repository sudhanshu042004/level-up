import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { GetSkills } from '@/lib/actions/skills/GetSkills';
import { Skeleton } from './ui/skeleton';

type SkillType = {
  skillId: number;
  skillName: string;
  completed: boolean;
  difficulty: string;
  subSkills: string[];
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SkillCard = () => {
  const [skills, setSkills] = React.useState<SkillType[]>();

  React.useEffect(() => {
    async function getData() {
      const result = await GetSkills();
      setSkills(result);
    }
    getData();
  }, []);

  if (!skills) {
    return (
      <div className="mt-6">
        <Skeleton className="h-36 mt-2 opacity-50 rounded-xl w-96" />
        <Skeleton className="h-36 mt-2 rounded-xl opacity-10 w-96" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {skills.map((skill) => (
        <Card key={skill.skillId} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">{skill.skillName}</CardTitle>
            {skill.completed && (
              <Check className="h-5 w-5 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={`${getDifficultyColor(skill.difficulty)}`}>
                  {skill.difficulty}
                </Badge>
                <span className="text-sm text-gray-500">ID: {skill.skillId}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Sub Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {skill.subSkills.map((subSkill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {subSkill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SkillCard;
