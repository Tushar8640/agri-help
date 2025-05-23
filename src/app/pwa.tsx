// components/PWA.tsx
'use client'

import { useEffect } from 'react'

// Define types for Workbox events
type WorkboxEvent = {
  type: string;
  isUpdate?: boolean;
}

declare global {
  interface Window {
    workbox: {
      register: () => Promise<void>;
      addEventListener: (
        type: string,
        callback: (event?: WorkboxEvent) => void
      ) => void;
    };
  }
}

export default function PWA(): null {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      
      const handleInstalled = (event?: WorkboxEvent) => {
        console.log(`Event ${event?.type} is triggered.`);
        console.log(event);
        if (event?.isUpdate) {
          console.log('App updated');
        } else {
          console.log('App installed');
        }
      };

      const handleControlling = () => {
        console.log('New service worker controlling the page');
        window.location.reload();
      };

      const handleActivated = (event?: WorkboxEvent) => {
        console.log(`Event ${event?.type} is triggered.`);
        console.log(event);
      };

      wb.addEventListener('installed', handleInstalled);
      wb.addEventListener('controlling', handleControlling);
      wb.addEventListener('activated', handleActivated);

      wb.register().catch((error: Error) => {
        console.error('Service worker registration failed:', error);
      });

      // Cleanup function
      return () => {
        wb.addEventListener('installed', handleInstalled);
        wb.addEventListener('controlling', handleControlling);
        wb.addEventListener('activated', handleActivated);
      };
    }
  }, []);

  return null;
}