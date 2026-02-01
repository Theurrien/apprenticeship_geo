import * as turf from '@turf/turf';
import type { Apprenticeship, ReachableApprenticeship } from '../types';
import type { StopArrival } from './routing';

const WALK_SPEED_M_PER_MIN = 80; // ~4.8 km/h
const MAX_WALK_MINUTES = 5;
const MAX_WALK_METERS = MAX_WALK_MINUTES * WALK_SPEED_M_PER_MIN; // 400m

export function findReachableApprenticeships(
  arrivals: StopArrival[],
  apprenticeships: Apprenticeship[],
  maxTotalMinutes: number
): ReachableApprenticeship[] {
  const results: ReachableApprenticeship[] = [];
  const seen = new Set<string>();

  for (const apprenticeship of apprenticeships) {
    if (seen.has(apprenticeship.id)) continue;

    const apprenticePoint = turf.point([apprenticeship.lng, apprenticeship.lat]);
    let bestTime = Infinity;
    let bestStopName = '';

    for (const arrival of arrivals) {
      const stopPoint = turf.point([arrival.lng, arrival.lat]);
      const distanceMeters = turf.distance(apprenticePoint, stopPoint, { units: 'meters' });

      if (distanceMeters <= MAX_WALK_METERS) {
        const walkMinutes = distanceMeters / WALK_SPEED_M_PER_MIN;
        const totalTime = arrival.arrivalMinutes + walkMinutes;

        if (totalTime <= maxTotalMinutes && totalTime < bestTime) {
          bestTime = totalTime;
          bestStopName = arrival.name;
        }
      }
    }

    if (bestTime <= maxTotalMinutes) {
      seen.add(apprenticeship.id);
      results.push({
        ...apprenticeship,
        travelTime: Math.round(bestTime),
        nearestStopName: bestStopName,
      });
    }
  }

  return results.sort((a, b) => a.travelTime - b.travelTime);
}

export function createIsochronePolygon(
  arrivals: StopArrival[],
  maxMinutes: number
): GeoJSON.Feature<GeoJSON.Polygon> | null {
  // Filter arrivals within time limit and add walking buffer
  const points: [number, number][] = [];

  for (const arrival of arrivals) {
    if (arrival.arrivalMinutes <= maxMinutes - MAX_WALK_MINUTES) {
      points.push([arrival.lng, arrival.lat]);
    }
  }

  if (points.length < 3) {
    return null;
  }

  // Create convex hull of reachable stops
  const pointsCollection = turf.featureCollection(
    points.map(p => turf.point(p))
  );

  const hull = turf.convex(pointsCollection);

  if (!hull) {
    return null;
  }

  // Buffer the hull by walking distance
  const buffered = turf.buffer(hull, MAX_WALK_METERS / 1000, { units: 'kilometers' });

  return buffered as GeoJSON.Feature<GeoJSON.Polygon>;
}
