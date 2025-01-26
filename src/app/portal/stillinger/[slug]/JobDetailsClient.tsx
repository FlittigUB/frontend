'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { useAuthContext } from '@/context/AuthContext';
import { Application } from '@/common/types';
import { FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import Image from 'next/image';
import { usePortalLayout } from '@/components/portal/PortalLayout';
import { IoIosTimer } from 'react-icons/io';
import Review from '@/components/portal/job/Review';

import { useJob } from './JobContext';
import Link from 'next/link';

//
// 1. We assume these are the possible statuses in your backend:
//    waiting, approved, declined, finished, confirmed.
//
const statusDetails: Record<string, { label: string; description: string }> = {
  waiting: {
    label: 'Venter godkjenning',
    description: 'Din søknad er mottatt og venter på arbeidsgivers vurdering.',
  },
  approved: {
    label: 'Akseptert',
    description: 'Din søknad er godkjent av arbeidsgiver.',
  },
  declined: {
    label: 'Avslått',
    description: 'Din søknad er avslått av arbeidsgiver.',
  },
  finished: {
    label: 'Fullført',
    description: 'Jobben er fullført. Du kan nå bekrefte fullføringen.',
  },
  confirmed: {
    label: 'Bekreftet fullført',
    description: 'Jobben er bekreftet fullført. Nå kan du gi en vurdering.',
  },
};

//
// 2. Helper to safely get label/description.
//    If we get a new or unexpected status from the server, we won't crash;
//    we just return a fallback.
//
function getStatusInfo(status: string) {
  return (
    statusDetails[status] || {
      label: 'Ukjent status',
      description: 'Status ble ikke gjenkjent.',
    }
  );
}

export default function JobDetailsClient() {
  const job = useJob();
  const { loggedIn, user, token, userRole } = useAuthContext();
  const { openChatWithReceiver } = usePortalLayout();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [applications, setApplications] = useState<Application[]>([]);
  const [userApplication, setUserApplication] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Check if the current user is the owner of this job
  const isOwner = user && job.user && user.id === job.user.id;

  // Preload the employer's image or store null
  useEffect(() => {
    if (job.user?.image) {
      setPreviewImage(`${process.env.NEXT_PUBLIC_ASSETS_URL}${job.user.image}`);
    } else {
      setPreviewImage(null);
    }
  }, [job.user?.image]);

  // If logged in, fetch applications
  useEffect(() => {
    if (!loggedIn || !token) return;
    setLoading(true);

    axios
      .get<Application[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/job/${job.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        const fetched = res.data;
        setApplications(fetched);

        // If arbeidstaker, see if user has an existing application
        if (userRole === 'arbeidstaker' && user) {
          const existing = fetched.find((app) => app.user.id === user.id);
          if (existing) setUserApplication(existing);
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Feil ved henting av søknader.';
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loggedIn, token, user, userRole, job.id]);

  // Submit application (arbeidstaker)
  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!token || !user) throw new Error('Uautorisert.');
      const payload = { job: job.id, user: user.id };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success('Søknaden er sendt!');
      setUserApplication(response.data);
      setApplications((prev) => [...prev, response.data]);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Kunne ikke sende søknaden.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Approve (arbeidsgiver & owner only)
  const handleApprove = async (applicationId: string) => {
    try {
      // Double-check local side that only owner can do this
      if (!isOwner) {
        toast.error('Kun eier av jobben kan godkjenne søknader.');
        return;
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status: 'approved' } : a,
        ),
      );
      toast.success('Søknaden ble godkjent!');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Kunne ikke godkjenne søknaden.';
      toast.error(msg);
    }
  };

  // Decline (arbeidsgiver & owner only)
  const handleDecline = async (applicationId: string) => {
    try {
      // Double-check local side that only owner can do this
      if (!isOwner) {
        toast.error('Kun eier av jobben kan avslå søknader.');
        return;
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'declined' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Also update local state to `declined` for consistency
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'declined' } : a)),
      );
      toast.success('Søknaden ble avslått.');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Kunne ikke avslå søknaden.';
      toast.error(msg);
    }
  };

  // Quick loading indicator
  if (loading) {
    return (
      <div className="flex justify-center p-10 text-gray-600">
        Laster inn data ...
      </div>
    );
  }

  // We'll display either position.formattedAddress or a fallback
  const displayLocation =
    job.position?.neighbourhood || job.position?.city || 'Ukjent sted';

  // Display payment info
  const displayPayment = () => {
    if (job.payment_type === 'hourly') {
      return `${job.rate} NOK / time`;
    }
    return `${job.rate} NOK (fast pris)`;
  };

  // Simple counters for total vs. approved applications
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const totalApps = applications.length;

  return (
    <div className="mx-auto my-8 w-full max-w-5xl px-4">
      {/* The big pastel card */}
      <div className="min-h-[400px] rounded-xl bg-yellow-50 p-6 shadow-sm">
        {/* Title & Category & Availability */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{job.title}</h1>
            {/* Category as a pill */}
            {job.category && (
              <span className="mt-1 inline-block rounded-full bg-yellow-200 px-3 py-1 text-sm text-gray-700">
                {job.category.name}
              </span>
            )}
          </div>
          {/* Available date/time */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-7 8h.01M12 14v.01M7 17v.01M12 17v.01M17 17v.01M3 7h18M4 21h16c1.1 0 2-.9 2-2V7H2v12c0 1.1.9 2 2 2z"
              />
            </svg>
            <span>
              Planlagt tidspunkt:{' '}
              {new Date(job.scheduled_at).toLocaleString('no-NO')}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-800">{job.description}</p>
        {/* Payment Information */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <FiDollarSign className="h-4 w-4 flex-shrink-0" />
          <span>{displayPayment()}</span>
        </div>
        {/* Hours */}
        {job.hours_estimated && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <FiClock className="h-4 w-4 flex-shrink-0" />
            <span>{job.hours_estimated} timer</span>
          </div>
        )}
        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <FiMapPin className="h-4 w-4 flex-shrink-0" />
          <span>{displayLocation}</span>
        </div>
        {/* Time */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <IoIosTimer className="h-4 w-4 flex-shrink-0" />
          <span>
            Planlagt klokkeslett:{' '}
            {new Date(job.scheduled_at).toLocaleTimeString('no-NO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-200" />

        {/* Employer info & chat button - use flex-wrap on small screens */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {previewImage ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 shadow-inner">
                <Image
                  src={previewImage}
                  width={50}
                  height={50}
                  alt="Arbeidsgiver"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300" />
            )}
            <div>
              <p className="font-medium text-gray-900">{job.user.name}</p>
              {/* Display email or phone if you want */}
              {job.user.email && (
                <p className="text-sm text-gray-600">{job.user.email}</p>
              )}
            </div>
          </div>
          {/* Chat button for any logged-in user */}
          {loggedIn && isOwner === false && (
            <button
              onClick={() => openChatWithReceiver(job.user.id)}
              className="inline-block rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Chat med arbeidsgiver
            </button>
          )}
        </div>

        {/* If not logged in => show a big CTA or message */}
        {!loggedIn && (
          <div className="mt-6">
            <a
              href="/portal/logg-inn"
              className="inline-block rounded-full bg-yellow-400 px-6 py-2 font-medium text-white hover:bg-yellow-500"
            >
              Logg inn for å søke
            </a>
          </div>
        )}

        {/* If arbeidstaker => show the user's application status or an apply button */}
        {loggedIn && userRole === 'arbeidstaker' && (
          <div className="mt-6">
            {userApplication ? (
              <div className="text-sm text-gray-700">
                {/* Use our fallback helper so no crash if the status is unknown */}
                <p>
                  <strong>Status: </strong>
                  {getStatusInfo(userApplication.status).label}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {getStatusInfo(userApplication.status).description}
                </p>

                {userApplication.status === 'approved' && (
                  <p className="mt-1 text-green-600">
                    Gratulerer! Din søknad har blitt akseptert.
                  </p>
                )}
                {userApplication.status === 'declined' && (
                  <p className="mt-1 text-red-500">
                    Beklager, din søknad ble avslått.
                  </p>
                )}
                {userApplication.status === 'waiting' && (
                  <p className="mt-1 text-yellow-600">
                    Din søknad er under vurdering.
                  </p>
                )}
                {userApplication.status === 'confirmed' && (
                  <div className="mt-4">
                    <Review receiverId={job.user.id} jobId={job.id} />
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-yellow-400 px-6 py-2 font-medium text-white hover:bg-yellow-500"
                >
                  {submitting ? 'Sender søknad...' : 'Søk på denne jobben'}
                </button>
              </form>
            )}

            {/* Non-owner arbeidstakers: show a brief summary (number of apps, how many approved) */}
            {!isOwner && (
              <p className="mt-4 text-sm text-gray-500">
                Antall søknader: <strong>{totalApps}</strong>. Godkjente
                søknader: <strong>{approvedCount}</strong>.
              </p>
            )}
          </div>
        )}

        {/* If arbeidsgiver => show either the full list if owner, or a summary otherwise */}
        {loggedIn && userRole === 'arbeidsgiver' && (
          <div className="mt-6">
            {/* Link to add extra tjenester (only useful for the owner, but harmless to hide for non-owner) */}
            {isOwner && (
              <div className="mb-4">
                <Link href={`/portal/stillinger/${job.slug}/tjenester`}>
                  <button className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    Legg til ekstra tjenester
                  </button>
                </Link>
              </div>
            )}

            {!isOwner && (
              // Not the owner => just show how many total & how many approved
              <p className="text-sm text-gray-600">
                Det er {totalApps} søknad(er) på denne jobben. {approvedCount}{' '}
                er godkjent.
              </p>
            )}

            {isOwner && (
              <>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  Søknader ({totalApps})
                </h2>

                {applications.length === 0 ? (
                  <p className="text-gray-500">Ingen søknader ennå.</p>
                ) : (
                  <ul className="space-y-2">
                    {applications.map((app) => {
                      const { label, description } = getStatusInfo(app.status);
                      return (
                        <li
                          key={app.id}
                          className="flex flex-col gap-2 rounded bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            {/* Display applicant name because owner can see it */}
                            <p className="text-sm font-medium text-gray-800">
                              {app.user.name} –{' '}
                              <span className="italic text-gray-600">
                                {label}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {description}
                            </p>
                          </div>
                          <div className="flex gap-2 self-end sm:self-auto">
                            {app.status === 'waiting' && (
                              <>
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 hover:bg-green-200"
                                >
                                  Godkjenn
                                </button>
                                <button
                                  onClick={() => handleDecline(app.id)}
                                  className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200"
                                >
                                  Avslå
                                </button>
                              </>
                            )}
                          </div>
                          {app.status !== 'declined' &&
                            app.status !== 'waiting' && (
                              <button
                                onClick={() =>
                                  openChatWithReceiver(app.user.id)
                                }
                                className="inline-block rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                              >
                                Chat med arbeidstaker
                              </button>
                            )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* (Optional) Another subtle card or info block if you want to fill out the page */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Mer om denne stillingen
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          efficitur velit a nibh lobortis, vel mollis tortor elementum.
        </p>
      </div>
    </div>
  );
}
