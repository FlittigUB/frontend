'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { useAuthContext } from '@/context/AuthContext';
import { Application, ApplicationStatus, Job } from '@/common/types';
import { FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import Image from 'next/image';
import { usePortalLayout } from '@/components/portal/PortalLayout';

interface Props {
  job: Job;
}

export default function JobDetailsClient({ job }: Props) {
  const { loggedIn, user, token, userRole } = useAuthContext();
  // 1) We can get the function from the layout's context
  const { openChatWithReceiver } = usePortalLayout();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Applications data if user is arbeidsgiver or arbeidstaker
  const [applications, setApplications] = useState<Application[]>([]);
  const [userApplication, setUserApplication] = useState<Application | null>(
    null,
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 1) Preload the employer's image or store null
  useEffect(() => {
    if (job.user?.image) {
      setPreviewImage(`${process.env.NEXT_PUBLIC_ASSETS_URL}${job.user.image}`);
    } else {
      setPreviewImage(null); // don't pass an empty string
    }
  }, [job.user?.image]);

  // 2) If logged in, fetch the applications (so we know if the user has applied)
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

  // 3) Submit application (arbeidstaker)
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

  // 4) Approve/Decline (arbeidsgiver)
  const handleApprove = async (applicationId: string) => {
    try {
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

  const handleDecline = async (applicationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'declined' },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status: 'rejected' } : a,
        ),
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

  // 5) Minimal statuses
  const statusLabels: Record<ApplicationStatus, string> = {
    waiting: 'Venter godkjenning',
    approved: 'Akseptert',
    rejected: 'Avslått',
  };

  // 6) (Optional) Quick loading indicator
  if (loading) {
    return (
      <div className="flex justify-center p-10 text-gray-600">
        Laster inn data ...
      </div>
    );
  }
  // We'll display either position.formattedAddress or a fallback
  const displayLocation = job.position?.neighbourhood || job.position?.city || 'Ukjent sted';

  // Display payment info
  const displayPayment = () => {
    if (job.payment_type === "hourly") {
      return `${job.rate} NOK / time`;
    }
    return `${job.rate} NOK (fast pris)`;
  };

  // 7) Render
  return (
    <div className="mx-auto my-8 w-full max-w-5xl px-4">
      {/* The big pastel card */}
      <div className="min-h-[400px] rounded-xl bg-yellow-50 p-6 shadow-sm">
        {/* Title & Category & Availability */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{job.title}</h1>
            {/* Category as a pill */}
            {job.category && (
              <span className="mt-1 inline-block rounded-full bg-yellow-200 px-3 py-1 text-sm text-gray-700">
                {job.category.name}
              </span>
            )}
          </div>
          {/* Available from date */}
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
              {new Date(job.scheduled_at).toLocaleDateString('no-NO')}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-800">{job.description}</p>
        {/* Payment Information */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FiDollarSign className="h-4 w-4 flex-shrink-0" />
          <span>{displayPayment()}</span>
        </div>
        {job.hours_estimated && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiClock className="h-4 w-4 flex-shrink-0"/>
            <span>{job.hours_estimated} timer</span>
          </div>
        )}

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FiMapPin className="h-4 w-4 flex-shrink-0" />
          <span>{displayLocation}</span>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-200" />

        {/* Employer info & chat button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {previewImage ? (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 shadow-inner">
                <Image
                  src={previewImage}
                  width={50}
                  height={50}
                  alt="Arbeidsgiver"
                />
              </div>
            ) : (
              <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300" />
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
          {loggedIn && (
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
                <p>
                  <strong>Status:</strong>{' '}
                  {statusLabels[userApplication.status]}
                </p>
                {userApplication.status === 'approved' && (
                  <p className="mt-1 text-green-600">
                    Gratulerer! Din søknad har blitt akseptert.
                  </p>
                )}
                {userApplication.status === 'rejected' && (
                  <p className="mt-1 text-red-500">
                    Beklager, din søknad ble avslått.
                  </p>
                )}
                {userApplication.status === 'waiting' && (
                  <p className="mt-1 text-yellow-600">
                    Din søknad er under vurdering.
                  </p>
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
          </div>
        )}

        {/* If arbeidsgiver => show the list of applications */}
        {loggedIn && userRole === 'arbeidsgiver' && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              Søknader ({applications.length})
            </h2>
            {applications.length === 0 ? (
              <p className="text-gray-500">Ingen søknader ennå.</p>
            ) : (
              <ul className="space-y-2">
                {applications.map((app) => (
                  <li
                    key={app.id}
                    className="flex items-center justify-between rounded bg-white px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {app.user.name} –{' '}
                        <span className="italic text-gray-600">
                          {statusLabels[app.status]}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
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
                  </li>
                ))}
              </ul>
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
