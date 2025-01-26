"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Job } from "@/common/types";
import JobList from "@/components/portal/job/JobList";

/**
 * Haversine formula for distance in km
 */
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
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

/**
 * Computes total salary (hourly vs. fixed).
 * If hourly => rate * hours_estimated
 * If fixed => rate
 */
function getTotalSalary(job: Job) {
  if (job.payment_type === "hourly") {
    return job.rate * job.hours_estimated;
  }
  // fixed
  return job.rate;
}

interface ExtendedJob extends Job {
  distance?: number; // store computed distance if user location is known
  totalSalary?: number; // store computed total salary for sorting/display
}

interface SearchClientProps {
  jobs: Job[];
}

export default function SearchClient({ jobs }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState<
    | "none"
    | "titleAsc"
    | "titleDesc"
    | "salaryAsc"
    | "salaryDesc"
    | "dateAsc"
    | "dateDesc"
    | "distance"
  >("none");

  // We'll store user location in these states after geolocation request
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // If we select "distance" but have no location, request it once
  useEffect(() => {
    if (sortOption === "distance" && userLat == null && userLon == null) {
      if (navigator.geolocation) {
        setIsLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLat(pos.coords.latitude);
            setUserLon(pos.coords.longitude);
            setIsLocationLoading(false);
          },
          (err) => {
            console.error("Geolocation error:", err);
            alert("Kunne ikke hente posisjon. Sjekk at du har gitt tillatelse.");
            setIsLocationLoading(false);
          }
        );
      } else {
        alert("Geolokasjon støttes ikke i denne nettleseren.");
      }
    }
  }, [sortOption, userLat, userLon]);

  /**
   * 1) Filter by text
   */
  const filteredJobs = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return jobs.filter((job) => job.title.toLowerCase().includes(lowerQuery));
  }, [jobs, query]);

  /**
   * 2) Extend with distance & totalSalary for *all* jobs
   *    so we can display distance or salary on any listing.
   */
  const extendedJobs = useMemo<ExtendedJob[]>(() => {
    return filteredJobs.map((job) => {
      const { latitude, longitude } = job.position || {};

      let distance: number | undefined = undefined;
      if (userLat != null && userLon != null && latitude != null && longitude != null) {
        distance = getDistanceFromLatLonInKm(userLat, userLon, latitude, longitude);
      }

      const totalSalary = getTotalSalary(job);

      return {
        ...job,
        distance,
        totalSalary,
      };
    });
  }, [filteredJobs, userLat, userLon]);

  /**
   * 3) Sort the extended jobs based on chosen `sortOption`
   */
  const sortedJobs = useMemo<ExtendedJob[]>(() => {
    const jobsCopy = [...extendedJobs];

    switch (sortOption) {
      case "titleAsc":
        jobsCopy.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "titleDesc":
        jobsCopy.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case "salaryAsc":
        // Use computed totalSalary
        jobsCopy.sort((a, b) => (a.totalSalary ?? 0) - (b.totalSalary ?? 0));
        break;

      case "salaryDesc":
        jobsCopy.sort((a, b) => (b.totalSalary ?? 0) - (a.totalSalary ?? 0));
        break;

      case "dateAsc":
        // If you have date_created or date_updated, pick one
        // We'll sort by date_created as an example
        jobsCopy.sort(
          (a, b) =>
            new Date(a.date_created).getTime() -
            new Date(b.date_created).getTime()
        );
        break;

      case "dateDesc":
        jobsCopy.sort(
          (a, b) =>
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
        );
        break;

      case "distance":
        // Sort by distance (undefined => Infinity => goes to bottom)
        jobsCopy.sort((a, b) => {
          const distA = a.distance ?? Infinity;
          const distB = b.distance ?? Infinity;
          return distA - distB;
        });
        break;

      case "none":
      default:
        // no sorting
        break;
    }

    return jobsCopy;
  }, [extendedJobs, sortOption]);

  return (
    <div>
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Søk etter jobber..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full rounded-lg bg-background p-3 shadow-neumorphic
            focus:outline-none focus:ring-2 focus:ring-primary
            dark:bg-background-dark dark:text-foreground-dark
            dark:shadow-neumorphic-dark
          "
        />
      </div>

      {/* Sort dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="sort" className="font-semibold">
          Sorter:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) =>
            setSortOption(e.target.value as typeof sortOption)
          }
          className="
      rounded-md border p-2 text-sm
      dark:border-gray-700 dark:bg-background-dark dark:text-foreground-dark
    "
        >
          <option value="none">Ingen sortering</option>
          <option value="titleAsc">Tittel: A-Å</option>
          <option value="titleDesc">Tittel: Å-A</option>
          <option value="salaryAsc">Lønn (stigende)</option>
          <option value="salaryDesc">Lønn (synkende)</option>
          <option value="dateAsc">Eldste først</option>
          <option value="dateDesc">Nyeste først</option>
          <option value="distance">Avstand</option>
        </select>

        {/* If user chooses distance and location is being fetched, show loader */}
        {sortOption === "distance" && isLocationLoading && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            {/* Loader SVG */}
          </div>
        )}


        {/* If user chooses distance and location is being fetched, show loader */}
        {sortOption === "distance" && isLocationLoading && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg
              className="h-4 w-4 animate-spin"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Henter posisjon...
          </div>
        )}
      </div>

      {/* Optional: If sorted by distance & location is known, show note */}
      {sortOption === "distance" && userLat && userLon && (
        <p className="mb-2 text-sm text-gray-600">
          Viser jobber nærmest deg først. Avstand vises (i km) der det er mulig.
        </p>
      )}

      {sortedJobs.length === 0 ? (
        <p className="text-gray-500">Ingen jobber funnet.</p>
      ) : (
        <JobList jobs={sortedJobs} isEmployerView={false} />
      )}
    </div>
  );
}
