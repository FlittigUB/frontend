"use client";

import React, { useState, useCallback } from "react";
import { Job } from "@/common/types";
import JobList from "@/components/portal/job/JobList";

// Helper function: Haversine formula for distance in km
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface ExtendedJob extends Job {
  distance?: number; // We'll temporarily store computed distance here
}

interface SearchClientProps {
  jobs: Job[];
}

export default function SearchClient({ jobs }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [sortByDistance, setSortByDistance] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  // We'll handle the distance sorting in a button toggle for better UX
  const handleDistanceToggle = useCallback(async () => {
    if (!sortByDistance) {
      // The user is trying to enable distance-based sorting
      if (!navigator.geolocation) {
        alert("Geolokasjon støttes ikke i denne nettleseren.");
        return;
      }

      setIsLoading(true); // Start loading

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLon(pos.coords.longitude);
          setSortByDistance(true);
          setIsLoading(false); // End loading
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Kunne ikke hente posisjon. Sjekk at du har gitt tillatelse.");
          setIsLoading(false); // End loading even on error
        }
      );
    } else {
      // Already sorting by distance => turn it off
      setSortByDistance(false);
    }
  }, [sortByDistance]);

  // 1) Filter by text query
  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(query.toLowerCase())
  );

  // 2) Create an array that includes a `distance` field (if we can compute it)
  const extendedJobs: ExtendedJob[] = filtered.map((job) => {
    // default to null or undefined
    let distance: number | undefined;
    if (sortByDistance && userLat != null && userLon != null) {
      const jLat = job.position?.latitude;
      const jLon = job.position?.longitude;
      if (jLat != null && jLon != null) {
        distance = getDistanceFromLatLonInKm(userLat, userLon, jLat, jLon);
      }
    }
    return { ...job, distance };
  });

  // 3) If sorting by distance, sort by `distance`
  if (sortByDistance && userLat != null && userLon != null) {
    extendedJobs.sort((a, b) => {
      if (a.distance == null) return 1; // push unknown-loc to bottom
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
  }

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Søk etter jobber..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          mb-6 w-full rounded-lg bg-background p-3 shadow-neumorphic
          focus:outline-none focus:ring-2 focus:ring-primary
          dark:bg-background-dark dark:text-foreground-dark
          dark:shadow-neumorphic-dark
        "
      />

      {/* Distance sort toggle button */}
      <button
        type="button"
        onClick={handleDistanceToggle}
        disabled={isLoading} // Disable button while loading
        className={`
          mb-4 inline-flex items-center
          rounded-full px-4 py-2 text-sm font-semibold text-white
          shadow transition-colors focus:outline-none focus:ring-2
          ${sortByDistance ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {sortByDistance ? "Slå av avstands-sortering" : "Sorter etter avstand"}
        {isLoading && (
          <svg
            className="ml-2 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        )}
      </button>

      {sortByDistance && (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Viser jobber nærmest deg først. Avstanden vises i km under stillingen.
        </p>
      )}

      {/* Render the final array */}
      {extendedJobs.length === 0 ? (
        <p className="text-gray-500">Ingen jobber funnet.</p>
      ) : (
        <JobList jobs={extendedJobs} isEmployerView={false} />
      )}
    </div>
  );
}
