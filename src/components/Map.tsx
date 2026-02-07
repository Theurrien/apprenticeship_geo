import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ReachableApprenticeship } from '../types';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const SWISS_TILES = 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg';
const SWISS_CENTER: [number, number] = [46.8, 8.2];
const SWISS_ZOOM = 8;

// Custom icons
const startIcon = L.divIcon({
  className: 'start-marker',
  html: '<div class="start-marker-inner"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const apprenticeshipIcon = L.divIcon({
  className: 'apprenticeship-marker',
  html: '<div class="apprenticeship-marker-inner"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const selectedApprenticeshipIcon = L.divIcon({
  className: 'apprenticeship-marker selected',
  html: '<div class="apprenticeship-marker-inner"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapViewUpdaterProps {
  startPoint: { lat: number; lng: number } | null;
  results: ReachableApprenticeship[];
  selectedResult: ReachableApprenticeship | null;
}

function MapViewUpdater({ startPoint, results, selectedResult }: MapViewUpdaterProps) {
  const map = useMap();
  const hasInitialFit = useRef(false);

  useEffect(() => {
    if (startPoint && results.length > 0 && !hasInitialFit.current) {
      // Fit bounds to show start point + all result markers (only on first load)
      const points: L.LatLngExpression[] = [
        [startPoint.lat, startPoint.lng],
        ...results.map(r => [r.lat, r.lng] as [number, number]),
      ];
      map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
      hasInitialFit.current = true;
    } else if (startPoint && results.length === 0) {
      map.setView([startPoint.lat, startPoint.lng], 13);
      hasInitialFit.current = false;
    }
  }, [startPoint, results, map]);

  // Reset fit flag when start point changes
  useEffect(() => {
    hasInitialFit.current = false;
  }, [startPoint]);

  // Pan to selected marker when card is clicked
  useEffect(() => {
    if (selectedResult) {
      map.panTo([selectedResult.lat, selectedResult.lng], { animate: true });
    }
  }, [selectedResult, map]);

  return null;
}

interface MapProps {
  startPoint: { lat: number; lng: number } | null;
  results: ReachableApprenticeship[];
  selectedId: string | null;
  onSelectApprenticeship: (id: string) => void;
  isochrone: GeoJSON.Feature<GeoJSON.Polygon> | null;
}

export function Map({ startPoint, results, selectedId, onSelectApprenticeship, isochrone }: MapProps) {
  const mapRef = useRef<L.Map>(null);

  const isochroneStyle = {
    fillColor: '#2196f3',
    fillOpacity: 0.2,
    color: '#1976d2',
    weight: 2,
  };

  return (
    <MapContainer
      ref={mapRef}
      center={SWISS_CENTER}
      zoom={SWISS_ZOOM}
      className="map-container"
    >
      <TileLayer
        url={SWISS_TILES}
        attribution='&copy; <a href="https://www.swisstopo.admin.ch">swisstopo</a>'
      />

      <MapViewUpdater
        startPoint={startPoint}
        results={results}
        selectedResult={results.find(r => r.id === selectedId) || null}
      />

      {isochrone && (
        <GeoJSON
          key={JSON.stringify(isochrone)}
          data={isochrone}
          style={isochroneStyle}
        />
      )}

      {startPoint && (
        <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon}>
          <Popup>Votre position</Popup>
        </Marker>
      )}

      {results.map((apprenticeship) => (
        <Marker
          key={apprenticeship.id}
          position={[apprenticeship.lat, apprenticeship.lng]}
          icon={apprenticeship.id === selectedId ? selectedApprenticeshipIcon : apprenticeshipIcon}
          eventHandlers={{
            click: () => onSelectApprenticeship(apprenticeship.id),
          }}
        >
          <Popup>
            <strong>{apprenticeship.job}</strong>
            <br />
            {apprenticeship.company}
            <br />
            <em>{apprenticeship.travelTime} min</em>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
