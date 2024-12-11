// components/identity/Camera.tsx

import React, { useEffect, useRef } from 'react';

interface CameraProps {
  onPhotoCapture: (photoBlob: Blob | null) => void;
  onError: (errorMessage: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoCapture, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const currentVideo = videoRef.current; // Capture the current video ref

    const initCamera = async () => {
      console.log('Initialiserer kamera...');
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (currentVideo) {
          currentVideo.srcObject = stream;
          currentVideo.muted = true;

          // Lytt til 'playing' event for å bekrefte at videoen spilles av
          currentVideo.onplaying = () => {
            console.log('Kamera initialisert og video spilles av');
          };

          // Prøv å spille av videoen
          await currentVideo.play().catch((playError) => {
            console.error('Feil under avspilling av video:', playError);
            // Ikke kall onError her, siden videoen fortsatt er synlig
          });
        }
      } catch (err) {
        console.error('Kamera initialisering mislyktes:', err);
        onError('Kunne ikke få tilgang til kameraet. Sørg for at tillatelser er gitt.');
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log('Kamera stoppet');
      }
      if (currentVideo) { // Use the captured video ref
        currentVideo.srcObject = null;
      }
    };
  }, [onError]);

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) {
      onError('Opptak mislyktes: mangler lerret eller videoelement.');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onError('Opptak mislyktes: kunne ikke få canvas-kontekst.');
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      console.log('Foto tatt');
      onPhotoCapture(blob);
    }, 'image/jpeg');
  };

  return (
    <div className="relative w-full max-w-md">
      <video ref={videoRef} className="w-full rounded-lg shadow-lg" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleCapture}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-5 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
      >
        Ta Bilde
      </button>
    </div>
  );
};

export default Camera;
