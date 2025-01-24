'use client';

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Map, {
  Layer,
  MapLayerMouseEvent,
  MapRef,
  Marker,
  Source,
} from 'react-map-gl';
import axios from 'axios';
import supercluster from 'supercluster';
import 'mapbox-gl/dist/mapbox-gl.css';
import CustomPopup from '@/app/portal/stillinger/kart/PopupComponent';

// Define the Job interface
interface Job {
  id: string;
  title: string;
  category: { name: string };
  rate?: number;
  payment_type?: string;
  date?: string;
  description?: string;
  position: {
    longitude: string;
    latitude: string;
  };
  // Add other job-related fields as needed
}

// Debounce hook defined outside to prevent re-creation on each render
function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Function to generate a deterministic random offset based on job ID
function generateOffset(id: string): { latOffset: number; lngOffset: number } {
  // Simple hash function based on job ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert hash to a pseudo-random number between -0.0018 and 0.0018 (~±200 meters)
  const offset = (hash % 3600) / 1000000; // Adjusted divisor for ~200m
  const latOffset = offset;
  const lngOffset = offset;
  return { latOffset, lngOffset };
}

// JobMarker Component
interface JobMarkerProps {
  job: Job;
  adjustedPixels: number;
  onClick: () => void;
}

const JobMarker: React.FC<JobMarkerProps> = ({
  job,
  adjustedPixels,
  onClick,
}) => (
  <div className="relative flex items-center justify-center">
    {/* Dynamic Opaque Circle */}
    <div
      className="pointer-events-none absolute rounded-full bg-blue-500 opacity-30"
      style={{
        width: `${adjustedPixels * 2}px`, // Diameter
        height: `${adjustedPixels * 2}px`, // Diameter
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
    {/* Marker Content */}
    <div
      className="z-10 flex cursor-pointer flex-col items-center justify-center rounded-full bg-white px-3 py-2 shadow-neumorphic"
      onClick={onClick}
      aria-label={`Job: ${job.title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <span className="text-sm font-semibold text-gray-800">
        {job.category.name}
      </span>
      {job.rate && <span className="text-sm text-gray-500">{job.rate}kr</span>}
    </div>
  </div>
);

const SearchAndMap: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [viewport, setViewport] = useState({
    longitude: 7.9956,
    latitude: 58.1467,
    zoom: 14, // Starting at a higher zoom to show details
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);

  const [clusters, setClusters] = useState<supercluster.ClusterFeature<Job>[]>(
    [],
  );
  const [unclusteredPoints, setUnclusteredPoints] = useState<
    supercluster.ClusterFeature<Job>[]
  >([]);
  const [superclusterInstance, setSuperclusterInstance] =
    useState<supercluster | null>(null);
  const [, setBounds] = useState<number[] | null>(null);

  // State to track current zoom level
  const [currentZoom, setCurrentZoom] = useState(viewport.zoom);

  // Loading states
  const [isJobsLoading, setIsJobsLoading] = useState<boolean>(true);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);

  // Define Norway's bounding box
  const norwayBounds: [[number, number], [number, number]] = [
    [4.3, 57.7], // Southwest corner [longitude, latitude]
    [31.5, 71.2], // Northeast corner [longitude, latitude]
  ];

  // Function to handle search
  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(`https://geo.flittigub.no/search`, {
        params: {
          q: searchTerm,
          format: 'json',
          addressdetails: 1,
          limit: 5,
          countrycodes: 'no',
        },
      });

      if (response.data && response.data.length > 0) {
        setResults(response.data);
        const firstResult = response.data[0];
        setViewport((prev) => ({
          ...prev,
          longitude: parseFloat(firstResult.lon),
          latitude: parseFloat(firstResult.lat),
          zoom: 14,
        }));
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error during search:', error);
      alert('An error occurred while searching. Please try again.');
    }
  }, []);

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedQuery) {
      if (!isSelectingRef.current) {
        handleSearch(debouncedQuery);
        setShowSuggestions(true);
      }
      isSelectingRef.current = false;
    } else {
      setResults([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery, handleSearch]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all jobs and prepare clustering data
  useEffect(() => {
    const fetchJobs = async () => {
      setIsJobsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/job/all`,
        );
        if (response.data && Array.isArray(response.data)) {
          // Apply deterministic offset to each job's coordinates
          const offsetJobs: Job[] = response.data.map((job: Job) => {
            const { latOffset, lngOffset } = generateOffset(job.id);
            const originalLat = parseFloat(job.position.latitude);
            const originalLng = parseFloat(job.position.longitude);
            const approxLat = originalLat + latOffset;
            const approxLng = originalLng + lngOffset;
            return {
              ...job,
              position: {
                latitude: approxLat.toString(),
                longitude: approxLng.toString(),
              },
            };
          });

          setJobs(offsetJobs);

          // Create GeoJSON FeatureCollection with flattened properties
          const points = offsetJobs.map((job: Job) => ({
            type: 'Feature',
            properties: {
              cluster: false,
              jobId: job.id,
              title: job.title,
              categoryName: job.category.name,
              rate: job.rate,
              payment_type: job.payment_type,
              date: job.date,
              description: job.description,
              // Add other flattened properties if needed
            },
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(job.position.longitude),
                parseFloat(job.position.latitude),
              ],
            },
          }));

          const superclusterInstance = new supercluster({
            radius: 75,
            maxZoom: 20,
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          superclusterInstance.load(points);
          setSuperclusterInstance(superclusterInstance);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Update clusters and unclustered points whenever viewport or jobs change
  useEffect(() => {
    if (superclusterInstance && mapRef.current) {
      const map = mapRef.current.getMap();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const mapBounds = map.getBounds().toArray().flat();
      setBounds(mapBounds);
      const zoom = Math.floor(viewport.zoom);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const allClusters = superclusterInstance.getClusters(mapBounds, zoom);

      const newClusters = allClusters.filter(
        (feature) => feature.properties.cluster,
      );
      const newUnclusteredPoints = allClusters.filter(
        (feature) => !feature.properties.cluster,
      );

      setClusters(newClusters as supercluster.ClusterFeature<Job>[]);
      setUnclusteredPoints(
        newUnclusteredPoints as supercluster.ClusterFeature<Job>[],
      );
    }
  }, [superclusterInstance, viewport]);

  // Handle map click for clusters and individual points
  const onMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features && event.features[0];
      if (!feature) return;

      const clusterId = feature.properties?.cluster_id;
      if (clusterId && superclusterInstance) {
        const expansionZoom =
          superclusterInstance.getClusterExpansionZoom(clusterId);
        setViewport((prev) => ({
          ...prev,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          longitude: feature.geometry.coordinates[0],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          latitude: feature.geometry.coordinates[1],
          zoom: expansionZoom,
          transitionDuration: 500,
        }));
      } else {
        // It's a single point
        const jobId = feature.properties?.jobId;
        const job = jobs.find((j) => j.id === jobId);
        if (job && mapRef.current) {
          const map = mapRef.current.getMap();
          const point = map.project([
            parseFloat(job.position.longitude),
            parseFloat(job.position.latitude),
          ]);
          const { x, y } = point; // Correct destructuring
          setSelectedJob(job);
          setPopupPosition({ x, y });
        }
      }
    },
    [jobs, superclusterInstance],
  );

  // Function to calculate pixels for a given meter radius based on zoom and latitude
  useCallback((latitude: number, zoom: number, meters: number): number => {
    const metersPerPixel =
      (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
    return meters / metersPerPixel;
  }, []);
  // Memoized cluster layer styles
  const clusterLayer = useMemo(
    () => ({
      id: 'clusters',
      type: 'circle',
      source: 'clusters',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#ffffff',
          10,
          '#ffffff',
          30,
          '#ffffff',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
        'circle-opacity': 0.6, // Semi-transparent for faded effect
      },
    }),
    [],
  );

  const clusterCountLayer = useMemo(
    () => ({
      id: 'cluster-count',
      type: 'symbol',
      source: 'clusters',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 16,
      },
      paint: {
        'text-color': '#000000',
      },
    }),
    [],
  );

  return (
    <div className="relative flex flex-col items-center">
      {/* Loader Overlay */}
      {(isJobsLoading || isMapLoading) && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-50"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="loader h-16 w-16 rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative z-10 flex w-80 flex-row p-2 sm:w-96">
        <div ref={suggestionsRef} className="w-full">
          <input
            type="text"
            placeholder="Search for a location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(query);
                setShowSuggestions(false);
              }
            }}
            aria-label="Search for a location"
            aria-haspopup="listbox"
          />
          <button
            onClick={() => {
              handleSearch(query);
              setShowSuggestions(false);
            }}
            className="flex-shrink-0 rounded-r-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Search
          </button>
          {showSuggestions && results.length > 0 && (
            <ul
              className="absolute left-0 top-full z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
              role="listbox"
            >
              {results.map((result, index) => (
                <li
                  key={index}
                  onClick={() => {
                    isSelectingRef.current = true;
                    setQuery(result.display_name);
                    setShowSuggestions(false);
                    setViewport({
                      longitude: parseFloat(result.lon),
                      latitude: parseFloat(result.lat),
                      zoom: 14,
                    });
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  role="option"
                  aria-selected={query === result.display_name} // Add this line
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Map and Popup Container */}
      <div className="relative mt-4 h-full w-full overflow-hidden rounded-3xl shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff]">
        <Map
          {...viewport}
          onMove={(evt) => {
            setViewport(evt.viewState);
            setCurrentZoom(evt.viewState.zoom);
            // Close the popup when the map moves
            if (selectedJob) {
              setSelectedJob(null);
              setPopupPosition(null);
            }
          }}
          style={{ width: '100vw', height: '80vh' }} // Updated size
          ref={mapRef}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          interactiveLayerIds={['clusters']} // Only clusters are interactive via layers
          onClick={onMapClick}
          onLoad={() => setIsMapLoading(false)} // Set map loading to false when loaded
          maxBounds={norwayBounds} // Restrict map to Norway's bounds
          maxZoom={16} // Prevent zooming in too far
        >
          {superclusterInstance && clusters && (
            <Source
              id="clusters"
              type="geojson"
              data={{
                type: 'FeatureCollection',
                features: clusters,
              }}
              cluster={false} // Clustering is handled by supercluster
            >
              <Layer {...(clusterLayer as any)} />
              <Layer {...(clusterCountLayer as any)} />
            </Source>
          )}

          {/* Render Markers for unclustered points with Dynamic Opaque Circles */}
          {superclusterInstance && unclusteredPoints && (
            <>
              {unclusteredPoints.map((point) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const job = jobs.find((j) => j.id === point.properties.jobId);
                if (!job) return null;

                const lat = parseFloat(job.position.latitude);
                // Calculate pixels for 200m radius
                const metersPerPixel =
                  (156543.03392 * Math.cos((lat * Math.PI) / 180)) /
                  Math.pow(2, currentZoom);
                const pixels = 200 / metersPerPixel; // 200m radius

                // Ensure minimum and maximum pixel sizes to prevent overly small or large circles
                const minPixels = 10;
                const maxPixels = 100;
                const adjustedPixels = Math.min(
                  Math.max(pixels, minPixels),
                  maxPixels,
                );

                return (
                  <Marker
                    key={job.id}
                    longitude={parseFloat(job.position.longitude)}
                    latitude={parseFloat(job.position.latitude)}
                    anchor="center" // Center anchor to align the circle and content correctly
                  >
                    <JobMarker
                      job={job}
                      adjustedPixels={adjustedPixels}
                      onClick={() => {
                        setSelectedJob(job);
                        if (mapRef.current) {
                          const map = mapRef.current.getMap();
                          const pointScreen = map.project([
                            parseFloat(job.position.longitude),
                            parseFloat(job.position.latitude),
                          ]);
                          setPopupPosition({
                            x: pointScreen.x,
                            y: pointScreen.y,
                          });
                        }
                      }}
                    />
                  </Marker>
                );
              })}
            </>
          )}

          {/* Custom Popup */}
          {selectedJob && popupPosition && (
            <CustomPopup
              job={selectedJob}
              position={popupPosition}
              onClose={() => {
                setSelectedJob(null);
                setPopupPosition(null);
              }}
            />
          )}
        </Map>
      </div>
    </div>
  );
};
export default memo(SearchAndMap);
