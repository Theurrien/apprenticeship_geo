import { useState, useEffect, useCallback, useRef } from 'react';
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
  const skipSearchRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: GeoAdminSearchResult) => {
    const label = formatSearchResult(result);
    skipSearchRef.current = true;
    setQuery(label);
    setShowResults(false);
    setResults([]);
    onSelect(result.attrs.lat, result.attrs.lon, label);
  };

  return (
    <div className="address-search" ref={containerRef}>
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
