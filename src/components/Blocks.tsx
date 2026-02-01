import { usePolling } from "../hooks/usePolling";
import { getPoolBlocks, getPoolStats, getNetworkStats } from "../api/p2pool";
import StatusBar from "./StatusBar";
import {
  formatNumber,
  formatDifficulty,
  formatTimeAgo,
  formatDate,
  shortenHash,
  formatHashrate,
  formatXMR,
} from "../utils/formatters";

const explorerUrl = (import.meta.env.VITE_EXPLORER_URL ?? "").replace(/\/+$/, "");

export default function Blocks() {
  const blocks = usePolling(getPoolBlocks);
  const pool = usePolling(getPoolStats);
  const network = usePolling(getNetworkStats);

  const refresh = () => {
    blocks.refresh();
    pool.refresh();
    network.refresh();
  };

  return (
    <div className="page">
      <StatusBar
        lastUpdated={blocks.lastUpdated}
        loading={blocks.loading}
        error={blocks.error}
        onRefresh={refresh}
      />

      {/* Block Finding Stats */}
      {pool.data && network.data && (
        <div className="card card-wide">
          <h2 className="card-title">Block Finding Statistics</h2>
          <div className="stat-grid">
            <div className="stat">
              <span className="stat-label">Total Blocks Found</span>
              <span className="stat-value highlight">
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
              <span className="stat-label">Last Block Height</span>
              <span className="stat-value">
                {formatNumber(pool.data.pool_statistics.lastBlockFound)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Current Block Reward</span>
              <span className="stat-value">
                {formatXMR(network.data.reward)} XMR
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Pool Hashrate</span>
              <span className="stat-value">
                {formatHashrate(pool.data.pool_statistics.hashRate)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Blocks Table */}
      <div className="card card-wide">
        <h2 className="card-title">
          Recent Blocks Found
          {blocks.data && ` (${blocks.data.length})`}
        </h2>
        {blocks.data && blocks.data.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Height</th>
                  <th>Hash</th>
                  <th>Difficulty</th>
                  <th>Time Found</th>
                  <th>Time Ago</th>
                </tr>
              </thead>
              <tbody>
                {blocks.data.map((block) => (
                  <tr key={block.hash}>
                    <td>
                      {explorerUrl ? (
                        <a
                          className="explorer-link highlight"
                          href={`${explorerUrl}/block/${block.height}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formatNumber(block.height)}
                        </a>
                      ) : (
                        <span className="highlight">
                          {formatNumber(block.height)}
                        </span>
                      )}
                    </td>
                    <td>
                      {explorerUrl ? (
                        <a
                          className="explorer-link mono"
                          href={`${explorerUrl}/block/${block.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {shortenHash(block.hash, 10)}
                        </a>
                      ) : (
                        <code className="mono">{shortenHash(block.hash, 10)}</code>
                      )}
                    </td>
                    <td className="text-right">
                      {formatDifficulty(block.difficulty)}
                    </td>
                    <td>{formatDate(block.ts)}</td>
                    <td>{formatTimeAgo(block.ts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : blocks.loading ? (
          <div className="loading-placeholder">Loading blocks...</div>
        ) : (
          <div className="info-box">
            <p>No blocks found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
