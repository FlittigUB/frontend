// src/components/portal/job/JobModal.tsx
import React, { useCallback, useState, useEffect } from 'react';
import { Category, JobFormData } from '@/common/types';
import AddressSearch from './AddressSearch';
import { FaArrowRight, FaMapMarkerAlt, FaInfoCircle, FaList, FaDollarSign } from 'react-icons/fa';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: JobFormData;
  categories: Category[];
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  error: string;
  isEdit?: boolean;
  isSubmitting: boolean;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

const MAX_DESCRIPTION_LENGTH = 200;

const JobModal: React.FC<JobModalProps> = ({
                                             isOpen,
                                             onClose,
                                             onSubmit,
                                             formData,
                                             categories,
                                             handleInputChange,
                                             error,
                                             isEdit = false,
                                             isSubmitting,
                                           }) => {

  // Steps: 0 => Title & Description, 1 => Address / Position, 2 => Date/Category, 3 => Payment Info
  const [step, setStep] = useState<number>(0);

  // Display lines for the chosen address
  const [selectedAddressLines, setSelectedAddressLines] = useState<string[] | null>(null);

  // Step-specific error
  const [stepError, setStepError] = useState<string>('');

  // Track description length
  const [descriptionCount, setDescriptionCount] = useState<number>(
    formData.description?.length || 0
  );
  useEffect(() => {
    setDescriptionCount(formData.description?.length || 0);
  }, [formData.description]);

  // Handler from AddressSearch
  const handleSelectLocation = useCallback(
    (lat: number, lon: number, displayName: string, addressDetails?: NominatimAddress) => {
      // Update lat/lon in formData
      const latitudeInputEvent = {
        target: { name: 'latitude', value: lat },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(latitudeInputEvent);

      const longitudeInputEvent = {
        target: { name: 'longitude', value: lon },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(longitudeInputEvent);

      if (addressDetails) {
        const lines: string[] = [
          addressDetails.road,
          addressDetails.city,
          addressDetails.county,
          addressDetails.state,
          addressDetails.postcode,
          addressDetails.country,
        ].filter(Boolean) as string[];
        setSelectedAddressLines(lines.length ? lines : [displayName]);
      } else {
        const splitted = displayName.split(',').map((s) => s.trim());
        setSelectedAddressLines(splitted);
      }
    },
    [handleInputChange],
  );

  // “Bruk min nåværende posisjon”
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolokasjon er ikke støttet i denne nettleseren.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitudeInputEvent = {
          target: { name: 'latitude', value: pos.coords.latitude },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(latitudeInputEvent);

        const longitudeInputEvent = {
          target: { name: 'longitude', value: pos.coords.longitude },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(longitudeInputEvent);

        setSelectedAddressLines(['Nåværende posisjon']);
      },
      (err) => {
        console.error('Error fetching geolocation:', err);
        alert('Kunne ikke hente posisjon. Sjekk at du har gitt tillatelse.');
      }
    );
  }, [handleInputChange]);

  // If modal is not open, return null
  if (!isOpen) return null;

  const stepLabels = ['Grunnleggende Info', 'Posisjon', 'Detaljer', 'Betalingsinformasjon'];
  const progressPercent = ((step + 1) / stepLabels.length) * 100;

  // Definer ikoner for hvert steg
  const stepIcons = [
    <FaInfoCircle key="icon-0" />,      // Grunnleggende Info
    <FaMapMarkerAlt key="icon-1" />,    // Posisjon
    <FaList key="icon-2" />,            // Detaljer
    <FaDollarSign key="icon-3" />,      // Betalingsinformasjon
  ];

  // Validate fields per step
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 0) {
      if (!formData.title?.trim()) {
        setStepError('Tittel er påkrevd.');
        return false;
      }
      if (!formData.description?.trim()) {
        setStepError('Beskrivelse er påkrevd.');
        return false;
      }
      if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
        setStepError(`Beskrivelse kan ikke overstige ${MAX_DESCRIPTION_LENGTH} tegn.`);
        return false;
      }
    } else if (currentStep === 1) {
      if (!formData.latitude || !formData.longitude) {
        setStepError('Posisjon er påkrevd.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.scheduled_at) {
        setStepError('Tilgjengelig dato er påkrevd.');
        return false;
      }
      if (!formData.category) {
        setStepError('Kategori er påkrevd.');
        return false;
      }
    } else if (currentStep === 3) {
      if (formData.rate === undefined || formData.rate === null || formData.rate === 0) {
        setStepError('Honorar er påkrevd.');
        return false;
      }
      if (!formData.payment_type) {
        setStepError('Betalingstype er påkrevd.');
        return false;
      }
      // Remove condition for hours_estimated based on payment_type
      // Now, it's always optional
    }
    setStepError('');
    return true;
  };

  // Step navigation
  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    if (step < stepLabels.length - 1) {
      e.preventDefault();
      nextStep();
    } else {
      // validate final step if needed
      if (!validateStep(step)) {
        e.preventDefault();
        return;
      }
      await onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {isEdit ? 'Rediger Jobb' : 'Opprett Ny Jobb'}
        </h2>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        {/* Progress Bar */}
        <div className="mb-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Step Labels */}
        <div className="mb-4 flex items-center justify-between text-sm">
          {stepLabels.map((label, index) => {
            const isActive = index === step;
            const isCompleted = index < step;
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center ${
                  isActive ? 'font-semibold text-primary' : 'text-gray-400'
                } ${isCompleted ? 'opacity-70' : ''}`}
              >
                {isActive ? (
                  <span>{label}</span>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700">
                      {stepIcons[index]}
                    </div>
                    <span className="mt-1">{index + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {stepError && (
          <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-2 text-red-700">
            {stepError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} noValidate>
          {/* STEP 0 */}
          {step === 0 && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block font-medium text-gray-700 dark:text-gray-200"
                >
                  Tittel <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Skriv inn tittel"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  required
                  className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded-md border p-2
                             focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-required="true"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block font-medium text-gray-700 dark:text-gray-200"
                >
                  Beskrivelse <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Skriv en kort beskrivelse"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded-md border p-2
                             focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-required="true"
                />
                <div className="mt-1 text-right text-sm text-gray-500 dark:text-gray-400">
                  {descriptionCount}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>
            </>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="mb-1 block font-medium text-gray-700 dark:text-gray-200">
                  Søk etter adresse
                </label>
                <AddressSearch onSelectLocation={handleSelectLocation} />

                {selectedAddressLines && (
                  <div className="mt-4 rounded-md border border-primary bg-primary bg-opacity-10 p-3">
                    <h4 className="mb-1 font-semibold text-primary">Valgt posisjon/område</h4>
                    {selectedAddressLines.map((line, idx) => (
                      <p key={idx} className="text-gray-700 dark:text-gray-200">
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2
                               font-medium text-white hover:bg-blue-700 focus:outline-none
                               focus:ring-2 focus:ring-blue-400"
                  >
                    <FaMapMarkerAlt className="mr-2" aria-hidden="true" />
                    Bruk min nåværende posisjon
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Planlagt dato
                </label>
                <input
                  type="date"
                  name="scheduled_at"
                  value={formData.scheduled_at || ''}
                  onChange={handleInputChange}
                  required
                  className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded-md border p-2
                             focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  required
                  className="dark:bg-background-dark dark:text-foreground-dark w-full rounded-md border p-2
                             focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="" disabled>
                    Velg en kategori
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex items-center">
                <label className="mr-4 font-medium text-gray-700 dark:text-gray-200">
                  Få e-postvarsel ved nye søknader?
                </label>
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={formData.email_notifications || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary
                             dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </>
          )}

          {/* STEP 3 - Payment Information */}
          {step === 3 && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="sats"
                  className="block font-medium text-gray-700 dark:text-gray-200"
                >
                  Sats (NOK) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sats"
                  type="number"
                  name="rate"
                  placeholder="Skriv inn sats"
                  value={formData.rate !== undefined && formData.rate !== null ? formData.rate : ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded-md border p-2
                             focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-required="true"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="payment_type"
                  className="block font-medium text-gray-700 dark:text-gray-200"
                >
                  Betalingstype <span className="text-red-500">*</span>
                </label>
                <select
                  id="payment_type"
                  name="payment_type"
                  value={formData.payment_type || ''}
                  onChange={handleInputChange}
                  required
                  className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded-md border p-2
                             focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-required="true"
                  defaultValue="" // Ensures placeholder is shown initially
                >
                  <option value="" disabled hidden>
                    Velg en betalingstype
                  </option>
                  <option value="fixed">Fast</option>
                  <option value="hourly">Timebasert</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="hours_estimated"
                  className="block font-medium text-gray-700 dark:text-gray-200"
                >
                  Estimerte Timer
                </label>
                <input
                  id="hours_estimated"
                  type="number"
                  name="hours_estimated"
                  placeholder="Skriv inn estimerte timer"
                  value={formData.hours_estimated !== undefined && formData.hours_estimated !== null ? formData.hours_estimated : ''}
                  onChange={handleInputChange}
                  min="1"
                  className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded-md border p-2
                             focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </>
          )}

          {/* Step Navigation */}
          <div className="mt-6 flex justify-between space-x-2">
            <button
              type="button"
              onClick={() => {
                if (step === 0) {
                  onClose();
                } else {
                  prevStep();
                }
              }}
              disabled={isSubmitting}
              aria-label={step === 0 ? 'Avbryt' : 'Gå tilbake til forrige steg'}
              className="inline-flex items-center rounded-md bg-gray-300 px-4 py-2
                         font-medium text-gray-700 hover:bg-gray-400 focus:outline-none
                         focus:ring-2 focus:ring-gray-400 disabled:opacity-70"
            >
              {step === 0 ? 'Avbryt' : 'Tilbake'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-label={step < stepLabels.length - 1 ? 'Neste steg' : 'Send inn'}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 font-medium text-white
                         hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark
                         disabled:opacity-70"
            >
              {step < stepLabels.length - 1 ? (
                <>
                  Neste
                  <FaArrowRight className="ml-2" aria-hidden="true" />
                </>
              ) : isSubmitting ? (
                'Lagrer...'
              ) : isEdit ? (
                'Oppdater'
              ) : (
                'Opprett'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
