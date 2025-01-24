// components/common/ProgressIndicator.tsx
'use client';

import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ProgressIndicatorProps {
  currentStep: number;
  disabledSteps?: number[];
  onStepClick: (step: number) => void;
  isDarkMode: boolean;
  totalSteps?: number; // Added totalSteps prop
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  onStepClick,
  totalSteps = 4, // Default to 4 steps
}) => {
  // Define steps based on totalSteps
  let steps = [
    { number: 1, label: 'Rolle' },
    { number: 2, label: 'Brukervalg' },
    { number: 3, label: 'Informasjon' },
    { number: 4, label: 'Profil' },
  ];

  if (totalSteps === 3) {
    steps = [
      { number: 1, label: 'Rolle' },
      { number: 2, label: 'Informasjon' },
      { number: 3, label: 'Profil' },
    ];
  }

  return (
    <div className="mb-8 w-full max-w-md">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Indicator */}
            <button
              onClick={() => onStepClick(index + 1)}
              disabled={index + 1 > currentStep}
              className={`relative z-10 flex flex-col items-center focus:outline-none ${
                index + 1 <= currentStep
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed'
              }`}
              aria-label={`Step ${index + 1}: ${step.label}`}
            >
              <div
                className={`flex h-12 w-12 transform items-center justify-center rounded-full transition-transform duration-300 ${
                  currentStep > index + 1
                    ? 'scale-110 bg-orange-500 text-white'
                    : currentStep === index + 1
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                } shadow-lg ${
                  index + 1 <= currentStep
                    ? 'hover:bg-orange-600 focus:ring-2 focus:ring-orange-500'
                    : ''
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="mt-2 text-sm text-gray-700">{step.label}</span>
            </button>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="pointer-events-none absolute left-1/2 top-6 flex w-full -translate-x-1/2 transform items-center justify-between">
                <div
                  className={`h-1 w-full transition-all duration-300 ${
                    currentStep > index + 1 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
