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
      setReachable([]);
      setIsochrone(null);
      return;
    }

    setIsComputing(true);
    setError(null);

    try {
      // Find nearest PT stop to start point
      const nearestStop = await findNearestStop(startPoint.lat, startPoint.lng);

      if (!nearestStop) {
        setError('Aucun arrêt de transport public trouvé à proximité');
        setReachable([]);
        setIsochrone(null);
        return;
      }

      // Compute arrivals at all reachable stops
      const now = new Date();
      now.setHours(8, 0, 0, 0); // Use 8:00 AM as default departure

      const arrivals = await computeArrivals(nearestStop.id, now, maxMinutes);

      // Find reachable apprenticeships
      const reachableResults = findReachableApprenticeships(
        arrivals,
        apprenticeships,
        maxMinutes
      );

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
