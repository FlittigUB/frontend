'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FaBell, FaBriefcase, FaUser } from 'react-icons/fa';
import { FaRectangleList } from 'react-icons/fa6';
import { AiFillMessage } from 'react-icons/ai';
import Link from 'next/link';

export default function NavigationBarMobile({ isDarkMode }: any) {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (href: string) => pathname === href;

  // Define active color based on dark mode
  const getActiveColor = () => {
    return isDarkMode ? 'text-primary' : 'text-yellow-500'; // Darker yellow for light mode
  };

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-10 h-20 ${
          isDarkMode
            ? 'shadow-neumorphic-dark bg-backgroundDark'
            : 'shadow-neumorphic bg-background'
        }`}
      >
        {/* SVG Background */}
        <div className="absolute inset-0 h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 892 134"
            preserveAspectRatio="xMidYMax slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M360.681 13.6852C356.332 5.41974 347.797 0 338.458 0H50C22.3858 0 0 22.3858 0 50V84C0 111.614 22.3858 134 50 134H842C869.614 134 892 111.614 892 84V50C892 22.3858 869.614 0 842 0H553.398C544.248 0 535.88 5.28365 531.589 13.3648V13.3648L531.588 13.3667C527.675 20.7356 523.724 28.1757 521.115 35.4764C519.779 39.2152 518.562 43.1416 517.321 47.1441L517.321 47.1453C508.991 74.0121 499.598 104.308 446.168 104.308C392.619 104.308 383.113 73.8756 374.706 46.964C373.5 43.1035 372.317 39.3155 371.029 35.7002C368.445 28.4434 364.547 21.0332 360.681 13.6852V13.6852Z"
              fill={isDarkMode ? '#FFD700' : '#FFE135'} // Primary color for SVG
            />
          </svg>
        </div>

        {/* Navigation Items */}
        <div className="relative z-10 flex h-20 items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Left Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            <Link href="/portal/profil" className="group flex flex-col items-center">
              <FaUser
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/profil') ? getActiveColor() : 'text-white'
                }`}
                aria-label="Profile"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/profil') ? getActiveColor() : 'text-white'
                }`}
              >
                Profile
              </span>
            </Link>
            <Link href="/portal/soknader" className="group flex flex-col items-center">
              <FaRectangleList
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/soknader') ? getActiveColor() : 'text-white'
                }`}
                aria-label="Applications"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/soknader') ? getActiveColor() : 'text-white'
                }`}
              >
                Applications
              </span>
            </Link>
          </div>

          {/* Center FAB */}
          <Link
            href="/portal"
            className="absolute -top-7 left-1/2 z-20 -translate-x-1/2 transform"
          >
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Icon */}
              <div
                className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                  isDarkMode
                    ? 'bg-yellow-400 shadow-neumorphic-icon-dark'
                    : 'bg-yellow-500 shadow-neumorphic-icon'
                }`}
              >
                <FaBriefcase className="h-6 w-6 text-white" aria-label="Home" />
              </div>
            </div>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            <Link href="/portal/varsler" className="group flex flex-col items-center">
              <FaBell
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/varsler') ? getActiveColor() : 'text-white'
                }`}
                aria-label="Notifications"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/varsler') ? getActiveColor() : 'text-white'
                }`}
              >
                Notifications
              </span>
            </Link>
            <Link href="/portal/meldinger" className="group flex flex-col items-center">
              <AiFillMessage
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/meldinger') ? getActiveColor() : 'text-white'
                }`}
                aria-label="Messages"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/meldinger') ? getActiveColor() : 'text-white'
                }`}
              >
                Messages
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
