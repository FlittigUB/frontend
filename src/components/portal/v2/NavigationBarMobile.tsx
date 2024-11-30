import React from 'react';
import {
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaBell,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import Link from 'next/link';

interface NavigationBarMobileProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function NavigationBarMobile({
  isDarkMode,
  toggleDarkMode,
}: NavigationBarMobileProps) {
  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-center bg-background-dark px-4 shadow-neumorphic-dark">
        {/* Left Icons */}
        <div className="ml-2 flex items-center space-x-12">
          <Link href="/portal/profil">
            <FaUser className="h-6 w-6 cursor-pointer text-foreground-dark hover:text-primary" />
          </Link>
          <Link href="/portal/applikasjoner">
            <FaBriefcase className="h-6 w-6 cursor-pointer text-foreground-dark hover:text-primary" />
          </Link>
        </div>

        {/* Center Spacer (placeholder for alignment) */}
        <div className="flex-1"></div>

        {/* Right Icons */}
        <div className="mr-2 flex items-center space-x-12">
          <Link href="/portal/varsler">
            <FaBell className="h-6 w-6 cursor-pointer text-foreground-dark hover:text-primary" />
          </Link>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="focus:outline-none"
          >
            {isDarkMode ? (
              <FaSun className="h-6 w-6 text-foreground-dark hover:text-primary" />
            ) : (
              <FaMoon className="h-6 w-6 text-foreground-dark hover:text-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Center Message Icon */}
      <Link href="/portal/meldinger">
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="relative flex h-20 w-20 items-center justify-center">
            {/* Background Circle */}
            <div
              className={`absolute inset-0 h-full w-full rounded-full ${isDarkMode ? 'bg-backgroundDark' : 'bg-background'}`}
            ></div>
            {/* Icon */}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-neumorphic-icon dark:shadow-neumorphic-icon-dark">
              <FaEnvelope className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
