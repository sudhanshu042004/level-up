import React, { useState, useRef, useEffect } from 'react';
import { Check, PencilLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicInput = ({ name, setName, TextSize = 'text-xl' }: {
  name: string,
  setName: (name: string) => void,
  TextSize?: string
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditable]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim() !== '') {
      setIsEditable(false);
      setName(name.trim());
    }
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {isEditable ? (
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <input
              placeholder="Enter skill name"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleEnter}
              onBlur={() => name.trim() !== '' && setIsEditable(false)}
              value={name}
              ref={inputRef}
              className="w-full px-4 py-3 text-lg border-2 border-orange-200 rounded-lg 
                       focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200
                       transition-all duration-300 placeholder-gray-400
                       bg-gradient-to-r from-orange-50 to-yellow-50"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => name.trim() !== '' && setIsEditable(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 
                       hover:text-orange-600 transition-colors duration-200"
              aria-label="Confirm skill name"
            >
              <Check className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="group relative inline-block px-4 py-4 rounded-lg
                     hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50
                     transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.span
              className={`${TextSize} font-semibold text-gray-800`}
              layoutId="text"
            >
              {name}
            </motion.span>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="ml-3 p-1.5 rounded-full hover:bg-orange-200 transition-all duration-300"
              onClick={() => setIsEditable(true)}
              aria-label="Edit skill name"
            >
              <PencilLine className="h-4 w-4 text-orange-600" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicInput;
