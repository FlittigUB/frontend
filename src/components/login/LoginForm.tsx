// components/login/LoginForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Tooltip from "@/components/common/ToolTip";

const LoginForm: React.FC = () => {
  const router = useRouter();

  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    // Basic form validations
    if (!email || !password) {
      setError('Vennligst fyll ut alle påkrevde felt.');
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Vennligst oppgi en gyldig epostadresse.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        // Store JWT token securely
        localStorage.setItem('token', data.access_token);
        // Redirect to /portal
        router.push('/portal');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Autentisering mislyktes.');
      }
    } catch (err) {
      console.error(err);
      setError('Kunne ikke koble til serveren.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Field */}
      <Tooltip text="Vennligst oppgi din registrerte e-postadresse.">
        <input
          type="email"
          placeholder="Epost"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
        />
      </Tooltip>

      {/* Password Field */}
      <Tooltip text="Oppgi passordet ditt for å logge inn.">
        <input
          type="password"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
        />
      </Tooltip>

      {/* Display Error Messages */}
      {error && <div className="text-red-600">{error}</div>}

      {/* Submit Button */}
      <button
        onClick={handleLogin}
        className={`w-full flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-2 font-semibold text-white shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logger inn...' : 'Logg inn'}
      </button>
    </div>
  );
};

export default LoginForm;
