// components/ProgressIndicator.tsx
'use client';

import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Optional: For checkmark icon

interface ProgressIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  isDarkMode: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: 'Rolle' },
    { number: 2, label: 'Informasjon' },
    { number: 3, label: 'Profil' },
  ];

  return (
    <div className="mb-8 w-full max-w-md">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Indicator */}
            <button
              onClick={() => onStepClick(step.number)}
              disabled={step.number > currentStep + 1}
              className={`flex flex-col items-center relative z-10 focus:outline-none ${
                step.number <= currentStep + 1 ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              aria-label={`Step ${step.number}: ${step.label}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform transform duration-300 ${
                  currentStep >= step.number
                    ? 'bg-orange-500 text-white scale-110'
                    : 'bg-gray-300 text-gray-600'
                } shadow-lg
                ${
                  step.number <= currentStep + 1
                    ? 'hover:bg-orange-600 focus:ring-2 focus:ring-orange-500'
                    : ''
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <span className="mt-2 text-sm text-gray-700">{step.label}</span>
            </button>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full flex justify-between items-center pointer-events-none">
                <div
                  className={`w-full h-1 transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-orange-500'
                      : 'bg-gray-300'
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
