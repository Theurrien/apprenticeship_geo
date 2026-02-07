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
            <ApprenticeshipCard
              key={apprenticeship.id}
              apprenticeship={apprenticeship}
              isSelected={apprenticeship.id === selectedId}
              onClick={() => onSelect(apprenticeship.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
