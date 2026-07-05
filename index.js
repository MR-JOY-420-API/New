/**
 * index.js
 * -----------------------------------------
 * Entry point. Spawns JOY.js in a child process so that if the bot
 * crashes (bad appstate, network error, etc.) it can be restarted
 * automatically without needing to manually rerun `node index.js`.
 *
 * Run this file: node index.js
 */

const { spawn } = require("child_process");
const path = require("path");
const logger = require("./includes/system/logger");

const MAIN_FILE = path.join(__dirname, "JOY.js");
let restartCount = 0;
const MAX_RESTARTS = 5;

function startBot() {
  logger.info("Launcher: JOY.js প্রসেস শুরু হচ্ছে...");

  const child = spawn("node", [MAIN_FILE], {
    stdio: "inherit",
    cwd: __dirname,
  });

  child.on("exit", (code) => {
    if (code === 0) {
      logger.info("Bot স্বাভাবিকভাবে বন্ধ হয়েছে। Restart করা হচ্ছে না।");
      return;
    }

    restartCount++;
    if (restartCount > MAX_RESTARTS) {
      logger.error(`পরপর ${MAX_RESTARTS} বার crash হয়েছে। Restart বন্ধ করা হলো — JOYstate.json/config চেক করুন।`);
      return;
    }

    logger.warn(`Bot crash করেছে (exit code ${code}). ৫ সেকেন্ড পর restart হবে... (${restartCount}/${MAX_RESTARTS})`);
    setTimeout(startBot, 5000);
  });
}

startBot();
