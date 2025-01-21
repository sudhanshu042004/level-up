import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreatingSkill, difficulty, } from '@/types/Tracks';

const AddSkill = ({ setSkills }: { setSkills: React.Dispatch<React.SetStateAction<CreatingSkill[]>> }) => {
  const subSkillInput = useRef<HTMLInputElement>(null);
  const [subSkills, setSubSkills] = useState<Array<string>>([]);
  const [skillName, setSkillName] = useState<string>('');
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [diff, setDiff] = useState<difficulty>(difficulty.Medium);

  useEffect(() => {
    if (isInputVisible && subSkillInput.current) {
      subSkillInput.current.focus();
    }
  }, [isInputVisible]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setSubSkills(prev => [...prev, inputValue.trim()]);
      setInputValue('');
      setIsInputVisible(false);
    }
  };

  const handleSubmit = () => {
    if (skillName.trim()) {
      const newSkill = {
        skillName: skillName,
        difficulty: diff,
        subSkills: subSkills,
      };

      setSkills((prev) => [...prev, newSkill]);
      setSkillName('');
      setDiff(difficulty.Medium);
      setSubSkills([]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>
            Create a new skill and add related sub-skills to better organize your expertise.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Skill Name
            </label>
            <Input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Enter main skill name"
              className="w-full"
            />
          </div>

          <div>
            <RadioGroup defaultValue='Medium' >
              <div className='flex' >
                <div className='flex px-2 items-center space-x-2' >
                  <RadioGroupItem value='Easy' id='r1' onClick={() => setDiff(difficulty.Easy)} />
                  <label htmlFor='r1' className='text-sm font-medium mb-1' >Easy</label>
                </div>
                <div className='flex px-2 items-center space-x-2' >
                  <RadioGroupItem value='Medium' id='r2' onClick={() => setDiff(difficulty.Medium)} />
                  <label htmlFor='r2' className='text-sm font-medium mb-1' >Medium</label>
                </div>
                <div className='flex px-2 items-center space-x-2' >
                  <RadioGroupItem value='Hard' id='r3' onClick={() => setDiff(difficulty.Hard)} />
                  <label htmlFor='r3' className='text-sm font-medium mb-1'>Hard</label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Sub-skills</label>
              {!isInputVisible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsInputVisible(true)}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Sub-skill
                </Button>
              )}
            </div>

            {isInputVisible && (
              <div className="mb-4">
                <Input
                  ref={subSkillInput}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleEnter}
                  placeholder="Press Enter to add sub-skill"
                  className="w-full"
                />
              </div>
            )}

            {subSkills.length > 0 && (
              <Card className="p-4">
                <div className=" gap-2">
                  {subSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3  text-sm flex justify-between bg-gray-100 rounded py-3 mt-2 items-center gap-1 group"
                    >
                      {skill}
                      <div className='h-6 w-6 p-2 rounded-full bg-red-200 items-center flex justify-center' >
                        <X
                          className="h-4 w-4 p-2 hover:bg-red-600 bg-red-400 rounded-full cursor-pointer opacity-60 group-hover:opacity-100"
                          onClick={() => setSubSkills(skills => skills.filter((_, i) => i !== index))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSubmit} disabled={!skillName.trim()} className="gap-2">
              <Save className="h-4 w-4" />
              Save Skill
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkill;
