import { usePolling } from "../hooks/usePolling";
import { getNetworkStats, getPoolStats } from "../api/p2pool";
import StatusBar from "./StatusBar";
import {
  formatHashrate,
  formatDifficulty,
  formatXMR,
  formatNumber,
  formatTimeAgo,
  formatDate,
  formatPercent,
  formatDuration,
  shortenHash,
} from "../utils/formatters";

export default function Network() {
  const network = usePolling(getNetworkStats);
  const pool = usePolling(getPoolStats);

  const refresh = () => {
    network.refresh();
    pool.refresh();
  };

  const netHashrate = network.data ? network.data.difficulty / 120 : 0;

  return (
    <div className="page">
      <StatusBar
        lastUpdated={network.lastUpdated}
        loading={network.loading}
        error={network.error}
        onRefresh={refresh}
      />

      {/* Monero Network */}
      <div className="card card-wide">
        <h2 className="card-title">Monero Network</h2>
        {network.data ? (
          <div className="stat-grid">
            <div className="stat">
              <span className="stat-label">Block Height</span>
              <span className="stat-value highlight">
                {formatNumber(network.data.height)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Network Difficulty</span>
              <span className="stat-value">
                {formatDifficulty(network.data.difficulty)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Est. Network Hashrate</span>
              <span className="stat-value">
                {formatHashrate(netHashrate)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Block Reward</span>
              <span className="stat-value">
                {formatXMR(network.data.reward)} XMR
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Block Time</span>
              <span className="stat-value">120s (target)</span>
            </div>
            <div className="stat">
              <span className="stat-label">Last Block</span>
              <span className="stat-value">
                {formatTimeAgo(network.data.timestamp)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Last Block Time</span>
              <span className="stat-value">
                {formatDate(network.data.timestamp)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Latest Hash</span>
              <span className="stat-value">
                <code className="mono">{shortenHash(network.data.hash, 10)}</code>
              </span>
            </div>
          </div>
        ) : (
          <div className="loading-placeholder">Loading network data...</div>
        )}
      </div>

      {/* P2Pool Sidechain */}
      {pool.data && (
        <div className="card card-wide">
          <h2 className="card-title">P2Pool Sidechain</h2>
          <div className="stat-grid">
            <div className="stat">
              <span className="stat-label">Sidechain Height</span>
              <span className="stat-value highlight">
                {formatNumber(pool.data.pool_statistics.sidechainHeight)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Sidechain Difficulty</span>
              <span className="stat-value">
                {formatDifficulty(pool.data.pool_statistics.sidechainDifficulty)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">PPLNS Window</span>
              <span className="stat-value">
                {formatNumber(pool.data.pool_statistics.pplnsWindowSize)} blocks
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Pool Hashrate</span>
              <span className="stat-value">
                {formatHashrate(pool.data.pool_statistics.hashRate)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Active Miners</span>
              <span className="stat-value">
                {formatNumber(pool.data.pool_statistics.miners)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Pool % of Network</span>
              <span className="stat-value">
                {netHashrate > 0
                  ? formatPercent(
                      (pool.data.pool_statistics.hashRate / netHashrate) * 100
                    )
                  : "N/A"}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Est. Block Find Time</span>
              <span className="stat-value">
                {pool.data.pool_statistics.hashRate > 0 && network.data
                  ? formatDuration(
                      network.data.difficulty /
                        pool.data.pool_statistics.hashRate
                    )
                  : "N/A"}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Blocks Found</span>
              <span className="stat-value">
                {formatNumber(pool.data.pool_statistics.totalBlocksFound)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
