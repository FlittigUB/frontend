'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Job, Application } from '@/common/types';
import { useAuthContext } from '@/context/AuthContext';
import JobItem from "@/components/portal/job/JobItem";

const ArbeidstakerHomePage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { token } = useAuthContext();

  const [dismissedTaxWarning, setDismissedTaxWarning] = useState(false);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await axios.get<Job[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/job/all`,
        );
        setJobs(response.data)
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchFeaturedJobs();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        const response = await axios.get<Application[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [token]);

  // -------------------------------------------
  // 1) Calculate STATS from "confirmed" apps
  // -------------------------------------------
  const confirmedApps = applications.filter((app) => app.status === 'confirmed');

  // 1a) Total confirmed jobs
  const totalConfirmedJobs = confirmedApps.length;

  // 1b) Total hours from confirmed jobs
  const totalConfirmedHours = confirmedApps.reduce((sum, app) => {
    return sum + (app.job?.hours_estimated || 0);
  }, 0);

  // 1c) Confirmed payout
  const totalConfirmedPayment = confirmedApps.reduce((sum, app) => {
    const { payment_type, rate, hours_estimated } = app.job;
    if (payment_type === 'hourly') {
      return sum + rate * (hours_estimated || 0);
    }
    return sum + rate;
  }, 0);

  // -------------------------------------------
  // 2) Calculate "potential" (upcoming) money
  // -------------------------------------------
  const potentialApps = applications.filter(
    (app) => app.status === 'approved' || app.status === 'finished',
  );

  // 2a) Potential payout
  const totalPotentialPayment = potentialApps.reduce((sum, app) => {
    const { payment_type, rate, hours_estimated } = app.job;
    if (payment_type === 'hourly') {
      return sum + rate * (hours_estimated || 0);
    }
    return sum + rate;
  }, 0);

  // -------------------------------------------
  // 3) "Upcoming Jobs"
  // -------------------------------------------
  const now = new Date();
  const approvedFutureApps = applications.filter((app) => {
    const scheduledDate = new Date(app.job.scheduled_at);
    return app.status === 'approved' && scheduledDate > now;
  });
  const upcomingJobs: Job[] = approvedFutureApps.map((app) => app.job);

  // -------------------------------------------
  // 4) Show Tax Warning if close to 6000kr
  // -------------------------------------------
  const totalEarnings = totalConfirmedPayment + totalPotentialPayment;
  const showTaxWarning = !dismissedTaxWarning && totalEarnings >= 6000;
  // Adjust the threshold as you see fit if you want
  // "close to" 6000 rather than strictly >= 6000.

  return (
    <div className="container mx-auto px-4 py-6">

      {/* — Tax Warning Banner — */}
      {showTaxWarning && (
        <div className="mb-4 flex items-center justify-between rounded border-2 border-red-500 bg-red-50 p-4 shadow-lg">
          <p className="text-red-700">
            Du begynner å nærme deg 6000 kr i samlet inntjening. Husk å sjekke
            <strong> Skatteetaten</strong> for eventuelle skatteplikter.
          </p>
          <button
            onClick={() => setDismissedTaxWarning(true)}
            className="ml-4 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Lukk
          </button>
        </div>
      )}

      {/* Logo / Image */}
      <div className="flex justify-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}77d7252d-b736-45d6-b344-421434c9208f.png`}
          alt="Tre flittige bevere"
          className="mx-auto my-0 md:mx-0"
          width={500}
          height={300}
        />
      </div>

      {/* Header */}
      <h1 className="mt-4 text-2xl font-bold">Velkommen til Flittig</h1>
      <p className="text-gray-600">Din personlige portal for småjobber</p>
      {/* Links to other pages */}
      <div className="mt-6 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Link
          href="/portal/stillinger"
          className="rounded bg-blue-500 px-4 py-2 text-white shadow hover:opacity-90"
        >
          Se stillinger
        </Link>
        <Link
          href="/portal/mine-soknader"
          className="rounded bg-green-500 px-4 py-2 text-white shadow hover:opacity-90"
        >
          Mine søknader
        </Link>
      </div>

      {/* Section: Latest or Recommended Jobs */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Nye stillinger</h2>
        <p className="text-sm text-gray-600">
          Noen av de siste småjobbene du kan søke på
        </p>

        {jobs.length === 0 ? (
          <p>Ingen ledige stillinger akkurat nå.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {jobs.slice(0, 2).map((job) => (
              <JobItem key={job.id} job={job} />
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link href="/portal/stillinger" className="text-blue-600 hover:underline">
            Se alle stillinger &rarr;
          </Link>
        </div>
      </div>


      {/* Explanation: Confirmed vs. Potential */}
      <div className="mt-6 rounded bg-blue-50 p-4 text-sm text-gray-700">
        <p className="mb-2">
          <strong>Om statistikken:</strong>
        </p>
        <p className="mb-1">
          <strong>Bekreftet </strong> betyr at du har merket jobben
          som ferdig, og arbeidsgiveren har godkjent. Betaling er dermed
          garantert.
        </p>
        <p className="mb-1">
          <strong>Potensiell inntjening</strong> inkluderer jobber du har
          fått godkjent eller merket som ferdig men som arbeidsgiver ennå ikke har bekreftet.
        </p>
      </div>

      {/* Stats Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Statistikk</h2>
        <p className="text-sm text-gray-600">
          Oppdatert basert på dine søknader
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: Bekreftede jobber */}
          <div className="rounded bg-white p-4 shadow hover:shadow-md">
            <p className="text-gray-800">Bekreftede jobber</p>
            <p className="mt-1 text-2xl font-bold">{totalConfirmedJobs}</p>
          </div>

          {/* Card 2: Timer bekreftet */}
          <div className="rounded bg-white p-4 shadow hover:shadow-md">
            <p className="text-gray-800">Timer bekreftet</p>
            <p className="mt-1 text-2xl font-bold">{totalConfirmedHours}</p>
          </div>

          {/* Card 3: Inntjening bekreftet */}
          <div className="rounded bg-white p-4 shadow hover:shadow-md">
            <p className="text-gray-800">Inntjening bekreftet (kr)</p>
            <p className="mt-1 text-2xl font-bold">{totalConfirmedPayment} kr</p>
          </div>

          {/* Potential Earning Card */}
          <div className="rounded bg-white p-4 shadow hover:shadow-md sm:col-span-3 md:col-span-1">
            <p className="text-gray-800">Potensiell inntjening (kr)</p>
            <p className="mt-1 text-2xl font-bold">
              {totalPotentialPayment} kr
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold">Kommende jobber</h2>
        <p className="text-sm text-gray-600">
          Jobber som er godkjent av arbeidsgiver og ikke startet ennå
        </p>
        <div className="mt-4">
          {upcomingJobs.length === 0 ? (
            <p>Ingen kommende jobber akkurat nå.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingJobs.map((job) => (
                <li key={job.id}>
                  <Link href={`/portal/stillinger/${job.slug}`}>
                    <div className="transform rounded-lg bg-white p-6 shadow-lg transition hover:scale-[1.02] hover:shadow-xl">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {job.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {job.description || 'Ingen beskrivelse'}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Dato:{' '}
                        {new Date(job.scheduled_at).toLocaleDateString('no-NO')}
                      </p>
                      <div className="mt-4 border-t pt-4 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Betaling:</span>{' '}
                          {job.payment_type === 'hourly'
                            ? `${job.rate} kr/t`
                            : `${job.rate} kr (fast)`}
                        </p>
                        <p>
                          <span className="font-medium">Estimert tid:</span>{' '}
                          {job.hours_estimated} timer
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Additional Suggestions or Info */}
      <div className="mt-8 rounded bg-gray-50 p-4 text-sm text-gray-600">
        <p>
          <strong>Tips:</strong> Husk å oppdatere statusen på jobben så snart du
          er ferdig, slik at arbeidsgiver kan bekrefte og du mottar betaling.
        </p>
      </div>
    </div>
  );
};

export default ArbeidstakerHomePage;
