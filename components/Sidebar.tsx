"use client";
import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Menu, X, Home, User, Settings, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const route = useRouter();

  const menuItems = [
    { title: 'home', icon: <Home size={20} /> },
    { title: 'profile', icon: <User size={20} /> },
    { title: 'settings', icon: <Settings size={20} /> },
    { title: 'community', icon: <UsersRound size={20} /> },
  ];

  const sidebarAnimation = useSpring({
    width: isExpanded ? 256 : 64, // 256px = 16rem (w-64), 64px = 4rem (w-16)
    config: {
      tension: 210,
      friction: 20
    }
  });

  const textAnimation = useSpring({
    opacity: isExpanded ? 1 : 0,
    transform: isExpanded ? 'translateX(0)' : 'translateX(-20px)',
    config: {
      tension: 250,
      friction: 20
    }
  });

  const overlayAnimation = useSpring({
    opacity: isExpanded ? 0.5 : 0,
    config: {
      tension: 250,
      friction: 20
    }
  });

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <animated.div
        style={sidebarAnimation}
        className="h-screen bg-white shadow-lg fixed left-0 top-0 z-10"
      >
        {/* Logo area */}
        <div className=" p-4 border-b flex items-center justify-between" >
          <button
            className="p-[10px] shadow-md rounded-lg bg-white transition-colors"
            onClick={toggleSidebar}
          >
            {isExpanded ? <X className='h-5 w-5' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => { setActiveItem(item.title); route.push(`/${item.title}`) }}
              className={`
                w-full flex px-6 items-center p-4
               transition-colors rounded
                ${activeItem === item.title ? 'bg-[#1c1c2c] text-[#f43c04] ' : 'hover:bg-gray-100'}
              `}
            >
              <span>{item.icon}</span>
              <animated.span style={textAnimation} className="ml-4">
                {item.title}
              </animated.span>
            </button>
          ))}
        </nav>
      </animated.div >

      {/* Overlay */}
      < animated.div
        style={overlayAnimation}
        className={`fixed inset-0 bg-black z-10 lg:hidden ${!isExpanded && 'pointer-events-none'}`
        }
        onClick={toggleSidebar}
      />
    </>
  );
};

export default Sidebar;
