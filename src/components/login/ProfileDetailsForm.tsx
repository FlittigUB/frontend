// components/ProfileDetailsForm.tsx
import React from 'react';
import Image from 'next/image';
import Tooltip from "@/components/common/ToolTip";

interface ProfileDetailsFormProps {
  bio: string;
  setBio: (value: string) => void;
  image: File | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleRegister: () => void;
  error: string;
  success: string;
  isSubmitting: boolean;
}

const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
                                                                 bio,
                                                                 setBio,
                                                                 image,
                                                                 handleImageChange,
                                                                 handleBack,
                                                                 handleRegister,
                                                                 error,
                                                                 success,
                                                                 isSubmitting,
                                                               }) => {
  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl p-8 transition-opacity duration-500">
      <h1 className="text-2xl font-bold text-gray-800">
        Profil Detaljer 🎨
      </h1>
      <div className="space-y-4">
        {/* Bio Field */}
        <Tooltip text="Fortell oss litt om deg selv!">
          <div className="flex flex-col">
            <label htmlFor="bio" className="mb-2 text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              id="bio"
              placeholder="Skriv noe om deg selv..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
              rows={4}
            ></textarea>
          </div>
        </Tooltip>

        {/* Image Upload Field */}
        <Tooltip text="Last opp et profilbilde!">
          <div className="flex flex-col">
            <label htmlFor="profileImage" className="mb-2 text-gray-700 dark:text-gray-300">
              Profilbilde
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-2xl border border-gray-300 p-2 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
            />
            {/* Instructional Text */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Last opp et bilde av deg selv for din profilside. Dette kan endres senere.
            </p>
          </div>
        </Tooltip>

        {/* Preview Selected Image */}
        {image && (
          <div className="mt-4 flex justify-center">
            <Image
              src={URL.createObjectURL(image)}
              alt="Selected Image"
              width={100}
              height={100}
              className="rounded-full object-cover shadow-md"
            />
          </div>
        )}
      </div>
      {/* Display Error or Success Messages */}
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center rounded-2xl bg-gray-200 px-6 py-2 font-semibold text-gray-800 shadow-md hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Tilbake
        </button>
        <button
          onClick={handleRegister}
          className={`flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrerer...' : 'Registrer'}
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
