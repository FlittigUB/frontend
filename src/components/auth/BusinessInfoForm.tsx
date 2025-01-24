import React, { useState } from 'react';
import Tooltip from "@/components/common/ToolTip";

interface BusinessInfoFormProps {
  // Organization number
  orgNumber: string;
  setOrgNumber: (value: string) => void;

  // Existing fields
  email: string;
  setEmail: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  mobile: string;
  setMobile: (value: string) => void;

  // Navigation
  handleBack: () => void;
  handleNext: () => void;

  // Error
  error: string;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
                                                             orgNumber,
                                                             setOrgNumber,
                                                             email,
                                                             setEmail,
                                                             name,
                                                             setName,
                                                             password,
                                                             setPassword,
                                                             confirmPassword,
                                                             setConfirmPassword,
                                                             mobile,
                                                             setMobile,
                                                             handleBack,
                                                             handleNext,
                                                             error,
                                                           }) => {
  // Local states
  const [orgLookupError, setOrgLookupError] = useState<string>("");
  const [orgFetched, setOrgFetched] = useState<boolean>(false);

  const handleFetchOrganization = async () => {
    setOrgLookupError("");

    if (!orgNumber) {
      setOrgLookupError("Vennligst oppgi et organisasjonsnummer.");
      setOrgFetched(false);
      return;
    }

    try {
      const response = await fetch(
        `https://data.brreg.no/enhetsregisteret/api/enheter/${orgNumber}`
      );

      if (!response.ok) {
        setOrgLookupError("Fant ikke organisasjonen. Sjekk organisasjonsnummeret og prøv igjen.");
        setOrgFetched(false);
        return;
      }

      const data = await response.json();
      // Fill in form fields
      setName(data.navn || "");

      // Mark that we have fetched org data so we show the rest of the fields
      setOrgFetched(true);

    } catch {
      setOrgLookupError("Noe gikk galt under henting av data. Prøv igjen senere.");
      setOrgFetched(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl p-8 transition-opacity duration-500">
      <h1 className="text-2xl font-bold text-gray-800">Bedrift Informasjon 📝</h1>

      {/* Organization Number Field */}
      <Tooltip text="Skriv inn organisasjonsnummer for å hente firmaopplysninger fra Brønnøysundregisteret">
        <div className="flex flex-col">
          <label htmlFor="orgNumber" className="mb-2 text-gray-700 dark:text-gray-300">
            Organisasjonsnummer <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              id="orgNumber"
              type="text"
              placeholder="914939828"
              value={orgNumber}
              onChange={(e) => {
                setOrgNumber(e.target.value);
                setOrgFetched(false); // If user changes orgNumber, hide other fields again
              }}
              className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
            />
            <button
              type="button"
              onClick={handleFetchOrganization}
              className="rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Hent
            </button>
          </div>
          {orgLookupError && (
            <div className="mt-2 text-red-600">{orgLookupError}</div>
          )}
        </div>
      </Tooltip>

      {/* Only show the rest of the form if org data was successfully fetched */}
      {orgFetched && (
        <div className="space-y-4">
          {/* Email Field */}
          <Tooltip text="Vi trenger din e-post for å kontakte deg!">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 text-gray-700 dark:text-gray-300">
                Epost <span className="text-red-500">*</span>
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
          <Tooltip text="Ditt fulle Selskapsnavn, som vist på registeret! Du kan redigere om ønskelig.">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 text-gray-700 dark:text-gray-300">
                Selskapsnavn <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Flittig UB"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 p-4 text-gray-800 shadow-inner focus:ring-2 focus:ring-orange-500 transition duration-300"
                required
              />
            </div>
          </Tooltip>

          {/* Phone Number Field */}
          <Tooltip text="Vennligst oppgi ditt mobilnummer for kontaktformål!">
            <div className="flex flex-col">
              <label htmlFor="mobile" className="mb-2 text-gray-700 dark:text-gray-300">
                Mobilnummer <span className="text-red-500">*</span>
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
                Passord <span className="text-red-500">*</span>
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
                Bekreft Passord <span className="text-red-500">*</span>
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
      )}

      {/* Display Form-level Error Messages */}
      {error && <div className="text-red-600 mt-2">{error}</div>}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center rounded-2xl bg-gray-200 px-6 py-2 font-semibold text-gray-800 shadow-md hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Tilbake
        </button>
        {/* If you only want the "Neste" button to work after success, you can also disable it if !orgFetched */}
        <button
          onClick={handleNext}
          disabled={!orgFetched}
          className={`flex items-center justify-center rounded-2xl px-6 py-2 font-semibold text-white shadow-md transition-colors duration-300 focus:outline-none 
            ${orgFetched ? 'bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-400' : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          Neste
        </button>
      </div>
    </div>
  );
};

export default BusinessInfoForm;
