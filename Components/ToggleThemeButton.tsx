"use client";

import { useSpring, animated } from '@react-spring/web'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  const properties = {
    dark: {
      r: 9,
      transform: 'rotate(40deg)',
      cx: 12,
      cy: 4,
      opacity: 1
    },
    light: {
      r: 5,
      transform: 'rotate(90deg)',
      cx: 30,
      cy: 0,
      opacity: 1
    }
  }

  const { transform, opacity } = useSpring({
    to: theme === 'dark' ? properties.dark : properties.light,
    config: { tension: 250, mass: 1, friction: 30 }
  })

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 shadow-md rounded-full dark:bg-gray-900 transition-colors"
    >
      <animated.div
        style={{ transform, opacity }}
        className="relative w-6 h-6"
      >

        {theme === 'dark' ? (
          <Moon className="w-6 h-6 text-gray-100" />
        ) : (
          <Sun className="w-6 h-6 text-yellow-500" />
        )}
      </animated.div>
    </button>
  )
}

export default ThemeToggle
