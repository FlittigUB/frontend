'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOptionalAuthContext } from '@/context/AuthContext';
import {
  HiOutlineBriefcase,
  HiOutlineHome,
  HiOutlineLogin,
  HiOutlineMenu,
  HiOutlineUserAdd,
  HiOutlineUserCircle,
  HiOutlineX,
} from 'react-icons/hi';
import Image from 'next/image';
import UserDropdown from '@/components/portal/ui/UserDropdown';
import MobileUserDropdown from '@/components/portal/ui/MobileUserDropdown';

interface NavbarProps {
  onOpenChat?: () => void;
}

export default function Navbar({ onOpenChat }: NavbarProps) {
  const { loggedIn, user } = useOptionalAuthContext();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/portal/logg-inn');
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Left side links (e.g. “Hjem”, “Stillinger”)
  const navLinksLeft = (
    <>
      <Link
        href="/portal"
        className="flex items-center gap-2 py-2 hover:text-primary"
        onClick={() => setMenuOpen(false)}
      >
        <HiOutlineHome className="text-xl" />
        Hjem
      </Link>
      <Link
        href="/portal/stillinger"
        className="flex items-center gap-2 py-2 hover:text-primary"
        onClick={() => setMenuOpen(false)}
      >
        <HiOutlineBriefcase className="text-xl" />
        Jobber
      </Link>
    </>
  );

  // Right side links (e.g. “Hei, [navn]”, “Meldinger”, “Profil”, etc.)
  const navLinksRight = (
    <>
      {loggedIn ? (
        <>
          {user && (
            <span className="flex items-center gap-2 rounded-md px-2 py-2 font-medium text-gray-400">
              <HiOutlineUserCircle className="text-xl" />
              Hei, {user.name}!
            </span>
          )}
          {user && (
            <>
              <div className="hidden md:block">
                <UserDropdown
                  user={user}
                  onLogout={handleLogout}
                  onOpenChat={onOpenChat}
                />
              </div>
              <div className="block md:hidden">
                <MobileUserDropdown
                  user={user}
                  onLogout={handleLogout}
                  onOpenChat={onOpenChat}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Link
            href="/portal/logg-inn"
            className="flex items-center gap-2 py-2 hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            <HiOutlineLogin className="text-xl" />
            Innlogging
          </Link>
          <Link
            href="/portal/registrer-deg"
            className="flex items-center gap-2 py-2 hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            <HiOutlineUserAdd className="text-xl" />
            Registrering
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="w-full border-b border-secondary bg-background shadow-sm">
      <div className="container relative mx-auto flex items-center justify-between px-4 py-3">
        {/* Desktop Logo - hidden on mobile */}
        <Link
          href="/"
          className="relative hidden flex-row text-2xl font-bold text-foreground transition-opacity hover:opacity-80 md:flex"
        >
          <div className="relative aspect-[16/9] w-24">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}81b7981a-69c0-4507-be74-d82b3134df3b.png`}
              alt="Flittig UB Logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-8 hidden w-full items-center md:flex">
          <div className="flex items-center space-x-6">{navLinksLeft}</div>
          <div className="ml-auto flex items-center space-x-6">
            {navLinksRight}
          </div>
        </nav>

        {/* Mobile Burger Icon (only mobile) */}
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-primary hover:text-foregroundDark md:hidden"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute left-0 top-[64px] z-50 flex w-full flex-col items-start border-t border-secondary bg-secondary px-4 py-4 md:hidden">
            <div className="mb-2 w-full">{navLinksLeft}</div>
            <hr className="my-4 w-full border-secondary" />
            <div className="w-full">{navLinksRight}</div>
          </div>
        )}
      </div>
    </header>
  );
}
