import { useState, useEffect } from 'react';
import type { Apprenticeship } from '../types';

export function useApprenticeships() {
  const [apprenticeships, setApprenticeships] = useState<Apprenticeship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/apprenticeships.json`);
        if (!response.ok) {
          throw new Error('Failed to load apprenticeship data');
        }
        const data = await response.json();
        console.log('[Apprenticeships] Loaded', data.length, 'entries');
        setApprenticeships(data);
      } catch (err) {
        console.error('[Apprenticeships] Load error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return { apprenticeships, isLoading, error };
}
