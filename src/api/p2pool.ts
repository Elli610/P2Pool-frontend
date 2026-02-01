import type {
  NetworkStats,
  PoolStats,
  PoolBlock,
  LocalStratum,
  LocalP2P,
  Payout,
} from "./types";

const BASE_URL = import.meta.env.VITE_P2POOL_API_URL ?? "";
const OBSERVER_URL = (import.meta.env.VITE_OBSERVER_URL ?? "").replace(/\/+$/, "");

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

export async function getNetworkStats(): Promise<NetworkStats> {
  return fetchJson<NetworkStats>("/api/network/stats");
}

export async function getPoolStats(): Promise<PoolStats> {
  return fetchJson<PoolStats>("/api/pool/stats");
}

export async function getPoolBlocks(): Promise<PoolBlock[]> {
  return fetchJson<PoolBlock[]>("/api/pool/blocks");
}

export async function getLocalStratum(): Promise<LocalStratum> {
  return fetchJson<LocalStratum>("/api/local/stratum");
}

export async function getLocalP2P(): Promise<LocalP2P> {
  return fetchJson<LocalP2P>("/api/local/p2p");
}

export async function getPayouts(address: string, limit = 50): Promise<Payout[]> {
  if (!OBSERVER_URL || !address) return [];
  const res = await fetch(`${OBSERVER_URL}/api/payouts/${address}?search_limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Observer API error ${res.status}`);
  }
  return res.json();
}
