import PromiseWorker from 'promise-worker';

const worker = new Worker(
  new URL('../workers/routerWorker.ts', import.meta.url),
  { type: 'module' }
);

const promiseWorker = new PromiseWorker(worker);

export interface NearestStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface StopArrival {
  stopId: string;
  arrivalMinutes: number;
  lat: number;
  lng: number;
  name: string;
}

export async function findNearestStop(lat: number, lng: number): Promise<NearestStop | null> {
  return promiseWorker.postMessage({
    type: 'findNearestStop',
    lat,
    lng,
  });
}

export async function computeArrivals(
  originStopId: string,
  departureTime: Date,
  maxDurationMinutes: number
): Promise<StopArrival[]> {
  return promiseWorker.postMessage({
    type: 'computeArrivals',
    originStopId,
    departureTime: departureTime.toISOString(),
    maxDurationMinutes,
  });
}
