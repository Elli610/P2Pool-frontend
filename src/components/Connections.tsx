import { usePolling } from "../hooks/usePolling";
import { getLocalP2P } from "../api/p2pool";
import { parsePeer } from "../api/types";
import StatusBar from "./StatusBar";
import { formatDuration, formatNumber } from "../utils/formatters";

export default function Connections() {
  const p2p = usePolling(getLocalP2P);

  const peers = p2p.data?.peers.map(parsePeer) ?? [];
  const outgoing = peers.filter((p) => p.direction === "O");
  const incoming = peers.filter((p) => p.direction === "I");

  if (p2p.error) {
    return (
      <div className="page">
        <StatusBar
          lastUpdated={null}
          loading={false}
          error={p2p.error}
          onRefresh={p2p.refresh}
        />
        <div className="card">
          <h2 className="card-title">P2P Connections</h2>
          <div className="info-box">
            <p>P2P connection data is not available.</p>
            <p className="text-muted">
              Make sure p2pool is started with <code>--data-api &lt;path&gt;</code>{" "}
              and <code>--local-api</code> flags.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <StatusBar
        lastUpdated={p2p.lastUpdated}
        loading={p2p.loading}
        error={p2p.error}
        onRefresh={p2p.refresh}
      />

      {/* P2P Summary */}
      {p2p.data && (
        <div className="card card-wide">
          <h2 className="card-title">P2P Network Summary</h2>
          <div className="stat-grid">
            <div className="stat">
              <span className="stat-label">Total Connections</span>
              <span className="stat-value highlight">
                {p2p.data.connections}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Incoming</span>
              <span className="stat-value">{p2p.data.incoming_connections}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Outgoing</span>
              <span className="stat-value">
                {p2p.data.connections - p2p.data.incoming_connections}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Known Peers</span>
              <span className="stat-value">
                {formatNumber(p2p.data.peer_list_size)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">P2Pool Uptime</span>
              <span className="stat-value">
                {formatDuration(p2p.data.uptime)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">ZMQ Last Active</span>
              <span className="stat-value">
                {p2p.data.zmq_last_active}s ago
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Peers Table */}
      <div className="card card-wide">
        <h2 className="card-title">Connected Peers ({peers.length})</h2>
        {peers.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Direction</th>
                  <th>Address</th>
                  <th>Version</th>
                  <th>Sidechain Height</th>
                  <th>Ping</th>
                  <th>Uptime</th>
                </tr>
              </thead>
              <tbody>
                {/* Outgoing first */}
                {outgoing.map((peer, i) => (
                  <tr key={`o-${i}`}>
                    <td>
                      <span className="badge badge-out">OUT</span>
                    </td>
                    <td>
                      <code className="mono">{peer.address}</code>
                    </td>
                    <td>{peer.version}</td>
                    <td className="text-right">
                      {formatNumber(peer.sidechainHeight)}
                    </td>
                    <td className="text-right">{peer.ping}ms</td>
                    <td className="text-right">{formatDuration(peer.uptime)}</td>
                  </tr>
                ))}
                {incoming.map((peer, i) => (
                  <tr key={`i-${i}`}>
                    <td>
                      <span className="badge badge-in">IN</span>
                    </td>
                    <td>
                      <code className="mono">{peer.address}</code>
                    </td>
                    <td>{peer.version}</td>
                    <td className="text-right">
                      {formatNumber(peer.sidechainHeight)}
                    </td>
                    <td className="text-right">{peer.ping}ms</td>
                    <td className="text-right">{formatDuration(peer.uptime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="loading-placeholder">Loading peer data...</div>
        )}
      </div>
    </div>
  );
}
