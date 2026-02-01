export interface Apprenticeship {
  id: string;
  company: string;
  job: string;
  canton: string;
  city: string;
  lat: number;
  lng: number;
  address: string;
  postal: string;
  positions: number;
  contact_email: string;
  contact_phone: string;
  start_year: number | null;
  language: string;
}

export interface ReachableApprenticeship extends Apprenticeship {
  travelTime: number; // Total travel time in minutes
  nearestStopName?: string;
}

export interface GeoAdminSearchResult {
  attrs: {
    label: string;
    lat: number;
    lon: number;
    detail: string;
  };
}

export interface StopArrival {
  stopId: string;
  arrivalMinutes: number;
  lat: number;
  lng: number;
}
