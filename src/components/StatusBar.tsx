interface StatusBarProps {
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function StatusBar({
  lastUpdated,
  loading,
  error,
  onRefresh,
}: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-bar-left">
        {loading && <span className="status-indicator loading">Updating...</span>}
        {error && <span className="status-indicator error">Error: {error}</span>}
        {!loading && !error && (
          <span className="status-indicator ok">Connected</span>
        )}
      </div>
      <div className="status-bar-right">
        {lastUpdated && (
          <span className="status-time">
            Last update: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
        <button className="btn-refresh" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>
    </div>
  );
}
