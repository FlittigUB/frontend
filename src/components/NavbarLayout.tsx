'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

interface NavbarLayoutProps {
  children: ReactNode;
}

export default function NavbarLayout({ children }: NavbarLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative bg-primary">
      {/* Navbar Section */}
      <nav className="absolute right-10 top-10 mt-4 text-black">
        <div className="flex items-center justify-end px-4">
          {/* Desktop Links */}
          <div className="z-50 hidden md:flex md:flex-row md:items-center md:space-x-2">
            <Link
              href="/"
              className="text-lg transition-colors hover:text-green-700"
            >
              Forside
            </Link>
            <span className="text-lg">/</span>
            <Link
              href="/info/ofte-stilte-sporsmal"
              className="text-lg transition-colors hover:text-green-700"
            >
              Ofte Stilte Spørsmål
            </Link>
            <span className="text-lg">/</span>
            <Link
              href="/info/om-oss"
              className="text-lg transition-colors hover:text-green-700"
            >
              Om Oss
            </Link>
            <span className="text-lg">/</span>
            <Link
              href="/prosessen"
              className="text-lg transition-colors hover:text-green-700"
            >
              Prosessen
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none"
            >
              {menuOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="flex flex-col items-start space-y-2 px-4 py-2 md:hidden">
            <Link
              href="/"
              className="text-lg transition-colors hover:text-green-700"
            >
              Forside
            </Link>
            <Link
              href="/info/ofte-stilte-sporsmal"
              className="text-lg transition-colors hover:text-green-700"
            >
              Ofte Stilte Spørsmål
            </Link>
            <Link
              href="/info/om-oss"
              className="text-lg transition-colors hover:text-green-700"
            >
              Om Oss
            </Link>
            <Link
              href="/prosessen"
              className="text-lg transition-colors hover:text-green-700"
            >
              Prosessen
            </Link>
          </div>
        )}
      </nav>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
