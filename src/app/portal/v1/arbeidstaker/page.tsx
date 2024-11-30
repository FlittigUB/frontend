'use client';

import React, { useState, useEffect } from 'react';
import JobList from '@/components/portal/v1/JobList';
import { Job } from '@/common/types';
import PortalLayout from '@/components/portal/v1/PortalLayout';

const ArbeidstakerHomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Fetch jobs from your API or data source
    const fetchJobs = async () => {
      const fetchedJobs: Job[] = [
        {
          id: '1',
          title: 'Barnepass',
          description: 'Vi søker barnepass for sønnen vår',
          place: 'Oslo',
          dateAccessible: '2024-12-01',
        },
        {
          id: '2',
          title: 'Vaskehjelp',
          description: 'Vi trenger vaskehjelp hjemme hos oss',
          place: 'Bergen',
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
      <h1 className="mb-4 text-3xl font-bold text-[#000000]">Velkommen til Flittig</h1>
      <p className="mb-6 text-[#333333]">
        Finn relevante jobber nær deg og søk etter nye muligheter.
      </p>

      {/* Søkelinje */}
      <input
        type="text"
        placeholder="Søk etter jobber..."
        className="mb-6 w-full rounded-lg border-2 border-black bg-white p-3 text-[#333333] focus:outline-none"
      />

      {/* Jobbliste */}
      <JobList jobs={jobs} />
    </PortalLayout>
  );
};

export default ArbeidstakerHomePage;
