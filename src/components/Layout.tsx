'use client';

import React, { useState, useEffect } from 'react';
import {
  Home, Tractor, BarChart3, User, Menu, X, Sun, Cloud, Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 768;
      setIsMobile(isSmall);
      setIsSidebarOpen(!isSmall);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/projects', label: 'Projects', icon: <Tractor className="w-5 h-5" /> },
    // { path: '/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    // { path: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.includes('/projects/') && !pathname.endsWith('/projects')) return 'Project Details';
    if (pathname.includes('/projects')) return 'Projects';
    if (pathname.includes('/reports')) return 'Reports';
    if (pathname.includes('/profile')) return 'Profile';
    return '';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out' : 'relative'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 bg-white border-r border-gray-200 shadow-sm
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Tractor className="h-8 w-8 text-green-800" />
            <h1 className="text-xl font-bold text-green-800">AgriTech</h1>
          </div>
          {isMobile && (
            <Button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </Button>
          )}
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === item.path
                ? 'bg-green-100 text-green-800'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden pb-8">
        {/* Top navbar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              {isMobile && (
                <Button
                  onClick={toggleSidebar}
                  className="p-1 mr-3 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}
              <h2 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Sun className="w-4 h-4 mr-1" />
                <span className="text-sm">23°C</span>
                <Cloud className="w-4 h-4 ml-1" />
              </div>
              <Button className="hidden md:flex items-center px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors">
                <Plus className="w-4 h-4 mr-1" />
                Add Project
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>

        {/* Bottom mobile nav */}
        {isMobile && (
          <div className="md:hidden fixed bottom-0 inset-x-0 z-10 w-[200px] mx-auto rounded bg-white">
            <div className="flex items-center justify-around h-16">
              {navItems.map((item) => (
                <Link
                  onClick={() => setIsSidebarOpen(false)}
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center justify-center p-2 ${pathname === item.path
                    ? 'text-green-700'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Floating action button */}
        {isMobile && (
          <Link href="/projects/new" className='fixed right-6 bottom-20'>
            <Button size={'icon'} variant={'outline'} className="rounded-full ">
              <Plus className='w-8 h-8'></Plus>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Layout;
