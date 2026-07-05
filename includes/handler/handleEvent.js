/**
 * includes/handler/handleEvent.js
 * Dispatches raw mqtt events (log:subscribe, presence, reactions, etc.)
 * to every event module that listens for that event type.
 */

const logger = require("../system/logger");

function createEventHandler({ api, events, config }) {
  return async function handleEvent(event) {
    for (const evt of events) {
      const wantedTypes = Array.isArray(evt.config.type)
        ? evt.config.type
        : [evt.config.type];

      if (!wantedTypes.includes(event.type) && !wantedTypes.includes("all")) continue;

      try {
        await evt.run({ api, event, config });
      } catch (err) {
        logger.error(`Event "${evt.config.name}" চালাতে গিয়ে error: ${err.message}`);
      }
    }
  };
}

module.exports = { createEventHandler };
