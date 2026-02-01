import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Path where p2pool writes its data-api files
// Usage: node serve-api.mjs /path/to/p2pool/data-api
const dataDir = process.argv[2];
const port = process.env.PORT || 3001;

if (!dataDir) {
  console.error("Usage: node serve-api.mjs /path/to/p2pool/data-api");
  console.error("");
  console.error("This is the directory you passed to p2pool's --data-api flag.");
  process.exit(1);
}

const server = createServer(async (req, res) => {
  // CORS headers so the frontend can fetch from a different port
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  // Strip /api prefix if present, so /api/pool/stats -> pool/stats
  const path = req.url.replace(/^\/api/, "").replace(/^\//, "");

  if (!path) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", endpoints: [
      "/api/network/stats",
      "/api/pool/stats",
      "/api/pool/blocks",
      "/api/local/stratum",
      "/api/local/p2p",
      "/api/stats_mod",
    ]}));
    return;
  }

  // Prevent path traversal
  if (path.includes("..")) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  const filePath = join(dataDir, path);

  try {
    const data = await readFile(filePath, "utf-8");
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found", path }));
  }
});

server.listen(port, () => {
  console.log(`Serving p2pool data from: ${dataDir}`);
  console.log(`Listening on: http://localhost:${port}`);
  console.log("");
  console.log("Endpoints:");
  console.log(`  http://localhost:${port}/api/pool/stats`);
  console.log(`  http://localhost:${port}/api/network/stats`);
  console.log(`  http://localhost:${port}/api/pool/blocks`);
  console.log(`  http://localhost:${port}/api/local/stratum`);
  console.log(`  http://localhost:${port}/api/local/p2p`);
});
