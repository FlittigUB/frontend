'use client';

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-border border-t py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 md:flex-row">
        <p className="text-center text-sm text-foreground md:text-left">
          &copy; {new Date().getFullYear()} Flittig UB. Alle rettigheter
          reservert.
        </p>
        <div className="mt-4 flex space-x-4 md:mt-0">
          <Link
            href="/info/personvern"
            className="text-sm text-foreground hover:underline"
          >
            Personvern
          </Link>
          <Link
            href="/info/cookies"
            className="text-sm text-foreground hover:underline"
          >
            Cookies
          </Link>
          <Link
            href="/info/vilkar"
            className="text-sm text-foreground hover:underline"
          >
            Vilkår
          </Link>
          <Link
            href="/info/retur"
            className="text-sm text-foreground hover:underline"
          >
            Retur
          </Link>
          <Link
            href="/info/frakt"
            className="text-sm text-foreground hover:underline"
          >
            Frakt
          </Link>
          <Link
            href="/info/kontakt"
            className="text-sm text-foreground hover:underline"
          >
            Kontakt Oss
          </Link>
          <a
            href="https://tiktok.com/@isora.no"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok className="hover:text-accent text-xl text-foreground transition" />
          </a>
          <a
            href="https://instagram.com/isora.no"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-accent text-xl text-foreground transition" />
          </a>
        </div>
      </div>
    </footer>
  );
}
