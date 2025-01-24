'use client';
import { useEffect } from 'react';

const GoogleTagManager = () => {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-1T5XXPCG00';

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1T5XXPCG00');
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    // Cleanup function to remove the scripts if necessary
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []); // Empty dependency array ensures this runs only once

  return null; // This component does not render anything
};

export default GoogleTagManager;
