import React, { useEffect, useState } from 'react';
import { Menu, X, Home, User, Settings, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const router = useRouter();

  const menuItems = [
    { title: 'home', icon: <Home size={20} /> },
    { title: 'profile', icon: <User size={20} /> },
    { title: 'settings', icon: <Settings size={20} /> },
    { title: 'community', icon: <UsersRound size={20} /> },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const storedActiveItem = localStorage.getItem("storedActiveItem");
    if (storedActiveItem) {
      setActiveItem(storedActiveItem);
    } else {
      const currentRoute = window.location.pathname.split('/')[1];
      if (currentRoute && menuItems.find(item => item.title === currentRoute)) {
        setActiveItem(currentRoute);
      } else {
        setActiveItem('home')
      }
    }
  })

  function handleClick(item: string) {
    setActiveItem(item);
    router.push(`/${item}`)
    localStorage.setItem("storedActiveItem", item)
  }

  return (
    <>
      <div
        className={`
          fixed left-0 top-0 h-screen bg-white shadow-lg z-20
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-16'}
        `}
      >
        {/* Logo area */}
        <div className="p-4 border-b flex items-center justify-between">
          <button
            className="p-2 shadow-md rounded-lg bg-white transition-colors hover:bg-gray-50"
            onClick={toggleSidebar}
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => handleClick(item.title)}
              className={`
                w-full flex items-center px-6 py-4
                hover:bg-gray-100 transition-colors rounded
                ${activeItem === item.title ? 'bg-[#0c0c24] text-[#f43c04]' : ''}
              `}
            >
              <span>{item.icon}</span>
              <span
                className={`
                  ml-4 whitespace-nowrap
                  transition-all duration-300 ease-in-out
                  ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 overflow-hidden'}
                `}
              >
                {item.title}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-10 lg:hidden
          ${isExpanded ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={toggleSidebar}
      />
    </>
  );
};

export default Sidebar;
