'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Tooltip from '@/components/common/ToolTip';
import axios from 'axios';
import { User } from '@/common/types';

export default function OtherUserProfilePage() {
  const { uuid } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRole = () => {
    return user?.role || 'arbeidstaker';
  };

  const role = getRole();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No JWT token found. Please log in.');
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${uuid}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data: User = response.data.user;
        setUser(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchUserData();
    }
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Laster...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-500">Feil: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Fant ingen bruker</p>
      </div>
    );
  }

  const profileImageUrl = user.image
    ? `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.image}`
    : `${process.env.NEXT_PUBLIC_ASSETS_URL}70e5b449-da0a-4d91-af74-8a4592080b98`;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <div className="flex w-full max-w-lg flex-col items-center space-y-6 rounded-3xl p-6">
        {/* Profile Header */}
        <div className="relative flex w-full flex-col items-center space-y-4">
          {/* Profile Image */}
          <div className="relative h-40 w-40 overflow-hidden rounded-full bg-gray-200 shadow-inner">
            <Image
              src={profileImageUrl}
              alt="Profile Picture"
              fill
              className="object-cover"
            />
          </div>

          {/* Name and Verified Badge */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-50">
              {user.name || 'Ukjent Bruker'}
            </h1>
            {user.verified && (
              <Tooltip text="Denne brukerens identitet er verifisert.">
                <div className="flex items-center justify-center rounded-full bg-blue-100 p-2 shadow-neumorphic">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-blue-600">
                    Verifisert
                  </span>
                </div>
              </Tooltip>
            )}
          </div>

          {/* Role Tag */}
          <div
            className={`flex items-center rounded-full px-4 py-1 text-sm font-medium ${
              role === 'arbeidsgiver'
                ? 'bg-blue-300 text-blue-900'
                : 'bg-green-300 text-green-900'
            }`}
          >
            {role === 'arbeidsgiver' ? 'Arbeidsgiver' : 'Arbeidstaker'}
          </div>
        </div>

        {/* Bio */}
        <div className="w-full rounded-2xl bg-yellow-200 p-4 shadow-neumorphic">
          <p className="whitespace-pre-wrap text-gray-800">
            {user.bio || 'Ingen bio tilgjengelig.'}
          </p>
        </div>

        {/* Guardian Field - Conditionally Rendered */}
        {user.needs_guardian && (
          <div className="flex items-center justify-between rounded-2xl bg-yellow-200 p-4 shadow-neumorphic">
            <span className="font-medium text-gray-800">Foresatte:</span>
            <span className="text-gray-800">
              {user.guardian || 'Ikke oppgitt'}
            </span>
          </div>
        )}

        {/* Mobile Field */}
        <div className="flex items-center justify-between rounded-2xl bg-yellow-200 p-4 shadow-neumorphic">
          <span className="font-medium text-gray-800">Mobil:</span>
          <span className="text-gray-800">
            {user.mobile ? user.mobile.toString() : 'Ikke oppgitt'}
          </span>
        </div>

        {/* Email Field */}
        <div className="flex items-center justify-between rounded-2xl bg-yellow-200 p-4 shadow-neumorphic">
          <span className="font-medium text-gray-800">Epost:</span>
          <span className="text-gray-800">{user.email || 'Ikke oppgitt'}</span>
        </div>

        {/* Ratings: Conditionally Render */}
        <div className="w-full">
          {role === 'arbeidsgiver' ? (
            <>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-50">
                Arbeidsgiver Ratings
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {['Punktlighet', 'Ledelse', 'Kommunikasjon'].map(
                  (criteria, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl p-4 text-center shadow-neumorphic ${
                        index % 2 === 0 ? 'bg-green-200' : 'bg-yellow-200'
                      }`}
                    >
                      <span className="font-medium text-gray-800">
                        {criteria}
                      </span>
                      <div className="mt-2 flex justify-center space-x-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <span
                            key={starIndex}
                            className="text-xl text-yellow-500"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-50">
                Task Ratings
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Rengjøring',
                  'Leksehjelp',
                  'Hagestell',
                  'Handling',
                  'Annet',
                ].map((task, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-4 text-center shadow-neumorphic ${
                      index % 2 === 0 ? 'bg-green-200' : 'bg-yellow-200'
                    }`}
                  >
                    <span className="font-medium text-gray-800">{task}</span>
                    <div className="mt-2 flex justify-center space-x-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <span
                          key={starIndex}
                          className="text-xl text-yellow-500"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
