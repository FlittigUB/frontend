import React from 'react';
import { FaUser, FaBell, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function NavigationBarDesktop() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-end bg-[#FFF8DC] px-6 py-4">
      {/* Navigation Icons */}
      <div className="flex items-center space-x-8">
        <Link href="/portal/profil">
          <button className="flex items-center justify-center rounded-full border-2 border-black bg-white p-2 focus:outline-none">
            <FaUser className="h-6 w-6 text-[#000000]" />
          </button>
        </Link>
        <Link href="/portal/varsler">
          <button className="flex items-center justify-center rounded-full border-2 border-black bg-white p-2 focus:outline-none">
            <FaBell className="h-6 w-6 text-[#000000]" />
          </button>
        </Link>
        <Link href="/portal/meldinger">
          <button className="flex items-center justify-center rounded-full border-2 border-black bg-white p-2 focus:outline-none">
            <FaEnvelope className="h-6 w-6 text-[#000000]" />
          </button>
        </Link>
        <Link href="/portal/kalender">
          <button className="flex items-center justify-center rounded-full border-2 border-black bg-white p-2 focus:outline-none">
            <FaCalendarAlt className="h-6 w-6 text-[#000000]" />
          </button>
        </Link>
      </div>
    </nav>
  );
}
