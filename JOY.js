/**
 * JOY.js
 * -----------------------------------------
 * Main bot bootstrap. This file:
 *   1. Loads JOY.json config
 *   2. Logs in to Facebook using JOYstate.json cookies
 *   3. Loads commands + events from /modules
 *   4. Starts listening for incoming messages/events
 */

const fs = require("fs");
const path = require("path");

const logger = require("./includes/system/logger");
const { loginWithState } = require("./includes/system/login");
const { loadCommands, loadEvents } = require("./includes/controllers/loadModules");
const { createCommandHandler } = require("./includes/handler/handleCommand");
const { createEventHandler } = require("./includes/handler/handleEvent");

const CONFIG_PATH = path.join(__dirname, "JOY.json");

async function start() {
  logger.info("JOY bot চালু হচ্ছে...");

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

  let api;
  try {
    api = await loginWithState();
  } catch (err) {
    logger.error(err.message);
    process.exit(1); // let index.js decide whether to restart
  }

  logger.success(`লগইন সফল! Bot ID: ${api.getCurrentUserID()}`);

  const commands = loadCommands();
  const events = loadEvents();

  const handleCommand = createCommandHandler({ api, commands, config });
  const handleEvent = createEventHandler({ api, events, config });

  api.listenMqtt((err, event) => {
    if (err) {
      logger.error("Listen error: " + err.message);
      return;
    }

    if (event.type === "message" || event.type === "message_reply") {
      handleCommand(event);
    } else {
      handleEvent(event);
    }
  });

  logger.success(`${config.botName} বট চালু হয়ে গেছে এবং message শোনার জন্য প্রস্তুত। Prefix: "${config.prefix}"`);
}

start();
