export default function GettingStarted() {
  const stratumHost =
    import.meta.env.VITE_STRATUM_HOST ?? "YOUR_P2POOL_HOST";
  const stratumPort = import.meta.env.VITE_STRATUM_PORT ?? "3333";

  return (
    <div className="page">
      <div className="card card-wide">
        <h2 className="card-title">Getting Started with P2Pool Mining</h2>
        <div className="guide-content">
          <section className="guide-section">
            <h3>What is P2Pool?</h3>
            <p>
              P2Pool is a decentralized mining pool for Monero. Unlike
              traditional pools, there is no central server -- miners
              collaborate through a peer-to-peer sidechain. This means:
            </p>
            <ul>
              <li>Zero pool fees (0%)</li>
              <li>No registration required</li>
              <li>No KYC, no account, no email</li>
              <li>Trustless -- payouts are enforced by consensus</li>
              <li>Censorship resistant</li>
              <li>Supports Monero decentralization</li>
            </ul>
          </section>

          <section className="guide-section">
            <h3>Connect Your Miner</h3>
            <p>Point your XMRig (or compatible) miner to this P2Pool node:</p>
            <div className="config-block">
              <div className="config-row">
                <span className="config-label">Stratum Address</span>
                <code className="config-value">
                  {stratumHost}:{stratumPort}
                </code>
              </div>
            </div>

            <h4>XMRig Configuration</h4>
            <p>
              Add this to your <code>config.json</code> pools section or use
              command-line flags:
            </p>
            <pre className="code-block">
{`{
  "pools": [
    {
      "url": "${stratumHost}:${stratumPort}",
      "user": "YOUR_MONERO_WALLET_ADDRESS",
      "pass": "WORKER_NAME",
      "keepalive": true,
      "tls": false
    }
  ]
}`}
            </pre>

            <h4>XMRig Command Line</h4>
            <pre className="code-block">
{`xmrig -o ${stratumHost}:${stratumPort} \\
  -u YOUR_MONERO_WALLET_ADDRESS \\
  -p WORKER_NAME \\
  --keepalive`}
            </pre>
          </section>

          <section className="guide-section">
            <h3>P2Pool Variants</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Sidechain</th>
                    <th>Block Time</th>
                    <th>Min Hashrate</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="highlight">Main</span>
                    </td>
                    <td>p2pool (default)</td>
                    <td>10s</td>
                    <td>~10 KH/s+</td>
                    <td>High hashrate miners</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="highlight">Mini</span>
                    </td>
                    <td>p2pool-mini</td>
                    <td>10s</td>
                    <td>~1 KH/s+</td>
                    <td>Lower hashrate miners</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted">
              If your hashrate is below ~10 KH/s, consider using the mini
              sidechain for more frequent shares.
            </p>
          </section>

          <section className="guide-section">
            <h3>How Payouts Work</h3>
            <p>
              P2Pool uses a <strong>PPLNS (Pay Per Last N Shares)</strong>{" "}
              system on its sidechain:
            </p>
            <ol>
              <li>You submit shares to the P2Pool sidechain via your miner</li>
              <li>
                The sidechain tracks all shares in a sliding window (typically
                2160 blocks for main, 2160 for mini)
              </li>
              <li>
                When P2Pool finds a Monero block, all miners with shares in
                the current window get paid directly in the coinbase transaction
              </li>
              <li>
                Payouts go straight to your wallet -- no pool wallet involved
              </li>
            </ol>
          </section>

          <section className="guide-section">
            <h3>P2Pool Server Flags for API</h3>
            <p>
              To enable the data displayed on this dashboard, make sure your
              p2pool instance is running with these flags:
            </p>
            <pre className="code-block">
{`p2pool --host 127.0.0.1 \\
  --wallet YOUR_WALLET \\
  --data-api /path/to/api/data \\
  --local-api`}
            </pre>
            <p className="text-muted">
              <code>--data-api</code> enables the pool/network stats.{" "}
              <code>--local-api</code> additionally enables local miner/worker
              statistics and P2P connection data.
            </p>
          </section>

          <section className="guide-section">
            <h3>Useful Links</h3>
            <ul>
              <li>
                P2Pool source:{" "}
                <a
                  href="https://github.com/SChernykh/p2pool"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/SChernykh/p2pool
                </a>
              </li>
              <li>
                XMRig miner:{" "}
                <a
                  href="https://github.com/xmrig/xmrig"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/xmrig/xmrig
                </a>
              </li>
              <li>
                P2Pool Observer (main):{" "}
                <a
                  href="https://p2pool.observer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  p2pool.observer
                </a>
              </li>
              <li>
                P2Pool Observer (mini):{" "}
                <a
                  href="https://mini.p2pool.observer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mini.p2pool.observer
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
