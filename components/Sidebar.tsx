import React, { useEffect, useState } from 'react';
import { Menu, X, Home, User, Settings, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const currentRoute = window.location.pathname.split('/')[1];
    if (currentRoute && menuItems.find(item => item.title === currentRoute)) {
      setActiveItem(currentRoute);
    } else {
      setActiveItem('home');
    }
  }, []);

  const menuItems = [
    { title: 'home', icon: <Home size={isMobile ? 24 : 20} /> },
    { title: 'profile', icon: <User size={isMobile ? 24 : 20} /> },
    { title: 'settings', icon: <Settings size={isMobile ? 24 : 20} /> },
    { title: 'community', icon: <UsersRound size={isMobile ? 24 : 20} /> },
  ];


  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  function handleClick(item: string) {
    setActiveItem(item);
    router.push(`/${item}`);
    if (isMobile) {
      setIsExpanded(false);
    }
  }

  // Mobile bottom navigation bar
  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30 md:hidden">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={() => handleClick(item.title)}
            className={`
              flex flex-col items-center justify-center rounded-full w-full h-full
              ${activeItem === item.title ? 'text-white bg-[#FD6325]' : 'text-gray-600'}
            `}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );

  const DesktopSidebar = () => (
    <>
      <div
        className={`
          fixed left-0 top-0 h-screen bg-white shadow-lg z-20
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-16'}
          hidden md:block
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
                 transition-all duration-300
                ${activeItem === item.title ? 'bg-[#FD6325] text-white ' : ' opacity-50 hover:bg-[#C4CCD4]'}
              `}
            >
              <span>{item.icon}</span>
              <span
                className={`
                  ml-4 whitespace-nowrap capitalize
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

      {/* Overlay for tablet */}
      <div
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-10
          md:hidden
          ${isExpanded ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={toggleSidebar}
      />
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileNav />
    </>
  );
};

export default Sidebar;
