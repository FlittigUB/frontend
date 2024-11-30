import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const NavigationBarDesktop = dynamic(() => import('./NavigationBarDesktop'));
const NavigationBarMobile = dynamic(() => import('./NavigationBarMobile'));

export default function NavigationBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen width to determine if it's mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    isMobile ? <NavigationBarMobile /> : <NavigationBarDesktop />);
}
