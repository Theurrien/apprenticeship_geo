import {
  Router,
  StopsIndex,
  Timetable,
  Query,
  Time,
} from 'minotor';
import registerPromiseWorker from 'promise-worker/register';

let router: Router | null = null;
let stopsIndex: StopsIndex | null = null;
let isInitialized = false;
let initPromise: Promise<void> | null = null;

async function fetchBinaryData(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return response.arrayBuffer();
}

async function initialize(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    console.log('Loading transit data...');

    const [timetableData, stopsData] = await Promise.all([
      fetchBinaryData('/data/timetable.bin'),
      fetchBinaryData('/data/stops.bin'),
    ]);

    const timetable = Timetable.fromData(new Uint8Array(timetableData));
    stopsIndex = StopsIndex.fromData(new Uint8Array(stopsData));
    router = new Router(timetable, stopsIndex);
    isInitialized = true;

    console.log('Transit data loaded');
  })();

  return initPromise;
}

interface FindNearestStopParams {
  type: 'findNearestStop';
  lat: number;
  lng: number;
}

interface ComputeArrivalsParams {
  type: 'computeArrivals';
  originStopId: string;
  departureTime: string; // ISO string
  maxDurationMinutes: number;
}

type WorkerParams = FindNearestStopParams | ComputeArrivalsParams;

async function handleMessage(params: WorkerParams) {
  await initialize();

  if (params.type === 'findNearestStop') {
    const stops = stopsIndex!.findStopsByLocation(
      params.lat,
      params.lng,
      1,
      10 // 10km radius
    );
    if (stops.length > 0) {
      return {
        id: stops[0].sourceId,
        name: stops[0].name,
        lat: stops[0].lat,
        lng: stops[0].lon,
      };
    }
    return null;
  }

  if (params.type === 'computeArrivals') {
    const departureDate = new Date(params.departureTime);
    const query = new Query.Builder()
      .from(params.originStopId)
      .departureTime(Time.fromDate(departureDate))
      .maxTransfers(5)
      .build();

    const result = router!.route(query);
    const startMinutes = Time.fromDate(departureDate).toMinutes();
    const arrivals: Array<{
      stopId: string;
      arrivalMinutes: number;
      lat: number;
      lng: number;
      name: string;
    }> = [];

    for (const [stopId, reachingTime] of result.routingState.earliestArrivals) {
      const duration = reachingTime.arrival.toMinutes() - startMinutes;

      if (duration <= params.maxDurationMinutes && duration >= 0) {
        const stop = stopsIndex!.findStopById(stopId);
        if (stop && stop.lat && stop.lon) {
          arrivals.push({
            stopId: stop.sourceId || stopId,
            arrivalMinutes: duration,
            lat: stop.lat,
            lng: stop.lon,
            name: stop.name || '',
          });
        }
      }
    }

    return arrivals;
  }

  throw new Error(`Unknown message type: ${(params as any).type}`);
}

registerPromiseWorker(handleMessage);
