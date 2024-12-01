'use client';
import React from "react";
import { useRouter } from "next/navigation";
import PortalLayout from "@/components/portal/PortalLayout";

export default function JobApplicationsPage() {
  const router = useRouter();

  const applications = [
    {
      id: 1,
      name: "Linn Hansen",
      category: "Leksehjelp",
      time: "5-6. nov. 17.00-20.00",
      salary: "900 kr",
      location: "Havlymveien 1",
      status: "approved",
      message: "Linn har godkjent søknaden din! Klikk her for å chatte og ta jobben.",
    },
    {
      id: 2,
      name: "Geir Olsen",
      category: "Handling",
      time: "3. nov. 20.00",
      salary: "300 kr",
      location: "Vavikbakken 5",
      status: "pending",
      message: "Vent på godkjent søknad...",
    },
    {
      id: 3,
      name: "Anne Berit Pedersen",
      category: "Rengjøring",
      time: "1. nov. 20.00",
      salary: "500 kr",
      location: "Vavikbakken 19",
      status: "declined",
      message: "Anne Berit avlyste. Du svarte for sent.",
    },
    {
      id: 4,
      name: "Bergulf Lia",
      category: "Rydding",
      time: "9. nov. 17.00-20.00",
      salary: "400 kr",
      location: "Dversgnesveien 1",
      status: "approved",
      message: "Bergulf har godkjent søknaden din! Klikk her for å chatte og ta jobben.",
    },
  ];

  const statusStyles: any = {
    approved: "bg-green-100 text-green-900 border-green-400",
    pending: "bg-yellow-100 text-yellow-900 border-yellow-400",
    declined: "bg-red-100 text-red-900 border-red-400",
  };

  return (
    <PortalLayout>
    <div className="flex min-h-screen flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 bg-yellow-100 rounded-2xl p-4 shadow-neumorphic">
        <h1 className="text-3xl font-bold text-gray-800">Dine jobbsøknader</h1>
        <button
          className="rounded-full bg-yellow-300 px-4 py-2 font-semibold text-gray-800 shadow-neumorphic"
          onClick={() => router.push("/portal")}
        >
          Tilbake
        </button>
      </div>

      {/* Job Applications */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {applications.map((app) => (
          <div
            key={app.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl shadow-neumorphic bg-yellow-200"
          >
            {/* Job Details */}
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-medium text-gray-800">
                <strong>Navn:</strong> {app.name}
              </p>
              <p className="text-gray-800">
                <strong>Kategori:</strong> {app.category}
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

            {/* Status and Message */}
            <div
              className={`flex items-center justify-center rounded-2xl border p-4 text-center shadow-neumorphic ${statusStyles[app.status]}`}
            >
              <p className="text-sm font-medium">{app.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </PortalLayout>
  );
}
