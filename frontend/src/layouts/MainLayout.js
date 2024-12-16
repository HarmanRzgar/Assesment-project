import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full bg-white border-r transition-all duration-300 ease-in-out
          ${isDesktopSidebarOpen ? 'w-64' : 'w-20'} 
          hidden lg:block
        `}
      >
        {/* Desktop Sidebar Content */}
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-center items-center h-[72px] relative">
            <div className={`
              transition-opacity duration-300 ease-in-out absolute
              ${isDesktopSidebarOpen ? 'opacity-100 visible pl-2' : 'opacity-0 invisible'}
              flex items-center gap-3
            `}>
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">PDF</span>
              </div>
              <span className="font-bold text-xl whitespace-nowrap">PDF Manager</span>
            </div>
            <div className={`
              transition-opacity duration-300 ease-in-out
              ${!isDesktopSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}>
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-1">
                <span className="text-white font-bold">PDF</span>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              to="/"
              className={`
                flex items-center gap-3 p-3 rounded-lg mb-2 transition-all
                ${isActive('/') 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span className={`
                transition-opacity duration-300 whitespace-nowrap
                ${isDesktopSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible w-0 h-0'}
              `}>
                Dashboard
              </span>
            </Link>

            <Link
              to="/search"
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all
                ${isActive('/search') 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span className={`
                transition-opacity duration-300 whitespace-nowrap
                ${isDesktopSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible w-0'}
              `}>
                Search
              </span>
            </Link>
          </div>

          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="mt-auto p-4 border-t hover:bg-gray-100 transition-colors"
          >
            <svg 
              className={`w-6 h-6 mx-auto transition-transform duration-300 ${isDesktopSidebarOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-20 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold">PDF</span>
            </div>
            <span className="font-bold text-lg">PDF Manager</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-0 z-30 transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div 
          className={`
            fixed inset-0 bg-black transition-opacity duration-300
            ${isMobileSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
          <div className="pt-16 p-4">
            {/* Mobile Logo and Navigation */}
            <div className="flex items-center gap-3 mb-6 px-4">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">PDF</span>
              </div>
              <span className="font-bold text-xl">PDF Manager</span>
            </div>
            
            <Link
              to="/"
              className={`
                flex items-center gap-3 px-4 py-2 rounded mb-2 transition-all duration-200
                ${isActive('/') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
              `}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/search"
              className={`
                flex items-center gap-3 px-4 py-2 rounded transition-all duration-200
                ${isActive('/search') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
              `}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span>Search</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        style={{ transitionProperty: 'margin, width' }}
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          pt-16 lg:pt-0
        `}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;