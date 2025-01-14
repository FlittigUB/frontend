// app/portal/stillinger/[slug]/JobContext.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { Job } from '@/common/types';

interface JobContextProps {
  job: Job;
}

const JobContext = createContext<JobContextProps | undefined>(undefined);

/**
 * Provider component to supply job data to child components.
 */
export const JobProvider: React.FC<{ job: Job; children: React.ReactNode }> = ({ job, children }) => {
  return <JobContext.Provider value={{ job }}>{children}</JobContext.Provider>;
};

/**
 * Custom hook to consume job data from context.
 */
export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context.job;
};
