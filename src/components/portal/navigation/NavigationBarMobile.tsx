'use client';

import React from 'react';
import { FaBell, FaBriefcase, FaUser } from 'react-icons/fa';
import { FaRectangleList } from 'react-icons/fa6';
import { AiFillMessage } from 'react-icons/ai';
import Link from 'next/link';
import { getUserRole } from '@/utils/auth'; // Import the utility function

interface NavigationBarMobileProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function NavigationBarMobile({
                                              isDarkMode,
                                            }: NavigationBarMobileProps) {
  // Get user role
  const userRole = getUserRole();

  // Determine the correct href for "Søknader"
  const soknaderHref = `/portal/${userRole}/soknader`

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav className="bg-background-dark shadow-neumorphic-dark fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-center px-4">
        {/* Left Icons */}
        <div className="ml-2 flex items-center space-x-12">
          <Link href="/portal/profil">
            <FaUser className="text-foreground-dark h-6 w-6 cursor-pointer hover:text-primary" />
          </Link>
          <Link href={soknaderHref}>
            <FaRectangleList className="text-foreground-dark h-6 w-6 cursor-pointer hover:text-primary" />
          </Link>
        </div>

        {/* Center Spacer (placeholder for alignment) */}
        <div className="flex-1"></div>

        {/* Right Icons */}
        <div className="mr-2 flex items-center space-x-12">
          <Link href="/portal/varsler">
            <FaBell className="text-foreground-dark h-6 w-6 cursor-pointer hover:text-primary" />
          </Link>
          {/* Dark Mode Toggle */}
          <Link href="/portal/meldinger">
            <AiFillMessage className="text-foreground-dark h-6 w-6 cursor-pointer hover:text-primary" />
          </Link>
        </div>
      </nav>

      {/* Center Message Icon */}
      <Link href="/portal">
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="relative flex h-20 w-20 items-center justify-center">
            {/* Background Circle */}
            <div
              className={`absolute inset-0 h-full w-full rounded-full ${
                isDarkMode ? 'bg-backgroundDark' : 'bg-background'
              }`}
            ></div>
            {/* Icon */}
            <div className="shadow-neumorphic-icon dark:shadow-neumorphic-icon-dark relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <FaBriefcase className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
