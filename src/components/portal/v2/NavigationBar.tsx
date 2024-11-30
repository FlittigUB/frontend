// components/portal/NavigationBar.tsx

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const NavigationBarDesktop = dynamic(() => import('./NavigationBarDesktop'));
const NavigationBarMobile = dynamic(() => import('./NavigationBarMobile'));

export default function NavigationBar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check screen width to determine if it's mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    // Check initial dark mode state
    const htmlClasses = document.documentElement.classList;
    if (htmlClasses.contains('dark')) {
      setIsDarkMode(true);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleDarkMode = () => {
    const htmlClasses = document.documentElement.classList;
    if (htmlClasses.contains('dark')) {
      htmlClasses.remove('dark');
      setIsDarkMode(false);
    } else {
      htmlClasses.add('dark');
      setIsDarkMode(true);
    }
  };

  return isMobile ? (
    <NavigationBarMobile
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    />
  ) : (
    <NavigationBarDesktop
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    />
  );
}
