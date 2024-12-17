// app/portal/verify-id/page.tsx

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import CaptureResult from '@/components/portal/identity/CaptureResult';
import Camera from '@/components/portal/identity/Camera';
import LoadingLogo from '@/components/NSRVLoader';

const VerifyID: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoCapture = async (photoBlob: Blob | null) => {
    console.log('Foto tatt, laster opp...');
    if (!photoBlob) {
      setError('Opptak av foto mislyktes.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        'id_card',
        new File([photoBlob], 'id_card.jpg', { type: 'image/jpeg' }),
      );

      const response = await axios.post('/api/identity/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Opplasting vellykket:', response.data);
      setAnalysisResult(response.data);
      setIsCapturing(false);
    } catch (err) {
      console.error('Opplasting mislyktes:', err);
      setError(
        'Kunne ikke laste opp og analysere fotoet. Kontakt kundestøtte dersom problemet vedvarer',
      );
    }
  };

  const handleRetakePhoto = () => {
    console.log('Tar nytt bilde...');
    setAnalysisResult(null);
    setError(null);
    setIsCapturing(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6">
      <h1 className="mb-4 text-2xl font-semibold">ID-Verifisering</h1>

      {error && <p className="mb-4 w-1/2 text-center text-red-500">{error}</p>}

      {!isCapturing && !analysisResult && (
        <Camera
          onPhotoCapture={(blob: any) => {
            setIsCapturing(true);
            handlePhotoCapture(blob);
          }}
          onError={setError}
        />
      )}
      {isCapturing && !analysisResult && (
        <>
          <LoadingLogo />
          <p className="text-blue-500">Laster opp og analyserer ID-en din...</p>
        </>
      )}

      {analysisResult && (
        <CaptureResult
          analysisResult={analysisResult}
          onRetakePhoto={handleRetakePhoto}
        />
      )}
    </div>
  );
};

export default VerifyID;
