type SatellitesPanelErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export const SatellitesPanelError = ({ message, onRetry }: SatellitesPanelErrorProps) => (
  <div className="border-(--destructive) text-(--destructive) flex animate-pulse flex-row items-center gap-2 border-2 p-2 text-sm uppercase tracking-wider">
    <span>&gt; ERROR: {message || 'SATELLITE DATA UNAVAILABLE'}</span>
    {onRetry && (
      <button
        type="button"
        className="border-(--destructive) mt-1 border-2 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-red-700"
        onClick={onRetry}
      >
        RETRY
      </button>
    )}
  </div>
);
