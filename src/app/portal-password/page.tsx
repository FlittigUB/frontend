"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { Label } from '@/components/ui/label';
import { BorderTrail } from '@/components/ui/border-trail';

export default function PortalPasswordPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_LAUNCH_PASSWORD) {
      // Set the cookie manually with native document.cookie.
      document.cookie = `portal_auth=${password}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; Secure; SameSite=Strict`;
      toast.success('Passordet er gyldig! Velkommen til portalen.');
      router.push('/portal');
    } else {
      toast.error('Passordet er feil!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      {/* Sonner Toaster for toast notifications */}
      <Toaster richColors position="top-right" />

      {/* Dark glassmorphic Card with animated red border trail */}
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-50/20 bg-zinc-950 p-8 shadow-xl backdrop-blur-md">
        {/* Animated border trail: red gradient with a subtle gradient effect */}
        <BorderTrail
          className="bg-linear-to-l from-red-500 via-red-700 to-red-500"
          style={{
            boxShadow:
              '0px 0px 60px 30px rgba(255, 0, 0, 0.8), 0 0 100px 60px rgba(255, 0, 0, 0.8), 0 0 140px 90px rgba(255, 0, 0, 0.8)',
          }}
          size={0}
        />

        {/* Card content */}
        <div className="relative z-10">
          <h1 className="mb-4 text-center text-4xl font-bold text-white">
            Velkommen til Flittig
          </h1>
          <div className="mb-6 space-y-2 text-center text-white">
            <p className="text-lg font-medium">Siden er under utvikling</p>
            <p className="text-md font-light">
              Vi jobber hardt for å skape noe unikt og spennende. Forbered deg
              på en ny digital opplevelse med eksklusive funksjoner og
              kontinuerlige oppdateringer. Din early-access kode gir deg
              muligheten til å teste alt før alle andre!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Label className="text-white">Har du en early-access kode?</Label>
            <input
              type="password"
              placeholder="Oppgi passord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-gradient-to-r from-red-500 to-red-700 py-3 font-semibold text-white shadow-md transition duration-200 hover:shadow-lg"
            >
              Logg inn
            </button>
          </form>
          <div className="mt-8 text-center text-sm italic text-zinc-400">
            Utviklet av Kristoffer Nerskogen
          </div>
        </div>
      </div>
    </div>
  );
}
