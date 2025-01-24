'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Tooltip from '@/components/common/ToolTip';
import axios from 'axios';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the redirect URL from the query string, default to '/portal'
  const redirectUrl = searchParams.get('redirect') || '/portal';

  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    setIsSubmitting(true);

    if (!email || !password) {
      toast.error('Vennligst fyll ut alle påkrevde felt.');
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Vennligst oppgi en gyldig epostadresse.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
      );

      // Store JWT token securely
      localStorage.setItem('token', response.data.access_token);

      // Show success toast
      toast.success('Innlogging vellykket! Omdirigerer...');

      // Redirect to the intended page
      router.push(redirectUrl);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          typeof err.response.data?.message === 'string'
            ? err.response.data.message
            : 'Autentisering mislyktes. Sjekk at e-post og passord er riktig';
        toast.error(errorMessage);
      } else {
        toast.error('Kunne ikke koble til serveren.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Email Field */}
        <Tooltip text="Vennligst oppgi din registrerte e-postadresse.">
          <input
            type="email"
            placeholder="Epost"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner transition duration-300 focus:ring-2 focus:ring-orange-500"
          />
        </Tooltip>

        {/* Password Field */}
        <Tooltip text="Oppgi passordet ditt for å logge inn.">
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner transition duration-300 focus:ring-2 focus:ring-orange-500"
          />
        </Tooltip>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          className={`flex w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            isSubmitting ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logger inn...' : 'Logg inn'}
        </button>
      </div>
    </>
  );
};

export default LoginForm;
