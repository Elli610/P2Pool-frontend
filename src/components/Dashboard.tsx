import { usePolling } from "../hooks/usePolling";
import {
  getNetworkStats,
  getPoolStats,
  getLocalStratum,
} from "../api/p2pool";
import StatusBar from "./StatusBar";
import {
  formatHashrate,
  formatDifficulty,
  formatXMR,
  formatNumber,
  formatTimeAgo,
  formatEffort,
  formatPercent,
  formatDuration,
} from "../utils/formatters";

export default function Dashboard() {
  const network = usePolling(getNetworkStats);
  const pool = usePolling(getPoolStats);
  const stratum = usePolling(getLocalStratum);

  const refresh = () => {
    network.refresh();
    pool.refresh();
    stratum.refresh();
  };

  const anyLoading = network.loading || pool.loading;
  const anyError = network.error || pool.error;

  return (
    <div className="page">
      <StatusBar
        lastUpdated={network.lastUpdated}
        loading={anyLoading}
        error={anyError}
        onRefresh={refresh}
      />

      <div className="card-grid">
        {/* Pool Overview */}
        <div className="card card-wide">
          <h2 className="card-title">Pool Overview</h2>
          {pool.data ? (
            <div className="stat-grid">
              <div className="stat">
                <span className="stat-label">Pool Hashrate</span>
                <span className="stat-value highlight">
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
                <span className="stat-label">Blocks Found</span>
                <span className="stat-value">
                  {formatNumber(pool.data.pool_statistics.totalBlocksFound)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Last Block Found</span>
                <span className="stat-value">
                  {formatTimeAgo(pool.data.pool_statistics.lastBlockFoundTime)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">PPLNS Window</span>
                <span className="stat-value">
                  {formatNumber(pool.data.pool_statistics.pplnsWindowSize)} blocks
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Sidechain Height</span>
                <span className="stat-value">
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
                <span className="stat-label">Total Hashes</span>
                <span className="stat-value">
                  {formatDifficulty(pool.data.pool_statistics.totalHashes)}
                </span>
              </div>
            </div>
          ) : (
            <div className="loading-placeholder">Loading pool data...</div>
          )}
        </div>

        {/* Network Stats */}
        <div className="card">
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
                <span className="stat-label">Difficulty</span>
                <span className="stat-value">
                  {formatDifficulty(network.data.difficulty)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Block Reward</span>
                <span className="stat-value">
                  {formatXMR(network.data.reward)} XMR
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Last Block</span>
                <span className="stat-value">
                  {formatTimeAgo(network.data.timestamp)}
                </span>
              </div>
            </div>
          ) : (
            <div className="loading-placeholder">Loading network data...</div>
          )}
        </div>

        {/* Local Miner Stats */}
        <div className="card">
          <h2 className="card-title">Your Miner</h2>
          {stratum.error ? (
            <div className="info-box">
              <p>Local stratum data unavailable.</p>
              <p className="text-muted">
                Start p2pool with <code>--local-api</code> to enable local miner
                statistics.
              </p>
            </div>
          ) : stratum.data ? (
            <div className="stat-grid">
              <div className="stat">
                <span className="stat-label">Hashrate (15m)</span>
                <span className="stat-value highlight">
                  {formatHashrate(stratum.data.hashrate_15m)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Hashrate (1h)</span>
                <span className="stat-value">
                  {formatHashrate(stratum.data.hashrate_1h)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Hashrate (24h)</span>
                <span className="stat-value">
                  {formatHashrate(stratum.data.hashrate_24h)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Shares Found</span>
                <span className="stat-value">
                  {formatNumber(stratum.data.shares_found)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Shares Failed</span>
                <span className="stat-value">
                  {formatNumber(stratum.data.shares_failed)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Current Effort</span>
                <span className="stat-value">
                  {formatEffort(stratum.data.current_effort)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Average Effort</span>
                <span className="stat-value">
                  {formatEffort(stratum.data.average_effort)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Reward Share</span>
                <span className="stat-value">
                  {formatPercent(stratum.data.block_reward_share_percent)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Connected Workers</span>
                <span className="stat-value">
                  {stratum.data.connections}
                </span>
              </div>
              {stratum.data.last_share_found_time > 0 && (
                <div className="stat">
                  <span className="stat-label">Last Share</span>
                  <span className="stat-value">
                    {formatTimeAgo(stratum.data.last_share_found_time)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="loading-placeholder">Loading miner data...</div>
          )}
        </div>

        {/* Pool vs Network Comparison */}
        {pool.data && network.data && (
          <div className="card">
            <h2 className="card-title">Pool Share</h2>
            <div className="stat-grid">
              <div className="stat">
                <span className="stat-label">Pool % of Network</span>
                <span className="stat-value highlight">
                  {formatPercent(
                    (pool.data.pool_statistics.hashRate /
                      (network.data.difficulty / 120)) *
                      100
                  )}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Est. Network Hashrate</span>
                <span className="stat-value">
                  {formatHashrate(network.data.difficulty / 120)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Est. Time to Find Block</span>
                <span className="stat-value">
                  {pool.data.pool_statistics.hashRate > 0
                    ? formatDuration(
                        network.data.difficulty /
                          pool.data.pool_statistics.hashRate
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
