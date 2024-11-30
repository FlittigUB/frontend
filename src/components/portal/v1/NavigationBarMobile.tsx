import React from 'react';
import { FaUser, FaBell, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function NavigationBarMobile() {
  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around bg-[#FFF8DC] px-4 py-2">
        <Link href="/portal/profil">
          <button className="ml-2 flex items-center justify-center rounded-full border-2 border-black bg-white p-2 focus:outline-none">
            <FaUser className="h-6 w-6 text-[#000000]" />
          </button>
        </Link>
        <Link href="/portal/kalender">
          <button className="mx-3 flex items-center justify-center rounded-full border-2 border-black bg-white p-2 focus:outline-none">
            <FaCalendarAlt className="h-6 w-6 text-[#000000]" />
          </button>
        </Link>
        <div className="flex-1"></div> {/* Spacer */}
        <Link href="/portal/varsler">
          <button className="mr-2 flex items-center justify-center rounded-full border-2 border-black bg-white p-2 focus:outline-none">
            <FaBell className="h-6 w-6 text-[#000000]" />
          </button>
        </Link>
      </nav>

      {/* Centered Plus Button */}
      <Link href="/portal/add-ad">
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 transform z-50">
          <button className="flex items-center justify-center rounded-lg border-2 border-black bg-white p-4 focus:outline-none">
            <FaPlus className="h-8 w-8 text-[#000000]" />
          </button>
        </div>
      </Link>
    </div>
  );
}
