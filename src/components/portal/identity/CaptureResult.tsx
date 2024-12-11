// components/identity/CaptureResult.tsx

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CaptureResultProps {
  analysisResult: {
    date_of_birth: string;
    full_name: string;
    legit: string; // Assuming it's a string based on the example
    reevaluationInstructions?: string;
  };
  onRetakePhoto: () => void;
}

const CaptureResult: React.FC<CaptureResultProps> = ({ analysisResult, onRetakePhoto }) => {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (analysisResult.legit.toLowerCase() === 'true') {
      // Sett en timeout for omdirigering etter 4 sekunder (4000 ms)
      timeoutId = setTimeout(() => {
        router.push('/portal?passed-id-check=true');
      }, 4000);
    }

    // Rydd opp timeout hvis komponenten avmonteres før timeouten fullføres
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [analysisResult, router]);

  return (
    <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">ID-Sjekk Resultat</h2>

      {/* Legit Status */}
      <div className={`mb-4 p-4 rounded ${analysisResult.legit.toLowerCase() === 'true' ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
        <p className={`font-medium ${analysisResult.legit.toLowerCase() === 'true' ? 'text-green-700' : 'text-red-700'}`}>
          {analysisResult.legit.toLowerCase() === 'true' ? 'Identitet Bekreftet!' : 'Identitetsjekk Feilet'}
        </p>
      </div>

      {/* Display Analysis Details */}
      <div className="mb-4">
        <p><span className="font-semibold">Fullt Navn:</span> {analysisResult.full_name}</p>
        <p><span className="font-semibold">Fødselsdato:</span> {new Date(analysisResult.date_of_birth).toLocaleDateString()}</p>
      </div>

      {/* Re-evaluation Instructions */}
      {analysisResult.reevaluationInstructions && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="font-medium text-yellow-700">Instruksjoner for Revurdering:</p>
          <p>{analysisResult.reevaluationInstructions}</p>
        </div>
      )}

      {/* Retake Photo Button (Only if Legit is false) */}
      {analysisResult.legit.toLowerCase() !== 'true' && (
        <button
          onClick={onRetakePhoto}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Ta Nytt Bilde
        </button>
      )}

      {/* Loading Indicator */}
      {analysisResult.legit.toLowerCase() === 'true' && (
        <p className="mt-4 text-green-600">Omdirigerer til dashbordet ditt...</p>
      )}
    </div>
  );
};

export default CaptureResult;
