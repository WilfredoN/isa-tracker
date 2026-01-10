import { Button } from '../../ui';

type SatellitesPanelErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export const SatellitesPanelError = ({ message, onRetry }: SatellitesPanelErrorProps) => (
  <div className="border-(--destructive) text-(--destructive) flex animate-pulse flex-row items-center gap-2 border-2 p-2 text-sm uppercase tracking-wider">
    <span>&gt; ERROR: {message || 'SATELLITE DATA UNAVAILABLE'}</span>
    {onRetry && (
      <Button type="button" variant="error" className="mt-1 px-3 py-1 text-xs" onClick={onRetry}>
        RETRY
      </Button>
    )}
  </div>
);
