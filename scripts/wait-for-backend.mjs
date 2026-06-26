import http from "node:http";
import { spawn, execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const INTERVAL = 500;
const MAX_ATTEMPTS = 60;
let attempts = 0;
let started = false;

function poll() {
  if (started) return;
  if (attempts++ >= MAX_ATTEMPTS) {
    console.error("Backend failed to start within 30s");
    process.exit(1);
  }

  const req = http.get("http://localhost:5050/api/health", (res) => {
    if (res.statusCode === 200 && !started) {
      started = true;
      try {
        execSync("lsof -ti:3000 | xargs -r kill -9 2>/dev/null", { stdio: "ignore" });
        execSync("ps aux | grep 'next-server' | grep -v grep | awk '{print $2}' | xargs -r kill -9 2>/dev/null", { stdio: "ignore" });
      } catch {}
      try {
        rmSync(resolve(".next", "dev", "logs"), { recursive: true, force: true });
      } catch {}
      const child = spawn("npm", ["run", "dev:frontend"], {
        stdio: "inherit",
        shell: true,
      });
      child.on("exit", (code) => process.exit(code ?? 0));
      return;
    }
    if (!started) setTimeout(poll, INTERVAL);
  });

  req.on("error", () => { if (!started) setTimeout(poll, INTERVAL); });
  req.setTimeout(2000, () => {
    req.destroy();
    if (!started) setTimeout(poll, INTERVAL);
  });
}

poll();
