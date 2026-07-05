/**
 * update.js
 * -----------------------------------------
 * Simple version/update checker for JOY bot.
 * Run manually with: node update.js
 * It compares package.json version with update.json,
 * and lets you bump the version + add a changelog entry.
 */

const fs = require("fs");
const path = require("path");

const pkgPath = path.join(__dirname, "package.json");
const updatePath = path.join(__dirname, "update.json");

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

function main() {
  const pkg = loadJSON(pkgPath);
  const update = loadJSON(updatePath);

  console.log("========================================");
  console.log(" JOY BOT - UPDATE CHECKER");
  console.log("========================================");
  console.log(`package.json version : ${pkg.version}`);
  console.log(`update.json version  : ${update.version}`);
  console.log(`last update           : ${update.lastUpdate}`);

  if (pkg.version !== update.version) {
    console.log("\n⚠️  Version mismatch detected between package.json and update.json.");
    console.log("Syncing update.json to match package.json...");
    update.version = pkg.version;
    update.lastUpdate = new Date().toISOString().split("T")[0];
    saveJSON(updatePath, update);
    console.log("✅ update.json synced.");
  } else {
    console.log("\n✅ Versions are in sync. No update needed.");
  }

  // Optional: pass a changelog message via CLI, e.g.
  // node update.js "Added new ping command"
  const note = process.argv[2];
  if (note) {
    update.changelog.push(note);
    saveJSON(updatePath, update);
    console.log(`📝 Changelog entry added: "${note}"`);
  }
}

main();
