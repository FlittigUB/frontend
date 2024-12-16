// components/PersonalInfoForm.tsx
import React from 'react';
import Tooltip from "@/components/common/ToolTip";

interface PersonalInfoFormProps {
  email: string;
  setEmail: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  birthdate: string;
  setBirthdate: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  mobile: string; // New prop for mobile number
  setMobile: (value: string) => void; // Setter for mobile number
  handleBack: () => void;
  handleNext: () => void;
  error: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
                                                             email,
                                                             setEmail,
                                                             name,
                                                             setName,
                                                             birthdate,
                                                             setBirthdate,
                                                             password,
                                                             setPassword,
                                                             confirmPassword,
                                                             setConfirmPassword,
                                                             mobile, // Destructure mobile
                                                             setMobile, // Destructure setMobile
                                                             handleBack,
                                                             handleNext,
                                                             error,
                                                           }) => {
  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl p-8 transition-opacity duration-500">
      <h1 className="text-2xl font-bold text-gray-800">
        Personlig Informasjon 📝
      </h1>
      <div className="space-y-4">
        {/* Email Field */}
        <Tooltip text="Vi trenger din e-post for å kontakte deg!">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 text-gray-700 dark:text-gray-300">
              Epost
            </label>
            <input
              id="email"
              type="email"
              placeholder="Epost"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>
        </Tooltip>

        {/* Name Field */}
        <Tooltip text="Ditt fulle navn, som vist på ID!">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 text-gray-700 dark:text-gray-300">
              Navn
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ola Normann"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>
        </Tooltip>

        {/* Birthdate Field */}
        <Tooltip text="Din fødselsdato for aldersverifisering!">
          <div className="flex flex-col">
            <label htmlFor="birthdate" className="mb-2 text-gray-700 dark:text-gray-300">
              Fødselsdato
            </label>
            <input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>
        </Tooltip>

        {/* Phone Number Field */}
        <Tooltip text="Vennligst oppgi ditt mobilnummer for kontaktformål!">
          <div className="flex flex-col">
            <label htmlFor="mobile" className="mb-2 text-gray-700 dark:text-gray-300">
              Mobilnummer
            </label>
            <input
              id="mobile"
              type="tel"
              placeholder="123 45 678"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>
        </Tooltip>

        {/* Password Field */}
        <Tooltip text="Velg et sterkt passord!">
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 text-gray-700 dark:text-gray-300">
              Passord
            </label>
            <input
              id="password"
              type="password"
              placeholder="Passord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>
        </Tooltip>

        {/* Confirm Password Field */}
        <Tooltip text="Bekreft passordet ditt!">
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-2 text-gray-700 dark:text-gray-300">
              Bekreft Passord
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Bekreft passord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>
        </Tooltip>
      </div>
      {/* Display Error Messages */}
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center rounded-2xl bg-gray-200 px-6 py-2 font-semibold text-gray-800 shadow-md hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Tilbake
        </button>
        <button
          onClick={handleNext}
          className="flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-2 font-semibold text-white shadow-md hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Neste
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
