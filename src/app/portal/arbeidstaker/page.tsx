// app/portal/arbeidstaker/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import JobList from '@/components/portal/job/JobList';
import { Job } from '@/common/types';
import PortalLayout from "@/components/portal/PortalLayout";
import Image from "next/image";

// TODO: Protect endpoint to Arbeidstaker
const ArbeidstakerHomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Fetch jobs from your API or data source
    // Replace the placeholder data with actual API calls
    const fetchJobs = async () => {
      const fetchedJobs: Job[] = [
        {
          id: '1',
          title: 'Barnepass',
          description: 'Vi søker barnepass for sønnen vår',
          place: 'Søm',
          dateAccessible: '2024-12-01',
        },
        {
          id: '2',
          title: 'Barnepass',
          description: 'Vi trenger vaskehjelp hjemme hos oss',
          place: 'Vågsbygd',
          dateAccessible: '2024-12-15',
        },
        // Add more jobs as needed
      ];
      setJobs(fetchedJobs);
    };

    fetchJobs();
  }, []);

  return (
    <PortalLayout>
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}b8c19b1d-652e-4ac1-9bbd-fd95ef7f4ff4.png`}
        alt="Flittig UB Logo"
        className="mx-auto md:mx-0 my-0"
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
        className="shadow-neumorphic dark:bg-background-dark dark:text-foreground-dark dark:shadow-neumorphic-dark mb-6 w-full rounded-lg bg-background p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Jobbliste */}
      <JobList jobs={jobs} />
    </PortalLayout>
  );
};

export default ArbeidstakerHomePage;
