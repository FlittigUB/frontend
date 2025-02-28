"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { Application } from "@/common/types";
import { FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import Image from "next/image";
import { usePortalLayout } from "@/components/portal/PortalLayout";
import { IoIosTimer } from "react-icons/io";
import Review from "@/components/portal/job/Review";
import { useJob } from "./JobContext";

// Keep existing components/modal calls
import ApproveApplicationWithPayment from "./ApproveApplicationWithPayment";
import MarkJobFinished from "./MarkJobFinished";
import MarkJobConfirmed from "./MarkJobConfirmed";

/** Status label + description mapping */
const statusDetails: Record<string, { label: string; description: string }> = {
  waiting: {
    label: "Venter godkjenning",
    description: "Din søknad er mottatt og venter på arbeidsgivers vurdering.",
  },
  approved: {
    label: "Akseptert",
    description: "Din søknad er godkjent av arbeidsgiver.",
  },
  declined: {
    label: "Avslått",
    description: "Din søknad er avslått av arbeidsgiver.",
  },
  finished: {
    label: "Fullført",
    description: "Jobben er fullført og arbeidstaker har merket den som ferdig.",
  },
  confirmed: {
    label: "Bekreftet fullført",
    description: "Jobben er bekreftet fullført. Nå kan du gi en vurdering.",
  },
  waitingOnGuardian: {
    label: "Venter på foresatt",
    description: "Søknaden venter på godkjenning av foresatt",
  },
  deniedByGuardian: {
    label: "Avslått av foresatt",
    description: "Søknaden er avslått av foresatt",
  },
};

/** Optional color-coded status badges */
const statusStyles: Record<string, string> = {
  waiting: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  finished: "bg-blue-100 text-blue-800",
  confirmed: "bg-purple-100 text-purple-800",
  waitingOnGuardian: "bg-orange-100 text-orange-800",
  deniedByGuardian: "bg-pink-100 text-pink-800",
  default: "bg-gray-100 text-gray-800",
};

function getStatusInfo(status: string) {
  return (
    statusDetails[status] || {
      label: "Ukjent status",
      description: "Status ble ikke gjenkjent.",
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

  // Keep user details & payout modal as is
  const [userDetails, setUserDetails] = useState<any>(null);
  const [showPayoutDialog, setShowPayoutDialog] = useState<boolean>(false);

  // Determine if the logged-in user is the job owner
  const isOwner = user && job.user && user.id === job.user.id;

  // Load job owner image (if any)
  useEffect(() => {
    if (job.user?.image) {
      setPreviewImage(`${process.env.NEXT_PUBLIC_ASSETS_URL}${job.user.image}`);
    } else {
      setPreviewImage(null);
    }
  }, [job.user?.image]);

  // Fetch up-to-date user details (including Stripe info) if logged in
  useEffect(() => {
    if (loggedIn && user && token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserDetails(res.data);
        })
        .catch((err) => {
          console.error("Feil ved henting av brukerdata", err);
        });
    }
  }, [loggedIn, user, token]);

  // Refresh job applications
  const refreshApplications = useCallback(() => {
    if (!loggedIn || !token) return;
    setLoading(true);

    axios
      .get<Application[]>(`${process.env.NEXT_PUBLIC_API_URL}/applications/job/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fetched = res.data;
        setApplications(fetched);

        // If user is arbeidstaker, see if they've already applied
        if (userRole === "arbeidstaker" && user) {
          const existing = fetched.find((app) => app.user.id === user.id);
          if (existing) setUserApplication(existing);
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Feil ved henting av søknader.";
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [job.id, loggedIn, token, user, userRole]);

  useEffect(() => {
    if (!loggedIn || !token) return;
    refreshApplications();
  }, [loggedIn, token, user, job.id, userRole, refreshApplications]);

  /**
   * Handle "Søk på denne jobben"
   */
  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // If missing payout info, show modal
    if (!userDetails?.stripe_account_id || !userDetails?.stripe_person_id) {
      setShowPayoutDialog(true);
      setSubmitting(false);
      return;
    }

    try {
      if (!token || !user) throw new Error("Uautorisert.");
      const payload = { job: job.id, user: user.id };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Søknaden er sendt!");
      setUserApplication(response.data);
      setApplications((prev) => [...prev, response.data]);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Kunne ikke sende søknaden.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle "Avslå" application
   */
  const handleDecline = async (applicationId: string) => {
    try {
      if (!isOwner) {
        toast.error("Kun eier av jobben kan avslå søknader.");
        return;
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: "declined" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: "declined" } : a))
      );
      toast.success("Søknaden ble avslått.");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Kunne ikke avslå søknaden.";
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10 text-gray-600">
        Laster inn data ...
      </div>
    );
  }

  // Display helpers
  const displayLocation =
    job.position?.neighbourhood || job.position?.city || "Ukjent sted";

  const displayPayment = () => {
    if (job.payment_type === "hourly") {
      return `${job.rate} NOK / time`;
    }
    return `${job.rate} NOK (fast pris)`;
  };

  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const totalApps = applications.length;

  return (
    <div className="mx-auto my-8 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* --- Job Details Card --- */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        {/* Title & scheduled time */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
            {job.category && (
              <span className="mt-1 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                {job.category.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-7 8h.01M12 14v.01M7 17v.01M12 17v.01M17 17v.01M3 7h18M4 21h16c1.1 0 2-.9 2-2V7H2v12c0 1.1.9 2 2 2z"
              />
            </svg>
            <span>
              Planlagt tidspunkt:{" "}
              {new Date(job.scheduled_at).toLocaleString("no-NO")}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-700">{job.description}</p>

        {/* Payment, hours, location */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiDollarSign className="h-5 w-5 text-gray-400" />
            <span className="font-medium">{displayPayment()}</span>
          </div>
          {job.hours_estimated && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiClock className="h-5 w-5 text-gray-400" />
              <span>{job.hours_estimated} timer</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiMapPin className="h-5 w-5 text-gray-400" />
            <span>{displayLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosTimer className="h-5 w-5 text-gray-400" />
            <span>
              Klokkeslett:{" "}
              {new Date(job.scheduled_at).toLocaleTimeString("no-NO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Owner info + chat button */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {previewImage ? (
              <div
                className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 shadow-inner"
                aria-label={`Profilbilde av ${job.user.name}`}
              >
                <Image
                  src={previewImage}
                  width={50}
                  height={50}
                  alt={`Profilbilde av ${job.user.name}`}
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300" />
            )}
            <div>
              <p className="font-medium text-gray-900">{job.user.name}</p>
              {job.user.email && (
                <p className="text-sm text-gray-600">{job.user.email}</p>
              )}
            </div>
          </div>
          {loggedIn && !isOwner && (
            <button
              onClick={() => openChatWithReceiver(job.user.id)}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Chat med arbeidsgiver
            </button>
          )}
        </div>

        {/* If user not logged in, link to login */}
        {!loggedIn && (
          <div className="mt-6">
            <a
              href="/portal/logg-inn"
              className="inline-block rounded bg-yellow-400 px-6 py-2 font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              Logg inn for å søke
            </a>
          </div>
        )}

        {/* If user is an arbeidstaker (not owner) */}
        {loggedIn && userRole === "arbeidstaker" && (
          <div className="mt-6">
            {userApplication ? (
              <div className="text-sm text-gray-700">
                <p>
                  <strong>Status: </strong>
                  {getStatusInfo(userApplication.status).label}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {getStatusInfo(userApplication.status).description}
                </p>

                {/* If approved, show "Mark job finished" button */}
                {userApplication.status === "approved" && (
                  <div className="mt-4">
                    <MarkJobFinished
                      applicationId={userApplication.id}
                      onRefresh={refreshApplications}
                    />
                  </div>
                )}
                {/* If finished, waiting for employer confirmation */}
                {userApplication.status === "finished" && (
                  <p className="mt-1 text-yellow-600">
                    Du har merket jobben som ferdig – avventer arbeidsgivers bekreftelse.
                  </p>
                )}
                {/* If confirmed, show review */}
                {userApplication.status === "confirmed" && (
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
                  className="rounded bg-yellow-400 px-6 py-2 font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  {submitting ? "Sender søknad..." : "Søk på denne jobben"}
                </button>
              </form>
            )}
            {/* Stats about how many have applied/approved */}
            {!isOwner && (
              <p className="mt-4 text-sm text-gray-500">
                Antall søknader: <strong>{totalApps}</strong>. Godkjente søknader:{" "}
                <strong>{approvedCount}</strong>.
              </p>
            )}
          </div>
        )}

        {/* If user is arbeidsgiver/owner */}
        {loggedIn && userRole === "arbeidsgiver" && isOwner && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              Søknader ({totalApps})
            </h2>
            {applications.length === 0 ? (
              <p className="text-gray-500">Ingen søknader ennå.</p>
            ) : (
              <ul className="space-y-3">
                {applications.map((app) => {
                  const { label, description } = getStatusInfo(app.status);
                  const badgeStyle = statusStyles[app.status] || statusStyles.default;

                  return (
                    <li
                      key={app.id}
                      className="flex flex-col gap-3 rounded-lg bg-gray-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Applicant name + status */}
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {app.user.name} –{" "}
                          <span
                            className={`ml-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${badgeStyle}`}
                          >
                            {label}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                        {/* Keep existing ApproveApplicationWithPayment call */}
                        {app.status === "waiting" && (
                          <>
                            <ApproveApplicationWithPayment
                              applicationId={app.id}
                              jobRate={job.rate || 0}
                              onRefresh={refreshApplications}
                            />
                            <button
                              onClick={() => handleDecline(app.id)}
                              className="inline-block rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Avslå
                            </button>
                          </>
                        )}

                        {/* If finished, employer can confirm */}
                        {app.status === "finished" && (
                          <MarkJobConfirmed
                            applicationId={app.id}
                            onRefresh={refreshApplications}
                          />
                        )}

                        {/* If not declined/waiting, show chat button */}
                        {app.status !== "declined" && app.status !== "waiting" && (
                          <button
                            onClick={() => openChatWithReceiver(app.user.id)}
                            className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Chat med arbeidstaker
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Extra info card */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800">
          Mer om denne stillingen
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          efficitur velit a nibh lobortis, vel mollis tortor elementum.
        </p>
      </div>

      {/* Keep your existing payout info modal functionality */}
      {showPayoutDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Legg til utbetalingsinformasjon
            </h3>
            <p className="mb-6 text-gray-700">
              Du er ett steg unna å søke på jobber! Vennligst legg til din
              utbetalingsinformasjon for å fortsette.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPayoutDialog(false)}
                className="mr-2 rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Lukk
              </button>
              <button
                onClick={() => {
                  // Redirect user to payout settings
                  window.location.href = "/settings/payout";
                }}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Legg til utbetalingsinformasjon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
