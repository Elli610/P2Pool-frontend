function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function formatHashrate(h: unknown): string {
  const v = num(h);
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)} TH/s`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} GH/s`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)} MH/s`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(2)} KH/s`;
  return `${v.toFixed(0)} H/s`;
}

export function formatDifficulty(d: unknown): string {
  const v = num(d);
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)} T`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} G`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)} M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(2)} K`;
  return v.toFixed(0);
}

export function formatXMR(atomicUnits: unknown): string {
  return (num(atomicUnits) / 1e12).toFixed(6);
}

export function formatNumber(n: unknown): string {
  return num(n).toLocaleString();
}

export function formatDuration(seconds: unknown): string {
  const total = num(seconds);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);

  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatTimeAgo(timestamp: unknown): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - num(timestamp);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function formatDate(timestamp: unknown): string {
  return new Date(num(timestamp) * 1000).toLocaleString();
}

export function shortenHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function shortenAddress(addr: string, chars = 8): string {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function formatPercent(value: unknown): string {
  return `${num(value).toFixed(2)}%`;
}

export function formatEffort(value: unknown): string {
  return `${num(value).toFixed(1)}%`;
}
