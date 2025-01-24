import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Image from "next/image";
import React from "react";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

const ResetPasswordPage = async ({ params }: PageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}722b612f-b083-4a34-bef7-4b884bbeb2dc.png`} // Replace with your actual mascot image path
              alt="Mascot"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Tilbakestill Passord</h1>
          <p className="text-center text-gray-600 mb-6">Her kan du tilbakestille passordet ditt.</p>
          <ResetPasswordForm uuid={(await params).uuid} />
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
