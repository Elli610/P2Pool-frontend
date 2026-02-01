# P2Pool Monitor

A lightweight web dashboard for monitoring your Monero P2Pool node. Built with React, TypeScript, and Vite.

## Features

- **Dashboard** -- Pool hashrate, active miners, blocks found, sidechain stats, Monero network overview, your miner stats, and pool share of the network at a glance.
- **Miners** -- Your miner's hashrate (15m/1h/24h), shares, effort, reward share, connected workers table, estimated daily XMR earnings, and a profitability calculator.
- **Blocks** -- Recent blocks found by the pool with height, hash, difficulty, and timestamps. Heights and hashes link directly to a Monero block explorer.
- **Network** -- Monero mainchain stats (height, difficulty, reward, estimated network hashrate) and P2Pool sidechain details (PPLNS window, sidechain difficulty, estimated block find time).
- **Connections** -- P2P peer list with direction, address, software version, sidechain height, ping, and uptime. Overall connection summary and ZMQ status.
- **Getting Started** -- Mining setup guide with XMRig configuration examples, pool variant comparison, payout explanation, and required P2Pool flags.

Auto-refreshes every 30 seconds. Fully responsive dark theme.

## Prerequisites

- **Node.js** >= 18
- **P2Pool** running with `--data-api <path>` (and optionally `--local-api` for miner/worker/p2p stats)

## Setup

### 1. Configure P2Pool

Start your P2Pool instance with the data API enabled:

```bash
p2pool --host 127.0.0.1 --wallet YOUR_WALLET --data-api /path/to/data --local-api
```

- `--data-api` writes JSON stats files to the given directory (pool/network data).
- `--local-api` additionally enables local miner, worker, and P2P connection data.

### 2. Serve the API data

P2Pool writes JSON files to disk but doesn't serve them over HTTP. A minimal file server is included:

```bash
node serve-api.mjs /path/to/data
```

This serves the files on port 3001 (configurable via `PORT` env var). It maps requests like `/api/pool/stats` to the corresponding file on disk.

### 3. Configure the frontend

Copy the example env file and edit it:

```bash
cp .env.example .env
```

```env
# URL where serve-api.mjs (or nginx) is serving the P2Pool data files
VITE_P2POOL_API_URL=http://localhost:3001

# Shown on the Getting Started page so miners know where to connect
VITE_STRATUM_HOST=your-server-ip
VITE_STRATUM_PORT=3333

# Monero block explorer for clickable block heights/hashes
VITE_EXPLORER_URL=https://monerohash.com/explorer/
```

### 4. Install and run

```bash
npm install
npm run dev
```

### 5. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server or alongside the API via nginx.

## P2Pool API endpoints used

| Endpoint | Source | Description |
|---|---|---|
| `/api/network/stats` | `--data-api` | Monero block height, difficulty, reward |
| `/api/pool/stats` | `--data-api` | Pool hashrate, miners, blocks found, sidechain info |
| `/api/pool/blocks` | `--data-api` | Last 51 Monero blocks found by the pool |
| `/api/local/stratum` | `--local-api` | Your hashrate, shares, effort, workers |
| `/api/local/p2p` | `--local-api` | P2P connections, peers, uptime |

## License

See [LICENSE](LICENSE).
