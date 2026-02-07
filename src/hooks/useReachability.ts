import { useState, useEffect, useCallback } from 'react';
import type { Apprenticeship, ReachableApprenticeship } from '../types';
import { findNearestStop, computeArrivals } from '../services/routing';
import { findReachableApprenticeships, createIsochronePolygon } from '../services/reachability';

interface UseReachabilityResult {
  reachable: ReachableApprenticeship[];
  isochrone: GeoJSON.Feature<GeoJSON.Polygon> | null;
  isComputing: boolean;
  error: string | null;
}

export function useReachability(
  startPoint: { lat: number; lng: number } | null,
  maxMinutes: number,
  apprenticeships: Apprenticeship[]
): UseReachabilityResult {
  const [reachable, setReachable] = useState<ReachableApprenticeship[]>([]);
  const [isochrone, setIsochrone] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(async () => {
    if (!startPoint || apprenticeships.length === 0) {
      console.log('[Reachability] Skipping:', { startPoint: !!startPoint, apprenticeships: apprenticeships.length });
      setReachable([]);
      setIsochrone(null);
      return;
    }

    setIsComputing(true);
    setError(null);

    try {
      // Find nearest PT stop to start point
      console.log('[Reachability] Finding nearest stop to', startPoint);
      const nearestStop = await findNearestStop(startPoint.lat, startPoint.lng);
      console.log('[Reachability] Nearest stop:', nearestStop);

      if (!nearestStop) {
        setError('Aucun arrêt de transport public trouvé à proximité');
        setReachable([]);
        setIsochrone(null);
        return;
      }

      // Compute arrivals at all reachable stops
      const now = new Date();
      now.setHours(8, 0, 0, 0); // Use 8:00 AM as default departure
      console.log('[Reachability] Computing arrivals from', nearestStop.name, 'at', now.toISOString(), 'max', maxMinutes, 'min');

      const arrivals = await computeArrivals(nearestStop.id, now, maxMinutes);
      console.log('[Reachability] Arrivals:', arrivals.length, 'stops reachable');

      // Find reachable apprenticeships
      const reachableResults = findReachableApprenticeships(
        arrivals,
        apprenticeships,
        maxMinutes
      );
      console.log('[Reachability] Reachable apprenticeships:', reachableResults.length, 'of', apprenticeships.length);

      // Create isochrone polygon
      const isochronePolygon = createIsochronePolygon(arrivals, maxMinutes);

      setReachable(reachableResults);
      setIsochrone(isochronePolygon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de calcul');
      setReachable([]);
      setIsochrone(null);
    } finally {
      setIsComputing(false);
    }
  }, [startPoint, maxMinutes, apprenticeships]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { reachable, isochrone, isComputing, error };
}
