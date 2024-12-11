// src/app/portal/log-inn/page.tsx
'use client';

import React from 'react';
import LoginForm from '@/components/login/LoginForm';
import Image from 'next/image';

export default function LoginPage() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-yellow-200 to-yellow-300 px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Mascot Image */}
          <div className="h-40 w-40 relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}722b612f-b083-4a34-bef7-4b884bbeb2dc.png`} // Replace with your actual mascot image path
              alt="Mascot"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            Velkommen tilbake! 👋
          </h1>
          <p className="text-center text-gray-600">
            Logg inn for å få tilgang til portalen din.
          </p>
        </div>
        {/* Login Form */}
        <LoginForm />
        {/* Link to Registration Page */}
        <div className="text-center">
          <p className="text-gray-600">
            Har du ikke en konto?{' '}
            <a
              href="/portal/registrer-deg"
              className="text-orange-500 hover:underline font-semibold"
            >
              Registrer deg her
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
