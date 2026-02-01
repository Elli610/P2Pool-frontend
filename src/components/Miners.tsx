import { useState, useEffect } from "react";
import { usePolling } from "../hooks/usePolling";
import { getLocalStratum, getNetworkStats } from "../api/p2pool";
import { parseWorker } from "../api/types";
import StatusBar from "./StatusBar";
import {
  formatHashrate,
  formatDuration,
  formatNumber,
  formatEffort,
  formatPercent,
  formatTimeAgo,
  formatXMR,
  shortenAddress,
} from "../utils/formatters";

const BLOCK_TIME = 120; // Monero target block time in seconds
const BLOCKS_PER_DAY = 86400 / BLOCK_TIME;

function estimateXMR(hashrate: number, networkDifficulty: number, blockReward: number): number {
  if (hashrate <= 0 || networkDifficulty <= 0) return 0;
  const networkHashrate = networkDifficulty / BLOCK_TIME;
  return (hashrate / networkHashrate) * BLOCKS_PER_DAY * (blockReward / 1e12);
}

export default function Miners() {
  const stratum = usePolling(getLocalStratum);
  const network = usePolling(getNetworkStats);

  const [calcHashrate, setCalcHashrate] = useState("");
  const [calcInitialized, setCalcInitialized] = useState(false);

  // Set default calculator hashrate from current miner hashrate (once)
  useEffect(() => {
    if (!calcInitialized && stratum.data && stratum.data.hashrate_1h > 0) {
      setCalcHashrate(String(stratum.data.hashrate_1h));
      setCalcInitialized(true);
    }
  }, [stratum.data, calcInitialized]);

  const refresh = () => {
    stratum.refresh();
    network.refresh();
  };

  if (stratum.error) {
    return (
      <div className="page">
        <StatusBar
          lastUpdated={null}
          loading={false}
          error={stratum.error}
          onRefresh={refresh}
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

  const dailyXMR =
    stratum.data && network.data
      ? estimateXMR(stratum.data.hashrate_1h, network.data.difficulty, network.data.reward)
      : 0;

  // Calculator
  const calcH = Number(calcHashrate) || 0;
  const calcDaily =
    network.data ? estimateXMR(calcH, network.data.difficulty, network.data.reward) : 0;

  return (
    <div className="page">
      <StatusBar
        lastUpdated={stratum.lastUpdated}
        loading={stratum.loading || network.loading}
        error={stratum.error || network.error}
        onRefresh={refresh}
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
              <span className="stat-label">Est. Daily Earnings</span>
              <span className="stat-value highlight">
                {formatXMR(dailyXMR * 1e12)} XMR
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

      {/* Profitability Calculator */}
      <div className="card card-wide">
        <h2 className="card-title">Profitability Calculator</h2>
        <div className="calc-input-row">
          <label className="stat-label" htmlFor="calc-hashrate">Hashrate (H/s)</label>
          <input
            id="calc-hashrate"
            className="calc-input"
            type="number"
            min="0"
            value={calcHashrate}
            onChange={(e) => setCalcHashrate(e.target.value)}
            placeholder="Enter hashrate in H/s"
          />
          <span className="calc-input-hint">{formatHashrate(calcH)}</span>
        </div>
        {network.data ? (
          <div className="calc-results">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Est. XMR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 Day</td>
                  <td className="text-right mono">
                    <span className="highlight">{(calcDaily).toFixed(8)} XMR</span>
                  </td>
                </tr>
                <tr>
                  <td>1 Week</td>
                  <td className="text-right mono">
                    <span className="highlight">{(calcDaily * 7).toFixed(8)} XMR</span>
                  </td>
                </tr>
                <tr>
                  <td>1 Month</td>
                  <td className="text-right mono">
                    <span className="highlight">{(calcDaily * 30).toFixed(8)} XMR</span>
                  </td>
                </tr>
                <tr>
                  <td>1 Year</td>
                  <td className="text-right mono">
                    <span className="highlight">{(calcDaily * 365).toFixed(8)} XMR</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-muted calc-disclaimer">
              Estimates based on current network difficulty ({formatNumber(network.data.difficulty)})
              and block reward ({formatXMR(network.data.reward)} XMR). Actual results will vary
              as difficulty and reward change over time.
            </p>
          </div>
        ) : (
          <div className="loading-placeholder">Loading network data...</div>
        )}
      </div>

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
