const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const markerFile = path.join(__dirname, "../.next-built");

console.log("--- Starting Vercel Build Script ---");

// 1. Run prisma generate to ensure client is ready for both build phases
console.log("Generating Prisma Client...");
try {
  execSync("npx prisma generate", { stdio: "inherit" });
} catch (error) {
  console.error("Prisma client generation failed:", error);
  process.exit(1);
}

// 2. Run next build only if it hasn't been completed yet in this build session
if (fs.existsSync(markerFile)) {
  console.log("Next.js build marker found. Next.js build already completed. Skipping 'next build'.");
} else {
  console.log("Next.js build marker not found. Running 'next build'...");
  try {
    execSync("next build", { stdio: "inherit" });
    fs.writeFileSync(markerFile, "true");
    console.log("Next.js build succeeded and marker created.");
  } catch (error) {
    console.error("Next.js build failed:", error);
    process.exit(1);
  }
}

console.log("--- Vercel Build Script Completed ---");
