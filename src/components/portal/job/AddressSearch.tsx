// src/components/portal/job/AddressSearch.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';

interface NominatimAddress {
  road?: string;
  house_number?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  // etc.
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
}

interface AddressSearchProps {
  onSelectLocation: (
    lat: number,
    lon: number,
    displayName: string,
    addressDetails?: NominatimAddress
  ) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onSelectLocation }) => {
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    if (userInput.trim().length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setShowDropdown(true);

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const response = await fetch(
          `https://geo.flittigub.no/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
            userInput
          )}`,
          { signal }
        );
        const data = (await response.json()) as NominatimResult[];
        setResults(data);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Nominatim fetch error:', error);
        }
      }
    })();

    return () => controller.abort();
  }, [userInput]);

  const handleSelect = (result: NominatimResult) => {
    const latNum = parseFloat(result.lat);
    const lonNum = parseFloat(result.lon);
    onSelectLocation(latNum, lonNum, result.display_name, result.address);

    setUserInput(''); // Clear
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <label htmlFor="search" className="block font-semibold text-gray-700 dark:text-gray-200">
        Adresse
      </label>
      <input
        id="search"
        type="text"
        placeholder="Skriv inn adresse..."
        value={userInput}
        onChange={handleInputChange}
        className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded-md border
                   border-gray-300 p-2 focus:border-primary focus:ring-1 focus:ring-primary"
      />

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border
                       border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
          {results.map((r) => (
            <li
              key={r.place_id}
              onClick={() => handleSelect(r)}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
