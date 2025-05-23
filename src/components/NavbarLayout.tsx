'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import Image from "next/image";

interface NavbarLayoutProps {
  children: ReactNode;
}

export default function NavbarLayout({ children }: NavbarLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Define the navigation links for the home page
  const navLinks = (
    <>
      <Link
        href="/"
        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        <span>Forside</span>
      </Link>
      <Link
        href="/info/ofte-stilte-sporsmal"
        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        <span>Ofte Stilte Spørsmål</span>
      </Link>
      <Link
        href="/info/om-oss"
        className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        <span>Om Oss</span>
      </Link>
      {/* Portal as CTA Button */}
      <Link
        href="/portal"
        className="flex items-center gap-2 py-2 px-4 bg-primary text-foregroundDark rounded-md font-semibold hover:bg-primaryDark transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        <span>Portal</span>
      </Link>
    </>
  );

  return (
    <div className="relative min-h-screen">
      {/* Navbar Section */}
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks}
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
            aria-label="Toggle menu"
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
                absolute top-full left-0 w-full
                bg-secondary
                border-t border-gray-200
                z-50
                flex flex-col items-start px-4 py-4
                md:hidden
              "
            >
              {navLinks}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
