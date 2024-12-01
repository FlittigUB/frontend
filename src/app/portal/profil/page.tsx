'use client';
import React, { useState } from "react";
import Image from "next/image";
import PortalLayout from "@/components/portal/PortalLayout";

export default function ProfilePage() {
  // State for editable fields
  const [bio, setBio] = useState(
    "Jeg er 17 år, går på studiespesialisering på KKG. Jeg er organisert, strukturert, vennlig og flink til å konsentrere meg. Jeg fullfører en jobb og gjør alltid ting 100%. Jeg har tidligere jobbet med vasking, organisering, og varetelling."
  );
  const [guardian, setGuardian] = useState("Oline Nordmann");
  const [mobile, setMobile] = useState("123 45 678");
  const [email, setEmail] = useState("mail.mail@icloud.com");
  // Function to determine role
  const getRole = () => {
    // In a real application, this logic would check the user's role from context or an API.
    return "arbeidstaker"; // Returning "arbeidstaker" for this example
  };

  const role = getRole();

  return (
    <PortalLayout>
      <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <div className="shadow-neumorphism flex w-full max-w-lg flex-col items-center space-y-6 rounded-3xl p-6">
    {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        <div className="h-40 w-40 overflow-hidden rounded-full bg-gray-200 shadow-inner">
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}ede37afc-8aa9-41e9-9a8b-106d4c852781.jpg`}
            alt="Profilbilde"
            width={150}
            height={150}
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-50">
          Kristoffer Nerskogen
        </h1>
        {/* Role Tag */}
        <div
          className={`rounded-full px-4 py-1 text-sm font-medium ${
            role === "arbeidsgiver"
              ? "bg-blue-300 text-blue-900"
              : "bg-green-300 text-green-900"
          }`}
        >
          {role === "arbeidsgiver" ? "Arbeidsgiver" : "Arbeidstaker"}
        </div>
      </div>

      {/* Bio */}
      <div className="shadow-neumorphism w-full rounded-2xl bg-yellow-200 p-4">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full resize-none border-none bg-transparent text-gray-800 outline-none"
            rows={5}
          />
      </div>

      {/* Contact Info */}
      <div className="w-full space-y-4">
        <div className="shadow-neumorphism flex items-center justify-between rounded-2xl bg-yellow-200 p-4">
          <span className="font-medium text-gray-800">Foresatte:</span>
          <input
            type="text"
            value={guardian}
            onChange={(e) => setGuardian(e.target.value)}
            className="border-none bg-transparent text-right text-gray-800 outline-none"
          />
        </div>

        <div className="shadow-neumorphism flex items-center justify-between rounded-2xl bg-yellow-200 p-4">
          <span className="font-medium text-gray-800">Mobil:</span>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border-none bg-transparent text-right text-gray-800 outline-none"
          />
        </div>

        <div className="shadow-neumorphism flex items-center justify-between rounded-2xl bg-yellow-200 p-4">
          <span className="font-medium text-gray-800">Epost:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-none bg-transparent text-right text-gray-800 outline-none"
          />
        </div>
      </div>

      {/* Task Ratings */}
      <div className="grid w-full grid-cols-2 gap-4">
        {["Rengjøring", "Leksehjelp", "Hagestell", "Handling", "Annet"].map(
          (task, index) => (
            <div
              key={index}
              className={`shadow-neumorphism rounded-2xl p-4 text-center ${
                index % 2 === 0 ? "bg-green-200" : "bg-yellow-200"
              }`}
            >
              <span className="font-medium text-gray-800">{task}</span>
              <div className="mt-2 flex justify-center space-x-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <span key={starIndex} className="text-xl text-yellow-500">
                      ★
                    </span>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Logout and Customer Service */}
      <div className="w-full space-y-4">
        <button className="shadow-neumorphism w-full rounded-2xl bg-yellow-300 py-2 font-semibold text-gray-800">
          Kundeservice
        </button>
        <button className="shadow-neumorphism w-full rounded-2xl bg-yellow-300 py-2 font-semibold text-gray-800">
          Logg ut
        </button>
      </div>
    </div>
  </div>
</PortalLayout>
  );
}
