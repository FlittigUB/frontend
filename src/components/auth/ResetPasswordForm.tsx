'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Tooltip from '@/components/common/ToolTip';
import axios from 'axios';
import { toast } from "sonner";

interface ResetPasswordFormProps {
  uuid: string;
}
const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ uuid }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [password, setPassword] = useState('');

  async function handleResetPassword() {
    if (!password || password.length < 8) {
      toast.error('Passordet må være minst 8 tegn');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/password-resets/${uuid}/complete`,
        {
          newPassword: password,
        },
      );

      if (response.status === 201) {
        toast.success('Ditt passord er oppdatert!');
        // Redirect to login page or another appropriate location
        router.push('/portal/logg-inn');
      } else {
        toast.error('Kunne ikke oppdatere passord. Prøv igjen');
      }
    } catch {
      toast.error(
        'An error occurred while resetting the password. Please try again later.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tooltip text="Oppgi nytt passord">
        <input
          type="password"
          placeholder="Nytt Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner transition duration-300 focus:ring-2 focus:ring-orange-500"
        />
      </Tooltip>
      <button
        onClick={handleResetPassword}
        className={`flex w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          isSubmitting ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Resetter Passord' : 'Reset Passord'}
      </button>
    </div>
  );
};

export default ResetPasswordForm;
