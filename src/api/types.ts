// P2Pool Local API Types (file-based API via --data-api)

export interface NetworkStats {
  difficulty: number;
  hash: string;
  height: number;
  reward: number;
  timestamp: number;
}

export interface PoolStatistics {
  hashRate: number;
  miners: number;
  totalHashes: number;
  lastBlockFoundTime: number;
  lastBlockFound: number;
  totalBlocksFound: number;
  pplnsWeight: number;
  pplnsWindowSize: number;
  sidechainDifficulty: number;
  sidechainHeight: number;
}

export interface PoolStats {
  pool_list: string[];
  pool_statistics: PoolStatistics;
}

export interface PoolBlock {
  height: number;
  hash: string;
  difficulty: number;
  totalHashes: number;
  ts: number;
}

export interface StratumWorker {
  address: string;
  uptime: number;
  difficulty: number;
  hashrate: number;
  name: string;
}

export interface LocalStratum {
  hashrate_15m: number;
  hashrate_1h: number;
  hashrate_24h: number;
  total_hashes: number;
  total_stratum_shares: number;
  last_share_found_time: number;
  shares_found: number;
  shares_failed: number;
  average_effort: number;
  current_effort: number;
  connections: number;
  incoming_connections: number;
  block_reward_share_percent: number;
  wallet: string;
  workers: string[];
}

export interface P2PPeer {
  direction: "I" | "O";
  uptime: number;
  ping: number;
  version: string;
  sidechainHeight: number;
  address: string;
}

export interface LocalP2P {
  connections: number;
  incoming_connections: number;
  peer_list_size: number;
  peers: string[];
  uptime: number;
  zmq_last_active: number;
}

export interface StatsModConfig {
  ports: Array<{ port: number; tls: boolean }>;
  fee: number;
  minPaymentThreshold: number;
}

export interface StatsMod {
  config: StatsModConfig;
  network: { height: number };
  pool: {
    stats: { lastBlockFound: string };
    blocks: string[];
    miners: number;
    hashrate: number;
    roundHashes: number;
  };
}

// Parse worker from comma-separated string:
// "IP:PORT,UPTIME_SECS,DIFFICULTY,HASHRATE,WORKER_NAME"
export function parseWorker(raw: string): StratumWorker {
  const parts = raw.split(",");
  return {
    address: parts[0] ?? "",
    uptime: parseInt(parts[1], 10) || 0,
    difficulty: parseInt(parts[2], 10) || 0,
    hashrate: parseInt(parts[3], 10) || 0,
    name: parts.slice(4).join(",") || "unknown",
  };
}

// Parse peer from comma-separated string
export function parsePeer(raw: string): P2PPeer {
  const parts = raw.split(",");
  return {
    direction: parts[0] as "I" | "O",
    uptime: parseInt(parts[1], 10),
    ping: parseInt(parts[2], 10),
    version: parts[3],
    sidechainHeight: parseInt(parts[4], 10),
    address: parts[5],
  };
}
