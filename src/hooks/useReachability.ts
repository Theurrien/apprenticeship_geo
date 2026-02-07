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
      // Use a date within the GTFS validity period (2024-12-15 to 2025-12-18)
      // TODO: Update GTFS data for current year and remove this workaround
      const now = new Date('2025-06-11T08:00:00');

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
