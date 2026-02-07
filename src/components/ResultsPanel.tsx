import { useEffect, useRef } from 'react';
import type { ReachableApprenticeship } from '../types';
import { ApprenticeshipCard } from './ApprenticeshipCard';
import './ResultsPanel.css';

interface ResultsPanelProps {
  results: ReachableApprenticeship[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ResultsPanel({ results, selectedId, onSelect, isLoading, error }: ResultsPanelProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (selectedId) {
      const el = cardRefs.current.get(selectedId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedId]);

  if (isLoading) {
    return (
      <div className="results-panel">
        <div className="loading-message">
          Calcul des trajets en cours...
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Places d'apprentissage</h2>
        <span className="results-count">{results.length} résultat{results.length !== 1 ? 's' : ''}</span>
      </div>
      {error && (
        <div className="error-message" style={{ padding: '12px 16px', background: '#fff3f3', color: '#d32f2f', fontSize: '14px', borderBottom: '1px solid #ffcdd2' }}>
          {error}
        </div>
      )}
      <div className="results-list">
        {results.length === 0 ? (
          <p className="no-results">
            Aucune place d'apprentissage trouvée dans ce rayon.
            Essayez d'augmenter le temps de trajet.
          </p>
        ) : (
          results.map((apprenticeship) => (
            <div
              key={apprenticeship.id}
              ref={(el) => {
                if (el) cardRefs.current.set(apprenticeship.id, el);
                else cardRefs.current.delete(apprenticeship.id);
              }}
            >
              <ApprenticeshipCard
                apprenticeship={apprenticeship}
                isSelected={apprenticeship.id === selectedId}
                onClick={() => onSelect(apprenticeship.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
