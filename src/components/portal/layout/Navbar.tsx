'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOptionalAuthContext } from '@/context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineChat,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';
import Image from "next/image";

interface NavbarProps {
  onOpenChat?: () => void;
}

export default function Navbar({ onOpenChat }: NavbarProps) {
  const { loggedIn, userRole, user } = useOptionalAuthContext();
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
        Stillinger
      </Link>
    </>
  );

  // Right side links (e.g. “Hei, [navn]”, “Meldinger”, “Profil”, etc.)
  const navLinksRight = (
    <>
      {loggedIn ? (
        <>
          {/* Greet the user if name is available */}
          {user && (
            <span className="flex items-center gap-2 rounded-md px-2 py-2 font-medium text-gray-400">
              <HiOutlineUserCircle className="text-xl" />
              Hei, {user.name}!
            </span>
          )}

          <button
            className="flex items-center gap-2 py-2 hover:text-primary"
            onClick={() => {
              onOpenChat?.();
              setMenuOpen(false);
            }}
          >
            <HiOutlineChat className="text-xl" />
            Meldinger
          </button>

          <Link
            href="/portal/profil"
            className="flex items-center gap-2 py-2 hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            <HiOutlineUserCircle className="text-xl" />
            Profil
          </Link>

          {/* Employer-specific links */}
          {userRole === 'arbeidsgiver' && (
            <>
              <Link
                href="/portal/mine-stillinger"
                className="flex items-center gap-2 py-2 hover:text-primary"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineBriefcase className="text-xl" />
                Mine stillinger
              </Link>
              <Link
                href="/portal/ny-stilling"
                className="flex items-center gap-2 py-2 font-semibold hover:text-primary"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineBriefcase className="text-xl" />
                Opprett ny stilling
              </Link>
            </>
          )}

          {/* Worker-specific links */}
          {userRole === 'arbeidstaker' && (
            <Link
              href="/portal/mine-soknader"
              className="flex items-center gap-2 py-2 hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              <HiOutlineBriefcase className="text-xl" />
              Mine søknader
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 py-2 hover:text-primary"
          >
            <HiOutlineLogout className="text-xl" />
            Logg ut
          </button>
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
    <header className="w-full border-b border-gray-200 bg-secondary shadow-sm">
      <div className="relative container mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <Link
          href="/portal"
          className="relative text-2xl font-bold text-foreground hover:opacity-80 transition-opacity flex flex-row"
        >
          <div className="relative w-24 aspect-[16/9]">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}81b7981a-69c0-4507-be74-d82b3134df3b.png`}
              alt="Flittig UB Logo"
              fill
              className="object-contain" // Ensures the image fits within the container while preserving aspect ratio
            />
          </div>
        </Link>

        {/* Desktop Nav (split in two groups) */}
        <nav className="hidden w-full md:flex items-center ml-8">
          {/* Left side */}
          <div className="flex items-center space-x-6">{navLinksLeft}</div>
          {/* Right side (push all logged-in items to the right) */}
          <div className="flex items-center space-x-6 ml-auto">{navLinksRight}</div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="
            md:hidden flex items-center justify-center
            rounded-md p-2 text-foreground
            hover:bg-primary hover:text-foregroundDark
            transition-colors
          "
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div
            className="
              absolute top-[64px] left-0 w-full
              bg-secondary
              border-t border-gray-200
              z-50
              flex flex-col items-start px-4 py-4
              md:hidden
            "
          >
            <div className="w-full mb-2">{navLinksLeft}</div>
            {/* Add a line or spacing to separate */}
            <hr className="w-full border-gray-200 my-4" />
            <div className="w-full">{navLinksRight}</div>
          </div>
        )}
      </div>
    </header>
  );
}
