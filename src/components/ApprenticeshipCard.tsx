import type { ReachableApprenticeship } from '../types';
import './ApprenticeshipCard.css';

interface ApprenticeshipCardProps {
  apprenticeship: ReachableApprenticeship;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ApprenticeshipCard({ apprenticeship, isSelected, onClick }: ApprenticeshipCardProps) {
  return (
    <div
      className={`apprenticeship-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="card-header">
        <span className="travel-time">{apprenticeship.travelTime} min</span>
        <span className="positions">{apprenticeship.positions} place{apprenticeship.positions > 1 ? 's' : ''}</span>
      </div>
      <h3 className="job-title">{apprenticeship.job}</h3>
      <p className="company-name">{apprenticeship.company}</p>
      <p className="location">{apprenticeship.city}</p>
      {apprenticeship.nearestStopName && (
        <p className="nearest-stop">Arrêt: {apprenticeship.nearestStopName}</p>
      )}
      {(apprenticeship.contact_email || apprenticeship.contact_phone) && (
        <div className="contact-info">
          {apprenticeship.contact_email && (
            <a href={`mailto:${apprenticeship.contact_email}`} className="contact-link">
              {apprenticeship.contact_email}
            </a>
          )}
          {apprenticeship.contact_phone && (
            <a href={`tel:${apprenticeship.contact_phone}`} className="contact-link">
              {apprenticeship.contact_phone}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
