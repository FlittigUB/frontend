'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FaBell, FaBriefcase, FaUser } from 'react-icons/fa';
import { FaRectangleList } from 'react-icons/fa6';
import { AiFillMessage } from 'react-icons/ai';
import Link from 'next/link';

export default function NavigationBarMobile({ isDarkMode }: any) {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (href: string) => pathname === href;

  // Define active color based on dark mode
  const getActiveColor = () => {
    return isDarkMode ? 'text-primary' : 'text-primary'; // Darker yellow for light mode
  };

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-10 h-20`}
      >
        {/* SVG Background */}
        <div className="absolute inset-0 h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 900 142"
            preserveAspectRatio="xMidYMax slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <g filter="url(#filter0_d_19_15)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M364.681 21.6852C360.332 13.4197 351.797 8 342.458 8H54C26.3858 8 4 30.3858 4 58V92C4 119.614 26.3858 142 54 142H846C873.614 142 896 119.614 896 92V58C896 30.3858 873.614 8 846 8H557.398C548.248 8 539.88 13.2836 535.589 21.3648V21.3648L535.588 21.3667C531.675 28.7356 527.724 36.1757 525.115 43.4764C523.779 47.2152 522.562 51.1416 521.321 55.1441L521.321 55.1453C512.991 82.0121 503.598 112.308 450.168 112.308C396.619 112.308 387.113 81.8756 378.706 54.964C377.5 51.1035 376.317 47.3155 375.029 43.7002C372.445 36.4434 368.547 29.0332 364.681 21.6852V21.6852Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_19_15"
                x="0"
                y="0"
                width="900"
                height="142"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="-4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_19_15"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_19_15"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Navigation Items */}
        <div className="relative z-10 flex h-20 items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Left Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            <Link
              href="/portal/profil"
              className="group flex flex-col items-center"
            >
              <FaUser
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/profil') ? getActiveColor() : 'text-gray-400'
                }`}
                aria-label="Profile"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/profil') ? getActiveColor() : 'text-gray-400'
                }`}
              >
                Profile
              </span>
            </Link>
            <Link
              href="/portal/arbeidstaker/soknader"
              className="group flex flex-col items-center"
            >
              <FaRectangleList
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/soknader') ? getActiveColor() : 'text-gray-400'
                }`}
                aria-label="Applications"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/soknader') ? getActiveColor() : 'text-gray-400'
                }`}
              >
                Applications
              </span>
            </Link>
          </div>

          {/* Center FAB */}
          <Link
            href="/portal"
            className="absolute -top-7 left-1/2 z-20 -translate-x-1/2 transform"
          >
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Icon */}
              <div
                className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                  isDarkMode
                    ? 'bg-primary shadow-neumorphic-icon-dark'
                    : 'bg-primary shadow-neumorphic-icon'
                }`}
              >
                <FaBriefcase className="h-6 w-6 text-white" aria-label="Home" />
              </div>
            </div>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            <Link
              href="/portal/varsler"
              className="group flex flex-col items-center"
            >
              <FaBell
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/varsler') ? getActiveColor() : 'text-gray-400'
                }`}
                aria-label="Notifications"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/varsler') ? getActiveColor() : 'text-gray-400'
                }`}
              >
                Notifications
              </span>
            </Link>
            <Link
              href="/portal/meldinger"
              className="group flex flex-col items-center"
            >
              <AiFillMessage
                className={`h-6 w-6 transition duration-300 ${
                  isActive('/portal/meldinger')
                    ? getActiveColor()
                    : 'text-gray-400'
                }`}
                aria-label="Messages"
              />
              <span
                className={`mt-1 text-xs transition duration-300 ${
                  isActive('/portal/meldinger')
                    ? getActiveColor()
                    : 'text-gray-400'
                }`}
              >
                Messages
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
