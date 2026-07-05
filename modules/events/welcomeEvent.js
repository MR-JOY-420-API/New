module.exports = {
  config: {
    name: "welcomeEvent",
    type: "event", // fires on log:subscribe (member added)
  },

  run: async ({ api, event, config }) => {
    if (!config.welcomeEventEnabled) return;
    if (event.logMessageType !== "log:subscribe") return;

    const addedIDs = event.logMessageData.addedParticipants.map((u) => u.userFbId);

    for (const id of addedIDs) {
      if (id === api.getCurrentUserID()) continue; // skip if bot itself was added
      api.sendMessage(`👋 স্বাগতম গ্রুপে! ভালো থাকুন সবাই।`, event.threadID, undefined, id);
    }
  },
};
