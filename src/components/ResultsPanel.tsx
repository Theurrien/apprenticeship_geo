import type { ReachableApprenticeship } from '../types';
import { ApprenticeshipCard } from './ApprenticeshipCard';
import './ResultsPanel.css';

interface ResultsPanelProps {
  results: ReachableApprenticeship[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export function ResultsPanel({ results, selectedId, onSelect, isLoading }: ResultsPanelProps) {
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
