import type { GeoAdminSearchResult } from '../types';

const SEARCH_API = 'https://api3.geo.admin.ch/rest/services/api/SearchServer';

export async function searchAddress(query: string): Promise<GeoAdminSearchResult[]> {
  if (!query || query.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    searchText: query,
    type: 'locations',
    limit: '5',
  });

  try {
    const response = await fetch(`${SEARCH_API}?${params}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

export function formatSearchResult(result: GeoAdminSearchResult): string {
  // Remove HTML tags from label
  return result.attrs.label.replace(/<\/?b>/g, '');
}
