import { usePolling } from "../hooks/usePolling";
import { getLocalStratum } from "../api/p2pool";
import { parseWorker } from "../api/types";
import StatusBar from "./StatusBar";
import {
  formatHashrate,
  formatDuration,
  formatNumber,
  formatEffort,
  formatPercent,
  formatTimeAgo,
  shortenAddress,
} from "../utils/formatters";

export default function Miners() {
  const stratum = usePolling(getLocalStratum);

  if (stratum.error) {
    return (
      <div className="page">
        <StatusBar
          lastUpdated={null}
          loading={false}
          error={stratum.error}
          onRefresh={stratum.refresh}
        />
        <div className="card">
          <h2 className="card-title">Local Miner Statistics</h2>
          <div className="info-box">
            <p>Local stratum data is not available.</p>
            <p className="text-muted">
              Make sure p2pool is started with <code>--data-api &lt;path&gt;</code>{" "}
              and <code>--local-api</code> flags to expose local miner statistics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const workers = stratum.data?.workers.map(parseWorker) ?? [];

  return (
    <div className="page">
      <StatusBar
        lastUpdated={stratum.lastUpdated}
        loading={stratum.loading}
        error={stratum.error}
        onRefresh={stratum.refresh}
      />

      {/* Miner Summary */}
      {stratum.data && (
        <div className="card card-wide">
          <h2 className="card-title">Your Miner Summary</h2>
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
              <span className="stat-label">Total Hashes</span>
              <span className="stat-value">
                {formatNumber(stratum.data.total_hashes)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Stratum Shares</span>
              <span className="stat-value">
                {formatNumber(stratum.data.total_stratum_shares)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Sidechain Shares</span>
              <span className="stat-value">
                {stratum.data.shares_found} found / {stratum.data.shares_failed}{" "}
                failed
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
              <span className="stat-label">Block Reward Share</span>
              <span className="stat-value highlight">
                {formatPercent(stratum.data.block_reward_share_percent)}
              </span>
            </div>
            {stratum.data.last_share_found_time > 0 && (
              <div className="stat">
                <span className="stat-label">Last Share Found</span>
                <span className="stat-value">
                  {formatTimeAgo(stratum.data.last_share_found_time)}
                </span>
              </div>
            )}
          </div>
          {stratum.data.wallet && (
            <div className="wallet-display">
              <span className="stat-label">Wallet</span>
              <code className="wallet-address">{stratum.data.wallet}</code>
            </div>
          )}
        </div>
      )}

      {/* Workers Table */}
      <div className="card card-wide">
        <h2 className="card-title">
          Connected Workers ({workers.length})
        </h2>
        {workers.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Hashrate</th>
                  <th>Difficulty</th>
                  <th>Uptime</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <tr key={i}>
                    <td>
                      <span className={w.name === "not logged in" ? "text-muted" : ""}>
                        {w.name}
                      </span>
                    </td>
                    <td>
                      <code className="mono">{shortenAddress(w.address, 12)}</code>
                    </td>
                    <td className="text-right">{formatHashrate(w.hashrate)}</td>
                    <td className="text-right">{formatNumber(w.difficulty)}</td>
                    <td className="text-right">{formatDuration(w.uptime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="info-box">
            <p>No workers currently connected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
