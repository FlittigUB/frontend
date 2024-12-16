// app/portal/arbeidstaker/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import JobList from '@/components/portal/job/JobList';
import { Job } from '@/common/types';
import Image from "next/image";

// TODO: Protect endpoint to Arbeidstaker
const ArbeidstakerHomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Fetch jobs from your API or data source
    // Replace the placeholder data with actual API calls
    const fetchJobs = async () => {
      const fetchedJobs: Job[] = [];
      setJobs(fetchedJobs);
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}b8c19b1d-652e-4ac1-9bbd-fd95ef7f4ff4.png`}
        alt="Flittig UB Logo"
        className="mx-auto my-0 md:mx-0"
        width={200}
        height={100}
      />
      <h1 className="mb-4 text-3xl font-bold">Velkommen til Flittig</h1>
      <p className="mb-6">
        Finn relevante jobber nær deg og søk etter nye muligheter.
      </p>

      {/* Søkelinje */}
      <input
        type="text"
        placeholder="Søk etter jobber..."
        className="dark:bg-background-dark dark:text-foreground-dark mb-6 w-full rounded-lg bg-background p-3 text-foreground shadow-neumorphic focus:outline-none focus:ring-2 focus:ring-primary dark:shadow-neumorphic-dark"
      />

      {/* Jobbliste */}
      <JobList jobs={jobs} isEmployerView={false} />
    </>
  );
};

export default ArbeidstakerHomePage;
