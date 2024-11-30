// components/portal/NavigationBarDesktop.tsx

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
import Image from 'next/image';

interface NavigationBarDesktopProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function NavigationBarDesktop({
  isDarkMode,
  toggleDarkMode,
}: NavigationBarDesktopProps) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between bg-background-dark px-6 py-4 shadow-neumorphic-dark">
      {/* Logo */}
      <Link href="/portal">
        <div className="flex cursor-pointer items-center">
          <Image src="/FIB.png" alt="Logo" width={40} height={40} />
          <span className="ml-2 text-2xl font-bold text-foreground-dark">
            Flittig
          </span>
        </div>
      </Link>
      {/* Navigation Icons */}
      <div className="flex items-center space-x-8">
        <Link href="/portal/profil">
          <FaUser className="h-6 w-6 cursor-pointer text-foreground-dark hover:text-primary" />
        </Link>
        <Link href="/portal/applikasjoner">
          <FaBriefcase className="h-6 w-6 cursor-pointer text-foreground-dark hover:text-primary" />
        </Link>
        <Link href="/portal/meldinger">
          <FaEnvelope className="h-6 w-6 cursor-pointer text-foreground-dark hover:text-primary" />
        </Link>
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
  );
}
