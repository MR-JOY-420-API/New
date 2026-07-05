/**
 * includes/controllers/loadModules.js
 * Dynamically loads every command and event file from /modules
 * so you never have to manually require() new commands.
 */

const fs = require("fs");
const path = require("path");
const logger = require("../system/logger");

const COMMANDS_DIR = path.join(__dirname, "..", "..", "modules", "commands");
const EVENTS_DIR = path.join(__dirname, "..", "..", "modules", "events");

function loadCommands() {
  const commands = new Map();

  if (!fs.existsSync(COMMANDS_DIR)) return commands;

  const files = fs.readdirSync(COMMANDS_DIR).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(COMMANDS_DIR, file))];
      const cmd = require(path.join(COMMANDS_DIR, file));

      if (!cmd.config || !cmd.config.name || typeof cmd.run !== "function") {
        logger.warn(`Command "${file}" স্কিপ করা হলো (config.name বা run() নাই)।`);
        continue;
      }

      commands.set(cmd.config.name.toLowerCase(), cmd);

      // register aliases if provided
      if (Array.isArray(cmd.config.aliases)) {
        for (const alias of cmd.config.aliases) {
          commands.set(alias.toLowerCase(), cmd);
        }
      }
    } catch (err) {
      logger.error(`Command "${file}" লোড করতে সমস্যা: ${err.message}`);
    }
  }

  logger.success(`${files.length}টি command file থেকে ${commands.size}টি command লোড হয়েছে।`);
  return commands;
}

function loadEvents() {
  const events = [];

  if (!fs.existsSync(EVENTS_DIR)) return events;

  const files = fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    try {
      delete require.cache[require.resolve(path.join(EVENTS_DIR, file))];
      const evt = require(path.join(EVENTS_DIR, file));

      if (!evt.config || typeof evt.run !== "function") {
        logger.warn(`Event "${file}" স্কিপ করা হলো (config বা run() নাই)।`);
        continue;
      }

      events.push(evt);
    } catch (err) {
      logger.error(`Event "${file}" লোড করতে সমস্যা: ${err.message}`);
    }
  }

  logger.success(`${events.length}টি event মডিউল লোড হয়েছে।`);
  return events;
}

module.exports = { loadCommands, loadEvents };
