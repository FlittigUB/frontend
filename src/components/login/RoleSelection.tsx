// components/login/RoleSelection.tsx
import React from 'react';
import Image from 'next/image'

interface RoleSelectionProps {
  onSelectRole: (role: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8">
      <div className="flex flex-col items-center">
        {/* Mascot Image (Without Bouncing Animation) */}
        <div className="h-40 w-40 relative">
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}722b612f-b083-4a34-bef7-4b884bbeb2dc.png`} // Replace with actual path
            alt="Mascot"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Velkommen! 🎉
        </h1>
        <p className="text-center text-gray-600">
          La oss starte registreringen ved å velge din rolle.
        </p>
      </div>
      {/* Role Selection Buttons Without Images */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelectRole('arbeidsgiver')}
          className="flex items-center justify-center rounded-2xl bg-orange-300 px-4 py-6 text-gray-800 shadow-lg hover:bg-orange-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Arbeidsgiver
        </button>
        <button
          onClick={() => onSelectRole('arbeidstaker')}
          className="flex items-center justify-center rounded-2xl bg-orange-300 px-4 py-6 text-gray-800 shadow-lg hover:bg-orange-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Arbeidstaker
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
