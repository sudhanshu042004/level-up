import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CreatingSkill, difficulty } from '@/types/Tracks';
import { motion, AnimatePresence } from 'framer-motion';

const AddSkill = ({ setSkills }: { setSkills: React.Dispatch<React.SetStateAction<CreatingSkill[]>> }) => {
  const subSkillInput = useRef<HTMLInputElement>(null);
  const [subSkills, setSubSkills] = useState<Array<string>>([]);
  const [skillName, setSkillName] = useState<string>('');
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [diff, setDiff] = useState<difficulty>(difficulty.Medium);
  const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false);
    }
    console.log(subSkills)
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button variant="outline" className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-gradient-to-br from-orange-50 to-yellow-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-700">Add New Skill</DialogTitle>
          <DialogDescription className="text-orange-600">
            Create a new skill and add related sub-skills to better organize your expertise.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label className="text-sm font-medium mb-2 block text-orange-700">
              Skill Name
            </label>
            <Input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Enter main skill name"
              className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-orange-700">
              Difficulty Level
            </label>
            <RadioGroup defaultValue="Medium" className="bg-white p-2 rounded-lg">
              <motion.div className="flex justify-around" layout>
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <motion.div
                    key={level}
                    className="flex px-2 items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <RadioGroupItem
                      value={level}
                      id={`r${level}`}
                      onClick={() => setDiff(difficulty[level as keyof typeof difficulty])}
                      className="text-orange-500 border-orange-300"
                    />
                    <label htmlFor={`r${level}`} className="text-sm font-medium text-orange-700">
                      {level}
                    </label>
                  </motion.div>
                ))}
              </motion.div>
            </RadioGroup>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-orange-700">Sub-skills</label>
              {!isInputVisible && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsInputVisible(true)}
                  className="text-orange-600 hover:text-orange-700 flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Sub-skill
                </motion.button>
              )}
            </div>

            <AnimatePresence>
              {isInputVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <Input
                    ref={subSkillInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleEnter}
                    placeholder="Press Enter to add sub-skill"
                    className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {subSkills.length > 0 && (
              <Card className="p-4 border-orange-200">
                <motion.div layout className="space-y-2">
                  <AnimatePresence>
                    {subSkills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="px-3 py-2 text-sm flex justify-between bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg items-center group hover:shadow-md transition-all duration-300"
                      >
                        {skill}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                          onClick={() => setSubSkills(skills => skills.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </Card>
            )}
          </div>
        </motion.div>

        <DialogFooter>
          <DialogClose asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={!skillName.trim()}
                className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              >
                <Save className="h-4 w-4" />
                Save Skill
              </Button>
            </motion.div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkill;
