// components/portal/navigation/NavigationBarDesktop.tsx

import React from 'react';
import { FaBell, FaBriefcase, FaEnvelope, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function NavigationBarDesktop() {
  return (
    <nav className="bg-background-dark z-50 flex items-center justify-between px-6 py-4 shadow-neumorphic-dark">
      {/* Logo */}
      <Link href="/portal">
        <div className="flex cursor-pointer items-center">
          <Image src="/FIB.png" alt="Logo" width={40} height={40} />
          <span className="text-foreground-dark ml-2 text-2xl font-bold">
            Flittig
          </span>
        </div>
      </Link>
      {/* Navigation Icons */}
      <div className="flex items-center space-x-8">
        <Link href="/portal/profil">
          <FaUser className="text-foreground-dark h-6 w-6 cursor-pointer hover:text-primary" />
        </Link>
        <Link href="/portal/soknader">
          <FaBriefcase className="text-foreground-dark h-6 w-6 cursor-pointer hover:text-primary" />
        </Link>
        <Link href="/portal/varsler">
          <FaBell className="text-foreground-dark h-6 w-6 cursor-pointer hover:text-primary" />
        </Link>
      </div>
    </nav>
  );
}
