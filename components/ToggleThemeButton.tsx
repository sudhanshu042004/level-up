"use client";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 bg-gray-200 shadow-md rounded-full dark:bg-gray-900 transition-all duration-300"
    >
      <div className="relative w-6 h-6">
        {theme === 'dark' ? (
          <Moon
            className="w-6 h-6 text-gray-100 absolute transform rotate-0 transition-all duration-300 ease-in-out opacity-100"
          />
        ) : (
          <Sun
            className="w-6 h-6 text-yellow-500 absolute transform rotate-90 transition-all duration-300 ease-in-out opacity-100"
          />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
