import React, { useState, useRef, useEffect } from 'react';
import { Check, PencilLine } from 'lucide-react';

const DynamicInput = ({ name, setName, TextSize }: { name: string, setName: (name: string) => void, TextSize: undefined | string }) => {
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!TextSize) {
    TextSize = 'text-xl'
  }

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditable]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim() !== '') {
      setIsEditable(false);
    }
  };

  const handleChange = (value: string) => {

    if (value !== '') {
      setName(value);
    }
  };

  return (
    <div className="w-full max-w-md">
      {isEditable ? (
        <div className="relative">
          <input
            placeholder="Enter skill name"
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleEnter}
            onBlur={() => name.trim() !== '' && setIsEditable(false)}
            value={name}
            ref={inputRef}
            className={`w-full px-4 py-2 text-lg border-2 border-gray-200 rounded-lg 
                     focus:outline-none
                     transition-all duration-300 placeholder-gray-400 `}
          />

          <button
            onClick={() => setIsEditable(false)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                       hover:text-gray-600 transition-colors duration-200'
            aria-label="Confirm skill name"
          >
            <Check />
          </button>

        </div>
      ) : (
        <div
          className="group relative inline-block px-4 py-4 justify-center text-center items-center rounded-lg
                   hover:bg-gray-100 transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className={`${TextSize} font-semibold text-gray-800`}>
            {name}
          </span>
          <button
            className={`ml-3 p-1.5 rounded-full 
                     ${isHovered ? 'opacity-100' : 'opacity-0'} 
                     hover:bg-gray-200 transition-all duration-300`}
            onClick={() => setIsEditable(true)}
            aria-label="Edit skill name"
          >
            <PencilLine className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )
      }
    </div >
  );
};

export default DynamicInput;
