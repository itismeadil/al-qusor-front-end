import { useEffect } from 'react';

const GoogleAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [measurementId]);

  return null;
};

export default GoogleAnalytics;