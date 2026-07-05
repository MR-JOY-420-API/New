/**
 * includes/handler/handleCommand.js
 * Parses incoming message text, extracts prefix + command name + args,
 * and runs the matching command module.
 */

const logger = require("../system/logger");

function createCommandHandler({ api, commands, config }) {
  return async function handleCommand(event) {
    if (event.type !== "message" && event.type !== "message_reply") return;

    const body = (event.body || "").trim();
    if (!body) return;

    const prefix = config.prefix || "/";
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    if (!commandName) return;

    const command = commands.get(commandName);
    if (!command) return;

    // Admin-only bot mode
    if (config.adminOnlyMode && !config.admins.includes(event.senderID)) {
      return api.sendMessage("⚠️ এই মুহূর্তে শুধু admin রা কমান্ড ব্যবহার করতে পারবে।", event.threadID);
    }

    // Per-command admin restriction
    if (command.config.adminOnly && !config.admins.includes(event.senderID)) {
      return api.sendMessage("⛔ এই command শুধুমাত্র admin দের জন্য।", event.threadID);
    }

    if (config.logCommandsToConsole) {
      logger.command(`${event.senderID} -> ${prefix}${commandName} ${args.join(" ")}`);
    }

    try {
      await command.run({ api, event, args, config, commands });
    } catch (err) {
      logger.error(`Command "${commandName}" চালাতে গিয়ে error: ${err.message}`);
      api.sendMessage("❌ কমান্ড চালাতে গিয়ে একটা error হয়েছে।", event.threadID);
    }
  };
}

module.exports = { createCommandHandler };
