'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArbeidsgiverSoknaderPage() {
  const router = useRouter();

  const [receivedApplications, setReceivedApplications] = useState([
    {
      id: 1,
      applicant: "Kristoffer Nerskogen",
      job: "Rengjøring",
      time: "8-9. nov. 14.00-18.00",
      salary: "400 kr",
      location: "Havlymveien 7",
      status: "pending",
    },
    {
      id: 2,
      applicant: "Oline Nordmann",
      job: "Hagestell",
      time: "12. nov. 16.00-20.00",
      salary: "600 kr",
      location: "Grønnlia 4",
      status: "pending",
    },
  ]);

  const statusStyles: any = {
    approved: "bg-green-100 text-green-900 border-green-400",
    pending: "bg-yellow-100 text-yellow-900 border-yellow-400",
    declined: "bg-red-100 text-red-900 border-red-400",
  };

  const handleApprove = (id: number) => {
    setReceivedApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "approved" } : app
      )
    );
  };

  const handleDecline = (id: number) => {
    setReceivedApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "declined" } : app
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-yellow-50 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 bg-yellow-100 rounded-2xl p-4 shadow-neumorphic">
        <h1 className="text-3xl font-bold text-gray-800">Mottatte Søknader</h1>
        <button
          className="rounded-full bg-yellow-300 px-4 py-2 font-semibold text-gray-800 shadow-neumorphic"
          onClick={() => router.push("/portal")}
        >
          Tilbake
        </button>
      </div>

      {/* Applications List */}
      <div className="grid gap-8 mt-8">
        {receivedApplications.map((app) => (
          <div
            key={app.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl shadow-neumorphic bg-yellow-200"
          >
            {/* Received Application Details */}
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-medium text-gray-800">
                <strong>Søker:</strong> {app.applicant}
              </p>
              <p className="text-gray-800">
                <strong>Jobb:</strong> {app.job}
              </p>
              <p className="text-gray-800">
                <strong>Tidspunkt:</strong> {app.time}
              </p>
              <p className="text-gray-800">
                <strong>Lønn:</strong> {app.salary}
              </p>
              <p className="text-gray-800">
                <strong>Sted:</strong> {app.location}
              </p>
            </div>

            {/* Status and Action Buttons */}
            <div
              className={`flex flex-col items-center justify-between rounded-2xl border p-4 text-center shadow-neumorphic ${statusStyles[app.status]}`}
            >
              <p className="text-sm font-medium mb-4">Status: {app.status}</p>
              {app.status === "pending" && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="rounded-full bg-green-300 px-4 py-2 font-semibold text-gray-800 shadow-neumorphic hover:bg-green-400"
                  >
                    Godkjenn
                  </button>
                  <button
                    onClick={() => handleDecline(app.id)}
                    className="rounded-full bg-red-300 px-4 py-2 font-semibold text-gray-800 shadow-neumorphic hover:bg-red-400"
                  >
                    Avslå
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
