import { useState, useEffect, useCallback } from 'react';
import { searchAddress, formatSearchResult } from '../services/geocoding';
import type { GeoAdminSearchResult } from '../types';
import './AddressSearch.css';

interface AddressSearchProps {
  onSelect: (lat: number, lng: number, label: string) => void;
}

export function AddressSearch({ onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoAdminSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const search = useCallback(async (text: string) => {
    if (text.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchResults = await searchAddress(text);
    setResults(searchResults);
    setIsLoading(false);
    setShowResults(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (result: GeoAdminSearchResult) => {
    const label = formatSearchResult(result);
    setQuery(label);
    setShowResults(false);
    onSelect(result.attrs.lat, result.attrs.lon, label);
  };

  return (
    <div className="address-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowResults(true)}
        placeholder="Entrez votre adresse..."
        className="address-input"
      />
      {isLoading && <span className="loading-indicator">...</span>}
      {showResults && results.length > 0 && (
        <ul className="results-list">
          {results.map((result, index) => (
            <li
              key={index}
              onClick={() => handleSelect(result)}
              className="result-item"
            >
              {formatSearchResult(result)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
