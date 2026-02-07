import { useState } from 'react';
import { Map } from './components/Map';
import { AddressSearch } from './components/AddressSearch';
import { TimeSlider } from './components/TimeSlider';
import { ResultsPanel } from './components/ResultsPanel';
import { useApprenticeships } from './hooks/useApprenticeships';
import { useReachability } from './hooks/useReachability';
import './App.css';

function App() {
  const [startPoint, setStartPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [maxMinutes, setMaxMinutes] = useState(30);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { apprenticeships, isLoading: isLoadingData, error: dataError } = useApprenticeships();
  const { reachable, isochrone, isComputing, error: routingError } = useReachability(
    startPoint,
    maxMinutes,
    apprenticeships
  );

  const handleAddressSelect = (lat: number, lng: number, _label: string) => {
    setStartPoint({ lat, lng });
    setSelectedId(null);
  };

  return (
    <div className="app">
      <div className="controls-bar">
        <div className="controls-content">
          <img
            src={`${import.meta.env.BASE_URL}assets/logo_fr.jpeg`}
            alt="Carte des Métiers Suisse"
            className="app-logo"
          />
          <AddressSearch onSelect={handleAddressSelect} />
          <TimeSlider value={maxMinutes} onChange={setMaxMinutes} />
        </div>
      </div>

      <div className="main-content">
        <div className="map-wrapper">
          <Map
            startPoint={startPoint}
            results={reachable}
            selectedId={selectedId}
            onSelectApprenticeship={setSelectedId}
            isochrone={isochrone}
          />
        </div>

        <ResultsPanel
          results={reachable}
          selectedId={selectedId}
          onSelect={setSelectedId}
          isLoading={isLoadingData || isComputing}
          error={dataError || routingError || null}
        />
      </div>
    </div>
  );
}

export default App;
