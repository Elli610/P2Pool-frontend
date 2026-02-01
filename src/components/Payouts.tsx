import { useState, useEffect, useCallback, useRef } from "react";
import { getPayouts, getLocalStratum } from "../api/p2pool";
import type { Payout } from "../api/types";
import StatusBar from "./StatusBar";
import {
  formatXMR,
  formatDate,
  formatTimeAgo,
  formatNumber,
  shortenHash,
} from "../utils/formatters";

const observerUrl = (import.meta.env.VITE_OBSERVER_URL ?? "").replace(/\/+$/, "");
const explorerUrl = (import.meta.env.VITE_EXPLORER_URL ?? "").replace(/\/+$/, "");

export default function Payouts() {
  const [address, setAddress] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const initializedRef = useRef(false);

  // Auto-fill wallet address from local stratum
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    getLocalStratum()
      .then((data) => {
        if (data.wallet) {
          setAddress(data.wallet);
          setAddressInput(data.wallet);
        }
      })
      .catch(() => {});
  }, []);

  const fetchPayouts = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPayouts(address);
      setPayouts(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch payouts");
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Fetch when address is set/changed
  useEffect(() => {
    if (address) fetchPayouts();
  }, [address, fetchPayouts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = addressInput.trim();
    if (trimmed) setAddress(trimmed);
  };

  const totalReceived = payouts.reduce((sum, p) => sum + p.coinbase_reward, 0);

  if (!observerUrl) {
    return (
      <div className="page">
        <div className="card">
          <h2 className="card-title">Payouts</h2>
          <div className="info-box">
            <p>P2Pool Observer URL is not configured.</p>
            <p className="text-muted">
              Set <code>VITE_OBSERVER_URL</code> in your <code>.env</code> file
              (e.g. <code>https://mini.p2pool.observer</code>) and rebuild.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <StatusBar
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        onRefresh={fetchPayouts}
      />

      {/* Address Input */}
      <div className="card card-wide">
        <h2 className="card-title">Payout History</h2>
        <form className="address-form" onSubmit={handleSubmit}>
          <input
            className="address-input"
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Enter your Monero wallet address"
          />
          <button className="btn-lookup" type="submit" disabled={loading || !addressInput.trim()}>
            Lookup
          </button>
        </form>
      </div>

      {/* Summary */}
      {payouts.length > 0 && (
        <div className="card card-wide">
          <h2 className="card-title">Summary</h2>
          <div className="stat-grid">
            <div className="stat">
              <span className="stat-label">Total Payouts</span>
              <span className="stat-value highlight">
                {payouts.length}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Received</span>
              <span className="stat-value highlight">
                {formatXMR(totalReceived)} XMR
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Latest Payout</span>
              <span className="stat-value">
                {formatTimeAgo(payouts[0].timestamp)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Oldest Payout Shown</span>
              <span className="stat-value">
                {formatTimeAgo(payouts[payouts.length - 1].timestamp)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Payouts Table */}
      <div className="card card-wide">
        <h2 className="card-title">
          Payouts {payouts.length > 0 && `(${payouts.length})`}
        </h2>
        {payouts.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Ago</th>
                  <th>Amount</th>
                  <th>Block Height</th>
                  <th>Coinbase TX</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p, i) => (
                  <tr key={i}>
                    <td>{formatDate(p.timestamp)}</td>
                    <td>{formatTimeAgo(p.timestamp)}</td>
                    <td className="text-right mono">
                      <span className="highlight">
                        {formatXMR(p.coinbase_reward)} XMR
                      </span>
                    </td>
                    <td>
                      {explorerUrl ? (
                        <a
                          className="explorer-link highlight"
                          href={`${explorerUrl}/block/${p.main_height}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formatNumber(p.main_height)}
                        </a>
                      ) : (
                        <span className="highlight">
                          {formatNumber(p.main_height)}
                        </span>
                      )}
                    </td>
                    <td>
                      {explorerUrl ? (
                        <a
                          className="explorer-link mono"
                          href={`${explorerUrl}/tx/${p.coinbase_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {shortenHash(p.coinbase_id, 10)}
                        </a>
                      ) : (
                        <code className="mono">
                          {shortenHash(p.coinbase_id, 10)}
                        </code>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : address && !loading ? (
          <div className="info-box">
            <p>No payouts found for this address.</p>
          </div>
        ) : !address ? (
          <div className="info-box">
            <p>Enter your wallet address above to view payout history.</p>
          </div>
        ) : (
          <div className="loading-placeholder">Loading payouts...</div>
        )}
      </div>
    </div>
  );
}
